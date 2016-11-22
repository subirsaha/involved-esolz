    postApp.controller('landingCtrl', function ($scope, $filter, $http,$compile, $location,$timeout,homeService) {
        
        var days = 1;
        var tomorrow = new Date(Date.now()+days*24*60*60*1000);

            $( window ).load(function() {
            // Run code
//            $('.screen_slider').slick({
//                infinite: true,
//                slidesToShow: 1,
//                slidesToScroll: 1,
//                autoplay: true,
//                arrows:false,
//                responsive: true,
//            });
          });
        $(document).ready(function() {
            $( "#datepicker" ).datepicker(
            {
               minDate: tomorrow
            });
            $(window).scrollTop(0);
            $(".navbar-collapse li").first().addClass("active");
            $timeout(function() {
                $('.screen_slider').slick({
                    infinite: true,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    autoplay: true,
                    arrows:false
                });
                $('.nav').onePageNav();
                $('.arrow_top').onePageNav();
                $('.footer-nav').onePageNav();
               
            },10);
            
            
//            $(window).load(function(){
//                alert();
//                setTimeout(function(){
//                    
//                
//                $('.screen_slider').slick({
//                    infinite: true,
//                    slidesToShow: 1,
//                    slidesToScroll: 1,
//                    autoplay: true,
//                    arrows:false
//                });
//                    }, 2000)
//            })
            
            
            $('#bookDemo').on('click', function(){
                $('#myModal').find('form')[0].reset();
                $('#bookDemoReset').click();
                $( "#datepicker" ).datepicker('setDate', tomorrow);
                
                $("#name").attr("placeholder","").removeClass('red_place');
                $("#job_title").attr("placeholder","").removeClass('red_place');
                $("#email").attr("placeholder","").removeClass('red_place');
                $("#contact_no").attr("placeholder","").removeClass('red_place');
                $("#school").attr("placeholder","").removeClass('red_place');
                $("#postcode").attr("placeholder","").removeClass('red_place');
            });

        });
        /*HOME BUTTON CLICK*/
        var selector = '.nav li';
        $(selector).on('click', function(){
            $(selector).removeClass('active');
            $(this).addClass('active');
            if (screen.width <= 676) {
                $("body").removeClass("addpanel");
                $('.navbar-collapse').collapse('toggle')
            }
        });
        
        $scope.active_class = function(val){
            if (val == 'home_section') {
                $('.scrollSection').removeClass('current active');
                $('#home_li').addClass('current active');
            }else if (val == 'parent_section') {
                $('.scrollSection').removeClass('current active');
                $('#parent_li').addClass('current active');
            }else if (val == 'schools_section') {
                $('.scrollSection').removeClass('current active');
                $('#schools_li').addClass('current active');
            }
            
        }
        
        /*TEACHER LOGIN BTN CLICK*/
        $scope.redirectToLogin = function(){
            var URL = base_url + 'login';
            window.location = URL;
        };
        
        $scope.comingSoon = function()
        {
            $scope.successMsg1 = 'Coming soon';
            $('#successMsg1').click();
            setTimeout(function () {
                $('.modal-backdrop').hide(); // for black background
                $('body').removeClass('modal-open'); // For scroll run
                $('#successMsg_modal1').modal('hide');                                                         
            }, 2000);
        };
        
        var isValidEmailAddress = function (emailAddress) {
            var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
            return pattern.test(emailAddress);
        };
        var is_number_invalid = function (number) {
            return /[^0-9]/.test(number);
        };
        
        $('#bookDemoCloseBTn').on('click', function(){
            $('#myModal').find('form')[0].reset();
            $('#bookDemoReset').click();
            $( "#datepicker" ).datepicker('setDate', tomorrow);
            $("#name").attr("placeholder","").removeClass('red_place');
            $("#job_title").attr("placeholder","").removeClass('red_place');
            $("#email").attr("placeholder","").removeClass('red_place');
            $("#contact_no").attr("placeholder","").removeClass('red_place');
            $("#school").attr("placeholder","").removeClass('red_place');
            $("#postcode").attr("placeholder","").removeClass('red_place');
        });

      
        $scope.bookDemoSubmit = function()
        {
            
            var name = $('#name').val();
            var job_title = $('#job_title').val();
            var email = $('#email').val();
            var contact_no = $('#contact_no').val();
            var school = $('#school').val();
            var postcode = $('#postcode').val();
            var date = $scope.ISOdateconversion($('#datepicker').datepicker( 'getDate' ));
            
            var error = 0;
             
            if( $('#name').val().toString().trim() == '' )
            {              
                $('#name').val('');
                $("#name").attr("placeholder","Enter your name").addClass('red_place');
                error++;
                return false;
            }else{
                $("#name").attr("placeholder","").removeClass('red_place');               
            }
            if(name.length > 20)
            {
                $("#name").attr("placeholder","Name must not be more than 20 characters").addClass('red_place');
                error++;
                return false;
            }else{
                $("#name").attr("placeholder","").removeClass('red_place');  
            }
            
            if( $('#job_title').val().toString().trim() == '' )
            {              
                $('#job_title').val('');
                $("#job_title").attr("placeholder","Enter job title").addClass('red_place');
                error++;
                return false;
            }else{
                $("#job_title").attr("placeholder","").removeClass('red_place');               
            }
            if(job_title.length > 20)
            {
                $("#job_title").attr("placeholder","Job title must not be more than 20 characters").addClass('red_place');
                error++;
                return false;
            }else{
                $("#job_title").attr("placeholder","").removeClass('red_place');  
            }
            
            if($('#email').val().toString().trim() == '' || email==0)
            {
                $('#email').val('');
                $("#email").attr("placeholder","Enter your email").addClass('red_place');
                error++;
                return false;
            }
            else{
                $("#email").attr("placeholder","").removeClass('red_place');
            }
            if (!isValidEmailAddress(email))
            {
                $('#email').val('');
                //$scope.emailErr = "Please enter valid email";
                $("#email").attr("placeholder","Enter valid email").addClass('red_place');
                error++;
                return false;
            }else{
                
                //$scope.emailErr = "";
                $("#email").attr("placeholder","").removeClass('red_place');
            }
            
            if( $('#contact_no').val().toString().trim() == '' )
            {              
                $('#contact_no').val('');
                $("#contact_no").attr("placeholder","Enter contact number").addClass('red_place');
                error++;
                return false;
            }else{
                $("#contact_no").attr("placeholder","").removeClass('red_place');               
            }
             console.log(contact_no.length);
            if(parseInt(contact_no.length) != 11)
            {
                $("#contact_no").val('');
                $("#contact_no").attr("placeholder","Enter valid number").addClass('red_place');
                error++;
                return false;
            }else{
                $("#contact_no").attr("placeholder","").removeClass('red_place');  
            }
            if (is_number_invalid(contact_no))
            {
                $('#contact_no').val('');
                $("#contact_no").attr("placeholder","Enter valid number").addClass('red_place');
                error++;
                return false;
            }else{
                $("#contact_no").attr("placeholder","").removeClass('red_place');  
            }
            
            if( $('#school').val().toString().trim() == '' )
            {              
                $('#school').val('');
                $("#school").attr("placeholder","Enter your school name").addClass('red_place');
                error++;
                return false;
            }else{
                $("#school").attr("placeholder","").removeClass('red_place');               
            }
            if(school.length > 20)
            {
                $("#school").attr("placeholder","School name must not be more than 20 characters").addClass('red_place');
                error++;
                return false;
            }else{
                $("#school").attr("placeholder","").removeClass('red_place');  
            }
            
            
            if( $('#postcode').val().toString().trim() == '' )
            {              
                $('#postcode').val('');
                $("#postcode").attr("placeholder","Enter school postcode").addClass('red_place');
                error++;
                return false;
            }else{
                $("#postcode").attr("placeholder","").removeClass('red_place');               
            }
            //if(postcode.length > 10)
            //{
            //    $("#postcode").attr("placeholder","Postcode must not be more than 10 digits").addClass('red_place');
            //    error++;
            //    return false;
            //}else{
            //    $("#postcode").attr("placeholder","Enter school postcode").removeClass('red_place');  
            //}
           
            
            
            if(error == 0)
            {
                 /////LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content2").css("display", "block");
                $("#preloader_right_content2").css("display", "block");
                document.getElementById("bookDemoCloseBTn").disabled = true;
                
                homeService.bookDemoSubmit(name,job_title,email,contact_no,school,postcode,date, function (response)
                {
                    document.getElementById("bookDemoSubmit").disabled = true;
                    if(response == true)
                    {
                        /////LOADER HIDE
                        $(window).scrollTop(0);
                        $("#status_right_content2").css("display", "none");
                        $("#preloader_right_content2").css("display", "none");
                         document.getElementById("bookDemoCloseBTn").disabled = false;
                        $scope.successMsg1 = 'You have successfully booked a demo';
                        $('#successMsg1').click();
                        $('#bookDemoReset').click();
                        $('#bookDemoCloseBTn').click();
                        
                    }else{
                        /////LOADER HIDE
                        $(window).scrollTop(0);
                        $("#status_right_content2").css("display", "none");
                        $("#preloader_right_content2").css("display", "none");
                        document.getElementById("bookDemoCloseBTn").disabled = false;
                        document.getElementById("bookDemoSubmit").disabled = false;
                        $scope.successMsg1 = response.Message;
                        $('#successMsg1').click();
                        $('#bookDemoReset').click();
                        $('#bookDemoCloseBTn').click();
                    }
                    setTimeout(function () {
                        $('.modal-backdrop').hide(); // for black background
                        $('body').removeClass('modal-open'); // For scroll run
                        $('#successMsg_modal1').modal('hide');                                                         
                    }, 2000); 
                });
            }
            
        };
        
        $scope.ISOdateconversion = function(ISOdate) {
            var d = new Date(ISOdate);
            var n = d.toISOString();
            return n;
        }
        
        
    
      
        
    });


