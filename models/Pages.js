var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var pages = new keystone.List('pages', {
    map: { name: 'title' },
    autokey: { path: 'slug', from: 'title', unique: true }
});

pages.add({
    title: { type: String, required: true },
    state: { type: Types.Select, options: 'draft, published, archived', default: 'published', index: true },
    author: { type: Types.Relationship, ref: 'User', index: true },
    publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
    image: { type: Types.CloudinaryImage, dest: 'public/uploads'},
    content: {
        brief: { type: Types.Html, wysiwyg: true, height: 150 },
        extended: { type: Types.Html, wysiwyg: true, height: 400 }
    },
});

pages.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief;
});

pages.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
pages.register();
