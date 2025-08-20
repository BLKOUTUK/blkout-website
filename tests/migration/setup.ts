import { beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../src/types/supabase'

// Migration test client
export const migrationClient = createClient<Database>(
  'http://localhost:54321',
  'test-migration-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
)

// Migration test utilities
export const migrationUtils = {
  // Create backup of current data
  async createBackup(tableName: string) {
    try {
      const { data, error } = await migrationClient
        .from(tableName as any)
        .select('*')

      if (error) throw error

      return {
        tableName,
        data,
        timestamp: new Date().toISOString(),
        count: data.length
      }
    } catch (error) {
      console.error(`Failed to backup ${tableName}:`, error)
      throw error
    }
  },

  // Restore data from backup
  async restoreFromBackup(backup: any) {
    try {
      if (backup.data.length === 0) return

      const { error } = await migrationClient
        .from(backup.tableName)
        .insert(backup.data)

      if (error) throw error

      console.log(`Restored ${backup.count} records to ${backup.tableName}`)
    } catch (error) {
      console.error(`Failed to restore ${backup.tableName}:`, error)
      throw error
    }
  },

  // Verify data integrity
  async verifyDataIntegrity(tableName: string, expectedCount?: number) {
    try {
      const { data, error, count } = await migrationClient
        .from(tableName as any)
        .select('*', { count: 'exact' })

      if (error) throw error

      const result = {
        tableName,
        count: count || 0,
        hasData: (data?.length || 0) > 0,
        firstRecord: data?.[0] || null,
        allRecordsHaveId: data?.every(record => record.id) || false
      }

      if (expectedCount !== undefined) {
        result.matchesExpectedCount = count === expectedCount
      }

      return result
    } catch (error) {
      console.error(`Failed to verify ${tableName}:`, error)
      throw error
    }
  },

  // Check foreign key constraints
  async checkForeignKeyConstraints() {
    try {
      // Check events -> contacts relationship (organizer_id)
      const { data: orphanedEvents, error: eventsError } = await migrationClient
        .from('events')
        .select('id, organizer_id')
        .not('organizer_id', 'is', null)

      if (eventsError) throw eventsError

      const orphanedEventsList = []
      for (const event of orphanedEvents || []) {
        const { data: contact } = await migrationClient
          .from('contacts')
          .select('id')
          .eq('id', event.organizer_id)
          .single()

        if (!contact) {
          orphanedEventsList.push(event)
        }
      }

      return {
        orphanedEvents: orphanedEventsList,
        totalChecked: orphanedEvents?.length || 0,
        constraintsValid: orphanedEventsList.length === 0
      }
    } catch (error) {
      console.error('Failed to check foreign key constraints:', error)
      throw error
    }
  },

  // Test data migration scenario
  async simulateMigration(fromSchema: any, toSchema: any) {
    const migrationLog = []

    try {
      // Step 1: Backup current data
      migrationLog.push('Starting data backup...')
      const backups = []
      for (const tableName of Object.keys(fromSchema)) {
        const backup = await this.createBackup(tableName)
        backups.push(backup)
        migrationLog.push(`Backed up ${backup.count} records from ${tableName}`)
      }

      // Step 2: Simulate schema changes
      migrationLog.push('Simulating schema migration...')
      
      // Step 3: Verify migration
      migrationLog.push('Verifying migration...')
      for (const backup of backups) {
        const integrity = await this.verifyDataIntegrity(backup.tableName, backup.count)
        migrationLog.push(`Verified ${integrity.tableName}: ${integrity.count} records`)
      }

      // Step 4: Check constraints
      const constraintCheck = await this.checkForeignKeyConstraints()
      migrationLog.push(`Foreign key constraints: ${constraintCheck.constraintsValid ? 'VALID' : 'INVALID'}`)

      return {
        success: true,
        backups,
        migrationLog,
        constraintCheck
      }
    } catch (error) {
      migrationLog.push(`Migration failed: ${error.message}`)
      return {
        success: false,
        error: error.message,
        migrationLog
      }
    }
  }
}

// Sample data for migration testing
export const migrationTestData = {
  events: [
    {
      name: 'Migration Test Event 1',
      description: 'Test event for migration testing',
      event_date: '2025-09-01',
      location: { address: 'Migration Test Location' },
      source: 'manual' as const,
      status: 'draft' as const
    },
    {
      name: 'Migration Test Event 2',
      description: 'Another test event for migration',
      event_date: '2025-09-15',
      location: { address: 'Another Migration Location' },
      source: 'community' as const,
      status: 'published' as const
    }
  ],
  articles: [
    {
      title: 'Migration Test Article 1',
      excerpt: 'Test article for migration testing',
      content: 'Full content of migration test article',
      author: 'Migration Tester',
      category: 'Test',
      status: 'draft' as const
    },
    {
      title: 'Migration Test Article 2',
      excerpt: 'Another test article for migration',
      content: 'Full content of another migration test article',
      author: 'Migration Tester 2',
      category: 'Test',
      status: 'published' as const
    }
  ],
  contacts: [
    {
      name: 'Migration Test Contact',
      email: 'migration.test@example.com',
      organization: 'Migration Test Org',
      verified: false
    }
  ]
}

beforeAll(async () => {
  console.log('🔄 Starting migration tests setup')
  
  // Verify database connection
  try {
    const { error } = await migrationClient
      .from('events')
      .select('id')
      .limit(1)
    
    if (error && !error.message.includes('relation')) {
      throw new Error(`Database connection failed: ${error.message}`)
    }
  } catch (error) {
    console.warn('⚠️ Database may not be fully initialized:', error)
  }
})

beforeEach(async () => {
  // Clean up migration test data
  try {
    await migrationClient.from('events').delete().ilike('name', 'Migration Test%')
    await migrationClient.from('articles').delete().ilike('title', 'Migration Test%')
    await migrationClient.from('contacts').delete().ilike('name', 'Migration Test%')
  } catch (error) {
    console.warn('Could not clean migration test data:', error)
  }
})

afterAll(async () => {
  // Final cleanup
  try {
    await migrationClient.from('events').delete().ilike('name', 'Migration Test%')
    await migrationClient.from('articles').delete().ilike('title', 'Migration Test%')
    await migrationClient.from('contacts').delete().ilike('name', 'Migration Test%')
  } catch (error) {
    console.warn('Could not perform final cleanup:', error)
  }
  
  console.log('🔄 Migration tests teardown completed')
})