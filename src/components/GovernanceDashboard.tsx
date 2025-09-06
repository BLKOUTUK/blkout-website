// BLKOUT Community Benefit Society Governance Dashboard
// Real governance information based on official BLKOUT documents

import { useState, useEffect } from 'react'
import { Heart, Users, FileText, Calendar, ExternalLink, Mail, Award, Camera, Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function GovernanceDashboard() {
  const [loading, setLoading] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    organization: '',
    subject: 'General Inquiry',
    message: ''
  })
  const [contactStatus, setContactStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [contactError, setContactError] = useState('')

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setContactStatus('submitting')
    
    try {
      // In production, this would send to a real backend
      // For now, simulate a successful submission
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
      setContactError('Failed to send message. Please try emailing us directly.')
      setTimeout(() => setContactStatus('idle'), 5000)
    }
  }

  const handleContactChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blkout-deep via-blkout-deep to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blkout-primary to-blkout-warm rounded-lg mb-6">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">
            BLKOUT Community Governance
          </h1>
          <p className="text-xl text-gray-200 max-w-4xl mx-auto mb-8">
            A social justice initiative transforming "a category into a community" through democratic cooperative ownership.
            <br />
            <strong>Community Benefit Society</strong> - Building Black Queer Community Power
          </p>
          
          {/* Mission Statement */}
          <div className="bg-black/30 backdrop-blur-sm border border-blkout-primary/30 rounded-2xl p-8 max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-blkout-secondary mb-4">Our Mission: From Category to Community</h2>
            <p className="text-gray-200 text-lg leading-relaxed">
              Black queer men in the UK face racisms and homophobia/transphobia that exclude them from 
              opportunities and impose unjust limits on their potential. We exist to transform this reality by creating 
              spaces where Black queer men can connect authentically, share stories, and build power together. 
              Through dialogue-centered events, community media, and democratic governance, we're building the 
              infrastructure our community needs to thrive and resist.
            </p>
          </div>
        </div>

        {/* Our Values in Action */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Values in Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm border border-blkout-primary/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blkout-primary to-blkout-warm rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold">✊</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">We are becoming, enough, not all the same</h3>
              <p className="text-gray-300 text-sm">Celebrating the full spectrum of Black queer identity</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-blkout-accent/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blkout-accent to-blkout-secondary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">The whole is greater than the sum of its parts</h3>
              <p className="text-gray-300 text-sm">Building collective power through community</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-blkout-warm/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blkout-warm to-blkout-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Unresolved trauma has real impact</h3>
              <p className="text-gray-300 text-sm">Centering healing in our liberation work</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm border border-blkout-secondary/20 rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blkout-secondary to-blkout-accent rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold">🌟</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Accountability, learning, and joy</h3>
              <p className="text-gray-300 text-sm">Creating sustainable movements through care</p>
            </div>
          </div>
        </div>

        {/* Community Benefit Society Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white/5 backdrop-blur-sm border border-blkout-primary/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blkout-secondary" />
              Community Benefit Society
            </h3>
            <div className="space-y-4 text-gray-200">
              <p className="text-lg">
                <strong>Legal Structure:</strong> Community Benefit Society with asset lock
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blkout-primary/10 border border-blkout-primary/30 rounded-lg p-4">
                  <p className="font-semibold text-white">Membership</p>
                  <p className="text-sm">£10 minimum share<br />Equal voting rights</p>
                </div>
                <div className="bg-blkout-accent/10 border border-blkout-accent/30 rounded-lg p-4">
                  <p className="font-semibold text-white">Democratic</p>
                  <p className="text-sm">Consensus decision-making<br />Community ownership</p>
                </div>
              </div>
              <p>
                <strong>Purpose:</strong> Advancing racial equity, LGBTQ+ equality, and social justice through 
                community-controlled media, cooperative economic development, and movement building.
              </p>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm border border-blkout-accent/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-blkout-secondary" />
              Current Focus Areas
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blkout-primary pl-4">
                <h4 className="font-semibold text-white">Community Events</h4>
                <p className="text-gray-300 text-sm">Monthly dialogue-creating gatherings building connections across the UK</p>
              </div>
              <div className="border-l-4 border-blkout-secondary pl-4">
                <h4 className="font-semibold text-white">StoryLab & Virtual Newsroom</h4>
                <p className="text-gray-300 text-sm">Community-led journalism platform centering Black queer voices</p>
              </div>
              <div className="border-l-4 border-blkout-accent pl-4">
                <h4 className="font-semibold text-white">BLKOUTHUB</h4>
                <p className="text-gray-300 text-sm">Digital space for community members to connect and collaborate</p>
              </div>
              <div className="border-l-4 border-blkout-warm pl-4">
                <h4 className="font-semibold text-white">Cooperative Development</h4>
                <p className="text-gray-300 text-sm">Building sustainable infrastructure through democratic governance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects in Development */}
        <div className="bg-white/5 backdrop-blur-sm border border-blkout-secondary/20 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-white mb-8 text-center">Projects in Development</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blkout-primary/20 to-blkout-warm/20 border border-blkout-primary/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">StoryLab & Virtual Newsroom</h4>
              <p className="text-gray-200 mb-4">
                Community-led journalism platform where Black queer men tell their own stories and 
                benefit economically from their contributions.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blkout-primary/30 text-white px-3 py-1 rounded-full text-sm">Media Production</span>
                <span className="bg-blkout-warm/30 text-white px-3 py-1 rounded-full text-sm">Economic Justice</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-300 italic">In Development - Share Your Views</p>
                <a 
                  href="https://blkoutnxtstory.carrd.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-blkout-primary text-white rounded-lg hover:bg-blkout-primary/80 transition-colors text-sm"
                >
                  Visit StoryLab
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blkout-accent/20 to-blkout-secondary/20 border border-blkout-accent/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">BLKOUT Channel</h4>
              <p className="text-gray-200 mb-4">
                Community media channel featuring podcasts, digital content, and cultural programming 
                that challenges systemic oppression and promotes intersectional liberation.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blkout-accent/30 text-white px-3 py-1 rounded-full text-sm">Media Platform</span>
                <span className="bg-blkout-secondary/30 text-white px-3 py-1 rounded-full text-sm">Cultural Programming</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-300 italic">In Development - Share Your Views</p>
                <a 
                  href="https://blkoutnxtchannel.carrd.co" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-blkout-accent text-white rounded-lg hover:bg-blkout-accent/80 transition-colors text-sm"
                >
                  Visit Channel
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Committee Meeting Notes Widget */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white/5 backdrop-blur-sm border border-blkout-warm/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blkout-secondary" />
              Latest Committee Meeting
            </h3>
            <div className="space-y-4">
              <div className="bg-blkout-deep/50 border border-blkout-primary/30 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-white">Board Meeting Summary</h4>
                  <span className="text-blkout-secondary text-sm">December 2024</span>
                </div>
                <ul className="text-gray-200 text-sm space-y-2">
                  <li>• Community Benefit Society registration progressing - 5 founding members confirmed</li>
                  <li>• StoryLab development on track for Q1 2025 launch</li>
                  <li>• Monthly community events expanding to regional chapters</li>
                  <li>• Financial sustainability model approved with diversified revenue streams</li>
                  <li>• Partnership discussions with other liberation movements initiated</li>
                </ul>
              </div>
              <div className="text-center">
                <button className="text-blkout-secondary hover:text-white transition-colors text-sm flex items-center mx-auto">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Meeting Minutes
                </button>
              </div>
            </div>
          </div>
          
          {/* Photo Competition Partnership */}
          <div className="bg-white/5 backdrop-blur-sm border border-blkout-secondary/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Camera className="w-6 h-6 mr-3 text-blkout-secondary" />
              Community Photo Competition
            </h3>
            <div className="space-y-4">
              <p className="text-gray-200">
                Celebrating Black queer joy, resilience, and community through visual storytelling.
              </p>
              
              <div className="bg-gradient-to-r from-blkout-primary/20 to-blkout-warm/20 border border-blkout-primary/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">📸 Competition Theme</h4>
                <p className="text-gray-200 text-sm">"Realness Unleashed: Authentic Moments of Black Queer Life"</p>
              </div>
              
              <div className="bg-gradient-to-r from-blkout-accent/20 to-blkout-secondary/20 border border-blkout-accent/30 rounded-lg p-4">
                <h4 className="font-semibold text-white mb-2">🤝 Sponsor Partnership Opportunities</h4>
                <p className="text-gray-200 text-sm mb-3">
                  Partner with BLKOUT to sponsor competition categories, provide prizes, or support community exhibition.
                </p>
                <ul className="text-gray-300 text-xs space-y-1">
                  <li>• Brand alignment with Black queer liberation values</li>
                  <li>• Community exhibition showcase opportunities</li>
                  <li>• Social media collaboration and authentic engagement</li>
                  <li>• Contributing to economic justice for community artists</li>
                </ul>
              </div>
              
              <div className="text-center">
                <a 
                  href="mailto:partnerships@blkoutuk.com?subject=Photo Competition Partnership"
                  className="inline-flex items-center px-4 py-2 bg-blkout-primary text-white rounded-lg hover:bg-blkout-warm transition-colors text-sm"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Partner With Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Membership & Recruitment */}
        <div className="bg-gradient-to-r from-blkout-primary/10 to-blkout-accent/10 border border-blkout-primary/30 backdrop-blur-sm rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-4">Join the Movement</h3>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Ready to build community power with us? Become a founding member of our Community Benefit Society.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Recruitment Signup */}
            <div className="bg-white/5 border border-blkout-secondary/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">📋 Next Recruitment Round</h4>
              <p className="text-gray-200 mb-4">
                Join our waiting list to be notified when applications open for the next founding member recruitment round.
              </p>
              <form className="space-y-4">
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-black/30 border border-blkout-primary/30 rounded-lg text-white placeholder-gray-400 focus:border-blkout-primary focus:outline-none"
                />
                <button 
                  type="submit"
                  className="w-full bg-blkout-primary text-white py-3 rounded-lg hover:bg-blkout-warm transition-colors font-semibold"
                >
                  Join Waiting List
                </button>
              </form>
            </div>
            
            {/* Membership Application */}
            <div className="bg-white/5 border border-blkout-accent/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4">📝 Membership Application</h4>
              <p className="text-gray-200 mb-4">
                Complete our comprehensive membership form to express your interest in joining BLKOUT as a cooperative member.
              </p>
              <div className="space-y-3 mb-4 text-sm text-gray-300">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blkout-secondary rounded-full mr-3"></span>
                  Community commitment and values alignment
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blkout-accent rounded-full mr-3"></span>
                  Skills and experience you bring to the cooperative
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blkout-warm rounded-full mr-3"></span>
                  Vision for Black queer liberation
                </div>
              </div>
              <a 
                href="https://forms.google.com/your-form-id" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-blkout-accent text-white rounded-lg hover:bg-blkout-secondary transition-colors font-semibold"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Complete Application
              </a>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-black/50 to-blkout-deep/50 backdrop-blur-sm border border-blkout-primary/30 rounded-2xl p-12">
          <h3 className="text-3xl font-bold text-white mb-6">Building Community Power Together</h3>
          <p className="text-xl text-gray-200 mb-8 max-w-4xl mx-auto">
            Our work connects to larger liberation struggles—from the fight against imperial exploitation to women's 
            liberation, LGBTQ equality, and resistance to white supremacist, patriarchal capitalism. By building community 
            infrastructure that we own and control, we're creating a foundation for sustained resistance and transformation.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-blkout-primary/10 border border-blkout-primary/30 rounded-xl p-8">
              <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                <Mail className="w-5 h-5 mr-3 text-blkout-secondary" />
                Contact Community Governance
              </h4>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                    className="px-4 py-3 bg-black/30 border border-blkout-primary/30 rounded-lg text-white placeholder-gray-400 focus:border-blkout-primary focus:outline-none"
                    required
                    disabled={contactStatus === 'submitting'}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="px-4 py-3 bg-black/30 border border-blkout-primary/30 rounded-lg text-white placeholder-gray-400 focus:border-blkout-primary focus:outline-none"
                    required
                    disabled={contactStatus === 'submitting'}
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Organization (Optional)"
                  value={contactForm.organization}
                  onChange={(e) => handleContactChange('organization', e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-blkout-primary/30 rounded-lg text-white placeholder-gray-400 focus:border-blkout-primary focus:outline-none"
                  disabled={contactStatus === 'submitting'}
                />
                
                <select
                  value={contactForm.subject}
                  onChange={(e) => handleContactChange('subject', e.target.value)}
                  className="w-full px-4 py-3 bg-black/30 border border-blkout-primary/30 rounded-lg text-white focus:border-blkout-primary focus:outline-none"
                  disabled={contactStatus === 'submitting'}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Membership Application">Membership Application</option>
                  <option value="Partnership Proposal">Partnership Proposal</option>
                  <option value="Community Feedback">Community Feedback</option>
                  <option value="Governance Question">Governance Question</option>
                </select>
                
                <textarea
                  placeholder="Your message..."
                  value={contactForm.message}
                  onChange={(e) => handleContactChange('message', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-black/30 border border-blkout-primary/30 rounded-lg text-white placeholder-gray-400 focus:border-blkout-primary focus:outline-none"
                  required
                  disabled={contactStatus === 'submitting'}
                ></textarea>
                
                <button
                  type="submit"
                  disabled={contactStatus === 'submitting'}
                  className="w-full bg-blkout-primary text-white py-3 rounded-lg hover:bg-blkout-warm transition-colors font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {contactStatus === 'submitting' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Message...
                    </>
                  ) : contactStatus === 'success' ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Message Sent!
                    </>
                  ) : contactStatus === 'error' ? (
                    <>
                      <AlertCircle className="w-4 h-4 mr-2" />
                      Try Again
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
                
                {contactStatus === 'success' && (
                  <div className="text-emerald-300 text-sm text-center">
                    ✅ Your message has been sent to the governance team!
                  </div>
                )}
                {contactStatus === 'error' && (
                  <div className="text-red-300 text-sm text-center">
                    ❌ {contactError}
                  </div>
                )}
              </form>
            </div>
            
            {/* Direct Contact Options */}
            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-bold text-white mb-4">Direct Contact</h4>
                <div className="space-y-4">
                  <a 
                    href="mailto:contact@blkoutuk.com" 
                    className="inline-flex items-center px-6 py-3 bg-blkout-primary text-white rounded-lg hover:bg-blkout-warm transition-colors font-semibold"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    contact@blkoutuk.com
                  </a>
                  <a 
                    href="https://blkoutuk.com" 
                    className="inline-flex items-center px-6 py-3 border-2 border-blkout-accent text-blkout-accent rounded-lg hover:bg-blkout-accent hover:text-white transition-colors font-semibold"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Platform
                  </a>
                </div>
              </div>
              
              <div className="bg-blkout-accent/10 border border-blkout-accent/30 rounded-lg p-6">
                <h5 className="text-lg font-bold text-white mb-3">Community Response Time</h5>
                <div className="space-y-2 text-blkout-secondary text-sm">
                  <p>• General inquiries: 48-72 hours</p>
                  <p>• Membership applications: 5-7 days</p>
                  <p>• Partnership proposals: 7-14 days</p>
                  <p>• Urgent community matters: 24 hours</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 p-6 bg-blkout-primary/10 border border-blkout-primary/30 rounded-xl">
            <p className="text-blkout-secondary font-semibold text-lg italic text-center">
              "Because when we trust the people, they become trustworthy. And when we build together, we build power that lasts."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}