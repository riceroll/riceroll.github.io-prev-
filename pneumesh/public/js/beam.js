import * as THREE from '../../node_modules/three/build/three.module.js';

class Beam {
  static beamLength = 1;
  static diameter = Beam.beamLength * 0.08;
  static colorHovered = new THREE.Color(1.0, 0.5, 0);
  static colorSelected = new THREE.Color(1.0, 0, 0);
  static color = new THREE.Color(1, 1, 1);
  static beams = [];

  constructor(joint0, joint1, mkb) {
    this.mkb = mkb;
    this.joints = new Set();
    this.connectJoint(joint0);
    this.connectJoint(joint1);
    this.hovered = false;
    this.selected = false;
    this.constraint = 0;
    this.length0 = null;

    Beam.beams.push(this);

    this.pistonScaleM = new THREE.Matrix4();
    this.syringeScaleM = new THREE.Matrix4();
    this.mesh = this.createMesh();
    this.updateMesh();
  }

  connectJoint(joint) {
    console.assert(this.joints.size <= 1);
    this.joints.add(joint);
    joint.connectBeam(this);
  }

  disconnect() {
    for (let joint of this.joints) {
      joint.disconnectBeam(this);
    }
    this.joints = new Set();
  }

  vec() {
    let p0 = Array.from(this.joints)[0].position;
    let p1 = Array.from(this.joints)[1].position;
    let vec = new THREE.Vector3();
    vec.subVectors(p1, p0);
    return vec;
  }

  length() {
    return this.vec().length();
  }

  actuatorColor() {
    return( new THREE.Color(1, 1, 1).copy(Beam.color).multiplyScalar( (1 - Math.sqrt(this.constraint * 0.6) ) ));
  }

  center() {
    let p0 = Array.from(this.joints)[0].position;
    let p1 = Array.from(this.joints)[1].position;
    let pMid = new THREE.Vector3();
    pMid.addVectors(p0, p1);
    pMid.divideScalar(2);
    return pMid;
  }

  createMesh() {
    // create meshed, put them in the center of the world
    let mesh = new THREE.Object3D();
    let geometry = new THREE.CylinderBufferGeometry(1, 1, 1, 20);
    let material = new THREE.MeshLambertMaterial( {color: this.actuatorColor()} );
    let actuator = new THREE.Mesh(geometry, material);
    actuator.userData.parent = this;
    mesh.add(actuator);

    geometry = new THREE.CylinderBufferGeometry(1, 1, 1, 20);
    material = new THREE.MeshLambertMaterial( {color: Beam.color} );
    let tube = new THREE.Mesh(geometry, material);
    tube.userData.parent = this;
    mesh.add(tube);


    this.pistonScaleM.makeScale(1, 1, 1);
    this.syringeScaleM.makeScale(1, 1, 1);

    mesh.userData.parent = this;
    return mesh;
  }

  updateMesh() {
    // rotate and translate already created meshes to the updated location

    let vec = this.vec();
    let length = this.length();
    let center =this.center();

    this.mesh.position.set(0, 0, 0);  // move back to origin
    this.mesh.rotateX(-Math.PI / 2);  // rotate back
    this.mesh.lookAt(0, 1, 0);        // rotate back
    this.mesh.children[0].applyMatrix4( (new THREE.Matrix4()).getInverse(this.syringeScaleM) );    // scale bck
    this.mesh.children[1].applyMatrix4( (new THREE.Matrix4()).getInverse(this.pistonScaleM) );

    this.syringeScaleM.identity().makeScale(Beam.diameter, length, Beam.diameter) ;    // rescale
    this.pistonScaleM.identity().makeScale(Beam.diameter, length, Beam.diameter);
    this.mesh.children[0].applyMatrix4( this.syringeScaleM );
    this.mesh.children[1].applyMatrix4( this.pistonScaleM );
    this.mesh.lookAt(vec);
    this.mesh.rotateX(Math.PI / 2);
    this.mesh.position.copy(center);

    this.updateColor();
  }

  updateColor() {
    this.mesh.children[1].material.color.copy(this.actuatorColor());
    if (this.hovered) {
      this.mesh.children[1].material.color.copy(Beam.colorHovered);
    }
    if (this.selected) {
      this.mesh.children[1].material.color.copy(Beam.colorSelected);
    }
  }

  isHovered(t = true) {
    this.hovered = t;
    this.updateColor();
  }

  isSelect(t = true) {
    this.selected = t;
    this.updateColor();
  }

}

export {Beam};