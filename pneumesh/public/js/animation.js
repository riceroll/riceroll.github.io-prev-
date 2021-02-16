import * as THREE from '../../node_modules/three/build/three.module.js';

class Animation {
  static duration = 2000;   // ms
  constructor(mkb) {
    this.mkb = mkb;
    this.startTime = 0;
    this.ws = null;

    this.simulate = false;
  }

  reset() {
    this.startTime = (new Date()).getTime();
  }

  play() {
    this.simulate = true;
  }

  stop() {
    this.simulate = false;
  }

  start() {
    this.reset();
    this.play();
  }

  update() {
    if (!this.simulate) return 0;

    let timePassed = (new Date()).getTime() - this.startTime;
    let t = timePassed / Animation.duration;

    if (t > 1) {
      this.stop();
      this.reset();
    }
    else {
      this.mkb.animate(t);
    }

  }

  update2() {
    if (this.ws) {
      this.ws.send('hehehe');
    }
  }



}

export {Animation};