import * as THREE from '../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GUI } from '../../node_modules/three/examples/jsm/libs/dat.gui.module.js';

import { Model } from './model.js';
import { Viewer } from './viewer.js';

let camera, scene, renderer, controls;
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let gui;

let coreMKB;


let model = new Model();
let viewer = new Viewer(model);


function initScene() {

    let info = document.createElement( 'div' );
    info.style.position = 'absolute';
    info.style.top = '10px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.style.color = '#fff';
    info.style.link = '#f80';
    info.innerHTML = 'MKB';
    document.body.appendChild( info );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x222222 );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, -20, 1 );
    camera.up.set(0,0,1);

    controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 1;
    controls.maxDistance = 500;
    // controls.dynamicDampingFactor = 0.5;

    let aLight = new THREE.AmbientLight( "rgb(255,255,255)", 0.5 );
    scene.add( aLight );

    let dLight = new THREE.DirectionalLight( "rgb(255,255,255)", 0.5);
    dLight.translateOnAxis(new THREE.Vector3(1,-1,1), 100);
    scene.add( dLight );

}


let utils = {
    mouseOverGUI : false,

    grow: ()=>{
        for (let i=0; i<viewer.idSelected.length; i++) {
            let type = viewer.typeSelected[i];
            let id = viewer.idSelected[i];
            if (type === "beam") {
                model.l0[id] += 0.1;
            }
        }
    },


    shrink: ()=>{
        for (let i=0; i<viewer.idSelected.length; i++) {
            let type = viewer.typeSelected[i];
            let id = viewer.idSelected[i];
            if (type === "beam") {
                model.l0[id] -= 0.1;
            }
        }
    },

    updateGUI: ()=>{
        if (viewer.edittingMesh) {
            utils.enable(gui.checkBoxes.addingPolytope);
            utils.enable(gui.checkBoxes.removingPoly);

        }
        else {
            utils.disable(gui.checkBoxes.addingPolytope);
            utils.disable(gui.checkBoxes.removingPoly);
        }
    },

    disable: (obj)=>{
        try{
            obj.setValue(0);
        }
        catch(e) {}
        obj.__li.style.pointerEvents = "none";
        obj.__li.style.opacity = .5;
    },

    enable: (obj)=>{
        obj.__li.style.pointerEvents = "";
        obj.__li.style.opacity = 1.;
    },

};

function initGUI() {
    gui = {};
    gui.sliders = {};
    gui.checkBoxes = {};
    gui.window = new GUI();
    let shape = gui.window.addFolder('shape');
    let constraint = gui.window.addFolder('constraint');
    let control = gui.window.addFolder('mode');

    shape.add(utils, 'grow');
    shape.add(utils, 'shrink');
    control.add(model, 'playing').listen();
    control.add(model, 'pressure').listen();
    gui.checkBoxes.edittingMesh = shape.add(viewer, 'edittingMesh').listen();
    gui.checkBoxes.addingPolytope = shape.add(viewer, 'addingPolytope').listen();
    gui.checkBoxes.removingPoly = shape.add(viewer, 'removingPoly').listen();

    // gui.checkBoxes.edittingMesh.onClick


    let effectController = function () {this.constraint = 0;};
    gui.effect = new effectController();
    gui.sliders.constraint = constraint.add( gui.effect, "constraint", 0, 1, 0.25).listen();


    shape.open();
    constraint.open();
    control.open();

    // gui functions =============================================
    // constraints
    gui.sliders.constraint.onChange(function(value) {
        for (let i=0; i<viewer.idSelected.length; i++) {
            if (viewer.typeSelected[i] === 'beam') {
                model.constraints[viewer.idSelected[i]] = value;
            }
        }
    });

    utils.disable(gui.sliders.constraint);
    utils.disable(gui.checkBoxes.addingPolytope);
    utils.disable(gui.checkBoxes.removingPoly);


    gui.window.domElement.onmouseover = () => {
        utils.mouseOverGUI = true;
    };

    gui.window.domElement.onmouseout = () => {
        utils.mouseOverGUI = false;
    };

    gui.window.domElement.onchange = () => {
        utils.updateGUI();
    };

    gui.checkBoxes.addingPolytope.__checkbox.onclick = gui.checkBoxes.addingPolytope.__li.onclick = () => {
        gui.checkBoxes.removingPoly.setValue(false);
    };

    gui.checkBoxes.removingPoly.__checkbox.onclick = gui.checkBoxes.removingPoly.__li.onclick = () => {
        gui.checkBoxes.addingPolytope.setValue(false);
    }


}

function GUIHovered() {
    if (document.getElementsByClassName('hover').length > 0)
        return 1;
    for (let div of document.getElementsByClassName('slider')) {
        if (div.parentElement.querySelector(':hover')) return 1;
    }
    return 0;
}

function objectCasted() {
    raycaster.setFromCamera( mouse, camera );
    let intersects = raycaster.intersectObjects( scene.children, true );
    while (intersects.length > 0) {
        let intersect = intersects.shift().object;

        if (intersect.visible) {

            return intersect;
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onMouseClick(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    if (utils.mouseOverGUI) {
        return 0;
    }

    if (!viewer.pressingMeta) {
        viewer.typeSelected = [];
        viewer.idSelected = [];
    }

    utils.disable(gui.sliders.constraint);
    let obj = objectCasted();
    if (!obj) return 0;

    let selected = false;    // selection already selected
    for (let i=0; i<viewer.idSelected.length; i++) {
        if (viewer.idSelected[i] === obj.userData.id && viewer.typeSelected[i] === obj.userData.type) selected = false;
    }

    viewer.idSelected.push(obj.userData.id);
    viewer.typeSelected.push(obj.userData.type);

    // slider
    if (viewer.idSelected.length === 1 && viewer.typeSelected[0] === 'beam') {
        gui.sliders.constraint.setValue(model.constraints[viewer.idSelected[0]]);
    }
    if (viewer.typeSelected.includes("beam")) {
        utils.enable(gui.sliders.constraint);
    }

    if (viewer.edittingMesh && viewer.idSelected.length === 1 && viewer.typeSelected[0] === "face") {

        if (viewer.addingPolytope) {
            model.addPolytope(viewer.idSelected[0]);
        }
        else if (viewer.removingPoly) {
            model.removePolytope(viewer.idSelected[0]);
        }

        viewer.idSelected = [];
        viewer.typeSelected = [];
        viewer.createAll();

    }


}

function onMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    let obj = objectCasted();


}

function onKeyDown( e ) {
    viewer.pressingMeta = e.key === 'Meta';
}


function onKeyUp( e ) {
    if (e.key === 'Meta') {
        viewer.pressingMeta = false;
    }
}

function animate() {

    controls.update();

    model.step();
    viewer.updateMeshes();

    // put render right before requestAnimationFrame, it will do scene.updateMatrixWorld() for raytracing
    renderer.render( scene, camera );

    requestAnimationFrame( animate );
}

// main ======================================================

initGUI();
initScene();

scene.add(viewer.mesh);

animate();

window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener( 'mousedown', onMouseClick, false );
window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'keydown', onKeyDown, false );
window.addEventListener( 'keyup', onKeyUp, false );

window.model = model;
window.viewer = viewer;
window.v = Viewer;
window.scene = scene;
window.thre = THREE;
window.camera = camera;
window.renderer = renderer;
window.controls = controls;
window.gui = gui;
window.utils = utils;