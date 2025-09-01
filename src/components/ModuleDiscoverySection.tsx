import React from 'react';
import { 
  Newspaper, 
  Calendar, 
  Users, 
  Bot, 
  Settings,
  ExternalLink,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

interface ModuleCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  status: 'live' | 'beta' | 'coming-soon';
  features: string[];
  external?: boolean;
  adminOnly?: boolean;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  title, 
  description, 
  href, 
  icon, 
  status, 
  features,
  external = false,
  adminOnly = false 
}) => {
  const statusConfig = {
    live: { 
      label: 'Live', 
      className: 'bg-green-100 text-green-800 border-green-200', 
      icon: <CheckCircle className="w-3 h-3" /> 
    },
    beta: { 
      label: 'Beta', 
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      icon: <Clock className="w-3 h-3" /> 
    },
    'coming-soon': { 
      label: 'Coming Soon', 
      className: 'bg-gray-100 text-gray-600 border-gray-200', 
      icon: <Clock className="w-3 h-3" /> 
    }
  };

  const config = statusConfig[status];

  const handleClick = (e: React.MouseEvent) => {
    // Track module discovery click
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'module_discovery_click', {
        module_name: title.toLowerCase().replace(/\s+/g, '_'),
        status: status,
        is_external: external
      });
    }

    if (status === 'coming-soon') {
      e.preventDefault();
      // Could show a "notify me" modal here
      alert(`${title} is coming soon! We'll notify you when it's available.`);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="flex-shrink-0 p-2 bg-gradient-to-br from-purple-100 to-amber-100 rounded-lg">
              {icon}
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              {adminOnly && (
                <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-1 rounded-full">
                  Admin Only
                </span>
              )}
            </div>
          </div>
          <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            {config.icon}
            <span className="ml-1">{config.label}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      {/* Features */}
      <div className="p-6 pt-4">
        <ul className="space-y-2 mb-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <a
          href={status === 'coming-soon' ? '#' : href}
          target={external ? '_blank' : '_self'}
          rel={external ? 'noopener noreferrer' : undefined}
          onClick={handleClick}
          className={`
            flex items-center justify-center w-full px-4 py-3 rounded-lg font-medium transition-colors duration-200
            ${status === 'coming-soon' 
              ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-600 to-amber-600 text-white hover:from-purple-700 hover:to-amber-700'
            }
          `}
        >
          {status === 'coming-soon' ? (
            <>
              <Clock className="w-4 h-4 mr-2" />
              Coming Soon
            </>
          ) : (
            <>
              {status === 'live' ? 'Explore Now' : 'Try Beta'}
              {external && <ExternalLink className="w-4 h-4 ml-2" />}
            </>
          )}
        </a>
      </div>
    </div>
  );
};

const ModuleDiscoverySection: React.FC = () => {
  const modules: ModuleCardProps[] = [
    {
      title: "Community Newsroom",
      description: "Stay informed with community-curated news and stories that matter to Black QTIPOC+ communities.",
      href: "/newsroom",
      icon: <Newspaper className="w-6 h-6 text-purple-600" />,
      status: "beta",
      features: [
        "AI-powered content curation",
        "Community moderation system",
        "RSS feed aggregation",
        "Story submission & publishing"
      ]
    },
    {
      title: "Events Calendar",
      description: "Discover Black QTIPOC+ events near you with automated discovery and community intelligence.",
      href: "https://events-blkout.vercel.app",
      icon: <Calendar className="w-6 h-6 text-amber-600" />,
      status: "live",
      external: true,
      features: [
        "Multi-source event discovery",
        "Community intelligence dashboard",
        "Partner organization showcasing",
        "Event submission & moderation"
      ]
    },
    {
      title: "Community Governance",
      description: "Participate in platform decisions and help shape the future of our community technology.",
      href: "/governance",
      icon: <Users className="w-6 h-6 text-green-600" />,
      status: "beta",
      features: [
        "Democratic decision making",
        "Proposal submission & voting",
        "Community policy development",
        "Transparent governance process"
      ]
    },
    {
      title: "IVOR AI Assistant",
      description: "Get personalized community support and access powerful AI tools designed for liberation.",
      href: "https://ivor-blkout.vercel.app",
      icon: <Bot className="w-6 h-6 text-blue-600" />,
      status: "live",
      external: true,
      features: [
        "Journey-aware assistance",
        "Community resource discovery",
        "Trust scoring system",
        "Personalized recommendations"
      ]
    },
    {
      title: "Admin Dashboard",
      description: "Comprehensive content management, moderation tools, and community analytics for administrators.",
      href: "https://ivor-blkout.vercel.app/admin",
      icon: <Settings className="w-6 h-6 text-red-600" />,
      status: "live",
      external: true,
      adminOnly: true,
      features: [
        "Content moderation queue",
        "Social media automation",
        "Chrome extension management",
        "N8N workflow monitoring"
      ]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">
              Explore Our Community Platform
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover powerful tools designed for Black queer liberation. Each module serves 
            a unique purpose in building stronger, more connected communities.
          </p>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module, index) => (
            <ModuleCard key={index} {...module} />
          ))}
        </div>

        {/* Journey Progression */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-8 border border-purple-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Your Liberation Journey
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
              <div className="flex items-center bg-purple-100 px-3 py-2 rounded-full">
                <span className="w-2 h-2 bg-purple-600 rounded-full mr-2"></span>
                Discovery
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center bg-amber-100 px-3 py-2 rounded-full">
                <span className="w-2 h-2 bg-amber-600 rounded-full mr-2"></span>
                Exploration
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center bg-green-100 px-3 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                Participation
              </div>
              <span className="text-gray-400">→</span>
              <div className="flex items-center bg-blue-100 px-3 py-2 rounded-full">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                Leadership
              </div>
            </div>
            <p className="text-gray-600 mt-4">
              Every module supports your journey from discovery to community leadership.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleDiscoverySection;