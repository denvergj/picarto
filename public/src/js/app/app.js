Dropzone.autoDiscover = false;

$(function(){
	
	if($(window).width() >= 1263) {
		$('.pic1, .pic2').qbeforeafter({defaultgap:100, leftgap:0, rightgap:0, caption: false, reveal: 0.5});
	} else {
		$(document).on('click','.changeImage',function(){
			var txt = $(this).parent().children('img.original').is(':visible') ? 'View Original' : 'View Painted';
			$(this).parent().children('img.original').toggle();
			$(this).parent().children('img.new').toggle();
			$(this).text(txt);
		});  
	}
	
	$('select').selectric(); 
	$('input').iCheck({
		checkboxClass: 'icheckbox_square-blue',
	    radioClass: 'iradio_square-blue', 
	    increaseArea: '20%' // optional
	});
	
	$(document).on('click','.hamburger',function(e){
		$(this).toggleClass('is-active');
		$('.popupmenu').toggleClass('is-active'); 
	});
	
	if($('#myPictures').length > 0) {
		var myDropzone = new Dropzone(document.getElementById('myPictures'), {
	    	uploadMultiple: false,
	    	acceptedFiles:'.jpg,.png,.jpeg,.gif',
	    	parallelUploads: 6,
	    	url: 'https://api.cloudinary.com/v1_1/cloud9/image/upload',
	    	addRemoveLinks: true
	    });
	    
	    myDropzone.on('sending', function (file, xhr, formData) {
			formData.append('api_key', 494561111212487);
			formData.append('timestamp', Date.now() / 1000 | 0);
			formData.append('upload_preset', 'enquiry');
		});
		myDropzone.on('success', function (file, response) {
			file.serverId = response.version;
			$(".dz-preview:last-child").attr('id', "document-" + file.serverId);
			$('#document-'+file.serverId).append('<input type="hidden" name="enquiryImages[]" value="'+response.secure_url+'" />');
			$('#myPictures .required-photos').remove();
		});
	}
    
    $('#medium-config input').on('ifChecked', function(event){
	    $('#medium .value').text(event.target.value);
	});
	$('#colour-config input').on('ifChecked', function(event){
	    $('#colour .value').text(event.target.value);
	});
	$('#editing-config input').on('ifChecked', function(event){
	    $('#editing .value').text(event.target.value);
	});
	$('#background-config input').on('ifChecked', function(event){
	    $('#background .value').text(event.target.value);
	});
    
    $("#size-config select, #number-of-characters-config select").selectric().on("change",function(){
  	
  		var numberCharacters = $('#number-of-characters-config select');
  		var sizeValue = $('#size-config select');
  		
  		if($(this).attr('id') == 'characters') {
	  		$('#characters .value').text(numberCharacters.parent().parent().find('.label').text());
  		} else {
	  		$('#size .value').text(sizeValue.parent().parent().find('.label').text());
	  		
	  		if(sizeValue.val() == '16x20'){
		  		$('select#characters').html("<option value='0'>0</option><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option>");
	  		} else if(sizeValue.val() == '20x24') {
		  		$('select#characters').html("<option value='0'>0</option><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option>");
	  		} else {
		  		$('select#characters').html("<option value='0'>0</option><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option>");
	  		}
	  		
	  		// Refresh Selectric
		    $('select#characters').selectric('refresh');
  		}
  		
  		// Get editing value.
  		$editing = $('#editing-config input:checked').val();
  		
  		$.ajax({
	        url: "/api/pricing/",
	        type: "post",
	        data: {
	        	characters: numberCharacters.val(),
	        	size: sizeValue.val(),
	        	editing: $editing
		    },
	        success: function(data) {
		        if(data !== 'not found') {
			        $('#total .value').text('$'+data.pricing.price);
		        }  
	        }
	    });
  		
  	});
    
    $(document).on('click','.title .info',function(){
		$(this).parent().find('span').toggle();
	});
	
	$(document).on('click','.view-order #total',function(){
		$('.order-summary,.view-order #total .close, .view-order #total .value, .view-order #total .title').toggle();
	});
	
	$(document).on('click','#checkout',function(e){
		e.preventDefault();
		if($('.dz-success').length > 0) {
			
			$uploadedImage = $('#myPictures input').val();
			
			$('#order-page,#checkout').hide();
			$('#checkout-page').show();
			$('body').addClass('checkout-page');
			$('#myPictures .required-photos,.order-summary img').remove();
			$('<img src="'+$uploadedImage+'"/>').insertAfter('.order-summary .mobile#total');
		} else {
			$('#myPictures').append('<div class="required-photos">Please remember to add an image</div>');
			$('html, body').animate({
		        scrollTop: $('#myPictures').offset().top
		    }, 500);  
		}
	});
	
	$(document).on('click','#go-back',function(e){
		e.preventDefault();
		$('#order-page,#checkout').show();
		$('#checkout-page').hide();
		$('body').removeClass('checkout-page');
	});
	
	$(document).on('click','.sectors.valid .title',function(e){
		$(this).parent().find('.details').toggle();
	});
	
	
	// Fixed editing price.
	$('#editing-config input').on('ifChecked', function(event){
	 	$editingValue = $(this).val();
	 	
	 	$currentPrice = $('#total .value').text().replace('$','');
	 	if($editingValue == 'Yes') {
		 	$totalVal = parseInt($currentPrice) + 70;
		 	$('#total .value').text('$'+$totalVal);
	 	} else {
	 		$totalVal = parseInt($currentPrice) - 70;
		 	$('#total .value').text('$'+$totalVal);
	 	}
	});
	
	/******
	*
	* Functionality for stepping through the checkout form.
	*
	**********/
	$(document).on('click','.actions .continue',function(e){
		e.preventDefault();
		var $stepGroup = $(this).parent().parent().parent();
		var $nextStepGroup = $('#'+$(this).attr('data-next'));
		$(this).parent().parent().find("input[type=text]").each(function() {
			$(this).parent().find('.required').remove();
			if($(this).hasClass('needed')) {
	            if(this.value == '') {
		            $stepGroup.removeClass('valid');
	               $('<div class="required">This field is required</div>').insertAfter($(this));
	            } else {
		            $(this).parent().find('.required').remove();
	            }
            }
        });
        if($stepGroup.find('.required').length < 1) {
	        $stepGroup.find('.details').hide();
	        $stepGroup.addClass('valid');
	        if($stepGroup.attr('id') == 'billing-details') {
		        if($('input#delivery-same').iCheck('update')[0].checked) {
			        $(this).parent().parent().find("input[type=text]").each(function(i,val) {
				        i++;
						$('#delivery-details input#copy'+i).val($(this).val());
			        });
		        }
	        }
	        $nextStepGroup.find('.details').show();
	        $('html, body').animate({
		        scrollTop: $nextStepGroup.offset().top
		    }, 500); 
        } else {
	        $('html, body').animate({
		        scrollTop: $stepGroup.offset().top
		    }, 500);  
        }
	});
	
	/******
	*
	* Functionality for adding regions to countries.
	*
	**********/
	$("#billing-country, #delivery-country").selectric().on("change",function(){
  	
  		var countryCode = $(this).val();
  		
  		// Populate country select box from battuta API
	    var url = "https://battuta.medunes.net/api/region/"+countryCode+"/all/?key=43d14e0faafa38c93811e42838c0ef57&callback=?";
  		$.getJSON(url,function(regions)
  		{
  			$("#billing-region option,#delivery-country option").remove();
		    //loop through regions..
		    $.each(regions,function(key,region)
		    { 
		        $("<option></option>")
		         				.attr("value",region.region)
		         				.append(region.region)
		                     	.appendTo($("#billing-region,#delivery-country"));
		    });
		   // Refresh Selectric
		   $('#billing-region,#delivery-country').selectric('refresh');
	    }); 
  	});
	
	
	/******
	*
	* Functionality for making payments.
	*
	**********/
	var publicStripeApiKey = 'pk_test_f2WSBbW3G918SlJvC9lCtgBk';
	var publicStripeApiKeyTesting = 'pk_test_f2WSBbW3G918SlJvC9lCtgBk';
	
	Stripe.setPublishableKey(publicStripeApiKeyTesting);
	
	function stripeResponseHandler (status, response) {
		
		if (response.error) {
			$('#ordering').removeClass('processing');
			$('#error').text(response.error.message);
			return;
		}
		
		var form = $("#ordering form");
		form.append("<input type='hidden' name='stripeToken' value='" + response.id + "'/>");
		
		$.post(
			'/api/pay',
			form.serialize(),
			function (status) {
				if(status == 'order_created') {
					window.location = '/order/complete/';
				}
			  if (status != 'ok') {
			    console.log(status);
			  } else {
			    console.log(status);
			  }
			}
		);
		
		//$('#ordering').removeClass('processing');
	}
	
	
	function validateEmail(email) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}
	
	$("#mc-embedded-subscribe-form").submit(function(event) {
	 	
	  	var $emailAddress = $('#mce-EMAIL').val();
	  	$('#registered').remove();
	  	
	  	if($emailAddress == '' || !validateEmail($emailAddress)) {
		   $('<div id="registered" class="error">Incorrect email address</div>').insertAfter('#mc-embedded-subscribe-form');
	  	} else {
  	        
	  	    // Attempt to signup user.
		    $.ajax({
				url: "/api/newsletterSignup/",
				type: "POST",
				data: {
					emailAddress: $emailAddress
				},
				success: function(data) {
				   $('<div id="registered">Congratulations you have signed up!</div>').insertAfter('#mc-embedded-subscribe-form');
				}
		    });
	    }
	  
		// prevent the form from submitting with the default action
		return false;
	});
	
	
	$("#ordering form").submit(function(event) {
	 	
	  	var numberCharacters = $('#number-of-characters-config select').val();
	  	var sizeValue = $('#size-config select').val();
  	    
  	    $('#ordering').addClass('processing');
  	    
  	    // Get editing value.
  		$editing = $('#editing-config input:checked').val();
  	    
  	    // Get the price for the order.
	    $.ajax({
			url: "/api/pricing/",
			type: "POST",
			data: {
				characters: numberCharacters,
				size: sizeValue,
				editing: $editing
			},
			success: function(data) {
			    if(data !== 'not_found') {
				    $("#ordering form input[name='stripeAmount']").remove();
				    $("#ordering form").append("<input type='hidden' name='stripeAmount' value='" + data.charge.price + "'/>");
			        Stripe.createToken({
					    number: $('input[name="card-number"]').val(),
					    cvc: $('input[name="card-cvc"]').val(),
					    exp_month: $('input[name="card-exp-month"]').val(),
					    exp_year: $('input[name="card-exp-year"]').val()
					}, data.charge.price, stripeResponseHandler);
			    }  
			}
	    });
	  
	  // prevent the form from submitting with the default action
	  return false;
	});
	
	
	$(window).scroll(function() { 
        if ($(window).scrollTop() > 51) {
            $('.order-summary').addClass('hittop');
        } else {
            $('.order-summary').removeClass('hittop');
        }
    });
    
});   