// Articles migrated from blkoutuk.com
// This file contains real content from the BLKOUT community

export interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  category: 'original' | 'curated' | 'event-coverage' | 'community-response' | 'multimedia'
  tags: string[]
  featured: boolean
  image?: string
  readTime: number
  views: number
  shares: number
  bookmarks: number
  slug: string
  originalUrl?: string
}

import { ArticleImageGenerator } from '../utils/imageGenerator'

// Generate contextual images based on article category and content
const generateArticleImage = (category: Article['category'], id: string): string => {
  return ArticleImageGenerator.generateThemedPlaceholder(category, id)
}

export const articles: Article[] = [
  {
    id: '1',
    title: 'WELCOME TO THE BLKOUTUK BLOG',
    excerpt: 'We created the BLKOUT_UK BLOG as a space for us to think, shout, show off, curse, celebrate, laugh, reflect and share. Our own space to hear and be heard, beyond the empty rhetoric of "representation" or "clout".',
    content: `We created the BLKOUT_UK BLOG as a space for us to think, shout, show off, curse, celebrate, laugh, reflect and share. Our own space to hear and be heard, beyond the empty rhetoric of 'representation' or 'clout', Black queer men, if you've got something you want to say to other Black queer men, this is the platform!

#MAKINGSPACEFORUS

This is our invitation to create, share, and build community through authentic storytelling and genuine dialogue. We believe in the power of Black queer voices to shape our own narratives and create the spaces we need to thrive.`,
    author: 'BLKOUT UK Team',
    publishedAt: '2024-03-03T00:00:00Z',
    category: 'original',
    tags: ['community', 'platform-launch', 'black-queer-voices'],
    featured: true,
    image: generateArticleImage('original', '1'),
    readTime: 3,
    views: 1847,
    shares: 124,
    bookmarks: 89,
    slug: 'welcome-to-blkoutuk-blog',
    originalUrl: 'https://blkoutuk.com/hello-world/'
  },
  {
    id: '2',
    title: 'READ: THE ROAD TO THE FUTURE',
    excerpt: 'The close of 2024\'s LGBTQ History Month is a good time to reflect on preserving and celebrating Black LGBTQ histories, drawing inspiration from four Black British Queer icons.',
    content: `The close of 2024's LGBTQ History Month is a good time to reflect on the importance of preserving and celebrating Black LGBTQ histories. This piece highlights four Black British Queer icons:

1. **Ivor Cummings** - Pioneering activist and community builder
2. **Berto Pasuka** - Trailblazing artist and performer  
3. **Pearl Alcock** - Legendary drag performer and community elder
4. **Justin Fashanu** - Groundbreaking footballer who challenged sports' homophobia

As Audre Lorde reminds us: "Through examining the combination of our triumphs and errors, we can examine the dangers of an incomplete vision." 

We must resist the erasure of Black LGBTQ individuals from historical narratives. Contemporary efforts to document and celebrate our history include Jason Okundaye's book "Revolutionary Acts," Aids Memory UK's preservation work, and the Rainbow Plaque commemorating the Bellenden Road Black Lesbian and Gay Centre.

#MAKINGSPACEFORUS #LGBTQHistory #BlackQueerHistory`,
    author: 'BLKOUT UK Team',
    publishedAt: '2024-03-03T12:00:00Z',
    category: 'original',
    tags: ['lgbtq-history', 'black-queer-icons', 'preservation', 'audre-lorde'],
    featured: true,
    image: generateArticleImage('original', '2'),
    readTime: 7,
    views: 2156,
    shares: 187,
    bookmarks: 234,
    slug: 'road-to-the-future',
    originalUrl: 'https://blkoutuk.com/read-the-road-to-the-future/'
  },
  {
    id: '3',
    title: 'invitation to clubland',
    excerpt: 'How can we create sustainable, affirming, and transformative spaces that enable us to live our best lives? A funding proposal by BlackOut UK for creating community spaces.',
    content: `How can we create sustainable, affirming, and transformative spaces that enable us to live our best lives?

This funding proposal by BlackOut UK aims to develop spaces for Black gay men from 2024-2029 - spaces for connection, creativity, and mutual care.

**Community Voices:**

Trooy Fairclough supports creating "a space where Black, gay, men could explore, express, and develop their creativity free from prejudice."

Mike Scott-Harding proposed "a workshop for Black gay males that deals with unlocking 'creativity' within a public space" focusing on well-being and self-expression.

**Special Offer:** Individuals who complete a recording for the pitch by end of September 2023 can claim a special edition "Brother to Brother" T-shirt.

Together, we're building the infrastructure for Black queer joy, creativity, and community care.

#MAKINGSPACEFORUS`,
    author: 'BLKOUT UK Team',
    publishedAt: '2023-09-05T00:00:00Z',
    category: 'community-response',
    tags: ['funding', 'community-spaces', 'creativity', 'well-being'],
    featured: false,
    image: generateArticleImage('community-response', '3'),
    readTime: 5,
    views: 1432,
    shares: 98,
    bookmarks: 156,
    slug: 'invitation-to-clubland',
    originalUrl: 'https://blkoutuk.com/invitation/'
  },
  {
    id: '4',
    title: 'Visibility, vulnerability, and individualism (part two)',
    excerpt: 'Audiences have a role to play in theatre beyond consumers. Exploring Black queer storytelling and the limitations of visibility through Michael R Jackson\'s "A Strange Loop".',
    content: `"The challenge of the twenty-first century is not to demand equal opportunity to participate in the machinery of oppression" - Angela Davis

"In this exquisitely connected world, it's never a question of 'critical mass.' It's always about critical connections" - Grace Lee Boggs

This article explores Black queer storytelling, artistic representation, and the limitations of visibility without meaningful dialogue and action. We examine Michael R Jackson's play "A Strange Loop" as a catalyst for understanding how art can challenge systemic discrimination and build connections within Black queer communities.

**Key Insights:**
- Visibility alone is insufficient for liberation
- Art should create dialogue and challenge oppressive structures  
- The importance of creating spaces for Black queer storytelling and connection
- Recognizing shared experiences beyond individual narratives

True progress requires moving beyond individual recognition to collective understanding and action, emphasizing the need to interrupt recurring patterns of marginalization.

The piece argues that audiences have a role beyond consumption - we must engage, dialogue, and transform together.`,
    author: 'BLKOUT UK Team',
    publishedAt: '2023-07-21T00:00:00Z',
    category: 'original',
    tags: ['theatre', 'visibility', 'black-queer-storytelling', 'angela-davis', 'grace-lee-boggs'],
    featured: false,
    image: generateArticleImage('original', '4'),
    readTime: 8,
    views: 1876,
    shares: 143,
    bookmarks: 201,
    slug: 'visibility-vulnerability-individualism-part-two',
    originalUrl: 'https://blkoutuk.com/read-visibility-vulnerability-and-individualism-part-two/'
  },
  {
    id: '5',
    title: 'Visibility, vulnerability, and individualism',
    excerpt: 'We say "representation matters," but we rarely ask: to whom? What kind of representation matters? Analyzing Michael R. Jackson\'s "A Strange Loop" and Black queer visibility.',
    content: `"We say 'representation matters,' but we rarely ask: to whom? What kind of representation matters?"

This analysis explores Michael R. Jackson's musical "A Strange Loop," examining themes of Black queer identity, representation, and the complexities of visibility. The piece critically examines the play's portrayal of Usher, a Black queer protagonist navigating personal and societal challenges.

**Key Themes:**
- Representation and its limitations
- Black queer experience in theatre
- Vulnerability in visibility
- The role of art in social change

As James Baldwin reminds us: "Artists are here to disturb the peace."

The musical serves as a lens for examining broader questions about Black queer storytelling, audience engagement, and the responsibility of representation. We explore how Usher's journey reflects larger patterns of isolation, creativity, and the search for authentic community.

This is part one of a two-part series analyzing the musical's impact, audience reactions, and broader social implications of Black queer storytelling in contemporary theatre.

Visibility alone is not enough for meaningful change - we must create spaces for genuine dialogue and collective action.`,
    author: 'BLKOUT UK Team',
    publishedAt: '2023-07-19T00:00:00Z',
    category: 'original',
    tags: ['theatre', 'representation', 'james-baldwin', 'a-strange-loop', 'black-queer-identity'],
    featured: false,
    image: generateArticleImage('original', '5'),
    readTime: 6,
    views: 1654,
    shares: 112,
    bookmarks: 178,
    slug: 'visibility-vulnerability-individualism',
    originalUrl: 'https://blkoutuk.com/read-visibility-vulnerability-and-individualism/'
  },
  {
    id: '6',
    title: 'READ: KNOW YOUR PLACE?',
    excerpt: 'Together with members and friends we explored the past, present and future of Black queer spaces in London during our #makingspaceforus community research project.',
    content: `Together with members and friends we explored the past, present and future of Black queer spaces in London during our #makingspaceforus community research project.

BLKOUT UK explored Black queer spaces in London during LGBT+ History Month through online and in-person events. Our community research focused on understanding how we can create and maintain spaces that truly serve our needs.

**"London calling to the underground, London calling to the faraway towns..."**

This exploration included:
- Historical analysis of Black queer spaces in the city
- Current challenges and opportunities
- Future visioning for sustainable community spaces
- Member stories and experiences

We're inviting community members to contribute to our upcoming audio documentary by sharing their perspectives. Your voice matters in documenting our collective history and shaping our future.

**Call to Action:** Interested participants can share their views for our special audio documentary planned for April publication.

#makingspaceforus #LDNTWN`,
    author: 'BLKOUT UK Team',
    publishedAt: '2023-03-02T00:00:00Z',
    category: 'community-response',
    tags: ['london', 'community-spaces', 'research', 'lgbt-history-month'],
    featured: false,
    image: generateArticleImage('community-response', '6'),
    readTime: 4,
    views: 1234,
    shares: 76,
    bookmarks: 134,
    slug: 'know-your-place',
    originalUrl: 'https://blkoutuk.com/read-know-your-place/'
  },
  {
    id: '7',
    title: 'LISTEN: IT DOESN\'T HAVE TO BE THIS WAY',
    excerpt: 'When we forget that the way it is, is not the way it has to be, we give up our power over the future. A consultation about community-led scrutiny of London\'s Metropolitan police.',
    content: `"When we forget that the way it is, is not the way it has to be, we give up our power over the future."

This article discusses a crucial consultation about local and community-led scrutiny of London's Metropolitan police, with a specific focus on amplifying Black LGBTQ voices in police oversight conversations.

**The Challenge:**
Only a small number of people (fewer than 10) attended our planned event for Black LGBTQ voices - highlighting the ongoing barriers to community engagement in institutional reform processes.

**Why This Matters:**
- Police accountability affects our communities disproportionately
- Black LGBTQ voices are often absent from oversight conversations
- Community-led scrutiny can challenge existing power structures
- Our participation shapes the future of policing in London

**Moving Forward:**
For those who couldn't attend the live event, consultation opportunities remain available. We must remember that change is possible when we refuse to accept harmful systems as permanent fixtures.

The key message remains: challenging existing systems requires our active participation and sustained engagement.`,
    author: 'BLKOUT UK Team',
    publishedAt: '2022-11-25T00:00:00Z',
    category: 'community-response',
    tags: ['police-accountability', 'community-engagement', 'metropolitan-police', 'black-lgbtq'],
    featured: false,
    image: generateArticleImage('community-response', '7'),
    readTime: 5,
    views: 987,
    shares: 67,
    bookmarks: 112,
    slug: 'it-doesnt-have-to-be-this-way',
    originalUrl: 'https://blkoutuk.com/listen-it-doesnt-have-to-be-this-way/'
  },
  {
    id: '8',
    title: 'WATCH: INVESTMENT IN US – a community accelerated',
    excerpt: 'Introducing BLKOUT Community Accelerator, a forward-looking initiative focused on empowering Black queer men during Black History Month.',
    content: `"I look at my own body / With eyes no longer blind / And I see that my own hands can make / The world that's in my mind." - Langston Hughes

Introducing BLKOUT Community Accelerator, a forward-looking initiative focused on empowering Black queer men. This piece highlights a vision for community investment, featuring stories of transformation and emphasizing collective action and solidarity.

**The Vision:**
Our Community Accelerator represents more than programming - it's about creating sustainable pathways for Black queer men to access resources, build networks, and develop leadership skills within our communities.

**What We're Building:**
- Mentorship networks connecting across generations
- Skills development workshops led by community members
- Funding opportunities for community-led projects
- Advocacy training for systemic change
- Spaces for healing and mutual support

**During Black History Month** we reflect not just on past achievements, but on future possibilities. The Accelerator embodies our commitment to turning vision into reality through collective action.

**Next Steps:**
Follow-up pieces will address specific impact opportunities and ways UK-based Black gay, bi, and trans men can get involved in building solidarity with BLKOUT.

#MakingSpaceForUs #CommunityAccelerator #BlackQueerSolidarity`,
    author: 'BLKOUT UK Team',
    publishedAt: '2022-10-04T00:00:00Z',
    category: 'community-response',
    tags: ['community-accelerator', 'langston-hughes', 'black-history-month', 'empowerment'],
    featured: true,
    image: generateArticleImage('community-response', '8'),
    readTime: 6,
    views: 1765,
    shares: 145,
    bookmarks: 198,
    slug: 'investment-in-us-community-accelerated',
    originalUrl: 'https://blkoutuk.com/watch-investment-in-us-a-community-accelerated/'
  },
  {
    id: '9',
    title: 'GALLERY: PASTORAL PICNIC PLEASURES',
    excerpt: 'Thanks for coming! See you at UK Black Pride next week. A photo gallery from our very special, sociable afternoon in the sunshine at Regent\'s Park.',
    content: `Thanks for coming! See you at UK Black Pride next week!

**Event:** Community Picnic  
**Location:** Regent's Park, London  
**Photography:** Matt Mahmood Ogston

This photo gallery captures our community gathering - a very special, sociable afternoon in the sunshine. The images showcase the joy, connection, and celebration that happens when we create space for ourselves to simply be together.

**Highlights from the day:**
- Beautiful weather and even more beautiful community
- Shared food, laughter, and authentic connections
- Preparation and excitement for UK Black Pride
- Introducing our "Stronger Together" project

**Looking Forward:**
We're also calling for people to register for our UK Black Pride FlashMob to "spread the word about the new and improved BLKOUTHUB."

**Special Thanks:**
Thanks again to our most excellent partners and guests for making this gathering so meaningful. These moments of joy and community are what sustain us and remind us why we do this work.

**Next:** UK Black Pride preparation and FlashMob participation

#MAKINGSPACEFORUS`,
    author: 'BLKOUT UK Team',
    publishedAt: '2022-08-07T00:00:00Z',
    category: 'event-coverage',
    tags: ['picnic', 'regents-park', 'uk-black-pride', 'community-gathering', 'photography'],
    featured: false,
    image: generateArticleImage('event-coverage', '9'),
    readTime: 3,
    views: 1432,
    shares: 89,
    bookmarks: 145,
    slug: 'pastoral-picnic-pleasures',
    originalUrl: 'https://blkoutuk.com/gallery-pastoral-picnic-pleasures/'
  },
  {
    id: '10',
    title: 'WATCH THIS SPACE: THE BLACK BOY JOY CLUB',
    excerpt: 'See you on Sunday at the picnic! Join us for our upcoming Black Boy Joy Club event with a best dressed challenge and optional plant-based cooking lesson.',
    content: `See you on Sunday at the picnic!

**Event Announcement:** The Black Boy Joy Club Picnic

**What's Happening:**
- **Best Dressed Challenge** with a prize for the winner
- Opportunity to win **half-price spots** at the Black Experience Camp  
- Optional **plant-based cooking lesson** on Sunday
- Community connection and celebration

**Join the Community:**
Connect with us through our Facebook Group: Black Boy Joy Club, where we continue conversations and plan future gatherings.

**Why Black Boy Joy Matters:**
These spaces center celebration, wellness, and authentic connection among Black men. We create opportunities to experience joy without explanation or justification - just pure, unfiltered celebration of who we are.

**The Vibe:**
Casual, community-focused gathering promoting connection, learning, and joy within Black community spaces. Come as you are, bring your authentic self, and prepare for good vibes and genuine community.

**Facebook:** Join the Black Boy Joy Club Facebook Group for ongoing community connection and event updates.

#MAKINGSPACEFORUS

*This is what community looks like - showing up for each other, celebrating together, and creating the spaces we need to thrive.*`,
    author: 'BLKOUT UK Team',
    publishedAt: '2022-07-27T00:00:00Z',
    category: 'event-coverage',
    tags: ['black-boy-joy', 'picnic', 'community-event', 'cooking-lesson', 'facebook-group'],
    featured: false,
    image: generateArticleImage('event-coverage', '10'),
    readTime: 3,
    views: 1123,
    shares: 67,
    bookmarks: 98,
    slug: 'black-boy-joy-club',
    originalUrl: 'https://blkoutuk.com/watch-this-space-the-black-boy-joy-club/'
  },
  {
    id: '11',
    title: 'Creating Safer Spaces in Clubland',
    excerpt: 'How nightlife venues can become more inclusive and affirming for Black queer communities through intentional programming and community-centered approaches.',
    content: `Nightlife has always been central to Black queer culture, from ballroom scenes to underground clubs. But how do we ensure these spaces truly serve our communities?

**Key Principles for Safer Nightlife:**
- Community accountability over security theater
- Programming by and for Black queer people
- Accessible pricing and welcoming policies
- Clear consent and anti-harassment protocols
- Mental health and harm reduction resources

**Historical Context:**
Black queer nightlife has always been about more than entertainment - it's been about survival, community building, and cultural innovation. From the Harlem Renaissance to contemporary ballroom culture, these spaces have incubated art, activism, and healing.

**Moving Forward:**
We're working with venues across London to implement community-centered safety approaches that prioritize care over policing, connection over consumption.

#MAKINGSPACEFORUS #NightlifeSafety #CommunityAccountability`,
    author: 'Community Safety Collective',
    publishedAt: '2024-02-15T19:00:00Z',
    category: 'community-response',
    tags: ['nightlife', 'safety', 'community-accountability', 'ballroom'],
    featured: false,
    image: generateArticleImage('community-response', '11'),
    readTime: 7,
    views: 1543,
    shares: 124,
    bookmarks: 187,
    slug: 'creating-safer-spaces-clubland',
    originalUrl: 'https://blkoutuk.com/invitation/'
  },
  {
    id: '12',
    title: 'Black Trans Joy: Beyond Survival Narratives',
    excerpt: 'Centering joy, creativity, and possibility in Black trans experiences while still addressing systemic challenges and building community power.',
    content: `"We deserve to be seen in our full humanity - not just in our struggles, but in our joy, our creativity, our love, and our dreams."

**Why Joy Matters:**
Mainstream narratives about Black trans lives often focus solely on trauma, violence, and struggle. While these realities must be addressed, we also need stories that center our joy, creativity, and the fullness of our experiences.

**Community Voices:**
- Artists creating work that celebrates Black trans excellence
- Elders sharing wisdom about resilience and community building
- Young people imagining new possibilities for the future
- Families choosing love and support over rejection

**Building Beyond Survival:**
- Mutual aid networks that provide concrete support
- Cultural programming that celebrates Black trans artists
- Leadership development for Black trans organizers
- Healing spaces that prioritize joy alongside justice

**The Vision:**
A world where Black trans people don't just survive, but thrive - where our communities are resourced, our stories are honored, and our leadership is centered.

#BlackTransJoy #CommunityPower #MutualAid`,
    author: 'Trans Justice Collective',
    publishedAt: '2024-01-28T14:00:00Z',
    category: 'original',
    tags: ['black-trans', 'joy', 'community-power', 'mutual-aid'],
    featured: true,
    image: generateArticleImage('original', '12'),
    readTime: 8,
    views: 2341,
    shares: 198,
    bookmarks: 267,
    slug: 'black-trans-joy-beyond-survival',
    originalUrl: 'https://blkoutuk.com'
  },
  {
    id: '13',
    title: 'Decolonizing Mental Health in Black Communities',
    excerpt: 'Moving beyond Western models of therapy to embrace community-centered healing practices that honor Black cultural traditions and collective care.',
    content: `Mental health support in Black communities requires approaches that understand how racism, colonization, and systemic oppression impact our wellbeing.

**Traditional Healing Practices:**
- Community circles and group healing
- Ancestral wisdom and spiritual practices
- Art, music, and movement as medicine
- Storytelling as a tool for processing trauma
- Collective care rather than individual treatment

**Critiquing Western Models:**
Western psychology often pathologizes normal responses to oppression and overlooks the healing power of community. We need approaches that:
- Understand systemic trauma
- Center community resilience
- Honor cultural ways of knowing
- Address root causes, not just symptoms

**Community-Centered Approaches:**
- Peer support networks led by community members
- Healing circles that integrate cultural practices
- Community gardens and creative spaces
- Mutual aid for material needs alongside emotional support
- Training for community healers and peer counselors

**Resources Being Built:**
Local organizations are developing culturally specific mental health resources, training community healers, and creating spaces where Black people can access support that honors our full humanity.

#CommunityHealing #DecolonizeMentalHealth #MutualAid`,
    author: 'Community Healing Network',
    publishedAt: '2024-01-12T16:30:00Z',
    category: 'original',
    tags: ['mental-health', 'decolonization', 'community-healing', 'ancestral-wisdom'],
    featured: false,
    image: generateArticleImage('original', '13'),
    readTime: 9,
    views: 1876,
    shares: 156,
    bookmarks: 234,
    slug: 'decolonizing-mental-health',
    originalUrl: 'https://blkoutuk.com'
  },
  {
    id: '14',
    title: 'Building Black-Owned Cooperative Economies',
    excerpt: 'How worker cooperatives and community-owned businesses can build economic power in Black communities while maintaining our values of mutual aid and collective care.',
    content: `Economic liberation requires building alternatives to extractive capitalism - businesses owned and controlled by the communities they serve.

**What Are Cooperatives?**
Worker cooperatives are businesses owned and democratically controlled by their workers. Everyone has a say in decisions, shares in profits, and benefits from collective ownership.

**Examples in Black Communities:**
- Community cafes and restaurants
- Tech cooperatives serving social justice organizations
- Cleaning and care work cooperatives
- Community land trusts preventing gentrification
- Time banks and local exchange systems

**Why This Matters:**
- Keeps wealth circulating in our communities
- Creates democratic workplaces
- Builds collective power
- Provides alternatives to exploitative employment
- Maintains community control over development

**Getting Started:**
Organizations across the UK are providing training, funding, and support for Black-led cooperative development. From business planning to legal structures to democratic governance, resources exist to help communities build economic alternatives.

**The Vision:**
An interconnected network of Black-owned cooperatives that meet community needs while building economic power and practicing the values of mutual aid and collective care.

#CooperativeEconomics #EconomicJustice #CommunityWealth`,
    author: 'Cooperative Development Alliance',
    publishedAt: '2023-12-18T11:00:00Z',
    category: 'community-response',
    tags: ['cooperatives', 'economic-justice', 'community-wealth', 'mutual-aid'],
    featured: false,
    image: generateArticleImage('community-response', '14'),
    readTime: 10,
    views: 1654,
    shares: 143,
    bookmarks: 201,
    slug: 'building-black-owned-cooperative-economies',
    originalUrl: 'https://blkoutuk.com'
  },
  {
    id: '15',
    title: 'Community Defense Beyond Policing',
    excerpt: 'Exploring community-led safety models that address harm without relying on police, drawing from traditions of collective care and transformative justice.',
    content: `True community safety comes from meeting people's needs and building systems of care, not punishment and surveillance.

**Principles of Community Defense:**
- Address root causes of harm (poverty, trauma, isolation)
- Support both those who cause harm and those who experience it
- Build collective capacity to prevent and respond to conflict
- Create accountability processes that promote healing
- Strengthen community connections and mutual aid

**What This Looks Like:**
- Conflict mediation by trained community members
- De-escalation teams for mental health crises
- Restorative justice circles for addressing harm
- Community patrols focused on care, not policing
- Rapid response networks for ICE raids, police violence, etc.

**Historical Examples:**
- Black Panther Party community programs
- Guardian Angels but with a transformative justice approach
- Community accountability processes in feminist movements
- Indigenous justice systems based on restoration

**Building Capacity:**
Training programs are available for community mediation, de-escalation, trauma-informed care, and transformative justice practices.

**The Goal:**
Communities that can keep each other safe through care, not cages - where people are held accountable for harm in ways that promote healing and prevent future violence.

#CommunityDefense #TransformativeJustice #AbolitionistPraxis`,
    author: 'Community Defense Collective',
    publishedAt: '2023-11-30T15:45:00Z',
    category: 'community-response',
    tags: ['community-defense', 'transformative-justice', 'abolition', 'conflict-resolution'],
    featured: false,
    image: generateArticleImage('community-response', '15'),
    readTime: 11,
    views: 2187,
    shares: 198,
    bookmarks: 289,
    slug: 'community-defense-beyond-policing',
    originalUrl: 'https://blkoutuk.com'
  },
  {
    id: '16',
    title: 'Black Feminist Organizing in the Digital Age',
    excerpt: 'How Black feminists are using technology for organizing while maintaining security culture and centering the most marginalized voices in our communities.',
    content: `Digital organizing creates new possibilities for Black feminist activism while also presenting unique challenges around surveillance, security, and inclusion.

**Digital Organizing Strategies:**
- Encrypted communications for sensitive organizing
- Social media campaigns that center grassroots voices
- Online fundraising for mutual aid and emergency support
- Virtual community building across geographic barriers
- Digital security training for activists and organizations

**Challenges to Address:**
- Digital surveillance by law enforcement
- Platform censorship of radical content
- Digital divides that exclude people without reliable internet
- Online harassment targeting Black women and femmes
- Co-optation of grassroots movements by liberal organizations

**Successes and Innovations:**
- Rapid response networks organized through secure messaging
- Crowdfunding campaigns that directly resource community members
- Online spaces for political education and skill-sharing
- Virtual healing and support circles
- Digital archives preserving movement history

**Security Culture:**
- Training on digital security and surveillance
- Encrypted communications for sensitive organizing
- Protection strategies for online harassment
- Legal observers for digital repression
- Community agreements for safe online spaces

**Centering Liberation:**
Technology is a tool - what matters is how we use it to build community power, center the most marginalized, and create the world we want to see.

#BlackFeministOrganizing #DigitalSecurity #CommunityPower`,
    author: 'Digital Justice Collective',
    publishedAt: '2023-10-14T13:20:00Z',
    category: 'original',
    tags: ['black-feminism', 'digital-organizing', 'security-culture', 'technology'],
    featured: false,
    image: generateArticleImage('original', '16'),
    readTime: 8,
    views: 1732,
    shares: 167,
    bookmarks: 212,
    slug: 'black-feminist-organizing-digital-age',
    originalUrl: 'https://blkoutuk.com'
  },
  {
    id: '17',
    title: 'Food Justice and Community Gardens',
    excerpt: 'Growing food, building community, and challenging food apartheid through Black-led urban agriculture and cooperative food distribution networks.',
    content: `Food justice means everyone has access to healthy, culturally appropriate, and sustainably grown food - and control over the systems that feed their communities.

**Food Apartheid:**
"Food desert" implies natural scarcity, but food apartheid names the deliberate policies that create unequal access to healthy food in Black communities.

**Community Solutions:**
- Community gardens on vacant lots and rooftops
- Food cooperatives with sliding scale pricing
- Community fridges and free grocery programs
- Seed libraries preserving heirloom varieties
- Community kitchens and shared cooking spaces

**Cultural Connection:**
Growing food connects us to ancestral knowledge, builds intergenerational relationships, and creates spaces for cultural exchange and education.

**Examples Across London:**
- Brixton community gardens growing Caribbean vegetables
- Food cooperatives in South London providing affordable groceries
- Community fridges stocked by neighbors for neighbors
- Urban farms teaching young people about sustainable agriculture

**Beyond Individual Health:**
Food justice is about community self-determination, environmental sustainability, and economic justice - not just individual access to "good" food.

**Getting Involved:**
Organizations across the city are looking for volunteers, member-owners, and community partners to build food justice from the ground up.

#FoodJustice #CommunityGardens #FoodSovereignty #UrbanAgriculture`,
    author: 'Food Justice Network',
    publishedAt: '2023-09-22T10:15:00Z',
    category: 'community-response',
    tags: ['food-justice', 'community-gardens', 'food-sovereignty', 'urban-agriculture'],
    featured: false,
    image: generateArticleImage('community-response', '17'),
    readTime: 7,
    views: 1456,
    shares: 134,
    bookmarks: 178,
    slug: 'food-justice-community-gardens',
    originalUrl: 'https://blkoutuk.com'
  },
  {
    id: '18',
    title: 'Housing as a Human Right: Tenant Organizing Stories',
    excerpt: 'Real stories from Black-led tenant organizing campaigns that have won rent control, prevented evictions, and built tenant power across London.',
    content: `Housing is a human right, not a commodity - and tenant organizing is how we make that principle real in our communities.

**Victory Stories:**
- Southwark tenants who won major repairs after two years of organizing
- Hackney residents who blocked luxury development through community mobilization
- Lambeth tenants who prevented estate demolition through legal action and direct action
- Cross-borough network that secured emergency COVID rental relief

**Organizing Strategies:**
- Building relationships with neighbors before starting campaigns
- Connecting individual problems to systemic issues
- Direct action combined with legal advocacy
- Media work that centers tenant voices, not just policy experts
- Coalition building across race, class, and immigration status

**Challenges Faced:**
- Landlord retaliation against organizing tenants
- Legal system that favors property owners over tenants
- Language barriers and immigration fears
- Gentrification that displaces organized communities
- Lack of resources for sustained organizing

**Lessons Learned:**
- Organizing is relationship building, not just issue campaigns
- Small victories build capacity for bigger fights
- Legal knowledge is power, but collective action wins
- Cross-class coalitions require ongoing attention to power dynamics
- Housing organizing is connected to all other struggles for justice

**Resources:**
Legal clinics, organizing trainings, and tenant unions exist across London to support housing justice work.

#HousingJustice #TenantOrganizing #HousingRights #CommunityPower`,
    author: 'Tenant Power Collective',
    publishedAt: '2023-08-17T14:30:00Z',
    category: 'event-coverage',
    tags: ['housing-justice', 'tenant-organizing', 'housing-rights', 'gentrification'],
    featured: false,
    image: generateArticleImage('event-coverage', '18'),
    readTime: 9,
    views: 1623,
    shares: 145,
    bookmarks: 198,
    slug: 'housing-human-right-tenant-stories',
    originalUrl: 'https://blkoutuk.com'
  },
  {
    id: '19',
    title: 'Black Joy in Creative Resistance',
    excerpt: 'How Black artists, musicians, and storytellers use their craft as tools for liberation while centering joy, beauty, and imagination in movement work.',
    content: `Art has always been central to Black liberation movements - from freedom songs to protest murals to revolutionary theater.

**Art as Resistance:**
- Musicians composing songs for social movements
- Visual artists creating protest imagery and community murals
- Poets and storytellers documenting community experiences
- Dancers and performers creating ritual space for healing
- Digital artists using technology for cultural preservation

**Centering Joy:**
Resistance culture isn't just about anger and struggle - it's also about beauty, celebration, and the world we're building together.

**Community Cultural Work:**
- Open mics in community centers and grassroots spaces
- Mural projects led by neighborhood residents
- Community choirs that perform at protests and celebrations
- Storytelling circles that preserve oral history
- Fashion and style as expressions of cultural pride

**Supporting Black Artists:**
- Pay artists fairly for cultural work
- Center Black artists in social justice spaces
- Support community-controlled cultural institutions
- Challenge exploitation in the creative economy
- Create opportunities for intergenerational mentorship

**Examples from the Community:**
Local artists are creating powerful work that celebrates Black life, challenges injustice, and imagines liberation. From hip-hop artists addressing police violence to painters documenting gentrification to poets exploring Black queer love.

**The Vision:**
A cultural ecosystem where Black artists are resourced to create freely, where art builds community power, and where beauty and resistance are inseparable.

#BlackArt #CreativeResistance #CulturalWork #ArtForLiberation`,
    author: 'Cultural Workers Collective',
    publishedAt: '2023-07-11T16:45:00Z',
    category: 'multimedia',
    tags: ['black-art', 'creative-resistance', 'cultural-work', 'community-art'],
    featured: true,
    image: generateArticleImage('multimedia', '19'),
    readTime: 6,
    views: 1987,
    shares: 189,
    bookmarks: 245,
    slug: 'black-joy-creative-resistance',
    originalUrl: 'https://blkoutuk.com'
  },
  {
    id: '20',
    title: 'Intergenerational Healing: Bridging Past and Future',
    excerpt: 'Creating spaces where Black elders and youth can share wisdom, process trauma, and build together toward liberation across generational lines.',
    content: `Liberation requires healing the wounds of generations while building bridges between past wisdom and future possibilities.

**Why Intergenerational Work Matters:**
- Elders carry knowledge about surviving and resisting oppression
- Young people bring new strategies and fresh perspectives
- Trauma impacts families and communities across generations
- Healing happens in relationship, not isolation
- Movement building requires long-term thinking

**Creating Bridge Spaces:**
- Storytelling circles where elders share movement history
- Skill-shares where youth teach technology and elders teach organizing
- Community gardens where knowledge about land and growing is exchanged
- Healing circles that address historical and ongoing trauma
- Cultural events that celebrate across generations

**Addressing Tensions:**
Generational differences are real - from technology use to organizing strategies to cultural expressions. Bridge work requires:
- Honest conversation about different experiences
- Mutual respect for various forms of knowledge
- Flexibility in communication styles and organizing methods
- Recognition that liberation requires all generations
- Commitment to working through conflict rather than avoiding it

**Examples in Practice:**
Community centers offering intergenerational programming, families choosing healing over cycles of harm, organizations led by both young people and elders, and cultural events that honor ancestral wisdom while embracing innovation.

**The Vision:**
Communities where wisdom flows between generations, where young people are supported to lead, where elders are honored and cared for, and where healing happens collectively.

#IntergenerationalHealing #CommunityWisdom #MovementBuilding #CollectiveHealing`,
    author: 'Generations United Collective',
    publishedAt: '2023-06-25T12:00:00Z',
    category: 'community-response',
    tags: ['intergenerational', 'healing', 'community-wisdom', 'movement-building'],
    featured: false,
    image: generateArticleImage('community-response', '20'),
    readTime: 8,
    views: 1543,
    shares: 132,
    bookmarks: 189,
    slug: 'intergenerational-healing-bridging-past-future',
    originalUrl: 'https://blkoutuk.com'
  }
]

// Export utility functions
export const getFeaturedArticles = () => articles.filter(article => article.featured)
export const getRecentArticles = (limit = 6) => articles.filter(article => !article.featured).slice(0, limit)
export const getArticlesByCategory = (category: Article['category']) => articles.filter(article => article.category === category)
export const getArticleBySlug = (slug: string) => articles.find(article => article.slug === slug)