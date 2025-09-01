import React from 'react';
import { 
  ExternalLink, 
  Calendar, 
  Bot, 
  Newspaper, 
  Smartphone,
  Users,
  Home
} from 'lucide-react';

interface ModuleLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  description: string;
  status: 'live' | 'beta';
  external?: boolean;
}

const CrossModuleNavigation: React.FC = () => {
  const moduleLinks: ModuleLink[] = [
    {
      label: "Liberation Journey",
      href: "https://journey-blkout.vercel.app",
      icon: <Home className="w-4 h-4" />,
      description: "Experience our interactive liberation story",
      status: "live",
      external: true
    },
    {
      label: "Community Events",
      href: "https://events-blkout.vercel.app",
      icon: <Calendar className="w-4 h-4" />,
      description: "Find and join community gatherings",
      status: "live",
      external: true
    },
    {
      label: "Ask I.V.O.R.",
      href: "https://ivor-blkout.vercel.app",
      icon: <Bot className="w-4 h-4" />,
      description: "AI assistant for community support",
      status: "live",
      external: true
    },
    {
      label: "Mobile App",
      href: "blkouthub://",
      icon: <Smartphone className="w-4 h-4" />,
      description: "Open BLKOUTHUB app",
      status: "live",
      external: true
    }
  ];

  const handleModuleClick = (module: ModuleLink) => {
    // Track cross-module navigation
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cross_module_navigation', {
        from_module: 'platform',
        to_module: module.label.toLowerCase().replace(/\s+/g, '_'),
        is_external: module.external
      });
    }

    if (module.href.startsWith('blkouthub://')) {
      // Try mobile app first, fallback to app store
      window.location.href = module.href;
      setTimeout(() => {
        window.open('https://apps.apple.com/app/blkouthub', '_blank');
      }, 2500);
    } else {
      window.open(module.href, module.external ? '_blank' : '_self');
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-900/20 to-amber-900/20 backdrop-blur-sm border border-purple-500/20 rounded-lg p-6">
      <div className="flex items-center mb-4">
        <Users className="w-5 h-5 text-purple-400 mr-2" />
        <h3 className="text-lg font-semibold text-white">Explore BLKOUT Ecosystem</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {moduleLinks.map((module, index) => (
          <button
            key={index}
            onClick={() => handleModuleClick(module)}
            className="group p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-purple-400/50 transition-all duration-300 text-left"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center text-purple-300 group-hover:text-purple-200">
                {module.icon}
                <span className="ml-2 font-medium text-sm">{module.label}</span>
              </div>
              <div className="flex items-center">
                {module.external && (
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-300" />
                )}
                <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                  module.status === 'live' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {module.status}
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-xs group-hover:text-gray-200 transition-colors">
              {module.description}
            </p>
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-xs">
          🌟 One platform, multiple ways to connect with your community
        </p>
      </div>
    </div>
  );
};

export default CrossModuleNavigation;