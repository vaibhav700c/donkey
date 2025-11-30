"use client"

import { Suspense } from "react"
import HeroSection from "@/components/hero-section"
import DashboardCards from "@/components/dashboard-cards"
import BlockchainVisualizer from "@/components/blockchain-visualizer"
import FeaturesSection from "@/components/features-section"
import UploadSection from "@/components/upload-section"
import TestimonialsSection from "@/components/testimonials-section"
import Toaster from "@/components/toaster"

export default function Home() {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <BlockchainVisualizer />
      </Suspense>

      <FeaturesSection />
      <UploadSection />
      <TestimonialsSection />
      
      <Toaster />
    </main>
  )
}
