import * as thre from '../../node_modules/three/build/three.module.js';

class Vertex {
    static all = [];

    constructor(pos, fixed, pos0, vel, force) {
        this.pos = pos;     // thre.Vector3
        this.fixed = fixed;
        this.pos0 = pos0;
        this.vel = vel;
        this.force =force;

        this.id = Vertex.all.length;
        Vertex.all.push(this);
    }

    // add vertices cited by faces
    static updateCitedVertices() {
        let vs = [];
        for (let f of Face.all) {
            vs = vs.concat(f.vs);
        }
        let vsSet = new Set();
        vs.forEach(v => vsSet.add(v));
        Vertex.all = Array.from(vsSet);
    }

}

class Edge {
    static all = [];

    constructor(vs, lMax, maxContraction, edgeChannel, edgeActive, l) {
        this.vs = [];
        this.lMax = lMax;
        this.maxContraction = maxContraction;
        this.edgeChannel = edgeChannel;
        this.edgeActive = edgeActive;
        this.l = l;

        for (let iv of vs) {
            this.vs.push(Vertex.all[iv]);
        }

        this.id = Edge.all.length;
        Edge.all.push(this);
    }

    // keep edges with face citing them
    static updateCitedEdges() {
        let edges = Face.citedEdges();

        let es = [];
        for (let e of Edge.all) {
            let v0 = e.vs[0];
            let v1 = e.vs[1];
            for (let edge of edges) {
                if ((edge[0] === v0 && edge[1] === v1) || (edge[1] === v0 && edge[0] === v1)) {
                    es.push(e);
                    break;
                }
            }
        }
        Edge.all = es;
    }

}

class Face {
    static all = [];

    constructor(vs) {
        this.vs = [];
        for (let iv of vs) {
            this.vs.push(Vertex.all[iv]);
        }

        this.id = Face.all.length;
        Face.all.push(this);
    }

    // add faces cited by polytopes
    static updateCitedFaces() {
        let faces = [];
        for (let p of Polytope.all) {
            faces = faces.concat(p.fs);
        }
        let facesSet = new Set();
        faces.forEach(f => facesSet.add(f));
        Face.all = Array.from(faces);
    }

    static citedEdges() {
        let edges = [];
        for (let f of Face.all) {
            edges.push([f.vs[0], f.vs[1]]);
            edges.push([f.vs[1], f.vs[2]]);
            edges.push([f.vs[2], f.vs[3]]);
        }
        return edges;
    }
}

class Polytope {
    static all = [];

    constructor(fs) {
        this.fs = [];
        for (let iFace of fs) {
            this.fs.push(Face.all[iFace]);
        }

        this.id = Polytope.all.length;
        Polytope.all.push(this);
    }

    static getPolyFromIFace(iFace) {
        for (let poly of Polytope.all) {
            if (poly.fs.includes(Face.all[iFace])) {
                return poly;
            }
        }
        return false;
    }
}


class Model {
    static k = 600;
    static h = 0.03;
    static dampingRatio = 0.6;
    static maxMaxContraction = 0.35;
    static contractionPercentRate = 0.0004 / Model.h;  // contraction percentage change ratio, per time step
    static gravityFactor = 9.8 * 0.4;
    static gravity = 1;
    static defaultMinLength = 1.2;
    static defaultMaxLength = Model.defaultMinLength / (1 - Model.maxMaxContraction);
    static frictionFactor = 0.8;

    constructor() {
        this.viewer = null;

        this.Vertex = Vertex;
        this.Edge = Edge;
        this.Face = Face;
        this.Polytope = Polytope;
        this.Model = Model;

        this.reset();

        this.loadData();
        this.init();
    }

    reset() {
        this.v = [];  // vertex positions: nV x 3
        this.e = [];  // edge positions: nE x 2
        this.faces = [];
        this.polytopes = [];    // indices of faces

        this.fixedVs = [];  // id of vertices that are fixed
        this.lMax = []; // maximum length
        this.maxContraction = [];  // percentage of maxMaxContraction: nE
        this.edgeChannel = [];  // id of beam edgeChannel: nE
        this.edgeActive = [];  // if beam is active: nE

        this.v0 = [];
        this.vel = [];  // vertex velocities: nV x 3
        this.f = [];  // vertex forces: nV x 3
        this.l = [];    // current length of beams: nE

        this.euler = new thre.Euler(0, 0, 0);

        this.simulate = true;
        this.gravity = true;
        this.directional = false;

        this.numChannels = 4;

        if (!this.inflateChannel) {
            this.inflateChannel = new Array(this.numChannels).fill(false);
            this.deflateChannel = new Array(this.numChannels).fill(true);
            this.contractionPercent = new Array(this.numChannels).fill(1);  // contraction percentage of each channel, 0-1
        }

    }

