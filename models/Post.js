var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Post.add({
	title: { type: String, required: true },
	state: { type: Types.Select, options: 'draft, published', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	featuredImage: { type: Types.CloudinaryImage },
	featuredImageAlt: { type: String, initial: false},
	content: {
		text: { type: Types.Html, wysiwyg: true, height: 150 },
		originalImage: { type: Types.CloudinaryImage },
		originalImageAlt: { type: String, initial: false}
	},
	//categories: { type: Types.Relationship, ref: 'PostCategory', many: true },
});

// Format the post date.
Post.schema.virtual('formattedDate').get(function () { 
    return this._.publishedDate.format("MMMM DD, YYYY"); 
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
