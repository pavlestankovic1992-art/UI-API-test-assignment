## API Tests – Solflare

## Tech Stack
- Playwright Test (API testing)
- TypeScript
- Node.js

## Scenarios

### 1. Tokens
- **GET** `/v3/portfolio/tokens/{address}`
- Validates:
  - Response structure
  - Internal consistency (`value.total = tokensValue.total + stocksValue.total`)
  - Handles empty wallets
- Negative cases:
  - No authorization → 403
  - Invalid network → 4xx
  - Invalid address → 4xx

### 2. Balances
- **POST** `/v2/portfolio/balances`
- Validates:
  - Response structure
  - `netWorth` equals the sum of per-wallet values
  - Supports multiple addresses in one request
- Negative cases:
  - No authorization → 403
  - Invalid network → 4xx

## Run
npm install
npx playwright test