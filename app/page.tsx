'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Users, Heart, Zap } from 'lucide-react'
import { SITE_CONFIG, COMMUNITY_VALUES } from '@/lib/constants'
import IvorChatbot from '@/components/blkout/IvorChatbot'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blkout-deep via-blkout-accent to-blkout-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-14 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pt-20 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mx-auto mb-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
            >
              <span className="mr-2">🏳️‍🌈</span>
              Building cooperative ownership together
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-7xl"
            >
              {SITE_CONFIG.name}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-100"
            >
              {SITE_CONFIG.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-blkout-primary shadow-lg transition-all hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blkout-primary"
              >
                Join Our Community
                <ArrowRight className="ml-2 h-4 w-4 inline" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blkout-primary"
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blkout-secondary to-blkout-warm opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white/5 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Our Community Values
            </h2>
            <p className="mt-4 text-lg text-gray-200">
              These principles guide everything we build together
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {COMMUNITY_VALUES.map((value, index) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="rounded-lg bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20"
              >
                <div className="flex items-center mb-4">
                  {index === 0 && <Heart className="h-6 w-6 text-blkout-secondary mr-2" />}
                  {index === 1 && <Users className="h-6 w-6 text-blkout-secondary mr-2" />}
                  {index === 2 && <Zap className="h-6 w-6 text-blkout-secondary mr-2" />}
                  {index > 2 && <Heart className="h-6 w-6 text-blkout-secondary mr-2" />}
                  <h3 className="text-lg font-semibold text-white capitalize">
                    {value}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* IVOR Chatbot */}
      <IvorChatbot />
    </main>
  )
}