"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { motion } from "framer-motion"

export default function BlockchainVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    // Create blockchain nodes
    const nodes: THREE.Mesh[] = []
    const nodeCount = 12
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2
      const x = Math.cos(angle) * 5
      const y = Math.sin(angle) * 5

      const nodeGeometry = new THREE.SphereGeometry(0.3, 32, 32)
      const nodeMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffb2,
        emissive: 0x00ffb2,
        emissiveIntensity: 0.6,
      })
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial)
      node.position.set(x, y, 0)
      nodes.push(node)
      scene.add(node)
    }

    // Create connections
    const lineGeometry = new THREE.BufferGeometry()
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x0ce1a5,
      transparent: true,
      opacity: 0.5,
    })

    const positions: number[] = []
    for (let i = 0; i < nodeCount; i++) {
      const nextNode = nodes[(i + 1) % nodeCount]
      positions.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z)
      positions.push(nextNode.position.x, nextNode.position.y, nextNode.position.z)
    }

    lineGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3))
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)

    // Add radial lines
    const radialGeometry = new THREE.BufferGeometry()
    const radialMaterial = new THREE.LineBasicMaterial({
      color: 0x1aff96,
      transparent: true,
      opacity: 0.3,
    })

    const radialPositions: number[] = []
    for (let i = 0; i < nodeCount; i += 2) {
      radialPositions.push(0, 0, 0)
      radialPositions.push(nodes[i].position.x, nodes[i].position.y, nodes[i].position.z)
    }

    radialGeometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(radialPositions), 3))
    const radialLines = new THREE.LineSegments(radialGeometry, radialMaterial)
    scene.add(radialLines)

    // Lighting
    const light = new THREE.PointLight(0x00ffb2, 1.5, 100)
    light.position.set(10, 10, 10)
    scene.add(light)

    scene.add(new THREE.AmbientLight(0xffffff, 0.3))

    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      nodes.forEach((node, index) => {
        node.rotation.x += 0.01
        node.rotation.y += 0.01
        node.position.z += Math.sin(Date.now() * 0.0003 + index) * 0.02
      })

      lines.rotation.z += 0.001
      radialLines.rotation.z -= 0.002

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!containerRef.current) return
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <section className="relative w-full py-24 px-4 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-20" />

      <div className="relative z-10 container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blockchain Security Network</h2>
          <p className="text-lg text-muted-foreground">Encrypted data connections with zero-knowledge verification</p>
        </motion.div>

        <motion.div
          ref={containerRef}
          className="w-full h-96 rounded-2xl overflow-hidden glass-effect-strong border-primary/20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </section>
  )
}
