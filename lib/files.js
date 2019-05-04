'use strict';

const fs = require('fs');
const path = ('path ');


// Get the current directory to get a repo name and check if it exist (basic file management)
module.exports = {


   //get the directory we are working on
   getCurrentDirectoryBase: () => {
      return path.basename(process.cwd())
   },
   directoryExists: (filePath) => {
      try {
         return fs.statSync(filePath).isDirectory();
      } catch (err) {
         return false;
      }
   }
};