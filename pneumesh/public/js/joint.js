import * as THREE from '../../node_modules/three/build/three.module.js';
import {Beam} from './beam.js'

class Joint {
  static radius = Beam.beamLength * 0.08;
  static colorHovered = new THREE.Color(1.0, 0.5, 0);
  static colorSelected = new THREE.Color(1.0, 0, 0);
  static color = new THREE.Color( 1, 1, 1 );
  static joints = [];

  constructor(x, y, z, mkb) {
    this.mkb = mkb;
    this.position = new THREE.Vector3(x, y, z);
    this.beams = new Set();
    this.hovered = false;
    this.selected = false;

    this.mesh = this.createMesh();

    this.id = Joint.joints.length;   // for converting to v, e format
    Joint.joints.push(this);

    this.updateMesh();

    // animation
    this.prevPosition = new THREE.Vector3(x, y, z);
    this.nextPosition = new THREE.Vector3(x, y, z);
  }

  connectBeam(beam) {
    this.beams.add(beam);
  }

  disconnectBeam(beam) {
    this.beams.delete(beam);
    if (this.beams.size === 0) {
      this.mkb.removeJoint(this);
    }
  }

  createMesh() {
    let geometry = new THREE.SphereBufferGeometry(Joint.radius, 15, 15);
    let material = new THREE.MeshLambertMaterial( {color: Joint.color });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.userData.parent = this;
    return mesh;
  }

  updateMesh() {
    this.mesh.position.copy(this.position);
    this.updateColor();
  }

  updateColor() {
    this.mesh.material.color.copy(Joint.color);
    if (this.hovered) {
      this.mesh.material.color.copy(Joint.colorHovered);
    }
    if (this.selected) {
      this.mesh.material.color.copy(Joint.colorSelected);
    }

  }

  setNextPosition(p) {
    this.nextPosition.copy(p);
  }

  animate(t) {
    // update the position based on the animation parameter t
    console.assert(0 <= t && t <= 1);
    let position0 = (new THREE.Vector3(0,0,0)).copy(this.prevPosition);
    position0.multiplyScalar(1 - t);
    let position1 = (new THREE.Vector3(0,0,0)).copy(this.nextPosition);
    position1.multiplyScalar(t);
    this.position.addVectors(position0, position1);
    this.updateMesh();
  }

  hover(t = true) {
    this.hovered = t;
    this.updateColor();
  }

  select(t = true) {
    this.selected = t;
    this.updateColor();
  }

}

export {Joint};