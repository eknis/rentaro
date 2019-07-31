const config = require(__dirname + '/../config');
const octokit = require('@octokit/rest');
const JiraApi = require('jira-client');
const confluenceApi = require("confluence-api");
const isomorphicFormData = require('isomorphic-form-data');
const isomorphicFetch = require('isomorphic-fetch');
const es6promise = require('es6-promise');
const backlogjs = require('backlog-js');
const client = require(__dirname + '/client');

es6promise.polyfill(); //for backlog-js

const apis = {
  github: {
    api: new octokit(config.github.octo),
    botRepo: config.github.botRepo
  },
  jira: {
    api: new JiraApi(config.jira)
  },
  conflu: {
    api: new confluenceApi(config.confluence)
  },
  backlog: {
    api: new backlogjs.Backlog(config.backlog)
  }
};
apis.github.api.authenticate(config.github.auth);

module.exports = {
  hear : (controller) => {
    const hearClient = new client();
    hearClient.hear(controller, apis);
  }
}
