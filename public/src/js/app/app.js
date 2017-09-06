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
	
/*
	
	var myDropzone = new Dropzone(document.getElementById('dropzone-area'), {
    	uploadMultiple: false,
    	acceptedFiles:'.jpg,.png,.jpeg,.gif',
    	parallelUploads: 6,
    	url: 'https://api.cloudinary.com/v1_1/cloud9/image/upload'
    });
*/
	
	
});   