    loadData(v, e, f, p, lMax, maxContraction, fixedVs, edgeChannel, edgeActive){
        if (v) {
            this.v = v;
            this.e = e;
            this.faces = f;
            this.polytopes = p;
        }
        else{
            this.v.push(new thre.Vector3(1, -1/Math.sqrt(3), 0.2));
            this.v.push(new thre.Vector3(0, 2/Math.sqrt(3), 0.2));
            this.v.push(new thre.Vector3(-1, -1/Math.sqrt(3), 0.2));
            this.v.push(new thre.Vector3(0, 0, 4/Math.sqrt(6) + 0.2));

            this.e.push([0, 1]);
            this.e.push([1, 2]);
            this.e.push([2, 0]);
            this.e.push([0, 3]);
            this.e.push([1, 3]);
            this.e.push([2, 3]);

            this.faces = [
                [0, 2, 1],
                [0, 1, 3],
                [1, 2, 3],
                [2, 0, 3]
            ];

            this.polytopes = [
                [0, 1, 2, 3]
            ];
        }

        if (lMax) {
            this.lMax = lMax;
            this.maxContraction = maxContraction;
            this.fixedVs = fixedVs;
            this.edgeChannel = edgeChannel;
            this.edgeActive = edgeActive;
        }
    }

    saveData() {
        let data = {};
        data.v = [];
        for (let v of this.v) {
            data.v.push([v.x, v.y, v.z]);
        }
        data.e = this.e;
        data.f = this.faces;
        data.p = this.polytopes;
        data.lMax = this.lMax;
        data.maxContraction = this.maxContraction;
        data.fixedVs =this.fixedVs;
        data.edgeChannel = this.edgeChannel;
        data.edgeActive = this.edgeActive;
        return data;
    }

    init(updateAll=true) {

        // rescale
        let currentLm = this.v[0].distanceTo(this.v[1]) / (1 - Model.maxMaxContraction);
        for (let i=0; i<this.v.length; i++) {
            this.v[i].divideScalar(currentLm);
            this.v[i].multiplyScalar(Model.defaultMaxLength);
        }

        // update other values
        this.updateData(updateAll);

        this.vel = [];
        this.f = [];
        for (let i=0; i<this.v.length; i++) {
            this.vel.push(new thre.Vector3());
            this.f.push(new thre.Vector3());
        }

        this.recordV();
    }

    recordV() {
        this.v0 = [];
        for (let v of this.v) {
            this.v0.push(v.clone());
        }
    }

    resetV() {
        for (let i=0; i<this.v.length; i++) {
            this.v[i] = this.v0[i].clone();
        }
    }

    updateData(updateAll = false) {
        this.l = [];
        for (let i=0; i<this.e.length; i++) {
            let e = this.e[i];
            this.l.push(this.v[e[0]].distanceTo(this.v[e[1]]));
        }

        if (updateAll) {
            this.lMax = Array.from(this.l);
            for (let i=0; i<this.e.length; i++) {
                this.lMax[i] /= 1 - Model.maxMaxContraction;
            }

            this.maxContraction = new Array(this.e.length).fill(Model.maxMaxContraction);
            this.edgeChannel = new Array(this.e.length).fill(0);
            this.edgeActive = new Array(this.e.length).fill(true);
            this.fixedVs = new Array(this.v.length).fill(false);
            this.recordV();
        }

    }

    update() {
        this.updateData();

        // global parameters
        // update contraction percentage
        for (let i=0; i<this.numChannels; i++) {
            if (this.inflateChannel[i]) {
                this.contractionPercent[i] -= Model.contractionPercentRate;
                if (this.contractionPercent[i] < 0) {
                    this.contractionPercent[i] = 0;
                }
            }
            else {
                this.contractionPercent[i] += Model.contractionPercentRate;
                if (this.contractionPercent[i] > 1) {
                    this.contractionPercent[i] = 1;
                }
            }
        }

        // initialize forces
        this.f = [];
        for (let i=0; i<this.v.length; i++) {
            this.f.push(new thre.Vector3());
        }

        // length maxContraction
        for (let i=0; i<this.e.length; i++) {
            let e = this.e[i];
            let v0 = this.v[e[0]];
            let v1 = this.v[e[1]];

            let vec = v1.clone().sub(v0); // from 0 to 1


            let l0 = this.lMax[i];
            if (this.edgeActive[i]) {
                let iChannel = this.edgeChannel[i];
                let lMax = l0;
                let lMin = lMax * (1 - this.maxContraction[i]);
                l0 = lMax - this.contractionPercent[iChannel] * (lMax - lMin);
            }


            let f = (vec.length() - l0) * Model.k;
            f = vec.normalize().multiplyScalar(f);  // from 0 to 1
            this.f[e[0]].add(f);
            this.f[e[1]].add(f.negate());
        }

        // gravity
        for (let i=0; i<this.v.length; i++) {
            if (this.gravity) {
                this.f[i].add(new thre.Vector3(0, 0, -Model.gravityFactor * Model.gravity));
            }
        }

        // friction
        // for (let i=0; i<this.v.length; i++) {
        //     if (this.v[i].z < 1e-2 && this.f[i].z < 0) {
        //         if (this.vel[i].length() < 1e-4) {
        //             continue;
        //         }
        //
        //         let f = this.vel[i].clone();
        //         f.z = 0;
        //         f.normalize();
        //         f.negate();
        //         let N = Math.abs(this.f[i].z);
        //         let fFriction = Model.frictionFactor;
        //         f = f.multiplyScalar(fFriction);
        //
        //         this.f[i].add(f);
        //
        //     }
        // }
    }

