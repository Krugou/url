import { describe, it, expect } from 'vitest';

/**
 * Sanitize a URL to prevent XSS via javascript: or data: URIs.
 * Duplicated from UrlForm for isolated testing.
 */
function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return parsed.href;
  } catch {
    return '';
  }
}

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

describe('isValidUrl', () => {
  it('accepts valid http URLs', () => {
    expect(isValidUrl('http://example.com')).toBe(true);
  });

  it('accepts valid https URLs', () => {
    expect(isValidUrl('https://example.com/path?q=1')).toBe(true);
  });

  it('rejects empty strings', () => {
    expect(isValidUrl('')).toBe(false);
  });

  it('rejects plain text', () => {
    expect(isValidUrl('not a url')).toBe(false);
  });

  it('rejects javascript: URIs', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
  });

  it('rejects data: URIs', () => {
    expect(isValidUrl('data:text/html,<script>alert(1)</script>')).toBe(false);
  });
});

describe('sanitizeUrl', () => {
  it('returns href for valid https URLs', () => {
    expect(sanitizeUrl('https://example.com')).toBe('https://example.com/');
  });

  it('returns href for valid http URLs', () => {
    expect(sanitizeUrl('http://example.com/path')).toBe('http://example.com/path');
  });

  it('returns empty string for javascript: URIs (XSS prevention)', () => {
    expect(sanitizeUrl('javascript:alert(document.cookie)')).toBe('');
  });

  it('returns empty string for data: URIs', () => {
    expect(sanitizeUrl('data:text/html,<h1>XSS</h1>')).toBe('');
  });

  it('returns empty string for invalid URLs', () => {
    expect(sanitizeUrl('not-a-url')).toBe('');
  });

  it('trims whitespace', () => {
    expect(sanitizeUrl('  https://example.com  ')).toBe('https://example.com/');
  });
});
