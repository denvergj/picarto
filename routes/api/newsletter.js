var keystone = require('keystone');

var DOMAIN = 'mailing.picarto.co';
var mailgun = require('mailgun-js')({ apiKey: "key-c8e084a87dde4c8b06181b0b209c577f", domain: DOMAIN });

/**
 * 
 * Enter into newsletter list.
 *
 */
exports.signup = function(req, res) {
 
 	var list = mailgun.lists(`newsletter@${DOMAIN}`);
 	
 	console.log();
 	
	var requestUser = {
	  subscribed: true,
	  address: req.body.emailAddress
	};
	
	list.members().create(requestUser, function (error, data) {
	  res.send(data);
	});
	
}