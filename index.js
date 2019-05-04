#!/usr/bin/env node

const clear = require('clear');
const figlet = require('figlet');
const chalk = require('chalk');

const app = require('./bin/app');


clear();
console.log(
   chalk.blue(
      figlet.textSync('ginit', { horizontalLayout: 'full' })
   )
);

const main = async() => {

   await app()

}

main()