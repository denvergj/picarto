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
    
    
});   