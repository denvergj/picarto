var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'orders';
	locals.formData = req.body || {};
	locals.validationErrors = {};

	view.render('order');
};