import { describe, it, expect } from '@jest/globals';
import {
  formatPrice,
  formatDate,
  formatDateTime,
  truncateText,
  getStatusText,
  capitalizeFirstLetter,
} from '@/lib/utils/format';

const normalizeSpaces = (value: string) => value.replace(/\u00A0/g, ' ');

describe('formatPrice', () => {
  it('formats large numbers with currency symbol and separators', () => {
    const formatted = normalizeSpaces(formatPrice(1250000));
    expect(formatted).toBe('$ 1.250.000');
  });

  it('formats zero without decimals', () => {
    const formatted = normalizeSpaces(formatPrice(0));
    expect(formatted).toBe('$ 0');
  });

  it('rounds numbers without showing decimals', () => {
    const formatted = normalizeSpaces(formatPrice(1999.99));
    expect(formatted).toBe('$ 2.000');
  });

  it('includes negative symbol for negative amounts', () => {
    const formatted = normalizeSpaces(formatPrice(-500));
    expect(formatted).toBe('-$ 500');
  });
});

describe('formatDate', () => {
  it('formats ISO date strings into readable spanish text', () => {
    const formatted = formatDate('2023-03-15T12:00:00Z').toLowerCase();
    expect(formatted).toContain('marzo');
    expect(formatted).toContain('2023');
  });

  it('formats Date instances', () => {
    const formatted = formatDate(new Date(2024, 0, 5)).toLowerCase();
    expect(formatted).toContain('enero');
    expect(formatted).toContain('2024');
  });

  it('maintains day information for mid-month dates', () => {
    const formatted = formatDate('2023-07-15T15:00:00Z');
    expect(formatted).toContain('15');
    expect(formatted.toLowerCase()).toContain('julio');
  });
});

describe('formatDateTime', () => {
  it('includes both date and time information', () => {
    const formatted = formatDateTime('2023-03-15T10:30:00Z');
    expect(formatted).toMatch(/\d{2}:\d{2}/);
    expect(formatted).toContain('2023');
  });

  it('handles Date objects', () => {
    const formatted = formatDateTime(new Date(2023, 10, 10, 9, 45));
    expect(formatted).toMatch(/\d{2}:\d{2}/);
    expect(formatted).toContain('2023');
  });

  it('pads minutes with zeros when needed', () => {
    const formatted = formatDateTime('2023-03-15T10:05:00Z');
    expect(formatted).toMatch(/:05/);
  });
});

describe('truncateText', () => {
  it('returns original text when length is below limit', () => {
    expect(truncateText('Hola', 10)).toBe('Hola');
  });

  it('adds ellipsis when text exceeds the maximum length', () => {
    expect(truncateText('Experiencias gastronómicas', 10)).toBe('Experienci...');
  });

  it('does not truncate when length equals the limit', () => {
    expect(truncateText('12345', 5)).toBe('12345');
  });

  it('handles very small maximum lengths', () => {
    expect(truncateText('abcd', 2)).toBe('ab...');
  });
});

describe('getStatusText', () => {
  it('translates pending status to spanish', () => {
    expect(getStatusText('pending')).toBe('Pendiente');
  });

  it('is case insensitive', () => {
    expect(getStatusText('ACCEPTED')).toBe('Aceptado');
  });

  it('returns original status when unknown', () => {
    expect(getStatusText('in-progress')).toBe('in-progress');
  });

  it('handles mixed-case delivered status', () => {
    expect(getStatusText('Delivered')).toBe('Entregado');
  });
});

describe('capitalizeFirstLetter', () => {
  it('capitalizes lower case text', () => {
    expect(capitalizeFirstLetter('hola')).toBe('Hola');
  });

  it('lowercases the rest of the text', () => {
    expect(capitalizeFirstLetter('hOLA')).toBe('Hola');
  });

  it('returns empty string unchanged', () => {
    expect(capitalizeFirstLetter('')).toBe('');
  });
});
