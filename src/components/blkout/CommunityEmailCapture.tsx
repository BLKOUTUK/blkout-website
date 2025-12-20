import React, { useState } from 'react'

interface CommunityEmailCaptureProps {
  source?: string
  variant?: string
  preselectedInterests?: string[]
  onSuccess?: (trackingId: string) => void
}

const CommunityEmailCapture: React.FC<CommunityEmailCaptureProps> = ({
  source = 'community_capture',
  onSuccess
}) => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('https://crm.blkoutuk.cloud/api/community/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          subscriptions: {
            newsletter: true,
            events: false,
            blkouthub: false,
            volunteer: false,
          },
          consentGiven: true,
          source,
          sourceUrl: window.location.href,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('Thanks for joining!')
        setEmail('')
        onSuccess?.(data.contactId || 'success')

        setTimeout(() => {
          setStatus('idle')
          setMessage('')
        }, 3000)
      } else {
        throw new Error(data.message || 'Failed to join. Please try again.')
      }
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 3000)
    }
  }

  return (
    <div className="bg-black/20 p-6 rounded-lg">
      <p className="text-white text-center mb-4">Join our community newsletter</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={status === 'loading'}
          className="flex-1 px-3 py-2 bg-white/10 text-white rounded border border-white/20 placeholder-white/50 focus:outline-none focus:border-blkout-primary disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-4 py-2 bg-blkout-primary text-white rounded hover:bg-blkout-primary/80 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
        >
          {status === 'loading' ? 'Joining...' : status === 'success' ? '✓' : 'Join'}
        </button>
      </form>
      {message && (
        <p className={`text-center text-sm mt-2 ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  )
}

export default CommunityEmailCapture
