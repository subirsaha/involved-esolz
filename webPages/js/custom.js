(function($){
    
    
    
//    $(window).load(function(){
//        setTimeout(function(){
//        $('.screen_slider').slick({
//		infinite: true,
//		slidesToShow: 1,
//		slidesToScroll: 1,
//		autoplay: true,
//		arrows:false
//	    });
//    }, 3000)
//    })
    
    
    
			
    $(".content").mCustomScrollbar({
        axis:"y",
        theme:"3d",
        scrollInertia:550,
        scrollbarPosition:"outside"
    });
    
})(jQuery);




////add class
$(document).on('click','.search_area',function() {
	$( this ).toggleClass( "show" );
});

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip({
        html: true
    });
    
//    alert();
//    $(window).resize(function(){
//        alert();
//        $('#myModal').css('overflow','auto');
//    })



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
    ////
    
    
});



//**************************
		//go to top//
		
//		$(document).on('click','.goTo', function(event) {
//			event.preventDefault();
//			var target = "#" + this.getAttribute('data-go-to');
//			$('html, body').animate({
//			scrollTop: $(target).offset().top
//			}, 700);
//		});
		
//**************************	

//slider

$(document).ready(function(){

    //$('.screen_slider').slick({
    //    infinite: true,
    //    slidesToShow: 1,
    //    slidesToScroll: 1,
    //    autoplay: true,
    //    arrows:false
    //});
    
});

////

$(document).ready(function(){
   $("#message1").addClass("activeMessage");{
        var t=1;setInterval(function(){$(".message").removeClass("activeMessage"),
        $(".message").eq(t).addClass("activeMessage"),t+1===$(".message").length?t=0:t++},6e3)
   }
                 
});











