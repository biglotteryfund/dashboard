const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const request = require('request-promise');
const { partition, sortBy } = require('lodash');

AWS.config.update({ region: 'eu-west-1' });

const elasticbeanstalk = new AWS.ElasticBeanstalk();

function fetchAppServerStatus(opts) {
  return request({
    url: `${opts.url}/status`,
    json: true
  }).then(response => {
    return Object.assign({}, opts, {
      response
    });
  });
}

function fetchAppServerStatuses() {
  return Promise.all([
    fetchAppServerStatus({
      title: 'test',
      url: process.env.APP_TEST_ENDPOINT
    }),
    fetchAppServerStatus({
      title: 'live',
      url: process.env.APP_LIVE_ENDPOINT
    })
  ]);
}

function fetchCmsServerStatuses() {
  return elasticbeanstalk
    .describeEnvironments({
      EnvironmentNames: [
        process.env.CMS_LIVE_ENVIRONMENT,
        process.env.CMS_TEST_ENVIRONMENT
      ]
    })
    .promise()
    .then(response => sortBy(response.Environments, 'EnvironmentName'));
}

function fetchGitHubStatuses() {
  const GH_ACCOUNT = 'biglotteryfund';
  const GH_REPO = 'blf-alpha';
  const accessToken = process.env.GITHUB_ACCESS_TOKEN;

  return Promise.all([
    request({
      url: `https://api.github.com/repos/${GH_ACCOUNT}/${GH_REPO}/issues?per_page=100`,
      json: true,
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'Request-Promise'
      }
    }),
    request({
      url: `https://api.github.com/repos/${GH_ACCOUNT}/${GH_REPO}/branches`,
      json: true,
      headers: {
        'Authorization': `token ${accessToken}`,
        'User-Agent': 'Request-Promise'
      }
    })
  ]).then(responses => {
    const [issuesResponse, branches] = responses;
    const [pullRequests, issues] = partition(
      issuesResponse,
      i => i.pull_request
    );

    return {
      issues,
      pullRequests,
      branches
    };
  });
}

router.get('/', function(req, res, next) {
  Promise.all([
    fetchAppServerStatuses(),
    fetchCmsServerStatuses(),
    fetchGitHubStatuses()
  ]).then(results => {
    const [appStatuses, cmsStatuses, githubStatuses] = results;
    const pagespeedKey = process.env.PAGESPEED_API_KEY;
    res.render('index', {
      appStatuses,
      cmsStatuses,
      githubStatuses,
      pagespeedKey
    });
  });
});

module.exports = router;
