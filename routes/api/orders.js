var keystone = require('keystone');

var Orders = keystone.list('Orders');

var stripeApiKey = "pk_live_3FEb8LMmyTB8RLuNvi4o8bbq";
var stripeApiKeyTesting = "sk_live_Cmde6Gkp5WvmRsbdx3lM46yv";

/*
var stripeApiKey = "pk_test_f2WSBbW3G918SlJvC9lCtgBk";
var stripeApiKeyTesting = "sk_test_fukZ8OeJjpS66nL7T8owpCq2";
*/

var stripe = require('stripe')(stripeApiKeyTesting);

function orderNumGen(len){
    var text = " ";
    
    var charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    
    for( var i=0; i < len; i++ )
        text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
}

/**
 * 
 * Find price by characters and size.
 *
 **/
exports.pay = function(req, res) {

  var orderModel = new Orders.model(),
       data = (req.method == 'POST') ? req.body : req.query;
       
   // Detect whether token is array or not.
   if (req.body.stripeToken instanceof Array) {
       var stripeTokenArray = data.stripeToken;
       var stripeToken = stripeTokenArray[stripeTokenArray.length - 1];
   } else {
	   var stripeToken = data.stripeToken;
   }
   
   var orderId = orderNumGen(5);
   		
   	// TESTING LIVE CARDS.	
    if(!req.user) {
		var chargeAmount = data.stripeAmount * 100;
	} else {
		var chargeAmount = 100;
	}
   
	// Attempt to charge the card.
	stripe.charges.create({
	  amount: chargeAmount,
	  currency: "AUD",
	  source: stripeToken,
	  metadata: {order_id: orderId},
	  description: "Charge for Order ID:"+orderId 
	}, function (err, charge) {
		if (err) {
		  res.send("Error while processing your payment: "+ err);
		} else {
		  
			// Card has been charged. Now create the order.	
			orderModel.set({
				orderId: orderId,
				image: data.enquiryImages,
				medium: data.medium,
				colour: data.colour,
				size: data.size,
				characters: data.characters,
				editing: data.editing,
				editingNotes: data.editingNotes,
				background: data.background,
				billingFirstName: data.billingFirstName,
				billingLastName: data.billingLastName,
				billingEmail: data.billingEmail,
				billingTelephone: data.billingTelephone,
				billingAddressOne: data.billingAddressOne,
				billingAddressTwo: data.billingAddressTwo,
				billingCity: data.billingCity,
				billingPostCode: data.billingPostCode,
				billingCountry: data.billingCountry,
				billingRegionState: data.billingRegionState,
				deliveryFirstName: data.deliveryFirstName,
				deliveryLastName: data.deliveryLastName,
				deliveryEmail: data.deliveryEmail,
				deliveryTelephone: data.deliveryTelephone,
				deliveryAddressOne: data.deliveryAddressOne,
				deliveryAddressTwo: data.deliveryAddressTwo,
				deliveryCity: data.deliveryCity,
				deliveryPostCode: data.deliveryPostCode,
				deliveryCountry: data.deliveryCountry,
				deliveryRegionState: data.deliveryRegionState,
				specialRequests: data.specialRequests
			});
			orderModel.save(function(err) {
				// post has been saved	
				if(err) {
					res.send(err);
				} else {
					res.send("order_created");
				}
			});
			
		}
	});

}