'use client'

import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  LandingPrimaryImageCtaSection,
  LandingProductTourSection,
  LandingProductTourList,
  LandingProductTourTrigger,
  LandingProductTourContent,
  LandingBlogList,
  LandingBlogPost,
  LandingTestimonialGrid,
  LandingProductVideoFeature,
  LandingProductCardSection,
  LandingProductCard,
  LandingSaleCtaSection,
  LandingLeadingPill,
  LandingSocialProof,
  LandingCurvedLinesCtaBg,
} from '../landing'

const PlatformHomepage: React.FC = () => {
  // Testimonial data for community voices
  const testimonialItems = [
    {
      url: '#',
      text: 'BLKOUT UK has given me a platform to share my experiences as a Black queer person in London. The community has been incredibly supportive and uplifting.',
      imageSrc: '/images/people/person1.jpg',
      name: 'Marcus Johnson',
      handle: '@marcusj',
      featured: true,
      verified: true,
    },
    {
      url: '#',
      text: 'Finding resources through I.V.O.R. has been a game-changer for me. I finally feel represented and understood in a space that celebrates who I am.',
      imageSrc: '/images/people/person2.jpg',
      name: 'Zara Williams',
      handle: '@zaraw',
      verified: true,
    },
    {
      url: '#',
      text: "The events hosted by BLKOUT UK have connected me with people who share similar experiences. It's rare to find spaces where I can be my authentic self.",
      imageSrc: '/images/people/person3.jpg',
      name: 'Devon Clarke',
      handle: '@devonc',
      verified: true,
    },
    {
      url: '#',
      text: "As a contributor to BLKOUT UK's magazine, I've found a space where my voice is valued and my stories matter. The editorial team genuinely cares about authentic representation.",
      imageSrc: '/images/people/person4.jpg',
      name: 'Aisha Bennett',
      handle: '@aishab',
      verified: true,
    },
    {
      url: '#',
      text: "The community discussions have helped me navigate complex issues affecting our community. It's both educational and empowering to be part of such meaningful conversations.",
      imageSrc: '/images/people/person5.jpg',
      name: 'Leo Thomas',
      handle: '@leot',
      verified: true,
    },
    {
      url: '#',
      text: "BLKOUT UK's coverage of local events has given visibility to grassroots organizations that are making real change in our communities. Their platform amplifies voices that often go unheard.",
      imageSrc: '/images/people/person6.jpg',
      name: 'Maya Richards',
      handle: '@mayar',
      verified: true,
    },
  ]

  // Blog post data for recent stories
  const blogPosts = [
    {
      path: '/stories/black-joy-celebration',
      date: '2025-01-15',
      title: '[DEMO] Celebrating Black Joy as Resistance',
      summary: 'DEMO CONTENT: Exploring how joy becomes a powerful act of resistance in challenging times and community healing. This is placeholder content for platform demonstration.',
      tags: ['Demo Content', 'Black Joy', 'Resistance'],
      images: ['/images/story archive colours/blue images/tumblr_384f4870a87f4722ccfc66e8bb2fa98d_e8839690_1280.jpg'],
      readingTime: 4,
      author: {
        name: 'Demo Author',
        avatar: '/images/story archive colours/green images/tumblr_23d169b75b247ba45ea28f5638c1d3d1_62e0d5de_640.jpg',
      },
    },
    {
      path: '/stories/community-arts-spotlight',
      date: '2025-01-12',
      title: '[DEMO] Community Arts Program Making Waves in Manchester',
      summary: 'DEMO CONTENT: How a grassroots arts initiative is creating space for Black LGBTQ+ voices and cultural expression. This is placeholder content for platform demonstration.',
      tags: ['Demo Content', 'Arts', 'Manchester'],
      images: ['/images/story archive colours/red images/tumblr_5d9a2ccc0fa2a56133c0501cacc46adf_6a189059_1280.jpg'],
      readingTime: 5,
      author: {
        name: 'Demo Author',
        avatar: '/images/story archive colours/blue images/tumblr_477d8815af713c7d7c0d7cb5330ffba4_c0e7416b_1280.jpg',
      },
    },
    {
      path: '/stories/health-equity-discussion',
      date: '2025-01-10',
      title: '[DEMO] Health Equity: The Conversation We Need to Have',
      summary: 'DEMO CONTENT: Addressing disparities in healthcare access for marginalized communities and building solutions. This is placeholder content for platform demonstration.',
      tags: ['Demo Content', 'Health', 'Equity'],
      images: ['/images/story archive colours/green images/tumblr_4ccb3ff837292f82d8ab03ba554e8786_0684d01c_1280.jpg'],
      readingTime: 7,
      author: {
        name: 'Demo Author',
        avatar: '/images/story archive colours/red images/tumblr_61baa7d20ae7bdc39fce83128a90eddf_93fb7a80_1280.jpg',
      },
    },
    {
      path: '/stories/pride-event-coverage',
      date: '2025-01-08',
      title: 'UK Black Pride: Highlights from Last Weekend',
      summary: "Recap of powerful moments and voices from this year's celebration of Black QTIPOC community.",
      tags: ['Events', 'Pride', 'Community'],
      images: ['/images/stories/black-pride.jpg'],
      readingTime: 6,
      author: {
        name: 'Elena Washington',
        avatar: '/images/people/elena.jpg',
      },
    },
    {
      path: '/stories/documentary-release',
      date: '2025-01-05',
      title: 'New Documentary Chronicles Black LGBTQ+ History in Britain',
      summary: "Filmmaker's 10-year project finally gets nationwide release, sharing untold stories.",
      tags: ['Media', 'History', 'Film'],
      images: ['/images/stories/documentary.jpg'],
      readingTime: 3,
      author: {
        name: 'Thomas Grant',
        avatar: '/images/people/thomas.jpg',
      },
    },
    {
      path: '/stories/policy-impact',
      date: '2025-01-03',
      title: 'How Community Advocacy Shaped Recent Policy Changes',
      summary: 'The power of organized voices in creating institutional change and social justice progress.',
      tags: ['Original Commentary', 'Policy', 'Advocacy'],
      images: ['/images/stories/policy-change.jpg'],
      readingTime: 8,
      author: {
        name: 'Michelle Davies',
        avatar: '/images/people/michelle.jpg',
      },
    },
  ]

  // Event data for upcoming events
  const upcomingEvents = [
    {
      title: '[DEMO] Black Writers Workshop',
      description: 'DEMO EVENT: Monthly workshop for aspiring writers to develop their craft in a supportive community environment. This is demonstration content.',
      imageSrc: '/images/blkoutuk.com v3/tumblr_a8ff21cfe9302e86a3d03892c864c5a5_391b148a_1280.jpg',
      topComponent: <Badge variant="secondary">Jan 25</Badge>,
      actionComponent: (
        <Button size="sm" className="w-full">
          RSVP
        </Button>
      ),
    },
    {
      title: '[DEMO] Community Health Forum',
      description: 'DEMO EVENT: Panel discussion on addressing health disparities in LGBTQ+ communities of color. This is demonstration content.',
      imageSrc: '/images/blkoutuk.com v3/tumblr_9ccd25b3f9683386cc83b53fc27d1a39_a09d5048_1280.jpg',
      topComponent: <Badge variant="default">Feb 1</Badge>,
      actionComponent: (
        <Button size="sm" className="w-full">
          RSVP
        </Button>
      ),
      featured: true,
    },
    {
      title: '[DEMO] Digital Security Workshop',
      description: 'DEMO EVENT: Learn essential digital security practices to protect yourself and your community online. This is demonstration content.',
      imageSrc: '/images/story archive colours/blue images/tumblr_6f66259d5fb67eabf60ecd14a13aeb13_37199e34_1280.jpg',
      topComponent: <Badge variant="destructive">Feb 5</Badge>,
      actionComponent: (
        <Button size="sm" className="w-full">
          RSVP
        </Button>
      ),
    },
  ]

  // Social proof data for community engagement
  const socialProofData = {
    avatarItems: [
      { imageSrc: '/images/story archive colours/green images/tumblr_4cef6df755e59e1d12b94b3978420bbe_d8acaffb_640.jpg', name: 'Community' },
      { imageSrc: '/images/story archive colours/red images/tumblr_8702ad0f24077e755a67dfa85e3a740a_2491a610_1280.jpg', name: 'Member' },
      { imageSrc: '/images/story archive colours/blue images/tumblr_9fa487782acece6dac4f7a63331a595e_fbc0ad80_500.jpg', name: 'Demo' },
      { imageSrc: '/images/story archive colours/green images/tumblr_5b1b6534f4a738ceb37e212fb4433518_cf767bfe_1280.jpg', name: 'Avatar' },
    ],
    numberOfUsers: 247,
    suffixText: 'community members discussing',
    showRating: false,
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Demo Content Banner */}
      <div className="bg-gradient-to-r from-yellow-600 to-orange-600 text-black text-center py-3 px-4 font-bold text-sm">
        ⚠️ DEMO PLATFORM: This page contains demonstration content marked with [DEMO] tags. Real content migration from blkoutuk.com is in progress.
      </div>
      
      {/* 1. Magazine-Style Hero Section */}
      <LandingPrimaryImageCtaSection
        titleComponent={
          <h1 className="font-normal text-3xl md:text-4xl lg:text-5xl leading-tight">
            Stories that Connect.{' '}
            <span className="font-semibold bg-gradient-to-r from-emerald-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Voices that Matter.
            </span>{' '}
            <br />
            <span className="font-semibold bg-gradient-to-r from-purple-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
              Movement that Builds Power.
            </span>
          </h1>
        }
        description="Discover bold stories, join meaningful conversations, and connect with a community that puts liberation first. Your voice matters in the movement for Black QTIPOC liberation."
        imageSrc="/images/story archive colours/blue images/tumblr_16174aad10948dae01218ba8e82dd990_1ec97cae_1280.jpg"
        imageAlt="BLKOUT UK Community - celebrating Black QTIPOC voices and experiences"
        imagePosition="right"
        imageShadow="soft"
        textPosition="left"
        leadingComponent={
          <LandingLeadingPill
            borderVariant="primary"
            textVariant="primary"
            leftComponent={
              <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            }
          >
            Community Platform
          </LandingLeadingPill>
        }
        effectComponent={<LandingCurvedLinesCtaBg variant="primary" />}
      >
        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
          <Link to="/stories">Explore Stories</Link>
        </Button>
        <Button variant="outline" size="lg" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
          <a href="https://blkouthub.com" target="_blank" rel="noopener noreferrer">Join Community</a>
        </Button>

        <LandingSocialProof
          className="w-full mt-8"
          avatarItems={socialProofData.avatarItems}
          numberOfUsers={socialProofData.numberOfUsers}
          suffixText={socialProofData.suffixText}
          showRating={socialProofData.showRating}
        />
      </LandingPrimaryImageCtaSection>

      {/* 2. Featured Categories Carousel */}
      <LandingProductTourSection
        title="Explore Our Platform"
        description="Dive into different sections of our community platform, each designed to amplify Black QTIPOC voices and experiences."
        defaultValue="stories"
        withBackground={true}
        withBackgroundGlow={true}
        variant="primary"
        backgroundGlowVariant="primary"
      >
        <LandingProductTourList>
          <LandingProductTourTrigger value="stories">
            <p className="text-xl font-bold">Stories & Commentary</p>
            <p className="text-gray-400">Original perspectives and curated content from our community</p>
          </LandingProductTourTrigger>
          <LandingProductTourTrigger value="community">
            <p className="text-xl font-bold">Community Hub</p>
            <p className="text-gray-400">Connect with like-minded people and join discussions</p>
          </LandingProductTourTrigger>
          <LandingProductTourTrigger value="events">
            <p className="text-xl font-bold">Events & Gatherings</p>
            <p className="text-gray-400">Find community events, workshops, and organizing opportunities</p>
          </LandingProductTourTrigger>
          <LandingProductTourTrigger value="ivor">
            <p className="text-xl font-bold">I.V.O.R. AI Assistant</p>
            <p className="text-gray-400">Get guidance on resources, support, and community connections</p>
          </LandingProductTourTrigger>
          <LandingProductTourTrigger value="resources">
            <p className="text-xl font-bold">Resources & Support</p>
            <p className="text-gray-400">Access mental health resources, legal aid, and community support</p>
          </LandingProductTourTrigger>
        </LandingProductTourList>
        
        <LandingProductTourContent value="stories">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Stories That Shape Us</h3>
              <p className="text-gray-300 mb-6">
                Read authentic narratives from our community members, original commentary on current events, 
                and curated content that centers Black QTIPOC experiences and perspectives.
              </p>
              <Button size="sm">
                <Link to="/stories">Browse Stories</Link>
              </Button>
            </div>
            <img
              src="/images/story archive colours/green images/tumblr_15efa24c41cb085ad7c50b172a339851_270d4a24_1280.jpg"
              alt="Stories section - authentic Black QTIPOC narratives"
              className="rounded-lg"
            />
          </div>
        </LandingProductTourContent>
        
        <LandingProductTourContent value="community">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Build Community Power</h3>
              <p className="text-gray-300 mb-6">
                Join our external community hub where you can connect with organizers, participate in discussions, 
                and coordinate collective action for liberation and social justice.
              </p>
              <Button size="sm">
                <a href="https://blkouthub.com" target="_blank" rel="noopener noreferrer">Visit BLKOUT Hub</a>
              </Button>
            </div>
            <img
              src="/images/story archive colours/red images/tumblr_19cdf90e403a0faab7bf83cf434dabdf_49f4609e_640.jpg"
              alt="Community building and collective organizing"
              className="rounded-lg"
            />
          </div>
        </LandingProductTourContent>
        
        <LandingProductTourContent value="events">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Events & Organizing</h3>
              <p className="text-gray-300 mb-6">
                Find community gatherings, educational workshops, protest planning meetings, and cultural events. 
                Connect with local organizers and build power through collective action.
              </p>
              <Button size="sm">
                <Link to="/events">View Events</Link>
              </Button>
            </div>
            <img
              src="/images/blkoutuk.com v3/tumblr_b36867ede4560f83007b9b3947fca29e_98a985b6_1280.jpg"
              alt="Community events and gatherings"
              className="rounded-lg"
            />
          </div>
        </LandingProductTourContent>
        
        <LandingProductTourContent value="ivor">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">I.V.O.R. AI Assistant</h3>
              <p className="text-gray-300 mb-6">
                Get personalized guidance on mental health resources, legal support, community connections, 
                and organizing strategies. I.V.O.R. understands the unique challenges facing Black QTIPOC communities.
              </p>
              <Button size="sm">
                <Link to="/ivor">Chat with I.V.O.R.</Link>
              </Button>
            </div>
            <img
              src="/images/ivor.png"
              alt="I.V.O.R. AI assistant - mental health and community support"
              className="rounded-lg"
            />
          </div>
        </LandingProductTourContent>
        
        <LandingProductTourContent value="resources">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Community Resources</h3>
              <p className="text-gray-300 mb-6">
                Access culturally competent mental health services, legal aid resources, financial support, 
                and other essential services designed specifically for Black QTIPOC communities.
              </p>
              <Button size="sm">
                <Link to="/resources">Find Resources</Link>
              </Button>
            </div>
            <img
              src="/images/story archive colours/blue images/tumblr_3729cdb3d6dc7900759b799dd088fbc5_7fd8fb01_1280.jpg"
              alt="Community resources and mutual aid networks"
              className="rounded-lg"
            />
          </div>
        </LandingProductTourContent>
      </LandingProductTourSection>

      {/* 3. Recent Stories Feed */}
      <LandingBlogList
        title="Latest Stories"
        description="The newest content from across our platform - discover authentic voices, engage with important discussions, and share powerful narratives."
        display="grid"
        withBackground={false}
      >
        {blogPosts.map((post, index) => (
          <LandingBlogPost
            key={index}
            post={post}
            slug={post.path}
            imagePosition={
              index % 3 === 0 ? 'left' : index % 3 === 1 ? 'right' : 'center'
            }
            index={index}
          />
        ))}
      </LandingBlogList>

      {/* 4. Community Testimonials */}
      <LandingTestimonialGrid
        title="Community Voices"
        description="Hear from real community members about their experiences with BLKOUT UK and how the platform has impacted their lives."
        testimonialItems={testimonialItems}
        withBackground={false}
        withBackgroundGlow={false}
      />

      {/* 5. Upcoming Events Section */}
      <LandingProductCardSection
        title="Upcoming Events"
        description="Join us at upcoming community events, workshops, and organizing opportunities. Connect with fellow community members and build power together."
        withBackground={true}
        withBackgroundGlow={true}
        variant="primary"
        backgroundGlowVariant="primary"
        textPosition="center"
      >
        {upcomingEvents.map((event, index) => (
          <LandingProductCard
            key={index}
            title={event.title}
            description={event.description}
            imageSrc={event.imageSrc}
            imageAlt={event.title}
            topComponent={event.topComponent}
            actionComponent={event.actionComponent}
            featured={event.featured}
          />
        ))}
      </LandingProductCardSection>

      {/* 6. Video Feature Section */}
      <LandingProductVideoFeature
        title="Platform Overview"
        description="Take a tour of the BLKOUT UK platform and see how our community is building power through storytelling, connection, and collective action."
        videoSrc="/videos/platform-tour.mp4"
        videoPoster="/images/video-poster.jpg"
        videoPosition="center"
        autoPlay={false}
        controls={true}
        withBackground={true}
        withBackgroundGlow={true}
        variant="primary"
        backgroundGlowVariant="primary"
        textPosition="center"
      />

      {/* 7. Membership CTA */}
      <LandingSaleCtaSection
        title="Be Part of the Movement"
        description="Join our growing community of Black QTIPOC voices building power, sharing stories, and creating change. Your voice matters in the liberation movement."
        withBackground={false}
        variant="primary"
      >
        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
          <a href="https://blkouthub.com" target="_blank" rel="noopener noreferrer">Join Community</a>
        </Button>
        <Button variant="outline" size="lg" className="border-purple-500 text-purple-300 hover:bg-purple-500/10">
          <Link to="/about">Learn More</Link>
        </Button>
      </LandingSaleCtaSection>
    </div>
  )
}

export default PlatformHomepage