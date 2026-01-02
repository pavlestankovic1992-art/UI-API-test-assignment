## Run API tests

```bash
cd API-Tests
npm install
npx playwright test
```

## Run UI Tests

```bash
cd UI-Tests
npm install
npx wdio run wdio.conf.ts
```

- UI tests follow the Page Object pattern
- API tests validate response structure and internal consistency
- Tests are designed to reflect real user behavior and API usage
