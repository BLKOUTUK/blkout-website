import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Share2, Bookmark, Heart, Calendar, User, Clock } from 'lucide-react'

/**
 * ArticlePage - Full article view with immersive reading experience
 * GQ-style long-form content with sophisticated typography
 */

interface ArticleSection {
  type: 'paragraph' | 'quote' | 'image' | 'heading' | 'divider'
  content: string
  imageUrl?: string
  imageCaption?: string
  attribution?: string
}

interface ArticleData {
  title: string
  subtitle: string
  heroImage: string
  heroImageCaption: string
  content: ArticleSection[]
  author: string
  authorBio: string
  date: string
  readTime: string
  category: string
  tags: string[]
  accent: string
}

// Sample article data - would be fetched from CMS in production
const articleData: Record<string, ArticleData> = {
  'the-road-to-the-future': {
    title: 'THE ROAD TO THE FUTURE',
    subtitle: 'Reflecting on LGBTQ History Month and resisting the erasure of Black folk from LGBTQ histories',
    heroImage: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200&h=600&fit=crop',
    heroImageCaption: 'The path forward requires us to center Black voices in our liberation narrative',
    content: [
      {
        type: 'paragraph',
        content: 'February marks LGBTQ History Month, a time when we celebrate the rich tapestry of queer lives, loves, and liberation struggles. But as we move through this month of recognition, we must confront a persistent and painful reality: the systematic erasure of Black folk from LGBTQ histories.'
      },
      {
        type: 'paragraph',
        content: 'This erasure isn\'t accidental. It\'s a deliberate rewriting that sanitises queer history, making it more palatable to mainstream consumption while sidelining the very people who sparked our most significant movements.'
      },
      {
        type: 'quote',
        content: 'When we talk about Stonewall, do we centre Marsha P. Johnson and Sylvia Rivera? When we discuss AIDS activism, do we acknowledge how Black communities bore the brunt of governmental neglect?'
      },
      {
        type: 'image',
        content: '',
        imageUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&h=500&fit=crop',
        imageCaption: 'Marsha P. Johnson and Sylvia Rivera: pioneers of liberation who deserve to be centered in our histories'
      },
      {
        type: 'heading',
        content: 'Reclaiming Our Narrative'
      },
      {
        type: 'paragraph',
        content: 'The road to our future as Black queer people cannot be paved with sanitised narratives that erase our contributions. We refuse to be footnotes in our own liberation story. We refuse to watch our ancestors be whitewashed from history books.'
      },
      {
        type: 'paragraph',
        content: 'We refuse to accept a future where young Black queer people can\'t see themselves reflected in the movements that fought for their freedom.'
      },
      {
        type: 'quote',
        content: 'At BLKOUT UK, we\'re committed to #makingspaceforus – not just in the present, but in how our past is told and our future is imagined.'
      },
      {
        type: 'divider',
        content: ''
      },
      {
        type: 'paragraph',
        content: 'This means elevating Black queer voices, supporting Black-led organisations, and ensuring our stories are told with the nuance, complexity, and respect they deserve.'
      },
      {
        type: 'heading',
        content: 'The Truth of Our Leadership'
      },
      {
        type: 'paragraph',
        content: 'Our history is not a subplot. Our struggles are not secondary. Our joy is not an afterthought. We are the protagonists of our own liberation narrative, and we\'re writing the next chapter with intention, purpose, and pride.'
      },
      {
        type: 'quote',
        content: 'Black queer people have always been here, have always been fighting, have always been leading. It\'s time the history books caught up.',
        attribution: 'BLKOUT UK Collective'
      },
      {
        type: 'image',
        content: '',
        imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=500&fit=crop',
        imageCaption: 'Community power in action: building the future we deserve to see'
      },
      {
        type: 'paragraph',
        content: 'As we move forward, we carry our ancestors with us – not as martyrs, but as revolutionaries who paved the way for the freedoms we enjoy today. Their legacy lives in every Black queer person who refuses to be invisible, who demands space, who insists on being seen and heard and valued.'
      },
      {
        type: 'paragraph',
        content: 'This is our road to the future. And we\'re walking it together.'
      }
    ],
    author: 'BLKOUT UK Editorial Team',
    authorBio: 'The BLKOUT UK Editorial Team is a collective of Black queer voices committed to authentic storytelling and community liberation.',
    date: 'March 3, 2024',
    readTime: '6 min read',
    category: 'Community Reflection',
    tags: ['LGBTQ History', 'Black Liberation', 'Community', 'Activism'],
    accent: 'bg-amber-400'
  },
  'welcome-to-the-blkoutuk-blog': {
    title: 'WELCOME TO THE BLKOUTUK BLOG',
    subtitle: 'A space for Black queer men to think, shout, show off, curse, celebrate, laugh, reflect and share',
    heroImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=600&fit=crop',
    heroImageCaption: 'Building digital sanctuary: where Black queer voices can exist fully and authentically',
    content: [
      {
        type: 'quote',
        content: 'Welcome to our digital sanctuary. This isn\'t just another blog – this is our space.',
        attribution: 'BLKOUT UK'
      },
      {
        type: 'paragraph',
        content: 'A place carved out in a world that often refuses to see us, hear us, or value us. Here, we exist fully, authentically, unapologetically.'
      },
      {
        type: 'paragraph',
        content: 'For too long, Black queer men have been relegated to the margins of both Black spaces and queer spaces. We\'ve been told to pick a side, to tone it down, to make ourselves more palatable. Not here. Here, we bring all of ourselves.'
      },
      {
        type: 'heading',
        content: 'This Is Our Space'
      },
      {
        type: 'paragraph',
        content: 'This blog is where we think out loud about the issues that matter to us. Where we shout about injustices that mainstream media ignores. Where we show off our talents, our achievements, our brilliance that the world tries to diminish.'
      },
      {
        type: 'image',
        content: '',
        imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop',
        imageCaption: 'Authentic expression: celebrating our talents and achievements without apology'
      },
      {
        type: 'paragraph',
        content: 'Where we curse the systems that oppress us and celebrate the moments of joy that sustain us. We laugh at the absurdity of having to explain our existence. We reflect on the complexity of navigating multiple identities in a world built for neither.'
      },
      {
        type: 'quote',
        content: 'We share our stories, our struggles, our triumphs – not for validation, but for connection.'
      },
      {
        type: 'divider',
        content: ''
      },
      {
        type: 'paragraph',
        content: 'This is #makingspaceforus in action. This is what happens when Black queer men refuse to be silenced, refuse to be sidelined, refuse to wait for permission to take up space. We\'re not asking for a seat at the table – we\'re building our own.'
      },
      {
        type: 'paragraph',
        content: 'So welcome to our corner of the internet. Pull up a chair, grab a drink, and get comfortable. You\'re among family here. Your voice matters. Your story matters. You matter.'
      },
      {
        type: 'quote',
        content: 'Let\'s build something beautiful together.'
      }
    ],
    author: 'BLKOUT UK Team',
    authorBio: 'A collective of Black queer voices building community, connection, and change across the UK.',
    date: 'March 3, 2024',
    readTime: '5 min read',
    category: 'Community',
    tags: ['Welcome', 'Community Building', 'Safe Spaces', 'Black Queer Identity'],
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

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-16"
        >
          <div className="relative rounded-2xl overflow-hidden">
            <img 
              src={article.heroImage}
              alt={article.heroImageCaption}
              className="w-full h-[60vh] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-white/90 text-lg font-medium leading-relaxed">
                {article.heroImageCaption}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Article Body */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-none"
        >
          {article.content.map((section, index) => {
            switch (section.type) {
              case 'paragraph':
                return (
                  <p key={index} className={`text-xl leading-relaxed mb-8 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {section.content}
                  </p>
                )
              
              case 'quote':
                return (
                  <blockquote key={index} className={`my-12 pl-8 border-l-4 ${article.accent.replace('bg-', 'border-')}`}>
                    <p className={`text-2xl md:text-3xl font-light italic leading-relaxed mb-4 ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      "{section.content}"
                    </p>
                    {section.attribution && (
                      <cite className={`text-lg font-semibold ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        — {section.attribution}
                      </cite>
                    )}
                  </blockquote>
                )
              
              case 'heading':
                return (
                  <h2 key={index} className={`text-3xl md:text-4xl font-black mt-16 mb-8 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {section.content}
                  </h2>
                )
              
              case 'image':
                return (
                  <div key={index} className="my-12">
                    <div className="relative rounded-xl overflow-hidden">
                      <img 
                        src={section.imageUrl}
                        alt={section.imageCaption || ''}
                        className="w-full h-96 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                    {section.imageCaption && (
                      <p className={`text-center mt-4 italic ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {section.imageCaption}
                      </p>
                    )}
                  </div>
                )
              
              case 'divider':
                return (
                  <div key={index} className="my-16 flex justify-center">
                    <div className={`w-24 h-1 ${article.accent} rounded-full`}></div>
                  </div>
                )
              
              default:
                return null
            }
          })}
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