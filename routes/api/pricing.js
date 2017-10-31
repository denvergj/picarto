var keystone = require('keystone');

var Pricing = keystone.list('Pricing');

/**
 * 
 * Find price by characters and size.
 *
 */
exports.list = function(req, res) {
  Pricing.model.findOne({ 'characters': req.body.characters, 'size': req.body.size },'price',function(err, items) {

    if (err) return res.json({ err: err });
    
     if (!items) return res.json('not found');

    res.json({
      pricing: items
    });

  });
}


/**
 * Create another price via the API.
 */
/*
exports.create = function(req, res) {

  var item = new Pricing.model(),
    data = (req.method == 'POST') ? req.body : req.query;

  item.getUpdateHandler(req).process(data, function(err) {

    if (err) return res.json({ error: err });

    res.json({
      pricing: item
    });

  });
}
*/