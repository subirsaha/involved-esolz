
////add class
$(document).on('click','.search_area',function() {
	$( this ).toggleClass( "show" );
});

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip({
        html: true
    });



    $('.crop-img').click(function(){
      $('#cropPhoto').modal('show');
      $('#attachPhoto').modal('hide');
    });

    $('#cropPhoto').on('shown.bs.modal', function(){
      $('body').addClass('modal-open');
    });

    $(document).on('click','.header_part .header-search-wrap input, .header_part .search-cross',function(){
      $('.header_part .search-task').fadeToggle(0);
      $('.header_part .search-cross').fadeToggle(0);
      $('.header_part .header-search-wrap button').fadeToggle(0);
    });
	
	$(document).on('click','.task_hd .header-search-wrap input, .task_hd .search-cross',function(){
      $('.task_hd .search-task').fadeToggle(0);
      $('.task_hd .search-cross').fadeToggle(0);
      $('.task_hd .header-search-wrap button').fadeToggle(0);
    });


});

$(window).on("load",function(){
			
    $(".content").mCustomScrollbar({
        axis:"y",
        theme:"3d",
        scrollInertia:550,
        scrollbarPosition:"outside"
    });

});

//preloader
$(window).load(function() {
	$(window).scrollTop(0);
	$("#status").fadeOut();
	$("#preloader").delay(350).fadeOut("slow");
});
$(window).load(function() {
	$(window).scrollTop(0);
	$("#status_create_task_modal").fadeOut();
	$("#preloader_create_task_modal").delay(350).fadeOut("slow");
});
/////calender

//$(function() {
//	$( ".datepicker" ).datepicker( $.datepicker.regional[ "fr" ] );
//	$( "#locale" ).change(function() {
//	$( ".datepicker" ).datepicker( "option",
//	$.datepicker.regional[ $( this ).val() ] );
//	});
//});

$(function() {
$( ".datepicker" ).datepicker();
});















