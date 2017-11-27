var keystone = require('keystone');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'orders';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	
	view.on('init', function (next) {

		var q = keystone.list('pages').paginate()
            .where('state', 'published')
            .where('slug', 'order-now')
            .sort('-publishedDate');
        q.exec(function(err, results) {
			locals.title = results.results[0].tabTitle;
            next(err);
        });
	});

	view.render('order');
};

exports.complete = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'orders';
	locals.formData = req.body || {};
	locals.validationErrors = {};
	
	view.on('init', function (next) {

		var q = keystone.list('pages').paginate()
            .where('state', 'published')
            .where('slug', 'order-now')
            .sort('-publishedDate');
        q.exec(function(err, results) {
			locals.title = results.results[0].tabTitle;
            next(err);
        });
	});

	view.render('order-complete');
}