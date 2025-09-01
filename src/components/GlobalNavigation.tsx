import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Newspaper, 
  Calendar, 
  Users, 
  Bot, 
  Settings, 
  Smartphone, 
  LogIn, 
  LogOut, 
  User,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Types
interface AuthUser {
  id: string;
  email: string;
  isAdmin: boolean;
  journeyStage: JourneyStage;
}

type ModuleType = 'scrollytelling' | 'platform' | 'newsroom' | 'events' | 'governance' | 'ivor' | 'admin';
type JourneyStage = 'discovery' | 'exploration' | 'participation' | 'administration' | 'mobile';

interface NavigationItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  priority?: 'high' | 'medium' | 'low';
  external?: boolean;
  adminOnly?: boolean;
}

interface GlobalNavProps {
  currentModule: ModuleType;
  user?: AuthUser | null;
  showMobileTransition?: boolean;
}

// Supabase client (will be replaced with proper env vars)
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder_key'
);

// Module navigation configuration
const MODULE_NAVIGATION: Record<ModuleType, NavigationItem[]> = {
  scrollytelling: [
    { 
      label: "Enter Platform", 
      href: "https://blkout-website.vercel.app", 
      icon: <Home className="w-4 h-4" />, 
      priority: "high",
      external: true
    },
    { 
      label: "Find Events", 
      href: "https://events-blkout.vercel.app", 
      icon: <Calendar className="w-4 h-4" />, 
      priority: "medium",
      external: true
    },
  ],
  platform: [
    { 
      label: "Newsroom", 
      href: "/newsroom", 
      icon: <Newspaper className="w-4 h-4" /> 
    },
    { 
      label: "Events", 
      href: "https://events-blkout.vercel.app", 
      icon: <Calendar className="w-4 h-4" />,
      external: true
    },
    { 
      label: "Governance", 
      href: "/governance", 
      icon: <Users className="w-4 h-4" /> 
    },
    { 
      label: "AI Assistant", 
      href: "https://ivor-frontend.vercel.app", 
      icon: <Bot className="w-4 h-4" />,
      external: true
    },
  ],
  newsroom: [
    { 
      label: "Platform", 
      href: "https://blkout-website.vercel.app", 
      icon: <Home className="w-4 h-4" />,
      external: true
    },
    { 
      label: "Events", 
      href: "https://events-blkout.vercel.app", 
      icon: <Calendar className="w-4 h-4" />,
      external: true
    },
  ],
  events: [
    { 
      label: "Platform", 
      href: "https://blkout-website.vercel.app", 
      icon: <Home className="w-4 h-4" />,
      external: true
    },
    { 
      label: "Newsroom", 
      href: "/newsroom", 
      icon: <Newspaper className="w-4 h-4" /> 
    },
  ],
  governance: [
    { 
      label: "Platform", 
      href: "https://blkout-website.vercel.app", 
      icon: <Home className="w-4 h-4" />,
      external: true
    },
    { 
      label: "Events", 
      href: "https://events-blkout.vercel.app", 
      icon: <Calendar className="w-4 h-4" />,
      external: true
    },
  ],
  ivor: [
    { 
      label: "Platform", 
      href: "https://blkout-website.vercel.app", 
      icon: <Home className="w-4 h-4" />,
      external: true
    },
    { 
      label: "Events", 
      href: "https://events-blkout.vercel.app", 
      icon: <Calendar className="w-4 h-4" />,
      external: true
    },
    { 
      label: "Admin Panel", 
      href: "/admin", 
      icon: <Settings className="w-4 h-4" />,
      adminOnly: true
    },
  ],
  admin: [
    { 
      label: "Platform", 
      href: "https://blkout-website.vercel.app", 
      icon: <Home className="w-4 h-4" />,
      external: true
    },
    { 
      label: "IVOR Assistant", 
      href: "https://ivor-frontend.vercel.app", 
      icon: <Bot className="w-4 h-4" />,
      external: true
    },
  ],
};

// User journey stage determination
const getUserJourneyStage = (user: AuthUser | null, currentModule: ModuleType): JourneyStage => {
  if (!user) return 'discovery';
  if (currentModule === 'admin') return 'administration';
  if (currentModule === 'governance' || currentModule === 'events') return 'participation';
  if (currentModule === 'platform' || currentModule === 'newsroom') return 'exploration';
  return user.journeyStage || 'discovery';
};

