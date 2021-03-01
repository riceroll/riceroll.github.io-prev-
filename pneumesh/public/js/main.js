import * as THREE from '../../node_modules/three/build/three.module.js';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { SelectionBox } from '../../node_modules/three/examples/jsm/interactive/SelectionBox.js';
import { SelectionHelper } from '../../node_modules/three/examples/jsm/interactive/SelectionHelper.js';
import { GUI } from '../../node_modules/three/examples/jsm/libs/dat.gui.module.js';

import { Model } from './model.js';
import { Viewer } from './viewer.js';
import { Remesher } from './remesher.js';

let camera, scene, renderer, controls;
let mouse = new THREE.Vector2();
let mouseDown = false;
let raycaster = new THREE.Raycaster();
let gui;
let dashboard = {};
let information;
let infoJoints, infoBeams;
let inputFileString;
let selectionBox, selectionHelper;

let lastX = 0;
let lastY = 0;

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
    scene.background = new THREE.Color( 0.9, 0.9, 0.9 );

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

    selectionBox = new SelectionBox(camera, scene);
    selectionHelper = new SelectionHelper(selectionBox, renderer, 'selectBox');
    selectionHelper.element.style.display = 'none';
}


let utils = {
    mouseOverGUI : false,

    updateGUI: ()=>{
        if (viewer.editingMesh) {
            utils.enable(gui.checkBoxes.addingPolytope);
            utils.enable(gui.checkBoxes.removingPolytope);
            utils.enable(gui.sliders.rotX);
            utils.enable(gui.sliders.rotY);
            utils.enable(gui.sliders.rotZ);
            Model.gravity = 0;
            ground.visible = false;
            gridHelper.visible = false;

            model.resetV();
        }
        else {
            utils.disable(gui.checkBoxes.addingPolytope, true);
            utils.disable(gui.checkBoxes.removingPolytope, true);
            utils.disable(gui.sliders.rotX, true);
            utils.disable(gui.sliders.rotY, true);
            utils.disable(gui.sliders.rotZ, true);
            Model.gravity = 1;
            ground.visible = true;
            gridHelper.visible = true;
        }
    },

    disable: (obj, hide=false)=>{
        try{
            obj.setValue(0);
        }
        catch(e) {}
        obj.__li.style.pointerEvents = "none";
        obj.__li.style.opacity = .5;

        if (hide) {
            obj.__li.hidden = true;
        }
    },

    enable: (obj)=>{
        obj.__li.style.pointerEvents = "";
        obj.__li.style.opacity = 1.;
        obj.__li.hidden = false;
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

    passive: ()=>{
        for (let i=0; i<viewer.idSelected.length; i++){
            if (viewer.typeSelected[i] === "beam") {
                model.edgeActive[viewer.idSelected[i]] = false;
            }
        }
        utils.enable(gui.sliders.length);
        utils.disable(gui.sliders.maxContraction);

    },

    active: ()=>{
        for (let i=0; i<viewer.idSelected.length; i++){
            if (viewer.typeSelected[i] === "beam") {
                model.edgeActive[viewer.idSelected[i]] = true;
                model.lMax[viewer.idSelected[i]] = Model.defaultMaxLength;
                if (viewer.idSelected.length === 1 && viewer.typeSelected[0] === 'beam') {
                    gui.sliders.maxContraction.setValue(model.maxContraction[viewer.idSelected[0]]);
                }
            }
        }
        utils.enable(gui.sliders.maxContraction);
        utils.disable(gui.sliders.length);
    },

    horizontalize: (controller, checkbox=true)=>{
        let ul = controller.domElement.children[0];
        ul.className = "listHorizontal";
        ul.children[0].className = "";
        for (let i=0; i<ul.children.length; i++) {
            ul.children[i].style.width = (1. / (ul.children.length - 1) * 50).toString() + '%';
            ul.children[i].style.border = "0px";
            ul.children[i].style.padding = "0px";
            ul.children[i].style.margin = "0px";
            try {
                // ul.children[i].children[0].style.paddingLeft = "5px";
                // ul.children[i].children[0].style.width = "30%";
                ul.children[i].children[0].children[1].style.width = "1px";
                if (!checkbox) {
                    ul.children[i].children[0].children[0].style.width = "100%";
                    ul.children[i].children[0].children[0].style.textAlign = "center";
                }
                else {
                    ul.children[i].children[0].children[0].style.display = "none";
                }
            }
            catch (e) {}
            if (i !== 0) {
                ul.children[i].style.borderLeft = "0px";
            }
        }
        ul.children[0].style.width = "50%";
        ul.children[0].style.pointerEvents = "none";
        ul.children[0].style.textIndent = "7px";
    },

    remesh: ()=>{
        alert('server is not turned on.');

    },

    rotate: ()=>{
        let x = gui.sliders.rotX.getValue();
        let y = gui.sliders.rotY.getValue();
        let z = gui.sliders.rotZ.getValue();
        model.rotate(x, y, z);
    },

    load: ()=>{
        let input = document.createElement('input');
        document.body.appendChild(input);
        input.type = 'file';
        input.id = 'inputFile';
        input.style = 'display:none';

        document.getElementById("inputFile").click();
        document.getElementById("inputFile").onchange = ()=>{

            let reader = new FileReader();
            reader.onload = (event) => {
                inputFileString = event.target.result;
                window.inputFileString = inputFileString;
                let data = JSON.parse(inputFileString);
                let v = [];
                let e = Array.from(data.e);
                let f = Array.from(data.f);
                let p = Array.from(data.p);
                for (let i=0; i<data.v.length; i++) {
                    v.push(new thre.Vector3(data.v[i][0], data.v[i][1], data.v[i][2]));
                }
                model.reset();
                if (data.lMax) {
                    let lMax = data.lMax;
                    let maxContraction = data.maxContraction;
                    let fixedVs = data.fixedVs;
                    let edgeChannel = data.edgeChannel;
                    let edgeActive = data.edgeActive;
                    model.loadData(v, e, f, p, lMax, maxContraction, fixedVs, edgeChannel, edgeActive);
                    model.init(false);
                }
                else {
                    model.loadData(v, e, f, p);
                    model.init(true);
                }
                scene.children.splice(4, 1);
                viewer.reset(model);
                scene.add(viewer.mesh);
            };
            reader.readAsText(document.getElementById("inputFile").files[0]);
            document.body.removeChild(input);
        };

    },

    save: ()=>{
        let data = model.saveData();
        let json = JSON.stringify(data);

        let download = document.createElement('a');
        document.body.appendChild(download);
        download.download = 'download.json';
        download.style.display = 'none';
        console.log(json);
        download.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(json);
        download.click();

    },

    selectChannel : (id)=>{
        for (let i=0; i<viewer.idSelected.length; i++){
            if (viewer.typeSelected[i] === "beam") {
                model.edgeChannel[viewer.idSelected[i]] = id;
            }
        }
    },

    chooseChannel: {
        '0': (i=0)=>{utils.selectChannel(i)},
        '1': (i=1)=>{utils.selectChannel(i)},
        '2': (i=2)=>{utils.selectChannel(i)},
        '3': (i=3)=>{utils.selectChannel(i)}
    }
};



function initGUI() {
    dashboard = {};
    dashboard.window = new GUI({name: 'hehe', autoPlace : false});
    // let information = dashboard.window.addFolder('Information');
    // information.add()

    gui = {};
    gui.sliders = {};
    gui.checkBoxes = {};
    gui.buttons = {};
    gui.folders = {};
    gui.window = new GUI();

    let effectController = function () {
        this.maxContraction = Model.maxMaxContraction;
        this.length = 0;
        this.friction = Model.frictionFactor;
        this.rotX = 0;
        this.rotY = 0;
        this.rotZ = 0;
    };
    gui.effect = new effectController();

    let file = gui.window.addFolder('file');
    file.open();
    file.add(utils, 'load');
    file.add(utils, 'save');
    // file.add(utils, 'remesh');

    let shape = gui.window.addFolder('shape');
    shape.open();
    gui.checkBoxes.editingMesh = shape.add(viewer, 'editingMesh').listen();
    gui.checkBoxes.addingPolytope = shape.add(viewer, 'addingPolytope').listen();
    gui.checkBoxes.removingPolytope = shape.add(viewer, 'removingPolytope').listen();
    gui.sliders.rotX = shape.add( gui.effect, "rotX", -3.14, 3.14, 0.01).listen();
    gui.sliders.rotY = shape.add( gui.effect, "rotY", -3.14, 3.14, 0.01).listen();
    gui.sliders.rotZ = shape.add( gui.effect, "rotZ", -3.14, 3.14, 0.01).listen();

    shape.add(utils, 'fixJoints');
    shape.add(utils, 'unfixAll');

    gui.folders.passive = gui.window.addFolder('type');
    gui.folders.passive.open();
    gui.buttons.passive = [];
    gui.buttons.passive.push(gui.folders.passive.add(utils, "active"));
    gui.buttons.passive.push(gui.folders.passive.add(utils, "passive"));
    utils.horizontalize(gui.folders.passive, false);


    gui.sliders.length = shape.add( gui.effect, "length", -0.5, 0.0, 0.1).listen();
    gui.sliders.maxContraction = shape.add( gui.effect, "maxContraction",
        0, Model.maxMaxContraction, Model.maxMaxContraction/4).listen();

    gui.folders.channel = gui.window.addFolder('setChannel');
    gui.folders.channel.open();
    gui.buttons.channel = [];
    for (let i=0; i<model.numChannels; i++) {
        gui.buttons.channel.push(gui.folders.channel.add(utils.chooseChannel, i.toString()));
    }
    utils.horizontalize(gui.folders.channel, false);

    gui.folders.inflate = gui.window.addFolder('inflate');
    gui.folders.inflate.open();
    gui.checkBoxes.inflateChannel = [];
    for (let i=0; i<model.numChannels; i++) {
        gui.checkBoxes.inflateChannel.push(gui.folders.inflate.add(model.inflateChannel, i.toString()).listen());
    }
    utils.horizontalize(gui.folders.inflate);

    gui.folders.deflate = gui.window.addFolder('deflate');
    gui.folders.deflate.open();
    gui.checkBoxes.deflateChannel = [];
    for (let i=0; i<model.numChannels; i++) {
        gui.checkBoxes.deflateChannel.push(gui.folders.deflate.add(model.deflateChannel, i.toString()).listen());
    }
    utils.horizontalize(gui.folders.deflate);

    for (let i=0; i<model.numChannels; i++) {
        gui.checkBoxes.inflateChannel[i].__li.children[0].children[1].children[0].onchange = ()=>{
            gui.checkBoxes.deflateChannel[i].setValue(false);
        };

        gui.checkBoxes.deflateChannel[i].__li.children[0].children[1].children[0].onchange = ()=>{
            gui.checkBoxes.inflateChannel[i].setValue(false);
        };
    }

    let simulation = gui.window.addFolder('simulation');
    simulation.open();
    gui.checkBoxes.gravity = simulation.add(model, 'gravity').listen();
    gui.sliders.friction = simulation.add( gui.effect, "friction", 0.0, 3.0, 0.1).listen();
    gui.checkBoxes.simulate = simulation.add(model, 'simulate').listen();

    let view = gui.window.addFolder('view');
    view.open();
    view.add(utils, 'lookAtCenter');
    let showChannel = view.add(viewer, 'showChannel').listen();
    showChannel.domElement.onchange = () => {
        viewer.updateMeshes();
    };

    information = gui.window.addFolder('information');
    // information.open();
    information.add(utils, 'info');
    infoJoints = information.__controllers[0];
    information.add(utils, 'info');
    infoBeams = information.__controllers[1];


    // gui functions =============================================
    // maxContraction
    gui.sliders.maxContraction.__li.onclick =
        () => {
            for (let i=0; i<viewer.idSelected.length; i++) {
                if (viewer.typeSelected[i] === 'beam') {
                    model.maxContraction[viewer.idSelected[i]] = gui.sliders.maxContraction.getValue();
                }
            }
    };
    gui.sliders.length.__li.onclick =
        () => {
            for (let i=0; i<viewer.idSelected.length; i++) {
                if (viewer.typeSelected[i] === 'beam') {
                    model.lMax[viewer.idSelected[i]] = Model.defaultMaxLength + gui.sliders.length.getValue();
                }
            }
    };
    gui.sliders.friction.__li.onclick =
        () => {
            Model.frictionFactor = gui.sliders.friction.getValue()
        };

    gui.sliders.rotX.__li.onmousemove = utils.rotate;
    gui.sliders.rotY.__li.onmousemove = utils.rotate;
    gui.sliders.rotZ.__li.onmousemove = utils.rotate;

    utils.disable(gui.sliders.maxContraction);
    utils.disable(gui.sliders.length);
    utils.disable(gui.checkBoxes.addingPolytope, true);
    utils.disable(gui.checkBoxes.removingPolytope, true);
    utils.disable(gui.sliders.rotX, true);
    utils.disable(gui.sliders.rotY, true);
    utils.disable(gui.sliders.rotZ, true);
    // gui.checkBoxes.deflate.setValue(true);
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
        gui.checkBoxes.removingPolytope.setValue(false);
    };

    gui.checkBoxes.removingPolytope.__checkbox.onclick = gui.checkBoxes.removingPolytope.__li.onclick = () => {
        gui.checkBoxes.addingPolytope.setValue(false);
    };


    // gui.checkBoxes.inflate.__checkbox.onclick = gui.checkBoxes.inflate.__li.onclick = () => {
    //     if (! model.inflate) {
    //         gui.checkBoxes.deflate.setValue(false);
    //     }
    // };
    //
    // gui.checkBoxes.deflate.__checkbox.onclick = gui.checkBoxes.deflate.__li.onclick = () => {
    //     if (! model.deflate) {
    //         gui.checkBoxes.inflate.setValue(false);
    //     }
    // }

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

function select(obj) {
    if (!obj) return 0;

    if (!obj.userData.type) return 0;   // unpredicted object type, e.g. GridHelper

    if (!obj.visible) return 0;

    // deselect with meta pressed
    let existed = false;
    let iExisted = -1;
    for (let i=0; i<viewer.idSelected.length; i++) {
        if (viewer.idSelected[i] === obj.userData.id && viewer.typeSelected[i] === obj.userData.type) {
            existed = true;
            iExisted = i;
        }
    }

    if (existed) {
        if (viewer.pressingMeta) {
            viewer.idSelected.splice(iExisted, 1);
            viewer.typeSelected.splice(iExisted, 1);
        }
    }
    else {
        viewer.idSelected.push(obj.userData.id);
        viewer.typeSelected.push(obj.userData.type);
    }

    if (viewer.typeSelected.includes("beam")) {
        let anyActive = false;
        let anyPassive = false;
        for (let i=0; i<viewer.typeSelected.length; i++) {
            let id = viewer.idSelected[i];
            if (model.edgeActive[id]) {
                anyActive = true;
            }
            else {
                anyPassive = true;
            }
        }
        if (!anyPassive) {
            utils.enable(gui.sliders.maxContraction);
        }
        if (!anyActive) {
            utils.enable(gui.sliders.length);
        }
    }
}

function onMouseClick(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    if (utils.mouseOverGUI) {
        return 0;
    }

    utils.disable(gui.sliders.maxContraction);
    utils.disable(gui.sliders.length);
    let obj = objectCasted();

    select(obj);

    //slider
    if (viewer.idSelected.length === 1 && viewer.typeSelected[0] === 'beam') {
        gui.sliders.maxContraction.setValue(model.maxContraction[viewer.idSelected[0]]);
        gui.sliders.length.setValue(model.lMax[viewer.idSelected[0]] - Model.defaultMaxLength);
    }

    if (viewer.editingMesh && viewer.idSelected.length === 1 && viewer.typeSelected[0] === "face") {
        if (viewer.addingPolytope) {
            model.addPolytope(viewer.idSelected[0]);
        }
        else if (viewer.removingPolytope) {
            model.removePolytope(viewer.idSelected[0]);
        }

        model.recordV();

        viewer.idSelected = [];
        viewer.typeSelected = [];
        viewer.createAll();

    }


}

function onMouseDown(event) {
    mouseDown = true;
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    lastX = mouse.x;
    lastY = mouse.y;
    selectionBox.startPoint.set(mouse.x, mouse.y, 0.5);

}

function onMouseUp(event) {
    mouseDown = false;
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    if (utils.mouseOverGUI) {
        return 0;
    }

    let obj = objectCasted();

    if (Math.abs(mouse.x - lastX + mouse.y - lastY) < 0.02) {
        if (!obj) {
            viewer.typeSelected = [];
            viewer.idSelected = [];
        }
    }
}

function onMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    if (mouseDown && viewer.pressingShift) {
        viewer.typeSelected = [];
        viewer.idSelected = [];

        selectionBox.endPoint.set(mouse.x, mouse.y, 0.5);
        selectionBox.select();
        for (let i=0; i<selectionBox.collection.length; i++) {
            select(selectionBox.collection[i]);
        }
    }
    else {
        let obj = objectCasted();

        if (obj) {
            viewer.idHovered = obj.userData.id;
            viewer.typeHovered = obj.userData.type;
        }
        else {
            viewer.idHovered = null;
            viewer.typeHovered = null;
        }
    }
}

function onKeyDown( e ) {
    viewer.pressingMeta = e.key === 'Meta';
    if (e.key === "Shift") {
        viewer.pressingShift = true;
        controls.enabled = false;
        selectionHelper.element.style.display = "block";
    }
}


function onKeyUp( e ) {
    if (e.key === 'Meta') {
        viewer.pressingMeta = false;
    }
    if (e.key === "Shift") {
        viewer.pressingShift = false;
        controls.enabled = true;
        selectionHelper.element.style.display = "none";
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
window.addEventListener( 'mouseup', onMouseUp, false );
window.addEventListener( 'mousemove', onMouseMove, false );
window.addEventListener( 'mousedown', onMouseDown, false );
window.addEventListener( 'keydown', onKeyDown, false );
window.addEventListener( 'keyup', onKeyUp, false );

window.model = model;
window.viewer = viewer;
window.v = Viewer;
window.scene = scene;
window.thre = THREE;
window.camera = camera;
window.renderer = renderer;
// window.controls = controls;
window.gui = gui;
window.utils = utils;
window.selectionBox = selectionBox;
window.controls = controls;
window.selectionHelper = selectionHelper;