//**************************
		//go to top//
		
		$(document).on('click','.goTo', function(event) {
			event.preventDefault();
			var target = "#" + this.getAttribute('data-go-to');
			$('html, body').animate({
			scrollTop: $(target).offset().top
			}, 1000);
		});
		
//**************************	

//slider

$(document).ready(function(){

    $('.screen_slider').slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        arrows:false
    });    
    $(window).resize(function(){
        $('#myModal').css('overflow','auto');

    })
    
});

////

$(document).ready(function(){
   $("#message1").addClass("activeMessage");{
        var t=1;setInterval(function(){$(".message").removeClass("activeMessage"),
        $(".message").eq(t).addClass("activeMessage"),t+1===$(".message").length?t=0:t++},6e3)
   }
    
    //////
                 
});
