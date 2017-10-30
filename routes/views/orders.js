var keystone = require('keystone');
var Orders = keystone.list('Orders');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'orders';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {

		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);
		
		console.log(req.body);
		
		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, enquiryType, enquiryImages, message',
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});
	});

	view.render('order');
};