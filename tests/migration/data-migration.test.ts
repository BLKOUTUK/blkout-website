import { describe, it, expect, beforeEach } from 'vitest'
import { migrationClient, migrationUtils, migrationTestData } from './setup'

describe('Data Migration Tests', () => {
  describe('Backup and Restore', () => {
    beforeEach(async () => {
      // Insert test data
      await migrationClient.from('events').insert(migrationTestData.events)
      await migrationClient.from('articles').insert(migrationTestData.articles)
      await migrationClient.from('contacts').insert(migrationTestData.contacts)
    })

    it('should create complete backup of events table', async () => {
      const backup = await migrationUtils.createBackup('events')

      expect(backup).toBeDefined()
      expect(backup.tableName).toBe('events')
      expect(backup.data).toBeDefined()
      expect(backup.timestamp).toBeDefined()
      expect(backup.count).toBeGreaterThanOrEqual(2) // Our test data
      expect(Array.isArray(backup.data)).toBe(true)

      // Verify backup contains our test data
      const testEventNames = backup.data.map((event: any) => event.name)
      expect(testEventNames).toContain('Migration Test Event 1')
      expect(testEventNames).toContain('Migration Test Event 2')
    })

    it('should create complete backup of articles table', async () => {
      const backup = await migrationUtils.createBackup('articles')

      expect(backup.tableName).toBe('articles')
      expect(backup.count).toBeGreaterThanOrEqual(2)
      
      const testArticleTitles = backup.data.map((article: any) => article.title)
      expect(testArticleTitles).toContain('Migration Test Article 1')
      expect(testArticleTitles).toContain('Migration Test Article 2')
    })

    it('should restore data from backup correctly', async () => {
      // Create backup
      const originalBackup = await migrationUtils.createBackup('events')
      
      // Clear the table
      await migrationClient.from('events').delete().ilike('name', 'Migration Test%')
      
      // Verify table is empty of test data
      const { data: emptyCheck } = await migrationClient
        .from('events')
        .select('*')
        .ilike('name', 'Migration Test%')
      expect(emptyCheck).toEqual([])

      // Restore from backup
      await migrationUtils.restoreFromBackup(originalBackup)

      // Verify restoration
      const { data: restoredData } = await migrationClient
        .from('events')
        .select('*')
        .ilike('name', 'Migration Test%')

      expect(restoredData.length).toBe(originalBackup.count)
      
      const restoredNames = restoredData.map(event => event.name)
      expect(restoredNames).toContain('Migration Test Event 1')
      expect(restoredNames).toContain('Migration Test Event 2')
    })

    it('should handle empty table backup', async () => {
      // Clear all test data first
      await migrationClient.from('events').delete().ilike('name', 'Migration Test%')
      
      const backup = await migrationUtils.createBackup('events')

      expect(backup.count).toBe(0)
      expect(backup.data).toEqual([])
      expect(backup.tableName).toBe('events')
    })

    it('should handle restoration of empty backup', async () => {
      const emptyBackup = {
        tableName: 'events',
        data: [],
        timestamp: new Date().toISOString(),
        count: 0
      }

      // Should not throw error
      await expect(migrationUtils.restoreFromBackup(emptyBackup)).resolves.toBeUndefined()
    })
  })

  describe('Data Integrity Verification', () => {
    beforeEach(async () => {
      await migrationClient.from('events').insert(migrationTestData.events)
      await migrationClient.from('articles').insert(migrationTestData.articles)
    })

    it('should verify data integrity for events table', async () => {
      const integrity = await migrationUtils.verifyDataIntegrity('events')

      expect(integrity.tableName).toBe('events')
      expect(integrity.count).toBeGreaterThanOrEqual(2)
      expect(integrity.hasData).toBe(true)
      expect(integrity.allRecordsHaveId).toBe(true)
      expect(integrity.firstRecord).toBeDefined()
      expect(integrity.firstRecord.id).toBeDefined()
    })

    it('should verify data integrity with expected count', async () => {
      const { count } = await migrationClient
        .from('events')
        .select('*', { count: 'exact', head: true })
        .ilike('name', 'Migration Test%')

      const integrity = await migrationUtils.verifyDataIntegrity('events', count)

      expect(integrity.matchesExpectedCount).toBe(true)
    })

    it('should detect when expected count does not match', async () => {
      const integrity = await migrationUtils.verifyDataIntegrity('events', 999)

      expect(integrity.matchesExpectedCount).toBe(false)
      expect(integrity.count).not.toBe(999)
    })

    it('should verify all records have required fields', async () => {
      const integrity = await migrationUtils.verifyDataIntegrity('events')

      expect(integrity.allRecordsHaveId).toBe(true)
      
      // Check specific fields exist
      if (integrity.firstRecord) {
        expect(integrity.firstRecord).toHaveProperty('name')
        expect(integrity.firstRecord).toHaveProperty('event_date')
        expect(integrity.firstRecord).toHaveProperty('source')
        expect(integrity.firstRecord).toHaveProperty('created_at')
        expect(integrity.firstRecord).toHaveProperty('updated_at')
      }
    })
  })

  describe('Foreign Key Constraints', () => {
    it('should detect valid foreign key relationships', async () => {
      // Create a contact first
      const { data: contact } = await migrationClient
        .from('contacts')
        .insert({
          name: 'Migration Test Organizer',
          email: 'organizer@test.com'
        })
        .select()
        .single()

      // Create event with valid organizer_id
      await migrationClient
        .from('events')
        .insert({
          name: 'Migration Test Event with Organizer',
          description: 'Event with valid organizer',
          event_date: '2025-09-01',
          location: { address: 'Test Location' },
          source: 'manual',
          organizer_id: contact.id
        })

      const constraintCheck = await migrationUtils.checkForeignKeyConstraints()

      expect(constraintCheck.constraintsValid).toBe(true)
      expect(constraintCheck.orphanedEvents).toEqual([])
    })

    it('should detect orphaned foreign key references', async () => {
      // Create event with non-existent organizer_id
      await migrationClient
        .from('events')
        .insert({
          name: 'Migration Test Orphaned Event',
          description: 'Event with invalid organizer',
          event_date: '2025-09-01',
          location: { address: 'Test Location' },
          source: 'manual',
          organizer_id: '00000000-0000-0000-0000-000000000000' // Non-existent UUID
        })

      const constraintCheck = await migrationUtils.checkForeignKeyConstraints()

      expect(constraintCheck.constraintsValid).toBe(false)
      expect(constraintCheck.orphanedEvents.length).toBeGreaterThan(0)
      expect(constraintCheck.orphanedEvents[0].organizer_id).toBe('00000000-0000-0000-0000-000000000000')
    })

    it('should handle events without organizer_id gracefully', async () => {
      // Create event without organizer_id (null)
      await migrationClient
        .from('events')
        .insert({
          name: 'Migration Test Event No Organizer',
          description: 'Event without organizer',
          event_date: '2025-09-01',
          location: { address: 'Test Location' },
          source: 'manual',
          organizer_id: null
        })

      const constraintCheck = await migrationUtils.checkForeignKeyConstraints()

      // Should not fail due to null organizer_id
      expect(constraintCheck).toBeDefined()
      expect(constraintCheck.totalChecked).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Schema Migration Simulation', () => {
    it('should simulate successful migration', async () => {
      // Define mock schemas
      const fromSchema = { events: true, articles: true, contacts: true }
      const toSchema = { events: true, articles: true, contacts: true }

      const migrationResult = await migrationUtils.simulateMigration(fromSchema, toSchema)

      expect(migrationResult.success).toBe(true)
      expect(migrationResult.backups).toBeDefined()
      expect(migrationResult.migrationLog).toBeDefined()
      expect(migrationResult.constraintCheck).toBeDefined()
      expect(Array.isArray(migrationResult.migrationLog)).toBe(true)
      expect(migrationResult.migrationLog.length).toBeGreaterThan(0)

      // Check that all steps were logged
      const logString = migrationResult.migrationLog.join(' ')
      expect(logString).toContain('Starting data backup')
      expect(logString).toContain('Simulating schema migration')
      expect(logString).toContain('Verifying migration')
    })

    it('should provide detailed migration log', async () => {
      const fromSchema = { events: true, articles: true }
      const toSchema = { events: true, articles: true }

      const migrationResult = await migrationUtils.simulateMigration(fromSchema, toSchema)

      expect(migrationResult.migrationLog).toContain('Starting data backup...')
      expect(migrationResult.migrationLog.some(log => log.includes('Backed up'))).toBe(true)
      expect(migrationResult.migrationLog).toContain('Simulating schema migration...')
      expect(migrationResult.migrationLog).toContain('Verifying migration...')
      expect(migrationResult.migrationLog.some(log => log.includes('Verified'))).toBe(true)
    })

    it('should track backup metadata correctly', async () => {
      const fromSchema = { events: true }
      const toSchema = { events: true }

      const migrationResult = await migrationUtils.simulateMigration(fromSchema, toSchema)

      expect(migrationResult.success).toBe(true)
      expect(migrationResult.backups).toBeDefined()
      expect(Array.isArray(migrationResult.backups)).toBe(true)

      if (migrationResult.backups.length > 0) {
        const backup = migrationResult.backups[0]
        expect(backup).toHaveProperty('tableName')
        expect(backup).toHaveProperty('data')
        expect(backup).toHaveProperty('timestamp')
        expect(backup).toHaveProperty('count')
        expect(backup.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      }
    })
  })

  describe('Rollback Scenarios', () => {
    it('should handle rollback after failed migration', async () => {
      // Create initial data
      const initialData = await migrationUtils.createBackup('events')
      
      // Simulate data corruption/modification
      await migrationClient.from('events')
        .update({ name: 'CORRUPTED' })
        .ilike('name', 'Migration Test%')

      // Verify corruption
      const { data: corruptedData } = await migrationClient
        .from('events')
        .select('*')
        .eq('name', 'CORRUPTED')

      expect(corruptedData.length).toBeGreaterThan(0)

      // Rollback by restoring from backup
      await migrationClient.from('events').delete().eq('name', 'CORRUPTED')
      await migrationUtils.restoreFromBackup(initialData)

      // Verify rollback success
      const integrity = await migrationUtils.verifyDataIntegrity('events')
      expect(integrity.hasData).toBe(true)

      const { data: restoredData } = await migrationClient
        .from('events')
        .select('*')
        .ilike('name', 'Migration Test%')

      expect(restoredData.length).toBe(initialData.count)
      expect(restoredData.every(event => event.name !== 'CORRUPTED')).toBe(true)
    })

    it('should validate data consistency after rollback', async () => {
      // Backup original data
      const originalBackup = await migrationUtils.createBackup('events')
      
      // Clear and restore
      await migrationClient.from('events').delete().ilike('name', 'Migration Test%')
      await migrationUtils.restoreFromBackup(originalBackup)

      // Validate consistency
      const integrity = await migrationUtils.verifyDataIntegrity('events', originalBackup.count)
      const constraints = await migrationUtils.checkForeignKeyConstraints()

      expect(integrity.matchesExpectedCount).toBe(true)
      expect(integrity.allRecordsHaveId).toBe(true)
      expect(constraints.constraintsValid).toBe(true)
    })
  })

  describe('Performance Under Load', () => {
    it('should handle migration of large datasets efficiently', async () => {
      // Create larger dataset for testing
      const largeDataset = Array.from({ length: 100 }, (_, i) => ({
        name: `Bulk Migration Test Event ${i}`,
        description: `Bulk test event number ${i}`,
        event_date: '2025-09-01',
        location: { address: `Location ${i}` },
        source: 'manual' as const,
        status: 'draft' as const
      }))

      // Insert bulk data
      const startInsert = Date.now()
      await migrationClient.from('events').insert(largeDataset)
      const insertTime = Date.now() - startInsert

      // Backup large dataset
      const startBackup = Date.now()
      const backup = await migrationUtils.createBackup('events')
      const backupTime = Date.now() - startBackup

      // Clean and restore
      await migrationClient.from('events').delete().ilike('name', 'Bulk Migration Test%')
      
      const startRestore = Date.now()
      await migrationUtils.restoreFromBackup({
        ...backup,
        data: backup.data.filter((event: any) => event.name.includes('Bulk Migration Test'))
      })
      const restoreTime = Date.now() - startRestore

      // Performance assertions (generous limits for test environment)
      expect(insertTime).toBeLessThan(10000) // 10 seconds
      expect(backupTime).toBeLessThan(5000)  // 5 seconds
      expect(restoreTime).toBeLessThan(10000) // 10 seconds

      // Verify data integrity
      const { count } = await migrationClient
        .from('events')
        .select('*', { count: 'exact', head: true })
        .ilike('name', 'Bulk Migration Test%')

      expect(count).toBe(100)

      // Cleanup
      await migrationClient.from('events').delete().ilike('name', 'Bulk Migration Test%')
    }, 30000) // 30 second timeout for this test
  })
})