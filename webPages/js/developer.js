//script in teacher_login.html

    (function ($) {
        $(document).ready(function(){
            //function scrollToBottom()
            //{
            //    $("#chat_box").mCustomScrollbar({
            //        axis:"y",
            //        theme:"3d",
            //        scrollInertia:550,
            //        scrollbarPosition:"outside"}).mCustomScrollbar("scrollTo","bottom",{scrollInertia:0
            //    });
            //}
           
        });
        $(window).on("load", function () {
            var whiteUrls = ['/', '/login','/lab3/involved/','/lab3/involved/login'];
            setTimeout(function () {
                initmScroller();
                if ($.inArray(window.location.pathname, whiteUrls) > -1) {
                    $("head").append("<script type='text/javascript' src='js/particles.js'></script>").append("<script type='text/javascript' src='js/app.js'></script>");
                }
                //$(window).trigger('load.bs.select.data-api');
                initDropdown();
                $( ".datepicker" ).datepicker();

            }, 1500);
            
           
         
            var win_width = $(window).width();
            if (win_width >568)
            {
                var highestBox = 0;
                $('.same_ht').each(function(){
                    if($(this).height() > highestBox)
                    {
                        highestBox = $(this).height();
                    }
                });
                $('.same_ht').height(highestBox);
            }
            //abc();
            //function addMsg()
            //{
            //    $("#message1").addClass("activeMessage");{
            //        var t=1;
            //        setInterval(function(){$(".message").removeClass("activeMessage"),
            //        $(".message").eq(t).addClass("activeMessage"),t+1===$(".message").length?t=0:t++},6e3)
            //    }
            //}
            //function slider(){
            //    console.log('slick');
            //    $('.screen_slider').slick({
            //          infinite: true,
            //          slidesToShow: 1,
            //          slidesToScroll: 1,
            //          autoplay: true,
            //          arrows:false
            //      });
            //}
            function initmScroller ()
            {
                
                //console.log('initmScroller');
                $("#content-1").mCustomScrollbar({
                    axis: "y",
                    theme: "3d",
                    scrollInertia: 550,
                    scrollbarPosition: "outside"
                });
                $("#content-2").mCustomScrollbar({
                    axis: "y",
                    theme: "3d",
                    scrollInertia: 550,
                    scrollbarPosition: "outside"
                });
                $(".right_srl").mCustomScrollbar({
                    axis:"x",
                    theme:"3d",
                    scrollInertia:550,
                    scrollbarPosition:"outside"
                });        
                //$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {                
                //    $(".right_srl").mCustomScrollbar("destroy");             
                //    $(".right_srl").mCustomScrollbar({
                //        axis:"x",
                //        theme:"3d",
                //        scrollInertia:550,
                //        scrollbarPosition:"outside"
                //    });
                //});
                $(".content").mCustomScrollbar({
                    axis: "y",
                    theme: "3d",
                    scrollInertia: 550,
                    scrollbarPosition: "outside"
                });
                //$("#chat_box").mCustomScrollbar({
                //        axis: "y",
                //        theme: "3d",
                //        scrollInertia: 550,
                //        scrollbarPosition: "outside"
                //});
            }
            
            function abc()
            {
               // alert('abc func');
                var win_width = $(window).width();
                if (win_width >568)
                {
                    var highestBox = 0;
                    $('.same_ht').each(function(){
                        if($(this).height() > highestBox)
                        {
                            highestBox = $(this).height();
                        }
                    });
                    $('.same_ht').height(highestBox);
                }
            }  
            $(window).resize(function() {
                $('.same_ht').removeAttr("style");
                //abc();
            });
            $(document).click(function(event){
                if($(event.target).closest('div.selectBox').length == 0) {
               // alert( $('#selectClassDdp').val());
                    if($('#selectClassDdp').val()==null)
                    {
                        $('.select_outter_new').addClass('blink_me');
                    }
                }
            });

        });  
 
        
    })(jQuery);
    
    //
    //
    //
    //$(document).on('click','.goTo', function(event) {
    //    event.preventDefault();
    //    var target = "#" + this.getAttribute('data-go-to');
    //    $('html, body').animate({
    //    scrollTop: $(target).offset().top
    //    }, 1000);
    //});

      

