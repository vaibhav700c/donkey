"use client"

import { motion } from "framer-motion"

const testimonials = [
  {
    quote: "Finally, a healthcare platform where patients truly own their data.",
    author: "Dr. Sarah Chen",
    role: "Cardiologist",
  },
  {
    quote: "The blockchain integration gives us unprecedented security and transparency.",
    author: "John Mitchell",
    role: "Hospital Administrator",
  },
  {
    quote: "Claims processing has never been this transparent and efficient.",
    author: "Emma Rodriguez",
    role: "Insurance Claims Officer",
  },
]

export default function TestimonialsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="relative w-full py-24 px-4 bg-gradient-to-b from-background via-accent/5 to-background overflow-hidden">
      <div className="relative z-10 container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Trusted by Healthcare Professionals</h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div key={index} variants={itemVariants}>
              <div className="glass-effect rounded-xl p-8 h-full border-primary/10 hover:border-primary/30 transition-all">
                <div className="text-primary text-2xl mb-4">"</div>
                <p className="text-foreground font-semibold mb-6 leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary" />
                  <div>
                    <div className="text-foreground font-semibold text-sm">{testimonial.author}</div>
                    <div className="text-muted-foreground text-xs">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
