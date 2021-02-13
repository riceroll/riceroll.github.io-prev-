import * as thre from '../../node_modules/three/build/three.module.js';
import {Joint} from './joint.js'
import {Beam} from './beam.js'
import {Simulator} from './simulator.js'
// import {DenseMatrix} from '../../lib/geometry-processing-js/linear-algebra/dense-matrix.js'


class Viewer {
    static jointRdius = 0.08;
    static beamLength = 1;
    static beamDiameter = 0.08;

    static jointColor = new thre.Color(1, 1, 1);
    static beamColor = new thre.Color(1, 1, 1);
    static faceColor = new thre.Color(1, 1, 1);
    static selectedColor = new thre.Color(0.8, 0.2, 0.2);


    constructor(model) {
        this.model = model;
        this.model.viewer = this;

        this.mesh = new thre.Object3D();

        this.pressingMeta = false;
        this.edittingMesh = false;
        this.addingPolytope = false;
        this.removingPoly = false;


        this.typeSelected = [];
        this.idSelected = [];

        this.createAll();
        this.updateMeshes();
    }

    createAll() {

        this.mesh.children = [];

        this.joints = new thre.Object3D();
        this.beams = new thre.Object3D();
        this.faces = new thre.Object3D();
        this.mesh.add(this.joints);
        this.mesh.add(this.beams);
        this.mesh.add(this.faces);

        this.typeMap = {
            'joint': this.joints,
            'beam': this.beams,
            'face': this.faces
        };

        this.createJoints(500);
        this.createBeams(500);
        this.createFaces(500);
    }

    createJoints(n) {
        for (let i=0; i<n; i++) {

            let geometry = new thre.SphereBufferGeometry(Viewer.jointRdius, 15, 15);
            let material = new thre.MeshLambertMaterial( {color: Viewer.jointColor });

            let joint = new thre.Mesh(geometry, material);
            joint.visible = false;
            joint.position.copy(new thre.Vector3(1e3, 1e3, 1e3));

            let jointNew = joint.clone();
            jointNew.userData.id = i;
            jointNew.userData.type = 'joint';
            this.joints.add(jointNew);
        }
    }

    createBeams(n) {
        // create meshed, put them in the center of the world
        for (let i=0; i<n; i++) {
            let geometry = new thre.CylinderBufferGeometry(1, 1, 1, 20);
            let material = new thre.MeshLambertMaterial( {color: Viewer.beamColor} );
            let beam = new thre.Mesh(geometry, material);
            beam.visible = false;
            beam.position.copy(new thre.Vector3(1e3, 1e3, 1e3));

            beam.userData.scaleMatrix = new thre.Matrix4();
            beam.userData.scaleMatrix.makeScale(1, 1, 1);
            beam.userData.id = i;
            beam.userData.type = 'beam';
            this.beams.add(beam);
        }
    }

    createFaces(n) {
        let vertices = [];
        for (let v of this.model.v) {
            vertices = vertices.concat([v.x, v.y, v.z]);
        }

        for (let i=0; i<n; i++) {
            let geometry = new thre.BufferGeometry();
            geometry.setAttribute('position', new thre.Float32BufferAttribute(vertices, 3));

            const material = new thre.MeshBasicMaterial( { color: Viewer.faceColor, opacity: 0.5, transparent: true} );

            const mesh = new thre.Mesh(geometry, material);
            mesh.userData.id = i;
            mesh.userData.type = 'face';

            this.faces.add(mesh);
        }
    }

    updateMeshes() {
        // update joints
        for (let i=0; i<this.joints.children.length; i++) {
            this.joints.children[i].visible = false;
        }
        for (let i=0; i<this.model.v.length; i++) {
            this.joints.children[i].position.copy(this.model.v[i]);
            this.joints.children[i].visible = true;
            this.joints.children[i].material.color.copy(Viewer.jointColor);
        }

        // update beams
        for (let i=0; i<this.beams.children.length; i++) {
            this.beams.children[i].visible = false;
            this.beams.children[i].material.color.copy(Viewer.beamColor);
        }
        for (let i=0; i<this.model.e.length; i++) {
            this.beams.children[i].visible = true;

            let e = this.model.e[i];
            let v0 = this.model.v[e[0]].clone();
            let v1 = this.model.v[e[1]].clone();
            let beam = this.beams.children[i];

            let vec = v1.clone().sub(v0);
            let length = vec.length();
            let center = (v1.clone().add(v0)).divideScalar(2);

            beam.position.set(0, 0, 0);  // move back to origin  point towards +Y
            beam.lookAt(1, 0, 0);        // rotate back
            beam.applyMatrix4( (new thre.Matrix4()).getInverse(beam.userData.scaleMatrix) );    // scale bck

            beam.userData.scaleMatrix.identity().makeScale(Viewer.beamDiameter, length, Viewer.beamDiameter) ;    // rescale
            beam.applyMatrix4( beam.userData.scaleMatrix );
            beam.lookAt(vec);
            beam.rotateX(Math.PI / 2);
            beam.position.copy(center);

            // color
            let constraint = this.model.constraints[i];
            let color = 1 - constraint;
            beam.material.color.copy(new thre.Color(color, color, color));
        }

        // udpate faces
        let vertices = [];
        for (let v of this.model.v) {
            vertices = vertices.concat([v.x, v.y, v.z]);
        }

        for (let i=0; i<this.faces.children.length; i++) {
            this.faces.children[i].visible = false;
        }
        for (let i=0; i<this.model.faces.length; i++) {
            if (this.edittingMesh) {
                this.faces.children[i].visible = true;
            }
            const indices = Array.from(this.model.faces[i]);
            this.faces.children[i].geometry.setIndex(indices);
            this.faces.children[i].geometry.computeVertexNormals();
            this.faces.children[i].geometry.computeFaceNormals();
            this.faces.children[i].geometry.setAttribute('position', new thre.Float32BufferAttribute(vertices, 3));

            this.faces.children[i].material.color.copy(Viewer.faceColor);
        }

        // update selection color
        for (let i=0; i<this.idSelected.length; i++) {
            let id = this.idSelected[i];
            let type = this.typeSelected[i];

            this.typeMap[type].children[id].material.color.copy(Viewer.selectedColor);
        }


    }


}


export {Viewer};
