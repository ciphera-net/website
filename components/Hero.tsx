'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Hero() {
  const [text, setText] = useState('Privacy')
  const [isDeleting, setIsDeleting] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)

  // Typewriter effect logic
  useEffect(() => {
    const words = ['Privacy', 'Security', 'Freedom']
    const currentWord = words[wordIndex % words.length]
    const typeSpeed = 150
    const deleteSpeed = 100
    const pauseTime = 2000

    let timer: NodeJS.Timeout

    if (isDeleting) {
      if (text === '') {
        setIsDeleting(false)
        setWordIndex((prev) => prev + 1)
      } else {
        timer = setTimeout(() => {
          setText(text.slice(0, -1))
        }, deleteSpeed)
      }
    } else {
      if (text === currentWord) {
        timer = setTimeout(() => {
          setIsDeleting(true)
        }, pauseTime)
      } else {
        timer = setTimeout(() => {
          setText(currentWord.slice(0, text.length + 1))
        }, typeSpeed)
      }
    }

    return () => clearTimeout(timer)
  }, [text, isDeleting, wordIndex])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-32 overflow-hidden bg-white dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-5xl w-full space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            The Platform for<br />
            <span className="text-brand-orange">{text}</span>
            <span className="animate-pulse text-brand-orange">|</span>
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-brand-orange mb-4">
            Where Privacy Still Exists
          </p>
          <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Ciphera provides privacy-first infrastructure and applications built on zero-knowledge principles. 
            Your data, your control.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/products"
            className="btn-primary text-lg px-8 py-3.5"
          >
            Explore Products
          </Link>
          <Link
            href="/about"
            className="btn-secondary text-lg px-8 py-3.5"
          >
            Learn More
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
