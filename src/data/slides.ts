// Slide data separated from component logic
export interface Slide {
  id: string;
  type: 'hero' | 'hero-video' | 'image' | 'video' | 'text' | 'quiz' | 'lesson' | 'pathway' | 'cta' | 'reveal';
  title?: string;
  subtitle?: string;
  content?: string;
  bgImage?: string;
  bgColor?: string;
  videoUrl?: string;
  size?: 'small' | 'medium' | 'large' | 'hero';
  quote?: string;
  author?: string;
  question?: string;
  options?: string[] | { text: string; pathway: string }[];
  result?: { title: string; message: string };
  ctaText?: string;
  ctaUrl?: string;
  pathwayResults?: Record<string, {
    title: string;
    subtitle: string;
    description: string;
    opportunities: string[];
  }>;
}

export const slides: Slide[] = [
  // Hero Section
  {
    id: 'hero',
    type: 'hero',
    title: 'BLKOUT',
    subtitle: 'WHERE BLACK QUEER MEN BUILD COLLECTIVE POWER',
    bgImage: '/images/squared/INTRODUCING.png',
    bgColor: '#000000',
    size: 'hero'
  },

  // Welcome Video - HERO SECTION BREAK
  {
    id: 'welcome',
    type: 'hero-video',
    title: 'WELCOME TO THE MOVEMENT',
    subtitle: 'JOIN US',
    videoUrl: '/images/squared/FinalfinalwelcomeSQUARED.mp4',
    bgColor: '#000000'
  },

  // Identity Cards - Masonry Grid
  {
    id: 'black',
    type: 'reveal',
    title: 'BLACK?',
    subtitle: 'MORE THAN MELANIN',
    bgImage: '/images/squared/BlackSQUARED.png',
    bgColor: '#000000',
    size: 'medium'
  },
  {
    id: 'queer',
    type: 'reveal',
    title: 'QUEER',
    subtitle: 'RECLAIMED TERRITORY',
    bgImage: '/images/squared/queerSQUARED.PNG',
    bgColor: '#000000',
    size: 'medium'
  },
  {
    id: 'male',
    type: 'reveal',
    title: 'MALE*',
    subtitle: '*TERMS AND CONDITIONS APPLY',
    bgImage: '/images/squared/menSQUARED.png',
    bgColor: '#000000',
    size: 'small'
  },
  {
    id: 'out',
    type: 'reveal',
    title: 'OUT',
    subtitle: 'VISIBILITY ≠ LIBERATION',
    bgImage: '/images/squared/outSQUARED.png',
    bgColor: '#000000',
    size: 'small'
  },

  // Value Proposition
  {
    id: 'value-proposition',
    type: 'text',
    title: 'UNITY NOT UNIFORMITY',
    subtitle: 'Our identities are complex and contested',
    content: '@BLKOUT this realness is a resource for building our community',
    bgColor: '#4c1d95',
    size: 'large'
  },

  // Liberation Section
  {
    id: 'liberation-image',
    type: 'reveal',
    title: 'LIBERATION DIALOGUE',
    subtitle: 'DISRUPTION, DIFFERENCE, MEANING-MAKING',
    bgImage: '/images/squared/liberationSQUARED.png',
    bgColor: '#000000',
    size: 'medium'
  },

  // Quiz Card
  {
    id: 'fake-quiz',
    type: 'quiz',
    title: 'BEFORE WE CONTINUE...',
    subtitle: 'A QUICK QUESTION',
    content: 'We want to know if you belong here. Are you ready?',
    bgColor: '#7c2d12',
    question: "What's your favorite weather?",
    options: ["Sunny", "Stormy", "Rainy", "Don't notice"],
    result: {
      title: "CONGRATULATIONS! You passed!",
      message: "Plot twist: There was never a test. Identity is liberation, not prison. Difference creates dialogue, not division. Black queer men belong here."
    },
    size: 'medium'
  },

  // Lessons - Liberation Wisdom
  {
    id: 'lesson-healing',
    type: 'lesson',
    title: 'HEALING AS INNOVATION',
    subtitle: 'TURNING WOUNDS INTO WISDOM',
    quote: 'The trauma is not your fault, the healing is your responsibility.',
    author: 'Erwin McManus',
    content: 'We understand that you\'ve carried burdens that weren\'t yours to bear. Our innovation lies in creating new pathways to healing—not just individual therapy, but collective care systems.',
    bgColor: '#dc2626',
    size: 'medium'
  },
  {
    id: 'lesson-tools',
    type: 'lesson',
    title: 'BUILDING NEW TOOLS',
    subtitle: 'BEYOND THE MASTER\'S BLUEPRINT',
    quote: 'The master\'s tools will never dismantle the master\'s house.',
    author: 'Audre Lorde',
    content: 'We know you\'ve tried to succeed within systems that were never designed for your liberation. Our innovation is creating entirely new frameworks—cooperative ownership, community-led decision making.',
    bgColor: '#ea580c',
    size: 'medium'
  },
  {
    id: 'lesson-connection',
    type: 'lesson',
    title: 'AUTHENTIC CONNECTION',
    subtitle: 'LOVE BEHIND THE MASKS',
    quote: 'Love removes the masks that we fear we cannot live without and know we cannot live within.',
    author: 'James Baldwin',
    content: 'We recognize how exhausting it is to perform versions of yourself for survival. Our innovation is creating spaces where your full humanity is not just welcomed but necessary.',
    bgColor: '#ca8a04',
    size: 'small'
  },
  {
    id: 'lesson-collective',
    type: 'lesson',
    title: 'COLLECTIVE LIBERATION',
    subtitle: 'NONE OF US ARE FREE UNTIL ALL OF US ARE FREE',
    quote: 'Your liberation is bound up with mine.',
    author: 'Fannie Lou Hamer',
    content: 'Individual success within oppressive systems is not liberation. True freedom requires collective action and community power.',
    bgColor: '#16a34a',
    size: 'small'
  },

  // Vision Section
  {
    id: 'future-visioning',
    type: 'reveal',
    title: 'IMAGINE',
    subtitle: 'WHAT WE COULD BUILD TOGETHER',
    bgImage: '/images/squared/sunrise SQUARED.png',
    bgColor: '#000000',
    size: 'large'
  },

  // Revelation Cards
  {
    id: 'own-stories',
    type: 'reveal',
    title: 'WHAT IF OUR STORIES CREATED LIBERATION DIALOGUES?',
    subtitle: 'BRAVER SPACES. BOLDER STORYTELLING.',
    bgImage: '/images/squared/seat with baldwin SQUARED.png',
    bgColor: '#000000',
    size: 'medium'
  },
  {
    id: 'build-wealth',
    type: 'reveal',
    title: 'WHAT IF WE BUILT WEALTH TOGETHER?',
    subtitle: 'LIBERATION PLUS FINANCIAL INDEPENDENCE',
    bgImage: '/images/squared/capacitySQUARED.png',
    bgColor: '#000000',
    size: 'medium'
  },

  // Story Video - HERO SECTION BREAK
  {
    id: 'story-powered-video',
    type: 'hero-video',
    title: 'STORY POWERED',
    subtitle: 'OUR NARRATIVES SHAPE OUR FUTURES',
    videoUrl: '/images/squared/story powered SQUARED).mp4',
    bgColor: '#000000'
  },

  // Projects
  {
    id: 'project-intro',
    type: 'reveal',
    title: 'OUR PROJECTS',
    subtitle: 'BUILDING LIBERATION TOGETHER',
    bgImage: '/images/squared/projects SQUAREDpng.png',
    bgColor: '#000000',
    size: 'large'
  },

  // Pathway Discovery
  {
    id: 'pathway-discovery',
    type: 'pathway',
    title: 'DISCOVER YOUR LIBERATION PATHWAY',
    subtitle: 'THERE ARE MANY DIFFERENT ROLES TO PLAY',
    content: 'What part of our work do you find most interesting?',
    bgColor: '#ea580c',
    question: "What part of our work do you find most interesting?",
    options: [
      { text: "Direct mutual aid and support", pathway: "community-healer" },
      { text: "Creative expression and storytelling", pathway: "creative-catalyst" },
      { text: "Technology and digital liberation", pathway: "tech-liberator" },
      { text: "Policy and systemic change", pathway: "systems-transformer" }
    ],
    pathwayResults: {
      "community-healer": {
        title: "COMMUNITY HEALER",
        subtitle: "The medicine our people need",
        description: "You're drawn to the deep work of healing - both individual and collective.",
        opportunities: [
          "Become a member of the BLKOUT cooperative",
          "Join our waiting list for the next recruitment round",
          "Your skills in community care are exactly what we need"
        ]
      },
      "creative-catalyst": {
        title: "CREATIVE CATALYST",
        subtitle: "Storytelling as liberation practice",
        description: "You understand that representation matters, but authentic representation controlled by us matters more.",
        opportunities: [
          "Become a member of the BLKOUT cooperative",
          "Join our creative content team",
          "Help shape our storytelling future"
        ]
      },
      "tech-liberator": {
        title: "TECH LIBERATOR",
        subtitle: "Code as cooperative power",
        description: "You see technology as a tool for collective liberation, not individual accumulation.",
        opportunities: [
          "Become a member of the BLKOUT cooperative",
          "Join our digital infrastructure team",
          "Help build liberation technology"
        ]
      },
      "systems-transformer": {
        title: "SYSTEMS TRANSFORMER",
        subtitle: "Policy as collective power building",
        description: "You're committed to changing the rules of the game, not just playing it better.",
        opportunities: [
          "Become a member of the BLKOUT cooperative",
          "Join our policy advocacy work",
          "Help transform systems for our community"
        ]
      }
    },
    size: 'large'
  },

  // Photo Collage Video - HERO SECTION BREAK
  {
    id: 'photo-collage',
    type: 'hero-video',
    title: 'OUR COMMUNITY',
    subtitle: 'FACES OF LIBERATION',
    videoUrl: '/images/squared/photo collage Video.mp4',
    bgColor: '#000000'
  },

  // Infographic
  {
    id: 'realness-unleashed-infographic',
    type: 'image',
    bgImage: '/images/squared/REALNESS UNLEASHED Infographic Graph .png',
    bgColor: '#000000',
    size: 'large'
  },

  // CTAs
  {
    id: 'blkouthub-cta',
    type: 'cta',
    title: 'READY TO JOIN?',
    subtitle: 'YOUR LIBERATION JOURNEY STARTS HERE',
    content: 'Access the full BLKOUT platform with community tools, AI assistance, and cooperative features.',
    bgImage: '/images/squared/facecard SQUARED.png',
    bgColor: '#000000',
    ctaText: 'Join BLKOUTHUB',
    ctaUrl: 'https://blkoutuk.com',
    size: 'large'
  },
  {
    id: 'newsletter-cta',
    type: 'cta',
    title: 'STAY CONNECTED',
    subtitle: 'JOIN OUR NEWSLETTER',
    content: 'Stay connected with our latest projects, events, and community stories.',
    bgColor: '#1e3a8a',
    ctaText: 'JOIN NEWSLETTER',
    ctaUrl: 'https://blkoutuk.com/newsletter',
    size: 'medium'
  },
  {
    id: 'explore-platform-cta',
    type: 'cta',
    title: 'EXPLORE THE PLATFORM',
    subtitle: 'DISCOVER MORE',
    content: 'Browse our full range of projects, resources, and ways to get involved.',
    bgColor: '#4c1d95',
    ctaText: 'EXPLORE PLATFORM',
    ctaUrl: 'https://blkoutuk.com',
    size: 'medium'
  }
];
