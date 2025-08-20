import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../utils/test-utils'
import { createMockEvent } from '../../utils/test-utils'

// Mock the events service
const mockEventsService = {
  getAllEvents: vi.fn(),
  getEventStats: vi.fn(),
  submitEvent: vi.fn(),
  checkBackendHealth: vi.fn()
}

vi.mock('../../../src/services/eventsService', () => ({
  eventsService: mockEventsService
}))

// Create a simple EventsList component for testing
const EventsList = ({ 
  onEventSelect, 
  filterStatus = 'all' 
}: { 
  onEventSelect?: (event: any) => void
  filterStatus?: string 
}) => {
  const [events, setEvents] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        const eventsData = await mockEventsService.getAllEvents()
        setEvents(eventsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const filteredEvents = events.filter(event => 
    filterStatus === 'all' || event.status === filterStatus
  )

  if (loading) return <div data-testid="loading">Loading events...</div>
  if (error) return <div data-testid="error">Error: {error}</div>

  return (
    <div data-testid="events-list">
      <h2>Events ({filteredEvents.length})</h2>
      {filteredEvents.length === 0 ? (
        <p data-testid="no-events">No events found</p>
      ) : (
        <ul>
          {filteredEvents.map(event => (
            <li key={event.id} data-testid={`event-${event.id}`}>
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <span data-testid={`status-${event.id}`}>{event.status}</span>
              <button 
                onClick={() => onEventSelect?.(event)}
                data-testid={`select-${event.id}`}
              >
                Select
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

describe('EventsList Component', () => {
  const mockEvents = [
    createMockEvent({
      id: '1',
      name: 'Community Gathering',
      description: 'Monthly community meetup',
      status: 'approved'
    }),
    createMockEvent({
      id: '2',
      name: 'Liberation Workshop',
      description: 'Educational workshop',
      status: 'pending'
    }),
    createMockEvent({
      id: '3',
      name: 'Pride Celebration',
      description: 'Annual pride event',
      status: 'approved'
    })
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    mockEventsService.getAllEvents.mockResolvedValue(mockEvents)
  })

  describe('Rendering', () => {
    it('should render loading state initially', () => {
      render(<EventsList />)
      expect(screen.getByTestId('loading')).toBeInTheDocument()
    })

    it('should render events list after loading', async () => {
      render(<EventsList />)

      await waitFor(() => {
        expect(screen.getByTestId('events-list')).toBeInTheDocument()
      })

      expect(screen.getByText('Events (3)')).toBeInTheDocument()
      expect(screen.getByText('Community Gathering')).toBeInTheDocument()
      expect(screen.getByText('Liberation Workshop')).toBeInTheDocument()
      expect(screen.getByText('Pride Celebration')).toBeInTheDocument()
    })

    it('should render error state when loading fails', async () => {
      const errorMessage = 'Failed to fetch events'
      mockEventsService.getAllEvents.mockRejectedValue(new Error(errorMessage))

      render(<EventsList />)

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument()
      })

      expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument()
    })

    it('should render no events message when list is empty', async () => {
      mockEventsService.getAllEvents.mockResolvedValue([])

      render(<EventsList />)

      await waitFor(() => {
        expect(screen.getByTestId('no-events')).toBeInTheDocument()
      })

      expect(screen.getByText('No events found')).toBeInTheDocument()
    })
  })

  describe('Filtering', () => {
    it('should filter events by status', async () => {
      render(<EventsList filterStatus="approved" />)

      await waitFor(() => {
        expect(screen.getByText('Events (2)')).toBeInTheDocument()
      })

      expect(screen.getByText('Community Gathering')).toBeInTheDocument()
      expect(screen.getByText('Pride Celebration')).toBeInTheDocument()
      expect(screen.queryByText('Liberation Workshop')).not.toBeInTheDocument()
    })

    it('should show all events when filter is "all"', async () => {
      render(<EventsList filterStatus="all" />)

      await waitFor(() => {
        expect(screen.getByText('Events (3)')).toBeInTheDocument()
      })

      expect(screen.getByText('Community Gathering')).toBeInTheDocument()
      expect(screen.getByText('Liberation Workshop')).toBeInTheDocument()
      expect(screen.getByText('Pride Celebration')).toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onEventSelect when event is selected', async () => {
      const onEventSelect = vi.fn()
      render(<EventsList onEventSelect={onEventSelect} />)

      await waitFor(() => {
        expect(screen.getByTestId('select-1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('select-1'))

      expect(onEventSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: '1',
          name: 'Community Gathering'
        })
      )
    })

    it('should handle multiple event selections', async () => {
      const onEventSelect = vi.fn()
      render(<EventsList onEventSelect={onEventSelect} />)

      await waitFor(() => {
        expect(screen.getByTestId('select-1')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByTestId('select-1'))
      fireEvent.click(screen.getByTestId('select-2'))

      expect(onEventSelect).toHaveBeenCalledTimes(2)
      expect(onEventSelect).toHaveBeenNthCalledWith(1, expect.objectContaining({ id: '1' }))
      expect(onEventSelect).toHaveBeenNthCalledWith(2, expect.objectContaining({ id: '2' }))
    })
  })

  describe('Data Display', () => {
    it('should display event status correctly', async () => {
      render(<EventsList />)

      await waitFor(() => {
        expect(screen.getByTestId('status-1')).toBeInTheDocument()
      })

      expect(screen.getByTestId('status-1')).toHaveTextContent('approved')
      expect(screen.getByTestId('status-2')).toHaveTextContent('pending')
      expect(screen.getByTestId('status-3')).toHaveTextContent('approved')
    })

    it('should display event titles and descriptions', async () => {
      render(<EventsList />)

      await waitFor(() => {
        expect(screen.getByText('Community Gathering')).toBeInTheDocument()
      })

      expect(screen.getByText('Monthly community meetup')).toBeInTheDocument()
      expect(screen.getByText('Educational workshop')).toBeInTheDocument()
      expect(screen.getByText('Annual pride event')).toBeInTheDocument()
    })
  })

  describe('Service Integration', () => {
    it('should call events service on mount', async () => {
      render(<EventsList />)

      await waitFor(() => {
        expect(mockEventsService.getAllEvents).toHaveBeenCalledOnce()
      })
    })

    it('should handle service unavailability gracefully', async () => {
      mockEventsService.getAllEvents.mockRejectedValue(new Error('Service unavailable'))

      render(<EventsList />)

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument()
      })

      expect(screen.getByText('Error: Service unavailable')).toBeInTheDocument()
    })
  })
})