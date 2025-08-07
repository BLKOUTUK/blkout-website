import { Article } from '../data/articles'

// Enhanced image generation system for articles using Black queer culture imagery
export class ArticleImageGenerator {
  // Category-specific image themes mapped to color directories
  private static categoryThemes = {
    'original': {
      colors: ['8B5CF6', '6366F1', '7C3AED'], // Purples
      imageDirectory: 'blue images', // Blue theme for original content
      fallbackSquared: 'WELLDEF_SQUARED.png'
    },
    'curated': {
      colors: ['EC4899', 'F472B6', 'E879F9'], // Pinks  
      imageDirectory: 'red images', // Red theme for curated content
      fallbackSquared: 'BlackSQUARED.png'
    },
    'event-coverage': {
      colors: ['F97316', 'FB923C', 'FDBA74'], // Oranges
      imageDirectory: 'gold images', // Gold theme for events
      fallbackSquared: 'capacitySQUARED.png'
    },
    'community-response': {
      colors: ['10B981', '34D399', '6EE7B7'], // Greens
      imageDirectory: 'green images', // Green theme for community response
      fallbackSquared: 'liberationSQUARED.png'
    },
    'multimedia': {
      colors: ['3B82F6', '60A5FA', '93C5FD'], // Blues
      imageDirectory: 'blue images', // Blue theme for multimedia
      fallbackSquared: 'projects SQUAREDpng.png'
    }
  }

  // Available images in each color directory
  private static colorDirectoryImages = {
    'blue images': [
      'tumblr_16174aad10948dae01218ba8e82dd990_1ec97cae_1280.jpg',
      'tumblr_1ede46e1d698d7cda3e61da1685ba040_7d1960ac_2048.jpg',
      'tumblr_3729cdb3d6dc7900759b799dd088fbc5_7fd8fb01_1280.jpg',
      'tumblr_384f4870a87f4722ccfc66e8bb2fa98d_e8839690_1280.jpg',
      'tumblr_477d8815af713c7d7c0d7cb5330ffba4_c0e7416b_1280.jpg',
      'tumblr_6f66259d5fb67eabf60ecd14a13aeb13_37199e34_1280.jpg',
      'tumblr_9fa487782acece6dac4f7a63331a595e_fbc0ad80_500.jpg',
      'tumblr_aacba5b73ac23582ccfcc9cc0441d64c_09b594a4_1280.jpg',
      'tumblr_b114bd87c0f55507de0beea8aa46be35_bef403a5_1280.jpg',
      'tumblr_c4b87242dc665c89e6ed09adae41d3d7_8230c31b_1280.jpg',
      'tumblr_daca3474a5f41fc54993b6343899cda6_4fc16b28_1280.jpg',
      'tumblr_e7a08505ff561abf83b9762215747aaf_5e39e0a4_1280.jpg',
      'tumblr_f1f8583aa35a4339bf207d5a87f9c1a1_7f34a11e_1280.jpg',
      'tumblr_f3b9349bda9b8c5f1d520d422c958c9d_4ee9f5e6_500.jpg',
      'tumblr_n7qct86vki1t95vhoo1_1280.jpg',
      'tumblr_pmqtxchf3J1wgxbx5o1_1280.jpg'
    ],
    'gold images': [
      'tumblr_0426429a4a43a64e644ffaea906af64f_965dcf96_1280.jpg',
      'tumblr_13e9c17df1839c98ff6ac1e1d597d85e_450a48de_1280.jpg',
      'tumblr_1a0f924dc738fc40cef878489094f2d4_8441c000_1280.jpg',
      'tumblr_507f78ed4f468b39eb59213930c132fc_32b79a76_1280.jpg',
      'tumblr_70e91327c90933d2588f9d5013f07ce4_5b0fd38b_1280.jpg',
      'tumblr_7e6887b956c6405b86f637208aba13f1_7bed5be8_1280.jpg',
      'tumblr_9255018bcd4d6be44ba494bf0ed65781_512dc9e2_2048.webp',
      'tumblr_be4b7f8729cf3f77cc0f239b12c3f66f_54d08de7_1280.jpg',
      'tumblr_c5bc29aefae20f1a7926f765f06b9b4e_bec564dd_1280.jpg',
      'tumblr_d29c739e14d0b2f0be8f163a1ff0c349_706ecf71_1280.jpg',
      'tumblr_d3bbf823fc5703c6dfa84f7e58c54569_a6bb830a_1280.jpg',
      'tumblr_d5c0bcfba40bcdc532148a2beb98a2de_76204f5e_1280.jpg',
      'tumblr_dbfad0b11e2301010b49f08515af7c0c_6915b78d_1280.jpg',
      'tumblr_dd531bd33e29b0469b89dabc1a9e7750_6c6e9bfa_1280.jpg'
    ],
    'green images': [
      'tumblr_15efa24c41cb085ad7c50b172a339851_270d4a24_1280.jpg',
      'tumblr_23d169b75b247ba45ea28f5638c1d3d1_62e0d5de_640.jpg',
      'tumblr_4ccb3ff837292f82d8ab03ba554e8786_0684d01c_1280.jpg',
      'tumblr_4cef6df755e59e1d12b94b3978420bbe_d8acaffb_640.jpg',
      'tumblr_4e0ae3da6260b5f2a88db95e97fc3524_98337141_1280.jpg',
      'tumblr_5b1b6534f4a738ceb37e212fb4433518_cf767bfe_1280.jpg',
      'tumblr_983736a1752001f619860618c9abf112_3b218ac8_1280.jpg',
      'tumblr_a381369d8c77ef863ca7a3b67dfc5762_6c733810_640.jpg',
      'tumblr_e6f9ad80065c9c61cca5df664180fb25_ba70d864_1280.jpg',
      'tumblr_mgul4bDFVJ1rvpnt3o1_1280.jpg',
      'tumblr_my89rh3U3n1qe2f6oo1_540.jpg',
      'tumblr_peenj5nC041qiq1o7o1_1280.jpg',
      'tumblr_pl4vk8Q6Qy1uwusnmo1_640.jpg'
    ],
    'red images': [
      'tumblr_19cdf90e403a0faab7bf83cf434dabdf_49f4609e_640.jpg',
      'tumblr_5d9a2ccc0fa2a56133c0501cacc46adf_6a189059_1280.jpg',
      'tumblr_61baa7d20ae7bdc39fce83128a90eddf_93fb7a80_1280.jpg',
      'tumblr_8702ad0f24077e755a67dfa85e3a740a_2491a610_1280.jpg',
      'tumblr_9283a51e59c87de5b9d9be6940a1d052_01e405d8_1280.jpg',
      'tumblr_b4286b022d4b18f043bc9459b3a2e753_3592d9b5_1280.jpg',
      'tumblr_ba4450bc68a5145f8a93b0e3390448de_8c6b8aa4_1280.jpg',
      'tumblr_c166cf543e34f98c2dfd131c3c1b50a1_a2ecbfa5_1280.jpg',
      'tumblr_c8cb29f11a02501b814b07c0e613dd96_93525cdb_2048.jpg',
      'tumblr_c9de0df4b6eba59354e474ca98449bd7_749bf953_1280.jpg',
      'tumblr_dd1740f17d8e9b651cad0cf5fff14c41_f6879f23_1280.jpg',
      'tumblr_e58a0ab5544b553dcb0f90ef71139747_c514565c_1280.jpg',
      'tumblr_e6759202374186fbc415ad3072254688_7e6ad58c_1280.jpg'
    ]
  }

