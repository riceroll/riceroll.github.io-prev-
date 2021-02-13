import * as THREE from '../../node_modules/three/build/three.module.js';


class Simulator {
  constructor(v, e, vel, f, l0, constraints) {
    this.v = [...v];
    this.e = [...e];
    this.constraints = [...constraints];
    this.l0 = [...l0];

    this.vel = [...vel];

    this.f_joints = [...f];

    this.k = 0.1;
    this.h = 0.1;
  }


  step(n=1) {

    for (let i_step=0; i_step<n; i_step++) {

      for (let i = 0; i < this.l0.length; i++) {
        let scale = (1 - this.constraints[i]) * 0.5 + 1;

        let l_target = this.l0[i] * scale;
        let l = this.v[this.e[i][0]].distanceTo(this.v[this.e[i][1]]);
        let f_beam = this.k * (l - l_target);   // contraction force

        let vec = this.v[this.e[i][1]].clone().add(this.v[this.e[i][0]].clone().negate());
        vec.normalize();
        vec.multiplyScalar(f_beam);
        this.f_joints[this.e[i][0]].add(vec);

        vec = this.v[this.e[i][0]].clone().add(this.v[this.e[i][1]].clone().negate());
        vec.normalize();
        vec.multiplyScalar(f_beam);
        this.f_joints[this.e[i][1]].add(vec);
      }


      for (let i = 0; i < this.v.length; i++) {
        this.vel[i].add(this.f_joints[i].clone().multiplyScalar(this.h));
      }


      for (let i = 0; i < this.v.length; i++) {
        this.v[i].add(this.vel[i].clone().multiplyScalar(this.h));
      }

    }

    return [this.v, this.vel, this.f_joints];
  }

}

export {Simulator};