    step(n=1) {
        if (!this.simulate) {return}

        for (let iStep=0; iStep<n; iStep++) {
            this.update();

            for (let i=0; i<this.v.length; i++) {
                if (!this.fixedVs[i]) {
                    this.vel[i].add(this.f[i].clone().multiplyScalar(Model.h));
                    if (this.v[i].z <= 0) {
                        // friction
                        if (this.directional) {
                            if (this.vel[i].x < 0) this.vel[i].x *= (1 - Model.frictionFactor);
                            if (this.vel[i].y < 0) this.vel[i].y *= (1 - Model.frictionFactor);
                        }
                        else {
                            this.vel[i].x *= (1 - Model.frictionFactor);
                            this.vel[i].y *= (1 - Model.frictionFactor);
                        }
                    }

                    this.vel[i].multiplyScalar(Model.dampingRatio);   // damping
                    this.v[i].add(this.vel[i].clone().multiplyScalar(Model.h));
                }
            }


            for (let i=0; i<this.v.length; i++) {
                if (this.v[i].z < 0)
                {
                    this.v[i].z = 0;
                    this.vel[i].z = -this.vel[i].z;
                }
            }


        }
    }

    addPolytope(iFace) {
        if (0) {

            // find the other face sharing the edge
            let containing = (iFace, iEdge) => {
                let v0 = this.e[iEdge][0];
                let v1 = this.e[iEdge][1];
                let f = this.faces[iFace];

                return f.includes(v0) && f.includes(v1)
            };

            let neighboring = (iFace0, iFace1) => {
                if (iFace0 === iFace1) return false;

                for (let ie = 0; ie < this.e.length; ie++) {
                    if (containing(iFace0, ie) && containing(iFace1, ie)) {
                        return true;
                    }
                }
                return false;
            };

            // distance between the two nodes of two faces
            let farestDistance = (iFace0, iFace1) => {
                let f0 = this.faces[iFace0];
                let f1 = this.faces[iFace1];

                let iv0 = -1;
                let iv1 = -1;
                for (let iv of f0) {
                    if (!f1.includes(iv)) {
                        iv0 = iv
                    }
                }
                for (let iv of f1) {
                    if (!f0.includes(iv)) {
                        iv1 = iv
                    }
                }

                let dist = this.v[iv0].distanceTo(this.v[iv1]);

                return [dist, iv0, iv1];
            };

            // merge poly
            let added = false;
            for (let iF = 0; iF < this.faces.length; iF++) {
                if (neighboring(iFace, iF)) {
                    let [distance, iv0, iv1] = farestDistance(iFace, iF);
                    if (distance < 2.5) {
                        // merge new polytope
                        // TODO
                        let e = [iv0, iv1];
                        let exist = false;
                        for (let edge of this.e) {
                            if ((edge[0] === e[0] && edge[1] === e[1]) ||
                                (edge[0] === e[1] && edge[1] === e[0])) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            // TODO
                            this.e.push(e);
                            added = true;
                        }
                    }
                }
            }
        }

        // add polytope
        if (1) {
            let face = this.faces[iFace];
            let v0 = this.v[face[0]];
            let v1 = this.v[face[1]];
            let v2 = this.v[face[2]];
            let centroid = v0.clone().add(v1).add(v2).divideScalar(3);
            let vec01 = v1.clone().sub(v0);
            let vec12 = v2.clone().sub(v1);
            let height = Math.sqrt(3) / 2 * Model.defaultMinLength;
            let v4 = centroid.add(vec01.cross(vec12).normalize().multiplyScalar(height));
            this.v.push(v4);
            this.f.push(new thre.Vector3());
            this.vel.push(new thre.Vector3());

            let iv4 = this.v.length - 1;

            let e0 = [face[0], iv4];
            let e1 = [face[1], iv4];
            let e2 = [face[2], iv4];
            this.e.push(e0, e1, e2);

            let face0 = [face[2], face[1], face[0]];
            let face1 = [face[0], face[1], iv4];
            let face2 = [face[1], face[2], iv4];
            let face3 = [face[2], face[0], iv4];
            this.faces.push(face0, face1, face2, face3);

            let if0 = this.faces.length - 4;
            let if1 = this.faces.length - 3;
            let if2 = this.faces.length - 2;
            let if3 = this.faces.length - 1;
            this.polytopes.push([if0, if1, if2, if3]);
        }

        this.updateData(true);

        this.updateDataStructure();
    }

