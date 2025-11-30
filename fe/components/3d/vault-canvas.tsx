"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"

interface VaultCanvasProps {}

export default function VaultCanvas({}: VaultCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const vaultRef = useRef<THREE.Group | null>(null)
  const [showMeme, setShowMeme] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.z = 12 // Zoomed out to prevent cropping
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Create main group (donkey with rings around it)
    const vaultGroup = new THREE.Group()
    vaultRef.current = vaultGroup
    scene.add(vaultGroup)

    // Load 3D Donkey Model from Sketchfab
    const loader = new GLTFLoader()
    let donkeyModel: THREE.Group | null = null

    // Load your Sketchfab donkey model
    loader.load(
      '/models/donkey.glb', // Put your downloaded donkey.glb file here
      (gltf) => {
        // Success - donkey model loaded!
        donkeyModel = gltf.scene
        
        // Scale and position the donkey - SMALLER SIZE and positioned down
        donkeyModel.scale.set(0.55, 0.55, 0.55) // Perfect size
        donkeyModel.position.set(0, -3, -1) // Moved further down on Y-axis
        
        // Apply green color to the donkey matching the rings
        donkeyModel.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Override material with green color
            if (child.material) {
              child.material.color = new THREE.Color(0xffffff) // Same green as rings
              child.material.emissive = new THREE.Color(0xffffff)
              child.material.emissiveIntensity = 0.3 // Glowing green
              child.material.metalness = 0.5 // Add some metallic look
              child.material.roughness = 0.5
            }
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        
        vaultGroup.add(donkeyModel)
        console.log('✅ Sketchfab donkey model loaded successfully!')
      },
      (progress) => {
        console.log('🔄 Loading donkey model:', (progress.loaded / progress.total * 100).toFixed(1) + '% loaded')
      },
      (error) => {
        console.error('❌ Error loading donkey model:', error)
        console.log('💡 Make sure your donkey.glb file is in /public/models/ folder')
        
        // Fallback: Simple donkey shape if model fails to load
        createSimpleDonkey()
      }
    )

    // Fallback function - creates simple donkey if 3D model fails
    function createSimpleDonkey() {
      const simpleDonkey = new THREE.Group()
      
      // Body
      const bodyGeometry = new THREE.SphereGeometry(0.5, 16, 12)
      bodyGeometry.scale(1.5, 1.0, 1.0)
      const donkeyMaterial = new THREE.MeshPhongMaterial({
        color: 0x8B7D6B, // Donkey gray-brown
        emissive: 0x004d3f,
        emissiveIntensity: 0.1,
      })
      const body = new THREE.Mesh(bodyGeometry, donkeyMaterial)
      simpleDonkey.add(body)

      // Head
      const headGeometry = new THREE.SphereGeometry(0.3, 12, 10)
      const head = new THREE.Mesh(headGeometry, donkeyMaterial)
      head.position.set(0.7, 0.2, 0)
      simpleDonkey.add(head)

      // Long donkey ears (signature feature!)
      const earGeometry = new THREE.CylinderGeometry(0.05, 0.08, 0.4, 8)
      const leftEar = new THREE.Mesh(earGeometry, donkeyMaterial)
      leftEar.position.set(0.6, 0.5, 0.15)
      leftEar.rotation.z = -0.3
      leftEar.rotation.x = 0.2
      simpleDonkey.add(leftEar)
      
      const rightEar = new THREE.Mesh(earGeometry, donkeyMaterial)
      rightEar.position.set(0.6, 0.5, -0.15)
      rightEar.rotation.z = 0.3
      rightEar.rotation.x = 0.2
      simpleDonkey.add(rightEar)

      donkeyModel = simpleDonkey
      vaultGroup.add(simpleDonkey)
      console.log('📦 Using fallback simple donkey geometry')
    }

    // Rotating rings around donkey - LARGER rings with reduced brightness
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(2.5 + i * 0.5, 0.1, 32, 100)
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffb2,
        emissive: 0x00ffb2,
        emissiveIntensity: 0.25, // Reduced from 0.6 to 0.25 for less brightness
        transparent: true,
        opacity: 0.5, // Added transparency
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.castShadow = true

      if (i === 0) ring.rotation.x = Math.PI / 2
      if (i === 1) ring.rotation.y = Math.PI / 2.5
      if (i === 2) ring.rotation.z = Math.PI / 3

      vaultGroup.add(ring)
    }

    // Glowing particles inside vault
    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 100
    const positionArray = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positionArray[i] = (Math.random() - 0.5) * 4.8
      positionArray[i + 1] = (Math.random() - 0.5) * 4.8
      positionArray[i + 2] = (Math.random() - 0.5) * 4.8
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positionArray, 3))
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00ffb2,
      size: 0.08,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    vaultGroup.add(particles)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x00ffb2, 1, 100)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x1aff96, 0.8, 100)
    pointLight2.position.set(-5, -5, 5)
    scene.add(pointLight2)

    // Click handler for donkey meme
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current || !donkeyModel) return
      
      const rect = containerRef.current.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(donkeyModel.children, true)
      
      if (intersects.length > 0) {
        setShowMeme(true)
        // Play the meme sound effect
        if (audioRef.current) {
          audioRef.current.currentTime = 0
          audioRef.current.play().catch(err => console.log('Audio play failed:', err))
        }
      }
    }
    
    containerRef.current.addEventListener('click', handleClick)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Animate the donkey model if loaded
      if (donkeyModel) {
        donkeyModel.rotation.y += 0.01 // Slow rotation around Y-axis
        donkeyModel.position.y = -2.5 + Math.sin(Date.now() * 0.002) * 0.1 // Gentle floating motion PLUS base offset
      }

      // Rotate rings around donkey
      vaultGroup.children.forEach((child, index) => {
        if (child instanceof THREE.Mesh) { // These are the rings
          child.rotation.x += 0.005 * (index % 2 === 0 ? 1 : -1)
          child.rotation.y += 0.004 * (index % 2 === 0 ? -1 : 1)
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeEventListener('click', handleClick)
      }
      cancelAnimationFrame(animationId)
      renderer.dispose()
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <>
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Hidden audio element with loop */}
      <audio
        ref={audioRef}
        src="/memesfx.mp3"
        preload="auto"
        loop
      />
      
      {/* Full-screen meme overlay */}
      {showMeme && (
        <div
          className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => {
            setShowMeme(false)
            if (audioRef.current) {
              audioRef.current.pause()
              audioRef.current.currentTime = 0
            }
          }}
        >
          <img
            src="/meme.gif"
            alt="Meme"
            className="w-[85%] h-[85%] object-contain"
          />
        </div>
      )}
    </>
  )
}
