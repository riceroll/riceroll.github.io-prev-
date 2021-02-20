import * as THREE from '../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { GUI } from '../../node_modules/three/examples/jsm/libs/dat.gui.module.js';

import { Model } from './model.js';
import { Viewer } from './viewer.js';
import { Remesher } from './remesher.js';

let camera, scene, renderer, controls;
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
let gui;
let dashboard = {};
let information;
let infoJoints, infoBeams;
let inputFileString;

let gridHelper;
let ground;


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
    // info.innerHTML = 'PneuMesh';
    document.body.appendChild( info );

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    document.body.appendChild( renderer.domElement );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0.8, 0.8, 0.8 );

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, -20, 1 );
    camera.up.set(0,0,1);

    controls = new OrbitControls( camera, renderer.domElement );
    controls.minDistance = 1;
    controls.maxDistance = 500;

    // lights
    const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( 0, 0, 5 ); //default; light shining from top
    light.castShadow = true; // default false
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    scene.add( light );

    let aLight = new THREE.AmbientLight( "rgb(255,255,255)", 0.5 );
    scene.add( aLight );

    // ground
    const planeGeometry = new THREE.PlaneGeometry( 1000, 1000);
    const planeMaterial = new THREE.ShadowMaterial({opacity:0.2});
    ground = new THREE.Mesh( planeGeometry, planeMaterial);
    ground.position.z = 0;
    ground.receiveShadow = true;
    scene.add( ground );

    // grid
    gridHelper = new THREE.GridHelper( 100, 100 );
    gridHelper.rotateX(-Math.PI/2);
    gridHelper.position.z = 0;
    scene.add( gridHelper );



}


