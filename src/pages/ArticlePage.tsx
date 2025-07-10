import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Share2, Bookmark, Heart, Calendar, User, Clock } from 'lucide-react'

/**
 * ArticlePage - Full article view with immersive reading experience
 * GQ-style long-form content with sophisticated typography
 */

interface ArticleData {
  title: string
  subtitle: string
  content: string[]
  author: string
  authorBio: string
  date: string
  readTime: string
  category: string
  tags: string[]
  image: string
  accent: string
}

// Sample article data - would be fetched from CMS in production
const articleData: Record<string, ArticleData> = {
  'the-road-to-the-future': {
    title: 'THE ROAD TO THE FUTURE',
    subtitle: 'Reflecting on LGBTQ History Month and resisting the erasure of Black folk from LGBTQ histories',
    content: [
      'February marks LGBTQ History Month, a time when we celebrate the rich tapestry of queer lives, loves, and liberation struggles. But as we move through this month of recognition, we must confront a persistent and painful reality: the systematic erasure of Black folk from LGBTQ histories.',
      
      'This erasure isn\'t accidental. It\'s a deliberate rewriting that sanitises queer history, making it more palatable to mainstream consumption while sidelining the very people who sparked our most significant movements. When we talk about Stonewall, do we centre Marsha P. Johnson and Sylvia Rivera? When we discuss AIDS activism, do we acknowledge how Black communities bore the brunt of governmental neglect?',
      
      'The road to our future as Black queer people cannot be paved with sanitised narratives that erase our contributions. We refuse to be footnotes in our own liberation story. We refuse to watch our ancestors be whitewashed from history books. We refuse to accept a future where young Black queer people can\'t see themselves reflected in the movements that fought for their freedom.',
      
      'At BLKOUT UK, we\'re committed to #makingspaceforus – not just in the present, but in how our past is told and our future is imagined. This means elevating Black queer voices, supporting Black-led organisations, and ensuring our stories are told with the nuance, complexity, and respect they deserve.',
      
      'Our history is not a subplot. Our struggles are not secondary. Our joy is not an afterthought. We are the protagonists of our own liberation narrative, and we\'re writing the next chapter with intention, purpose, and pride.',
      
      'The road to the future is built on the foundation of our truth. And our truth is this: Black queer people have always been here, have always been fighting, have always been leading. It\'s time the history books caught up.',
      
      'As we move forward, we carry our ancestors with us – not as martyrs, but as revolutionaries who paved the way for the freedoms we enjoy today. Their legacy lives in every Black queer person who refuses to be invisible, who demands space, who insists on being seen and heard and valued.',
      
      'This is our road to the future. And we\'re walking it together.'
    ],
    author: 'BLKOUT UK Editorial Team',
    authorBio: 'The BLKOUT UK Editorial Team is a collective of Black queer voices committed to authentic storytelling and community liberation.',
    date: 'March 3, 2024',
    readTime: '6 min read',
    category: 'Community Reflection',
    tags: ['LGBTQ History', 'Black Liberation', 'Community', 'Activism'],
    image: '/images/road-to-future.jpg',
    accent: 'bg-amber-400'
  },
  'welcome-to-the-blkoutuk-blog': {
    title: 'WELCOME TO THE BLKOUTUK BLOG',
    subtitle: 'A space for Black queer men to think, shout, show off, curse, celebrate, laugh, reflect and share',
    content: [
      'Welcome to our digital sanctuary. This isn\'t just another blog – this is our space. A place carved out in a world that often refuses to see us, hear us, or value us. Here, we exist fully, authentically, unapologetically.',
      
      'For too long, Black queer men have been relegated to the margins of both Black spaces and queer spaces. We\'ve been told to pick a side, to tone it down, to make ourselves more palatable. Not here. Here, we bring all of ourselves.',
      
      'This blog is where we think out loud about the issues that matter to us. Where we shout about injustices that mainstream media ignores. Where we show off our talents, our achievements, our brilliance that the world tries to diminish. Where we curse the systems that oppress us and celebrate the moments of joy that sustain us.',
      
      'We laugh at the absurdity of having to explain our existence. We reflect on the complexity of navigating multiple identities in a world built for neither. We share our stories, our struggles, our triumphs – not for validation, but for connection.',
      
      'This is #makingspaceforus in action. This is what happens when Black queer men refuse to be silenced, refuse to be sidelined, refuse to wait for permission to take up space. We\'re not asking for a seat at the table – we\'re building our own.',
      
      'So welcome to our corner of the internet. Pull up a chair, grab a drink, and get comfortable. You\'re among family here. Your voice matters. Your story matters. You matter.',
      
      'Let\'s build something beautiful together.'
    ],
    author: 'BLKOUT UK Team',
    authorBio: 'A collective of Black queer voices building community, connection, and change across the UK.',
    date: 'March 3, 2024',
    readTime: '5 min read',
    category: 'Community',
    tags: ['Welcome', 'Community Building', 'Safe Spaces', 'Black Queer Identity'],
    image: '/images/welcome-blog.jpg',
    accent: 'bg-pink-400'
  }
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  
  const article = slug ? articleData[slug] : null

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Article Not Found</h1>
          <Link to="/media" className="text-blue-600 hover:text-blue-800 font-medium">
            Back to Media Hub
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-blue-50'}`}>
      {/* Header */}
      <header className={`border-b transition-colors ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-blue-50 border-blue-200'
      }`}>
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/media" className={`transition-colors ${
                isDarkMode 
                  ? 'text-slate-400 hover:text-white' 
                  : 'text-blue-600 hover:text-blue-800'
              }`}>
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <img 
                src="/images/BLKOUTpride2025.png" 
                alt="BLKOUT UK" 
                className="h-12 w-auto opacity-80"
              />
            </div>
            
            {/* Article Actions */}
            <div className="flex items-center space-x-4">
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
              
              <div className="flex items-center space-x-2">
                <button className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white'
                }`}>
                  <Share2 className="h-5 w-5" />
                </button>
                <button className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-700' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-white'
                }`}>
                  <Bookmark className="h-5 w-5" />
                </button>
                <button className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-slate-400 hover:text-pink-400 hover:bg-slate-700' 
                    : 'text-slate-600 hover:text-pink-600 hover:bg-white'
                }`}>
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="max-w-4xl mx-auto px-8 py-16">
        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          {/* Category Badge */}
          <div className="mb-6">
            <span className={`inline-block ${article.accent} text-slate-800 text-sm font-bold px-4 py-2 rounded-lg uppercase tracking-wider`}>
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className={`text-5xl md:text-7xl font-black mb-8 leading-none tracking-tight ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            {article.title}
          </h1>

          {/* Subtitle */}
          <p className={`text-2xl md:text-3xl leading-relaxed font-light mb-12 ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {article.subtitle}
          </p>

          {/* Article Meta */}
          <div className={`flex flex-wrap items-center gap-6 pb-8 border-b ${
            isDarkMode ? 'border-slate-700' : 'border-slate-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${article.accent} rounded-full flex items-center justify-center`}>
                <User className="h-6 w-6 text-slate-800" />
              </div>
              <div>
                <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  {article.author}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {article.authorBio}
                </p>
              </div>
            </div>
            
            <div className={`flex items-center space-x-4 text-sm ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Article Body */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`prose prose-xl max-w-none ${
            isDarkMode 
              ? 'prose-invert prose-headings:text-white prose-p:text-slate-300 prose-strong:text-white' 
              : 'prose-slate'
          }`}
        >
          {article.content.map((paragraph, index) => (
            <p key={index} className={`text-xl leading-relaxed mb-8 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              {paragraph}
            </p>
          ))}
        </motion.article>

        {/* Article Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`mt-16 pt-8 border-t ${
            isDarkMode ? 'border-slate-700' : 'border-slate-200'
          }`}
        >
          {/* Tags */}
          <div className="mb-8">
            <h3 className={`text-lg font-bold mb-4 ${
              isDarkMode ? 'text-white' : 'text-slate-800'
            }`}>
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span 
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isDarkMode 
                      ? 'bg-slate-700 text-slate-300' 
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Back to Media */}
          <div className="text-center">
            <Link 
              to="/media"
              className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                isDarkMode 
                  ? 'bg-slate-800 text-white hover:bg-slate-700' 
                  : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Media Hub</span>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}