const octokit = require('@octokit/rest')();
const Configstore = require('configstore');
const pkg = require('../package.json');
const _ = require('lodash');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const chalk = require('chalk');
const inquirer = require('./inquirer');
const conf = new Configstore(pkg.name);

module.exports = {
   // Get  credentials and use to connect to github
   getInstance: () => {
      return octokit;
   },

   //set github credentials
   setGithubCredentials: async() => {
      const credentials = await inquirer.askGithubCredentials();
      octokit.authenticate(
         _.extend({
               type: 'basic',
            },
            credentials
         ));
   },

   // Register for the new token 
   registerNewToken: async() => {
      const status = new Spinner('Authenticating you, please wait...');
      status.start();
      try {
         const response = await octokit.authorization.create({
            scopes: ['user', 'public_repo', 'repo', 'repo:status'],
            note: 'ginits, the command-line tool for initializing Git repos'
         });
         const token = response.data.token;
         if (token) {
            conf.set('github.token', token);
            return token;
         } else {
            throw new Error('Missing Token', 'Github token was not found in the response');
         }
      } catch (err) {
         throw err;
      } finally {
         status.stop();
      }
   },
   //Authenticate
   githubAuth: (token) => {
      octokit.authenticate({
         type: 'oauth',
         token: token
      });
   },
   //Store the token
   getStoredGithubToken: () => {
      return conf.get('github.token')
   },
   //check if the token has access
   hasAccessToken: async() => {
      const status = new Spinner('Authenticating you, please wait...');
      status.start();
      try {
         const response = await octokit.authorization.getAll();
         const accessToken = _.find(response.data, (row) => {
            if (row.note) {
               return row.note.indexOf('ginit') !== -1;
            }
         });
         return accessToken;
      } catch (err) {
         throw err;
      } finally {
         status.stop();
      }
   },

   //Use the id to regenerate new token from github 
   regenerateNewToken: async(id) => {
      const tokenUrl = 'https://github.com/settings/tokens' + id;
      console.log('Please visit' + chalk.underline.blue.bold(tokenUrl) + ' and click the ' + chalk.red.bold('Regenerate Token Button. \n'));
      const input = await inquirer.askRegeneratedToken();
      if (input) {
         conf.set('github.token', input.token);
         return input.token;
      }
   }
};