var keystone = require('keystone');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // Init locals
    locals.section = 'pages';
    locals.data = {
        pages: []
    };

    // Load the pages
    view.on('init', function(next) {

        var q = keystone.list('pages').paginate({
                page: req.query.page || 1,
                perPage: 10,
                maxPages: 10
            })
            .where('state', 'published')
            .sort('-publishedDate');
        q.exec(function(err, results) {
            locals.data.pages = results;
            next(err);
        });

    });

    // Render the view
    view.render('pages',locals.data.pages);
};