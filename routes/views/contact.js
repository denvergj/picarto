var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'contact';
	locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;
	
	locals.data = {
        contact: []
    };
	
	view.on('init', function(next) {

       var q = keystone.list('pages').paginate()
            .where('state', 'published')
            .where('slug', 'contact')
            .sort('-publishedDate');
        q.exec(function(err, results) {
	      //  locals.data.contact = results;
			locals.title = results.results[0].tabTitle;
           // next(err);
        });
        
        var a = keystone.list('pages').paginate()
            .where('state', 'published')
            .where('slug', 'home')
            .sort('-publishedDate');
        a.exec(function(err, results) {
	        locals.data.contact = results;
            next(err);
        });
		
    });

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {

		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);
		
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

	view.render('contact');
};
