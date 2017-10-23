var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Orders Model
 * =============
 */

var Orders = new keystone.List('Orders', {
	nocreate: true,
	noedit: true,
});

Orders.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	enquiryType: { type: Types.Select, options: [
		{ value: 'Oil painting', label: 'Oil painting' },
		{ value: 'Another', label: 'Another' },
	] },
	enquiryImages: {type: Types.TextArray},
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now },
});

Orders.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Orders.schema.post('save', function () {
	if (this.wasNew) {
		//this.sendNotificationEmail();
	}
});

Orders.schema.methods.sendNotificationEmail = function (callback) {
	if (typeof callback !== 'function') {
		callback = function (err) {
			if (err) {
				console.error('There was an error sending the notification email:', err);
			}
		};
	}

	if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
		console.log('Unable to send email - no mailgun credentials provided');
		return callback(new Error('could not find mailgun credentials'));
	}

	var enquiry = this;
	var brand = keystone.get('brand');

	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);
		new keystone.Email({
			templateName: 'enquiry-notification',
			transport: 'mailgun',
		}).send({
			to: admins,
			from: {
				name: 'Picarto',
				email: 'contact@picarto.com',
			},
			subject: 'New Enquiry for Picarto',
			enquiry: enquiry,
			brand: brand,
			layout: false,
		}, callback);
	});
};

Orders.defaultSort = '-createdAt';
Orders.defaultColumns = 'name, email, enquiryType, createdAt';
Orders.register();
