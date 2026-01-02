import { test, expect, request } from '@playwright/test';
import { ADDRESSES, NETWORK } from './constants';

test.describe('Scenario 1 - Tokens', () => {
  for (const address of ADDRESSES) {
    test(`GET /v3/portfolio/tokens/${address}`, async ({ request }) => {
      const res = await request.get(`/v3/portfolio/tokens/${address}`, {
        params: { network: NETWORK },
      });
      expect(res.ok(), `HTTP ${res.status()}`).toBeTruthy();

      const json = await res.json();

      // Assert: response shape
      expect(json).toBeTruthy();
      expect(Array.isArray(json.tokens)).toBeTruthy();

      // Assert: overall total == tokensValue.total + stocksValue.total
      expect(json.value?.total).toBeCloseTo(
        (json.tokensValue?.total ?? 0) + (json.stocksValue?.total ?? 0),
        6
      );

      // Optional: errors should be empty if present
      if (Array.isArray(json.errors)) {
        expect(json.errors.length).toBe(0);
      }
    });
  }
});

test.describe('Scenario 1 - Tokens (negative)', () => {
  test('No Authorization -> 403', async () => {
    const ctx = await request.newContext({
      baseURL: 'https://wallet-api.solflare.com',
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });

    const res = await ctx.get(`/v3/portfolio/tokens/${ADDRESSES[0]}`, {
      params: { network: NETWORK },
    });

    expect(res.status()).toBe(403);
    await ctx.dispose();
  });

  test('Invalid network -> 4xx', async ({ request }) => {
    const res = await request.get(`/v3/portfolio/tokens/${ADDRESSES[0]}`, {
      params: { network: 'invalidnet' },
    });

    expect(res.ok()).toBeFalsy();
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('Invalid address -> 4xx', async ({ request }) => {
    const res = await request.get(`/v3/portfolio/tokens/123`, {
      params: { network: NETWORK },
    });

    expect(res.ok()).toBeFalsy();
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
