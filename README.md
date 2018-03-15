# Big Lottery Fund Dashboard

<img width="1438" alt="screen shot 2017-12-21 at 16 48 26" src="https://user-images.githubusercontent.com/123386/34265778-dd4e564e-e66e-11e7-810b-bf758bc21646.png">

Dashboard app for displaying: Github status, app server statuses, CMS server statuses, and performance metrics.

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
// ElasticBeanstalk app name
CMS_APP_NAME=
// Github access token to avoid rate-limiting, basic access only
GITHUB_ACCESS_TOKEN=
// Google pagespeed API key
PAGESPEED_API_KEY=
```

Run the app

```
npm start
```
