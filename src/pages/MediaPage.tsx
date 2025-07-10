import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Newspaper, Video, Mic, Camera } from 'lucide-react'

/**
 * MediaPage - Media hub for newsroom, storylab, channel content
 * High-frequency content updates with CMS integration
 */

// Sub-components for different media content types - Vox Media style
const MediaBlog = () => (
  <div className="max-w-4xl mx-auto">
    {/* Hero Article */}
    <article className="mb-16">
      <div className="mb-8">
        <span className="inline-block bg-blkout-primary text-white text-xs font-semibold px-3 py-1 rounded mb-6 uppercase tracking-wide">
          Featured
        </span>
        <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
          Black Queer Joy in Community Organizing
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Exploring how celebration and joy become acts of resistance and community building tools in Black queer spaces across the UK.
        </p>
      </div>
      
      <div className="flex items-center justify-between mb-8 pb-8 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-600">CT</span>
          </div>
          <div>
            <p className="font-medium text-black">Community Editorial Team</p>
            <p className="text-sm text-gray-500">December 15, 2024 • 8 min read</p>
          </div>
        </div>
        <Link 
          to="/media/blog/black-queer-joy-organizing"
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Read Story
        </Link>
      </div>
    </article>

    {/* Recent Stories */}
    <section>
      <h2 className="text-2xl font-bold text-black mb-8">Latest Stories</h2>
      <div className="space-y-8">
        {[
          {
            title: "Cooperative Economics 101: Building Community Wealth",
            excerpt: "A deep dive into how worker and housing cooperatives are reshaping economic power in Black queer communities across Manchester and Birmingham.",
            date: "Dec 12, 2024",
            readTime: "6 min read",
            category: "Economics",
            author: "Kemi Adebayo"
          },
          {
            title: "Community Spotlight: The Manchester Collective",
            excerpt: "How a group of Black queer organizers transformed vacant lots into community gardens while building political power from the ground up.",
            date: "Dec 10, 2024", 
            readTime: "4 min read",
            category: "Community Power",
            author: "Jordan Clarke"
          },
          {
            title: "Digital Security in the Age of Surveillance",
            excerpt: "Protecting your digital presence while organizing: A practical guide to online safety for Black queer activists and community builders.",
            date: "Dec 8, 2024",
            readTime: "5 min read",
            category: "Digital Rights",
            author: "Sam Okafor"
          }
        ].map((post, index) => (
          <article key={index} className="border-b border-gray-100 pb-8">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
              <div className="flex-1">
                <span className="inline-block text-blkout-primary text-xs font-semibold mb-3 uppercase tracking-wide">
                  {post.category}
                </span>
                <h3 className="text-2xl font-bold text-black mb-3 leading-tight hover:text-gray-700 transition-colors">
                  <Link to={`/media/blog/${post.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span>•</span>
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
              </div>
              <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg mt-4 md:mt-0 flex-shrink-0">
                {/* Placeholder for featured image */}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  </div>
)

const StoryLab = () => {
  // December 2024 color theme - Deep Orange/Amber
  const currentMonthColor = {
    primary: "bg-amber-500",
    light: "bg-amber-400", 
    dark: "bg-amber-600",
    text: "text-amber-500",
    textOnColor: "text-white"
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Monthly Color Theme Header */}
      <div className="mb-8">
        <span className="inline-block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">
          December 2024 Stories
        </span>
        <div className="flex items-center space-x-3">
          <div className={`w-6 h-6 ${currentMonthColor.primary} rounded-full`}></div>
          <span className="text-gray-600 text-sm">This month's color theme</span>
        </div>
      </div>

      {/* Hero Story - Single Color Theme */}
      <article className="mb-20">
        <div className={`${currentMonthColor.primary} rounded-3xl overflow-hidden`}>
          <div className="grid grid-cols-12 min-h-[60vh]">
            {/* Content Side */}
            <div className="col-span-12 lg:col-span-7 p-12 lg:p-16 flex flex-col justify-center">
              <span className="inline-block text-white/80 text-sm font-medium mb-4 uppercase tracking-wider">
                Featured Story
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Finding Home in Manchester's Black Queer Scene
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                "I never thought I'd find community like this in the North. But here we are, 
                building something beautiful together." — Jordan's story of discovering chosen family.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">JC</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">Jordan Clarke</p>
                    <p className="text-sm text-white/80">December 18, 2024</p>
                  </div>
                </div>
                <Link 
                  to="/media/storylab/jordan-manchester-story"
                  className="bg-white text-amber-600 px-8 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors"
                >
                  Read Story
                </Link>
              </div>
            </div>
            
            {/* Visual Side - Single Color Variations */}
            <div className={`col-span-12 lg:col-span-5 ${currentMonthColor.dark} flex items-center justify-center p-8`}>
              <div className="w-full h-64 lg:h-80 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                <span className="text-white/60 text-6xl">📸</span>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Story Categories - Same Color, Different Shades */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-black mb-12">Community Stories</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Realness - Light shade */}
          <div className={`${currentMonthColor.light} rounded-2xl p-8 text-white`}>
            <div className="mb-6">
              <Camera className="h-10 w-10 text-white/80 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Realness</h3>
              <p className="text-white/90 leading-relaxed">
                Behind-the-scenes moments, candid photography, and unfiltered community truth.
              </p>
            </div>
            <Link 
              to="/media/storylab/realness" 
              className="inline-block bg-white text-amber-500 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              View Gallery
            </Link>
          </div>

          {/* Voices - Primary shade */}
          <div className={`${currentMonthColor.primary} rounded-2xl p-8 text-white`}>
            <div className="mb-6">
              <Mic className="h-10 w-10 text-white/80 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Voices</h3>
              <p className="text-white/90 leading-relaxed">
                Podcast conversations, voice recordings, and oral history from community members.
              </p>
            </div>
            <Link 
              to="/media/storylab/voices" 
              className="inline-block bg-white text-amber-500 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Listen Now
            </Link>
          </div>

          {/* Creative - Dark shade */}
          <div className={`${currentMonthColor.dark} rounded-2xl p-8 text-white`}>
            <div className="mb-6">
              <div className="h-10 w-10 text-white/80 mb-4 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Creative</h3>
              <p className="text-white/90 leading-relaxed">
                Art, poetry, music, and creative expressions from the community.
              </p>
            </div>
            <Link 
              to="/media/storylab/creative" 
              className="inline-block bg-white text-amber-600 px-6 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors"
            >
              Explore Art
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Stories - Monochromatic Treatment */}
      <section>
        <h2 className="text-3xl font-bold text-black mb-12">Recent Stories</h2>
        
        <div className="space-y-8">
          {[
            {
              title: "Building Cooperative Power in Birmingham",
              excerpt: "How three friends turned their shared housing struggle into a housing cooperative that now serves 12 families.",
              author: "Kemi Adebayo",
              date: "Dec 15, 2024",
              shade: currentMonthColor.light
            },
            {
              title: "The Night Market Revolution", 
              excerpt: "Every Saturday night, Peckham transforms. Street vendors, community kitchens, and mutual aid in action.",
              author: "Sam Okafor", 
              date: "Dec 12, 2024",
              shade: currentMonthColor.primary
            },
            {
              title: "Trans Joy in the Workplace",
              excerpt: "Three Black trans professionals share how they're changing corporate culture from the inside out.",
              author: "Alex Thompson",
              date: "Dec 10, 2024", 
              shade: currentMonthColor.dark
            }
          ].map((story, index) => (
            <article key={index} className={`${story.shade} rounded-2xl overflow-hidden`}>
              <div className="grid grid-cols-12">
                <div className="col-span-12 md:col-span-8 p-8 lg:p-12">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 leading-tight">
                    <Link to={`/media/storylab/${story.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                      {story.title}
                    </Link>
                  </h3>
                  <p className="text-lg text-white/90 mb-6 leading-relaxed">
                    {story.excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-white/80">
                    <span className="font-medium">{story.author}</span>
                    <span>•</span>
                    <span>{story.date}</span>
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 p-8 flex items-center justify-center">
                  <div className="w-full h-48 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-4xl text-white/60">📖</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Submit Story CTA - Black for contrast */}
      <section className="mt-20">
        <div className="bg-black rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Share Your Story</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your experiences matter. Help build our community archive of Black queer liberation stories.
          </p>
          <button className="bg-white text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
            Submit Your Story
          </button>
        </div>
      </section>
    </div>
  )
}

const ChannelContent = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-white mb-6">Channel</h2>
    
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
      <Video className="h-12 w-12 text-blkout-secondary mb-6" />
      <h3 className="text-2xl font-semibold text-white mb-4">BLKOUT TV</h3>
      <p className="text-gray-200 mb-6">
        Video content, live streams, and community conversations exploring Black queer liberation and cooperative ownership.
      </p>
      
      {/* Featured Video */}
      <div className="bg-white/5 rounded-lg p-6 mb-6">
        <div className="aspect-video bg-black/50 rounded-lg mb-4 flex items-center justify-center">
          <Video className="h-16 w-16 text-white/50" />
        </div>
        <h4 className="font-semibold text-white mb-2">
          Community Power Building Workshop
        </h4>
        <p className="text-gray-300 text-sm">
          A deep dive into cooperative organizing strategies with community leaders.
        </p>
      </div>
      
      <button className="bg-white text-blkout-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
        Watch All Videos
      </button>
    </div>
  </div>
)

const Newsroom = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold text-white mb-6">Newsroom</h2>
    
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
      <Newspaper className="h-12 w-12 text-blkout-secondary mb-6" />
      <h3 className="text-2xl font-semibold text-white mb-4">Community News & Updates</h3>
      <p className="text-gray-200 mb-6">
        Official announcements, press releases, and community updates from BLKOUT.
      </p>
      
      {/* Recent News */}
      <div className="space-y-4">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-white">Q4 Community Report Released</h4>
            <span className="text-xs text-gray-400">Dec 1, 2024</span>
          </div>
          <p className="text-gray-300 text-sm">
            Our quarterly community building progress report is now available.
          </p>
        </div>
        
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-white">IVOR AI Assistant Launch</h4>
            <span className="text-xs text-gray-400">Nov 15, 2024</span>
          </div>
          <p className="text-gray-300 text-sm">
            Introducing our community AI assistant for resource discovery and support.
          </p>
        </div>
      </div>
    </div>
  </div>
)

// Main Media Page Component
export default function MediaPage() {
  const location = useLocation()
  const isMainPage = location.pathname === '/media'

  if (isMainPage) {
    return (
      <div className="min-h-screen bg-white">
        {/* Clean Header */}
        <header className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center space-x-4">
              <Link to="/home" className="text-gray-600 hover:text-black transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-black font-bold text-xl">Media</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-black mb-6 leading-tight">
              Media Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
              Stories, news, and community media celebrating Black queer liberation and cooperative ownership.
            </p>
          </motion.div>

          {/* Media Categories - Bento Style */}
          <div className="grid grid-cols-12 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="col-span-12 md:col-span-6"
            >
              <Link 
                to="/media/blog"
                className="block bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-all group h-full"
              >
                <Newspaper className="h-10 w-10 text-blkout-primary mb-6 group-hover:scale-105 transition-transform" />
                <h3 className="text-2xl font-bold text-black mb-3">Blog</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  In-depth articles, analysis, and community insights on Black queer liberation and cooperative economics.
                </p>
                <div className="flex items-center text-blkout-primary font-medium">
                  Read Latest Stories <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="col-span-12 md:col-span-6"
            >
              <Link 
                to="/media/storylab"
                className="block bg-blkout-secondary/10 rounded-2xl p-8 hover:bg-blkout-secondary/20 transition-all group h-full"
              >
                <Camera className="h-10 w-10 text-blkout-secondary mb-6 group-hover:scale-105 transition-transform" />
                <h3 className="text-2xl font-bold text-black mb-3">Story Lab</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Community storytelling hub featuring authentic voices and behind-the-scenes moments.
                </p>
                <div className="flex items-center text-blkout-secondary font-medium">
                  Explore Stories <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="col-span-12 md:col-span-6"
            >
              <Link 
                to="/media/channel"
                className="block bg-blkout-accent/10 rounded-2xl p-8 hover:bg-blkout-accent/20 transition-all group h-full"
              >
                <Video className="h-10 w-10 text-blkout-accent mb-6 group-hover:scale-105 transition-transform" />
                <h3 className="text-2xl font-bold text-black mb-3">Channel</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Video content, live streams, and community conversations exploring cooperative ownership.
                </p>
                <div className="flex items-center text-blkout-accent font-medium">
                  Watch Now <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="col-span-12 md:col-span-6"
            >
              <Link 
                to="/media/newsroom"
                className="block bg-blkout-warm/10 rounded-2xl p-8 hover:bg-blkout-warm/20 transition-all group h-full"
              >
                <Mic className="h-10 w-10 text-blkout-warm mb-6 group-hover:scale-105 transition-transform" />
                <h3 className="text-2xl font-bold text-black mb-3">Newsroom</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Official announcements, press releases, and community updates from BLKOUT.
                </p>
                <div className="flex items-center text-blkout-warm font-medium">
                  Latest News <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Clean Sub-page Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link to="/media" className="text-gray-600 hover:text-black transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <nav className="flex items-center space-x-4 text-sm">
              <Link to="/media" className="text-gray-500 hover:text-black transition-colors">
                Media
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-black font-medium capitalize">
                {location.pathname.split('/').pop()}
              </span>
            </nav>
          </div>
        </div>
      </header>

      {/* Sub-page Content */}
      <main className="py-16">
        <Routes>
          <Route path="blog/*" element={<MediaBlog />} />
          <Route path="storylab/*" element={<StoryLab />} />
          <Route path="channel/*" element={<ChannelContent />} />
          <Route path="newsroom" element={<Newsroom />} />
        </Routes>
      </main>
    </div>
  )
}