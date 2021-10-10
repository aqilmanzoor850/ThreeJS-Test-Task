import gsap from 'gsap';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const gui = new dat.GUI()

const raycaster = new THREE.Raycaster()

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000 )
const renderer = new THREE.WebGLRenderer()

renderer.setSize(innerWidth, innerHeight)

renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

camera.position.z = 5

const planeGeometry = new THREE.PlaneGeometry(19, 19, 17, 17)

const planMaterial = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  flatShading: THREE.FlatShading,
  vertexColors: true
})

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

  for (let i = 0; i < array.length; i++) {
    const x = array[i]
    const y = array[i + 1]
    const z = array[i + 2]
    array[i  + 2] = z + Math.random()
  }
  const colors = []
  for (let i = 0; i < planMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4)
  }

  planMesh.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  )
}

const { array } = planMesh.geometry.attributes.position

for (let i = 0; i < array.length; i++) {
  const x = array[i]
  const y = array[i + 1]
  const z = array[i + 2]
  array[i  + 2] = z + Math.random()
}

const colors = []
for (let i = 0; i < planMesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4)
}

planMesh.geometry.setAttribute(
  'color',
  new THREE.BufferAttribute(new Float32Array(colors), 3)
)

const light = new THREE.DirectionalLight(0xffffff, 1)

light.position.set(0, 0, 1)

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

  raycaster.setFromCamera(mouse, camera)
  const intersets = raycaster.intersectObject(planMesh)
  if (intersets.length > 0) {
    const { color } = intersets[0].object.geometry.attributes
    color.setX(intersets[0].face.a, 0.1)
    color.setY(intersets[0].face.a, 0.5)
    color.setZ(intersets[0].face.a, 1)
    color.setX(intersets[0].face.b, 0.1)
    color.setY(intersets[0].face.b, 0.5)
    color.setZ(intersets[0].face.b, 1)
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
        color.setX(intersets[0].face.b, hoverColor.r)
        color.setY(intersets[0].face.b, hoverColor.g)
        color.setZ(intersets[0].face.b, hoverColor.b)
        color.setX(intersets[0].face.c, hoverColor.r)
        color.setY(intersets[0].face.c, hoverColor.g)
        color.setZ(intersets[0].face.c, hoverColor.b)
        color.needsUpdate = true
      }
    })
  }
}

animate()


addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1
  mouse.y = -(event.clientY / innerHeight) * 2 + 1
})
