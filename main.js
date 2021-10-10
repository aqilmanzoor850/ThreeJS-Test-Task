import gsap from 'gsap';
//library for animation
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

console.log(OrbitControls)
const gui = new dat.GUI()

// contain the object which actually need to be editted within our actual THREE.js

const raycaster = new THREE.Raycaster()
// It tell user where our pointer is relative to the scene. It check our pointer is touching anything or not.

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000 )
//Arguments
//1st is the 
//2nd is the aspect ratio of the screen means complete width or complete height
//3rd argument is the cliping plan that how close is the object need to be the camera before actually clipped out of the scene
//For near clipping plan we are going to putting 0.1 and for the far clipping plan we are going to put 1000. means we are seen between 0.1 to 1000 and anything pass a thousand
// we are not able to see
const renderer = new THREE.WebGLRenderer()
// render is basically a canvas html element that runs webgl
// Webgl is a framework that is required to run 3d on the web page. So we put this canvas object directly to html and by this put JS into html


renderer.setSize(innerWidth, innerHeight)

renderer.setPixelRatio(devicePixelRatio)
// This is used to remove jaggingness
document.body.appendChild(renderer.domElement)
// THis will show a black box called canvas and inside canvas we can run WebGL that is used to run 3d stuff in the browser.

new OrbitControls(camera, renderer.domElement)

//Geometry is basically the wireframe of the object. It contains data relating to all of the object vertices which actually start piecing together the object such as box so
// so we will have vertices at different location and connects the vertices into a box shape and second thing we need is a material 
// Material is what goes on top of the geometry to actually fill in everything in between 
// Vertics are points that create some sort of wirefram but to fill in that wireframe we need some sort of material in place which is basically painting the faces of the box
// Material and Geometry create a mesh

// const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// //It contain three arguments
// // 1st is the width eg 1 foot
// // 2nd is the length eg 1 foot
// // 3rd is the height eg 1 foot

// const material = new THREE.MeshBasicMaterial({
//   color: 0x00FF00
// })
// //It contain the argument as am object
// // 1st is the color that contain HEXADECIMAL for a color



// const mesh = new THREE.Mesh(boxGeometry, material)
// // It contain 2 arguments -> Geometry and material


// //Now we use mesh into a renderer using a scene

// scene.add(mesh)
camera.position.z = 5

const planeGeometry = new THREE.PlaneGeometry(19, 19, 17, 17)
// Containe four arguments 
// 1st is the width with float datatype
// 2nd is the height with float datatype as well
// 3rd is the widthSegment with integer datatype
// 4th is the heightSegment with integer datatype

const planMaterial = new THREE.MeshPhongMaterial({
  // color: 0xff0000,
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
})
// MeshPongMaterial react to the light going to use mesh material
// After this we will see black colors w.r.t red color as before in order to view we make sure we have a light on a scene to actually illuminate it
const planMesh = new THREE.Mesh(planeGeometry, planMaterial)
scene.add(planMesh)
const world = {
  plane: {
    width: 19,
    height: 19,
    widhtSegments: 17,
    heightSegments: 17
  }
}
gui.add(world.plane, 'width', 1, 20).onChange(generatePlan)
gui.add(world.plane, 'height', 1, 20).onChange(generatePlan)
gui.add(world.plane, 'widhtSegments', 1, 50).onChange(generatePlan)
gui.add(world.plane, 'heightSegments', 1, 50).onChange(generatePlan)

function generatePlan() {
  planMesh.geometry.dispose()
  planMesh.geometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widhtSegments, world.plane.heightSegments)

  const { array } = planMesh.geometry.attributes.position
  //This will contain all the vertics of a geometry that is around 363

  for (let i = 0; i < array.length; i++) {
    const x = array[i]
    const y = array[i + 1]
    const z = array[i + 2]
    array[i  + 2] = z + Math.random()
  }
  const colors = []
  for (let i = 0; i < planMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4)
    // Color for rgb
  }

  planMesh.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  )
}

const { array } = planMesh.geometry.attributes.position
//This will contain all the vertics of a geometry that is around 363

for (let i = 0; i < array.length; i++) {
  const x = array[i]
  const y = array[i + 1]
  const z = array[i + 2]
  array[i  + 2] = z + Math.random()
}

const colors = []
for (let i = 0; i < planMesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4)
  // Color for rgb
}

planMesh.geometry.setAttribute(
  'color',
  new THREE.BufferAttribute(new Float32Array(colors), 3)
)

const light = new THREE.DirectionalLight(0xffffff, 1)
// Contain two arguments
// 1 Color of a light
// 2 Intensity of a light

light.position.set(0, 0, 1)
//contain 3 arguments that is x, y and z axis

const backLight = new THREE.DirectionalLight(0xffffff, 1)
backLight.position.set(0, 0, -1)

scene.add(light)
scene.add(backLight)

const mouse = {
  x: undefined,
  y: undefined
}

function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
  // mesh.rotation.x += 0.01
  // mesh.rotation.y += 0.01
  // mesh.rotation.z += 0.01
  // this will render scene and camera
  // planMesh.rotation.x += 0.01
  // planMesh.rotation.y+= 0.01
  // planMesh.rotation.z += 0.01'

  raycaster.setFromCamera(mouse, camera)
  const intersets = raycaster.intersectObject(planMesh)
  if (intersets.length > 0) {
    const { color } = intersets[0].object.geometry.attributes
    //Vertice 1 where X represent r from rgba
    color.setX(intersets[0].face.a, 0.1)
    color.setY(intersets[0].face.a, 0.5)
    color.setZ(intersets[0].face.a, 1)
    //Vertice 2 where X represent r from rgba
    color.setX(intersets[0].face.b, 0.1)
    color.setY(intersets[0].face.b, 0.5)
    color.setZ(intersets[0].face.b, 1)
    //Vertice 3 where X represent r from rgba
    color.setX(intersets[0].face.c, 0.1)
    color.setY(intersets[0].face.c, 0.5)
    color.setZ(intersets[0].face.c, 1)

    color.needsUpdate = true

    const initialColor = {
      r: 0,
      g: 0.19,
      b: 0.4
    }
    const hoverColor = {
      r: 0.1,
      g: 0.5,
      b: 1
    }
    gsap.to(hoverColor, {
      r: initialColor.r,
      g: initialColor.g,
      b: initialColor.b,
      onUpdate: () => {
        color.setX(intersets[0].face.a, hoverColor.r)
        color.setY(intersets[0].face.a, hoverColor.g)
        color.setZ(intersets[0].face.a, hoverColor.b)
        //Vertice 2 where X represent r from rgba
        color.setX(intersets[0].face.b, hoverColor.r)
        color.setY(intersets[0].face.b, hoverColor.g)
        color.setZ(intersets[0].face.b, hoverColor.b)
        //Vertice 3 where X represent r from rgba
        color.setX(intersets[0].face.c, hoverColor.r)
        color.setY(intersets[0].face.c, hoverColor.g)
        color.setZ(intersets[0].face.c, hoverColor.b)
        color.needsUpdate = true
      }
    })

    //This will return color to original color after hover
  }
  // THis will check our mouse is interect with the mash on a screen
}

// This will animation function that is used to call it self for animation over and over again and again

animate()


addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})

// In the browser mouse coordinates is 0 from left and down but in THREE.js is center is 0;