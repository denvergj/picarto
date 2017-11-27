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
    tabTitle: { type: String, initial: false },
    state: { type: Types.Select, options: 'draft, published', default: 'published', index: true },
    author: { type: Types.Relationship, ref: 'User', index: true },
    publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
    content: {
        slogan: { type: Types.Html, wysiwyg: true },
        sloganImage: { type: Types.CloudinaryImage, dest: 'public/uploads'},
        sloganImageAlt: { type: String, initial: false},
        introduction: { type: Types.Html, wysiwyg: true },
        paintingExampleText: { type: Types.Html, wysiwyg: true },
    },
    fadedMemoriesImage: { type: Types.CloudinaryImage, dest: 'public/uploads'},
    fadedMemoriesText: { type: Types.Html, wysiwyg: true },
    lovedOnesImage: { type: Types.CloudinaryImage, dest: 'public/uploads'},
    lovedOnesText: { type: Types.Html, wysiwyg: true },
    marriedImage: { type: Types.CloudinaryImage, dest: 'public/uploads'},
    marriedText: { type: Types.Html, wysiwyg: true },
    howDoesItWorkTitle: { type: Types.Html, wysiwyg: true },
    howDoesStep1: { type: Types.Html, wysiwyg: true },
    howDoesStep2: { type: Types.Html, wysiwyg: true },
    howDoesStep3: { type: Types.Html, wysiwyg: true },
    lastMinute: { type: Types.Html, wysiwyg: true },
    madeWithLoveImage: { type: Types.CloudinaryImage, dest: 'public/uploads'},
    madeWithLoveText: { type: Types.Html, wysiwyg: true },
});

pages.schema.virtual('content.full').get(function() {
    return this.content.extended || this.content.brief || this.content.slogan;
});

pages.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
pages.register();