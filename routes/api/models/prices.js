var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * People Model
 * ==========
 */
var Pricing = new keystone.List('Pricing');

Pricing.add({
    characters: {type: String },
    size: {type: String },
    price: {type: String }
});

Pricing.defaultColumns = 'characters, size, price';

/**
 * Registration
 */
Pricing.register();