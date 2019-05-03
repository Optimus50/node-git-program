#!/usr/bin/env node

'use strict';

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const github = require('.lib/github');
const repo = require('./lib/repo');
const files = require('./lib/files');

clear();
console.log(
   chalk.yellow(
      figlet.textSync('Gitnit', { horizontalLayput: 'full' })
   )
);

//check for a git repo
if (files.directoryExists('.git')) {
   console.log(chalk.red('Already a git repository!'));
   process.exit();
}

const getGithubtoken = async() => {
   //Fetch token from config store
   let token = github.getStoredGithubToken();
   if (token) {
      return token;
   }
   //No token found, use credentials to access github account
   await github.setGithubCredentials();

   //Check if access token for ginit was registered
   const accessToken = await github.hasAccedssToken();
   if (accessToken) {
      console.log(chalk.yellow('An existing access token has been found'));

      //ask user to regenerate a new token
      token = await github.regenerateNewToken();
      return token;
   }
}