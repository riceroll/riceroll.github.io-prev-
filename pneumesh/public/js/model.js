import * as thre from '../../node_modules/three/build/three.module.js';

class Model {
    static k = 80;
    static h = 0.1;
    static dampingRatio = 0.6;
    static defaultContraction = 0.35;
    static gravityFactor = 9.8 * 0.1;
    static gravity = 1;
    static defaultMinLength = 1.2;
    static defaultMaxLength = Model.defaultMinLength / (1 - Model.defaultContraction);
    static frictionFactor = 0.8;

    constructor() {
        this.mesh = new thre.Object3D();
        this.viewer = null;

        this.v = [];  // vertex positions: nV x 3
        this.v0 = [];
        this.e = [];  // edge positions: nE x 2
        this.lm = []; // maximum length
        this.constraints = [];  // percentage of constraints: nE
        this.l = [];    // current length of beams: nE
        this.vel = [];  // vertex velocities: nV x 3
        this.f = [];  // vertex forces: nV x 3
        this.fixedVs = [];  // id of vertices that are fixed
        this.edgeChannel = [];  // id of beam edgeChannel: nE
        this.edgeActive = [];  // if beam is active: nE

        this.faces = [];
        this.polytopes = [];

        this.simulate = false;
        this.inflate = false;
        this.deflate = false;

        this.numChannels = 2;

        this.inflateChannel = new Array(this.numChannels).fill(false);
        this.deflateChannel = new Array(this.numChannels).fill(true);

        this.inflates = [];
        this.deflates = [];

        this.init();
    }

    setMesh(v, e, f, p){
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
    }



    init() {
        this.setMesh();

        // rescale
        let currentLm = this.v[0].distanceTo(this.v[1]) / (1 - Model.defaultContraction);
        for (let i=0; i<this.v.length; i++) {
            this.v[i].divideScalar(currentLm);
            this.v[i].multiplyScalar(Model.defaultMaxLength);
        }

        // update other values
        this.updateL(true);

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

    updateL(updateAll = false) {
        this.l = [];
        for (let i=0; i<this.e.length; i++) {
            let e = this.e[i];
            this.l.push(this.v[e[0]].distanceTo(this.v[e[1]]));
        }

        if (updateAll) {
            this.lm = Array.from(this.l);
            for (let i=0; i<this.e.length; i++) {
                this.lm[i] /= 1 - Model.defaultContraction;
            }

            this.constraints = new Array(this.e.length).fill(0);
            this.edgeChannel = new Array(this.e.length).fill(0);
            this.edgeActive = new Array(this.e.length).fill(true);
        }

    }

    update() {
        this.updateL();

        this.f = [];
        for (let i=0; i<this.v.length; i++) {
            this.f.push(new thre.Vector3());
        }

        // length constraint
        for (let i=0; i<this.e.length; i++) {
            let e = this.e[i];
            let v0 = this.v[e[0]];
            let v1 = this.v[e[1]];

            let vec = v1.clone().sub(v0); // from 0 to 1
            let l0 = this.lm[i];

            if (this.edgeActive[i] && this.deflateChannel[this.edgeChannel[i]]) {
                l0 = l0 * (1 - (Model.defaultContraction - this.constraints[i]));
            }


            let f = (vec.length() - l0) * Model.k;
            f = vec.normalize().multiplyScalar(f);  // from 0 to 1
            this.f[e[0]].add(f);
            this.f[e[1]].add(f.negate());
        }

        // gravity
        for (let i=0; i<this.v.length; i++) {
            this.f[i].add(new thre.Vector3(0, 0, -Model.gravityFactor * Model.gravity));
        }

        // friction
        for (let i=0; i<this.v.length; i++) {
            if (this.v[i].z < 1e-2 && this.f[i].z < 0) {
                let f = this.vel[i].clone();
                f.z = 0;
                let N = this.f[i].z;
                f = f.multiplyScalar(-Model.frictionFactor * N);
                this.f[i].add(f);
            }
        }
    }

    step(n=1) {
        if (!this.simulate) {return}

        for (let iStep=0; iStep<n; iStep++) {
            this.update();

            for (let i=0; i<this.v.length; i++) {
                if (!this.fixedVs.includes(i)) {
                    this.vel[i].add(this.f[i].clone().multiplyScalar(Model.h));
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

        this.updateL(true);
    }

    removePolytope(iFace) {
        // find id of polytope
        let iPoly = -1;
        for (let i=0; i<this.polytopes.length; i++) {
            if (this.polytopes[i].includes(iFace)) {
                iPoly = i;
                break;
            }
        }
        console.assert(iPoly !== -1);
        if (iPoly === 0) return 0;
        const polyRemove = Array.from(this.polytopes[iPoly]);

        this.polytopes[iPoly] = null;
        // null faces
        for (let iFace=0; iFace<polyRemove.length; iFace++) {
            this.faces[polyRemove[iFace]] = null;
        }
        // update id of polys
        for (let i=0; i<this.polytopes.length; i++) {
            if (this.polytopes[i] === null) continue;
            for (let j=0; j<this.polytopes[i].length; j++){
                for (let idFace of polyRemove) {
                    if (idFace < this.polytopes[i][j]){
                        this.polytopes[i][j] -= 1;
                    }
                }
            }
        }
        // null redundant vertices
        let referredVertices = new Set();
        for (let face of this.faces) {
            if (face === null) continue;
            face.forEach(iv => referredVertices.add(iv));
        }
        let redundantVertices = new Set();
        for (let i=0; i<this.v.length; i++) {
            if (!referredVertices.has(i)) {
                this.v[i] = null;
                redundantVertices.add(i);
            }
        }
        // update id of faces
        for (let i=0; i<this.faces.length; i++) {
            for (let j=0; j<3; j++) {   // every vertex in each face
                for (let iv=0; iv<this.v.length; iv++) {
                    if (this.v[iv] === null && j > iv) {
                        this.faces[i][j] -= 1;
                    }
                }
            }
        }

        // remove edges
        for (let j=this.e.length - 1; j>=0; j--) {
            let iv0 = this.e[j][0];
            let iv1 = this.e[j][1];
            if (this.v[iv0] === null || this.v[iv1] === null) {
                this.e.splice(j, 1);
                continue;
            }
            if (this.v[iv0] !== null && this.v[iv1] !== null) {
                let suspending = true;
                for (let face of this.faces) {
                    if (face === null) continue;
                    if (face.includes(iv0) && face.includes(iv1)) suspending = false;
                }

                if (suspending) {this.e.splice(j, 1)}
            }
        }

        // remove vertices(forces, vels)
        for (let j=this.v.length - 1; j>=0; j--) {
            if (this.v[j] === null) {
                this.v.splice(j, 1);
                this.vel.splice(j, 1);
                this.f.splice(j, 1);
            }
        }

        // remove faces
        for (let j=this.faces.length - 1; j>=0; j--) {
            if (this.faces[j] === null) {
                this.faces.splice(j, 1);
            }
        }

        // remove polytopes
        for (let j=this.polytopes.length - 1; j>=0; j--) {
            if (this.polytopes[j] === null) {
                this.polytopes.splice(j, 1);
            }
        }

        this.updateL(true);
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
                if (!this.fixedVs.includes(id)) {
                    this.fixedVs.push(id);
                }
            }
        }
    }

    unfixAll() {
        this.fixedVs = [];
    }






}

export {Model};
