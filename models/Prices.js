var keystone = require('keystone');

// Pass your keystone instance to the module
var restful = require('restful-keystone')(keystone);

exports = module.exports = function( app ){
  //Explicitly define which lists we want exposed
  restful.expose({
    Gallery : true
  }).start();
}