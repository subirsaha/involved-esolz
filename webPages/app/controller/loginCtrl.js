    postApp.controller('loginCtrl', function ($scope, $http, $location, loginService) {
                   
        $scope.email = getOnlyCookie("email");
        $scope.password = getOnlyCookie("password");
        var access_token = getOnlyCookie("access_token");
        var userid = getOnlyCookie("userid");

            
        $scope.get_browser=function() {
            var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []; 
            if(/trident/i.test(M[1])){
                tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
                return {name:'IE',version:(tem[1]||'')};
                }   
            if(M[1]==='Chrome'){
                tem=ua.match(/\bOPR|Edge\/(\d+)/)
                if(tem!=null)   {return {name:'Opera', version:tem[1]};}
                }   
            M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
            return {
              name: M[0],
              version: M[1]
            };
         }
        var browser=$scope.get_browser();
        console.log(browser);
        $scope.init = function ()
        {
            //if( (userid != undefined || userid !='') && (access_token != undefined || access_token != '') )
            if(userid != undefined)
            {
                var URL = base_url + 'home';
                window.location = URL;
            }
           
        }
        $scope.init();

        
       // var devicetoken = Request.UserHostAddress;
        //var hostname = Request.UserHostName;
        /***ClientId is combination of device type (3: Browser, 1: iOS, 2:Android) + _ (underscore) + browser type (1: IE, 2: Chrome, 3: Firefox).
        Note that clientid will be of format _
        APPTYPE values are...
        Parent = 1, Student = 2, Teacher = 3,
        Hence in different clients following values should be used accordingly, else login will fail.
        Parent App: 1_
        Student App: 2_
        Teacher Web: 3_ (1: IE, 2: Chrome, 3: Firefox)***/
        
        // Internet Explorer 6-11
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        // Chrome 1+
        var isChrome = !!window.chrome && !!window.chrome.webstore;
        // Firefox 1.0+
        var isFirefox = typeof InstallTrigger !== 'undefined';
        
        if(isIE == true)
        {
            var clientid = "3"+"_"+"3";
            var devicetoken="1"+"_"+browser.version;
        }else if(isChrome == true){
            var clientid = "3"+"_"+"3";
            var devicetoken="2"+"_"+browser.version;
        }else if(isFirefox == true){
            var clientid = "3"+"_"+"3";
            var devicetoken="3"+"_"+browser.version;
        }else{
            var clientid = "3"+"_"+"3";
            var devicetoken="4"+"_"+browser.version;
        }
        
        var platform = navigator.platform +'_'+ navigator.appVersion;
        //alert(navigator.platform +' ### '+ navigator.appVersion);
        

        var isValidEmailAddress = function (emailAddress) {
            var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
            return pattern.test(emailAddress);
        };
        
        $( "#email" ).on("keypress",function() {
            $("#email").removeClass('red_place');
            $("#email").attr("class","");
          });
         $( "#password" ).on("keypress",function() {
            $("#password").removeClass('red_place');
            $("#password").attr("class","");
          });
        
        /*SIGN IN BUTTON CLICK*/
        $scope.loginSubmit = function () {
            //networkinterface.getIPAddress(function (ip) { 
            //    alert(ip); 
            //});
            //console.log(ip);
            //var devicetoken="";
            var grant_type = $('#grant_type').val();
            var email = $('#email').val();
            var password = $('#password').val();
           
            var error = 0;
            if($('#email').val().toString().trim() == '' || email==0)
            {
                //$('#email').focus();
                //$scope.emailErr = "Please enter email";
                $('#email').val('');
                $("#email").attr("placeholder","Please enter email").addClass('red_place');
                error++;
                return false;
            }
            else{
                //$scope.emailErr = "";
                $("#email").attr("placeholder","Email").removeClass('red_place');
            }
            if (!isValidEmailAddress(email))
            {
                $('#email').val('');
                //$scope.emailErr = "Please enter valid email";
                $("#email").attr("placeholder","Please enter valid email").addClass('red_place');
                error++;
                return false;
            }else{
                
                //$scope.emailErr = "";
                $("#email").attr("placeholder","Email").removeClass('red_place');
            }
            if(password=='')
            {
                $('#password').val('');
                //$scope.passwordErr = "Please enter password";
                $("#password").attr("placeholder","Please enter password").addClass('red_place');
                error++;
                return false;
            }else{
                //$scope.passwordErr = "";
                $("#password").attr("placeholder","Password").removeClass('red_place');
            }
          
            if(error == 0)
            {
                //alert(grant_type+"##"+username+"##"+password+"##"+clientid);
                loginService.loginResponse(grant_type,email,password,clientid,devicetoken,platform,function(response) {
               
                    if(response.status){ //USER SUCCESFULLY LOGGED IN
                            console.log(response);
                            //return false;
                            var access_token = response.access_token;
                            var token_type = response.token_type;
                            var expires_in = response.expires_in;
                            var userid = response.userid;
                            var usertype = response.usertype;
                            //alert($('#remember').prop('checked')); 
                            /*REMEMBER ME CHECKED , THEN COOKIE WILL BE STORED*/
                            if($('#remember').prop('checked') == true){
                                setOnlyCookie("email",email,60*60*60);
                                setOnlyCookie("password",password,60*60*60);   
                            } else {
                                //setOnlyCookie('email','',1);
                                //setOnlyCookie('password','',1);
                                removeItem("email");
                                removeItem("password");
                            }
                            
                            setOnlyCookie("access_token",access_token,60*60*60);
                            setOnlyCookie("userid",userid,60*60*60);
                            
                            var URL = base_url+'home';
                            window.location = URL;

                    }else{//ERROR LOGIN
                        //alert(response.message);
                        //$scope.passwordErr = response.message;
                        if (response.message == "Wrong Email or Password!") {
                            $scope.passwordErr = "Wrong Email or Password!";
                        }else if(response.message == "Server failed to respond!") {
                            $("#confy1").click();
                            $scope.msg = 'Server failed to respond!';
                            //$scope.msg1='Check your internet connection';
                        }
                      
                    }                  
                });
            }
        };
        
        $("#femail").keypress(function() {
            $("#femail").removeClass('red_place');
            $("#femail").attr("class","");
        });
        
        /*FORGOT PASSWORD CLICK*/
        $scope.forget_password = function(){
            var URL = base_url+'forgetpassword';
            window.location = URL;
        };
        /*BACK TO SIGN IN CLICK IN FORGET PASSWORD PAGE*/
        $scope.backToLogin = function(){
            var URL = base_url+'login';
            window.location = URL;
        };
        
        //submit email for forgot password
        $scope.submit_email = function(){
            //validation of email field
            var email = jQuery("#femail").val();
            var error = 0;
            
            if($('#femail').val().toString().trim() == '' || email==0){ //if email field is blank
                $('#femail').val('');
                $("#femail").attr("placeholder","Please enter email").addClass('red_place');
                error++;
                return false;
            }else{
                $("#femail").attr("placeholder","Email").removeClass('red_place');
            }
            if(!isValidEmailAddress(email)){        //if email field is not valid
                $('#femail').val('');
                $("#femail").attr("placeholder","Please enter valid email").addClass('red_place');
                error++;
                return false;
            }else{      //otherwise submit data
                $("#femail").attr("placeholder","Email").removeClass('red_place');
            }
            $('.loader').addClass('loaderSpin');
            $('.loader').html('');
            $('.loader').css({'display':'block'});
            $('.loader').css({'color':'red'})
           
            if(error == 0)
            {
                $('#resset_pass').prop('disabled', true);
                
                loginService.forgetPasswordResponse(email,clientid,function(response) {
                    console.log(response);
                    // $('.loader').css({'display':'none'});
                    if(response==true){ //USER SUCCESFULLY LOGGED IN
                        $('.loader').removeClass('loaderSpin');
                        $('.loader').html('A new temporary password has been sent to '+email+'.');
                        $('#femail').val('');
                    }else if (response.Message=="ERROR_INCOMPATIBLE_CLIENT") {
                        $('.loader').removeClass('loaderSpin');
                        $('.loader').html('Please enter valid teacher login email to reset password.');
                    }else if (response.Message=="ERROR_NOTFOUND_ACCOUNT") { //ERROR LOGIN
                        $('.loader').removeClass('loaderSpin');
                        $('.loader').html('Email address entered is not registered with InvolvEd.');
                    }else if(response.msg == "Server failed to respond!"){ //no internet connection
                        $('.loader').removeClass('loaderSpin');
                        $("#confy1").click();
                        $scope.msg = 'Server failed to respond';
                    }
                    
                    $('#resset_pass').prop('disabled', false);
                });
            }
        };
        
        $scope.clear = function () {
            $scope.passwordErr = '';
        };
        
          $scope.removeClass = function () {
            $("#email").attr("class","");
            $("#password").attr("class","");
        };
        


    });
    