// Mobile app integration
const MobileAppTransition: React.FC<{ currentModule: ModuleType }> = ({ currentModule }) => {
  const transitionToMobile = () => {
    const deepLink = `blkouthub://navigate?module=${currentModule}&path=${window.location.pathname}`;
    
    // Track transition attempt
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'mobile_transition_attempt', {
        source_module: currentModule,
        source_path: window.location.pathname
      });
    }
    
    // Try deep link first
    window.location.href = deepLink;
    
    // Fallback to app store after delay
    setTimeout(() => {
      window.open('https://apps.apple.com/app/blkouthub', '_blank');
    }, 2500);
  };

  return (
    <button
      onClick={transitionToMobile}
      className="flex items-center px-3 py-2 text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 rounded-lg transition-colors duration-200"
      title="Open in BLKOUTHUB mobile app"
    >
      <Smartphone className="w-4 h-4 mr-2" />
      <span className="hidden md:inline">Mobile App</span>
    </button>
  );
};

// Authentication component
const AuthSection: React.FC<{ user: AuthUser | null; onSignIn: () => void; onSignOut: () => void }> = ({
  user,
  onSignIn,
  onSignOut
}) => {
  if (user) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 text-purple-100">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium hidden md:inline">{user.email}</span>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center px-3 py-2 text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onSignIn}
      className="flex items-center px-3 py-2 text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 rounded-lg transition-colors duration-200"
    >
      <LogIn className="w-4 h-4 md:mr-2" />
      <span className="hidden md:inline">Sign In</span>
    </button>
  );
};

// Main Global Navigation Component
const GlobalNavigation: React.FC<GlobalNavProps> = ({ 
  currentModule, 
  user = null,
  showMobileTransition = true 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(user);

  // Get navigation items for current module
  const navigationItems = MODULE_NAVIGATION[currentModule] || [];
  const filteredItems = navigationItems.filter(item => 
    !item.adminOnly || (authUser?.isAdmin)
  );

  // Authentication handlers
  const handleSignIn = async () => {
    // This would integrate with your existing auth system
    console.log('Sign in clicked - integrate with existing auth');
    // Example: redirect to auth modal or login page
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setAuthUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Track navigation clicks
  const trackNavigation = (fromModule: string, toModule: string, itemLabel: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'navigation_click', {
        from_module: fromModule,
        to_module: toModule,
        nav_item: itemLabel
      });
    }
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-purple-800 to-amber-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <a 
                href="https://blkout-scrollytelling.vercel.app"
                className="flex items-center text-white hover:text-purple-200 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-purple-900 font-bold text-sm">B</span>
                </div>
                <span className="font-bold text-lg hidden md:inline">BLKOUT</span>
              </a>
            </div>
            
            {/* Current Module Indicator */}
            <div className="ml-6 hidden md:block">
              <span className="text-purple-200 text-sm font-medium capitalize">
                {currentModule === 'ivor' ? 'AI Assistant' : currentModule}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              {filteredItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  target={item.external ? '_blank' : '_self'}
                  rel={item.external ? 'noopener noreferrer' : undefined}
                  onClick={() => trackNavigation(currentModule, item.href, item.label)}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 transition-colors duration-200"
                >
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                  {item.external && <ExternalLink className="w-3 h-3 ml-1" />}
                </a>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {showMobileTransition && <MobileAppTransition currentModule={currentModule} />}
            
            <AuthSection 
              user={authUser} 
              onSignIn={handleSignIn} 
              onSignOut={handleSignOut} 
            />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-purple-100 hover:text-white hover:bg-purple-700 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-purple-900 border-t border-purple-700">
            {filteredItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                target={item.external ? '_blank' : '_self'}
                rel={item.external ? 'noopener noreferrer' : undefined}
                onClick={() => {
                  trackNavigation(currentModule, item.href, item.label);
                  setIsMenuOpen(false);
                }}
                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 transition-colors duration-200"
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
                {item.external && <ExternalLink className="w-3 h-3 ml-auto" />}
              </a>
            ))}
            
            {/* Mobile App Transition in mobile menu */}
            {showMobileTransition && (
              <button
                onClick={() => {
                  const deepLink = `blkouthub://navigate?module=${currentModule}&path=${window.location.pathname}`;
                  window.location.href = deepLink;
                  setIsMenuOpen(false);
                }}
                className="flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-purple-100 hover:text-white hover:bg-purple-700 transition-colors duration-200"
              >
                <Smartphone className="w-4 h-4" />
                <span className="ml-3">Open in Mobile App</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default GlobalNavigation;