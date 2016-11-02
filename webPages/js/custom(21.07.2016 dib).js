
////add class
$( ".search_area" ).click(function() {
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

    $('.header-search-wrap input, .search-cross').click(function(){
      $('.search-task').fadeToggle(0);
      $('.search-cross').fadeToggle(0);
      $('.header-search-wrap button').fadeToggle(0);
    });


});
///check
//$(document).ready(function(){
//    $("#selecctall").change(function(){
//      $(".checkbox1").prop('checked', $(this).prop("checked"));
//      });
//});
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
