var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'home';
    locals.data = {
        home: []
    };
	
    view.on('init', function(next) {

       var q = keystone.list('pages').paginate()
            .where('state', 'published')
            .where('slug', 'home')
            .sort('-publishedDate');
        q.exec(function(err, results) {
            locals.data.home = results;
            next(err);
        });
		
    });
	
    // Render the view
    view.render('index');
};


exports.privacy = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'privacy';
    locals.data = {
        home: []
    };
	
    view.on('init', function(next) {

       var q = keystone.list('privacy').paginate()
            .where('state', 'published')
            .where('slug', 'privacy-policy')
            .sort('-publishedDate');
        q.exec(function(err, results) {
            locals.data.home = results;
            next(err);
        });
		
    });
    
    // Render the view
    view.render('privacy');
}