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
   chalk.red(
      figlet.textSync('Binit', { horizontalLayout: 'full' })
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
   const accessToken = await github.hasAccessToken();
   if (accessToken) {
      console.log(chalk.yellow('An existing access token has been found'));

      //ask user to regenerate a new token
      token = await github.regenerateNewToken();
      return token;
   }
   //no access token found, register one now
   token = await github.registerNewtoken();
   return token;
}

const run = async() => {
   try {
      //retrieve and set Authentication Token
      const token = await getGithubtoken();
      github.githubAuth(token);

      //Create remote repository
      const url = await repo.createRemoteRepo();

      //Create .gitignore file
      await repo.createGitignore();

      //Setup local repository and push to remote
      const done = await repo.setupRepo(url);
      if (done) {
         console.log(chalk.green('All done'));
      }


   } catch (err) {
      if (err) {
         switch (err.code) {
            case 401:
               console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'));
               break;
            case 422:
               console.log(chalk.red('There already exist a remote repository with the same name'));
               break;
            default:
               console.log(err);
         }
      }

   }
}

run();