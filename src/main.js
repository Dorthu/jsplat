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

const world = planck.World({ gravity: planck.Vec2(0,-10)});

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

const thingmat = new THREE.SpriteMaterial({color: 0x992233 });
const tgeo = new THREE.PlaneGeometry(20,20);
const mesh = new THREE.Sprite(thingmat);
mesh.scale.set(40,40);
mesh.position.set(0,0,0);
scene.add(mesh);

const ground = world.createBody();
ground.createFixture(planck.Edge(planck.Vec2(-300,0), planck.Vec2(300,0)), {
    density: 0.0,
    friction: 0.6
});

const thing = world.createDynamicBody(planck.Vec2(20.0, -50.0));
thing.createFixture(planck.Polygon([ planck.Vec2(20.0,20.0), planck.Vec2(-20.0, 20.0),
        planck.Vec2(-20.0, -20.0), planck.Vec2(20.0, -20.0) ]));

console.log(thing);

/// end testing stuff

const startTime = new Date().getTime();
function render() {
    /// DO TICK
    if(thing && mesh) {
        const cpos = thing.getPosition();
        mesh.position.set(cpos.x, cpos.y, 0);
    }

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
