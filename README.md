# Big Lottery Fund Dashboard

Dasboard app for displaying:

- Github status
- App server statuses
- CMS server statuses
- Performance metrics

## Getting Started

Install dependencies

```
npm install
```

Create a `.env` file with the following values

```
// ELB endpoints
APP_TEST_ENDPOINT=
APP_LIVE_ENDPOINT=
// ElasticBeanstalk environment names
CMS_TEST_ENVIRONMENT=
CMS_LIVE_ENVIRONMENT=
// Github access token to avoid rate-limiting, basic access only
GITHUB_ACCESS_TOKEN=
// Google pagespeed API key
PAGESPEED_API_KEY=
```

Run the app

```
npm start
```
