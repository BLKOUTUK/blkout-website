import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react'

/**
 * EventsPage - Community events with moderation tools for project leads
 */
export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blkout-deep via-blkout-accent to-blkout-primary">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/home" className="text-white hover:text-blkout-secondary transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-white font-bold text-xl">Events</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Community Events
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Gatherings, workshops, and collective actions for Black queer liberation.
          </p>
        </motion.div>

        {/* Upcoming Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Featured Event */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-8"
          >
            <span className="inline-block bg-blkout-secondary text-white text-xs px-3 py-1 rounded-full mb-4">
              FEATURED EVENT
            </span>
            <h3 className="text-2xl font-bold text-white mb-4">
              Cooperative Ownership Workshop
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-gray-200">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Saturday, January 15, 2025</span>
              </div>
              <div className="flex items-center text-gray-200">
                <Clock className="h-4 w-4 mr-2" />
                <span>2:00 PM - 5:00 PM GMT</span>
              </div>
              <div className="flex items-center text-gray-200">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Community Center, London</span>
              </div>
              <div className="flex items-center text-gray-200">
                <Users className="h-4 w-4 mr-2" />
                <span>25 spaces available</span>
              </div>
            </div>
            <p className="text-gray-200 mb-6">
              Learn the basics of cooperative ownership, from worker cooperatives to community land trusts. Open to all community members.
            </p>
            <button className="bg-white text-blkout-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Register Now
            </button>
          </motion.div>

          {/* Event List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
            
            {[
              {
                title: "Movement Strategy Session",
                date: "Jan 20, 2025",
                time: "6:00 PM",
                location: "Online",
                spots: "Unlimited"
              },
              {
                title: "Black History Month Planning",
                date: "Jan 25, 2025", 
                time: "7:00 PM",
                location: "Birmingham",
                spots: "15 spaces"
              },
              {
                title: "Digital Security Workshop",
                date: "Feb 1, 2025",
                time: "3:00 PM", 
                location: "Manchester",
                spots: "20 spaces"
              }
            ].map((event, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6">
                <h3 className="font-semibold text-white mb-2">{event.title}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {event.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {event.location}
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {event.spots}
                  </div>
                </div>
                <button className="text-blkout-secondary hover:underline text-sm">
                  View Details →
                </button>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  )
}