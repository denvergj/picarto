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
	orderId: { type: String, required: true },
	image: { type: Types.TextArray },
	medium: { type: String, required: true },
	colour: { type: String, required: true },
	size: { type: String, required: true },
	characters: { type: String, required: true },
	editing: { type: String, required: true },
	editingNotes: { type: String },
	background: { type: String, required: true },
	billingFirstName: { type: String, required: true },
	billingLastName: { type: String, required: true },
	billingEmail: { type: String, required: true },
	billingTelephone: { type: String, required: true },
	billingAddressOne: { type: String, required: true },
	billingAddressTwo: { type: String },
	billingCity: { type: String, required: true },
	billingPostCode: { type: String, required: true },
	billingCountry: { type: String, required: true },
	billingRegionState: { type: String, required: true },
	deliveryFirstName: { type: String, required: true },
	deliveryLastName: { type: String, required: true },
	deliveryEmail: { type: String, required: true },
	deliveryTelephone: { type: String, required: true },
	deliveryAddressOne: { type: String, required: true },
	deliveryAddressTwo: { type: String },
	deliveryCity: { type: String, required: true },
	deliveryPostCode: { type: String, required: true },
	deliveryCountry: { type: String, required: true },
	deliveryRegionState: { type: String, required: true },
	specialRequests: { type: String },
	createdAt: { type: Date, default: Date.now }
});

Orders.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Orders.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
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

	var order = this;
	var brand = keystone.get('brand');

	console.log(order);

	// Send email to site admin.
	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);
		new keystone.Email({
			templateName: 'order-received',
			transport: 'mailgun',
		}).send({
			to: admins,
			from: {
				name: 'Picarto',
				email: 'service@picarto.com',
			},
			subject: 'Picarto - New Order',
			order: order,
			brand: brand,
			layout: false,
		}, callback);
	});
	
	// Send order received email to customer.
	new keystone.Email({
		templateName: 'order-received-customer',
		transport: 'mailgun',
	}).send({
		to: order.deliveryEmail,
		from: {
			name: 'Picarto',
			email: 'service@picarto.com',
		},
		subject: 'Picarto - We have received your order',
		order: order,
		brand: brand,
		layout: false,
	}, callback);
};

Orders.defaultSort = '-createdAt';
Orders.defaultColumns = 'deliveryFirstName, billingLastName, deliveryEmail, createdAt';
Orders.register();