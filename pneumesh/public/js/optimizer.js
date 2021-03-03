import { Genetic } from '../../node_modules/genetic-js/lib/genetic.js';


/**
 * Created by Roll on 2021/3/2.
 */



class Optimizer {

    constructor(model) {
        this.model = model;

        this.config = {
            "iterations": 500,
            "size": 50,
            "crossover": 0.5,
            "mutation": 0.5,
            "skip": 10
        };

        this.userData = {
            "x" : this.model.maxContraction,
        };

        let interval = 0.35 / 4;
        this.space = [0, interval, interval*2, interval*3, interval*4];

        this.genetic = Genetic.create();

        this.genetic.optimize = Genetic.Optimize.Minimize;
        this.genetic.select1 = Genetic.Select1.Tournament2;
        this.genetic.select2 = Genetic.Select2.FittestRandom;

        this.randomConstraint = () => {
            return Math.floor(Math.random() * (this.space.length - 1e-5));
        };

        this.genetic.seed = () => {

            let x = this.model.maxContraction;
            for (let i = 0; i < x.length; i++) {
                let j = this.randomConstraint();
                x[i] = this.space[j];

            }
            return x ;
        };

        this.genetic.mutate = (x) => {
            let i = Math.floor(Math.random() * x.length);
            x[i] = this.randomConstraint();
            return x;
        };

        this.genetic.crossover = (x0, x1) => {
            let i = Math.floor(Math.random() * x0.length);
            [x0[i], x1[i]] = [x1[i], x0[i]];
            return [x0, x1];
        };

        this.genetic.fitness = (x) => {
            this.model.resetV();
            this.model.constraints = x;
            this.model.step(400, true);
            let center = this.model.centroid();
            let sum = 0;
            x.forEach((i)=>sum+=i);
            return center.x + sum / x.length;
        };

        this.genetic.generation = (pop, generation, stats) => {

        };

        this.genetic.notification = (pop, generation, stats, isFinished) => {
            console.log("stats: ", stats);
        };
    }

    evolve = () => {
        this.genetic.evolve(this.config, this.userData);
    }




}
export{Optimizer};