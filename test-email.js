var Email = require('keystone-email');

new Email('test-email', { 
  transport: 'mailgun',
}).send({},{
  apiKey: 'key-c8e084a87dde4c8b06181b0b209c577f',
  domain: 'sandbox87829617c76042dbb51d03987729483c.mailgun.org',
  to: 'denver@matterhorndigital.com.au',
  from: {
    name: 'Picarto',
    email: 'service@picarto.co',
  },
  subject: 'Your first KeystoneJS email',
}, function (err, result) {
  if (err) {
    console.error('Mailgun test failed with error:\n', err);
  } else {
    console.log('Successfully sent Mailgun test with result:\n', result);
  }
});