import CommunityShowcaseDark from '../components/CommunityShowcaseDark'
import SharedLayout from '../components/layout/SharedLayout'

export default function CommunityShowcasePage() {
  return (
    <SharedLayout>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🏘️ COMMUNITY
          </h1>
          <h2 className="text-2xl mb-8 text-white font-bold uppercase tracking-wide">
            CONNECTING BLACK QUEER VOICES ACROSS THE UK
          </h2>
        </div>

        <CommunityShowcaseDark />
      </div>
    </SharedLayout>
  )
}