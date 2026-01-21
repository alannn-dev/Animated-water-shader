import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import waterVertexShader from './shaders/water/vertex.glsl'
import waterVertexFragment from './shaders/water/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new GUI({ width: 340 })
const debugObject = {}

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 512, 512)

// Color
debugObject.depthColor = '#0e6590',
debugObject.surfaceColor = '#34a0d5'


// Material
const waterMaterial = new THREE.ShaderMaterial({

    vertexShader: waterVertexShader,
    fragmentShader: waterVertexFragment,
    uniforms: 
    {
        // BIG WAVES
        uTime: { value: 0},
        uBigWavesElevation: { value: 0.2},
        // For different frequency control on X and Y.
        uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
        // Waves speed
        uBigWavesSpeed: { value: 0.75},

        // SMALL WAVES
        uSmallWavesElevation: { value: 0.15},
        // For different frequency control on X and Y.
        uSmallWavesFrequency: { value: 3.0 },
        // Waves speed
        uSmallWavesSpeed: { value: 0.2},
        uSmallWavesIterations: { value: 4.0},

        // Color debug
        uDepthColor: {value: new THREE.Color(debugObject.depthColor) },
        uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
        
        // uColorOffset allows to shift the gradient up or down.
        uColorOffset: { value: 0.2},
        // uColorMultiplier is used to accentuate the contrast
        uColorMultiplier: { value: 7 },
    }
})

// Debug
gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(0.001).name('uBigWavesElevation');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x').min(0).max(10).step(0.001).name('uBigWavesFrequencyX');
gui.add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y').min(0).max(10).step(0.001).name('uBigWavesFrequencyY');
gui.add(waterMaterial.uniforms.uBigWavesSpeed, 'value').min(0).max(10).step(0.001).name('uBigWavesSpeed');

gui.add(waterMaterial.uniforms.uSmallWavesElevation, 'value').min(0).max(1).step(0.001).name('uSmallWavesElevation');
gui.add(waterMaterial.uniforms.uSmallWavesFrequency, 'value').min(0).max(30).step(0.001).name('uSmallWavesFrequencyX');
gui.add(waterMaterial.uniforms.uSmallWavesSpeed, 'value').min(0).max(10).step(0.001).name('uSmallWavesSpeed');
gui.add(waterMaterial.uniforms.uSmallWavesIterations, 'value').min(0).max(5).step(1).name('uSmallWavesIterations');

gui.addColor(
    debugObject, 'depthColor')
    .name('depthColor')
    .onChange(() =>
        {
            waterMaterial.uniforms.uDepthColor.value.set(debugObject.depthColor)
        }
    );
gui.addColor(
    debugObject, 'surfaceColor')
    .name('surfaceColor')
    .onChange(() =>
        {
            waterMaterial.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
        }
    );

gui.add(waterMaterial.uniforms.uColorOffset, 'value').min(0).max(1).step(0.001).name('uColorOffset');
gui.add(waterMaterial.uniforms.uColorMultiplier, 'value').min(0).max(10).step(0.001).name('uColorMultiplier');


// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial)
water.rotation.x = - Math.PI * 0.5
scene.add(water)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(1, 1, 1)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update water
    waterMaterial.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()