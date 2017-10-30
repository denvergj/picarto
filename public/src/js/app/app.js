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
	});
    
    
    $(document).on('click','.title .info',function(){
		$(this).parent().find('span').toggle();
	});
	
	$(document).on('click','.view-order #total',function(){
		$('.order-summary,.view-order #total .close, .view-order #total .value, .view-order #total .title').toggle();
	});
	
	$(document).on('click','#checkout',function(e){
		e.preventDefault();
		$('#order-page').hide();
		$('#checkout-page').show();
	});
	
	$(document).on('click','#go-back',function(e){
		e.preventDefault();
		$('#order-page').show();
		$('#checkout-page').hide();
	});
	
	$(document).on('click','.sectors.valid .title',function(e){
		$(this).parent().find('.details').toggle();
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
			        $(this).parent().parent().find("input[type=text]").each(function() {
						$('#delivery-details input').val(this.value);
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
	
	$("#billing-country, #delivery-country").selectric().on("change",function()
  	{
  	
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
	
	$(window).scroll(function() { 
        if ($(window).scrollTop() > 51) {
            $('.order-summary').addClass('hittop');
        } else {
            $('.order-summary').removeClass('hittop');
        }
    });
    
});   