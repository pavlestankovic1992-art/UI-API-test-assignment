import { test, expect, request as pwRequest } from '@playwright/test';
import { ADDRESSES, NETWORK, CURRENCY } from './constants';

type AnyObj = Record<string, any>;

function pickFirstNumber(obj: AnyObj, paths: string[]): number | undefined {
  for (const p of paths) {
    const val = p.split('.').reduce<any>((acc, k) => (acc ? acc[k] : undefined), obj);
    if (typeof val === 'number' && Number.isFinite(val)) return val;
  }
  return undefined;
}


test('POST /v2/portfolio/balances (both addresses) + cross-check vs Scenario 1 totals', async ({ request }) => {
  const pubkeys = ADDRESSES.map(a => `1${a}`);

  const balancesRes = await request.post('/v2/portfolio/balances', {
    data: { pubkeys, currency: CURRENCY, general: true, network: NETWORK },
  });
  expect(balancesRes.ok()).toBeTruthy();

  const balancesJson = (await balancesRes.json()) as AnyObj;

  expect(typeof balancesJson.netWorth).toBe('number');
  expect(Array.isArray(balancesJson.data)).toBeTruthy();
  expect(balancesJson.data.length).toBe(pubkeys.length);

  const perWalletNetWorthSum = (balancesJson.data as AnyObj[]).reduce((sum, item) => {
    const v = pickFirstNumber(item, ['netWorth', 'value.total', 'value']) ?? 0;
    return sum + v;
  }, 0);

  expect(balancesJson.netWorth).toBeCloseTo(perWalletNetWorthSum, 2);

  const totals = await Promise.all(
    ADDRESSES.map(async address => {
      const r = await request.get(`/v3/portfolio/tokens/${address}`, { params: { network: NETWORK } });
      expect(r.ok(), `Tokens HTTP ${r.status()} for ${address}`).toBeTruthy();

      const j = (await r.json()) as AnyObj;
      return (
        pickFirstNumber(j, ['value.total', 'value', 'tokensValue.total', 'stocksValue.total']) ?? 0
      );
    })
  );

  const scenario1Sum = totals.reduce((a, b) => a + b, 0);
  expect(balancesJson.netWorth).toBeCloseTo(scenario1Sum, 2);
});

test('Scenario 2 - Balances (negative) - No Authorization -> 403', async ({}, testInfo) => {
  const api = await pwRequest.newContext({
    baseURL: testInfo.project.use.baseURL as string,
    extraHTTPHeaders: { 'Content-Type': 'application/json' }, 
    // no Authorization on purpose
  });

  const res = await api.post('/v2/portfolio/balances', {
    data: {
      pubkeys: ADDRESSES.map(a => `1${a}`),
      currency: CURRENCY,
      general: true,
      network: NETWORK,
    },
  });

  expect(res.status()).toBe(403);
  await api.dispose();
});

test('Scenario 2 - Balances (negative) - Invalid network -> 4xx', async ({ request }) => {
  const res = await request.post('/v2/portfolio/balances', {
    data: {
      pubkeys: ADDRESSES.map(a => `1${a}`),
      currency: CURRENCY,
      general: true,
      network: 'invalid_network',
    },
  });

  expect(res.status()).toBeGreaterThanOrEqual(400);
  expect(res.status()).toBeLessThan(500);
});
