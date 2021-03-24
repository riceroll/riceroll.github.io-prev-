
/**
 * Created by Roll on 2021/3/2.
 */

class Optimizer {

    constructor(model) {
        this.model = model;
        this.interval = 0.35 / 4;
        this.space = [0, this.interval, this.interval*2, this.interval*3, this.interval*4];
        this.x = {
            'maxContraction': [],
            'edgeChannel': [],
            'script': []
        };
        this.actuating = 0;

        this.nActions = 4;
        this.nStepsTest = this.nActions * this.model.Model.numStepsAction;
        this.nChannels = 2;

        this.getEnergy = null;
    }

    annealing = function ({
                              initialState,
                              tempMax,
                              tempMin,
                              newState,
                              getTemp,
                              getEnergy,
                          } = {}) {
        if (!this.isFunction(newState)) {
            throw new Error('newState is not function.');
        }
        if (!this.isFunction(getTemp)) {
            throw new Error('getTemp is not function.');
        }
        if (!this.isFunction(getEnergy)) {
            throw new Error('getEnergy is not function.');
        }

        let currentTemp = tempMax;

        let lastState = initialState;
        let lastEnergy = getEnergy(lastState);

        let bestState = lastState;
        let bestEnergy = lastEnergy;

        let maxIter = 20000;
        let iter = 0;
        // while (currentTemp > tempMin) {
        while (iter < maxIter) {
            iter += 1;
            if (iter > maxIter) break;
            let currentState = newState(lastState);
            let currentEnergy = getEnergy(currentState);

            if (currentEnergy < lastEnergy) {
                lastState = currentState;
                lastEnergy = currentEnergy;
            } else {
                if (Math.random() <= Math.exp(-(currentEnergy - lastEnergy)/currentTemp)) {
                    lastState = currentState;
                    lastEnergy = currentEnergy;
                }
            }

            if (bestEnergy > lastEnergy) {
                bestState = lastState;
                bestEnergy = lastEnergy;
            }
            currentTemp = getTemp(currentTemp);
        }
        return bestState;
    };

    isFunction = function(functionToCheck) {
        return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
    };

    optimize() {
        let getEnergy = (x) => {
            // this.model.loadData(this.model.v0, this.model.e, this.model.faces, this.model.polytopes,
            //     null, x.maxContraction, null, x.edgeChannel, null, x.script);

            this.model.iAction = 0;
            this.model.numSteps = 0;

            model.resetV();
            model.simulate = true;
            model.step(Math.floor(optimizer.nStepsTest), false);
            model.step(Math.floor(optimizer.nStepsTest));
            model.simulate = false;

            let center = this.model.centroid();
            console.log(center.x);
            return center.x;
        };

        this.getEnergy = getEnergy;

        let newState = (x) => {
            let nBeams = Math.floor(Math.random() * (x.maxContraction.length - 1e-5)) + 1;

            for (let iRand=0; iRand < nBeams; iRand++) {
                let iBeam = Math.floor(Math.random() * (x.maxContraction.length - 1e-5));
                x.maxContraction[iBeam] = this.space[Math.floor(Math.random() * (this.space.length - 1e-5))];
                x.edgeChannel[iBeam] = Math.floor(Math.random() * (this.nChannels - 1e-5));
            }

            let nAction = Math.floor(Math.random() * (x.script.length - 1e-5)) + 1;

            for (let iRand=0; iRand < nAction; iRand++) {
                let iAction = Math.floor(Math.random() * (x.script.length - 1e-5));
                let iChannel = Math.floor(Math.random() * (this.nChannels - 1e-5));
                x.script[iAction][iChannel] = Math.floor(Math.random() * 1.99999);
            }

            return x;
        };

        let getTemp = (tmp) => {
            return tmp - 0.001;
        };

        this.x.maxContraction = this.model.maxContraction;
        this.x.edgeChannel = this.model.edgeChannel;
        this.x.script = new Array(this.nActions);
        for (let i=0; i<this.x.script.length; i++) {
            this.x.script[i] = new Array(this.nChannels);
            this.x.script[i].fill(1);
        }

        let initialState = this.x;
        let tempMax = 15;
        let tempMin = 0.001;


        let result = this.annealing({
            initialState : initialState,
            tempMax : tempMax,
            tempMin : tempMin,
            newState : newState,
            getTemp : getTemp,
            getEnergy : getEnergy
        });

        console.log(result);
        this.x = result;
        let x = this.x;

        this.model.loadData(this.model.v0, this.model.e, this.model.faces, this.model.polytopes,
            null, x.maxContraction, null, x.edgeChannel, null, x.script);

    }


}


export{Optimizer};