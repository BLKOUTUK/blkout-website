import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Newspaper, Video, Mic, Camera } from 'lucide-react'

/**
 * MediaPage - Media hub for newsroom, storylab, channel content
 * High-frequency content updates with CMS integration
 */

// Sub-components for different media content types - Light/Dark theme
const MediaBlog = () => (
  <div className="max-w-6xl mx-auto px-8 py-16">
    {/* Theme Toggle */}
    <div className="flex justify-end mb-8">
      <button className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors">
        Dark Mode
      </button>
    </div>

    {/* Hero Article - December 2024 (Amber Color Theme) */}
    <article className="mb-20">
      <div className="bg-amber-400 rounded-3xl overflow-hidden">
        <div className="grid grid-cols-12 min-h-[60vh]">
          {/* Content Side */}
          <div className="col-span-12 lg:col-span-8 p-12 lg:p-16 flex flex-col justify-center">
            <span className="inline-block bg-white/20 text-slate-800 text-sm font-bold px-4 py-2 rounded mb-6 uppercase tracking-wider">
              What's Fresh Today
            </span>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-800 mb-6 leading-tight tracking-tight">
              Black Queer Joy in Community Organizing
            </h1>
            <p className="text-xl text-slate-700 mb-8 leading-relaxed font-medium">
              Because celebrating while resisting? That's exactly the energy we need right now.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">CT</span>
                </div>
                <div>
                  <p className="font-bold text-slate-800">Community Editorial Team</p>
                  <p className="text-sm text-slate-600">December 15, 2024 • 8 min read</p>
                </div>
              </div>
              <button className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-700 transition-colors">
                Read Now
              </button>
            </div>
          </div>
          
          {/* Visual Side */}
          <div className="col-span-12 lg:col-span-4 bg-amber-500 flex items-center justify-center p-8">
            <div className="w-full h-64 lg:h-80 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              <span className="text-slate-800 text-6xl">📸</span>
            </div>
          </div>
        </div>
      </div>
    </article>

    {/* Latest Stories Grid */}
    <section className="mb-20">
      <h2 className="text-4xl font-black text-slate-800 mb-12 tracking-tight">What's Hot Right Now</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[
          {
            title: "Cooperative Economics 101: Building Community Wealth",
            excerpt: "Worker and housing cooperatives reshaping economic power? Yes, please. Here's how Manchester and Birmingham are making it happen.",
            date: "Dec 12, 2024",
            readTime: "6 min read",
            category: "Economics",
            author: "Kemi Adebayo",
            accent: "bg-pink-400"
          },
          {
            title: "Community Spotlight: The Manchester Collective",
            excerpt: "From vacant lots to community gardens to political power. This is how you transform a neighborhood.",
            date: "Dec 10, 2024", 
            readTime: "4 min read",
            category: "Community Power",
            author: "Jordan Clarke",
            accent: "bg-cyan-400"
          },
          {
            title: "Digital Security in the Age of Surveillance",
            excerpt: "Your digital presence while organizing matters. Here's your practical guide to staying safe online.",
            date: "Dec 8, 2024",
            readTime: "5 min read",
            category: "Digital Rights",
            author: "Sam Okafor",
            accent: "bg-lime-400"
          },
          {
            title: "Housing Cooperative Success Stories",
            excerpt: "Real families, real solutions. See how cooperative ownership is changing lives across the UK.",
            date: "Dec 6, 2024",
            readTime: "7 min read", 
            category: "Housing",
            author: "Zara Hassan",
            accent: "bg-yellow-400"
          }
        ].map((post, index) => (
          <article key={index} className="bg-slate-50 rounded-2xl p-8 hover:bg-slate-100 transition-all group border-l-4 border-transparent hover:border-slate-800">
            <div className="flex items-start justify-between mb-4">
              <span className={`inline-block ${post.accent} text-slate-800 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider`}>
                {post.category}
              </span>
              <div className={`w-12 h-12 ${post.accent} rounded-lg`}></div>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-800 mb-4 leading-tight group-hover:text-slate-600 transition-colors">
              <Link to={`/media/blog/${post.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                {post.title}
              </Link>
            </h3>
            
            <p className="text-slate-600 mb-6 leading-relaxed font-medium">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span className="font-medium">{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
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
      <div className="min-h-screen bg-slate-50">
        {/* Light Theme Header */}
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/home" className="text-slate-600 hover:text-slate-800 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-slate-800 font-bold text-xl tracking-wide">Media</h1>
              </div>
              <nav className="hidden md:flex space-x-6">
                <Link to="/media" className="text-slate-800 font-semibold border-b-2 border-cyan-400 pb-1">
                  News
                </Link>
                <Link to="/media/storylab" className="text-slate-500 hover:text-slate-800 transition-colors">
                  Story Lab
                </Link>
                <Link to="/media/channel" className="text-slate-500 hover:text-slate-800 transition-colors">
                  Channel
                </Link>
                <Link to="/media/newsroom" className="text-slate-500 hover:text-slate-800 transition-colors">
                  Press
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {/* Direct Blog Content */}
        <main className="bg-slate-50">
          <MediaBlog />
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