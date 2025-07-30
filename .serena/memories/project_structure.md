# Project Structure

## Root Directory Layout
```
├── src/                    # Main source code
├── app/                    # Next.js App Router (legacy/mixed setup)
├── public/                 # Static assets
├── dist/                   # Build output (generated)
├── .github/                # GitHub workflows
├── .vscode/                # VS Code settings
└── docs/                   # Documentation files
```

## Source Code Organization (`src/`)
```
src/
├── app/                    # App Router pages (mixed with Vite)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── blkout/           # Custom BLKOUT components
│   ├── community/        # Community-specific components  
│   ├── magazine/         # Newsroom/article components
│   └── movement/         # Movement-related components
├── lib/
│   ├── constants.ts      # Site config and values
│   └── mediaAssets.ts    # Media asset management
├── hooks/                # Custom React hooks
├── main.tsx             # Vite entry point
├── index.css            # Main stylesheet
└── App.tsx              # Main app component
```

## Key Components
- **FullPageScrollytelling.tsx** - Main interactive experience
- **CommunityGateway.tsx** - BLKOUTHUB integration
- **MagazineLayout.tsx** - Newsroom display
- **ProjectHub.tsx** - Project showcase
- **IvorChatbot.tsx** - AI integration

## Assets Organization
```
public/images/
├── squared/              # 1:1 aspect ratio for social media
└── blkoutuk.com v3/     # Legacy assets
```

## Configuration Files
- **tsconfig.json** - TypeScript config with path aliases
- **tailwind.config.js** - Custom brand colors and animations
- **vite.config.ts** - Build configuration
- **package.json** - Dependencies and scripts