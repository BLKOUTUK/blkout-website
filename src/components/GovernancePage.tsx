import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Scale, Heart, Award, Camera, Vote, FileText, 
  Shield, MessageSquare, Mail, ArrowRight, ExternalLink,
  CheckCircle, AlertCircle, Send
} from 'lucide-react'
import SharedLayout from './layout/SharedLayout'

const GovernancePage = () => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    organization: '',
    subject: 'General Inquiry',
    message: ''
  })
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const coreValues = [
    {
      icon: Heart,
      title: "We are becoming, enough, not all the same",
      description: "Celebrating the full spectrum of Black queer identity and intersectionality"
    },
    {
      icon: Users,
      title: "The whole is greater than the sum of its parts",
      description: "Building collective power through community connection and collaboration"
    },
    {
      icon: Scale,
      title: "Cooperative Ownership",
      description: "Democratic control over platform decisions, resources, and community direction"
    },
    {
      icon: Award,
      title: "Values-First Development",
      description: "All platform changes prioritize community liberation over profit or growth metrics"
    }
  ]

  const governanceAreas = [
    {
      id: 1,
      icon: Vote,
      title: "Community Voting",
      description: "Democratic decision-making on platform features, content guidelines, and partnership decisions",
      status: "Active",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      icon: FileText,
      title: "Community Proposals",
      description: "Submit and discuss ideas for platform improvements and community initiatives",
      status: "Open",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      id: 3,
      icon: Users,
      title: "Working Groups",
      description: "Safety, Content, Tech, and Community Organizing committees",
      status: "Recruiting",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 4,
      icon: Shield,
      title: "Transparency Reports",
      description: "Open budget, decision logs, and community impact accountability",
      status: "Updated",
      color: "from-amber-500 to-amber-600"
    }
  ]

  const statusColors = {
    "Active": "bg-green-600 text-green-100",
    "Open": "bg-blue-600 text-blue-100", 
    "Recruiting": "bg-purple-600 text-purple-100",
    "Updated": "bg-amber-600 text-amber-100"
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactStatus('submitting')
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setContactStatus('success')
      setContactForm({
        name: '',
        email: '',
        organization: '',
        subject: 'General Inquiry',
        message: ''
      })
      setTimeout(() => setContactStatus('idle'), 3000)
    } catch (error) {
      setContactStatus('error')
      setTimeout(() => setContactStatus('idle'), 5000)
    }
  }

  const handleContactChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <SharedLayout>
      <div className="container mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🏛️ GOVERNANCE
          </h1>
          <h2 className="text-2xl mb-8 text-white font-bold uppercase tracking-wide">
            COMMUNITY BENEFIT SOCIETY - DEMOCRATIC COOPERATIVE OWNERSHIP
          </h2>
          
          {/* Mission Statement */}
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-8 max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">Our Mission: From Category to Community</h3>
            <p className="text-gray-200 text-lg leading-relaxed">
              Black queer men in the UK face racisms and homophobia/transphobia that exclude them from 
              opportunities and impose unjust limits on their potential. We exist to transform this reality by creating 
              spaces where Black queer men can connect authentically, share stories, and build power together. 
              Through dialogue-centered events, community media, and democratic governance, we're building the 
              infrastructure our community needs to thrive and resist.
            </p>
          </div>
        </div>

        {/* Governance Explanation Video */}
        <div className="mb-16">
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                🎥 Understanding Our Co-operative Model
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Learn how our community benefit society operates and the principles that guide our democratic governance
              </p>
            </div>

            <div className="aspect-video mb-6">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/7PLD773p1Uw?si=-dRQPVcVxij16bkq"
                title="BLKOUT Co-operative Governance Explained"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">What This Video Explains:</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• How community benefit societies work</li>
                    <li>• Democratic decision-making processes</li>
                    <li>• Member ownership and responsibilities</li>
                    <li>• Financial transparency and accountability</li>
                    <li>• Our values-first approach to governance</li>
                    <li>• Why co-operatives matter for Black communities</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">Key Co-operative Principles:</h3>
                  <ul className="text-gray-300 space-y-2">
                    <li>• <strong className="text-blue-400">One member, one vote</strong> - Equal democratic participation</li>
                    <li>• <strong className="text-blue-400">Open membership</strong> - Welcoming all who share our values</li>
                    <li>• <strong className="text-blue-400">Community benefit</strong> - Serving liberation, not profit</li>
                    <li>• <strong className="text-blue-400">Education & training</strong> - Building collective knowledge</li>
                    <li>• <strong className="text-blue-400">Cooperation</strong> - Working with other co-operatives</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Co-operative Membership Registration */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                🤝 Join Our Co-operative - Next Recruitment Round
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
                Become a member-owner of BLKOUT and help shape the future of our community platform through democratic participation
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Member Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Vote className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-white">Voting Rights</div>
                      <div className="text-sm text-gray-400">Equal say in all platform decisions and community direction</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Scale className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-white">Ownership Share</div>
                      <div className="text-sm text-gray-400">Real ownership stake in our community benefit society</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Shield className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-white">Transparency</div>
                      <div className="text-sm text-gray-400">Access to financial reports, decision logs, and governance documents</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Heart className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold text-white">Community Impact</div>
                      <div className="text-sm text-gray-400">Direct involvement in liberation-focused community building</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Membership Requirements</h3>
                <div className="bg-black/30 rounded-xl p-6">
                  <ul className="text-gray-300 space-y-3">
                    <li>• <strong className="text-white">Alignment with values:</strong> Commitment to Black queer liberation</li>
                    <li>• <strong className="text-white">Active participation:</strong> Engage in community discussions and decisions</li>
                    <li>• <strong className="text-white">Cooperative spirit:</strong> Work collaboratively with other members</li>
                    <li>• <strong className="text-white">Share purchase:</strong> One-time membership share (sliding scale available)</li>
                    <li>• <strong className="text-white">Time commitment:</strong> Attend quarterly meetings and contribute to working groups</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-black/30 rounded-xl p-6 mb-6 max-w-2xl mx-auto">
                <p className="text-gray-300 mb-4">
                  <strong className="text-white">Next recruitment opens:</strong> Applications will be reviewed on a rolling basis. 
                  Register your interest to be notified when membership opens.
                </p>
                <p className="text-sm text-gray-400">
                  ✨ We prioritize applications from Black LGBTQ+ individuals and allies committed to our liberation mission
                </p>
              </div>

              <a 
                href="https://forms.gle/QE2qYpeqAeh67cdbA"
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-8 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 text-lg"
              >
                <Users className="w-6 h-6" />
                <span>Register Interest in Co-operative Membership</span>
                <ExternalLink className="w-5 h-5" />
              </a>
              
              <p className="text-sm text-gray-400 mt-3">
                📝 Quick form - takes 2 minutes to complete
              </p>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Our Values in Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreValues.map((value, index) => {
              const IconComponent = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-4 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-300">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Governance Areas */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">Democratic Participation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {governanceAreas.map((area, index) => {
              const IconComponent = area.icon
              return (
                <motion.div
                  key={area.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${area.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-white">{area.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[area.status as keyof typeof statusColors]}`}>
                          {area.status}
                        </span>
                      </div>
                      <p className="text-gray-300">{area.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Photo Competition Partnership Invitation */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                📸 Community Partnership Opportunity: Photo Competition
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Join us in celebrating Black queer identity through visual storytelling
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Competition Categories</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🖤</span>
                    <div>
                      <div className="font-semibold text-white">BLACK</div>
                      <div className="text-sm text-gray-400">Celebrating Black identity, culture, and community</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🏳️‍🌈</span>
                    <div>
                      <div className="font-semibold text-white">OUT</div>
                      <div className="text-sm text-gray-400">Living authentically and taking up space</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🚀</span>
                    <div>
                      <div className="font-semibold text-white">NEXT</div>
                      <div className="text-sm text-gray-400">Building the future we need</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💫</span>
                    <div>
                      <div className="font-semibold text-white">INTERSECTIONS</div>
                      <div className="text-sm text-gray-400">The beauty of being Black and queer</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">✊🏾</span>
                    <div>
                      <div className="font-semibold text-white">LIBERATION</div>
                      <div className="text-sm text-gray-400">Moments of freedom, resistance, and joy</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">Partnership Invitation</h3>
                <div className="bg-black/30 rounded-xl p-6 mb-6">
                  <p className="text-gray-300 mb-4">
                    We invite organizations, photographers, and community leaders to partner with us in amplifying 
                    Black queer voices through this photography competition.
                  </p>
                  <p className="text-gray-300 mb-4">
                    <strong className="text-white">Partnership opportunities include:</strong>
                  </p>
                  <ul className="text-gray-300 space-y-2 mb-4">
                    <li>• Co-hosting competition events</li>
                    <li>• Providing judging expertise</li>
                    <li>• Offering prizes and recognition</li>
                    <li>• Supporting community outreach</li>
                    <li>• Exhibition and showcase opportunities</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <a 
                    href="mailto:partnerships@blkout.co.uk?subject=Photo%20Competition%20Partnership"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <Mail className="w-5 h-5" />
                    <span>Partner With Us</span>
                  </a>
                  <button className="bg-white/20 hover:bg-white/30 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Contact Form */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <MessageSquare className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Contact Community Governance</h2>
              <p className="text-gray-300">
                Questions about democratic participation, partnerships, or community proposals
              </p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Organization (Optional)</label>
                <input
                  type="text"
                  value={contactForm.organization}
                  onChange={(e) => handleContactChange('organization', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Organization name"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Subject</label>
                <select
                  value={contactForm.subject}
                  onChange={(e) => handleContactChange('subject', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Partnership Proposal">Partnership Proposal</option>
                  <option value="Photo Competition">Photo Competition Partnership</option>
                  <option value="Community Proposal">Community Proposal</option>
                  <option value="Governance Question">Governance Question</option>
                  <option value="Working Group Interest">Working Group Interest</option>
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Message</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => handleContactChange('message', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your inquiry, proposal, or interest in partnering with us..."
                  required
                />
              </div>

              <div className="text-center">
                {contactStatus === 'success' && (
                  <div className="flex items-center justify-center space-x-2 text-green-400 mb-4">
                    <CheckCircle className="w-5 h-5" />
                    <span>Message sent successfully! We'll respond within 48 hours.</span>
                  </div>
                )}
                
                {contactStatus === 'error' && (
                  <div className="flex items-center justify-center space-x-2 text-red-400 mb-4">
                    <AlertCircle className="w-5 h-5" />
                    <span>Failed to send message. Please email us directly at governance@blkout.co.uk</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={contactStatus === 'submitting'}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto disabled:opacity-50"
                >
                  {contactStatus === 'submitting' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SharedLayout>
  )
}

export default GovernancePage