let utils = {
    mouseOverGUI : false,

    grow: ()=>{
        for (let i=0; i<viewer.idSelected.length; i++) {
            let type = viewer.typeSelected[i];
            let id = viewer.idSelected[i];
            if (type === "beam") {
                model.lm[id] += 0.1;
            }
        }
    },


    shrink: ()=>{
        for (let i=0; i<viewer.idSelected.length; i++) {
            let type = viewer.typeSelected[i];
            let id = viewer.idSelected[i];
            if (type === "beam") {
                model.lm[id] -= 0.1;
            }
        }
    },

    updateGUI: ()=>{
        if (viewer.editingMesh) {
            utils.enable(gui.checkBoxes.addingPolytope);
            utils.enable(gui.checkBoxes.removingPoly);
            Model.gravity = 0;
            ground.visible = false;
            gridHelper.visible = false;

            model.resetV();
        }
        else {
            utils.disable(gui.checkBoxes.addingPolytope);
            utils.disable(gui.checkBoxes.removingPoly);
            Model.gravity = 1;
            ground.visible = true;
            gridHelper.visible = true;
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

    lookAtCenter: ()=>{
        controls.target = model.centroid();
    },

    info: ()=>{
        infoJoints.name(model.infoJoints());
        infoBeams.name(model.infoBeams());
    },

    fixJoints: ()=>{
        let ids = [];
        for (let i=0; i<viewer.idSelected.length; i++){
            if (viewer.typeSelected[i] === "joint") {
                ids.push(viewer.idSelected[i]);
            }
        }
        model.fixJoints(ids);
    },

    unfixAll: ()=>{
        model.unfixAll();
    },

    remesh: ()=>{
        let numFiles = document.getElementById("inputFile").files.length;
        if (numFiles === 1) {
            let reader = new FileReader();
            reader.onload = (e) => {
                inputFileString = e.target.result;
                window.inputFileString = inputFileString;
            };
            reader.readAsText(document.getElementById("inputFile").files[0]);
        }
    },

};

function initGUI() {
    dashboard = {};
    dashboard.window = new GUI({name: 'hehe', autoPlace : false});
    // let information = dashboard.window.addFolder('Information');
    // information.add()

    gui = {};
    gui.sliders = {};
    gui.checkBoxes = {};
    gui.window = new GUI();
    let remesh = gui.window.addFolder('remesh');
    let shape = gui.window.addFolder('shape');
    let control = gui.window.addFolder('control');
    let simulation = gui.window.addFolder('simulation');
    let cameraFolder = gui.window.addFolder('camera');
    information = gui.window.addFolder('information');

    let effectController = function () {this.constraint = 0; this.length = 0;};
    gui.effect = new effectController();


    gui.checkBoxes.inflate = control.add(model, 'inflate').listen();
    gui.checkBoxes.deflate = control.add(model, 'deflate').listen();

    gui.checkBoxes.simulate = simulation.add(model, 'simulate').listen();

    gui.checkBoxes.editingMesh = shape.add(viewer, 'editingMesh').listen();
    gui.checkBoxes.addingPolytope = shape.add(viewer, 'addingPolytope').listen();
    gui.checkBoxes.removingPoly = shape.add(viewer, 'removingPoly').listen();

    remesh.add(utils, 'remesh');
    shape.add(utils, 'fixJoints');
    shape.add(utils, 'unfixAll');
    cameraFolder.add(utils, 'lookAtCenter');
    information.add(utils, 'info');
    infoJoints = information.__controllers[0];
    information.add(utils, 'info');
    infoBeams = information.__controllers[1];


    gui.sliders.length = shape.add( gui.effect, "length", -0.2, 0.2, 0.1).listen();
    gui.sliders.constraint = shape.add( gui.effect, "constraint",
                                            0, Model.defaultContraction, Model.defaultContraction/4).listen();

    remesh.open();
    shape.open();
    control.open();
    simulation.open();
    cameraFolder.open();
    information.open();

    // gui functions =============================================
    // constraints
    gui.sliders.constraint.onChange(function(value) {
        for (let i=0; i<viewer.idSelected.length; i++) {
            if (viewer.typeSelected[i] === 'beam') {
                model.constraints[viewer.idSelected[i]] = value;
            }
        }
    });
    gui.sliders.length.onChange(function(value) {
        for (let i=0; i<viewer.idSelected.length; i++) {
            if (viewer.typeSelected[i] === 'beam') {
                model.lm[viewer.idSelected[i]] = Model.defaultMaxLength + value;
            }
        }
    });

    utils.disable(gui.sliders.constraint);
    utils.disable(gui.sliders.length);
    utils.disable(gui.checkBoxes.addingPolytope);
    utils.disable(gui.checkBoxes.removingPoly);
    gui.checkBoxes.deflate.setValue(true);
    gui.checkBoxes.simulate.setValue(true);

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
    };


    gui.checkBoxes.inflate.__checkbox.onclick = gui.checkBoxes.inflate.__li.onclick = () => {
        if (! model.inflate) {
            gui.checkBoxes.deflate.setValue(false);
        }
    };

    gui.checkBoxes.deflate.__checkbox.onclick = gui.checkBoxes.deflate.__li.onclick = () => {
        if (! model.deflate) {
            gui.checkBoxes.inflate.setValue(false);
        }
    }

}

function objectCasted() {
    raycaster.setFromCamera( mouse, camera );
    let intersects = raycaster.intersectObjects( scene.children, true );
    while (intersects.length > 0) {
        let intersect = intersects.shift().object;

        if (intersect.visible && intersect !== gridHelper && intersect !== ground) {

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
    utils.disable(gui.sliders.length);
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
        gui.sliders.length.setValue(Math.round(model.lm[viewer.idSelected[0]] - Model.defaultMaxLength));
    }
    if (viewer.typeSelected.includes("beam")) {
        utils.enable(gui.sliders.constraint);
        utils.enable(gui.sliders.length);
    }

    if (viewer.editingMesh && viewer.idSelected.length === 1 && viewer.typeSelected[0] === "face") {
        if (viewer.addingPolytope) {
            model.addPolytope(viewer.idSelected[0]);
        }
        else if (viewer.removingPoly) {
            model.removePolytope(viewer.idSelected[0]);
        }

        model.recordV();

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
    infoJoints.name(model.infoJoints());
    infoBeams.name(model.infoBeams());

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