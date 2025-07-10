import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Newspaper, Video, Mic, Camera } from 'lucide-react'

/**
 * MediaPage - Media hub for newsroom, storylab, channel content
 * High-frequency content updates with CMS integration
 */

// Sub-components for different media content types - Light/Dark theme
const MediaBlog = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-blue-50'}`}>
      {/* Header with Navigation */}
      <header className={`border-b transition-colors ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/home" className={`transition-colors ${
                isDarkMode 
                  ? 'text-slate-400 hover:text-white' 
                  : 'text-blue-600 hover:text-blue-800'
              }`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className={`font-bold text-xl tracking-wide ${
                isDarkMode ? 'text-white' : 'text-blue-800'
              }`}>Media</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link to="/media" className={`font-semibold border-b-2 border-cyan-400 pb-1 ${
                isDarkMode ? 'text-white' : 'text-blue-800'
              }`}>
                News
              </Link>
              <Link to="/media/storylab" className={`transition-colors ${
                isDarkMode 
                  ? 'text-slate-400 hover:text-white' 
                  : 'text-blue-500 hover:text-blue-800'
              }`}>
                Story Lab
              </Link>
              <Link to="/media/channel" className={`transition-colors ${
                isDarkMode 
                  ? 'text-slate-400 hover:text-white' 
                  : 'text-blue-500 hover:text-blue-800'
              }`}>
                Channel
              </Link>
              <Link to="/media/newsroom" className={`transition-colors ${
                isDarkMode 
                  ? 'text-slate-400 hover:text-white' 
                  : 'text-blue-500 hover:text-blue-800'
              }`}>
                Press
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-16">
        {/* Theme Toggle & Logo */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-3">
            <img 
              src="/images/BLKOUTpride2025.png" 
              alt="BLKOUT UK" 
              className="h-16 w-auto opacity-80"
            />
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isDarkMode 
                ? 'bg-slate-700 text-white hover:bg-slate-600' 
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

      {/* Hero Article - Real BLKOUT Content */}
      <article className="mb-20">
        <div className="bg-amber-400 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-12 min-h-[60vh]">
            {/* Content Side */}
            <div className="col-span-12 lg:col-span-8 p-12 lg:p-16 flex flex-col justify-center">
              <span className="inline-block bg-white/20 text-slate-800 text-sm font-bold px-4 py-2 rounded mb-6 uppercase tracking-wider">
                Making Space For Us
              </span>
              <h1 className="text-4xl lg:text-6xl font-black text-slate-800 mb-6 leading-tight tracking-tight">
                THE ROAD TO THE FUTURE
              </h1>
              <p className="text-xl text-slate-700 mb-8 leading-relaxed font-medium">
                Reflecting on LGBTQ History Month and resisting the erasure of Black folk from LGBTQ histories. Because our stories matter, our futures matter.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center">
                    <span className="text-sm font-bold text-white">BUK</span>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">BLKOUT UK Team</p>
                    <p className="text-sm text-slate-600">March 3, 2024 • 6 min read</p>
                  </div>
                </div>
                <Link 
                  to="/article/the-road-to-the-future"
                  className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-700 transition-colors inline-block"
                >
                  Read Now
                </Link>
              </div>
            </div>
            
            {/* Visual Side */}
            <div className="col-span-12 lg:col-span-4 bg-amber-500 flex items-center justify-center p-8">
              <div className="w-full h-64 lg:h-80 bg-white/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                <span className="text-slate-800 text-6xl">🌟</span>
              </div>
            </div>
          </div>
        </div>
      </article>

    {/* Latest Stories Grid */}
    <section className="mb-20">
      <h2 className={`text-4xl font-black mb-12 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>What's Hot Right Now</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[
          {
            title: "WELCOME TO THE BLKOUTUK BLOG",
            excerpt: "A space for Black queer men to think, shout, show off, curse, celebrate, laugh, reflect and share. This is where we make space for us.",
            date: "Mar 3, 2024",
            readTime: "5 min read",
            category: "Community",
            author: "BLKOUT UK Team",
            accent: "bg-pink-400"
          },
          {
            title: "Invitation to Clubland",
            excerpt: "Creating sustainable, affirming, and transformative spaces. Because we deserve places where we can truly be ourselves.",
            date: "Sep 5, 2023", 
            readTime: "8 min read",
            category: "Spaces",
            author: "BLKOUT UK",
            accent: "bg-cyan-400"
          },
          {
            title: "Visibility, Vulnerability, and Individualism",
            excerpt: "Theatre and personal storytelling - one man's journey to selfhood. The power of authentic expression in community building.",
            date: "Jul 19, 2023",
            readTime: "12 min read",
            category: "Arts & Culture",
            author: "Community Contributor",
            accent: "bg-lime-400"
          },
          {
            title: "When 'I' Becomes 'We': Community Healing",
            excerpt: "Malcolm X reminded us that when 'I' is replaced with 'We', even illness becomes wellness. Building solidarity through shared struggle.",
            date: "Jun 15, 2023",
            readTime: "6 min read", 
            category: "Healing",
            author: "Editorial Team",
            accent: "bg-yellow-400"
          }
        ].map((post, index) => (
          <article key={index} className={`rounded-2xl p-8 transition-all group border-l-4 border-transparent ${
            isDarkMode 
              ? 'bg-slate-800 hover:bg-slate-700 hover:border-slate-600' 
              : 'bg-white hover:bg-blue-50 hover:border-blue-600'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <span className={`inline-block ${post.accent} text-slate-800 text-xs font-bold px-3 py-1 rounded uppercase tracking-wider`}>
                {post.category}
              </span>
              <div className={`w-12 h-12 ${post.accent} rounded-lg`}></div>
            </div>
            
            <h3 className={`text-2xl font-bold mb-4 leading-tight transition-colors ${
              isDarkMode 
                ? 'text-white group-hover:text-slate-300' 
                : 'text-slate-800 group-hover:text-slate-600'
            }`}>
              <Link to={`/article/${post.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                {post.title}
              </Link>
            </h3>
            
            <p className={`mb-6 leading-relaxed font-medium ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-4 text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <span className="font-medium">{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              <ArrowRight className={`h-5 w-5 transition-colors ${
                isDarkMode 
                  ? 'text-slate-500 group-hover:text-slate-300' 
                  : 'text-slate-400 group-hover:text-slate-600'
              }`} />
            </div>
          </article>
        ))}
      </div>
    </section>

    {/* Additional Headlines Row - Six Stories */}
    <section className="mb-16">
      <h2 className={`text-3xl font-black mb-8 tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>More Stories From The Community</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Building Black Queer Solidarity",
            excerpt: "How mutual aid networks are transforming communities across the UK.",
            date: "May 20, 2023",
            category: "Solidarity",
            accent: "bg-pink-400",
            emoji: "🤝"
          },
          {
            title: "Creative Expression & Resistance",
            excerpt: "Art as activism - showcasing Black queer artists making change.",
            date: "Apr 15, 2023",
            category: "Arts",
            accent: "bg-cyan-400",
            emoji: "🎨"
          },
          {
            title: "Housing Justice Stories",
            excerpt: "Real stories from the housing frontline - victories and struggles.",
            date: "Mar 28, 2023",
            category: "Housing",
            accent: "bg-lime-400",
            emoji: "🏠"
          },
          {
            title: "Digital Organizing Tools",
            excerpt: "How tech is empowering grassroots movements in new ways.",
            date: "Mar 10, 2023",
            category: "Tech",
            accent: "bg-yellow-400",
            emoji: "📱"
          },
          {
            title: "Mental Health & Community",
            excerpt: "Collective healing practices in Black queer spaces.",
            date: "Feb 22, 2023",
            category: "Wellness",
            accent: "bg-purple-400",
            emoji: "💜"
          },
          {
            title: "Economic Justice Now",
            excerpt: "Cooperative ownership models creating lasting change.",
            date: "Feb 8, 2023",
            category: "Economics",
            accent: "bg-orange-400",
            emoji: "💰"
          }
        ].map((story, index) => (
          <article key={index} className={`rounded-xl p-6 transition-all group cursor-pointer ${
            isDarkMode 
              ? 'bg-slate-800 hover:bg-slate-700' 
              : 'bg-white hover:bg-blue-50 shadow-sm hover:shadow-md'
          }`}>
            {/* Image Teaser */}
            <div className={`w-full h-32 ${story.accent} rounded-lg mb-4 flex items-center justify-center relative overflow-hidden`}>
              <span className="text-3xl">{story.emoji}</span>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
            </div>
            
            {/* Content */}
            <div className="flex items-start justify-between mb-2">
              <span className={`inline-block ${story.accent} text-slate-800 text-xs font-bold px-2 py-1 rounded text-center uppercase tracking-wider`}>
                {story.category}
              </span>
              <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {story.date}
              </span>
            </div>
            
            <h3 className={`text-lg font-bold mb-2 leading-tight transition-colors ${
              isDarkMode 
                ? 'text-white group-hover:text-slate-300' 
                : 'text-slate-800 group-hover:text-slate-600'
            }`}>
              {story.title}
            </h3>
            
            <p className={`text-sm leading-relaxed ${
              isDarkMode ? 'text-slate-300' : 'text-slate-600'
            }`}>
              {story.excerpt}
            </p>
          </article>
        ))}
      </div>
    </section>
      </main>
    </div>
  )
}

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
      <div className="min-h-screen">
        <MediaBlog />
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