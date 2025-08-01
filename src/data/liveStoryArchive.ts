// Live Story Archive - Based on BLKOUT UK Blog Content
// Sourced from blkoutuk.com homepage blog section

export interface StoryArchiveItem {
  id: string
  title: string
  excerpt: string
  content?: string
  author: {
    name: string
    avatar: string
    bio?: string
  }
  publishedAt: string
  readTime: number
  category: string
  featured: boolean
  tags: string[]
  imageUrl?: string
  externalUrl?: string
  source: 'blkoutuk-blog' | 'platform'
}

// Live stories from BLKOUT UK blog
export const liveStoryArchive: StoryArchiveItem[] = [
  {
    id: 'welcome-blkoutuk-blog-2024',
    title: 'WELCOME TO THE BLKOUTUK BLOG',
    excerpt: 'A space for Black queer men to think, shout, show off, curse, celebrate, laugh, reflect and share. This is our digital home for authentic voices and radical imagination.',
    content: `Welcome to the BLKOUTUK blog - a space created by and for Black queer men. This is where we come to think out loud, celebrate our wins, work through our challenges, and share the stories that matter most to our community.

    Here you'll find everything from personal reflections to community spotlights, from cultural commentary to calls for action. This is our digital living room, our community center, our creative studio.

    We're building something different here - a platform where Black queer men can be fully themselves, where our experiences are centered, and where our voices lead the conversation about liberation, love, and community building.

    Welcome home.`,
    author: {
      name: 'BLKOUT UK Team',
      avatar: 'BU',
      bio: 'The collective voice of BLKOUT UK community'
    },
    publishedAt: '2024-03-03',
    readTime: 3,
    category: 'Community',
    featured: true,
    tags: ['Welcome', 'Community', 'Blog Launch', 'Black Queer Men'],
    source: 'blkoutuk-blog'
  },
  {
    id: 'road-to-future-2024',
    title: 'READ: THE ROAD TO THE FUTURE',
    excerpt: 'Reflecting on LGBTQ History Month and resisting the erasure of Black folk from LGBTQ histories. How do we honor our past while building our future?',
    content: `LGBTQ History Month gives us pause to reflect on how far we've come and how far we still need to go. But too often, these celebrations erase Black folk from LGBTQ histories, treating our contributions as footnotes rather than foundational stories.

    We've always been here. From the ballroom culture that birthed voguing to the trans women of color who threw the first bricks at Stonewall. From the AIDS activists who demanded action to the poets who gave voice to our pain and joy.

    The road to the future requires us to reclaim these stories, to center Black queer voices in liberation movements, and to build spaces where our full humanity is recognized and celebrated.

    This is why BLKOUT UK exists - not just to add diversity to existing spaces, but to create entirely new paradigms for community, support, and liberation.`,
    author: {
      name: 'Editorial Team',
      avatar: 'ET',
      bio: 'BLKOUT UK editorial collective'
    },
    publishedAt: '2024-03-03',
    readTime: 6,
    category: 'History & Culture',
    featured: true,
    tags: ['LGBTQ History', 'Black Liberation', 'Erasure', 'Community Memory'],
    source: 'blkoutuk-blog'
  },
  {
    id: 'invitation-clubland-2023',
    title: 'INVITATION TO CLUBLAND',
    excerpt: 'A proposal for creating sustainable, affirming, and transformative spaces where Black queer men can gather, connect, and build community beyond the limitations of traditional venues.',
    content: `What if we reimagined what community spaces could look like for Black queer men? What if we moved beyond the limitations of traditional club scenes and created something entirely new?

    This is an invitation to envision clubland not just as a place to party, but as a site of community building, cultural exchange, and collective care. Sustainable spaces that center our wellbeing alongside our joy.

    We're talking about spaces that are:
    - Economically sustainable and community-owned
    - Affirming of all Black queer identities 
    - Transformative rather than just entertaining
    - Connected to broader liberation movements

    This isn't about rejecting fun or celebration - it's about expanding what's possible when we create spaces truly designed for us, by us.`,
    author: {
      name: 'Community Organizer',
      avatar: 'CO',
      bio: 'Grassroots organizer and space creator'
    },
    publishedAt: '2023-09-05',
    readTime: 8,
    category: 'Community Building',
    featured: false,
    tags: ['Clubland', 'Community Spaces', 'Sustainable Culture', 'Black Queer Venues'],
    source: 'blkoutuk-blog'
  },
  {
    id: 'visibility-vulnerability-individualism-2023',
    title: 'VISIBILITY, VULNERABILITY, AND INDIVIDUALISM',
    excerpt: 'Exploring theatre and personal journey through the lens of a Black queer everyman. How do we balance individual expression with collective liberation?',
    content: `Theatre has always been a space where Black queer men can explore the full range of human experience. In this reflection on recent performances and personal journey, we examine the tension between visibility and vulnerability, between individual expression and collective responsibility.

    The character of the "Black queer everyman" in contemporary theatre reflects our own struggles with representation - how do we tell stories that honor our specificity while speaking to universal themes of love, loss, identity, and belonging?

    This piece explores:
    - The politics of visibility in performance
    - How vulnerability becomes a form of resistance
    - The balance between individual narrative and community story
    - Theatre as a site of healing and imagination

    Through performance, we find ways to rehearse liberation, to practice being fully ourselves in spaces that may not always welcome us.`,
    author: {
      name: 'Theatre Artist',
      avatar: 'TA',
      bio: 'Performer and cultural critic'
    },
    publishedAt: '2023-07-19',
    readTime: 10,
    category: 'Arts & Culture',
    featured: false,
    tags: ['Theatre', 'Performance', 'Visibility', 'Black Queer Art', 'Vulnerability'],
    source: 'blkoutuk-blog'
  },
  {
    id: 'know-your-place-2023',
    title: 'READ: KNOW YOUR PLACE?',
    excerpt: 'An exploration of Black queer spaces in London during LGBT+ History Month. Where do we belong, and how do we create belonging for others?',
    content: `"Know your place" - these words have been used to put us in our place, to remind us of hierarchies we didn't create but are expected to respect. But what if we reclaimed these words? What if knowing our place meant understanding our power, our history, our right to take up space?

    During LGBT+ History Month, we explored Black queer spaces across London - from the legendary venues of Vauxhall to the pop-up parties in South London community centers. We found thriving communities creating their own definitions of home and belonging.

    This journey revealed:
    - How Black queer Londoners are reshaping the city's nightlife
    - The economics of community space creation
    - Intergenerational knowledge sharing in club culture
    - The politics of place-making in an expensive city

    Our place is wherever we decide to build community. Our place is wherever we choose to love out loud.`,
    author: {
      name: 'London Explorer',
      avatar: 'LE',
      bio: 'Documenting Black queer London'
    },
    publishedAt: '2023-03-02',
    readTime: 7,
    category: 'Geography & Space',
    featured: false,
    tags: ['London', 'Black Queer Spaces', 'LGBT History', 'Place-making', 'Geography'],
    source: 'blkoutuk-blog'
  },
  {
    id: 'making-space-for-us-manifesto',
    title: '#MAKINGSPACEFORUS: A MANIFESTO',
    excerpt: 'The foundational principles behind BLKOUT UK\'s mission to create transformative spaces for Black queer men. Why we exist and what we\'re building together.',
    content: `#MakingSpaceForUs isn't just a hashtag - it's a commitment, a practice, a revolution in how we think about community, belonging, and liberation.

    We exist because:
    - Black queer men deserve spaces designed specifically for us
    - Our stories, struggles, and celebrations are worthy of center stage
    - Community care and mutual aid are forms of resistance
    - Joy and liberation go hand in hand

    We're making space for:
    - Honest conversations about mental health and wellbeing
    - Economic cooperation and community wealth building  
    - Creative expression that doesn't need to be palatable to others
    - Political organizing that centers our experiences
    - Love, friendship, and chosen family

    This manifesto is our north star, our reminder of why this work matters, and our invitation for others to join us in building the world we need.`,
    author: {
      name: 'BLKOUT UK Founders',
      avatar: 'BF',
      bio: 'Collective founding vision'
    },
    publishedAt: '2023-01-15',
    readTime: 5,
    category: 'Manifesto',
    featured: true,
    tags: ['Manifesto', 'MakingSpaceForUs', 'Community Vision', 'Black Liberation'],
    source: 'blkoutuk-blog'
  },
  {
    id: 'digital-liberation-technology',
    title: 'DIGITAL LIBERATION: TECHNOLOGY AS COMMUNITY TOOL',
    excerpt: 'How we\'re using technology not to replace human connection, but to strengthen and expand it. Building digital tools for community liberation.',
    content: `Technology isn't neutral. The platforms we use, the algorithms that shape what we see, the apps that connect us - all of these are designed with particular users and uses in mind. And too often, they're not designed with Black queer communities at the center.

    That's why we're committed to digital liberation - using technology as a tool for community building rather than community extraction. This means:

    - Building platforms that prioritize community wellbeing over engagement metrics
    - Creating digital spaces that feel like home, not like surveillance
    - Using AI and automation to support, not replace, human connection
    - Centering accessibility and digital equity in all our tools

    The BLKOUT platform isn't just a website - it's a digital home, a community center, a organizing space, and a creative studio all in one. It's technology in service of liberation.`,
    author: {
      name: 'Tech Collective',
      avatar: 'TC',
      bio: 'BLKOUT UK technical team'
    },
    publishedAt: '2024-01-20',
    readTime: 8,
    category: 'Technology',
    featured: false,
    tags: ['Digital Liberation', 'Technology', 'Community Platforms', 'Digital Equity'],
    source: 'platform'
  },
  {
    id: 'mental-health-community-care',
    title: 'BEYOND THERAPY: COMMUNITY APPROACHES TO MENTAL HEALTH',
    excerpt: 'Exploring how Black queer communities have always practiced collective care and how we can strengthen these traditions in modern contexts.',
    content: `Mental health support for Black queer men can't be separated from the broader context of community, culture, and systemic oppression. While individual therapy has its place, we also need to strengthen community-based approaches to healing and wellbeing.

    Our ancestors knew this. From the healing circles of the African diaspora to the houses of ballroom culture, Black queer communities have always created spaces for mutual support, collective processing, and community care.

    Today, this looks like:
    - Peer support networks that understand our specific experiences
    - Creative therapy through art, music, and performance
    - Community healing practices that honor our cultural traditions
    - Economic support that reduces stress and creates stability
    - Political organizing that addresses root causes of trauma

    Healing happens in community. Liberation is a collective practice.`,
    author: {
      name: 'Community Healer',
      avatar: 'CH',
      bio: 'Mental health advocate and community organizer'
    },
    publishedAt: '2024-02-14',
    readTime: 9,
    category: 'Health & Wellness',
    featured: false,
    tags: ['Mental Health', 'Community Care', 'Healing', 'Collective Wellbeing'],
    source: 'platform'
  },
  {
    id: 'economics-of-liberation',
    title: 'THE ECONOMICS OF LIBERATION: BUILDING BLACK QUEER WEALTH',
    excerpt: 'How cooperative economics and community ownership can create pathways to economic liberation for Black queer communities.',
    content: `Economic liberation and social liberation are inseparable. We can't build truly free communities while remaining economically dependent on systems that exploit us.

    That's why BLKOUT UK is committed to exploring cooperative economics, community ownership, and alternative economic models that center community wellbeing over individual accumulation.

    This means:
    - Supporting Black queer-owned businesses and cooperatives
    - Creating community investment funds and lending circles
    - Developing job training and entrepreneurship programs
    - Building platforms for economic cooperation and resource sharing
    - Advocating for economic policies that support our communities

    When we control our own economic resources, we can fund our own liberation, support our own communities, and build the world we want to see.`,
    author: {
      name: 'Economic Justice Organizer',
      avatar: 'EJO',
      bio: 'Community economist and organizer'
    },
    publishedAt: '2024-04-10',
    readTime: 11,
    category: 'Economics',
    featured: false,
    tags: ['Economic Liberation', 'Cooperative Economics', 'Community Wealth', 'Black Business'],
    source: 'platform'
  },
  {
    id: 'storytelling-as-resistance',
    title: 'STORYTELLING AS RESISTANCE: OUR NARRATIVES, OUR POWER',
    excerpt: 'Why controlling our own stories is essential to liberation, and how community-controlled media creates space for authentic Black queer narratives.',
    content: `Who gets to tell our stories? Who decides which aspects of Black queer life get highlighted, celebrated, or criticized? For too long, our narratives have been filtered through outside perspectives, reduced to trauma porn or inspiration, denied the full complexity of our humanity.

    Storytelling as resistance means:
    - Creating our own media platforms and distribution networks
    - Supporting Black queer writers, filmmakers, and content creators
    - Sharing stories that reflect the full range of our experiences
    - Using narrative to build community and inspire action
    - Challenging mainstream representations that limit or stereotype us

    The BLKOUT magazine, our community stories, our platform for sharing experiences - these aren't just entertainment. They're acts of resistance, tools for community building, and investments in our collective future.

    When we control our narratives, we control our power.`,
    author: {
      name: 'Storytelling Collective',
      avatar: 'SC',
      bio: 'Community storytellers and media makers'
    },
    publishedAt: '2024-05-25',
    readTime: 7,
    category: 'Media & Storytelling',
    featured: true,
    tags: ['Storytelling', 'Media Justice', 'Narrative Power', 'Community Media'],
    source: 'platform'
  }
]

// Function to get featured stories
export const getFeaturedStories = (): StoryArchiveItem[] => {
  return liveStoryArchive.filter(story => story.featured)
}

// Function to get stories by category
export const getStoriesByCategory = (category: string): StoryArchiveItem[] => {
  return liveStoryArchive.filter(story => story.category === category)
}

// Function to get recent stories
export const getRecentStories = (limit: number = 5): StoryArchiveItem[] => {
  return liveStoryArchive
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}

// Function to search stories
export const searchStories = (query: string): StoryArchiveItem[] => {
  const lowercaseQuery = query.toLowerCase()
  return liveStoryArchive.filter(story => 
    story.title.toLowerCase().includes(lowercaseQuery) ||
    story.excerpt.toLowerCase().includes(lowercaseQuery) ||
    story.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

export default liveStoryArchive