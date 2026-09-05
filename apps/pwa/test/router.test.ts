import { describe, it, expect } from 'vitest';
import { parseHash, matchPath } from '../src/router';

describe('parseHash', () => {
  it('defaults to / and splits query', () => {
    expect(parseHash('')).toEqual({ path: '/', query: new URLSearchParams() });
    expect(parseHash('#/inbox?paste=1').path).toBe('/inbox');
    expect(parseHash('#/inbox?paste=1').query.get('paste')).toBe('1');
  });
});
describe('matchPath', () => {
  it('extracts params', () => {
    expect(matchPath('/l/:id', '/l/591:123')).toEqual({ id: '591:123' });
    expect(matchPath('/l/:id', '/inbox')).toBeNull();
    expect(matchPath('/', '/')).toEqual({});
  });
});
