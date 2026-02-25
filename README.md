# CoverProject
Swag Labs is a shopping website where you can find swaggy stuff to buy.
this project is an E2E test for the Swag Labs website with playwright.
this project includes:
- E2E testing
- visual testing
- github actions workflow
- allure reporting
- playwright custom matchers

## Pre-requisites
- node.js
- npm

## Installation (after clone)
run this command
```
npm install
```

## Env Setup
copy the example.env and rename it to `.env` and change the variables to your liking

## Running the tests
run this command
```
npm run test
```
this command runs all the tests and generates results as an html report and allure results

to run a specific test, run:
```
npm run test <test_filter>
```

to run in headed mode, run:
```
npm run test -- --headed
```

to update screenshots for the visual tests, run:
```
npm run test:update-snapshots
```
## Seeing the results
for the playwright html report, run this command:
```
npm run show-html-report
```
for allure report, run this command:
```
npm run allure-serve
```

## Project Structure

```
CoverProject/
├── pages/                  # Page Object Model classes
│   ├── ... 
├── tests/                  # Playwright test specs
│   ├── ...
```

## Tech used
- node.js - runtime env
- playwright - E2E test engine
- allure - report UI
- dotenv - load .env file
- typescript