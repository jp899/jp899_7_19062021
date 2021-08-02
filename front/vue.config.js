const path = require('path');

// Import automatique de fichiers sass généraux dans chaque composant (variables, mixins...)
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: '@import "~@/assets/styles/variables.scss"; @import "~@/assets/styles/mixins.scss";'
      }
    }
  }
};