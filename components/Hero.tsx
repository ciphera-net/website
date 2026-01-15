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
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 pt-12 pb-32 overflow-hidden bg-white dark:bg-neutral-950 transition-colors duration-300">
      {/* * Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-orange/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 rounded-full blur-[120px]" />
        
        {/* * Grid pattern for Hero */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] [mask-image:linear-gradient(to_bottom,black,transparent)] pointer-events-none" 
             style={{ 
               backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
               backgroundSize: '40px 40px'
             }} 
        />
      </div>

      <div className="max-w-5xl w-full space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 dark:text-white mb-8 leading-[1.1]">
            Where <br />
            <span className="text-brand-orange relative inline-block">
              Privacy
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 180 20" fill="none">
                <path d="M5 15C30 5 120 5 175 15" stroke="#FD5E0F" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
              </svg>
            </span> Still Exists
          </h1>
          
          <p className="text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed font-medium">
            Ciphera is more than a suite of apps. We are building the <span className="text-neutral-900 dark:text-white underline decoration-brand-orange/30 decoration-2 underline-offset-4">privacy-first infrastructure layer</span> for a new era of the internet.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            href="/products"
            className="btn-primary text-lg px-10 py-4 group"
          >
            Discover Ecosystem
            <svg className="inline-block ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link
            href="/about"
            className="btn-secondary text-lg px-10 py-4"
          >
            The Mission
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
