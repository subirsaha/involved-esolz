postApp.service('demoService',function ($http,$location) {
           
           var service = {};
           
           ///for article
           service.demo_fetch = function (callback) {
                 //var id = $("#article_id").val();
                
                      var URL= "http://esolz.co.in/lab3/onlinetest/app/api/categoryfetch_user.php?user_id=127";
                      //alert(URL);
                      $http.get(URL).success(function(response){
                            callback(response);
                            console.log(response);
                            
                               //$("#after_scroll").html(response[1]); 
                               //$("#before_scroll").html(response[2]);
                       });
           }
           return service;      
});