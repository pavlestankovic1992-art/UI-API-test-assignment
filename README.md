## Run API Tests

cd API-Tests
npm install
npx playwright test


##Run UI Tests

cd UI-Tests
npm install
npx wdio run wdio.conf.ts

* UI test follow the Page Object pattern
* API tests validate response structure and internal consistency
* Test are designed to reflect real user bahaivior and API usage
