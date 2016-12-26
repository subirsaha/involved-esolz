    postApp.service('loginService',function ($http,$location) {
        var service = {};

        service.loginResponse = function (grant_type,email,password,clientid,devicetoken,platform,callback) {
            //alert(grant_type+"##"+username+"##"+password+"##"+clientid);
            console.log("grant_type="+grant_type+"&username="+email+"&clientid="+clientid+"&password="+password+"&devicetoken="+devicetoken+"&platform="+platform);
            $http({
                    method: 'POST',
                    url: api_base_url+'token',
                    data: "grant_type="+grant_type+"&username="+email+"&clientid="+clientid+"&password="+password+"&devicetoken="+devicetoken,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data, status, headers, config){
                    data.status=true;
                    data.message = '';
                    console.log('LOGIN RESPONSE 1 ========> ');
                    console.log(data);
                    console.log(status);
                    callback(data);
                }).error(function (data, status, headers, config) {
             
                    console.log('LOGIN RESPONSE 2========> ');
                    console.log(data);
                    console.log(status);
                    if(status == 400){
                        var data = {status:false,message:"Wrong Email or Password!"}
                    }else if(status == 0){
                        var data = {status:false,message:"Server failed to respond!"}
                    }
                    callback(data);
                });
            //$http({
            //        method: 'POST',
            //        url: api_base_url+'token',
            //        data: "grant_type="+grant_type+"&username="+email+"&clientid="+clientid+"&password="+password,
            //        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            //    }).then(function(data){
            //        console.log(data);
            //        callback(data);
            //    }).catch(function (data) {
            //        console.log(data);
            //        if(status == 400){
            //            var data = {status:false,message:"Wrong Email or Password!"}
            //        }else if(status == 0){
            //            var data = {status:false,message:"Server failed to respond!"}
            //            //$("#confy").click();
            //            //alert('Server failed to respond!');
            //        }
            //        callback(data);
            //    });
        }
        
        
        service.forgetPasswordResponse = function (forgetPasswordEmail,clientid,callback) {
            //alert(forgetPasswordEmail);
            $http({
                    method: 'POST',
                    url: api_base_url+'api/account/resetpassword/username='+forgetPasswordEmail,
                   // headers: "clientid="+clientid,
                   headers: {'Content-Type': 'application/x-www-form-urlencoded','clientid' : clientid}
                }).success(function(data, status, headers, config){
                    data.status=true;
                    data.message = '';
                    //console.log('FORGET PWD RESPONSE ========> ');
                    //console.log(data);
                    callback(data);
                }).error(function (data, status, headers, config){
                    if(status == 400){
                        console.log(data);
                        //var data = {status:false}
                    }else if(status == 0){
                        var data = {status:false,msg:"Server failed to respond!"}
                    } 
                    callback(data);
                });
        }
        
    
        
        return service;
    
    });