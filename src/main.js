//require('../sass/main.scss');
import { THREE } from './Three';
const planck = require('planck-js');

DEBUG = false;

const width = 600;
const height = 500;

const canvas = document.createElement('canvas')
canvas.width = width;
canvas.height = height;

document.getElementById("canvas_goes_here").appendChild(canvas);

const world = planck.World({ gravity: planck.Vec2(0,10)});

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( width, height );
renderer.autoClear=false;

/// testing stuff, replace later
const scene = new THREE.Scene();
const cam = new THREE.OrthographicCamera(width/-2, width/2, height/-2, height/2, 1, 1000);
cam.position.set(0,0,100);
cam.lookAt(new THREE.Vector3(0,0,0));
scene.add(cam);

const linemat = new THREE.LineBasicMaterial({color: 0xffffff});
const geo = new THREE.Geometry();
geo.vertices.push(new THREE.Vector3(-300,0,0));
geo.vertices.push(new THREE.Vector3(300,0,0));
const line = new THREE.Line(geo, linemat);
scene.add(line);

const thingmat = new THREE.MeshBasicMaterial({color: 0x992233 });
const tgeo = new THREE.CircleGeometry(20);
const mesh = new THREE.Mesh(tgeo, thingmat);
mesh.rotation.y = 2 * Math.PI / 2;
mesh.position.set(0,0,0);
scene.add(mesh);

const ground = world.createBody();
ground.createFixture(planck.Edge(planck.Vec2(-300,0), planck.Vec2(300,0)), {
    density: 0.0,
    friction: 0.6
});

const thing = world.createDynamicBody(planck.Vec2(0.0, -250.0));
const circle = thing.createFixture(planck.Circle(),{ density: 1.0 });
console.log(circle);
circle.m_shape.m_radius = 20;

const spin_part  = world.createJoint(planck.WheelJoint({
    motorSpeed : 0.0,
    maxMotorTorque : 20.0,
    enableMotor : true,
    frequencyHz : 4.0,
    dampingRatio : 0.7
  }, thing, circle, thing.getPosition(), planck.Vec2(0.0, 0.0)));


const sgeo = new THREE.PlaneGeometry(10, 10);
const squareMesh = new THREE.Mesh(sgeo, thingmat);
squareMesh.rotation.y = 2 * Math.PI / 2;
squareMesh.position.set(0,0,0);
scene.add(squareMesh);

const box = world.createDynamicBody(planck.Vec2(-150,-10));
const boxFix = box.createFixture(planck.Box(5, 5), { density: .5 });

console.log(thing);

let force=planck.Vec2(0,0);

/// end testing stuff

let paused = true;
const startTime = new Date().getTime();
let lastTime = startTime;
function render() {
    /// DO TICK
    const new_time = new Date().getTime();
    if(!paused) {
        thing.applyForce(force, thing.getWorldCenter());
        world.step(new_time-lastTime);
        console.log(thing);
    }

    if(thing && mesh) {
        const cpos = thing.getPosition();
        mesh.position.set(cpos.x, cpos.y, 0);
    }
    if(box && squareMesh) {
        const cpos = box.getPosition();
        squareMesh.position.set(cpos.x, cpos.y, 0);
    }

    lastTime = new_time;
    //grid.tick(new Date().getTime() - startTime);
    //overlay.tick(new Date().getTime() - startTime);
    requestAnimationFrame( render );
    renderer.clear();
    //renderer.render( grid.scene, player.camera );
    renderer.render(scene, cam);
    renderer.clearDepth();
    //renderer.render(overlay.scene, overlay.cam);
}
render();

console.log('it worked');

document.step = () => { world.step(1); }

document.addEventListener('keydown', (e) => {
    if(e.keyCode == 83)
        document.step();
    else if(e.keyCode == 80)
        paused = !paused;
    else if(e.keyCode == 37) { /// <-
        force = planck.Vec2(-20,0);
    } else if(e.keyCode == 39) { /// ->
        force = planck.Vec2(20,0);
    } else if(e.keyCode == 38) { /// up
        console.log('this');
        force = planck.Vec2(0, -20);
    }
});
