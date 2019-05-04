const inquirer = require('inquirer');
const files = ('files');
/****
  This module prompts the users for  for their GitHub credentials  and stores the OAuth token for subsequent requests.
  It is the command line user interaction implementation
 
 */
module.exports = {
   // get github credentials from user
   askGithubCredentials: () => {
      const questions = [{
            name: 'username',
            type: 'input',
            message: ' Enter your Github username or e-mail address',

            validate: (value) => {
               if (value.length) {
                  return true;
               } else {
                  return 'Please enter your username or e-mail address';
               }
            }
         },
         {
            name: 'password',
            type: 'password',
            mesage: ' Enter your password',
            validate: (value) => {
               if (value.length) {
                  return true;
               } else {
                  return ' Please enter your password';
               }
            }
         }
      ];
      return inquirer.prompt(questions);
   },
   // regenerate user token
   askRegeneratedToken: () => {
      const questions = [{
         name: 'toke',
         type: 'input',
         message: 'Enter your new regenerated token :',
         validate: (value) => {
            if (value.length) {
               return true
            } else {
               return 'please enter your new regenerated token: .';
            }
         }
      }];
      return inquirer.prompt(questions);
   },
   // get repo details
   askRepoDetails: () => {
      const argv = require('minimist')(process.argv.slice(2))
      const questions = [{
            type: 'input',
            name: 'name',
            message: 'Enter a name for the repository',
            default: argv._[0] || files.getCurrentDirectoryBase(),
            validate: (value) => {
               if (value.length) {
                  return true;
               } else {
                  return 'Please enter a name for the repository';
               }
            }
         },
         {
            type: 'input',
            name: 'description',
            default: argv._[1] || null,
            message: 'Optionally enter a description of the repository: '
         },
         {
            type: ' list',
            name: 'visibility',
            message: 'public or private',
            choices: ['public', 'private'],
            default: 'public'
         }
      ];
      return inquirer.prompt(questions);
   },
   //git ignore file

   askIgnoreFiles: (filelist) => {
      const questions = [{
         type: 'checkbox',
         name: 'ignore',
         message: 'Select the files and folders you wish to ignore',
         choices: 'filelist',
         default: ['node_modules', 'bower_components']
      }];
      return inquirer.prompt(questions);

   }
};