    // update the model variables to data structures
    updateDataStructure() {
        Vertex.all = [];
        for (let i = 0; i < this.v.length; i++) {
            new Vertex(this.v[i], this.fixedVs[i], this.v0[i], this.vel[i], this.f[i]);
        }
        Edge.all = [];
        for (let i = 0; i < this.e.length; i++) {
            new Edge(this.e[i], this.lMax[i], this.maxContraction[i], this.edgeChannel[i], this.edgeActive[i], this.l[i]);
        }

        Face.all = [];
        this.faces.forEach(f => new Face(f));
        Polytope.all = [];
        this.polytopes.forEach(p => new Polytope(p));
    }

    // convert data structures to model variables
    updateFromDataStructure() {
        this.v = [];
        this.fixedVs = [];
        this.v0 = [];
        this.vel = [];
        this.f = [];
        for (let v of Vertex.all) {
            this.v.push(v.pos);
            this.fixedVs.push(v.fixed);
            this.v0.push(v.pos0);
            this.vel.push(v.vel);
            this.f.push(v.f);
        }

        this.e = [];
        this.lMax = [];
        this.maxContraction = [];
        this.edgeChannel = [];
        this.edgeActive = [];
        this.l = [];
        for (let e of Edge.all) {
            let vs = [e.vs[0].id, e.vs[1].id];
            this.e.push(vs);
            this.lMax.push(e.lMax);
            this.maxContraction.push(e.maxContraction);
            this.edgeChannel.push(e.edgeChannel);
            this.edgeActive.push(e.edgeActive);
            this.l.push(e.l);
        }

        this.faces = [];
        for (let f of Face.all) {
            let vs = [];
            f.vs.forEach(v => vs.push(v.id))
            this.faces.push(vs);
        }

        this.polytopes = [];
        for (let p of Polytope.all) {
            let fs = [];
            p.fs.forEach(f => fs.push(f.id))
            this.polytopes.push(fs);
        }

    }

    static reindexObjects = (cls) => {
        let i = 0;
        for (let o of cls.all) {
            o.id = i;
            i += 1;
        }
    };

    static clearRedundantObjects() {
        Face.updateCitedFaces();
        Vertex.updateCitedVertices();
        Edge.updateCitedEdges();


        Model.reindexObjects(Vertex);
        Model.reindexObjects(Face);
        Model.reindexObjects(Edge);
        Model.reindexObjects(Polytope);

    };

    removePolytope(iFace) {

        this.updateDataStructure();

        let poly = Polytope.getPolyFromIFace(iFace);

        console.assert(poly !== false);

        Polytope.all.splice(poly.id, 1);  // remove the polytope
        Model.clearRedundantObjects();
        this.updateFromDataStructure();

    }

    centroid() {
        let center = new thre.Vector3(0, 0, 0);
        for (let v of this.v) {
            center.add(v);
        }
        center.divideScalar(this.v.length);
        return center;
    }

    infoJoints() {
        return 'joints: '+ this.v.length;
    }

    infoBeams() {
        return 'actuators: ' + this.e.length;
    }

    fixJoints(ids) {
        for (let i=0; i<ids.length; i++) {
            let id = ids[i];
            if (viewer.typeSelected[i] === "joint") {
                this.fixedVs[id] = true;
            }
        }
    }

    unfixAll() {
        this.fixedVs = [];
        this.fixedVs = new Array(this.v.length).fill(false);
    }

    rotate(x, y, z) {
        this.resetV();

        let center = this.centroid();
        let eulerInverse = new thre.Euler();
        eulerInverse.setFromVector3(this.euler.toVector3().negate(), 'ZYX');
        this.euler =new thre.Euler(x, y, z);

        for (let i=0; i<this.v.length; i++) {
            this.v[i].sub(center);
            this.v[i].applyEuler(eulerInverse);
            this.v[i].applyEuler(this.euler);
            this.v[i].add(center);
        }

        this.recordV();
    }




}

export {Model};