  // Generate a gradient background for articles without specific images
  static generateGradientImage(category: Article['category'], id: string): string {
    const theme = this.categoryThemes[category]
    const colors = theme.colors
    const primaryColor = colors[0]
    const secondaryColor = colors[1] || colors[0]
    
    // Create a data URL for a CSS gradient
    const gradientSvg = `
      <svg width="800" height="500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#${primaryColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#${secondaryColor};stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-family="Arial, sans-serif" font-size="48" font-weight="bold" opacity="0.8">
          BLKOUT
        </text>
      </svg>
    `
    
    return `data:image/svg+xml;base64,${btoa(gradientSvg)}`
  }

  // Select a Black queer culture image based on category and article ID
  static selectCultureImage(category: Article['category'], id: string): string {
    const theme = this.categoryThemes[category]
    const imageDirectory = theme.imageDirectory
    const availableImages = this.colorDirectoryImages[imageDirectory as keyof typeof this.colorDirectoryImages]
    
    // Use article ID to deterministically select an image
    const imageIndex = parseInt(id.replace(/\D/g, '')) % availableImages.length
    const selectedImage = availableImages[imageIndex]
    
    return `/images/story archive colours/${imageDirectory}/${selectedImage}`
  }

  // Generate fallback squared image for thumbnails
  static generateSquaredFallback(category: Article['category']): string {
    const theme = this.categoryThemes[category]
    return `/images/squared/${theme.fallbackSquared}`
  }

  // Generate multiple image options for an article
  static generateImageOptions(article: Article): {
    primary: string
    gradient: string
    squared: string
    thumbnail: string
  } {
    return {
      primary: this.selectCultureImage(article.category, article.id),
      gradient: this.generateGradientImage(article.category, article.id),
      squared: this.generateSquaredFallback(article.category),
      thumbnail: this.selectCultureImage(article.category, article.id)
    }
  }

  // Get category color for UI elements
  static getCategoryColor(category: Article['category']): string {
    const theme = this.categoryThemes[category]
    return `#${theme.colors[0]}`
  }

  // Get category text color classes for Tailwind
  static getCategoryClasses(category: Article['category']): string {
    switch (category) {
      case 'original': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'curated': return 'bg-pink-500/20 text-pink-300 border-pink-500/30'
      case 'event-coverage': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'community-response': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'multimedia': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }
}

// Enhanced article image component props
export interface ArticleImageProps {
  article: Article
  size?: 'thumbnail' | 'medium' | 'large' | 'hero'
  className?: string
  showGradientFallback?: boolean
}

// Size mappings for different use cases
export const imageSizes = {
  thumbnail: { width: 400, height: 300 },
  medium: { width: 600, height: 400 },
  large: { width: 800, height: 500 },
  hero: { width: 1200, height: 600 }
}