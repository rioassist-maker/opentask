import { formatDate, getStatusColor } from '@/lib/tasks'
import { TaskStatus } from '@/lib/types'

describe('Tasks Helper Functions', () => {
  describe('formatDate', () => {
    it('formats ISO date string correctly', () => {
      const date = '2026-02-12T10:30:00Z'
      const result = formatDate(date)
      expect(result).toContain('Feb')
      expect(result).toContain('12')
    })

    it('handles different date formats', () => {
      const date = '2026-02-12'
      const result = formatDate(date)
      expect(result).toMatch(/[A-Za-z]{3}\s\d{1,2},\s\d{4}/)
    })
  })

  describe('getStatusColor', () => {
    it('returns gray color for todo status', () => {
      expect(getStatusColor('todo')).toContain('gray')
    })

    it('returns blue color for in_progress status', () => {
      expect(getStatusColor('in_progress')).toContain('blue')
    })

    it('returns green color for done status', () => {
      expect(getStatusColor('done')).toContain('green')
    })

    it('returns gray color for unknown status', () => {
      expect(getStatusColor('unknown' as TaskStatus)).toContain('gray')
    })
  })
})
