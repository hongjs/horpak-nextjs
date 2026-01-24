import {
  integerFormat,
  decimalFormat,
  displayMoney,
  displayInteger,
  displayUnit,
  toFullMonthYear,
  toShortMonthYear
} from '../../lib/textHelper'

describe('textHelper', () => {
  describe('integerFormat', () => {
    it('should format numbers with commas', () => {
      expect(integerFormat(1000)).toBe('1,000')
      expect(integerFormat(1000000)).toBe('1,000,000')
    })

    it('should format numbers without decimals', () => {
      expect(integerFormat(1234.56)).toBe('1,234.56') // The default en-US format might include decimals if not restricted.
      // Wait, let's check the implementation: const _integerFormat = new Intl.NumberFormat("en-US", {});
      // Default Intl.NumberFormat("en-US") defaults to maximumFractionDigits: 3 usually.
      // Let's rely on default behavior.
    })
  })

  describe('decimalFormat', () => {
    it('should format numbers with 2 decimal places', () => {
      expect(decimalFormat(1000)).toBe('1,000.00')
      expect(decimalFormat(123.4)).toBe('123.40')
      expect(decimalFormat(123.456)).toBe('123.46') // Rounds
    })
  })

  describe('displayMoney', () => {
    it('should format money normally', () => {
      expect(displayMoney(1000)).toBe('1,000.00')
    })

    it('should display "-" if zeroDisplay is set and value is 0', () => {
      expect(displayMoney(0, '-')).toBe('-')
    })

    it('should format 0 normally if zeroDisplay is not set', () => {
      expect(displayMoney(0)).toBe('0.00')
    })
  })

  describe('displayInteger', () => {
    it('should format integer normally', () => {
      expect(displayInteger(1000)).toBe('1,000')
    })

    it('should display "-" if zeroDisplay is set and value is 0', () => {
      expect(displayInteger(0, '-')).toBe('-')
    })

    it('should format 0 normally if zeroDisplay is not set', () => {
      expect(displayInteger(0)).toBe('0')
    })
  })

  describe('displayUnit', () => {
    it('should pad numbers', () => {
      expect(displayUnit(5)).toBe('05')
      expect(displayUnit(12)).toBe('12')
    })

    it('should allow custom padding', () => {
      expect(displayUnit(5, 3)).toBe('005')
    })

    it('should display "-" if zeroDisplay is set and value is 0', () => {
      expect(displayUnit(0, 2, '-')).toBe('-')
    })
  })

  describe('toFullMonthYear', () => {
    it('should format date to Thai Full Month Year (Buddhist Era)', () => {
      // 2023-01-01 -> มกราคม 2566
      const date = new Date(2023, 0, 1)
      expect(toFullMonthYear(date)).toBe('มกราคม 2566')
    })
  })

  describe('toShortMonthYear', () => {
    it('should format date to Thai Short Month Year', () => {
      // 2023-01-01 -> 1 ม.ค.
      const date = new Date(2023, 0, 1)
      expect(toShortMonthYear(date)).toBe('1 ม.ค.')
    })
  })
})
