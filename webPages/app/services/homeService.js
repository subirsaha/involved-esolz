    postApp.service('homeService',function ($http,$location) {
        var service = {};
        
        /*LOGGED IN TEACHER DEATILS*/
        service.teacherDetailsResponse = function (access_token,userid,callback) {
            $http({
                    method: 'GET',
                   // url: api_base_url+'api/teachers/userid='+userid,
                    url: api_base_url+'api/teachers',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){                  
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    //data.status=false;
                    callback(data);
                });

        }
        
        /*CLASS LIST OF TEACHER*/
        service.myClassesResponse = function (access_token,teacherId,callback) {
            $http({
                    method: 'GET',
                    //url: api_base_url+'api/teachers/'+teacherId+'/classes',
                    url: api_base_url+'api/teachers/classes',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){                  
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    if(status == 400){
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    }
                    //data.status=false;
                    callback(data);
                });
        }
        
        /*STUDENT LIST ACCORDING TO CLASS ID*/
        service.studentListResponse = function (access_token,classId,callback) {
            $http({
                    method: 'GET',
                    url: api_base_url+'api/students/classid='+classId,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){                  
                    data.status=true;         
                    callback(data);
                }).error(function (data, status, headers, config) {
                    if(status == 400){
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    } 
                    //data.status=false;
                    callback(data);
                });
        }
        
        /*STUDENT LIST FOR INBOX*/
        service.studentListInboxResponse = function (access_token,teacherId,callback) {
            $http({
                    method: 'GET',
                    url: api_base_url+'api/teachers/inboxstudents',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){                  
                    data.status=true;         
                    callback(data);
                }).error(function (data, status, headers, config) {
                    if(status == 400){
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    } 
                    //data.status=false;
                    callback(data);
                });
        }
        
        /*RELOAD STUDENT MESSAGE COUNTER*/
        service.studentListMessageCounter = function (access_token,studentId,classId,callback) {
          // console.log("studentListInboxResponse===="+api_base_url+'api/teachers/'+teacherId+'/inboxstudents');
            $http({
                    method: 'GET',
                    url: api_base_url+'api/students/'+studentId+'/counters/classId='+classId,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){                  
                    data.status=true;         
                    callback(data);
                }).error(function (data, status, headers, config) {
                    if(status == 400){
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    } 
                    //data.status=false;
                    callback(data);
                });
        }
        
        /*STUDENT INBOX PERFORMANCE DATA*/
        service.studentInboxPerformanceResponse = function (access_token,studentId,classId,callback) {
            $http({
                    method: 'GET',
                    url: api_base_url+'api/students/'+studentId+'/classperformance/classid='+classId,
                   // url: api_base_url+'api/students/'+studentId+'/performance',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){                  
                    data.status=true;         
                    callback(data);
                }).error(function (data, status, headers, config) {
                    if(status == 400){
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    } 
                    //data.status=false;
                    callback(data);
                });
        }
        
        /*MY INBOX MESSAGE HISTORY*/
        service.InboxMessageHistoryResponse = function (access_token,studentId,classId,callback) {
           // console.log(api_base_url+'api/messages/classid='+classId+'&studentid='+studentId+'&count=20&latestmessagetime=null');
            $http({
                    method: 'GET',
                    url: api_base_url+'api/messages/classid='+classId+'&studentid='+studentId+'&count=20&latestmessagetime=null',
                    headers: {'Content-Type': 'application/json','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){                  
                    data.status=true;         
                    callback(data);
                }).error(function (data, status, headers, config) {
                    if(status == 400){
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    } 
                    callback(data);
                });
        }
        
        /*MY INBOX MESSAGE HISTORY LOAD MORE*/
        service.InboxMessageHistoryLoadMoreResponse = function (access_token,studentId,classId,latestmessagetime,callback) {
            $http({
                    method: 'GET',
                    url: api_base_url+'api/messages/classid='+classId+'&studentid='+studentId+'&count=20&latestmessagetime='+latestmessagetime,
                    headers: {'Content-Type': 'application/json','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){
                    if (data == "") {
                       data.msg="1";
                    }else{
                       data.msg="0";
                    }
                    data.status=true;         
                    callback(data);
                }).error(function (data, status, headers, config) {
                    if(status == 400){
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    } 
                    //data.status=false;
                    callback(data);
                });
        }
        
        
        
        
        /*STUDENT PARENT MESSAGE SEND*/
        service.studentParentMessageSend = function (access_token,StudentIdsStr,classId,content,callback)
        {
            var str = StudentIdsStr;
            var str_array = str.split(',');
            var studentArr = Array();
            for(var i = 0; i < str_array.length; i++)
            {
               // Trim the excess whitespace.
               str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
               studentArr[i] = str_array[i];
            }
            
            $http({
                    method: 'POST',
                    url: api_base_url+'api/messages/multiple',
                    headers: {'Content-Type': 'application/json','Authorization':'Bearer '+access_token},
                    data: {
                           "StudentIds": studentArr,
                           "ClassId": classId,
                           "Content": content
                        },
                    
                }).success(function(data, status, headers, config){                  
                    data.status=true;
                    console.log("STUDENT PARENT MESSAGE SEND RESPONSE ="+data);
                    callback(data);
                }).error(function (data, status, headers, config) {
                    if(status == 400){
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    } 
                    //data.status=false;
                    callback(data);
                });
        }
        
        
        
        /*STUDENT INBOX MESSAGE SEND*/
        service.studentInboxMessageSend = function (access_token,StudentId,classId,content,callback)
        {
           console.log({
                           "StudentId": StudentId,
                           "ClassId": classId,
                           "Content": content
                        });
            $http({
                    method: 'POST',
                    url: api_base_url+'api/messages',
                    headers: {'Content-Type': 'application/json','Authorization':'Bearer '+access_token},
                    data: {
                           "StudentId": StudentId,
                           "ClassId": classId,
                           "Content": content
                        },
                    
                }).success(function(data, status, headers, config){                  
                    data.status=true;
                    console.log("INBOX MESSAGE SEND RESPONSE ="+data);
                    callback(data);
                }).error(function (data, status, headers, config) {
                    if(status == 400){
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    } 
                    //data.status=false;
                    callback(data);
                });
        }
        
        
        /*PRE-DEFINED MESSAGE LIST ACCORDING TO CLASS ID*/
        service.predefinedMessagesResponse  = function (access_token,teacherId,callback) {
            //alert(classId);
            $http({
                    method: 'GET',
                    url: api_base_url+'api/teachers/predefinedmessages',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){                  
                    data.status=true;         
                    callback(data);
                }).error(function (data, status, headers, config) {
                    if(status == 400){
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    } 
                    //data.status=false;
                    callback(data);
                });
        }
        
        /*TASK TYPE DROPDOWN*/
        service.taskListResponse = function (access_token,callback) {
            $http({
                    method: 'GET',
                    url: api_base_url+'api/teachertasks/tasktypes',
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){
                    console.log("TASK TYPE");
                    console.log(data);
                    callback(data);
                }).error(function (data, status, headers, config) {

                });
        }
        /*TASK LIST FROM START & END DATE*/
        service.myTaskResponse = function (access_token,startdate,enddate,callback) {
            //console.log(startdate+"   ###   "+enddate);
            //var startdate = '2016-07-10';
            //var enddate = '2016-07-30';
            $http({
                    method: 'GET',
                    url: api_base_url+'api/teachertasks/startdate='+startdate+'&enddate='+enddate,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){
                 
                    console.log("TASK LIST");
                    console.log(data);
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    if(status == 400){
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    } 
                    //data.status=false;
                    callback(data);
                });
        }
        /*FETCH WEEK RANGES OF CALENDAR*/
        service.myTaskCalenderResponse = function (access_token,startdate,enddate,callback) {
            
            $http({
                    method: 'GET',
                    url: api_base_url+'api/teachertasks/weeklist/startdate='+startdate+'&enddate='+enddate,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    //data.status=false;
                    callback(data);
                });
        }
        
        /*SET TASK*/
        service.setTaskResponse = function (access_token,StudentIdsStr,TaskType,Title,Description,ClassId,dueDate,fileUploadResponse,callback) {
            //alert(StudentIds+' ### '+TaskType+' ### '+Title+' ### '+'"'+Description+'"'+' ### '+ClassId +'"'+' ### '+ dueDate);
            /*string to array convert*/
            
         
            var str = StudentIdsStr;
            var str_array = str.split(',');
            var studentArr = Array();
            for(var i = 0; i < str_array.length; i++)
            {
               // Trim the excess whitespace.
               str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
               studentArr[i] = str_array[i];
            }
                      
            var fileUploadData = Array();
            if(fileUploadResponse == null){ //**when no file is uploaded
                fileUploadData = [];  
            }else{ //**when files are uploaded
                var res = JSON.parse(fileUploadResponse);
                for(var j=0 ; j<res.length ; j++){             
                    fileUploadData[j] = { "Id": res[j].Id, "Name": res[j].Name };
                }
            }
            console.log('#### fileUploadData ####');
            console.log({
                           "StudentIds": studentArr,
                           "TaskType": TaskType,
                           "Title":  Title,
                           "Description": Description,
                           "DueDate": dueDate,
                           "ClassId": ClassId,
                           "Attachments": fileUploadData,
                        });
            $http({
                   method: 'POST',
                   url: api_base_url+'api/teachertasks/',
                   data: {
                           "StudentIds": studentArr,
                           "TaskType": TaskType,
                           "Title":  Title,
                           "Description": Description,
                           "DueDate": dueDate,
                           "ClassId": ClassId,
                           "Attachments": fileUploadData,
                           "Mode": MODE
                        },
                   headers: {'Content-Type': 'application/json','Authorization':'Bearer '+access_token}
                }).success(function(data, status, headers, config){
                    data.status='success';
                    callback(data);
                }).error(function (data, status, headers, config) {
                    data.status='fail';
                    callback(data);
                });
        }
        
        /*TASK DESCRIPTION*/
        service.taskDescriptionResponse = function (access_token,taskId,callback) {
            $http({
                    method: 'GET',
                    url: api_base_url+'api/teachertasks/'+taskId,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){                  
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    data.status=false;
                    callback(data);
                });
        }
       
        /*UPDATE TASK*/
        service.updateTaskResponse = function (access_token,StudentIdsStr,taskId,title,description,dueDate,fileUploadResponse,existingFileUploadData,callback) {
            alert('NEW STUDENT IDS');
            alert(StudentIdsStr);
            /*string to array convert*/
            var str = StudentIdsStr;
            var str_array = str.split(',');
            var studentArr = Array();
            for(var i = 0; i < str_array.length; i++)
            {
               // Trim the excess whitespace.
               str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
               studentArr[i] = str_array[i];
            }
            
            var fileUploadData = Array();
            if(fileUploadResponse == null){ //**when no file is uploaded
                fileUploadData = [];  
            }else{                          //**when files are uploaded
                var res = JSON.parse(fileUploadResponse);
                console.log(res[0].Id);
                console.log(res[0].Name);
                for(var j=0 ; j<res.length ; j++){             
                    fileUploadData[j] = { "Id": res[j].Id, "Name": res[j].Name };
                }
            }
    
            finalFileUploadData = existingFileUploadData.concat(fileUploadData); //concat the already existing attachements & new uploaded attachement s
            console.log('FINAL FILE UPLOAD DATA');
            console.log(finalFileUploadData);
            
            $http({
                    method: 'PUT',
                    url: api_base_url+'api/teachertasks/',
                    data:
                        {
                            "StudentIds": studentArr,
                            "Id": taskId,
                            "Title":  title,
                            "Description": description,
                            "DueDate": dueDate,
                            "Attachments": finalFileUploadData,
                            "Mode": MODE
                        },   
                    headers: {'Content-Type': 'application/json','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){
                
                    console.log('UPDATE RESPONSE ===>>>'+data);
                    
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    //data.status=false;
                    callback(data);
                });
        }
        
        /*DELETE TASK*/
        service.deleteTaskResponse = function (access_token,taskId,callback) {
            //alert(taskId);
            $http({
                    method: 'DELETE',
                    url: api_base_url+'api/teachertasks/'+taskId,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){
                    console.log('DELETE RESPONSE ===>>>'+data);
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    //data.status=false;
                    callback(data);
                });
        }
        
        ///*W10 - SEARCH TASK*/
        service.taskSearchResponse = function (access_token,searchterm,callback) {
                if (searchterm == "") {
                    searchterm = "%20";
                }
                $http({
                    method: 'GET',
                    url: api_base_url+'api/search/teachertasks/text='+searchterm,
                    //url: api_base_url+'api/teachers/findstudents/searchtext='+searchterm,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    //data.status=false;
                    callback(data);
                });
            
        }
        
        
        ///*W11 - PERFORMANCE*/
        service.performanceListResponse = function (access_token,classId,callback) {
            $http({
                    method: 'GET',
                    url: api_base_url+'api/students/performance/classid='+classId,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    if(status == 400){
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    }
                    //data.status=false;
                    callback(data);
                });
        }
        
         ///*W12 - PERFORMANCE STUDENT*/
        service.studentPerformanceListResponse = function (access_token,classId,studentId,callback) {
            $http({
                    method: 'GET',
                    url: api_base_url+'api/students/'+studentId+'/performancegraph/classid='+classId,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    //data.status=false;
                    callback(data);
                });
        }
        
        ///*W13 - SEARCH STUDENT*/
        service.studentSearchResponse = function (access_token,searchterm,callback) {
            if (searchterm == "") {
                searchterm = "%20";
            }
                $http({
                    method: 'GET',
                    url: api_base_url+'api/search/students/text='+searchterm,
                    //url: api_base_url+'api/teachers/findstudents/searchtext='+searchterm,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    //data.status=false;
                    callback(data);
                });
            
        }
        
        ///*W17 - SEARCH STUDENT (MY INBOX)*/
        service.studentSearchInboxResponse = function (access_token,teacherId,searchterm,callback) {
            console.log('studentSearchInboxResponse ==='+api_base_url+'api/search/students/teacherid='+teacherId+'&text='+searchterm);
    
            if (searchterm == "") {
                searchterm = "%20";
            }
                $http({
                    method: 'GET',
                   // url: api_base_url+'api/search/students/teacherid='+teacherId+'&text='+searchterm,
                    url: api_base_url+'api/search/teacherstudents/text='+searchterm,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    //data.status=false;
                    callback(data);
                });
            
        }
        
        //*W14 - STUDENT PROFILE*/
        service.studentProfileResponse = function (access_token,Id,callback) {
            $http({
                    method: 'GET',
                    url: api_base_url+'api/students/'+Id+'/performance',
                    headers: {'Authorization':'Bearer '+access_token},    
                }).success(function(data, status, headers, config){
              
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    //data.status=false;
                    callback(data);
                });
        }
        
        ////*FILE UPLOAD FOR MY CLASSES => CREATE TASK SECTION */
        service.fileUpload = function (access_token,callback) {

            var data = new FormData();
            //var fileNum = $('#fileNum').val();
            //alert(fileNum);
            $(".file_attachment_class1").each(function(){
               //alert($(this).attr('id'));
                var file_attachment_id = $(this).attr('id');
                $.each($('#'+file_attachment_id)[0].files, function(i, file) {
                     data.append('file-'+i, file);
                });
            });
            
            
            console.log('RESPONSE DATA');
            console.log(data);
    
            var settings = {
                "async": true,
                "crossDomain": true,
                "url":  api_base_url+"api/files",
                "method": "POST",
                "headers": {
                    "authorization": "Bearer "+access_token,
                    "cache-control": "no-cache",            
                },
                "processData": false,
                "contentType": false,
                "mimeType": "multipart/form-data",
                "data": data
            }
            
            $.ajax(settings).done(function (response) {
                console.log("SERVICE RESPONSE");
                console.log(response);
                callback(response);
            });
        }
        
        ////*FILE UPLOAD FOR MY TASK => CREATE TASK MODAL*/
        service.fileUploadForPopUp = function (access_token,callback) {   
        
            var data = new FormData();
            $(".file_attachment_class2").each(function(){
                var file_attachment_id = $(this).attr('id');
                $.each($('#'+file_attachment_id)[0].files, function(i, file) {
                    console.log(file);
                     data.append('file-'+i, file);
                });
            });
            console.log('SERVICE DATA');
            console.log(data);
            
            var settings = {
                "async": true,
                "crossDomain": true,
                "url":  api_base_url+"api/files",
                "method": "POST",
                "headers": {
                    "authorization": "Bearer "+access_token,
                    "cache-control": "no-cache",            
                },
                "processData": false,
                "contentType": false,
                "mimeType": "multipart/form-data",
                "data": data
            }
            
            $.ajax(settings).done(function (response) {
                console.log("SERVICE RESPONSE");
                console.log(response);
                callback(response);
            });
        }
        
        
        ////*FILE UPLOAD FOR MY TASK => EDIT TASK MODAL*/
        service.fileUploadForEdit = function (access_token,callback) {   
            
            //var data = new FormData();
            //var j = 1;
            //jQuery.each(jQuery('#file_attachment3')[0].files, function(i, file) {
            //    if (j<=noOfAttach){ 
            //         data.append('file-'+i, file);
            //    }
            //   
            //    j++;
            //});
            
            var data = new FormData();
            $(".file_attachment_class3").each(function(){
                var file_attachment_id = $(this).attr('id');
                //alert(file_attachment_id);
                $.each($('#'+file_attachment_id)[0].files, function(i, file) {
                     data.append('file-'+i, file);
                });
            });
            console.log('UPDATE FILE RESPONSE');
            console.log(data);
            var settings = {
                "async": true,
                "crossDomain": true,
                "url":  api_base_url+"api/files",
                "method": "POST",
                "headers": {
                    "authorization": "Bearer "+access_token,
                    "cache-control": "no-cache",            
                },
                "processData": false,
                "contentType": false,
                "mimeType": "multipart/form-data",
                "data": data
            }
            
            $.ajax(settings).done(function (response) {
                console.log("SERVICE RESPONSE");
                console.log(response);
                callback(response);
            });
        }
        
        
        
        ////*FILE DOWNLOAD FOR MY TASK => CREATE TASK MODAL*/
        service.fileDownloadAttachment = function (access_token,uploadedFileId,callback) {
            //alert(uploadedFileId);
            var settings = {
                "async": true,
                "crossDomain": true,
                "url":  api_base_url+"api/files/taskattachment="+uploadedFileId,
                "method": "GET",
                "headers": {
                    "authorization": "Bearer "+access_token,
                    "cache-control": "no-cache",            
                },
                "processData": false,
                "contentType": false,
                "mimeType": "multipart/form-data", 
            }
            
            $.ajax(settings).done(function (response) {
                console.log("DOWNLOAD RESPONSE");
                console.log(response);
                console.log('^^^^^^^^^^^^^^^^^^');
                callback(response); 
            });
        }
        
        
        service.bookDemoSubmit = function (name,job_title,email,contact_no,school,postcode,date,callback) {
                //alert(date);
                 var static_date = "2016-11-25T01:35:32.458243Z";
                    console.log({
                            "Name": name,
                            "JobTitle": job_title,
                            "Email":  email,
                            "PhoneNo": contact_no,
                            "SchoolName": school,
                            "SchoolAddress": postcode,
                            "BookedDate": date
                        });
               
                $http({
                    method: 'POST',
                    url: api_base_url+'api/contactus/bookdemo',
                    data:
                        {
                            "Name": name,
                            "JobTitle": job_title,
                            "Email":  email,
                            "PhoneNo": contact_no,
                            "SchoolName": school,
                            "SchoolAddress": postcode,
                            "BookedDate": date
                        },   
                    headers: {'Content-Type': 'application/json'},    
                }).success(function(data, status, headers, config){
                    console.log('BOOK A DEMO RESPONSE ===>>>'+data);
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    //data.status=false;
                    callback(data);
                });
            
        }
        /*SETTINGS CHANGE PASSWORD*/
        service.change_pwd_Response = function (access_token,currentPwd,newPwd,callback) {
            //console.log(access_token);
            //console.log(currentPwd+"#######"+newPwd);
            console.log({
                            "Current": currentPwd,
                            "New": newPwd
                        });
                $http({
                    method: 'POST',
                    url: api_base_url+'api/account/changepassword',
                    headers: {'Content-Type': 'application/json','Authorization':'Bearer '+access_token},
                    data:
                        {
                            "Current": currentPwd,
                            "New": newPwd
                        }
                   
                }).success(function(data, status, headers, config){
                    console.log('CHANGE PASSWORD ===>>>'+data);
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    //data.status=false;
                    console.log(data);
                    if(status == 400){
                        data.status='fail';
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    }
                    callback(data);
                });
            
        }
        /*SETTINGS EMAIL NOTIFICATION*/
        service.email_notification = function (access_token,callback) {
                $http({
                    method: 'GET',
                    url: api_base_url+'api/settings/notification',
                    headers: {'Content-Type': 'application/json','Authorization':'Bearer '+access_token}
                }).success(function(data, status, headers, config){
                    console.log('EMAIL NOTIFICATION ===>>>');
                    console.log(data);
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                   
                    if(status == 400){
                        data.status='fail';
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    }
                    callback(data);
                });
            
        }
        /*UPDATE SETTINGS EMAIL NOTIFICATION*/
        service.email_notification_update = function (access_token,status,callback) {
                $http({
                    method: 'POST',
                    url: api_base_url+'api/settings/notification/emails='+status,
                    headers: {'Content-Type': 'application/json','Authorization':'Bearer '+access_token},
              
                }).success(function(data, status, headers, config){
                    console.log('CHANGE EMAIL NOTIFICATION ===>>>'+data);
                    data.status=true;
                    callback(data);
                }).error(function (data, status, headers, config) {
                    if(status == 400){
                        data.status='fail';
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    }
                    callback(data);
                });
            
        }
        /*SETTINGS FILE UPLOAD*/
        service.fileUploadContactUs = function (access_token,callback) {
                    
            var data = new FormData();
            $(".file_attachment_class4").each(function(){
               //alert($(this).attr('id'));
                var file_attachment_id = $(this).attr('id');
                $.each($('#'+file_attachment_id)[0].files, function(i, file) {
                     data.append('file-'+i, file);
                });
            });
            
            console.log('RESPONSE DATA');
            console.log(data);
    
            var settings = {
                "async": true,
                "crossDomain": true,
                "url":  api_base_url+"api/files",
                "method": "POST",
                "headers": {
                    "authorization": "Bearer "+access_token,
                    "cache-control": "no-cache",            
                },
                "processData": false,
                "contentType": false,
                "mimeType": "multipart/form-data",
                "data": data
            }
            
            $.ajax(settings).done(function (response,status) {
                console.log("SERVICE RESPONSE");
                console.log(status);
                //response.ajax_status= true;
                if(status == 'success'){
                    response={response:response,status:true};
                    console.log(response);
                }else{
                    var response = {response:'',status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                }
                
                callback(response);
            })
            .fail(function( response, status, errorThrown ) {
               
                 if(status == 'success'){
                    response={response:response,status:true};
                    console.log(response);
                }else{
                    var response = {response:'',status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                }
                
                callback(response);
            })
        }
        
        /*SUMBIT CONTACT US*/
        service.submitContactUsResponse = function (access_token,Description,fileUploadResponse,callback) {
           
            var fileUploadData = Array();
            if(fileUploadResponse == null){ //**when no file is uploaded
                fileUploadData = [];  
            }else{ //**when files are uploaded
                var res = JSON.parse(fileUploadResponse.response);
                for(var j=0 ; j<res.length ; j++){             
                    fileUploadData[j] = {
                                            "Id": res[j].Id,
                                            "Name": res[j].Name
                                        };
                }
            }
            $http({
                   method: 'POST',
                   url: api_base_url+'api/contactus/query',
                   data: {
                           "Description": Description,
                           "Attachments": fileUploadData
                        },
                   headers: {'Content-Type': 'application/json','Authorization':'Bearer '+access_token}
                }).success(function(data, status, headers, config){
                    console.log('SUCCESS');
                    console.log(data);
                    var data = {data:data,status:true,msg:""}
                    callback(data);
                }).error(function (data, status, headers, config) {
                         console.log('FAIL');
                console.log(data);
                    if(status == 400){
                        data.status=false;
                        console.log(data);
                    }else if(status == 0){
                        var data = {status:false,msg:"ERR_INTERNET_DISCONNECTED"}
                    }
                    callback(data);
                });
        }

        
        

        
        return service;
    
    });