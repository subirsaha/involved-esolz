    postApp.controller('homeCtrl', function ($scope, $filter, $http,$compile, $location,$timeout,loginService, homeService) {

        var access_token = getOnlyCookie("access_token");
        var userid = getOnlyCookie("userid");
        var weekDayArr = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        var monthArr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
        
        /*initializing scrollers*/
        $timeout(function() {
        $("#chat_box").mCustomScrollbar({
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
        },1000);
       
        /*loader*/
        $scope.loader_hide = function(){
            $(window).scrollTop(0);
            $("#status").fadeOut();
            $("#preloader").delay(350).fadeOut("slow");
        }
        $scope.loader_hide();

        /*IF USER NOT LOGGED IN , HE CANNOT ACCESS HOME PAGE*/
        $scope.init = function ()
        {     
            if(userid == undefined)
            {
                var URL = base_url + 'login';
                window.location = URL;
            }else{
                ///LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content4").css("display", "block");
                $("#preloader_right_content4").css("display", "block");
                    /*FETCH TEACHER DETAILS ON PAGE LOAD*/
                homeService.teacherDetailsResponse(access_token, userid, function (response)
                {
                    console.log("TEACHER DETAILS");
                    console.log(response);
                    $scope.Id               = response.Id;
                    $scope.TeacherTitle     = response.Title;
                    $scope.Email            = response.Email;
                    $scope.TeacherFirstname = response.Firstname;
                    $scope.TeacherLastname  = response.Lastname;
                    $scope.Gender           = response.Gender;
                    $scope.TeacherSchoolName = response.SchoolName;
                    $scope.UnreadInboxCount = response.UnreadInboxCount;
                    $scope.TeacherImage     = response.Image;
                    setOnlyCookie("teacherId",response.Id, 60 * 60 * 60); 
                    /*FETCH MY CLASSES*/
                    var teacherId = getOnlyCookie("teacherId");
                    setOnlyCookie("tab", "myClasses", 60 * 60 * 60);
                    $scope.myClassesResponse=function()
                    {
                        homeService.myClassesResponse(access_token, teacherId, function (response)
                        {
                            
                            //alert('my classes');
                            ///LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content4").css("display", "block");
                            $("#preloader_right_content4").css("display", "block");
                    
                            console.log("MY CLASSES");
                            console.log(response);
                            if(response.status)
                            {
                                ///LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content4").css("display", "none");
                                $("#preloader_right_content4").css("display", "none");
                                if(response != '')
                                {
                                    $scope.myClasses = response;
                                    $scope.classListMessage = "";
                                    $scope.classListMessage1 = "";
                                    $scope.classListMessage2 = "";
                                    $scope.classListMessage3 = "";
                                    $scope.classListMessage4 = "";
                                    $('.showStudentDiv').show();
                                    $('#noRecord4').removeClass('noRecord');
                                    $scope.defaultClassId = response[0].Id;
                                }else{
                                    $scope.myClasses = '';
                                    $scope.classListMessage = 'No Classes Found…';
                                    $scope.classListMessage1 = "Try:";
                                    $scope.classListMessage2 = "1. Reload the webpage.";
                                    $scope.classListMessage3 = "2. If the problem persists, please submit your query";
                                    $scope.classListMessage4="here.";
                                    $('.showStudentDiv').hide();
                                    $('#noRecord4').addClass('noRecord');
                                    $scope.defaultClassId="";
                                }     
                            } else if(response.msg == "ERR_INTERNET_DISCONNECTED"){ //ERROR : no internet connection
                                // alert('no internet');
                                //LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content4").css("display", "none");
                                $("#preloader_right_content4").css("display", "none");
                                $("#confy1").click();
                                $scope.msg = 'Server failed to respond. Please check your internet connection.';
                                $scope.myClasses = '';
                                $scope.classListMessage = 'No Classes Found…';
                                $scope.classListMessage1 = "Try:";
                                $scope.classListMessage2 = "1. Reload the webpage.";
                                $scope.classListMessage3 = "2. If the problem persists, please submit your query";
                                $scope.classListMessage4="here.";
                                $('.showStudentDiv').hide();
                                $('#noRecord4').addClass('noRecord');
                                $scope.defaultClassId="";
                            } else {  //ERROR : 500 in api
                                 ///LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content4").css("display", "none");
                                $("#preloader_right_content4").css("display", "none");
                                $scope.myClasses = '';
                                $scope.classListMessage = 'No Classes Found…';
                                $scope.classListMessage1 = "Try:";
                                $scope.classListMessage2 = "1. Reload the webpage.";
                                $scope.classListMessage3 = "2. If the problem persists, please submit your query";
                                $scope.classListMessage4="here.";
                                $('.showStudentDiv').hide();
                                $('#noRecord4').addClass('noRecord');
                                $scope.defaultClassId="";
                            } 
                            $(".right_srl ").mCustomScrollbar("update");
                        });
                    };
                    $scope.myClassesResponse();
                });
            }    
        }
        $scope.init();
        var teacherId = getOnlyCookie("teacherId");
        //$scope.toggle_status='tab';
        $scope.toggle_status_performance='';
        $scope.toggle_status_message='';
        $scope.toggle_status_back_btn='';
        $scope.toggle_status_my_classes='';
        $scope.toggle_status_my_timetable='';
        $scope.toggle_status_my_inbox='';
        $scope.toggle_status_my_task='';
        
        $('#createTaskPopUpClose').on('click', function(e)
        {
            $("select option[value='']").attr("selected","selected");
            $('.poplist').css({"display":"none"});
            $("#noRecord7").css("display", "none");
           // $("#createTaskMessage").css("display", "block");
        });
        
        /*ISO TO YYYY-mm-dd date conversion function*/
        $scope.ISOdateConvertion = function(ISOdate){
            ISOdate = (typeof ISOdate != 'undefined' && ISOdate != '')? ISOdate : new Date();
            var dateStr = new Date(ISOdate);
            var dateStr2 = dateStr.toISOString();
            var dateStr3 = new Date(dateStr2);
            var dateStr4 = dateStr3.getFullYear()+'-' + (dateStr3.getMonth()+1) + '-'+dateStr3.getDate();
            return dateStr4;
        }
        
        /*today date to be already selected in calendar ddp*/
        var todayTime = new Date();
        var month = (todayTime .getMonth() + 1);
        var day = (todayTime .getDate());
        var year = (todayTime .getFullYear());
        
        $scope.TodayYr = year;
        $scope.TodayMnth = month;
        $scope.TodayDay = day;

        var todayDate = year+'-'+month+'-'+day;
        var academicYear = year+'-09-01';
        
        console.log(todayDate+'  &&&&&&  '+academicYear);
        
        if(todayDate < academicYear){
            var nextYear = (todayTime .getFullYear() - 1);
            $scope.NextYr = nextYear;
        }else{
            var nextYear = (todayTime .getFullYear() + 1);
            $scope.NextYr = nextYear;
        }
        
        
        

            
    /*********************************TEACHER DETAILS & CLASSES begins****************************************************************/         
    /*********************************MY CLASSES SECTION begins****************************************************************/
            var InitStudentIds =  [];
            $scope.isChecked = function(id){            
                  return InitStudentIds.indexOf(id);
            }
         
            var isClicked = false;
            $scope.clickRow = function(){
                ///LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content").css("display", "block");
                $("#preloader_right_content").css("display", "block");
                setTimeout(function(){
                    $scope.clickTab();    
                },100);
            };
    
            $scope.clickTab = function (val)
            {
                  $('#message1').val('');
                //$scope.loader_right_content_show();
                if(!isClicked){
                    isClicked = true;
                    //console.time('clicked');
                    //console.log('clicked');
                    val = (typeof val != 'undefined')?val:"performance";
                    if (val == "performance") {
                        $("#performance_class").addClass("active");
                        $("#performance").addClass("in active");
                        if ($("#task_class").hasClass('active')) {
                            $("#task_class").removeClass('active');
                        }
                        if ($("#task").hasClass('active')) {
                            $("#task").removeClass('active');
                        }
                        if ($("#message_class").hasClass('active')) {
                            $("#message_class").removeClass('active');
                        }
                        if ($("#message").hasClass('active')) {
                            $("#message").removeClass('active');
                        }
                           
                    } else if (val == "task") {
                        
                        $("#task_class").addClass("active");
                        $("#task").addClass("in active");
                        if ($("#performance_class").hasClass('active')) {
                            $("#performance_class").removeClass('active');
                        }
                        if ($("#performance").hasClass('active')) {
                            $("#performance").removeClass('active');
                        }
                        if ($("#message_class").hasClass('active')) {
                            $("#message_class").removeClass('active');
                        }
                        if ($("#message").hasClass('active')) {
                            $("#message").removeClass('active');
                        }
                        $(".selectpicker").selectpicker('refresh');
                        
                    } else if (val == "message") {
                        $("#message_class").addClass("active");
                        $("#message").addClass("in active");
                        if ($("#task_class").hasClass('active')) {
                            $("#task_class").removeClass('active');
                        }
                        if ($("#task").hasClass('active')) {
                            $("#task").removeClass('active');
                        }
                        if ($("#performance_class").hasClass('active')) {
                            $("#performance_class").removeClass('active');
                        }
                        if ($("#performance").hasClass('active')) {
                            $("#performance").removeClass('active');
                        }
                        
                        $(".selectpicker").selectpicker('refresh');
                    }
                    setTimeout(function(){
                        isClicked = false;
                    },500);
                }
            };
            ///*print in performance page*/
            //$scope.performance_screenshot=function()
            //{
            //    ////var restorepage = document.body.innerHTML;
            //    //var printcontent = document.getElementById("performance").innerHTML;
            //    //document.body.innerHTML = printcontent;
            //    //window.print();
            //    ////document.body.innerHTML = restorepage;
            //       
            //    window.print();
            //}
            
            /*for toggle in 3-tabs in MY CLASSES*/
            $scope.cancelClickTab=function(val,$event)
            {

                /*todays date*/
                var todayTime     = new Date();
                var current_month = (todayTime .getMonth() + 1);
                var current_day   = (todayTime .getDate());
                var current_year  = (todayTime .getFullYear());
                //alert(current_year+' ## '+current_month+' ## '+current_day);
    
                var tasktype = $('#tasktype1').val();
                var title = $.trim($('#title1').val());
                var description = $.trim($('#description1').val());
                var day = $('#day1').val();
                var mnth = $('#mnth1').val();
                var year = $('#year1').val();
                var StudentIds = $.trim($('#studentIdsForCreateTask').val());
                var fileNum =$('#fileNum').val();
                 
                var flag = 0;
                
                if (StudentIds != '')
                {
                    flag++;
                }
                if(tasktype == '' || tasktype == null || tasktype == 'null')
                {
                    
                }else{
                    
                    flag++; 
                }
                if(title == ''|| title == null)
                {
                    
                }else{
                  
                    flag++; 
                }
                if(description == ''|| description == null)
                {
                   
                }else{
                   
                    flag++; 
                }
                if(day!=current_day || mnth!=current_month || year!=current_year)
                {
                   
                    flag++; 
                }
        
                if ( fileNum != 0 )
                {
                    
                    flag++; 
                }
          
                 //alert(flag);
                if ( flag > 0 ){
                    // ///LOADER HIDE
                    //$(window).scrollTop(0);
                    //$("#status_right_content").fadeOut();
                    //$("#preloader_right_content").fadeOut("slow");
                    
                    $scope.toggle_status_performance='';
                    $scope.toggle_status_message='';
                    $scope.toggle_status_back_btn='';
                    $scope.toggle_status_my_classes='';
                    $scope.toggle_status_my_timetable='';
                    $scope.toggle_status_my_inbox='';
                    $scope.toggle_status_my_task='';
        
                    $('#dataLostConfyTab').click();
                    flag = 0;
                
                } else if ( flag==0 && val=="performance" ){
                 
                    $scope.toggle_status_performance='tab';
                    ///LOADER SHOW
                    $(window).scrollTop(0);
                    $('.showStudentDiv').css('display','none');
                    $scope.performanceList="";
                    $("#status_right_content").css("display", "block");
                    $("#preloader_right_content").css("display", "block");
                } else if ( flag==0 && val=="message" ){
                   
                    $scope.toggle_status_message='tab';
                    $('#message1').val('');
                    ///LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content").css("display", "block");
                    $("#preloader_right_content").css("display", "block");
                } else if ( flag==0 && val=="back_btn" ){
            
                    $scope.toggle_status_back_btn='tab';
                    
                } else if ( flag==0 && val=="my_classes" ){
                
                    $scope.toggle_status_my_classes='tab';
                   
                    if ($($event.currentTarget).parent('li').hasClass('active')) {
                        $(".table_outter .right_content.tab-content .tab-pane.fade").removeClass('active').removeClass('in');
                        var currentTarget = $($event.currentTarget).data('target');
                        $(currentTarget).addClass('active in');
                        }
                        $(".right_srl").mCustomScrollbar("destroy"); 
                        $(".right_srl").mCustomScrollbar({
                        axis:"x",
                        theme:"3d",
                        scrollInertia:550,
                        scrollbarPosition:"outside"
                    });
                } else if ( flag==0 && val=="my_timetable" ){
              
                    $scope.toggle_status_my_timetable='tab';
                    //$("#performance_print_span").css("display", "none");
                } else if ( flag==0 && val=="my_inbox" ){
          
                    $scope.toggle_status_my_inbox='tab';
                    //LOADER SHOW
                    $(window).scrollTop(0);
                    $("#status_right_content8").css("display", "block");
                    $("#preloader_right_content8").css("display", "block");
                    
                } else if ( flag==0 && val=="my_task" ){
                    
                    $scope.toggle_status_my_task='tab';
                    $('#myTask').addClass('active');
                    //$("#performance_print_span").css("display", "none");
                }

                /*yes click in modal*/
                $scope.yesBtn=function()
                {
                    //alert(val);   
                    if (val=="performance") {
                        $scope.toggle_status_performance='tab';
                        $('#performance_tab').click();
                        ///LOADER SHOW
                        $(window).scrollTop(0);
                        $("#status_right_content").css("display", "block");
                        $("#preloader_right_content").css("display", "block");
                    } else if (val=="message") {
                        $scope.toggle_status_message='tab';
                        $('#message_tab').click();
                        ///LOADER SHOW
                        $(window).scrollTop(0);
                        $("#status_right_content").css("display", "block");
                        $("#preloader_right_content").css("display", "block");
                    } else if (val=="back_btn") {
                        $scope.toggle_status_back_btn='tab';
                        $('#back_btn').click();
                        //$("#performance_print_span").css("display", "none");
                    } else if (val=="my_classes") {
                        $scope.toggle_status_my_classes='tab';
                        $('#my_classes').click();
                        //$("#performance_print_span").css("display", "none");
                        if ($($event.currentTarget).parent('li').hasClass('active')) {
                            $(".table_outter .right_content.tab-content .tab-pane.fade").removeClass('active').removeClass('in');
                            var currentTarget = $($event.currentTarget).data('target');
                            $(currentTarget).addClass('active in');
                            }
                            $(".right_srl").mCustomScrollbar("destroy"); 
                            $(".right_srl").mCustomScrollbar({
                            axis:"x",
                            theme:"3d",
                            scrollInertia:550,
                            scrollbarPosition:"outside"
                        });
                    } else if (val=="my_timetable") {
                        $scope.toggle_status_my_timetable='tab';
                        $('#my_timetable').click();
                        
                    } else if (val=="my_inbox") {
                        $scope.toggle_status_my_inbox='tab';
                        $('#my_inbox').click();
                        //LOADER SHOW
                        $(window).scrollTop(0);
                        $("#status_right_content8").css("display", "block");
                        $("#preloader_right_content8").css("display", "block");
                    } else if (val=="my_task") {
                        $scope.toggle_status_my_task='tab';
                        $('#myTask').click();
                        $('#myTask').addClass('active');
                        //$("#performance_print_span").css("display", "none");
                    }
                    
                /*Reset all prefilled fields in MY CLASSES section*/
                    /*create task section*/
                    //alert('create task sec');
                    $("#taskCreateReset").click();
                    $("#tasktype1").val('Task Type');
                    $("#tasktype1").change();
                    $("#day1").change();
                    $("#mnth1").change();
                    $("#year1").change();
        
                    $scope.tasktypeErr = "";
                    $("#title1").attr("placeholder","Title").removeClass('red_place');
                    $("#description1").attr("placeholder","Description").removeClass('red_place');  
                    $scope.dateErr = "";
                    $scope.countSelectStudentsTask = 0;
                    $("#studentIdsForCreateTask").val('');
                    $scope.countSelectStudentsMessage = 0;
                    $("#studentIdsForMessage").val('');
                    /*clear the attachment div*/
                    $('#adddiv').html('');
                    /*reset file upload fields*/
                    $('#fileNum').val(0);
                    $('#file_size1').val(0);
                    /**************************/
                    $('#message1').html('');
                    
                    
                    /*create message section*/
                    $("#messageReset").click();
                    $('.studentListInMessageCheckbox').attr('checked', "false");
                    $('.studentListInMessageCheckbox').prop('checked', false);
                    $('#remember').attr('checked', "false");
                    $('#remember').prop('checked', false);
                    flag = 0;
                };
                
            };  
            
            
            /************************   ***** MY CLASSES SECTION begins *****  *************************************************
            ********************************************************************************************************************/         
                    
            /************************   ***** CREATE TASK SECTION *****  *************************/  
            $scope.createTask = function(ClassId,ClassName,SubjectName)
            {
                
                ///LOADER HIDE
                $(window).scrollTop(0);
                $("#status_right_content").fadeOut();
                $("#preloader_right_content").delay(200).fadeOut("fast");
                
                $("#performance_print_span").css("display", "none");
                /*fetch student list*/
                $scope.classId = ClassId;
                $scope.className = ClassName;
                $scope.subject = SubjectName;
                setOnlyCookie("classId", ClassId, 60 * 60 * 60);
             
                ///LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content").css("display", "block");
                $("#preloader_right_content").css("display", "block");
                
                homeService.studentListResponse(access_token, ClassId, function (response) {
                    console.log('STUDENT LIST');
                    console.log(response);
                    if(response.status){ 
                        ///LOADER HIDE
                        $(window).scrollTop(0);
                        $("#status_right_content").fadeOut();
                        $("#preloader_right_content").delay(200).fadeOut("slow");
                        
                        if(response != ''){
                            $('.showStudentDiv').show();
                            $scope.studentList = response;
                            $scope.noOfStudents = response.length;
                            $scope.IsUnlocked = response.IsUnlocked;
                            $scope.nostudentList="";
                            $scope.nostudentList1="";
                            $scope.nostudentList2="";
                            $scope.nostudentList3="";
                            $scope.nostudentlist4="";
                            $scope.studentListMessage = '';
                            $('#noRecord2').removeClass('noRecord');
                            $('#remember_1').removeAttr('checked');
                        }else{
                            $('.showStudentDiv').hide();
                            $scope.studentList = "";
                            $scope.noOfStudents = 0;
                            $scope.IsUnlocked = '';
                            
                            $scope.nostudentList = "No Students Found… ";
                            $scope.nostudentList1="Try: ";
                            $scope.nostudentList2="1. Reload the webpage.";
                            $scope.nostudentList3="2. If the problem persists, please submit your query";
                            $scope.nostudentlist4="here.";
                            $('#noRecord2').addClass('noRecord');
                        }      
                    } else if(response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                        $("#confy1").click();
                        $scope.msg = 'Server failed to respond. Please check your internet connection.';
                        $('.showStudentDiv').hide();
                        $scope.studentList = "";
                        $scope.noOfStudents = 0;
                        $scope.IsUnlocked = '';
                        $scope.nostudentList = "No Students Found… ";
                        $scope.nostudentList1="Try: ";
                        $scope.nostudentList2="1. Reload the webpage.";
                        $scope.nostudentList3="2. If the problem persists, please submit your query";
                        $scope.nostudentlist4="here.";
                        $('#noRecord2').addClass('noRecord');
                    } else {
                        $('.showStudentDiv').hide();
                        $scope.studentList = "";
                        $scope.noOfStudents = 0;
                        $scope.IsUnlocked = '';
                        $scope.nostudentList = "No Students Found… ";
                        $scope.nostudentList1="Try: ";
                        $scope.nostudentList2="1. Reload the webpage.";
                        $scope.nostudentList3="2. If the problem persists, please submit your query";
                        $scope.nostudentlist4="here.";
                        $('#noRecord2').addClass('noRecord');
                    }
                });
      
                /*COUNT SELECT STUDENT CHECKBOX IN TASK SECTION*/
                $scope.countSelectStudentsTask = 0;
                
                /*ONCLICK SELECT ALL CHECKBOX*/
                $scope.eachTaskClick = function (student_id) //click on each checkbox
                {     
                    var studentIds = new Array();
                    var i = 0;
                    $("input[type=checkbox]:checked").each(function ()
                    {
                        if ($(this).attr("studentIdTask") != undefined) 
                        {
                            studentIds[i] = $(this).attr("studentIdTask");
                            $("#studentListInTask"+studentIds[i]).addClass('active');
                            i++;
                        }    
                    });
                    var numberOfChecked = $('input:checkbox.studentListInTaskCheckbox:checked').length;
                    var totalCheckboxes = $('input:checkbox.studentListInTaskCheckbox').length;
                    //console.log(studentIds.length+"###"+totalCheckboxes);
                    if(studentIds.length!=totalCheckboxes)
                    {
                        $('#remember_1').prop('checked', false);
                    }else{
                        $('#remember_1').prop('checked', true);
                    }
                    $scope.countSelectStudentsTask = studentIds.length;
     
                    /*for active class :: click on each check box*/
                    if ($('#studentTask'+student_id).attr('checked')=="checked") {
                        setTimeout(function(){
                                        $('#studentTask'+student_id).attr('checked',false);},100);
                                        $('#studentListInTask'+student_id).removeClass('active');           
                    }else{
                        setTimeout(function(){
                                        $('#studentTask'+student_id).attr('checked',true);},100);
                                        $('#studentListInTask'+student_id).addClass('active');                      
                    }
        
                    //$scope.studentIdsForCreateTask = studentIds.toString();
                    document.getElementById('studentIdsForCreateTask').value=studentIds.toString();
                };
             
                $scope.allTaskClick = function () //click on select all checkbox
                {    
                    var studentIds = new Array();
                    var i = 0;
                    if(document.getElementById('remember_1').checked==true)
                    {            
                        $("input[name='studentListInTaskCheckbox[]']").each(function ()
                        {
                            console.log($(this).attr("studentIdTask"));
                            if ($(this).attr("studentIdTask") != undefined)
                            { 
                                studentIds[i] = $(this).attr("studentIdTask");  
                                $("#studentListInTask"+studentIds[i]).addClass('active');                          
                                var attr = $("#studentTask"+studentIds[i]).attr('checked');
                                           
                                // For some browsers, `attr` is undefined; for others,
                                // `attr` is false.  Check for both.
                                if (typeof attr == typeof undefined || attr == false) {
                                  
                                     $("#studentTask"+studentIds[i]).attr("checked", "true");
                                     $("#studentTask"+studentIds[i]).prop("checked",true);
                                }
                                i++;
                            }
                        });
                        //$(".user_box").addClass("active");
                        //$scope.studentIdsForCreateTask = studentIds.toString();
                        document.getElementById('studentIdsForCreateTask').value=studentIds.toString();
                    }else{
                        $("input[name='studentListInTaskCheckbox[]']").each(function ()
                        {                
                            if ($(this).attr("studentIdTask") != undefined)
                            {
                                studentIds[i] = $(this).attr("studentIdTask");  
                                $("#studentListInTask"+studentIds[i]).addClass('active');
                                var elm = $("#studentListInTask"+studentIds[i]);
                                i++;
                            }
                        });
                        $(".studentListInTaskCheckbox").removeAttr('checked');
                        $(".user_box").removeClass("active");
                        //$scope.studentIdsForCreateTask = "";
                        document.getElementById('studentIdsForCreateTask').value="";
                    }
    
                    var numberOfChecked = $('input:checkbox.studentListInTaskCheckbox:checked').length;
                    var totalCheckboxes = $('input:checkbox.studentListInTaskCheckbox').length;
                    $scope.countSelectStudentsTask = numberOfChecked;      
                };
                /*CALENDAR DROPDOWN ON CHANGE*/
                $scope.checkCalendar=function(val)
                {
                    var day = $('#day1').val();
                    var mnth = $('#mnth1').val();
                    var year = $('#year1').val();
                    //alert(day+' @@ '+mnth+' @@ '+year);
                    
                    var text = mnth+'/'+day+'/'+year;
                    var curDate='"'+mnth+'-'+day+'-'+year+'"';
                    var comp = text.split('/');
                    var m = parseInt(comp[0], 10);
                    var d = parseInt(comp[1], 10);
                    var y = parseInt(comp[2], 10);
                    var date = new Date(y,m-1,d);
                    if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
                        var dueDate = year+'-'+mnth+'-'+day+'T'+'00:00:00';
                        $scope.dateErr = "";
                    }else{
                        $scope.dateErr = "Please enter a valid date";     
                    }
                    
                    var dueDateToCompare = year+'-'+mnth+'-'+day;
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear();
                    if(dd<10){
                        dd='0'+dd
                    } 
                    if(mm<10){
                        mm='0'+mm
                    } 
                    var currentDate =yyyy+'-'+mm+'-'+dd;
                    //alert(dueDateToCompare +'@@@@@@@@@@@@@'+ currentDate);
                    if(dueDateToCompare >  currentDate){
                        var dueDate = year+'-'+mnth+'-'+day+'T'+'00:00:00';
                        $scope.dateErr = "";
                    }else if(dueDateToCompare == currentDate){
                        var dueDate = year+'-'+mnth+'-'+day+'T'+'00:00:00';
                        $scope.dateErr = "";
                    }else{ 
                        $scope.dateErr = "Please enter a date in the future";
                    }
                    
                    
                    /*today date to be already selected in calendar ddp*/
                    var todayTime = new Date();
                    var monthAcademic = (todayTime .getMonth() + 1);
                    var dayAcademic = (todayTime .getDate());
                    var yearAcademic = (todayTime .getFullYear());
                    var nextYearAcademic = (todayTime .getFullYear() + 1);
                    var academicYearStartDate = yearAcademic+'-'+'09'+'-'+'01';
                    var academicYearEndDate = nextYearAcademic+'-'+'08'+'-'+'31';
                    
                    //alert(academicYearStartDate+' ### '+academicYearEndDate +'###' + dueDateToCompare);
                    
                    if ( !((dueDateToCompare >= academicYearStartDate) && (dueDateToCompare <= academicYearEndDate)) ) {
                        $scope.dateErr = "Please select a date in the current academic year";
                    }else{
                        $scope.dateErr = "";  
                    }
                       
                };
                $('#adddiv1').html('');
                /*reset file upload fields*/
                $('#fileNum').val(0);
                $('#file_size1').val(0);
                /**************************/
                
                /*ONCLICK SET TASK BUTTON*/
                $scope.setTask = function()
                {
                    //spinningwheel.gif loader
                    //$('#loader_settask').show();
                    //return false;
                    
                    var tasktype = $('#tasktype1').val();
                    var title = $.trim($('#title1').val());
                    var description = $.trim($('#description1').val());
                    var classId = getOnlyCookie("classId");
        
                    var day = $('#day1').val();
                    var mnth = $('#mnth1').val();
                    var year = $('#year1').val();
                    var StudentIds = $('#studentIdsForCreateTask').val();
                    var tot_file_size = $('#file_size1').val();
                    
                    //alert(StudentIds+' *** '+tasktype);
                    var error = 0;
                    if(StudentIds == ''){
                       //alert("Please select students");
                        $("#confy").click();
                        $scope.message="Please select students";
                        error++;
                        return false;
                    }
                    if(tasktype=='' || tasktype==null)
                    {
                        $scope.tasktypeErr = "Please enter Task Type";
                        document.getElementById('tasktypeErr').innerHTML="Please enter Task Type";
                        error++;
                        return false;
                    }else{
                        $scope.tasktypeErr = "";
                    }
                    if( $('#title1').val().toString().trim() == '' )
                    {              
                        $('#title1').val('');
                        $("#title1").attr("placeholder","Please enter task title").addClass('red_place');
                        error++;
                        return false;
                    }else{
                        $("#title1").attr("placeholder","Title").removeClass('red_place');               
                    }
                    
                    if(title.length > 50)
                    {
                        $("#title1").attr("placeholder","Task title must not be more than 50 characters").addClass('red_place');
                        error++;
                        return false;
                    }else{
                        $("#title1").attr("placeholder","Title").removeClass('red_place');  
                    }
                    //if(description==''){}
                    if( $('#description1').val().toString().trim() == '' ) {              
                        $('#description1').val('');                               
                        $("#description1").attr("placeholder","Please enter task description").addClass('red_place');
                        error++;
                        return false;
                    }else{
                        $("#description1").attr("placeholder","Description").removeClass('red_place');  
                    }
                    if(description.length > 500)
                    {
                        $("#description1").attr("placeholder","Task description must not be more than 500 characters").addClass('red_place');
                        error++;
                        return false;
                    }else{
                        $("#description1").attr("placeholder","Description").removeClass('red_place');  
                    }
                    //if (tot_file_size >=5120000) {
                    //    document.getElementById('fileUploadErrMsg').innerHTML = "Total file size of attachments exceeded. Maximum 5MB permitted";
                    //    $("#fileErr").click();
                    //    error++;
                    //    return false;       
                    //}
                    if(day=='' || mnth=='' || year=='' || day==null || mnth==null || year==null)
                    {
                        $scope.dateErr = "Please select date";
                        error++;
                        return false;
                    }else{
                        $scope.dateErr = "";
                    }
                    
                    var text = mnth+'/'+day+'/'+year;
                    var curDate='"'+mnth+'-'+day+'-'+year+'"';
                    var comp = text.split('/');
                    var m = parseInt(comp[0], 10);
                    var d = parseInt(comp[1], 10);
                    var y = parseInt(comp[2], 10);
                    var date = new Date(y,m-1,d);
                    if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
                        var dueDate = year+'-'+mnth+'-'+day+'T'+'00:00:00';
                        $scope.dateErr = "";
                    }else{
                        $scope.dateErr = "Please enter a valid date";
                        error++;
                        return false;
                    }
                    
                    var dueDateToCompare = year+'-'+mnth+'-'+day;
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear();
                    if(dd<10){
                        dd='0'+dd
                    } 
                    if(mm<10){
                        mm='0'+mm
                    }
                    
                    /*today date to be already selected in calendar ddp*/
                    var todayTime = new Date();
                    var monthAcademic = (todayTime .getMonth() + 1);
                    var dayAcademic = (todayTime .getDate());
                    var yearAcademic = (todayTime .getFullYear());
                    var nextYearAcademic = (todayTime .getFullYear() + 1);
                    var academicYearStartDate = yearAcademic+'-'+'09'+'-'+'01';
                    var academicYearEndDate = nextYearAcademic+'-'+'08'+'-'+'31';
                    
                    var currentDate =yyyy+'-'+mm+'-'+dd;
                    //alert(dueDateToCompare +'@@@@@@@@@@@@@'+ currentDate);
                    if(dueDateToCompare > currentDate){
                        var dueDate = year+'-'+mnth+'-'+day+'T'+'00:00:00';
                        $scope.dateErr = "";
                    }else if(dueDateToCompare == currentDate){
                        var dueDate = year+'-'+mnth+'-'+day+'T'+'00:00:00';
                        $scope.dateErr = "";
                    }else{ 
                        $scope.dateErr = "Please enter a date in the future";
                        error++;
                        return false;
                    }
                    //alert(academicYearStartDate+' ### '+academicYearEndDate +'###' + dueDateToCompare);
                    if ( !((dueDateToCompare >= academicYearStartDate) && (dueDateToCompare <= academicYearEndDate)) ) {
                        $scope.dateErr = "Please select a date in the current academic year";
                        error++;
                        return false;
                    }else{
                        $scope.dateErr = "";  
                    }
                    
                    if(error == 0)
                    {
                        document.getElementById("setTaskBtn").disabled = true;
                        ///LOADER SHOW
                        $(window).scrollTop(0);
                        $("#status_right_content1").css("display", "block");
                        $("#preloader_right_content1").css("display", "block");
  
                        var nothing="";
                        //$('#studentIdsForCreateTask').val(nothing);
                       
                        fromDate = new Date(curDate);
                        fromDateTime = fromDate.getTime();
                        var weekDay = fromDate.getDay();
                        if (weekDay == 0) {  
                            var weekStart = $scope.ISOdateConvertion( (fromDateTime-(fromDate.getDay()*86400000))-(86400000*6) );
                            var weekEnd = $scope.ISOdateConvertion( ((fromDateTime-(fromDate.getDay()*86400000))) );
                        }else{
                            var weekStart = $scope.ISOdateConvertion( (((fromDateTime-(fromDate.getDay()*86400000))+86400000)) );
                            var weekEnd = $scope.ISOdateConvertion( (((fromDateTime-(fromDate.getDay()*86400000))+(86400000*7))) );
                        }
                        var k = 0;
                        $(".file_attachment_class1").each(function(){
                            //alert($(this).attr('id'));
                            var file_attachment_id = $.trim($(this).attr('id')).replace("file_attachment1", "");
                           
                            if(($('#individual_file_size1'+file_attachment_id).val()!=0) &&
                               ($('#individual_file_size1'+file_attachment_id).val()!='') &&
                               ($('#individual_file_size1'+file_attachment_id).val()!=undefined) &&
                               ($('#individual_file_size1'+file_attachment_id).val()!= 'undefined')) {
                                k++;
                            }
                        });
                  
                        if ( k != 0 )
                        {
                            //$("#myTask").on("click");
                            //$("#myTaskInner").on("click");
                            
                            //alert('file');
                            
                            var values=$('#uploadFile').val();
                            homeService.fileUpload(access_token,function (fileUploadResponse)
                            {
                                console.log("CTRL RESPONSE");
                                console.log(fileUploadResponse);
                                $scope.fileUploadResponse = fileUploadResponse;
                                // console.log(JSON.parse(fileUploadResponse));
                                homeService.setTaskResponse(access_token,StudentIds,tasktype,title,description,classId,dueDate,fileUploadResponse,function (response)
                                {
                                    console.log("setTaskResponse");
                                    console.log(response);
                                    document.getElementById("setTaskBtn").disabled = false;
                                    
                                    if(response == true)
                                    {
                                        //$('#loader_settask').hide();
                                        ///LOADER HIDE
                                        $(window).scrollTop(0);
                                        $("#status_right_content1").fadeOut();
                                        $("#preloader_right_content1").delay(200).fadeOut("slow");
                                     
                                        $scope.successMsg1 = 'Task successfully set';
                                        $('#successMsg1').click();
                                        $("#taskCreateReset").click();
                                        setTimeout(function () {
                                            setOnlyCookie("weekStartDate", convertDate(weekStart), 60 * 60 * 60);
                                            setOnlyCookie("weekEndDate", convertDate(weekEnd), 60 * 60 * 60);
                                            $scope.toggle_status_my_task = "tab";
                                            $("#myTask").click();
                                        }, 500); 
                                    }else{
                                        //$('#loader_settask').hide();
                                        ///LOADER HIDE
                                        $(window).scrollTop(0);
                                        $("#status_right_content1").fadeOut();
                                        $("#preloader_right_content1").delay(200).fadeOut("slow");
                                 
                                        $scope.successMsg1 = 'Task not set';
                                        $('#successMsg1').click();
                                        $("#taskCreateReset").click();
                                    }
                                    setTimeout(function () {
                                         $('.modal-backdrop').hide(); // for black background
                                         $('body').removeClass('modal-open'); // For scroll run
                                         $('#successMsg_modal1').modal('hide');                                     
                                    }, 1500); 
                                });
                            });
                        }else{
                            //$("#myTask").on("click");
                            //$("#myTaskInner").on("click");
                           
                           // alert('no file');
                            
                            var fileUploadResponse = null;
                            homeService.setTaskResponse(access_token,StudentIds,tasktype,title,description,classId,dueDate,fileUploadResponse,function (response)
                            {
                                console.log("setTaskResponse");
                                console.log(response);
                                document.getElementById("setTaskBtn").disabled = false;
                                if(response == true)
                                {
                                    //$('#loader_settask').hide();
                                    ///LOADER HIDE
                                    $(window).scrollTop(0);
                                    $("#status_right_content1").fadeOut();
                                    $("#preloader_right_content1").delay(200).fadeOut("slow");
                         
                                    $scope.successMsg1 = 'Task successfully set';
                                    $('#successMsg1').click();
                                    $("#taskCreateReset").click();
                                    setTimeout(function () {
                                        setOnlyCookie("weekStartDate", convertDate(weekStart), 60 * 60 * 60);
                                        setOnlyCookie("weekEndDate", convertDate(weekEnd), 60 * 60 * 60);
                                        $scope.toggle_status_my_task = "tab";
                                        $("#myTask").click();
                                    }, 200); 
                                }else{
                                    //$('#loader_settask').hide();
                                    ///LOADER HIDE
                                    $(window).scrollTop(0);
                                    $("#status_right_content1").fadeOut();
                                    $("#preloader_right_content1").delay(200).fadeOut("slow");
                                  
                                    $scope.successMsg1 = 'Task not set';
                                    $('#successMsg1').click();
                                    $("#taskCreateReset").click();
                                }
                                setTimeout(function () {
                                    $('.modal-backdrop').hide(); // for black background
                                    $('body').removeClass('modal-open'); // For scroll run
                                    $('#successMsg_modal1').modal('hide');                                                     
                                }, 1500); 
                            });
                        }
                    }  
                };
                
                //var AttachmentCount = $('#file_attachment1').val();
                //$scope.AttachmentCount = AttachmentCount + 1;
                //$scope.removeAttachmentCreateTask = function(val)
                //{
                //    alert(val);
                //   //$scope.files.splice(attachmentName,1);
                //  
                //    $("#attachmentCreateTask"+val).remove();
                //    var fileNum=parseInt($('#fileNum').val())-1;
                //    $('#fileNum').val(fileNum);
                //   
                //};
                
                var dynamicId = 0;
                $scope.attach=function()
                {
                    var fileNum=parseInt($('#fileNum').val());
                    if (fileNum < 4){
                        fileNum=fileNum+1;
                        $('#fileNum').val(fileNum);
                        dynamicId++;
                        //alert(dynamicId);
                        $('#adddiv1').append('<div class="pdf_pic clearfix" style="cursor: pointer;" id="attachmentCreateTask'+(dynamicId-1)+'"><div class="pdf_left attachmentEditNew w3attach"><input id="file_attachment1'+(dynamicId-1)+'" type="file" class="upload file_attachment_class1" style="cursor: pointer;opacity: 0;position: absolute;" onclick="file_upload1('+(dynamicId-1)+');" /><label class="file_div attc" for="file_attachment1'+(dynamicId-1)+'"><a class="vcard-hyperlink" href="javascript:void(0)"><img src="images/push-pin.png" alt=""><span class="ng-binding fleSpan" id="span1'+(dynamicId-1)+'">Choose file..</span></a></label></div><span onclick="removeAttachmentCreateTask('+(dynamicId-1)+');" class="remove_btn_class"><i class="fa fa-times" aria-hidden="true"></i></span><input type="hidden" id="individual_file_size1'+(dynamicId-1)+'" value="0" class="indiFsize"></div>');
                        
                      
                        $("#file_attachment1"+(dynamicId-1)).click();
                  
                        //$('#file_attachment1'+(dynamicId-1)).bind('change', function(event)
                        //{
                        //    var file_size1 = this.files[0].size;
                        //    $('#individual_file_size'+(dynamicId-1)).val(file_size1);
                        //    var tot_file_size = parseInt($('#file_size1').val()) + parseInt(file_size1);
                        //    if (tot_file_size >=5120000) {
                        //        document.getElementById('fileUploadErrMsg').innerHTML = "Total file size of attachments exceeded. Maximum 5MB permitted";
                        //        $("#fileErr").click();
                        //        /*remove file div*/
                        //        // $("#attachmentCreateTask"+dynamicId).remove();
                        //    }else{
                        //        var file_name = this.files[0].name;
                        //        $("#span"+(dynamicId-1)).html(this.files[0].name);
                        //        //$("#file_attachment_name"+dynamicId).html(this.files[0].name);
                        //        $('#file_attachment1'+(dynamicId-1)).attr('disabled',true);
                        //        $('#file_size1').val(tot_file_size);
                        //    }
                        //});
                       
                    }else{
                        document.getElementById('fileUploadErrMsg').innerHTML = "A maximum of 4 attachments is permitted";
                        $("#fileErr").click();
                    }
                    
                    if (fileNum == 1){
                        $('#attach_pic1').css("display", "none");
                        $('#add_more').css("display", "block");
                    }
                };
            };
            
            /************************   ***** SEND MESSAGE SECTION *****  ****************************************/
            /*SELECT STUDENT CHECKBOX IN MESSAGE SECTION*/
            $scope.sendMessage = function(ClassId,ClassName,SubjectName)
            {
                ///LOADER HIDE
                $(window).scrollTop(0);
                $("#status_right_content").show();
                $("#preloader_right_content").show();
                $("#performance_print_span").css("display", "none");
                /*fetch student list*/
                $scope.classId = ClassId;
                $scope.className = ClassName;
                $scope.subject = SubjectName;
                setOnlyCookie("classId", ClassId, 60 * 60 * 60);
             
                homeService.studentListResponse(access_token, ClassId, function (response)
                {
                    console.log('STUDENT LIST');
                    console.log(response);
                    if(response.status){ 
                        ///LOADER HIDE
                        $(window).scrollTop(0);
                        $("#status_right_content").hide();
                        $("#preloader_right_content").hide();
                        
                        if(response != ''){
                            $('.showStudentDiv').show();
                            $('#noRecord3').removeClass('noRecord');
                            $scope.studentListmsg = response;
                            $scope.noOfStudents = response.length;
                            $scope.IsUnlocked = response.IsUnlocked;
                            $scope.nostudentList="";
                            $scope.nostudentList1="";
                            $scope.nostudentList2="";
                            $scope.nostudentList3="";
                            $scope.nostudentList4="";
                            $scope.studentListMessage = '';
                            $('#remember').removeAttr('checked');
                        }else{
                            $('.showStudentDiv').hide();
                            $('#noRecord3').addClass('noRecord');
                            $scope.studentListmsg = "";
                            $scope.noOfStudents = 0;
                            $scope.IsUnlocked = '';
                            $scope.nostudentList = "No Students Found… ";
                            $scope.nostudentList1="Try: ";
                            $scope.nostudentList2="1. Reload the webpage.";
                            $scope.nostudentList3="2. If the problem persists, please submit your query";
                            $scope.nostudentList4="here.";
                        }      
                    } else if(response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                        ///LOADER HIDE
                        $(window).scrollTop(0);
                        $("#status_right_content").hide();
                        $("#preloader_right_content").hide();
                        $("#confy1").click();
                        $scope.msg = 'Server failed to respond. Please check your internet connection.';
                        
                        $('.showStudentDiv').hide();
                        $('#noRecord3').addClass('noRecord');
                        $scope.studentListmsg = "";
                        $scope.noOfStudents = 0;
                        $scope.IsUnlocked = '';
                        $scope.nostudentList = "No Students Found… ";
                        $scope.nostudentList1="Try: ";
                        $scope.nostudentList2="1. Reload the webpage.";
                        $scope.nostudentList3="2. If the problem persists, please submit your query";
                        $scope.nostudentList4="here.";
                        
                    } else {
                        ///LOADER HIDE
                        $(window).scrollTop(0);
                        $("#status_right_content").hide();
                        $("#preloader_right_content").hide();
                        
                        $('.showStudentDiv').hide();
                        $('#noRecord3').addClass('noRecord');
                        $scope.studentListmsg = "";
                        $scope.noOfStudents = 0;
                        $scope.IsUnlocked = '';
                        $scope.nostudentList = "No Students Found… ";
                        $scope.nostudentList1="Try: ";
                        $scope.nostudentList2="1. Reload the webpage.";
                        $scope.nostudentList3="2. If the problem persists, please submit your query";
                        $scope.nostudentList4="here.";
                        
                    }
                });
                
                homeService.predefinedMessagesResponse(access_token, teacherId, function (response)
                {
                    console.log('PREDEFINED MESSAGES LIST');
                    console.log(response);
                    if(response.status){ 
                        if(response != ''){
                            $('#pre_msg').show();
                            $scope.predefinedMessages = response;
                            $scope.errorMsg = "";
                        }else{
                            $('#pre_msg').hide();
                            $scope.predefinedMessages = "";
                            $scope.errorMsg = "No predefined messages found.";
                        }      
                    } else if(response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                        $('#pre_msg').hide();
                        $scope.predefinedMessages = "";
                        $scope.errorMsg = "No predefined messages found.";
                    } else {
                        $('#pre_msg').hide();
                        $scope.predefinedMessages = "";
                        $scope.errorMsg = "No predefined messages found.";
                    }
                });
                       
                $scope.countSelectStudentsMessage = 0;
                $scope.eachMessageClick = function (student_id)
                {
                        var studentIds = new Array();
                        var i = 0;
                        $("input[type=checkbox]:checked").each(function ()
                        {
                            if ($(this).attr("studentIdMessage") != undefined)
                            {
                                studentIds[i] = $(this).attr("studentIdMessage");
                                $("#studentListInMessage"+studentIds[i]).addClass('active');   
                                i++;
                            }
                        });
                        var numberOfChecked = $('input:checkbox.studentListInMessageCheckbox:checked').length;
                        var totalCheckboxes = $('input:checkbox.studentListInMessageCheckbox').length;
                        //console.log(studentIds.length+"###"+totalCheckboxes);
                        if(studentIds.length!=totalCheckboxes)
                        {
                            $('#remember').prop('checked', false);
                        }else{
                            $('#remember').prop('checked', true);
                        }
                        $scope.countSelectStudentsMessage = studentIds.length;
               
                        /*for active class :: click on each check box*/
                        if ($('#studentMessage'+student_id).attr('checked')=="checked") {
                            setTimeout(function(){
                                            $('#studentMessage'+student_id).attr('checked',false);},100);
                                            $('#studentListInMessage'+student_id).removeClass('active');           
                        }else{
                            setTimeout(function(){
                                            $('#studentMessage'+student_id).attr('checked',true);},100);
                                            $('#studentListInMessage'+student_id).addClass('active');                      
                        }
                        //$scope.studentIdsForMessage = studentIds.toString();
                        document.getElementById('studentIdsForMessage').value=studentIds.toString();
                };
                
                $scope.allMessageClick = function ()
                {
                        var studentIds = new Array();
                        var i = 0;
                        
                        if(document.getElementById('remember').checked==true)
                        {
                            $("input[name='studentListInMessageCheckbox[]']").each(function ()                  
                            {                
                                if ($(this).attr("studentIdMessage") != undefined)
                                {
                                    studentIds[i] = $(this).attr("studentIdMessage");  
                                    $("#studentListInMessage"+studentIds[i]).addClass('active');
                                    var attr = $("#studentMessage"+studentIds[i]).attr('checked');
                                    // For some browsers, `attr` is undefined; for others,
                                    // `attr` is false.  Check for both.
                                    if (typeof attr == typeof undefined || attr == false) {
                                      
                                         $("#studentMessage"+studentIds[i]).attr("checked", "true");
                                         $("#studentMessage"+studentIds[i]).prop("checked",true);
                                    }
                                    i++;
                                }
                            });
                            //$(".studentListInMessageCheckbox").attr("checked", "true");
                            //$(".user_box").addClass("active");
                            //$scope.studentIdsForMessage = studentIds.toString();
                            document.getElementById('studentIdsForMessage').value=studentIds.toString();
                        }else{
                          
                            $("input[name='studentListInMessageCheckbox[]']").each(function ()        
                            {                
                                if ($(this).attr("studentIdMessage") != undefined)
                                {
                                    studentIds[i] = $(this).attr("studentIdMessage");  
                                    $("#studentListInMessage"+studentIds[i]).addClass('active');
                                    var elm = $("#studentListInMessage"+studentIds[i]);
                                 
                                    i++;
                                }
                            });
                            $(".studentListInMessageCheckbox").removeAttr('checked');
                            $(".user_box").removeClass("active");
                            //$scope.studentIdsForMessage = "";
                            document.getElementById('studentIdsForMessage').value="";
                        }
        
                        var numberOfChecked = $('input:checkbox.studentListInMessageCheckbox:checked').length;
                        var totalCheckboxes = $('input:checkbox.studentListInMessageCheckbox').length;
                        $scope.countSelectStudentsMessage = numberOfChecked;
               
                };
              
                $scope.predefinedMessageDisplay = function(msg)
                {
        
                   $('#message1').val(function(_, val){return val + msg; }); 
                };
                /*ONCLICK SEND MESSAGE BUTTON*/
                $scope.sendMessageBtnClick = function()
                {
                    var message = $('#message1').val();
                    var StudentIds = $('#studentIdsForMessage').val();
              
                    var error = 0;
                    if(StudentIds == '')
                    {
                        $("#confy").click();
                        $scope.message="Please select students";
                        error++;
                        return false;
                    }
                    if( $('#message1').val().toString().trim() == '' )
                    {              
                        $('#message1').val('');                               
                        $("#message1").attr("placeholder","Please enter message").addClass('red_place');
                        error++;
                        return false;
                    }else{
                        $("#message1").attr("placeholder","Type Message Here").removeClass('red_place');  
                    }
                    if(message.length > 500)
                    {
                        $("#message1").attr("placeholder","Message must not be more than 500 characters").addClass('red_place');
                        error++;
                        return false;
                    }else{
                        $("#message1").attr("placeholder","Type Message Here").removeClass('red_place');  
                    }
                    //alert(error);
                    if(error == 0)
                    {
                        document.getElementById("sendMessageBtn").disabled = true;
                        /////LOADER SHOW
                        //$(window).scrollTop(0);
                        //$("#status_right_content1").css("display", "block");
                        //$("#preloader_right_content1").css("display", "block");

                        homeService.studentParentMessageSend(access_token,StudentIds,ClassId,message,function (response)
                        {
                            console.log("sendMessageResponse");
                            console.log(response);
                            document.getElementById("sendMessageBtn").disabled = false;
                            
                            if(response == true)
                            {
                                ///LOADER HIDE
                                //$(window).scrollTop(0);
                                //$("#status_right_content1").fadeOut();
                                //$("#preloader_right_content1").delay(200).fadeOut("slow");
                             
                                $scope.successMsg1 = 'Message successfully sent';
                                $('#successMsg1').click();
                                $("#messageReset").click();
                        
                            }else{
                                ///LOADER HIDE
                                //$(window).scrollTop(0);
                                //$("#status_right_content1").fadeOut();
                                //$("#preloader_right_content1").delay(200).fadeOut("slow");
                         
                                $scope.successMsg1 = 'Message not sent';
                                $('#successMsg1').click();
                                $("#messageReset").click();
                            }
                            setTimeout(function () {
                                $('.modal-backdrop').hide(); // for black background
                                $('body').removeClass('modal-open'); // For scroll run
                                $('#successMsg_modal1').modal('hide');                                     
                            }, 1500); 
                        });
                    }  
                };
            };
            
            //removing the validation error of task type dropdown field of create task on mouse click
            $scope.onCategoryChange1=function()
            {
                $('#tasktypeErr').html('');
                var tasktype1 = $('#tasktype1').val();
                if(tasktype1=='' || tasktype1==null)
                {
                    $scope.tasktypeErr = "Please select task type";
                    return false;
                }else{
                    $scope.tasktypeErr = "";
                }
            }
            
            //removing the validation error of title field of create task on mouse click
            $( "#title1" ).mousedown(function() {
                $("#title1").attr("placeholder","Title").removeClass('red_place');  
            });
            
             //removing the validation error of decsription field of create task on mouse click
            $( "#description1" ).mousedown(function() {
                $("#description1").attr("placeholder","Description").removeClass('red_place');  
            });
            
            
            /************************   ***** PERFORMANCE SECTION (MY CLASSES)*****  ****************************************/
      
            /*FOR PERFORMANCE TABBING (CLASSWISE)*/
            $scope.classPerformance = function(ClassId,ClassName,SubjectName)
            {
                ///LOADER HIDE
                $(window).scrollTop(0);
                $("#status_right_content").fadeOut();
                $("#preloader_right_content").delay(200).fadeOut("fast");
                
                //alert(ClassId);
                $("#performance_print_span").css("display", "block");
                //alert(ClassId+" ## "+ClassName+" ## "+SubjectName);
                $scope.classId = ClassId;
                $scope.className = ClassName;
                $scope.subject = SubjectName;
                setOnlyCookie("classId", ClassId, 60 * 60 * 60);
       
                $scope.graph_screenshot = function()
                {
                    var restorepage = document.body.innerHTML;
                    var printcontent = document.getElementById("student_performance").innerHTML;
                    document.body.innerHTML = printcontent;
                    window.print();
                    document.body.innerHTML = restorepage;
                };
    
                setTimeout(function()
                {
                    homeService.performanceListResponse(access_token,ClassId, function (response)
                    {
                        console.log('PERFORMANCE');
                        console.log(response);
                        if(response.status)
                        {
                            ///LOADER HIDE
                            $(window).scrollTop(0);
                            $("#status_right_content").fadeOut();
                            $("#preloader_right_content").delay(200).fadeOut("slow");
                            if(response != '')
                            {
                                $('.showStudentDiv').show();
                                $scope.performanceList = response;
                                $scope.noOfStudents = response.length;
                                $scope.studentListMessagePerformance = "";
                                $scope.studentListMessagePerformance1="";
                                $scope.studentListMessagePerformance2="";
                                $scope.studentListMessagePerformance3="";
                                $scope.studentListMessagePerformance4="";
                                $('#noRecord1').removeClass('noRecord');
                            }else{
                                $('.showStudentDiv').hide();
                                $scope.performanceList = '';
                                $scope.noOfStudents = 0;
                                //  $scope.studentListMessagePerformance = "No Performance Data Found…… Try: 1. Reload the webpage. 2. If the problem persists, please submit your query to support@involvedtech.co.uk using your school email address.";
                                $scope.studentListMessagePerformance = "No Students Found… ";
                                $scope.studentListMessagePerformance1="Try: ";
                                $scope.studentListMessagePerformance2="1. Reload the webpage.";
                                $scope.studentListMessagePerformance3="2. If the problem persists, please submit your query";
                                $scope.studentListMessagePerformance4="here.";
                                $('#noRecord1').addClass('noRecord');
                            }     
                        } else if(response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                            $('.showStudentDiv').hide();
                            $("#confy1").click();
                            $scope.msg = 'Server failed to respond. Please check your internet connection.';
                            $scope.performanceList = '';
                            $scope.noOfStudents = 0;
                            //$scope.studentListMessagePerformance = "No Performance Data Found…… Try: 1. Reload the webpage. 2. If the problem persists, please submit your query to support@involvedtech.co.uk using your school email address.";
                            $scope.studentListMessagePerformance = "No Students Found… ";
                            $scope.studentListMessagePerformance1="Try: ";
                            $scope.studentListMessagePerformance2="1. Reload the webpage.";
                            $scope.studentListMessagePerformance3="2. If the problem persists, please submit your query";
                            $scope.studentListMessagePerformance4="here.";
                            $('#noRecord1').addClass('noRecord');
                        } else {
                            $('.showStudentDiv').hide();
                            $scope.performanceList = '';
                            $scope.noOfStudents = 0;
                            //$scope.studentListMessagePerformance = "No Performance Data Found…… Try: 1. Reload the webpage. 2. If the problem persists, please submit your query to support@involvedtech.co.uk using your school email address.";
                            $scope.studentListMessagePerformance = "No Students Found… ";
                            $scope.studentListMessagePerformance1="Try: ";
                            $scope.studentListMessagePerformance2="1. Reload the webpage.";
                            $scope.studentListMessagePerformance3="2. If the problem persists, please submit your query";
                            $scope.studentListMessagePerformance4="here.";
                            $('#noRecord1').addClass('noRecord');
                        }
                    });
                },200);
    
                /* STUDENT GRAPH POP UP */
                $scope.studentPerformance = function(studentId,Firstname,Lastname,Image,Attendance,TargetGrade,LastGrade,AttendanceTrend,GradeTrend,IsUnlocked)
                {
                    
                    //alert('studentPerformance   '+GradeTrend);
                    //code form svg image
                        setTimeout(function () {
                            if(parseInt($('#carbs-input').val()) <= 100 && parseInt($('#carbs-input').val()) >= 0 ){
                              $percent = parseInt(( $('#carbs-input').val() * 22.1));
                                $('#carbs1').css({'stroke-dashoffset':2210 - $percent});
                                $('#carbs2').css({'stroke-dashoffset':2210 - $percent});
                                $('#carbs3').css({'stroke-dashoffset':2210 - $percent});  
                            }else{
                              $('#carbs-input').val('');
                            }
                        },500);
  
                        //alert(studentId +' ######## '+ ClassId +' ######## '+ClassName+' ######## '+SubjectName);
                        $scope.ClassName = ClassName;
                        $scope.SubjectName = SubjectName;
                        $scope.Firstname = Firstname;
                        $scope.Lastname = Lastname;
                        $scope.Image = Image;
                        if (IsUnlocked==1) {
                            $scope.IsUnlocked="outer_border";
                        }else
                        {
                            $scope.IsUnlocked="";
                        }
                        $scope.Attendance=Attendance;
                        $scope.TargetGrade=TargetGrade;
                        $scope.LastGrade=LastGrade;
                        $scope.AttendanceTrend=AttendanceTrend;
                        $scope.GradeTrend=GradeTrend;
                        if (GradeTrend == true) {
                            $scope.plotcolor = "#5BD9A4";
                        }else if (GradeTrend == false) {
                            $scope.plotcolor = "#FF5958";
                        }else{
                            $scope.plotcolor = "orange";
                        }
                        
                        /////LOADER SHOW
                        $(window).scrollTop(0);
                        $("#status_right_content7").css("display", "block");
                        $("#preloader_right_content7").css("display", "block");
                        
                        homeService.studentPerformanceListResponse(access_token,ClassId,studentId, function (response)
                        {                           
                            console.log('PERFORMANCE STUDENT');
                            console.log(response);
                            if(response.status)
                            {
                                /////LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content7").css("display", "none");
                                $("#preloader_right_content7").css("display", "none");
                                if(response != '')
                                {
                                    $scope.studentPerformanceList = response;
                                    //$scope.studentListMessagePopup = '';
                                    //$('.noRecordClass').removeClass('noRecord');
                                    GradeSetCode = new Array();
                                    GradeSetValue = new Array();
                                    GradeResultsDate = new Array();
                                    GradeResultsGrade = new Array();
                                    GradeResultsName = new Array();
                                    Grade_and_Date = new Array();
                                    GradeResultsDateTime = new Array();
                                    GradeResultsSplit=new Array();
                                    GradeResultsYear=new Array();
                                    GradeResultsMnth=new Array();
                                    GradeResultsDay=new Array();
                                    GradeResultsGraphDate=new Array();
                                    GradeResultsDateTimeYaxis=new Array();
                         
                                    TargetGradeDate=new Array();
                                    TargetGradeDateSplit=new Array();
                                    TargetGradeDatePlot=new Array();
                                    TargetGradeGradePlot=new Array();
                                    TargetGradeDatePlotYear=new Array();
                                    TargetGradeDatePlotMnth=new Array();
                                    TargetGradeDatePlotDay=new Array();
                                    TargetGradeResultsGrade=new Array();
                                    
                                    XaxisGradesDate=new Array();
                                    XaxisGradesDateSplit=new Array();
                                    XaxisGradesDatePlotYear=new Array();
                                    XaxisGradesDatePlotMnth=new Array();
                                    XaxisGradesDatePlotDay=new Array();
                                    XaxisGradesGradePlot=new Array();
                                    XaxisGradesResultsGrade=new Array();
                             
                                    for(var i=0; i<response.GradeSet.length; i++)
                                    {
                                        GradeSetCode[i]  = response.GradeSet[i].Code;
                                        GradeSetValue[i] = response.GradeSet[i].Value;
                                    }
                                    for(var j=0; j<response.GradeResults.length; j++)
                                    {
                                        GradeResultsDate[j]  = convertDate(response.GradeResults[j].Date);
                                        GradeResultsSplit[j] = GradeResultsDate[j].split('-');
                                        GradeResultsYear[j]  = parseInt(GradeResultsSplit[j][0]);
                                        GradeResultsMnth[j]  = parseInt(GradeResultsSplit[j][1]);
                                        GradeResultsDay[j]   = parseInt(GradeResultsSplit[j][2]);
                                        
                                        GradeResultsGraphDate[j] = GradeResultsYear[j]+','+GradeResultsMnth[j]+','+GradeResultsDay[j];
                                        
                                        GradeResultsGrade[j] = response.GradeResults[j].Grade;
                                        GradeResultsName[j]  = response.GradeResults[j].Name;
              
                                        GradeResultsDateTime[j] = Date.UTC(GradeResultsYear[j]+","+GradeResultsMnth[j]+","+GradeResultsDay[j]);
                                    }
                                    for(var k=0; k<response.TargetGrades.length; k++)
                                    {
                                        TargetGradeDate[k] = convertDate(response.TargetGrades[k].Date);     
                                        TargetGradeDateSplit[k] = TargetGradeDate[k].split('-');
                                        TargetGradeDatePlotYear[k]  = parseInt(TargetGradeDateSplit[k][0]);
                                        TargetGradeDatePlotMnth[k]  = parseInt(TargetGradeDateSplit[k][1]);
                                        TargetGradeDatePlotDay[k]   = parseInt(TargetGradeDateSplit[k][2]);
                                        TargetGradeDatePlot[k]  = Date.UTC(TargetGradeDatePlotYear[k],TargetGradeDatePlotMnth[k],TargetGradeDatePlotDay[k]);
                                        TargetGradeGradePlot[k] = response.TargetGrades[k].Grade;
                                    }
                                    
                                /*calculation of academic year*/    
                                var todayTime = new Date();
                                var monthAcademic = (todayTime .getMonth() + 1);
                                var dayAcademic = (todayTime .getDate());
                                var yearAcademic = (todayTime .getFullYear());
                                var nextYearAcademic = (todayTime .getFullYear() + 1);
                                var academicYearStartDate = yearAcademic+'-'+'09'+'-'+'01';
                                var academicYearEndDate = nextYearAcademic+'-'+'08'+'-'+'31';
                                
                                var current_date = yearAcademic+'-'+monthAcademic+'-'+dayAcademic;
                                
                                if ( (current_date >= academicYearStartDate) ) {
                                        var currentAcademicYear1 = yearAcademic;
                                        var currentAcademicYear2 = yearAcademic + 1;
                                }else{
                                        var currentAcademicYear1 = yearAcademic - 1;
                                        var currentAcademicYear2 = yearAcademic;
                                }
                                                        
                                console.log(currentAcademicYear1 +' #### '+ currentAcademicYear2);                        
                                console.log('GRAPH RESPONSE');
                                console.log(response);
                    
                                var TargetGradeDateTimeXaxisPlot = [];
                                var openTooltips = [];
                                $('#graph_container').css({'display':'block'});
                                //////////  PERFORMANCE GRAPH BEGIN /////////////////
                                $(document).ready(function() {
                                    $('#graph_container').highcharts({
                                        exporting: { enabled: false },
                                        chart: {
                                            type: 'line'
                                        },
                                        title: {
                                            text: '<h2><b>Performance Graph</b></h2>'
                                        },
                                        xAxis: {
                                            type: 'datetime',
                                            title: {
                                                text: 'Month'
                                            },
                                            //dateTimeLabelFormats: { 
                                            //    month: '%b %Y',
                                            //    
                                            //},
                                            //categories: (function () {                                     
                                            //                for (var r=0; r<TargetGradeDateTime.length; r++)
                                            //                {
                                            //                    GradeResultsDateTimeYaxis[r] = TargetGradeDateTime[r];
                                            //                    return GradeResultsDateTimeYaxis[r];
                                            //                }
                                            //            }()),
                                            labels: {
                                                format: '{value:%b %Y}',
                                                style: {
                                                        fontWeight:'bold'
                                                    }
                                            },
                                            gridLineWidth: 1,   
                                        },
                                        yAxis: {
                                            min: 0,
                                           // tickInterval: 1,
                                            labels: {
                                                    formatter: function() {
                                                        if (GradeSetCode[this.value] != undefined ) {
                                                             return '<b>'+GradeSetCode[this.value]+'</b>';
                                                        }
                                                    }
                                            },
                                            //categories: GradeSetCode,
                                            title: {
                                               text: 'Grade'
                                            },
                                            //linkedTo: 0,
                                            //from: GradeSetCode[0]
                                        },
                                        plotOptions: {
                                                //spline: {
                                                //    marker: {
                                                //        enabled: true,
                                                //        radius: 3,
                                                //    },
                                                //},
                                                scatter: {
                                                  lineWidth: 2,
                                                },
                                                series: {
                                                    pointStart: Date.UTC(currentAcademicYear1, 7, 1),
                                                    pointInterval: 15*24 * 3600 * 1000// one day
                                                }
                                        },
                                        tooltip: {
                                            useHTML: true,
                                            formatter: function() {
                                                var tooltiptxt='';
                                                if(this.series.name == 'Grade') {
                                                      tooltiptxt = '<b>'+GradeResultsName[this.y] +'</b><br> Grade '+GradeSetCode[this.y]+', '+Highcharts.dateFormat('%e %b %Y',new Date(this.x));
                                                      return tooltiptxt;
                                                }else{
                                                     return false;
                                                }
                                            },
                                            shared: false,
                                            backgroundColor: $scope.plotcolor,
                                            style: {
                                                color: 'white'
                                            },  
                                        },
                                        legend: {
                                            enabled: false
                                        },
                                        
                                        series: [
                                            {
                                                name: 'XaxisGrades',
                                                color: '#FFF',
                                                data: (function () {
                                                    var data2 = [];
                                                    for (var m=0; m<response.XaxisGrades.length; m++)
                                                    {
                                                        XaxisGradesDate[m]          = convertDate(response.XaxisGrades[m].Date);     
                                                        XaxisGradesDateSplit[m]     = XaxisGradesDate[m].split('-');
                                                        XaxisGradesDatePlotYear[m]  = parseInt(XaxisGradesDateSplit[m][0]);
                                                        XaxisGradesDatePlotMnth[m]  = parseInt(XaxisGradesDateSplit[m][1]);
                                                        XaxisGradesDatePlotDay[m]   = parseInt(XaxisGradesDateSplit[m][2]);
                                                        XaxisGradesGradePlot[m]     = response.XaxisGrades[m].Grade;
                                                        XaxisGradesResultsGrade[m]  = response.XaxisGrades[m].Grade;
                                                        data2.push({
                                                            x:Date.UTC(XaxisGradesDatePlotYear[m],(XaxisGradesDatePlotMnth[m]-1),XaxisGradesDatePlotDay[m]),
                                                            y:GradeSetCode.indexOf(XaxisGradesGradePlot[m]),
                                                        });
                                                    }
                                                    return data2;
                                                }()),
                                                marker: {
                                                    enabled: false,
                                                    states: {
                                                            hover: {
                                                                enabled: false
                                                            }
                                                        }
                                                },  
                                            },
                                                 
                                            {
                                                name: 'Target',
                                                color: '#48CAE5',
                                                data: (function () {
                                                    var data1 = [];
                                                    for (var m=0; m<response.TargetGrades.length; m++)
                                                    {
                                                        TargetGradeDate[m]          = convertDate(response.TargetGrades[m].Date);     
                                                        TargetGradeDateSplit[m]     = TargetGradeDate[m].split('-');
                                                        TargetGradeDatePlotYear[m]  = parseInt(TargetGradeDateSplit[m][0]);
                                                        TargetGradeDatePlotMnth[m]  = parseInt(TargetGradeDateSplit[m][1]);
                                                        
                                                        TargetGradeDatePlotDay[m]   = parseInt(TargetGradeDateSplit[m][2]);
                                                        //TargetGradeGradePlot[m]     = m;
                                                        TargetGradeGradePlot[m]     = response.TargetGrades[m].Grade;
                                                        TargetGradeResultsGrade[m] = response.TargetGrades[m].Grade;
                                                        data1.push({
                                                            //x:Date.UTC(TarYr[m],TarMn[m],TarD[m]),
                                                            //y:dataArray[m],
                                                               x:Date.UTC(TargetGradeDatePlotYear[m],(TargetGradeDatePlotMnth[m]-1),TargetGradeDatePlotDay[m]),
                                                            y:GradeSetCode.indexOf(TargetGradeGradePlot[m]),
                                                        });
                                                    }
                                                    return data1;
                                                }()),
                                                marker: {
                                                    enabled: false,
                                                    states: {
                                                            hover: {
                                                                enabled: false
                                                            }
                                                        }
                                                },  
                                            },
                                            
                                            {
                                                name: 'Grade',
                                                color:$scope.plotcolor,
                                                type: "scatter",
                                                data:(function () {
                                                    var data = [];
                                                    for (var j=0; j<response.GradeResults.length; j++)
                                                    {
                                                        GradeResultsDate[j]  = convertDate(response.GradeResults[j].Date);
                                                        GradeResultsSplit[j] = GradeResultsDate[j].split('-');
                                                        GradeResultsYear[j]  = parseInt(GradeResultsSplit[j][0]);
                                                        GradeResultsMnth[j]  = parseInt(GradeResultsSplit[j][1])-1;
                                                        GradeResultsDay[j]   = parseInt(GradeResultsSplit[j][2]);
                                                        GradeResultsGrade[j] = response.GradeResults[j].Grade;
                                                        GradeResultsName[j]  = response.GradeResults[j].Name;
                                                        data.push({
                                                            x:Date.UTC(GradeResultsYear[j],GradeResultsMnth[j],GradeResultsDay[j]),
                                                            y:GradeSetCode.indexOf(GradeResultsGrade[j]),
                                                        });
                                                    }
                                                    return data;
                                                }()),
                                                marker: {
                                                        enabled: true,
                                                        radius : 5,
                                                        symbol: 'circle'
                                                },
                                                tooltip: {
                                                    pointFormat: '',
                                                    //enabled: false                                               
                                                },  
                                            }
                                        ]
                                    });
                                });  
                                ////////  PERFORMANCE GRAPH ENDS /////////////////
                                $scope.studentPerformanceNoData = "";
                                $('.showStudentDiv').show();
                                $('#noRecord12').removeClass('noRecord');
                                
                                }else{
                                     $('#graph_container').css({'display':'block'});
                                    $scope.studentPerformance = '';
                                    $scope.studentPerformanceNoData = "No Performance Data Found…<br>Try:</br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                    $('.showStudentDiv').hide();
                                    $('#noRecord12').addClass('noRecord');
                                   
                                }     
                            }else{//ERROR : 500 in api
                                /////LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content7").css("display", "none");
                                $("#preloader_right_content7").css("display", "none");
                                $('#graph_container').css({'display':'block'});
                                $scope.studentPerformance = '';
                                $scope.studentPerformanceNoData = "No Performance Data Found…<br>Try:</br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                $('.showStudentDiv').hide();
                                $('#noRecord12').addClass('noRecord');
                                
                            } 
                        });     
                };
                
                
                // /*print in performance page*/
                //$scope.performance_screenshot=function()
                //{
                //    ////var restorepage = document.body.innerHTML;
                //    //var printcontent = document.getElementById("performance").innerHTML;
                //    //document.body.innerHTML = printcontent;
                //    //window.print();
                //    ////document.body.innerHTML = restorepage;
                //       
                //    window.print();
                //}
                
                
                
                
            };
        //};
           
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

            
    /*********************************  **** **** SEARCH **** **** ****************************************************
    *******************************************************************************************************************/
    
            $scope.performance_graph_close=function(){
                $("#hover_div").val('-1');
            };
            ////student search on keyup
            $(document).mouseup(function (e)
            {
                //alert('mouse up');
                var container = $(".search_reasult");       
                if (!container.is(e.target) // if the target of the click isn't the container...
                    && container.has(e.target).length === 0) // ... nor a descendant of the container
                {
                    container.hide();
                }
            });
            $('#closediv').click(function(e)
            {
                e.stopPropagation();
                document.getElementById('searchterm').value="";
                $('#errordiv').css({'display':'none'});
                $('#errordiv').html('');
                $('.stdprof').remove();
                $('.inner_content').click();
                $('#closediv').css({'display':'none'});
            });
            $('#searchdiv').click(function(e)
            {
                var key = e.which || e.keyCode;
                $('#errordiv').html('');
                var searchtext = $.trim($("#searchterm").val()).replace(/  +/g, ' ');
                var searchtext_with_space = $.trim($("#searchterm").val()).replace(/\s/g,'');
                var srcLen=searchtext_with_space.length;
                if (srcLen>2)
                {
                    if (!$(".stdprof"))
                    { 
                        if (key != 40 || key !=38)
                        {
                            $('.search_reasult').css({'display':'block'});
                            $('#errordiv').css({'display':'block'});
                            $('#errordiv').html('Press Enter to search');
                            $('#closediv').css({'display':'block'});
                        }
                    }   
                }else{
                    $('.search_reasult').css({'display':'block'});
                    $('#errordiv').css({'display':'block'});
                    $('#errordiv').html('Enter a minimum of 3 characters');
                    $('#closediv').css({'display':'block'});
                }
            });
           
            
            $('#searchdiv').keyup(function(e)
            {
                /* UP & DOWN KEY */
                var key = e.which || e.keyCode;
                if (key != 13) {
                $("#hover_div").val('-1');
                }
                
                var no_of_search_result = 0;
                $(".move").each(function(){
                    no_of_search_result = no_of_search_result + 1;
                });
                var search_count = no_of_search_result - 1;
                if (key == 38) { // up arrow key
                    $('#errordiv').css({'display':'none'});
                    var div_id = $(".result_hover").attr('id').replace('search_div','');
                    var prev_div_id = parseInt(div_id)-1;
                    if(prev_div_id >= 0){
                        $('.move').removeClass("result_hover");
                        $('#search_div'+prev_div_id).addClass("result_hover");
                        $('#search_div'+prev_div_id).focus();
                        $('#hover_div').val(prev_div_id);
                    }else{
                        prev_div_id = search_count;
                        $('.move').removeClass("result_hover");
                        $('#search_div'+prev_div_id).addClass("result_hover");
                        $('#search_div'+prev_div_id).focus();
                        $('#hover_div').val(prev_div_id);
                    }
                }else if (key == 40) { // down arrow key
                    $('#errordiv').css({'display':'none'});
                    if($(".result_hover").attr('id') == undefined)
                    {
                        $('.move').removeClass("result_hover");
                        $('#search_div0').addClass("result_hover");
                        $("#search_div0").hover();
                        $('#hover_div').val('0');
                    }else{
                        var div_id = $(".result_hover").attr('id').replace('search_div','');
                        var next_div_id = parseInt(div_id)+1;
                        if(next_div_id <= search_count){
                            $('.move').removeClass("result_hover");
                            $('#search_div'+next_div_id).addClass("result_hover");
                            $('#search_div'+next_div_id).focus();
                            $('#hover_div').val(next_div_id);
                        }else{
                            next_div_id = 0;
                            $('.move').removeClass("result_hover");
                            $('#search_div'+next_div_id).addClass("result_hover");
                            $('#search_div'+next_div_id).focus();
                            $('#hover_div').val(next_div_id);
                        }
                    }
                }else if(key != 13){
                    $('.stdprof').remove();
                }
                
                //$('.stdprof').remove();
                var searchtext = $.trim($("#searchterm").val()).replace(/  +/g, ' ');
                var searchtext_with_space = $.trim($("#searchterm").val()).replace(/\s/g,'');
                var srcLen=searchtext_with_space.length;
                
                if (srcLen>2)
                {
                    if (key != 40 && key !=38)
                    {
                        $('.search_reasult').css({'display':'block'});
                        $('#errordiv').css({'display':'block'});
                        $('#errordiv').html('Press Enter to search');
                        $('#closediv').css({'display':'block'});
                    }
                    if(key == 13)
                    {
   
                        $scope.successMsg = "";
                        $scope.searchResList ="";
                        $scope.noOfres = 0;
                        //var searchterm = $.trim($("#searchterm").val()).replace(/  +/g, ' ');
                        //var values = searchterm.split(' ').filter(function(v){return v!==''});
                        
                        var hover_div = $("#hover_div").val();
                       
                        if(hover_div != "-1")
                        {
                            //alert('1');
                            $('#search_div_anchor'+hover_div).click();
                        }
                        else
                        {
                            $scope.successMsg = "";
                            $scope.searchResList ="";
                            $scope.noOfres = 0;
                            var searchterm = $.trim($("#searchterm").val()).replace(/  +/g, ' ');
                            var values = searchterm.split(' ').filter(function(v){return v!==''});
                            //alert('2 = '+values.length );
                            
                            if (values.length > 2)
                            {
                            
                                //two or more words
                                if (key != 40 && key !=38)
                                {
                                
                                    $('.search_reasult').css({'display':'block'});
                                    $('#errordiv').css({'display':'block'});
                                    $('#errordiv').html("Search is limited to Student's<br>First Name and Last Name only");
                                    $scope.successMsg = "";
                                    //$scope.searchResListErr = 'No students found<br>Please refine your search';
                                    $scope.searchResList = "";
                                    $scope.noOfres = 0;
                                    $('#closediv').css({'display':'block'});
                                }
                            }else{
                                homeService.studentSearchResponse(access_token, searchterm, function (response)
                                {
                                 
                                    console.log('SERCH');
                                    console.log(response);
                                    if(response.status)
                                    { 
                                        if(response.Count != 0)
                                        { 
                                            if(response.Count > 20)
                                            { 
                                                if (key != 40 && key !=38)
                                                { 
                                                    $('.search_reasult').css({'display':'block'});
                                                    $('#errordiv').css({'display':'block'});
                                                    $('#errordiv').html('More than 20 students found<br>Please refine your search<br>The search text should be make more specific as it matches more than 20 records');
                                                    $scope.successMsg = ""
                                                    //$scope.searchResListErr = 'The search text should be make more specific as it matches more than 20 records';
                                                    $scope.searchResList = "";
                                                    $('#closediv').css({'display':'block'});
                                                }
                                            }else{
                                               
                                                if (key != 40 && key !=38)
                                                {
                                                   
                                                    $('.search_reasult').css({'display':'block'});
                                                    $('#errordiv').css({'display':'none'});
                                                    //$scope.searchResListErr = "";
                                                    $scope.searchResList = response.Data;
                                                    $scope.noOfres = response.Count;
                                                    $('#closediv').css({'display':'block'});
                                                }
                                            }
                                        }else{
                                            if (key != 40 && key !=38)
                                            {
                                               
                                                $('.search_reasult').css({'display':'block'});
                                                $('#errordiv').css({'display':'block'});
                                                $('#errordiv').html('No students found<br>Please refine your search');
                                                $scope.successMsg = "";
                                                //$scope.searchResListErr = 'No students found<br>Please refine your search';
                                                $scope.searchResList = "";
                                                $scope.noOfres = 0;
                                                $('#closediv').css({'display':'block'});
                                            }
                                        }     
                                    }else{//ERROR : 500 in api`
                                        if (key != 40 && key !=38)
                                        {
                                            
                                            $('.search_reasult').css({'display':'block'});
                                            $scope.successMsg = "";
                                            //$scope.searchResListErr = "";
                                            $scope.searchResList = response.Message;
                                            $scope.noOfres = 0;
                                            $('#closediv').css({'display':'block'});
                                        }
                                    } 
                                });
                            }
                        }
                    }                       
                }else{
                    if (key != 40 && key !=38)
                    {
                       
                        $('.search_reasult').css({'display':'block'});
                        $('#errordiv').css({'display':'block'});
                        $('#errordiv').html('Enter a minimum of 3 characters.');
                        $('#closediv').css({'display':'block'});
                    }
                }
            });
            
            $("#srch").click(function(e)
            {
                var key = e.which || e.keyCode;
                $('.stdprof').remove();
                var searchtext = $.trim($("#searchterm").val()).replace(/  +/g, ' ');
                var searchtext_with_space = $.trim($("#searchterm").val()).replace(/\s/g,'');
                var srcLen=searchtext_with_space.length;
                if (srcLen>2)
                {
                    $scope.successMsg = "";
                    $scope.searchResList ="";
                    $scope.noOfres = 0;
                    var searchterm = $.trim($("#searchterm").val()).replace(/  +/g, ' ');
                    var values = searchterm.split(' ').filter(function(v){return v!==''});
                    if (values.length > 2) {
                        if (key != 40 && key !=38)
                        {
                            $('.search_reasult').css({'display':'block'});
                            $('#errordiv').css({'display':'block'});
                            $('#errordiv').html("Search is limited to Student's<br>First Name and Last Name only.");
                            $scope.successMsg = "";
                            //$scope.searchResList = 'No results found. Please refine your search';
                            $scope.searchResList ="";
                            $scope.noOfres = 0;
                            $('#closediv').css({'display':'block'});
                        }
                    } else {
                        homeService.studentSearchResponse(access_token, searchterm, function (response)
                        {     
                            if(response.status)
                            {      
                                if(response.Count != 0)
                                {
                                     if (response.Count > 20)
                                     {
                                        if (key != 40 && key !=38)
                                        {
                                           $('.search_reasult').css({'display':'block'});
                                           $('#errordiv').css({'display':'block'});
                                           $('#errordiv').html('More than 20 students found<br>Please refine your search.<br>The search text should be make more specific as it matches more than 20 records.');
                                           $scope.successMsg = ""
                                           //$scope.searchResList = 'The search text should be make more specific as it matches more than 20 records';
                                           $scope.searchResList ="";
                                           $('#closediv').css({'display':'block'});
                                        }
                                     }else{
                                        if (key != 40 && key !=38)
                                        {
                                           $('.search_reasult').css({'display':'block'});
                                           $('#errordiv').css({'display':'none'});
                                           $scope.searchResList = response.Data;
                                           $scope.noOfres = response.Count;
                                           $('#closediv').css({'display':'block'});
                                        }
                                     }
                                }else{
                                    if (key != 40 && key !=38)
                                    {
                                        $('.search_reasult').css({'display':'block'});
                                        $('#errordiv').css({'display':'block'});
                                        $('#errordiv').html('No students found<br>Please refine your search');
                                        $scope.successMsg = "";
                                        //$scope.searchResList = 'No students found<br>Please refine your search';
                                        $scope.searchResList ="";
                                        $scope.noOfres = 0;
                                        $('#closediv').css({'display':'block'});
                                    }
                                }     
                            }else{//ERROR : 500 in api
                                if (key != 40 && key !=38)
                                {
                                    $('.search_reasult').css({'display':'block'});
                                    $scope.successMsg = "";
                                    $scope.searchResList = response.Message;
                                    $scope.noOfres = 0;
                                    $('#closediv').css({'display':'block'});
                                }
                            } 
                        });
                    }
                }else{
                    if (key != 40 && key !=38)
                    {
                        $('.search_reasult').css({'display':'block'});
                        $('#errordiv').css({'display':'block'});
                        $('#errordiv').html('Enter a minimum of 3 characters.');
                        $('#closediv').css({'display':'block'});
                    }
                }
            });
        /************************************************************************************************/
        
        /****************************  **** **** SEARCH (MY INBOX) **** **** ***********************************/
        
                   
            //$scope.performance_graph_close=function(){
            //    $("#hover_div").val('-1');
            //};
            ////student search on keyup
            $(document).mouseup(function (e)
            {
                //alert('mouse up');
                var container = $(".search_reasult1");       
                if (!container.is(e.target) // if the target of the click isn't the container...
                    && container.has(e.target).length === 0) // ... nor a descendant of the container
                {
                    container.hide();
                }
            });
            $('#closediv1').click(function(e)
            {
                e.stopPropagation();
                document.getElementById('searchterm1').value="";
                $('#errordiv1').css({'display':'none'});
                $('#errordiv1').html('');
                $('.stdprof1').remove();
                //$('.inner_content').click();
                $('#closediv1').css({'display':'none'});
            });
            $('#searchdiv1').click(function(e)
            {
                var key = e.which || e.keyCode;
                $('#errordiv1').html('');
                var searchtext = $.trim($("#searchterm1").val()).replace(/  +/g, ' ');
                var searchtext_with_space = $.trim($("#searchterm1").val()).replace(/\s/g,'');
                var srcLen=searchtext_with_space.length;
                if (srcLen>2)
                {
                    if (!$(".stdprof1"))
                    { 
                        if (key != 40 || key !=38)
                        {
                            $('.search_reasult1').css({'display':'block'});
                            $('#errordiv1').css({'display':'block'});
                            $('#errordiv1').html('Press Enter to search');
                            $('#closediv1').css({'display':'block'});
                        }
                    }   
                }else{
                    $('.search_reasult1').css({'display':'block'});
                    $('#errordiv1').css({'display':'block'});
                    $('#errordiv1').html('Enter a minimum of 3 characters');
                    $('#closediv1').css({'display':'block'});
                }
            });
           
            
            $('#searchdiv1').keyup(function(e)
            {
                /* UP & DOWN KEY */
                var key = e.which || e.keyCode;
                var no_of_search_result = 0;
                $(".move1").each(function(){
                    no_of_search_result = no_of_search_result + 1;
                });
                var search_count = no_of_search_result - 1;
                if (key == 38) { // up arrow key
                    $('#errordiv1').css({'display':'none'});
                    var div_id = $(".result_hover").attr('id').replace('search_div1','');
                    var prev_div_id = parseInt(div_id)-1;
                    if(prev_div_id >= 0){
                        $('.move1').removeClass("result_hover");
                        $('#search_div1'+prev_div_id).addClass("result_hover");
                        $('#search_div1'+prev_div_id).focus();
                        $('#hover_div1').val(prev_div_id);
                    }else{
                        prev_div_id = search_count;
                        $('.move1').removeClass("result_hover");
                        $('#search_div1'+prev_div_id).addClass("result_hover");
                        $('#search_div1'+prev_div_id).focus();
                        $('#hover_div1').val(prev_div_id);
                    }
                }else if (key == 40) { // down arrow key
                    $('#errordiv1').css({'display':'none'});
                    if($(".result_hover").attr('id') == undefined)
                    {
                        $('.move1').removeClass("result_hover");
                        $('#search_div10').addClass("result_hover");
                        $("#search_div10").hover();
                        $('#hover_div1').val('0');
                    }else{
                        var div_id = $(".result_hover").attr('id').replace('search_div1','');
                        var next_div_id = parseInt(div_id)+1;
                        if(next_div_id <= search_count){
                            $('.move1').removeClass("result_hover");
                            $('#search_div1'+next_div_id).addClass("result_hover");
                            $('#search_div1'+next_div_id).focus();
                            $('#hover_div1').val(next_div_id);
                        }else{
                            next_div_id = 0;
                            $('.move1').removeClass("result_hover");
                            $('#search_div1'+next_div_id).addClass("result_hover");
                            $('#search_div1'+next_div_id).focus();
                            $('#hover_div1').val(next_div_id);
                        }
                    }
                }else if(key != 13){
                    $('.stdprof1').remove();
                }
                
                //$('.stdprof').remove();
                var searchtext = $.trim($("#searchterm1").val()).replace(/  +/g, ' ');
                var searchtext_with_space = $.trim($("#searchterm1").val()).replace(/\s/g,'');
                var srcLen = searchtext_with_space.length;
                
                if (srcLen>2)
                {
                    if (key != 40 && key !=38)
                    {
                        $('.search_reasult1').css({'display':'block'});
                        $('#errordiv1').css({'display':'block'});
                        $('#errordiv1').html('Press Enter to search');
                        $('#closediv1').css({'display':'block'});
                    }
                    if(key == 13)
                    {
                        $scope.successMsg = "";
                        $scope.searchResList1 ="";
                        $scope.noOfres = 0;
                        var searchterm = $.trim($("#searchterm1").val()).replace(/  +/g, ' ');
                        var values = searchterm.split(' ').filter(function(v){return v!==''});
                        
                        var hover_div = $("#hover_div1").val();
                        //alert(hover_div);
                        if(hover_div != "-1"){
                            $('#search_div_anchor1'+hover_div).click();
                        }
                        else
                        {
                            if (values.length > 2)
                            {
                              
                                //two or more words
                                if (key != 40 && key !=38)
                                {
                                    $('.search_reasult1').css({'display':'block'});
                                    $('#errordiv1').css({'display':'block'});
                                    $('#errordiv1').html("Search is limited to Student's<br>First Name and Last Name only");
                                    $scope.successMsg = "";
                                    //$scope.searchResListErr = 'No students found<br>Please refine your search';
                                    $scope.searchResList1 = "";
                                    $scope.noOfres = 0;
                                    $('#closediv1').css({'display':'block'});
                                }
                            }else{
                           
                                homeService.studentSearchInboxResponse(access_token,teacherId,searchterm, function (response)
                                {
                                    console.log('SERCH');
                                    console.log(response);
                                    if(response.status)
                                    { 
                                        if(response.Count != 0)
                                        {
                                            //if(response.Count > 20)
                                            //{
                                            //    if (key != 40 && key !=38)
                                            //    {
                                            //        $('.search_reasult1').css({'display':'block'});
                                            //        $('#errordiv1').css({'display':'block'});
                                            //        $('#errordiv1').html('More than 20 students found<br>Please refine your search<br>The search text should be make more specific as it matches more than 20 records');
                                            //        $scope.successMsg = ""
                                            //        //$scope.searchResListErr = 'The search text should be make more specific as it matches more than 20 records';
                                            //        $scope.searchResList1 = "";
                                            //        $('#closediv1').css({'display':'block'});
                                            //    }
                                            //}else{
                                            //    if (key != 40 && key !=38)
                                            //    {
                                            //        $('.search_reasult1').css({'display':'block'});
                                            //        $('#errordiv1').css({'display':'none'});
                                            //        //$scope.searchResListErr = "";
                                            //        $scope.searchResList1 = response.Data;
                                            //        $scope.noOfres = response.Count;
                                            //        $('#closediv1').css({'display':'block'});
                                            //    }
                                            //}
                                            if (key != 40 && key !=38)
                                            {
                                                $('.search_reasult1').css({'display':'block'});
                                                $('#errordiv1').css({'display':'none'});
                                                //$scope.searchResListErr = "";
                                                $scope.searchResList1 = response.Data;
                                                $scope.noOfres = response.Count;
                                                $('#closediv1').css({'display':'block'});
                                            }
                                        }else{
                                            if (key != 40 && key !=38)
                                            {
                                                $('.search_reasult1').css({'display':'block'});
                                                $('#errordiv1').css({'display':'block'});
                                                $('#errordiv1').html('No students found<br>Please refine your search');
                                                $scope.successMsg = "";
                                                //$scope.searchResListErr = 'No students found<br>Please refine your search';
                                                $scope.searchResList1 = "";
                                                $scope.noOfres = 0;
                                                $('#closediv1').css({'display':'block'});
                                            }
                                        }     
                                    }else{//ERROR : 500 in api`
                                        if (key != 40 && key !=38)
                                        {
                                            $('.search_reasult1').css({'display':'block'});
                                            $scope.successMsg = "";
                                            //$scope.searchResListErr = "";
                                            $scope.searchResList1 = response.Message;
                                            $scope.noOfres = 0;
                                            $('#closediv1').css({'display':'block'});
                                        }
                                    } 
                                });
                            }
                        }
                    }                       
                }else{
                    if (key != 40 && key !=38)
                    {
                        $('.search_reasult1').css({'display':'block'});
                        $('#errordiv1').css({'display':'block'});
                        $('#errordiv1').html('Enter a minimum of 3 characters.');
                        $('#closediv1').css({'display':'block'});
                    }
                }
            });
            
            $("#srch1").click(function(e)
            {
            
                var key = e.which || e.keyCode;
                $('.stdprof1').remove();
                var searchtext = $.trim($("#searchterm1").val()).replace(/  +/g, ' ');
                var searchtext_with_space = $.trim($("#searchterm1").val()).replace(/\s/g,'');
                var srcLen=searchtext_with_space.length;
                if (srcLen>2)
                {
                    //alert('1');
                    $scope.successMsg = "";
                    $scope.searchResList1 ="";
                    $scope.noOfres = 0;
                    var searchterm = $.trim($("#searchterm1").val()).replace(/  +/g, ' ');
                    var values = searchterm.split(' ').filter(function(v){return v!==''});
                    if (values.length > 2) {
                        //alert('2');
                        if (key != 40 && key !=38)
                        {   //alert('22');
                            $('.search_reasult1').css({'display':'block'});
                            $('#errordiv1').css({'display':'block'});
                            $('#errordiv1').html("Search is limited to Student's<br>First Name and Last Name only.");
                            $scope.successMsg = "";
                            //$scope.searchResList = 'No results found. Please refine your search'; 
                            $scope.searchResList1 ="";
                            $scope.noOfres = 0;
                            $('#closediv1').css({'display':'block'});
                        }
                    } else {
                        //alert('3');
                        homeService.studentSearchInboxResponse(access_token,teacherId,searchterm, function (response)
                        {     //alert('4');
                            if(response.status)
                            {   //alert('5');   
                                if(response.Count != 0)
                                { //alert('6');
                                    //if (response.Count > 20)
                                    //{ //alert('7');
                                    //    if (key != 40 && key !=38)
                                    //    { //alert('8');
                                    //       $('.search_reasult1').css({'display':'block'});
                                    //       $('#errordiv1').css({'display':'block'});
                                    //       $('#errordiv1').html('More than 20 students found<br>Please refine your search.<br>The search text should be make more specific as it matches more than 20 records.');
                                    //       $scope.successMsg = "";
                                    //       //$scope.searchResList = 'The search text should be make more specific as it matches more than 20 records';
                                    //       $scope.searchResList1 ="";
                                    //       $('#closediv1').css({'display':'block'});
                                    //    }
                                    //}else{
                                    //    //alert('8');
                                    //    if (key != 40 && key !=38)
                                    //    { //alert('9');
                                    //       $('.search_reasult1').css({'display':'block'});
                                    //       $('#errordiv1').css({'display':'none'});
                                    //       $scope.searchResList1 = response.Data;
                                    //       $scope.noOfres = response.Count;
                                    //       $('#closediv1').css({'display':'block'});
                                    //    }
                                    //}
                                    if (key != 40 && key !=38)
                                        { //alert('9');
                                           $('.search_reasult1').css({'display':'block'});
                                           $('#errordiv1').css({'display':'none'});
                                           $scope.searchResList1 = response.Data;
                                           $scope.noOfres = response.Count;
                                           $('#closediv1').css({'display':'block'});
                                        }
                                }else{
                                    //alert('10');
                                    if (key != 40 && key !=38)
                                    {
                                        //alert('11');
                                        $('.search_reasult1').css({'display':'block'});
                                        $('#errordiv1').css({'display':'block'});
                                        $('#errordiv1').html('No students found<br>Please refine your search');
                                        $scope.successMsg = "";
                                        //$scope.searchResList = 'No students found<br>Please refine your search';
                                        $scope.searchResList1 ="";
                                        $scope.noOfres = 0;
                                        $('#closediv1').css({'display':'block'});
                                    }
                                }     
                            }else{//ERROR : 500 in api
                                //alert('12');
                                if (key != 40 && key !=38)
                                {   //alert('13');
                                    $('.search_reasult1').css({'display':'block'});
                                    $scope.successMsg = "";
                                    $scope.searchResList1 = response.Message;
                                    $scope.noOfres = 0;
                                    $('#closediv1').css({'display':'block'});
                                }
                            } 
                        });
                    }
                }else{
                    //alert('14');
                    if (key != 40 && key !=38)
                    {   //alert('15');
                        $('.search_reasult1').css({'display':'block'});
                        $('#errordiv1').css({'display':'block'});
                        $('#errordiv1').html('Enter a minimum of 3 characters.');
                        $('#closediv1').css({'display':'block'});
                    }
                }
            });
            
            /*ONCLICK ON SEARCH RESULT*/
            $scope.searchStudentSelected = function(Id,Firstname,Lastname,ParentsName,SubjectName,YearGroup,Image,IsUnlocked,ClassId,ClassName)
            {
                
                 $('.stdprof1').remove();
                 $('#closediv1').css({'display':'none'});
          
                 
                 console.log('Parents : '+ParentsName);
                 if (IsUnlocked == true) {
                     var style_class = 'outr_border';
                 }else{
                     var style_class = '';
                 }
                 $scope.Id = Id;
                 $scope.ClassId = ClassId;
                 $scope.Firstname = Firstname;
                 $scope.Lastname = Lastname;
                 $scope.ParentsName = ParentsName;
                 $scope.Image = Image;
                 $scope.ClassName = ClassName;
                 $scope.IsUnlocked = IsUnlocked;
                 
                 if (ParentsName != null){ 
                    ParentsName = ParentsName;
                 }else{
                    ParentsName = "";
                 }
                 var img="'"+Image+"'";
                 var clnm="'"+ClassName+"'";
                 var PName="'"+ParentsName+"'";
                 var Fname="'"+Firstname+"'";
                 var Lname="'"+Lastname+"'";
                 
                 
                //$('.inner_content').click();
                //$('#closediv1').css({'display':'none'});
           
                
                /*student id fetched from hidden field*/
                 var studentIdsInList = $('#studentIds').val();
                
                 var str = studentIdsInList;
                 var str_array = str.split(',');
                 var studentArr = Array();
                 for(var i = 0; i < str_array.length; i++)
                 {
                                  // Trim the excess whitespace.
                                  str_array[i] = str_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
                                  studentArr[i] = str_array[i];
                 }
                 console.log('-----studentArr-----');
                 console.log(studentArr);
                 console.log(Id);
                 /*class id fetched from hidden field*/
                 var classIdsInList = $('#classIds').val();
                 var str2 = classIdsInList;
                 var str2_array = str2.split(',');
                 var classArr = Array();
                 for(var i = 0; i < str2_array.length; i++)
                 {
                                  // Trim the excess whitespace.
                                  str2_array[i] = str2_array[i].replace(/^\s*/, "").replace(/\s*$/, "");
                                  classArr[i] = str2_array[i];
                 }
                 console.log('-----classArr-----');
                 console.log(classArr);

                 /*checking if selected student id is present in student list id */
                 function inArray(Id, studentArr)
                 {
                     var length = studentArr.length;
                     for(var i = 0; i < length; i++)
                     {
                         if(studentArr[i] == Id)
                         {
                            //console.log("position="+i);
                            var studentArrIndex = i;
                            if(classArr[studentArrIndex]==ClassId)
                            {
                                  return studentArrIndex;
                            }
                 
                         }
                     }
                     return -1;
                 }
                 var returnArrayResult = inArray(Id, studentArr);
                 var classArrCheck = classArr[returnArrayResult];
                 
                 if ((returnArrayResult != -1) || (classArrCheck == ClassId)) {
                                
                                  $('#msgstud'+Id+ClassId).addClass('studSelect');
                 }else{
                              
                                  //$('#append_search_div').prepend('<div class="user_box top_border_user_box clearfix studSelect ng-scope" id="msgstud'+Id+'" ng-click="studentInboxPerformanceResponse(Id,ClassId,Firstname,Lastname,ParentsName,Image,ClassName,IsUnlocked);"><label><div class="user_pic '+style_class+'"><img alt="" src="data:image/png;base64,'+Image+'"></div><div class="user_details"><h3>'+Firstname+' '+Lastname+' ('+ClassName+')</h3><span>'+ClassName+'</span></div></label></div>');
                  
                                  var divTemplate = '<div class="user_box top_border_user_box clearfix studSelect" id="msgstud'+Id+ClassId+'" ng-click="studentInboxPerformanceResponse('+Id+','+ClassId+','+Fname+','+Lname+','+PName+','+img+','+clnm+','+IsUnlocked+')"><label><div class="user_pic '+style_class+'"><img alt="" src="data:image/png;base64,'+Image+'"></div><div class="user_details"><h3>'+Firstname+' '+Lastname+' ('+ClassName+')</h3><span>'+ClassName+'</span></div></label></div>';
                                  
                                  var temp = $compile(divTemplate)($scope);
                                  
                                  //Then append it to the HTML:
                                  angular.element(document.getElementById('append_search_div')).prepend(temp);
                                  
                                  //You can also bind the event to the div as following:
                                  var div = angular.element('msgstud'+Id+ClassId);
                                  div.bind('click', $scope.studentInboxPerformanceResponse(Id,ClassId,Firstname,Lastname,ParentsName,Image,ClassName,IsUnlocked));
                            
                                  /*id is pushed into existing array*/
                                  studentArr.push(Id);
                                  $('#studentIds').val(studentArr.toString());
                                  classArr.push(ClassId);
                                  $('#classIds').val(classArr.toString());
                 }
                
                $scope.studentInboxPerformanceResponse(Id,ClassId,Firstname,Lastname,ParentsName,Image,ClassName,IsUnlocked);
                
                
              
            };
        /******************************************************************************************************/

            
            
            //W14: student profile & graph subjectwise
            $scope.studentProfile = function(Id,fname,lname,year,image,IsUnlocked)
            {
                /////LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content6").css("display", "block");
                $("#preloader_right_content6").css("display", "block");
                
                //alert(Id);
                $scope.Image = image;
                $scope.Name =  fname+" "+lname;                                                             
                $scope.Year = year;
                if (IsUnlocked==1) {
                    $scope.IsUnlocked="outer_border";
                }else
                {
                    $scope.IsUnlocked="";
                }
                
                $scope.profileperlist="";
                $scope.NameofSubject="";
                $('#graph_container_popup').html("");
            
                /*LHS : STUDENT PROFILE*/      
                homeService.studentProfileResponse(access_token,Id, function (response)
                {
                    //alert('id = '+Id);
                    console.log('STUDENT PROFILE'+Id);
                    console.log(response);
                    var studentName = fname+" "+lname;
                    if(response != '')
                    {
                        /////LOADER HIDE
                        $(window).scrollTop(0);
                        $("#status_right_content6").css("display", "none");
                        $("#preloader_right_content6").css("display", "none");
                        if(response.status )
                        {
                            $scope.profileperlist = response;
                            $scope.studentprofileMessage = '';
                            var ClassId = response[0].Id;
                            var GradeTrend = response[0].GradeTrend;
                            var NameofSubject = response[0].SubjectName;
                            //$scope.graphstudentPerformanceSubjectwise(ClassId,GradeTrend,NameofSubject);
                            /*RHS : GRAPH SUBJECT WISE */
                                $scope.graphstudentPerformanceSubjectwise = function(ClassId,GradeTrend,NameofSubject)
                                {
                                    //alert(GradeTrend);
                                    if (GradeTrend == true) {
                                        $scope.plotcolor = "#5BD9A4";
                                    } else if (GradeTrend == false) {
                                        $scope.plotcolor = "#FF5958";
                                    } else if (GradeTrend == null || GradeTrend == "null") {
                                        $scope.plotcolor = "orange";
                                    } else {
                                        $scope.plotcolor = "orange";
                                    }
                                    
                                    $scope.NameofSubject=NameofSubject;
                                    
                                    // alert(ClassId);
                                    homeService.studentPerformanceListResponse(access_token,ClassId,Id,function (response)
                                    {                           
                                            console.log('PERFORMANCE STUDENT SUBJECT WISE');
                                            console.log(response);                           
                                            if(response.status)
                                            {      
                                                if(response != '')
                                                {
                                                    
                                                    $scope.studentPerformanceList = response;
                                                    $('.prof').css({'background-color':''});
                                                    $('#prof'+ClassId).css({'background-color':'rgba(157, 224, 242, 0.8)'});
                                                    //$scope.studentPerformanceListErrMsg = "";
                                                    //$scope.studentListMessagePopup = '';
                                                    //$('.noRecordClass').removeClass('noRecord');
                                                    
                                                    GradeSetCode = new Array();
                                                    GradeSetValue = new Array();
                                                    GradeResultsDate = new Array();
                                                    GradeResultsGrade = new Array();
                                                    GradeResultsName = new Array();
                                                    Grade_and_Date = new Array();
                                                    GradeResultsDateTime = new Array();
                                                    GradeResultsSplit=new Array();
                                                    GradeResultsYear=new Array();
                                                    GradeResultsMnth=new Array();
                                                    GradeResultsDay=new Array();
                                                    GradeResultsGraphDate=new Array();
                                                    GradeResultsDateTimeYaxis=new Array();
                                         
                                                    TargetGradeDate=new Array();
                                                    TargetGradeDateSplit=new Array();
                                                    TargetGradeDatePlot=new Array();
                                                    TargetGradeGradePlot=new Array();
                                                    TargetGradeDatePlotYear=new Array();
                                                    TargetGradeDatePlotMnth=new Array();
                                                    TargetGradeDatePlotDay=new Array();
                                                    TargetGradeResultsGrade=new Array();
                                                    
                                                    XaxisGradesDate=new Array();
                                                    XaxisGradesDateSplit=new Array();
                                                    XaxisGradesDatePlotYear=new Array();
                                                    XaxisGradesDatePlotMnth=new Array();
                                                    XaxisGradesDatePlotDay=new Array();
                                                    XaxisGradesGradePlot=new Array();
                                                    XaxisGradesResultsGrade=new Array();
                                                    
                                                    for(var i=0; i<response.GradeSet.length; i++)
                                                    {
                                                        GradeSetCode[i]  = response.GradeSet[i].Code;
                                                        GradeSetValue[i] = response.GradeSet[i].Value;
                                                    }
                                                    for(var j=0; j<response.GradeResults.length; j++)
                                                    {
                                                        GradeResultsDate[j]  = convertDate(response.GradeResults[j].Date);
                                                        GradeResultsSplit[j] = GradeResultsDate[j].split('-');
                                                        GradeResultsYear[j]  = parseInt(GradeResultsSplit[j][0]);
                                                        GradeResultsMnth[j]  = parseInt(GradeResultsSplit[j][1]);
                                                        GradeResultsDay[j]   = parseInt(GradeResultsSplit[j][2]);
                                                        
                                                        GradeResultsGraphDate[j] = GradeResultsYear[j]+','+GradeResultsMnth[j]+','+GradeResultsDay[j];
                                                        
                                                        GradeResultsGrade[j] = response.GradeResults[j].Grade;
                                                        GradeResultsName[j]  = response.GradeResults[j].Name;
                              
                                                        GradeResultsDateTime[j] = Date.UTC(GradeResultsYear[j]+","+GradeResultsMnth[j]+","+GradeResultsDay[j]);
                                                    }
                                                    for(var k=0; k<response.TargetGrades.length; k++)
                                                    {
                                                        TargetGradeDate[k] = convertDate(response.TargetGrades[k].Date);     
                                                        TargetGradeDateSplit[k] = TargetGradeDate[k].split('-');
                                                        TargetGradeDatePlotYear[k]  = parseInt(TargetGradeDateSplit[k][0]);
                                                        TargetGradeDatePlotMnth[k]  = parseInt(TargetGradeDateSplit[k][1]);
                                                        TargetGradeDatePlotDay[k]   = parseInt(TargetGradeDateSplit[k][2]);
                                                        TargetGradeDatePlot[k]  = Date.UTC(TargetGradeDatePlotYear[k],TargetGradeDatePlotMnth[k],TargetGradeDatePlotDay[k]);
                                                        TargetGradeGradePlot[k] = response.TargetGrades[k].Grade;       
                                                    }
                                                   
                                                    //console.log("GRAPH RESULT");
                                                    //console.log(response);
                                                    //console.log(GradeResultsName);
                                                    //console.log(GradeResultsDateTime);
                                                    
                                                    
                                                    /*calculation of academic year*/    
                                                    var todayTime = new Date();
                                                    var monthAcademic = (todayTime .getMonth() + 1);
                                                    var dayAcademic = (todayTime .getDate());
                                                    var yearAcademic = (todayTime .getFullYear());
                                                    var nextYearAcademic = (todayTime .getFullYear() + 1);
                                                    var academicYearStartDate = yearAcademic+'-'+'09'+'-'+'01';
                                                    var academicYearEndDate = nextYearAcademic+'-'+'08'+'-'+'31';
                                                    
                                                    var current_date = yearAcademic+'-'+monthAcademic+'-'+dayAcademic;
                                                    
                                                    if ( (current_date >= academicYearStartDate) ) {
                                                            var currentAcademicYear1 = yearAcademic;
                                                            var currentAcademicYear2 = yearAcademic + 1;
                                                    }else{
                                                            var currentAcademicYear1 = yearAcademic - 1;
                                                            var currentAcademicYear2 = yearAcademic;
                                                    }
                                                
                                     
                                                    
                                                    ////////  PERFORMANCE GRAPH BEGIN /////////////////
                                                $(document).ready(function() {
                                                    $('#graph_container_popup').highcharts({
                                                        exporting: { enabled: false },
                                                        chart: {
                                                            type: 'line'
                                                        },
                                                        title: {
                                                           // text: '<h2><b>Performance Graph</b></h2>'
                                                           text:''
                                                        },
                                                        xAxis: {
                                                            type: 'datetime',
                                                            title: {
                                                                text: 'Month'
                                                            },
                                                            //dateTimeLabelFormats: { 
                                                            //    month: '%b %Y',
                                                            //    
                                                            //},
                                                            //categories: (function () {                                     
                                                            //                for (var r=0; r<TargetGradeDateTime.length; r++)
                                                            //                {
                                                            //                    GradeResultsDateTimeYaxis[r] = TargetGradeDateTime[r];
                                                            //                    return GradeResultsDateTimeYaxis[r];
                                                            //                }
                                                            //            }()),
                                                            labels: {
                                                                format: '{value:%b %Y}',
                                                                style: {
                                                                        fontWeight:'bold'
                                                                    }
                                                            },
                                                            gridLineWidth: 1,   
                                                        },
                                                        yAxis: {
                                                            min: 0,
                                                            //tickInterval: 1,
                                                            labels: {
                                                                    formatter: function() {
                                                                        if (GradeSetCode[this.value] != undefined ) {
                                                                            return '<b>'+GradeSetCode[this.value]+'</b>';
                                                                        }
                                                                    }
                                                            },
                                                            //categories: GradeSetCode,
                                                            title: {
                                                               text: 'Grade'
                                                            },
                                                        },
                                                        plotOptions: {
                                                                //spline: {
                                                                //    marker: {
                                                                //        enabled: true,
                                                                //        radius: 3,
                                                                //    },
                                                                //},
                                                                scatter: {
                                                                  lineWidth: 2,
                                                                },
                                                                series: {
                                                                    pointStart: Date.UTC(currentAcademicYear1, 7, 1),
                                                                    pointInterval: 15*24 * 3600 * 1000// one day
                                                                }
                                                        },
                                                        tooltip: {
                                                            shared: false,
                                                            formatter: function() {
                                                                var tooltiptxt='';
                                                                if(this.series.name == 'Grade') {
                                                                     tooltiptxt = '<b>'+GradeResultsName[this.y] +'</b><br> Grade '+GradeSetCode[this.y]+', '+Highcharts.dateFormat('%e %b %Y',new Date(this.x));
                                                                     return tooltiptxt;
                                                                }else{
                                                                     return false ;
                                                                }   
                                                            },
                                                            shared: false,
                                                            backgroundColor: $scope.plotcolor,
                                                            style: {
                                                                        color: 'white'
                                                            },
                                                        },
                                                        legend: {
                                                            enabled: true
                                                        },
                                                        plotOptions: {
                                                                spline: {
                                                                    marker: {
                                                                        enabled: true,
                                                                        radius: 3,
                                                                    },
                                                                },
                                                                scatter: {
                                                                  lineWidth: 2,
                                                                }
                                                        },
                                                        series: [
                                                            {
                                                                showInLegend: false,
                                                                name: 'XaxisGrades',
                                                                color: '#FFF',
                                                                data: (function () {
                                                                    var data2 = [];
                                                                    for (var m=0; m<response.XaxisGrades.length; m++)
                                                                    {
                                                                        XaxisGradesDate[m]          = convertDate(response.XaxisGrades[m].Date);     
                                                                        XaxisGradesDateSplit[m]     = XaxisGradesDate[m].split('-');
                                                                        XaxisGradesDatePlotYear[m]  = parseInt(XaxisGradesDateSplit[m][0]);
                                                                        XaxisGradesDatePlotMnth[m]  = parseInt(XaxisGradesDateSplit[m][1]);
                                                                        XaxisGradesDatePlotDay[m]   = parseInt(XaxisGradesDateSplit[m][2]);
                                                                        XaxisGradesGradePlot[m]     = response.XaxisGrades[m].Grade;
                                                                        XaxisGradesResultsGrade[m]  = response.XaxisGrades[m].Grade;
                                                                        data2.push({
                                                                            x:Date.UTC(XaxisGradesDatePlotYear[m],(XaxisGradesDatePlotMnth[m]-1),XaxisGradesDatePlotDay[m]),
                                                                            y:GradeSetCode.indexOf(XaxisGradesGradePlot[m]),
                                                                        });
                                                                    }
                                                                    return data2;
                                                                }()),
                                                                marker: {
                                                                    enabled: false,
                                                                    states: {
                                                                            hover: {
                                                                                enabled: false
                                                                            }
                                                                        }
                                                                },  
                                                            },
                                                            {
                                                                showInLegend: true,
                                                                name: 'Target',
                                                                color:'#48CAE5',
                                                                data:(function () {
                                                                    var data = [];
                                                                    //var monthArr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
                                                                    for (var m=0; m<response.TargetGrades.length; m++)
                                                                    {
                                                                        TargetGradeDate[m]          = convertDate(response.TargetGrades[m].Date);     
                                                                        TargetGradeDateSplit[m]     = TargetGradeDate[m].split('-');
                                                                        TargetGradeDatePlotYear[m]  = parseInt(TargetGradeDateSplit[m][0]);
                                                                        TargetGradeDatePlotMnth[m]  = parseInt(TargetGradeDateSplit[m][1]);
                                                                        TargetGradeDatePlotDay[m]   = parseInt(TargetGradeDateSplit[m][2]);
                                                                        TargetGradeGradePlot[m]     = response.TargetGrades[m].Grade;
                                                                        //TargetGradeResultsGrade[m]  = response.TargetGrades[m].Grade;
                                                                        data.push({
                                                                            x:Date.UTC(TargetGradeDatePlotYear[m],(TargetGradeDatePlotMnth[m]-1),TargetGradeDatePlotDay[m]),
                                                                            y:GradeSetCode.indexOf(TargetGradeGradePlot[m]),           
                                                                        });
                                                                    }
                                                                    return data;
                                                                }()),
                                                                marker: {
                                                                        enabled: false,
                                                                        states: {
                                                                                    hover: {
                                                                                        enabled: false
                                                                                    }
                                                                                }
                                                                },
                                                            },
                                                            {
                                                                showInLegend: true,
                                                                name: 'Grade',
                                                                color:$scope.plotcolor,
                                                                type: "scatter",
                                                                data:(function () {
                                                                    var data = [];
                                                                    //var monthArr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
                                                                    for (var j=0; j<response.GradeResults.length; j++)
                                                                    {
                                                                        GradeResultsDate[j]  = convertDate(response.GradeResults[j].Date);
                                                                        GradeResultsSplit[j] = GradeResultsDate[j].split('-');
                                                                        GradeResultsYear[j]  = parseInt(GradeResultsSplit[j][0]);
                                                                        GradeResultsMnth[j]  = parseInt(GradeResultsSplit[j][1])-1;
                                                                        GradeResultsDay[j]   = parseInt(GradeResultsSplit[j][2]);
                                                                        GradeResultsGrade[j] = response.GradeResults[j].Grade;
                                                                        GradeResultsName[j]  = response.GradeResults[j].Name;
                                                                        data.push({
                                                                            x:Date.UTC(GradeResultsYear[j],GradeResultsMnth[j],GradeResultsDay[j]),
                                                                            y:GradeSetCode.indexOf(GradeResultsGrade[j]),
                                                                        });
                                                                        
                                                                       
                                                                    }
                                                                    return data;
                                                                }()),
                                                                marker: {
                                                                        enabled: true,
                                                                        radius : 5,
                                                                        symbol: 'circle'
                                                                },
                                                                tooltip: {
                                                                    pointFormat: ''
                                                                }
                                                            }
                                                        ]
                                                    });
                                                });
                                                    
                                                    $scope.studentPerformanceList1 = "";
                                                    $scope.studentPerformanceList2 = "";
                                                    $scope.studentPerformanceList3 = "";
                                                    $scope.studentPerformanceList4 = "";
                                                    
                                                    $scope.studentPerformanceData1 = "";
                                                    $scope.studentPerformanceData2 = "";
                                                    $scope.studentPerformanceData3 = "";
                                                    $scope.studentPerformanceData4 = "";
                                                   
                                                    $('.showStudentDiv').show();
                                                    $('#noRecord10').removeClass('noRecord');
                                                    $('#noRecord11').removeClass('noRecord');
                                                ////////  PERFORMANCE GRAPH ENDS ///////////////// 
                                                
                                                }else{
                                                    $scope.studentPerformanceList1 = "No Classes Found… ";
                                                    $scope.studentPerformanceList2 ="Try: ";
                                                    $scope.studentPerformanceList3 ="1. Reload the webpage.";
                                                    $scope.studentPerformanceList4 ="2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                        
                                                    //$scope.studentPerformanceList = "No Classes Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                                    
                                                    $scope.studentPerformanceData1 = "No Performance Data Found… ";
                                                    $scope.studentPerformanceData2 ="Try: ";
                                                    $scope.studentPerformanceData3 ="1. Reload the webpage.";
                                                    $scope.studentPerformanceData4 ="2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                                    
                                                    //$scope.studentPerformanceData = "No Performance Data Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                                    $('.showStudentDiv').hide();
                                                    $('#noRecord10').addClass('noRecord');
                                                    $('#noRecord11').addClass('noRecord');
                                                }     
                                            }else{//ERROR : 500 in api
                                               
                                                $scope.studentPerformanceList1 = "No Classes Found… ";
                                                $scope.studentPerformanceList2 ="Try: ";
                                                $scope.studentPerformanceList3 ="1. Reload the webpage.";
                                                $scope.studentPerformanceList4 ="2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                    
                                                //$scope.studentPerformanceList = "No Classes Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                                
                                                $scope.studentPerformanceData1 = "No Performance Data Found… ";
                                                $scope.studentPerformanceData2 ="Try: ";
                                                $scope.studentPerformanceData3 ="1. Reload the webpage.";
                                                $scope.studentPerformanceData4 ="2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                                
                                                //$scope.studentPerformanceData = "No Performance Data Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                                $('.showStudentDiv').hide();
                                                $('#noRecord10').addClass('noRecord');
                                                $('#noRecord11').addClass('noRecord');
                                            } 
                                        });
                                };
                                $scope.graphstudentPerformanceSubjectwise(ClassId,GradeTrend,NameofSubject);
                          
                        }else{  
                            $scope.profileperlist = '';
                            $scope.studentprofileMessage = 'No classes found for '+studentName;
                        }     
                    }else{//ERROR : 500 in api
                            /////LOADER HIDE
                        $(window).scrollTop(0);
                        $("#status_right_content6").css("display", "none");
                        $("#preloader_right_content6").css("display", "none");
                        $scope.profileperlist = '';
                        $scope.studentprofileMessage = 'No classes found for '+studentName;
                    }
                });
             
                
                /*RHS : GRAPH SUBJECT WISE */
                $scope.graphstudentPerformanceSubjectwise = function(ClassId,GradeTrend,nameofsubject)
                {
                    //alert(GradeTrend);
                    if (GradeTrend == true) {
                        $scope.plotcolor = "#5BD9A4";
                    } else if (GradeTrend == false) {
                        $scope.plotcolor = "#FF5958";
                    } else if (GradeTrend == null || GradeTrend == "null") {
                        $scope.plotcolor = "orange";
                    } else {
                        $scope.plotcolor = "orange";
                    }
                    
                    $scope.NameofSubject=nameofsubject;
                    
                    // alert(ClassId);
                    homeService.studentPerformanceListResponse(access_token,ClassId,Id,function (response)
                    {                           
                            console.log('PERFORMANCE STUDENT SUBJECT WISE');
                            console.log(response);                           
                            if(response.status)
                            {      
                                if(response != '')
                                {
                                    
                                    $scope.studentPerformanceList = response;
                                    $('.prof').css({'background-color':''});
                                    $('#prof'+ClassId).css({'background-color':'rgba(157, 224, 242, 0.8)'});
                                    //$scope.studentPerformanceListErrMsg = "";
                                    //$scope.studentListMessagePopup = '';
                                    //$('.noRecordClass').removeClass('noRecord');
                                    
                                    GradeSetCode = new Array();
                                    GradeSetValue = new Array();
                                    GradeResultsDate = new Array();
                                    GradeResultsGrade = new Array();
                                    GradeResultsName = new Array();
                                    Grade_and_Date = new Array();
                                    GradeResultsDateTime = new Array();
                                    GradeResultsSplit=new Array();
                                    GradeResultsYear=new Array();
                                    GradeResultsMnth=new Array();
                                    GradeResultsDay=new Array();
                                    GradeResultsGraphDate=new Array();
                                    GradeResultsDateTimeYaxis=new Array();
                         
                                    TargetGradeDate=new Array();
                                    TargetGradeDateSplit=new Array();
                                    TargetGradeDatePlot=new Array();
                                    TargetGradeGradePlot=new Array();
                                    TargetGradeDatePlotYear=new Array();
                                    TargetGradeDatePlotMnth=new Array();
                                    TargetGradeDatePlotDay=new Array();
                                    TargetGradeResultsGrade=new Array();
                                    
                                    XaxisGradesDate=new Array();
                                    XaxisGradesDateSplit=new Array();
                                    XaxisGradesDatePlotYear=new Array();
                                    XaxisGradesDatePlotMnth=new Array();
                                    XaxisGradesDatePlotDay=new Array();
                                    XaxisGradesGradePlot=new Array();
                                    XaxisGradesResultsGrade=new Array();
                                    
                                    for(var i=0; i<response.GradeSet.length; i++)
                                    {
                                        GradeSetCode[i]  = response.GradeSet[i].Code;
                                        GradeSetValue[i] = response.GradeSet[i].Value;
                                    }
                                    for(var j=0; j<response.GradeResults.length; j++)
                                    {
                                        GradeResultsDate[j]  = convertDate(response.GradeResults[j].Date);
                                        GradeResultsSplit[j] = GradeResultsDate[j].split('-');
                                        GradeResultsYear[j]  = parseInt(GradeResultsSplit[j][0]);
                                        GradeResultsMnth[j]  = parseInt(GradeResultsSplit[j][1]);
                                        GradeResultsDay[j]   = parseInt(GradeResultsSplit[j][2]);
                                        
                                        GradeResultsGraphDate[j] = GradeResultsYear[j]+','+GradeResultsMnth[j]+','+GradeResultsDay[j];
                                        
                                        GradeResultsGrade[j] = response.GradeResults[j].Grade;
                                        GradeResultsName[j]  = response.GradeResults[j].Name;
              
                                        GradeResultsDateTime[j] = Date.UTC(GradeResultsYear[j]+","+GradeResultsMnth[j]+","+GradeResultsDay[j]);
                                    }
                                    for(var k=0; k<response.TargetGrades.length; k++)
                                    {
                                        TargetGradeDate[k] = convertDate(response.TargetGrades[k].Date);     
                                        TargetGradeDateSplit[k] = TargetGradeDate[k].split('-');
                                        TargetGradeDatePlotYear[k]  = parseInt(TargetGradeDateSplit[k][0]);
                                        TargetGradeDatePlotMnth[k]  = parseInt(TargetGradeDateSplit[k][1]);
                                        TargetGradeDatePlotDay[k]   = parseInt(TargetGradeDateSplit[k][2]);
                                        TargetGradeDatePlot[k]  = Date.UTC(TargetGradeDatePlotYear[k],TargetGradeDatePlotMnth[k],TargetGradeDatePlotDay[k]);
                                        TargetGradeGradePlot[k] = response.TargetGrades[k].Grade;       
                                    }
                                   
                                    //console.log("GRAPH RESULT");
                                    //console.log(response);
                                    //console.log(GradeResultsName);
                                    //console.log(GradeResultsDateTime);
                                    
                                    
                                    /*calculation of academic year*/    
                                    var todayTime = new Date();
                                    var monthAcademic = (todayTime .getMonth() + 1);
                                    var dayAcademic = (todayTime .getDate());
                                    var yearAcademic = (todayTime .getFullYear());
                                    var nextYearAcademic = (todayTime .getFullYear() + 1);
                                    var academicYearStartDate = yearAcademic+'-'+'09'+'-'+'01';
                                    var academicYearEndDate = nextYearAcademic+'-'+'08'+'-'+'31';
                                    
                                    var current_date = yearAcademic+'-'+monthAcademic+'-'+dayAcademic;
                                    
                                    if ( (current_date >= academicYearStartDate) ) {
                                            var currentAcademicYear1 = yearAcademic;
                                            var currentAcademicYear2 = yearAcademic + 1;
                                    }else{
                                            var currentAcademicYear1 = yearAcademic - 1;
                                            var currentAcademicYear2 = yearAcademic;
                                    }
                                
                     
                                    
                                    ////////  PERFORMANCE GRAPH BEGIN /////////////////
                                $(document).ready(function() {
                                    $('#graph_container_popup').highcharts({
                                        exporting: { enabled: false },
                                        chart: {
                                            type: 'line'
                                        },
                                        title: {
                                           // text: '<h2><b>Performance Graph</b></h2>'
                                           text:''
                                        },
                                        xAxis: {
                                            type: 'datetime',
                                            title: {
                                                text: 'Month'
                                            },
                                            //dateTimeLabelFormats: { 
                                            //    month: '%b %Y',
                                            //    
                                            //},
                                            //categories: (function () {                                     
                                            //                for (var r=0; r<TargetGradeDateTime.length; r++)
                                            //                {
                                            //                    GradeResultsDateTimeYaxis[r] = TargetGradeDateTime[r];
                                            //                    return GradeResultsDateTimeYaxis[r];
                                            //                }
                                            //            }()),
                                            labels: {
                                                format: '{value:%b %Y}',
                                                style: {
                                                        fontWeight:'bold'
                                                    }
                                            },
                                            gridLineWidth: 1,   
                                        },
                                        yAxis: {
                                            min: 0,
                                            //tickInterval: 1,
                                            labels: {
                                                    formatter: function() {
                                                        if (GradeSetCode[this.value] != undefined ) {
                                                            return '<b>'+GradeSetCode[this.value]+'</b>';
                                                        }
                                                    }
                                            },
                                            //categories: GradeSetCode,
                                            title: {
                                               text: 'Grade'
                                            },
                                        },
                                        plotOptions: {
                                                //spline: {
                                                //    marker: {
                                                //        enabled: true,
                                                //        radius: 3,
                                                //    },
                                                //},
                                                scatter: {
                                                  lineWidth: 2,
                                                },
                                                series: {
                                                    pointStart: Date.UTC(currentAcademicYear1, 7, 1),
                                                    pointInterval: 15*24 * 3600 * 1000// one day
                                                }
                                        },
                                        tooltip: {
                                            shared: false,
                                            formatter: function() {
                                                var tooltiptxt='';
                                                if(this.series.name == 'Grade') {
                                                     tooltiptxt = '<b>'+GradeResultsName[this.y] +'</b><br> Grade '+GradeSetCode[this.y]+', '+Highcharts.dateFormat('%e %b %Y',new Date(this.x));
                                                     return tooltiptxt;
                                                }else{
                                                     return false ;
                                                }   
                                            },
                                            shared: false,
                                            backgroundColor: $scope.plotcolor,
                                            style: {
                                                        color: 'white'
                                            },
                                        },
                                        legend: {
                                            enabled: true
                                        },
                                        plotOptions: {
                                                spline: {
                                                    marker: {
                                                        enabled: true,
                                                        radius: 3,
                                                    },
                                                },
                                                scatter: {
                                                  lineWidth: 2,
                                                }
                                        },
                                        series: [
                                            {
                                                showInLegend: false,
                                                name: 'XaxisGrades',
                                                color: '#FFF',
                                                data: (function () {
                                                    var data2 = [];
                                                    for (var m=0; m<response.XaxisGrades.length; m++)
                                                    {
                                                        XaxisGradesDate[m]          = convertDate(response.XaxisGrades[m].Date);     
                                                        XaxisGradesDateSplit[m]     = XaxisGradesDate[m].split('-');
                                                        XaxisGradesDatePlotYear[m]  = parseInt(XaxisGradesDateSplit[m][0]);
                                                        XaxisGradesDatePlotMnth[m]  = parseInt(XaxisGradesDateSplit[m][1]);
                                                        XaxisGradesDatePlotDay[m]   = parseInt(XaxisGradesDateSplit[m][2]);
                                                        XaxisGradesGradePlot[m]     = response.XaxisGrades[m].Grade;
                                                        XaxisGradesResultsGrade[m]  = response.XaxisGrades[m].Grade;
                                                        data2.push({
                                                            x:Date.UTC(XaxisGradesDatePlotYear[m],(XaxisGradesDatePlotMnth[m]-1),XaxisGradesDatePlotDay[m]),
                                                            y:GradeSetCode.indexOf(XaxisGradesGradePlot[m]),
                                                        });
                                                    }
                                                    return data2;
                                                }()),
                                                marker: {
                                                    enabled: false,
                                                    states: {
                                                            hover: {
                                                                enabled: false
                                                            }
                                                        }
                                                },  
                                            },
                                            {
                                                showInLegend: true,
                                                name: 'Target',
                                                color:'#48CAE5',
                                                data:(function () {
                                                    var data = [];
                                                    //var monthArr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
                                                    for (var m=0; m<response.TargetGrades.length; m++)
                                                    {
                                                        TargetGradeDate[m]          = convertDate(response.TargetGrades[m].Date);     
                                                        TargetGradeDateSplit[m]     = TargetGradeDate[m].split('-');
                                                        TargetGradeDatePlotYear[m]  = parseInt(TargetGradeDateSplit[m][0]);
                                                        TargetGradeDatePlotMnth[m]  = parseInt(TargetGradeDateSplit[m][1]);
                                                        TargetGradeDatePlotDay[m]   = parseInt(TargetGradeDateSplit[m][2]);
                                                        TargetGradeGradePlot[m]     = response.TargetGrades[m].Grade;
                                                        //TargetGradeResultsGrade[m]  = response.TargetGrades[m].Grade;
                                                        data.push({
                                                            x:Date.UTC(TargetGradeDatePlotYear[m],(TargetGradeDatePlotMnth[m]-1),TargetGradeDatePlotDay[m]),
                                                            y:GradeSetCode.indexOf(TargetGradeGradePlot[m]),           
                                                        });
                                                    }
                                                    return data;
                                                }()),
                                                marker: {
                                                        enabled: false,
                                                        states: {
                                                                    hover: {
                                                                        enabled: false
                                                                    }
                                                                }
                                                },
                                            },
                                            {
                                                showInLegend: true,
                                                name: 'Grade',
                                                color:$scope.plotcolor,
                                                type: "scatter",
                                                data:(function () {
                                                    var data = [];
                                                    //var monthArr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];
                                                    for (var j=0; j<response.GradeResults.length; j++)
                                                    {
                                                        GradeResultsDate[j]  = convertDate(response.GradeResults[j].Date);
                                                        GradeResultsSplit[j] = GradeResultsDate[j].split('-');
                                                        GradeResultsYear[j]  = parseInt(GradeResultsSplit[j][0]);
                                                        GradeResultsMnth[j]  = parseInt(GradeResultsSplit[j][1])-1;
                                                        GradeResultsDay[j]   = parseInt(GradeResultsSplit[j][2]);
                                                        GradeResultsGrade[j] = response.GradeResults[j].Grade;
                                                        GradeResultsName[j]  = response.GradeResults[j].Name;
                                                        data.push({
                                                            x:Date.UTC(GradeResultsYear[j],GradeResultsMnth[j],GradeResultsDay[j]),
                                                            y:GradeSetCode.indexOf(GradeResultsGrade[j]),
                                                        });
                                                        
                                                       
                                                    }
                                                    return data;
                                                }()),
                                                marker: {
                                                        enabled: true,
                                                        radius : 5,
                                                        symbol: 'circle'
                                                },
                                                tooltip: {
                                                    pointFormat: ''
                                                }
                                            }
                                        ]
                                    });
                                });
                                    
                                    $scope.studentPerformanceList1 = "";
                                    $scope.studentPerformanceList2 = "";
                                    $scope.studentPerformanceList3 = "";
                                    $scope.studentPerformanceList4 = "";
                                    
                                    $scope.studentPerformanceData1 = "";
                                    $scope.studentPerformanceData2 = "";
                                    $scope.studentPerformanceData3 = "";
                                    $scope.studentPerformanceData4 = "";
                                   
                                    $('.showStudentDiv').show();
                                    $('#noRecord10').removeClass('noRecord');
                                    $('#noRecord11').removeClass('noRecord');
                                ////////  PERFORMANCE GRAPH ENDS ///////////////// 
                                
                                }else{
                                    $scope.studentPerformanceList1 = "No Classes Found… ";
                                    $scope.studentPerformanceList2 ="Try: ";
                                    $scope.studentPerformanceList3 ="1. Reload the webpage.";
                                    $scope.studentPerformanceList4 ="2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                        
                                    //$scope.studentPerformanceList = "No Classes Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                    
                                    $scope.studentPerformanceData1 = "No Performance Data Found… ";
                                    $scope.studentPerformanceData2 ="Try: ";
                                    $scope.studentPerformanceData3 ="1. Reload the webpage.";
                                    $scope.studentPerformanceData4 ="2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                    
                                    //$scope.studentPerformanceData = "No Performance Data Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                    $('.showStudentDiv').hide();
                                    $('#noRecord10').addClass('noRecord');
                                    $('#noRecord11').addClass('noRecord');
                                }     
                            }else{//ERROR : 500 in api
                               
                                $scope.studentPerformanceList1 = "No Classes Found… ";
                                $scope.studentPerformanceList2 ="Try: ";
                                $scope.studentPerformanceList3 ="1. Reload the webpage.";
                                $scope.studentPerformanceList4 ="2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                    
                                //$scope.studentPerformanceList = "No Classes Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                
                                $scope.studentPerformanceData1 = "No Performance Data Found… ";
                                $scope.studentPerformanceData2 ="Try: ";
                                $scope.studentPerformanceData3 ="1. Reload the webpage.";
                                $scope.studentPerformanceData4 ="2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                
                                //$scope.studentPerformanceData = "No Performance Data Found…<br>Try:<br>1. Reload the webpage.<br>2. If the problem persists, please submit your query to <b>support@involvedtech.co.uk</b> using your school email address.";
                                $('.showStudentDiv').hide();
                                $('#noRecord10').addClass('noRecord');
                                $('#noRecord11').addClass('noRecord');
                            } 
                        });
                };
            }
            
            
            $scope.changeStyle=function()
            {
                //alert('changeStyle');
                $('.select_outter_new').removeClass('blink_me');
            }
            
            /*FETCH STUDENT LIST WHEN CLASS IS SELECTED FROM DROPDOWN IN CREATE NEW TASK MODAL*/
            $scope.studentListResponseDropdown = function (classId)
            {
                //alert(classId);
                ///LOADER SHOW
                $(window).scrollTop(0);
                $("#status_create_task_modal").css("display", "block");
                $("#preloader_create_task_modal").css("display", "block");
                
                if (classId==0) {
                    $('.select_outter_new').css({'border':'2px solid #54c9e8'});
                    $('.select_outter_new').addClass('blink_me');
                }else{
                    $('.select_outter_new').css({'border':'none'});
                    $('.select_outter_new').removeClass('blink_me');
                } 
                //var classId = $scope.classIdModel;
                setOnlyCookie("classId", classId, 60 * 60 * 60);
                
                homeService.studentListResponse(access_token, classId, function (response)
                {
                    if(response.status){
                        ///LOADER HIDE
                        $(window).scrollTop(0);
                        $("#status_create_task_modal").fadeOut();
                        $("#preloader_create_task_modal").delay(200).fadeOut("slow");
                        if(response != ''){
                          //  $("#createTaskMessage").css("display", "none");
                            $('.showStudentDivPopup').show();
                            $(".setTaskPopBtn").removeAttr('disabled');
                            $scope.studentList = response;
                            $scope.noOfStudents = response.length;
                            $scope.nostudentList="";
                            $scope.nostudentList1="";
                            $scope.nostudentList2="";
                            $scope.nostudentList3="";
                            $scope.nostudentlist4="";
                            //$scope.studentListMessagePopup = '';
                            //$('#noRecord5').removeClass('noRecord');
                            $('#noRecord7').removeClass('noRecord');
                            
                            //on changing class name from dropdown selected check box gets deselected
                            var SelectedStudentIds =  new Array();
                            $scope.isExist = function(id){                                     
                                    return SelectedStudentIds.indexOf(id);
                            }
                            var numberOfChecked = 0;
                            $('#remember4').prop('checked', false);
                            $('#remember4').removeAttr('checked');
                        }else{
                            
                            if (classId==0) {
                                $('.select_outter_new').css({'border':'2px solid #54c9e8'});
                                $('.select_outter_new').addClass('blink_me');
                                $('.showStudentDivPopup').hide();
                                 $(".setTaskPopBtn").attr('disabled');
                                 $scope.studentList = '';
                                 $scope.noOfStudents = 0;
                                $("#noRecord7").css("display", "none");
                                $('#noRecord7').removeClass('noRecord');
                            }else{
                                $('.showStudentDivPopup').hide();
                                $(".setTaskPopBtn").attr('disabled');
                                $scope.studentList = '';
                                $scope.noOfStudents = 0;
                                $scope.nostudentList = "No Students Found… ";
                                $scope.nostudentList1="Try: ";
                                $scope.nostudentList2="1. Reload the webpage.";
                                $scope.nostudentList3="2. If the problem persists, please submit your query";
                                $scope.nostudentlist4="here.";
                                $("#noRecord7").css("display", "block");
                                $('#noRecord7').addClass('noRecord');
                            }
                          
                        }
    
                   } else if(response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                      
                        $('.showStudentDivPopup').hide();
                        $("#confy1").click();
                        $scope.msg = 'Server failed to respond. Please check your internet connection.';
                        $(".setTaskPopBtn").attr('disabled');
                        $scope.studentList = '';
                        $scope.noOfStudents = 0;
                        $scope.nostudentList = "No Students Found… ";
                        $scope.nostudentList1="Try: ";
                        $scope.nostudentList2="1. Reload the webpage.";
                        $scope.nostudentList3="2. If the problem persists, please submit your query";
                        $scope.nostudentlist4="here.";
                        $("#noRecord7").css("display", "block");
                        $('#noRecord7').addClass('noRecord');
                       
                    }else{
                          $('.showStudentDivPopup').hide();
                        $(".setTaskPopBtn").attr('disabled');
                        $scope.studentList = '';
                        $scope.noOfStudents = 0;
                        $scope.nostudentList = "No Students Found… ";
                        $scope.nostudentList1="Try: ";
                        $scope.nostudentList2="1. Reload the webpage.";
                        $scope.nostudentList3="2. If the problem persists, please submit your query";
                        $scope.nostudentlist4="here.";
                        $("#noRecord7").css("display", "block");
                        $('#noRecord7').addClass('noRecord');
                    }
                    
                });
            };
       



/******************  ***  ***MY TASK SECTION begins (includes CREATE NEW TASK POP UP SECTION)***  ***  ****************/
    $scope.removeWeekRangeCookie = function()
    {
        //alert('removeWeekRangeCookie');
            removeItem("weekStartDate");
            removeItem("weekEndDate");
            
            fromDate = new Date();
            fromDateTime = fromDate.getTime();
            var weekDay = fromDate.getDay(); 
            //alert(weekDay);
            if (weekDay == 0 ) {    //if weekday = 0 ; then day is SUNDAY
                //var weekStartDate = $scope.ISOdateConvertion( (((fromDateTime-(fromDate.getDay()*86400000))+86400000)) );
                //var weekEndDate = $scope.ISOdateConvertion( (((fromDateTime-(fromDate.getDay()*86400000))+(86400000*7))) );
             
                var weekStartDate = $scope.ISOdateConvertion( (fromDateTime-(fromDate.getDay()*86400000))-(86400000*6) );
                var weekEndDate   = $scope.ISOdateConvertion( ((fromDateTime-(fromDate.getDay()*86400000))) );
            
            }else{
                var weekStartDate = $scope.ISOdateConvertion( (((fromDateTime-(fromDate.getDay()*86400000))+86400000)) );
                var weekEndDate = $scope.ISOdateConvertion( (((fromDateTime-(fromDate.getDay()*86400000))+(86400000*7))) );
            }
            
            
            
            //console.log("CHECK FORMAT="+weekStartDate);
            console.log(weekStartDate +'   @@@   '+ weekEndDate);
            setOnlyCookie("weekStartDate", weekStartDate, 60 * 60 * 60);
            setOnlyCookie("weekEndDate", weekEndDate, 60 * 60 * 60);      
    }
    $scope.removeWeekRangeCookie();
    //$("#myTask").removeClass('active');
    
    $(document).on( 'click', '.dropdown-menu', function (e){
        if (e.target.nodeName == 'B' || e.target.nodeName == 'DIV')
        e.stopPropagation();
        
    });
    
    
    $scope.myTimetable = function (){
        //alert('myTimetable func');
        setOnlyCookie("tab", "myTimetable", 60 * 60 * 60);
        ///LOADER HIDE
        $(window).scrollTop(0);
        $("#status_right_content").fadeOut();
        $("#preloader_right_content").delay(200).fadeOut("fast");
    };
    
    /*MY INBOX*/
    $scope.myInbox = function ()
    {
        $('#append_search_div').html('');
        $('#sendMessageInboxReset').click();
        $('#RHS_Section').hide();
        $('#LHS_Section').css("border-right","1px solid #d7d7d7");
        $('#noMsg').show();

        setOnlyCookie("tab", "myInbox", 60 * 60 * 60);
        
                 $timeout(function()
                 {
                     $scope.studentInboxPerformanceResponse = function(studentId,classId,Firstname,Lastname,ParentsName,Image,ClassName,IsUnlocked)
                     {
                                  /*UPDATE MESSAGE COUNT ON CLICK ON STUDENT*/
                 
                                  var countUnreadMessage    = $.trim($('#myInboxUnreadMessageCount').html());
                                  console.log("val  ="+countUnreadMessage);
                                  if (countUnreadMessage!="") {
                                      
                                       $scope.countUnreadMessage = countUnreadMessage - 1;
                                  }else{
                                       
                                       $scope.countUnreadMessage = 0;         
                                  }
                                 
                                  $('#unreadMsg'+studentId+classId).val('');
                                      
                         
                          $('#RHS_Section').show();
                          $('#LHS_Section').css("border-right","none");
                          $('#noMsg').hide();
                  
                         $('#append_dummy_div').html('');
                       
                         $scope.FirstnameInbox   = Firstname;
                         $scope.LastnameInbox    = Lastname;
                         $scope.ParentsNameInbox = ParentsName;
                         $scope.ClassNameInbox   = ClassName;
                         $scope.ImageInbox       = Image;
                        
                         
                         homeService.studentInboxPerformanceResponse(access_token,studentId,classId,function (response)
                         {
                             //alert('1');
                             console.log('STUD INBOX PERFORMANCE');
                             console.log(response);
                             if(response.status)
                             { 
                                 if(response != '')
                                 {
                                  
                                  $scope.studentInboxAttendance= response.Attendance;
                                  $scope.studentInboxAttendanceTrend= response.AttendanceTrend;
                                  $scope.studentInboxGradeTrend= response.GradeTrend;
                                  $scope.studentInboxLastGrade= response.LastGrade;
                                  $scope.studentInboxTargetGrade= response.TargetGrade;
                                  $scope.studentInboxstatus= response.status;
                                  //if (response.GradeTrend == true) {
                                  //     $scope.plotcolor = "#5BD9A4";
                                  //}else if (response.GradeTrend == false) {
                                  //     $scope.plotcolor = "#FF5958";
                                  //}else{
                                  //     $scope.plotcolor = "orange";
                                  //}
                                     
                                  $('.user_box').removeClass('studSelect');
                                  $('#msgstud'+studentId+classId).addClass('studSelect');
                                  
                                  $timeout(function() {
                                   
                                     $("#chat_box").mCustomScrollbar("scrollTo","bottom");
                                        document.getElementById("chat_box").addEventListener("wheel", myFunction);
                                             function myFunction(event) {
                                                 console.log(event);
                                                 var offset = $("#mCSB_5_container" ).offset();
                                                 var Top=offset.top;
                                                 //alert(Top);
                                                 if (Top==245) {
                                                    $scope.getMore(); 
                                                 }
                                             }
                                      },100);  
                                  } else {
                                     $scope.studentInboxAttendance= "";
                                     $scope.studentInboxAttendanceTrend= "";
                                     $scope.studentInboxGradeTrend= "";
                                     $scope.studentInboxLastGrade= "";
                                     $scope.studentInboxTargetGrade= "";
                                     $scope.studentInboxstatus= "";
                                 }      
                             } else if(response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                                     $scope.studentInboxAttendance= "";
                                     $scope.studentInboxAttendanceTrend= "";
                                     $scope.studentInboxGradeTrend= "";
                                     $scope.studentInboxLastGrade= "";
                                     $scope.studentInboxTargetGrade= "";
                                     $scope.studentInboxstatus= "";
                             } else {
                                     $scope.studentInboxAttendance= "";
                                     $scope.studentInboxAttendanceTrend= "";
                                     $scope.studentInboxGradeTrend= "";
                                     $scope.studentInboxLastGrade= "";
                                     $scope.studentInboxTargetGrade= "";
                                     $scope.studentInboxstatus= "";
                             }
                         });
                         var userid = getOnlyCookie("userid");
                         
                         /*LOAD MESSAGE HISTORY*/
                         homeService.InboxMessageHistoryResponse(access_token,studentId,classId, function (response1)
                         {
                         
                             if(response1.status)
                             { 
                                 if(response1 != '')
                                 {
                                     console.log('MESSAGE HISTORY');
                                     console.log(response1);
                                     $scope.InboxMessageHistory = response1;
                                     $scope.noChatFound = "";
                                     $scope.loggedInTeacherId = userid;
                                     $scope.latestmessagetime = response1[response1.length - 1].SentDate;
                                     $scope.loggedInTeacherIdLoadMore = userid;
                            
                                     $("#append_chat_div").mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
                                      
                                     $scope.fetching = false;
                                     $scope.disabled = false;
                                     var latestmessagetime = $("#latestmessagetime").val();
                                     $scope.getMore = function()
                                     {
                                        //alert('scroll') 
                                         var latestmessagetime1 = $("#latestmessagetime").val();
                      
                                         // Block fetching until the AJAX call returns
                                         homeService.InboxMessageHistoryLoadMoreResponse(access_token,studentId,classId,latestmessagetime1,function (response2)
                                         {
                                             if(response2.status)
                                             { 
                                                 console.log('MESSAGE HISTORY LOAD MORE');
                                                 console.log(response2);
                                                 $scope.InboxMessageHistoryLoadMore = response2;
                                                 $scope.loggedInTeacherIdLoadMore = userid;
                                                 if (response2 != null){ 
                                                     $("#latestmessagetime").val(response2[response2.length - 1].SentDate);
                                                 }
                                             }else{
                                                  $scope.disabled = true; 
                                             }
                                         });
                                     };
                                 } else {
                                     console.log('MESSAGE HISTORY');
                                     console.log(response1);
                                     $scope.InboxMessageHistory = "";
                                     $scope.noChatFound = "";
                                     //$scope.noChatFound = "No Active Chats Found…";
                                     $scope.loggedInTeacherId = userid;
                                     $scope.latestmessagetime = "";
                                 }      
                             } else if(response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                                 console.log('MESSAGE HISTORY');
                                 console.log(response1);
                                 $("#confy1").click();
                                 $scope.msg = 'Server failed to respond. Please check your internet connection.';
                                 $scope.InboxMessageHistory = "";
                                 $scope.noChatFound = "";
                                 //$scope.noChatFound = "No Active Chats Found…";
                                 $scope.loggedInTeacherId = userid;
                                 $scope.latestmessagetime = "";
                             } else {
                                 console.log('MESSAGE HISTORY');
                                 console.log(response1);
                                 $scope.InboxMessageHistory = "";
                                 $scope.noChatFound = "";
                                 //$scope.noChatFound = "No Active Chats Found…";
                                 $scope.loggedInTeacherId = userid;
                                 $scope.latestmessagetime = "";
                             }
                         });
                        
                         
                         /*SEND MESSAGE INBOX*/
                         $scope.sendMessageInbox = function()
                         {
                             $scope.noChatFound = "";
                             var content = $.trim($("#content1").val());
                             var error = 0;
                             if( $('#content1').val().toString().trim() == '' )
                             {              
                                 $('#content1').val('');    
                                 $("#content1").attr("placeholder","Please enter your message").addClass('red_place');
                                 error++;
                                 return false;
                             }else{                          
                                 $("#content1").attr("placeholder","Type a message here...").removeClass('red_place');  
                             }
                             if(content.length > 500)
                             {                           
                                 $("#content1").attr("placeholder","Your message must not be more than 500 characters").addClass('red_place');
                                 error++;
                                 return false;
                             }else{
                                 $("#content1").attr("placeholder","Type a message here...").removeClass('red_place');  
                             }
                             
                             if(error == 0)
                             {
                                 homeService.studentInboxMessageSend(access_token,studentId,classId,content,function (response3)
                                 {
                                     console.log('INBOX MESSAGE SEND');
                                     console.log(response3);
                                     document.getElementById("sendMessageInbox").disabled = false;
                                        
                                     if(response3)
                                     {
                                         document.getElementById("sendMessageInbox").disabled = true;
                                         $scope.response3 = response3;
                                         var SenderName = response3.SenderName;
                                         var Content = response3.Content;
                                         var SentDate = $filter('date')(response3.SentDate, "dd MMM H:mm");  // for type="date" binding
                                         $('#append_dummy_div').append('<span class="clearfix" style="display: block;"><div class="chat-convrstaion chat-rel"><div class="conversation arrow_box">'+Content+'</div><span>'+SentDate+'</span></div></span>');
                                         $("#content1").val('');
                                         $timeout(function() {
                                             //$("#chat_box").mCustomScrollbar({
                                             //    axis: "y",
                                             //    theme: "3d",
                                             //    scrollInertia: 550,
                                             //    scrollbarPosition: "outside"
                                             //});
                                             $("#chat_box").mCustomScrollbar("scrollTo","bottom");
                                         },100); 
                                         
                                     }else{
                                       
                                     }
                                 });
                             }
                             };
                         };
                         
                                  if (teacherId != undefined)
                                  {
                         
                                      homeService.studentListInboxResponse(access_token, teacherId, function (response)
                                      {
                                          /*RESET STUDENT IDS IN HIDDEN FILED*/
                                          $('#studentIds').val('');
                                          
                                          console.log('STUDENT LIST INBOX');
                                          console.log(response);
                                          if(response.status)
                                          { 
                                              if(response != '')
                                              {
                                                  $scope.studentListInbox = response;
                                                  
                                                  /*COUNT OF UNREAD MESSAGES IN MY INBOX*/
                                                   var countUnreadMessage = 0;
                                                   for(var j=0; j<response.length; j++)
                                                   {
                                                       if(response[j].UnreadMessageCount != 0){
                                                           countUnreadMessage++;
                                                       }
                                                   }
                                                   console.log("countUnreadMessage-->--->"+countUnreadMessage);
                                                  
                                                   $scope.countUnreadMessage = parseInt(countUnreadMessage);
                                                   
                                                   var studentIds = Array();
                                                   var classIds   = Array();
                                                   for (var i=0;i<response.length; i++){
                                                      studentIds[i] = response[i].Id;
                                                      classIds[i] = response[i].ClassId;
                                                   }
                                                  
                                                   $scope.noStudentMsg = "";
                                                   //LOADER HIDE
                                                   $(window).scrollTop(0);
                                                   $("#status_right_content8").css("display", "none");
                                                   $("#preloader_right_content8").css("display", "none");
                                                   //$scope.studentInboxPerformanceResponse(response[0].Id,response[0].ClassId,response[0].Firstname,response[0].Lastname,response[0].ParentsName,response[0].Image,response[0].ClassName,response[0].IsUnlocked);
                                              }else{
                                                  $scope.studentListInbox = "";
                                                  $scope.noStudentMsg = "No student found";
                                                  //LOADER HIDE
                                                  $(window).scrollTop(0);
                                                  $("#status_right_content8").css("display", "none");
                                                  $("#preloader_right_content8").css("display", "none");
                                              }      
                                          } else if(response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                                              $scope.studentListInbox = "";
                                              $scope.noStudentMsg = "No student found";
                                              //LOADER HIDE
                                              $(window).scrollTop(0);
                                              $("#status_right_content8").css("display", "none");
                                              $("#preloader_right_content8").css("display", "none");
                                              $("#confy1").click();
                                              $scope.msg = 'Server failed to respond. Please check your internet connection.';
                                          } else {
                                              $scope.studentListInbox = "";
                                              $scope.noStudentMsg = "No student found";
                                              //LOADER HIDE
                                              $(window).scrollTop(0);
                                              $("#status_right_content8").css("display", "none");
                                              $("#preloader_right_content8").css("display", "none");
                                          }
                                          console.log(studentIds);
                                          /*STORE STUDENT IDS & RESPECTIVE CLASS IDS IN HIDDEN FILED*/
                                          $('#studentIds').val(studentIds.toString());
                                          $('#classIds').val(classIds.toString());
                                          
                                      });
                        
                                  }else{
                                      $scope.noStudentMsg = "No student found";
                                  }
                          
                         
                  },100);
            
    };
    $scope.myInbox();
    $scope.countUnreadMessage = 0;
    
    /*MY TASK*/
    $scope.myTask = function (check_date)
    {
        /////LOADER SHOW
        $(window).scrollTop(0);
        $("#status_right_content5").css("display", "block");
        $("#preloader_right_content5").css("display", "block");
        
        setOnlyCookie("tab", "myTask", 60 * 60 * 60);
        var displayStartDate = getOnlyCookie("weekStartDate");
        var displayEndDate = getOnlyCookie("weekEndDate");
      
        var time3 = new Date();
        var curdateIST = time3.toISOString();
        var curdateISOstrdate = curdateIST.split('T');
        var curdateFinal = curdateISOstrdate[0]+'T00:00:00';
        $scope.finalCur = curdateFinal;
        
        /*reset fields after setting task redirects to my task*/
         /*Reset all prefilled fields in MY CLASSES section*/
            /*create task section*/
            //alert('create task sec');
            $("#taskCreateReset").click();
            $("#tasktype1").val('Task Type');
            $("#tasktype1").change();
            $("#day1").change();
            $("#mnth1").change();
            $("#year1").change();

            $scope.tasktypeErr = "";
            $("#title1").attr("placeholder","Title").removeClass('red_place');
            $("#description1").attr("placeholder","Description").removeClass('red_place');  
            $scope.dateErr = "";
            $scope.countSelectStudentsTask = 0;
            $("#studentIdsForCreateTask").val('');
            $scope.countSelectStudentsMessage = 0;
            $("#studentIdsForMessage").val('');
            /*clear the attachment div*/
            $('#adddiv').html('');
            /*reset file upload fields*/
            $('#fileNum').val(0);
            $('#file_size1').val(0);
            /**************************/
           
           //alert(displayStartDate  +'###'+  displayEndDate);
           
            /***MY TASK CALENDAR***/
            /*CALENDER DROPDOWN ONLOAD*/
            $scope.myTaskCalendar = function ()
            {           
                var time = new Date();
                var weekDay = time.getDay();

                    //alert('myTaskCalendar click = '+displayStartDate+' &&&  '+displayEndDate);
                    if (check_date == 1 ) /// on load current week will show,if date not present in cookie then current week will show
                    { 
                        if (displayStartDate == "" && displayEndDate == "")
                        {
                            var time = new Date();                 
                            var startdateIST = time.setDate(time.getDate()-21);
                            var startdateISO = new Date(startdateIST);
                            var startdateISOstr = startdateISO.toISOString();
                            var startdateISOstrdate = new Date(startdateISOstr);
                            var startdate = startdateISOstrdate.getFullYear()+'-' + (startdateISOstrdate.getMonth()+1) + '-'+startdateISOstrdate.getDate();
                           
                            var time1 = new Date();
                            var enddateIST = time1.setDate(time1.getDate()+21);
                            var enddateISO = new Date(enddateIST);
                            var enddateISOstr = enddateISO.toISOString();
                            var enddateISOstrdate = new Date(enddateISOstr);
                            var enddate = enddateISOstrdate.getFullYear()+'-' + (enddateISOstrdate.getMonth()+1) + '-'+enddateISOstrdate.getDate();
                
                            homeService.myTaskCalenderResponse(access_token,startdate,enddate,function (response)
                            {
                                ///LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content5").css("display", "none");
                                $("#preloader_right_content5").css("display", "none");
                                
                                console.log('CAL DATA');
                                console.log(response);
                                $scope.myTaskListCalendar = response;
                                var response_length = response.length;
                                var firstWeekRangeStartDate = response[0]['StartDate'];
                                var firstWeekRangeEndDate = response[0]['EndDate'];
                                var lastWeekRangeStartDate = response[response_length-1]['StartDate'];
                                var lastWeekRangeEndDate = response[response_length-1]['EndDate'];            
                                setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                                
                                /*onclick next week load more button , new weeks gets concated with existing ones*/
                                $scope.load_more_weeks = function(val)
                                {
                                    if (val == 'next')
                                    { 
                                        var firstWeekRangeStartDate1    = getOnlyCookie("firstWeekRangeStartDate");
                                        var firstWeekRangeEndDate1      = getOnlyCookie("firstWeekRangeEndDate");
                                        var lastWeekRangeStartDate1     = getOnlyCookie("lastWeekRangeStartDate");
                                        var lastWeekRangeEndDate1       = getOnlyCookie("lastWeekRangeEndDate");
     
                                        var time_2 = new Date(lastWeekRangeEndDate1);
                                        var enddateIST_2 = time_2.setDate(time_2.getDate()+21);
                                        var enddateISO_2 = new Date(enddateIST_2);
                                        var enddateISOstr_2 = enddateISO_2.toISOString();
                                        var enddateISOstrdate_2 = new Date(enddateISOstr_2);
                                        var enddate_2 = enddateISOstrdate_2.getFullYear()+'-' + (enddateISOstrdate_2.getMonth()+1) + '-'+enddateISOstrdate_2.getDate();
                                        
                                        startdate_1=firstWeekRangeStartDate1;
                                      
                                        console.log('startdate_1 =='+startdate_1);
                                        console.log('enddate_2 =='+startdate_1);
                                        homeService.myTaskCalenderResponse(access_token,startdate_1,enddate_2,function (response_next) {
                            
                                            response_concat_response_next = response_next;
                                            $scope.myTaskListCalendar     = response_next;
                                     
                                            console.log('APPEND NEXT WEEK =====>>');
                                            console.log(response_concat_response_next);
                                            
                                            var response_length = response_concat_response_next.length;                                                                            ;
                                            var firstWeekRangeStartDate = response_concat_response_next[0]['StartDate'];
                                            var firstWeekRangeEndDate   = response_concat_response_next[0]['EndDate'];
                                            var lastWeekRangeStartDate  = response_concat_response_next[response_length-1]['StartDate'];
                                            var lastWeekRangeEndDate    = response_concat_response_next[response_length-1]['EndDate'];            
                                            setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                            setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                            setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                            setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                                        });
                                    
                                    } else if (val == 'prev') {
                                        
                                        var firstWeekRangeStartDate1    = getOnlyCookie("firstWeekRangeStartDate");
                                        var firstWeekRangeEndDate1      = getOnlyCookie("firstWeekRangeEndDate");
                                        var lastWeekRangeStartDate1     = getOnlyCookie("lastWeekRangeStartDate");
                                        var lastWeekRangeEndDate1       = getOnlyCookie("lastWeekRangeEndDate");
                                        
                                        var time_3 = new Date(firstWeekRangeStartDate1);
                                        var startdateIST_3 = time_3.setDate(time_3.getDate()-21);
                                        var startdateISO_3 = new Date(startdateIST_3);
                                        var startdateISOstr_3 = startdateISO_3.toISOString()
                                        var startdateISOstrdate_3 = new Date(startdateISOstr_3);
                                        var startdate_3 = startdateISOstrdate_3.getFullYear()+'-' + (startdateISOstrdate_3.getMonth()+1) + '-'+startdateISOstrdate_3.getDate();
                                       
                                        enddate_4 = lastWeekRangeEndDate1;
                                        
                                        homeService.myTaskCalenderResponse(access_token,startdate_3,enddate_4,function (response_prev) {
                                            
                                            var response_prev_concat_response = new Array();
                                            response_prev_concat_response = response_prev;
                                            $scope.myTaskListCalendar     = response_prev_concat_response;
                                            
                                            console.log('APPEND PREVIOUS WEEK =====>>');
                                            console.log(response_prev_concat_response);
        
                                            var response_length = response_prev_concat_response.length;
                                            
                                            var firstWeekRangeStartDate = response_prev_concat_response[0]['StartDate'];
                                            var firstWeekRangeEndDate   = response_prev_concat_response[0]['EndDate'];
                                            var lastWeekRangeStartDate  = response_prev_concat_response[response_length-1]['StartDate'];
                                            var lastWeekRangeEndDate    = response_prev_concat_response[response_length-1]['EndDate'];
                                            setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                            setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                            setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                            setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                                        });
                                    }
                                };
                            });
                                
                        }else{ /// on redirect from set task / update task , calendar will load with that week range 
                            
                            var time = new Date(displayStartDate);                 
                            var startdateIST = time.setDate(time.getDate()-21);
                            var startdateISO = new Date(startdateIST);
                            var startdateISOstr = startdateISO.toISOString();
                            var startdateISOstrdate = new Date(startdateISOstr);
                            var startdate = startdateISOstrdate.getFullYear()+'-' + (startdateISOstrdate.getMonth()+1) + '-'+startdateISOstrdate.getDate();
                           
                            var time1 = new Date(displayEndDate);
                            var enddateIST = time1.setDate(time1.getDate()+21);
                            var enddateISO = new Date(enddateIST);
                            var enddateISOstr = enddateISO.toISOString();
                            var enddateISOstrdate = new Date(enddateISOstr);
                            var enddate = enddateISOstrdate.getFullYear()+'-' + (enddateISOstrdate.getMonth()+1) + '-'+enddateISOstrdate.getDate();
                            
                            homeService.myTaskCalenderResponse(access_token,startdate,enddate,function (response)
                            {
                                ///LOADER HIDE
                                $(window).scrollTop(0);
                                $("#status_right_content5").css("display", "none");
                                $("#preloader_right_content5").css("display", "none");
                                
                                console.log('CAL DATA');
                                console.log(response);
                                $scope.myTaskListCalendar = response;
                                var response_length = response.length;
                                var firstWeekRangeStartDate = response[0]['StartDate'];
                                var firstWeekRangeEndDate = response[0]['EndDate'];
                                var lastWeekRangeStartDate = response[response_length-1]['StartDate'];
                                var lastWeekRangeEndDate = response[response_length-1]['EndDate'];            
                                setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                                
                                /*onclick next week load more button , new weeks gets concated with existing ones*/
                                $scope.load_more_weeks = function(val)
                                {
                                    if (val == 'next')
                                    {
                                        var firstWeekRangeStartDate1    = getOnlyCookie("firstWeekRangeStartDate");
                                        var firstWeekRangeEndDate1      = getOnlyCookie("firstWeekRangeEndDate");
                                        var lastWeekRangeStartDate1     = getOnlyCookie("lastWeekRangeStartDate");
                                        var lastWeekRangeEndDate1       = getOnlyCookie("lastWeekRangeEndDate");
     
                                        var time_2 = new Date(lastWeekRangeEndDate1);
                                        var enddateIST_2 = time_2.setDate(time_2.getDate()+21);
                                        var enddateISO_2 = new Date(enddateIST_2);
                                        var enddateISOstr_2 = enddateISO_2.toISOString();
                                        var enddateISOstrdate_2 = new Date(enddateISOstr_2);
                                        var enddate_2 = enddateISOstrdate_2.getFullYear()+'-' + (enddateISOstrdate_2.getMonth()+1) + '-'+enddateISOstrdate_2.getDate();
                                        
                                        startdate_1=firstWeekRangeStartDate1;
                                      
                                        console.log('startdate_1 =='+startdate_1);
                                        console.log('enddate_2 =='+startdate_1);
                                        homeService.myTaskCalenderResponse(access_token,startdate_1,enddate_2,function (response_next) {
                                            response_concat_response_next = response_next;
                                            $scope.myTaskListCalendar     = response_next;
                                     
                                            console.log('APPEND NEXT WEEK =====>>');
                                            console.log(response_concat_response_next);
                                            
                                            var response_length = response_concat_response_next.length;                                                                            ;
                                            var firstWeekRangeStartDate = response_concat_response_next[0]['StartDate'];
                                            var firstWeekRangeEndDate   = response_concat_response_next[0]['EndDate'];
                                            var lastWeekRangeStartDate  = response_concat_response_next[response_length-1]['StartDate'];
                                            var lastWeekRangeEndDate    = response_concat_response_next[response_length-1]['EndDate'];            
                                            setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                            setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                            setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                            setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                                        });
                                    
                                    } else if (val == 'prev') {
                                        
                                        var firstWeekRangeStartDate1    = getOnlyCookie("firstWeekRangeStartDate");
                                        var firstWeekRangeEndDate1      = getOnlyCookie("firstWeekRangeEndDate");
                                        var lastWeekRangeStartDate1     = getOnlyCookie("lastWeekRangeStartDate");
                                        var lastWeekRangeEndDate1       = getOnlyCookie("lastWeekRangeEndDate");
                                        
                                        var time_3 = new Date(firstWeekRangeStartDate1);
                                        var startdateIST_3 = time_3.setDate(time_3.getDate()-21);
                                        var startdateISO_3 = new Date(startdateIST_3);
                                        var startdateISOstr_3 = startdateISO_3.toISOString()
                                        var startdateISOstrdate_3 = new Date(startdateISOstr_3);
                                        var startdate_3 = startdateISOstrdate_3.getFullYear()+'-' + (startdateISOstrdate_3.getMonth()+1) + '-'+startdateISOstrdate_3.getDate();
                                       
                                        enddate_4 = lastWeekRangeEndDate1;
                                        
                                        homeService.myTaskCalenderResponse(access_token,startdate_3,enddate_4,function (response_prev) {
                                            var response_prev_concat_response = new Array();
                                            response_prev_concat_response = response_prev;
                                            $scope.myTaskListCalendar     = response_prev_concat_response;
                                            
                                            console.log('APPEND PREVIOUS WEEK =====>>');
                                            console.log(response_prev_concat_response);
        
                                            var response_length = response_prev_concat_response.length;
                                            
                                            var firstWeekRangeStartDate = response_prev_concat_response[0]['StartDate'];
                                            var firstWeekRangeEndDate   = response_prev_concat_response[0]['EndDate'];
                                            var lastWeekRangeStartDate  = response_prev_concat_response[response_length-1]['StartDate'];
                                            var lastWeekRangeEndDate    = response_prev_concat_response[response_length-1]['EndDate'];
                                            setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                            setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                            setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                            setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                                        });
                                    }
                                };
                            });
                        }
           
                    } else { //if date present in cookie then that week will show
             
                        var time = new Date(displayStartDate);
                        var startdateIST = time.setDate(time.getDate()-21);
                        var startdateISO = new Date(startdateIST);
                        var startdateISOstr = startdateISO.toISOString()
                        var startdateISOstrdate = new Date(startdateISOstr);
                        var startdate = startdateISOstrdate.getFullYear()+'-' + (startdateISOstrdate.getMonth()+1) + '-'+startdateISOstrdate.getDate();
                       
                        var time1 = new Date(displayEndDate);
                        var enddateIST = time1.setDate(time1.getDate()+21);
                        var enddateISO = new Date(enddateIST);
                        var enddateISOstr = enddateISO.toISOString();
                        var enddateISOstrdate = new Date(enddateISOstr);
                        var enddate = enddateISOstrdate.getFullYear()+'-' + (enddateISOstrdate.getMonth()+1) + '-'+enddateISOstrdate.getDate();
                         
                        homeService.myTaskCalenderResponse(access_token,startdate,enddate,function (response)
                        {
                            ///LOADER HIDE
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            
                            $scope.myTaskListCalendar = response;
                            var response_length = response.length;
                            var firstWeekRangeStartDate = response[0]['StartDate'];
                            var firstWeekRangeEndDate = response[0]['EndDate'];
                            var lastWeekRangeStartDate = response[response_length-1]['StartDate'];
                            var lastWeekRangeEndDate = response[response_length-1]['EndDate'];            
                            setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                            setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                            setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                            setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                            
                            /*onclick next week load more button , new weeks gets concated with existing ones*/
                            $scope.load_more_weeks = function(val)
                            {
                                var response_concat_response_next = new Array();
                                var response_prev_concat_response = new Array();
                                if (val == 'next')
                                {
                                    var firstWeekRangeStartDate1    = getOnlyCookie("firstWeekRangeStartDate");
                                    var firstWeekRangeEndDate1      = getOnlyCookie("firstWeekRangeEndDate");
                                    var lastWeekRangeStartDate1     = getOnlyCookie("lastWeekRangeStartDate");
                                    var lastWeekRangeEndDate1       = getOnlyCookie("lastWeekRangeEndDate");
 
                                    var time_2 = new Date(lastWeekRangeEndDate1);
                                    var enddateIST_2 = time_2.setDate(time_2.getDate()+21);
                                    var enddateISO_2 = new Date(enddateIST_2);
                                    var enddateISOstr_2 = enddateISO_2.toISOString();
                                    var enddateISOstrdate_2 = new Date(enddateISOstr_2);
                                    var enddate_2 = enddateISOstrdate_2.getFullYear()+'-' + (enddateISOstrdate_2.getMonth()+1) + '-'+enddateISOstrdate_2.getDate();
                                    
                                    startdate_1=firstWeekRangeStartDate1;
                                  
                                    console.log('startdate_1 =='+startdate_1);
                                    console.log('enddate_2 =='+startdate_1);
                                    homeService.myTaskCalenderResponse(access_token,startdate_1,enddate_2,function (response_next) {
                        
                                        response_concat_response_next = response_next;
                                        $scope.myTaskListCalendar     = response_concat_response_next;
                                 
                                        console.log('APPEND NEXT WEEK =====>>');
                                        console.log(response_concat_response_next);
                                        
                                        var response_length = response_concat_response_next.length;                                                                            ;
                                        var firstWeekRangeStartDate = response_concat_response_next[0]['StartDate'];
                                        var firstWeekRangeEndDate   = response_concat_response_next[0]['EndDate'];
                                        var lastWeekRangeStartDate  = response_concat_response_next[response_length-1]['StartDate'];
                                        var lastWeekRangeEndDate    = response_concat_response_next[response_length-1]['EndDate'];            
                                        setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                        setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                        setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                        setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                                        
                                    });
                                
                                } else if (val == 'prev') {
                                    
                                    var firstWeekRangeStartDate1    = getOnlyCookie("firstWeekRangeStartDate");
                                    var firstWeekRangeEndDate1      = getOnlyCookie("firstWeekRangeEndDate");
                                    var lastWeekRangeStartDate1     = getOnlyCookie("lastWeekRangeStartDate");
                                    var lastWeekRangeEndDate1       = getOnlyCookie("lastWeekRangeEndDate");
                                    
                                    var time_3 = new Date(firstWeekRangeStartDate1);
                                    var startdateIST_3 = time_3.setDate(time_3.getDate()-21);
                                    var startdateISO_3 = new Date(startdateIST_3);
                                    var startdateISOstr_3 = startdateISO_3.toISOString()
                                    var startdateISOstrdate_3 = new Date(startdateISOstr_3);
                                    var startdate_3 = startdateISOstrdate_3.getFullYear()+'-' + (startdateISOstrdate_3.getMonth()+1) + '-'+startdateISOstrdate_3.getDate();
                                   
                                    enddate_4 = lastWeekRangeEndDate1;
                                    
                                    homeService.myTaskCalenderResponse(access_token,startdate_3,enddate_4,function (response_prev) {
                                        
                                        response_prev_concat_response = response_prev;
                                        $scope.myTaskListCalendar     = response_prev_concat_response;
                                        
                                        console.log('APPEND PREVIOUS WEEK =====>>');
                                        console.log(response_prev_concat_response);
    
                                        var response_length = response_prev_concat_response.length;
                                        
                                        var firstWeekRangeStartDate = response_prev_concat_response[0]['StartDate'];
                                        var firstWeekRangeEndDate   = response_prev_concat_response[0]['EndDate'];
                                        var lastWeekRangeStartDate  = response_prev_concat_response[response_length-1]['StartDate'];
                                        var lastWeekRangeEndDate    = response_prev_concat_response[response_length-1]['EndDate'];
                                        setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                                        setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                                        setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                                        setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                                        
                                    });
                                }
                            };
                        });
                    }
                    
                $timeout(function() {
                   // alert('call');
                  $('#myTask').addClass('active');
                },100);

            };
            $scope.myTaskCalendar();
            
            
            var fromDate = new Date();
            $scope.currentWeek = function(fromDate)
            {
                /////LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content5").css("display", "block");
                $("#preloader_right_content5").css("display", "block");
                //alert(displayStartDate +'###'+ displayEndDate);
                fromDate = (typeof fromDate != 'undefined' && fromDate != '')?new Date(fromDate):new Date();
                fromDateTime = fromDate.getTime();

                var time = new Date();
                var weekDay = time.getDay(); 
                //alert(weekDay);
                if (weekDay == 0 ) {    //if weekday = 0 ; then day is SUNDAY
                   
                    if ((displayStartDate=="" || displayStartDate==undefined || displayStartDate=='undefined') && check_date == 1) {
                 
                        $scope.currentWeekStartDate = $scope.ISOdateConvertion( (fromDateTime-(fromDate.getDay()*86400000))-(86400000*6) );
                        $scope.currentWeekEndDate   = $scope.ISOdateConvertion( ((fromDateTime-(fromDate.getDay()*86400000))) );
              
                        var weekStartDate = $scope.ISOdateConvertion( (fromDateTime-(fromDate.getDay()*86400000))-(86400000*6) );
                        var weekEndDate   = $scope.ISOdateConvertion( ((fromDateTime-(fromDate.getDay()*86400000))) );
                        //console.log("CHECK FORMAT="+weekStartDate);
                        setOnlyCookie("weekStartDate", weekStartDate, 60 * 60 * 60);
                        setOnlyCookie("weekEndDate", weekEndDate, 60 * 60 * 60);
                        
                    }else{
                        
                        var time1 = new Date(displayStartDate);
                        var weekDay1 = time1.getDay();
                       // alert(displayStartDate+ '###   '+  weekDay1);
                        if (weekDay1 == 0) {
                            //alert('other - 1');
                            var weekStartDate = $scope.ISOdateConvertion( (fromDateTime-(fromDate.getDay()*86400000))-(86400000*6) );
                            var weekEndDate = $scope.ISOdateConvertion( ((fromDateTime-(fromDate.getDay()*86400000))) );
                        }else{
                            //alert('other - 2');
                            var weekStartDate = displayStartDate;
                            var weekEndDate = displayEndDate;
                          
                        }
                        
                        $scope.currentWeekStartDate =  new Date(weekStartDate);
                        $scope.currentWeekEndDate =  new Date(weekEndDate);                           
                    }
                    
                }else{
         
                    if ((displayStartDate=="" || displayStartDate==undefined || displayStartDate=='undefined') && check_date == 1) {
                
                        $scope.currentWeekStartDate = new Date((((fromDateTime-(fromDate.getDay()*86400000))+86400000)));
                        $scope.currentWeekEndDate = new Date((((fromDateTime-(fromDate.getDay()*86400000))+(86400000*7))));
                        
                        var weekStartDate = $scope.ISOdateConvertion( (((fromDateTime-(fromDate.getDay()*86400000))+86400000)) );
                        var weekEndDate = $scope.ISOdateConvertion( (((fromDateTime-(fromDate.getDay()*86400000))+(86400000*7))) );
                        //console.log("CHECK FORMAT="+weekStartDate);
                        setOnlyCookie("weekStartDate", weekStartDate, 60 * 60 * 60);
                        setOnlyCookie("weekEndDate", weekEndDate, 60 * 60 * 60);
                        
                    }else{
                   
                        var weekStartDate = displayStartDate;
                        var weekEndDate = displayEndDate;
                        $scope.currentWeekStartDate =  new Date(weekStartDate);
                        $scope.currentWeekEndDate =  new Date(weekEndDate);
                    }
                }
                
                $scope.weekStartDate = weekStartDate;
                $scope.weekEndDate = weekEndDate;
                
                /*ONLOAD TASK LIST OF CURRENT WEEK WILL DISPLAY*/        
                    homeService.myTaskResponse(access_token,weekStartDate,weekEndDate,function (response) {
                        //console.log("###"+response);
                        if(response.status)
                        {
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            if(response != ''){
                                $('#noRecord6').removeClass('noRecord');
                                $scope.weeklyTaskMessage = "";
                                $scope.weeklyTaskMessage1="";
                                $scope.weeklyTaskMessage2="";
                                $scope.weeklyTaskMessage3="";
                                $scope.myTaskList = response; 
                                
                            }else{
                                $('#noRecord6').addClass('noRecord');
                                $scope.weeklyTaskMessage = "No Tasks Due this week.";
                                $scope.weeklyTaskMessage1="Click on ";
                                $scope.weeklyTaskMessage2="Create Task";
                                $scope.weeklyTaskMessage3="to set a task for the students.";
                                $scope.myTaskList = '';
                            }
                        } else if(response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            $("#confy1").click();
                            $scope.msg = 'Server failed to respond. Please check your internet connection.';
                            $('#noRecord6').addClass('noRecord');
                            $scope.weeklyTaskMessage = "No Tasks Due this week.";
                            $scope.weeklyTaskMessage1="Click on ";
                            $scope.weeklyTaskMessage2="Create Task";
                            $scope.weeklyTaskMessage3="to set a task for the students.";
                            $scope.myTaskList = '';
                        } else{
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            $('#noRecord6').addClass('noRecord');
                            $scope.weeklyTaskMessage = "No Tasks Due this week.";
                            $scope.weeklyTaskMessage1="Click on ";
                            $scope.weeklyTaskMessage2="Create Task";
                            $scope.weeklyTaskMessage3="to set a task for the students.";
                            $scope.myTaskList = '';
                        }
                    });
                
            };
            $scope.currentWeek();
            
            /*TO FOCUS ON CURRENT DATE DIV*/
            $timeout(function() {
                //var curdateFinal1 = "2016-08-28T00:00:00";
                var eID = "dateDiv"+curdateFinal;
                var elm = document.getElementById(eID);
                
                console.log(elm);
                if (elm) {
                    var y = elm.offsetTop;
                    
                    $('#mCSB_2_container').css({'top':-y});
                  
                    $("#content-2").mCustomScrollbar("update");
                }
            },1000);
            
            $scope.selectWeek = function (startDate,endDate)
            {
                /////LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content5").css("display", "block");
                $("#preloader_right_content5").css("display", "block");
                $scope.currentWeekStartDate = startDate;
                $scope.currentWeekEndDate = endDate;
                
                var startDate = $scope.ISOdateConvertion( startDate );
                var endDate = $scope.ISOdateConvertion( endDate );
              
                setOnlyCookie("weekStartDate", startDate, 60 * 60 * 60);
                setOnlyCookie("weekEndDate", endDate, 60 * 60 * 60);
                
                var time3 = new Date(startDate);
                var startdateIST = time3.setDate(time3.getDate()-21);
                var startdateISO = new Date(startdateIST);
                var startdateISOstr = startdateISO.toISOString()
                var startdateISOstrdate = new Date(startdateISOstr);
                var startDateRange = startdateISOstrdate.getFullYear()+'-' + (startdateISOstrdate.getMonth()+1) + '-'+startdateISOstrdate.getDate();
             
                var time4 = new Date(endDate);
                var enddateIST = time4.setDate(time4.getDate()+21);
                var enddateISO = new Date(enddateIST);
                var enddateISOstr = enddateISO.toISOString();
                var enddateISOstrdate = new Date(enddateISOstr);
                var endDateRange = enddateISOstrdate.getFullYear()+'-' + (enddateISOstrdate.getMonth()+1) + '-'+enddateISOstrdate.getDate();
               
                    /*ON SELECT WEEK TASK LIST OF SELECTED WEEK WILL DISPLAY*/   
                    homeService.myTaskResponse(access_token,startDate,endDate,function (response) {
                        if(response.status){
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            if(response != ''){
                                $('#noRecord6').removeClass('noRecord');
                                $scope.myTaskList = response;
                                $scope.weeklyTaskMessage = "";
                                $scope.weeklyTaskMessage1="";
                                $scope.weeklyTaskMessage2="";
                                $scope.weeklyTaskMessage3="";
                            }else{
                                $('#noRecord6').addClass('noRecord');
                                $scope.myTaskList = '';
                                $scope.weeklyTaskMessage = "No Tasks Due this week.";
                                $scope.weeklyTaskMessage1="Click on ";
                                $scope.weeklyTaskMessage2="Create Task";
                                $scope.weeklyTaskMessage3="to set a task for the students.";
                            }
                        } else if(response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            $("#confy1").click();
                            $scope.msg = 'Server failed to respond. Please check your internet connection.';
                            $('#noRecord6').addClass('noRecord');
                            $scope.myTaskList = '';
                            $scope.weeklyTaskMessage = "No Tasks Due this week.";
                            $scope.weeklyTaskMessage1="Click on ";
                            $scope.weeklyTaskMessage2="Create Task";
                            $scope.weeklyTaskMessage3="to set a task for the students.";
                        } else{
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            $('#noRecord6').addClass('noRecord');
                            $scope.myTaskList = '';
                            $scope.weeklyTaskMessage = "No Tasks Due this week.";
                            $scope.weeklyTaskMessage1="Click on ";
                            $scope.weeklyTaskMessage2="Create Task";
                            $scope.weeklyTaskMessage3="to set a task for the students.";
                        }
                    });
         
                    /*CALENDER DROPDOWN ONSELECT will show 28 days after & before */
                    $scope.myTaskCalendar = function () {        
                        homeService.myTaskCalenderResponse(access_token,startDateRange,endDateRange,function (response) {
                            $scope.myTaskListCalendar = response;
                        });
                    };
                    $scope.myTaskCalendar();
            };
    
            /***ONLOAD CALENDAR NEXT BUTTON CLICK*/
            $scope.nextWeekClick = function ()
            {
                /////LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content5").css("display", "block");
                $("#preloader_right_content5").css("display", "block");
                
                var displayStartDate = getOnlyCookie("weekStartDate");
                var displayEndDate = getOnlyCookie("weekEndDate");
                
                var time5 = new Date(displayStartDate);
                var startdateIST1 = time5.setDate(time5.getDate()+7);
                var startdateISO1 = new Date(startdateIST1);
                var startdateISOstr1 = startdateISO1.toISOString();
                var startdateISOstrdate1 = new Date(startdateISOstr1);
                var startDateRange = startdateISOstrdate1.getFullYear()+'-' + (startdateISOstrdate1.getMonth()+1) + '-'+startdateISOstrdate1.getDate();
        
                var time6 = new Date(displayEndDate);
                var enddateIST2 = time6.setDate(time6.getDate()+7);
                var enddateISO2 = new Date(enddateIST2);
                var enddateISOstr2 = enddateISO2.toISOString();
                var enddateISOstrdate2 = new Date(enddateISOstr2);
                var endDateRange = enddateISOstrdate2.getFullYear()+'-' + (enddateISOstrdate2.getMonth()+1) + '-'+enddateISOstrdate2.getDate();
          
                /*FOR DROPDOWN*/
                var time7 = new Date(displayStartDate);
                var startdateIST3 = time7.setDate(time7.getDate()-14);
                var startdateISO3 = new Date(startdateIST3);
                var startdateISOstr3 = startdateISO3.toISOString()
                var startdateISOstrdate3 = new Date(startdateISOstr3);
                var startDateRangeDropdown = startdateISOstrdate3.getFullYear()+'-' + (startdateISOstrdate3.getMonth()+1) + '-'+startdateISOstrdate3.getDate();
        
                var time8 = new Date(displayEndDate);
                var enddateIST4 = time8.setDate(time8.getDate()+27);
                var enddateISO4 = new Date(enddateIST4);
                var enddateISOstr4 = enddateISO4.toISOString();
                var enddateISOstrdate4 = new Date(enddateISOstr4);
                var endDateRangeDropdown = enddateISOstrdate4.getFullYear()+'-' + (enddateISOstrdate4.getMonth()+1) + '-'+enddateISOstrdate4.getDate();
  
                $scope.currentWeekStartDate = startdateIST1;
                $scope.currentWeekEndDate = enddateIST2;
                
                var startDate = $scope.ISOdateConvertion( startDateRange );
                var endDate = $scope.ISOdateConvertion( endDateRange );
                
                //var startDate = setOnlyCookie("startDate");
                setOnlyCookie("weekStartDate", startDate, 60 * 60 * 60);
                setOnlyCookie("weekEndDate", endDate, 60 * 60 * 60);
                    
                    homeService.myTaskResponse(access_token,startDate,endDate,function (response2) {    
                        if(response2.status){
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            if(response2 != ''){
                                $('#noRecord6').removeClass('noRecord');
                                $scope.weeklyTaskMessage = "";
                                $scope.weeklyTaskMessage1="";
                                $scope.weeklyTaskMessage2="";
                                $scope.weeklyTaskMessage3="";
                                $scope.myTaskList = response2;
                            }else{
                                $('#noRecord6').addClass('noRecord');       
                                //$scope.weeklyTaskMessage = "No Tasks Due this week.Click on Create Task to set a task for the students.";
                                $scope.weeklyTaskMessage = "No Tasks Due this week.";
                                $scope.weeklyTaskMessage1="Click on ";
                                $scope.weeklyTaskMessage2="Create Task";
                                $scope.weeklyTaskMessage3="to set a task for the students.";
                                $scope.myTaskList = '';
                            }
                        } else if(response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            $("#confy1").click();
                            $scope.msg = 'Server failed to respond. Please check your internet connection.';
                            $('#noRecord6').addClass('noRecord');
                            $scope.weeklyTaskMessage = "No Tasks Due this week.";
                            $scope.weeklyTaskMessage1="Click on ";
                            $scope.weeklyTaskMessage2="Create Task";
                            $scope.weeklyTaskMessage3="to set a task for the students.";
                            $scope.myTaskList = '';
                        } else{
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            $('#noRecord6').addClass('noRecord');
                            $scope.weeklyTaskMessage = "No Tasks Due this week.";
                            $scope.weeklyTaskMessage1="Click on ";
                            $scope.weeklyTaskMessage2="Create Task";
                            $scope.weeklyTaskMessage3="to set a task for the students.";
                            $scope.myTaskList = '';
                        }
                    });

                    /*CALENDER DROPDOWN ONSELECT will show 21 days after & before */
                    $scope.myTaskCalendar = function () {
                        /////LOADER SHOW
                        $(window).scrollTop(0);
                        $("#status_right_content5").css("display", "block");
                        $("#preloader_right_content5").css("display", "block");
                        homeService.myTaskCalenderResponse(access_token,startDateRangeDropdown,endDateRangeDropdown,function (response4) {
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            $scope.myTaskListCalendar = response4;
                            /*selected date is set in cookie for load more functionality*/
                            var response_length = response4.length;
                            var firstWeekRangeStartDate = response4[0]['StartDate'];
                            var firstWeekRangeEndDate = response4[0]['EndDate'];
                            var lastWeekRangeStartDate = response4[response_length-1]['StartDate'];
                            var lastWeekRangeEndDate = response4[response_length-1]['EndDate'];            
                            setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                            setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                            setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                            setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                 
                        });
                    };
                    $scope.myTaskCalendar();
          
            };
            /***ONLOAD CALENDAR PREVIOUS BUTTON CLICK*/
            $scope.previousWeekClick = function ()
            {
                /////LOADER SHOW
                $(window).scrollTop(0);
                $("#status_right_content5").css("display", "block");
                $("#preloader_right_content5").css("display", "block");
                
                var displayStartDate = getOnlyCookie("weekStartDate");
                var displayEndDate = getOnlyCookie("weekEndDate");

                var time9 = new Date(displayStartDate);
                var startdateIST1 = time9.setDate(time9.getDate()-7);
                var startdateISO1 = new Date(startdateIST1);
                var startdateISOstr1 = startdateISO1.toISOString()
                var startdateISOstrdate1 = new Date(startdateISOstr1);
                var startDateRange = startdateISOstrdate1.getFullYear()+'-' + (startdateISOstrdate1.getMonth()+1) + '-'+startdateISOstrdate1.getDate();
        
                var time10 = new Date(displayEndDate);
                var enddateIST2 = time10.setDate(time10.getDate()-7);
                var enddateISO2 = new Date(enddateIST2);
                var enddateISOstr2 = enddateISO2.toISOString();
                var enddateISOstrdate2 = new Date(enddateISOstr2);
                var endDateRange = enddateISOstrdate2.getFullYear()+'-' + (enddateISOstrdate2.getMonth()+1) + '-'+enddateISOstrdate2.getDate();
                
                /*FOR DROPDOWN*/
                var time11 = new Date(displayStartDate);
                var startdateIST3 = time11.setDate(time11.getDate()-27);
                var startdateISO3 = new Date(startdateIST3);
                var startdateISOstr3 = startdateISO3.toISOString()
                var startdateISOstrdate3 = new Date(startdateISOstr3);
                var startDateRangeDropdown = startdateISOstrdate3.getFullYear()+'-' + (startdateISOstrdate3.getMonth()+1) + '-'+startdateISOstrdate3.getDate();
        
                var time12 = new Date(displayEndDate);
                var enddateIST4 = time12.setDate(time12.getDate()+14);
                var enddateISO4 = new Date(enddateIST4);
                var enddateISOstr4 = enddateISO4.toISOString();
                var enddateISOstrdate4 = new Date(enddateISOstr4);
                var endDateRangeDropdown = enddateISOstrdate4.getFullYear()+'-' + (enddateISOstrdate4.getMonth()+1) + '-'+enddateISOstrdate4.getDate();

                $scope.currentWeekStartDate = startdateIST1;
                $scope.currentWeekEndDate = enddateIST2;
                
                var startDate = $scope.ISOdateConvertion( startDateRange );
                var endDate = $scope.ISOdateConvertion( endDateRange );
                
                setOnlyCookie("weekStartDate", startDate, 60 * 60 * 60);
                setOnlyCookie("weekEndDate", endDate, 60 * 60 * 60);
                    
                    homeService.myTaskResponse(access_token,startDate,endDate,function (response2) {
                        if(response2.status){
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            if(response2 != ''){
                                $('#noRecord6').removeClass('noRecord');
                                $scope.weeklyTaskMessage ="";
                                $scope.weeklyTaskMessage1="";
                                $scope.weeklyTaskMessage2="";
                                $scope.weeklyTaskMessage3="";
                                $scope.myTaskList = response2;
                            }else{
                                $('#noRecord6').addClass('noRecord');
                                $scope.weeklyTaskMessage = "No Tasks Due this week.";
                                $scope.weeklyTaskMessage1="Click on ";
                                $scope.weeklyTaskMessage2="Create Task";
                                $scope.weeklyTaskMessage3="to set a task for the students.";
                                $scope.myTaskList = '';     
                            }
                         } else if(response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            $("#confy1").click();
                            $scope.msg = 'Server failed to respond. Please check your internet connection.';
                            $('#noRecord6').addClass('noRecord');
                            $scope.weeklyTaskMessage = "No Tasks Due this week.";
                            $scope.weeklyTaskMessage1="Click on ";
                            $scope.weeklyTaskMessage2="Create Task";
                            $scope.weeklyTaskMessage3="to set a task for the students.";
                            $scope.myTaskList = '';
                        } else {
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            $('#noRecord6').addClass('noRecord');
                            $scope.weeklyTaskMessage = "No Tasks Due this week.";
                            $scope.weeklyTaskMessage1="Click on ";
                            $scope.weeklyTaskMessage2="Create Task";
                            $scope.weeklyTaskMessage3="to set a task for the students.";
                            $scope.myTaskList = '';
                        }
                    });
                    
                    /*CALENDER DROPDOWN ONSELECT will show 28 days after & before */
                    $scope.myTaskCalendar = function () {
                        /////LOADER SHOW
                        $(window).scrollTop(0);
                        $("#status_right_content5").css("display", "block");
                        $("#preloader_right_content5").css("display", "block");
                        homeService.myTaskCalenderResponse(access_token,startDateRangeDropdown,endDateRangeDropdown,function (response4)
                        {
                            /////LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content5").css("display", "none");
                            $("#preloader_right_content5").css("display", "none");
                            $scope.myTaskListCalendar = response4;
                            /*selected date is set in cookie for load more functionality*/
                            var response_length = response4.length;
                            var firstWeekRangeStartDate = response4[0]['StartDate'];
                            var firstWeekRangeEndDate = response4[0]['EndDate'];
                            var lastWeekRangeStartDate = response4[response_length-1]['StartDate'];
                            var lastWeekRangeEndDate = response4[response_length-1]['EndDate'];            
                            setOnlyCookie("firstWeekRangeStartDate", firstWeekRangeStartDate, 60 * 60 * 60);
                            setOnlyCookie("firstWeekRangeEndDate", firstWeekRangeEndDate, 60 * 60 * 60);
                            setOnlyCookie("lastWeekRangeStartDate", lastWeekRangeStartDate, 60 * 60 * 60);
                            setOnlyCookie("lastWeekRangeEndDate", lastWeekRangeEndDate, 60 * 60 * 60);
                        });
                    };
                    $scope.myTaskCalendar();
            }; 
            
   
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /************************   ***** CREATE NEW TASK POP UP SECTION *****  ****************************************
    ****************************************************************************************************************/
            /*COUNT SELECT STUDENT CHECKBOX IN CREATE NEW TASK POP UP*/
            $scope.createTaskPopup = function()
            {
                $('#noOfItems1').val(0);
                $scope.name = '';
                $scope.files = [];
                var nothing="";
                    setTimeout(function () {
                                $('select[id=selectClassDdp]').val(0);
                                $("#selectClassDdp").change();
                                $('.selectpicker').selectpicker('refresh');
                                $('#studentIdsForTaskPopUp').val(nothing);
                                $scope.studentList = '';
                            },200);
                    //$('.selectClassDdp').refresh();
                    setTimeout(function () {
                    //$('select[name=selValue]').val(0);
                    //$('.selectpicker').selectpicker('refresh');
                    //$('#studentIdsForTaskPopUp').val(nothing);
                    
                    $scope.$apply(function() {
                        $scope.studentListResponseDropdown(0);
                        });
                    },1000);
                    
                    $('#noRecord5').css({'display':'none'});
                    $('.showStudentDivPopup').css({'display':'none'});
                    $('.select_outter_new').css({'border':'2px solid #54c9e8'});
                    $('.select_outter_new').addClass('blink_me');
                    $scope.countSelectStudentsTaskPopup = 0;
                    $scope.eachTaskPopupClick = function (student_id)
                    {
                        var studentIds = new Array();
                        var i = 0;
                        $("input[type=checkbox]:checked").each(function ()
                        {                
                            if ($(this).attr("studentIdTaskPopup") != undefined)
                            {
                                studentIds[i] = $(this).attr("studentIdTaskPopup");  
                                $("#studentListInTaskPopup"+studentIds[i]).addClass('active');              
                                i++;
                            }
                        });
                        var numberOfChecked = $('input:checkbox.studentIdTaskPopupCheckbox:checked').length;
                        var totalCheckboxes = $('input:checkbox.studentIdTaskPopupCheckbox').length;
                        
                        if(studentIds.length!=totalCheckboxes)
                        {
                            $('#remember4').prop('checked', false);
                        }else{
                            $('#remember4').prop('checked', true);
                        }
                        $scope.countSelectStudentsTaskPopup = studentIds.length;
        
                        /*for active class :: click on each check box*/
                        if ($('#studentTaskPopup'+student_id).attr('checked')=="checked") {
                            setTimeout(function(){
                                            $('#studentTaskPopup'+student_id).attr('checked',false);},100);
                                            $('#studentListInTaskPopup'+student_id).removeClass('active');           
                        }else{
                            setTimeout(function(){
                                            $('#studentTaskPopup'+student_id).attr('checked',true);},100);
                                            $('#studentListInTaskPopup'+student_id).addClass('active');                      
                        }
                        
                        //$scope.studentIdsForTaskPopUp = studentIds.toString();
                        document.getElementById('studentIdsForTaskPopUp').value=studentIds.toString();
            
                    };
                    $scope.allTaskPopupClick = function ()
                    {
                        var studentIds = new Array();
                        var i = 0;
                        
                        if(document.getElementById('remember4').checked==true)
                        {
                            $("input[name='studentIdTaskPopupCheckbox[]']").each(function ()        
                            {                
                                if ($(this).attr("studentIdTaskPopup") != undefined)
                                {
                                    studentIds[i] = $(this).attr("studentIdTaskPopup");  
                                    $("#studentListInTaskPopup"+studentIds[i]).addClass('active');
                                    
                                    var attr = $("#studentTaskPopup"+studentIds[i]).attr('checked');  
                                    // For some browsers, `attr` is undefined; for others,
                                    // `attr` is false.  Check for both.
                                    if (typeof attr == typeof undefined || attr == false) { 
                                         $("#studentTaskPopup"+studentIds[i]).attr("checked", "true");
                                         $("#studentTaskPopup"+studentIds[i]).prop("checked",true);
                                    }
                                    i++;
                                }
                            });
                      
                            //$(".user_box").addClass("active");
                            //$scope.studentIdsForTaskPopUp = studentIds.toString();
                            document.getElementById('studentIdsForTaskPopUp').value=studentIds.toString();
                        }else{
                           
                            $("input[name='studentIdTaskPopupCheckbox[]']").each(function ()       
                            {                
                                if ($(this).attr("studentIdTaskPopup") != undefined)
                                {
                                    studentIds[i] = $(this).attr("studentIdTaskPopup");  
                                    $("#studentListInTaskPopup"+studentIds[i]).addClass('active');
                                    var elm = $("#studentListInTaskPopup"+studentIds[i]);
                                    
                                    i++;
                                }
                            });
                            $(".studentIdTaskPopupCheckbox").removeAttr('checked');
                            $(".user_box").removeClass("active");
                            //$scope.studentIdsForTaskPopUp = "";
                            document.getElementById('studentIdsForTaskPopUp').value = "";
                        }
                        var numberOfChecked = $('input:checkbox.studentIdTaskPopupCheckbox:checked').length;
                        var totalCheckboxes = $('input:checkbox.studentIdTaskPopupCheckbox').length;
                        $scope.countSelectStudentsTaskPopup = numberOfChecked;
                    };
                    $scope.checkCalendarPop = function(val)
                    {
                        var day2 = $('#day2').val();
                        var mnth2 = $('#mnth2').val();
                        var year2 = $('#year2').val();
                        
                        if(day2=='' || mnth2=='' || year2=='' || day2==null || mnth2==null || year2==null)
                        {
                            $scope.dateErr2 = "Please select date";
                        }else{
                            $scope.dateErr2 = "";
                        }
                        /*date validation for valid / invalid date*/
                        var text2 = mnth2+'/'+day2+'/'+year2;
                        var curDate2='"'+mnth2+'-'+day2+'-'+year2+'"';
                        var comp2 = text2.split('/');
                        var m2 = parseInt(comp2[0], 10);
                        var d2 = parseInt(comp2[1], 10);
                        var y2 = parseInt(comp2[2], 10);
                        var date2 = new Date(y2,m2-1,d2);
                        if (date2.getFullYear() == y2 && date2.getMonth() + 1 == m2 && date2.getDate() == d2) {
                            //alert('Valid date');
                            //$scope.dateErr = "Please select Date";
                            var dueDate2 = year2+'-'+mnth2+'-'+day2+'T'+'00:00:00';
                            $scope.dateErr2 = "";
                        }else{
                            $scope.dateErr2 = "Please enter a valid date";
                        }

                        /*date validation for date greater than or eqqual to today*/
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth()+1; //January is 0!
                        var yyyy = today.getFullYear();
                        if(dd<10){
                            dd='0'+dd
                        } 
                        if(mm<10){
                            mm='0'+mm
                        } 
                        var currentDate2 =yyyy+'-'+mm+'-'+dd;
                        var dueDateToCompare2 = year2+'-'+mnth2+'-'+day2;
                       
                        if(dueDateToCompare2 >  currentDate2){
                            var dueDate2 = year2+'-'+mnth2+'-'+day2+'T'+'00:00:00';
                            $scope.dateErr2 = "";
                        }else if(dueDateToCompare2 == currentDate2){
                            var dueDate2 = year2+'-'+mnth2+'-'+day2+'T'+'00:00:00';
                            $scope.dateErr2 = "";
                        }else{ 
                            $scope.dateErr2 = "Please enter a date in the future";
                        }
                        
                        var todayTime = new Date();
                        var monthAcademic = (todayTime .getMonth() + 1);
                        var dayAcademic = (todayTime .getDate());
                        var yearAcademic = (todayTime .getFullYear());
                        var nextYearAcademic = (todayTime .getFullYear() + 1);
                        var academicYearStartDate = yearAcademic+'-'+'09'+'-'+'01';
                        var academicYearEndDate = nextYearAcademic+'-'+'08'+'-'+'31';
                        
                        if ( !((dueDateToCompare2 >= academicYearStartDate) && (dueDateToCompare2 <= academicYearEndDate)) ) {
                            $scope.dateErr2 = "Please select a date in the current academic year";            
                        }else{
                            $scope.dateErr2 = "";  
                        }
                    }
                    /*set task button click in create task pop up*/
                    $('#adddiv2').html('');
                    $('#fileNum2').val(0);
                    $scope.setTaskPop = function()
                    {
                        //alert('loader show');
                        //spinningwheel.gif loader
                        //$('#loader_settask2').css("display", "none");
                        //return false;
                        var tasktype2 = $('#tasktype2').val();
                        var title2 = $.trim($('#title2').val());
                        var description2 = $.trim($('#description2').val());
                        var classId = getOnlyCookie("classId");
                        
                        var day2 = $('#day2').val();
                        var mnth2 = $('#mnth2').val();
                        var year2 = $('#year2').val();
                        ///alert(day2+'###'+mnth2+'###'+year2);
                        var tot_file_size = $('#file_size2').val();
            
                        var StudentIds2 = $('#studentIdsForTaskPopUp').val();
                        
                        var error = 0;
                        if(StudentIds2 == ''){
                            //alert("Please select students");
                            $("#confy").click();
                            $scope.message="Please select class and students";
                            error++;
                            return false;
                        }
                        if(tasktype2=='' || tasktype2==null)
                        {
                            $scope.tasktypeErr2 = "Please enter Task Type";
                            document.getElementById('tasktypeErr2').innerHTML="Please enter Task Type";
                            error++;
                            return false;
                        }else{
                            $scope.tasktypeErr2 = "";
                        }
                        if( $('#title2').val().toString().trim() == '' )
                        {              
                            $('#title2').val('');
                            $("#title2").attr("placeholder","Please enter task title").addClass('red_place');
                            error++;
                            return false;
                        }else{      
                            $("#title2").attr("placeholder","Title").removeClass('red_place');  
                        }
                        if(title2.length > 50)
                        {                          
                            $("#title2").attr("placeholder","Task title must not be more than 50 characters").addClass('red_place');
                            error++;
                            return false;
                        }else{                          
                            $("#title2").attr("placeholder","Title").removeClass('red_place');  
                        }
                        if( $('#description2').val().toString().trim() == '' )
                        {              
                            $('#description2').val('');    
                            $("#description2").attr("placeholder","Please enter task description").addClass('red_place');
                            error++;
                            return false;
                        }else{                          
                            $("#description2").attr("placeholder","Description").removeClass('red_place');  
                        }
                        if(description2.length > 500)
                        {                           
                            $("#description2").attr("placeholder","Task description must not be more than 500 characters").addClass('red_place');
                            error++;
                            return false;
                        }else{
                            $("#description2").attr("placeholder","Description").removeClass('red_place');  
                        }
                        if (tot_file_size >=5120000) {
                            document.getElementById('fileUploadErrMsg').innerHTML = "Total file size of attachments exceeded. Maximum 5MB permitted";
                            $("#fileErr").click();
                            error++;
                            return false;       
                        }
                        if(day2=='' || mnth2=='' || year2=='' || day2==null || mnth2==null || year2==null)
                        {
                            $scope.dateErr2 = "Please select date";
                            error++;
                            return false;
                        }else{
                            $scope.dateErr2 = "";
                        }
                        /*date validation for valid / invalid date*/
                        var text2 = mnth2+'/'+day2+'/'+year2;
                        var curDate2='"'+mnth2+'-'+day2+'-'+year2+'"';
                        var comp2 = text2.split('/');
                        var m2 = parseInt(comp2[0], 10);
                        var d2 = parseInt(comp2[1], 10);
                        var y2 = parseInt(comp2[2], 10);
                        var date2 = new Date(y2,m2-1,d2);
                        if (date2.getFullYear() == y2 && date2.getMonth() + 1 == m2 && date2.getDate() == d2) {
                            //alert('Valid date');
                            //$scope.dateErr = "Please select Date";
                            var dueDate2 = year2+'-'+mnth2+'-'+day2+'T'+'00:00:00';
                            $scope.dateErr2 = "";
                        }else{
                            $scope.dateErr2 = "Please enter a valid date";
                            error++;
                            return false;
                        }
                        
                        
                        /*date validation for date greater than or eqqual to today*/
                        var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth()+1; //January is 0!
                        var yyyy = today.getFullYear();
                        if(dd<10){
                            dd='0'+dd
                        } 
                        if(mm<10){
                            mm='0'+mm
                        } 
                        var currentDate2 =yyyy+'-'+mm+'-'+dd;
                        var dueDateToCompare2 = year2+'-'+mnth2+'-'+day2;
                       
                        if(dueDateToCompare2 >  currentDate2){
                            var dueDate2 = year2+'-'+mnth2+'-'+day2+'T'+'00:00:00';
                            $scope.dateErr2 = "";
                        }else if(dueDateToCompare2 == currentDate2){
                            var dueDate2 = year2+'-'+mnth2+'-'+day2+'T'+'00:00:00';
                            $scope.dateErr2 = "";
                        }else{ 
                            $scope.dateErr2 = "Please enter a date in the future";
                            error++;
                            return false;
                        }
                        
                        var todayTime = new Date();
                        var monthAcademic = (todayTime .getMonth() + 1);
                        var dayAcademic = (todayTime .getDate());
                        var yearAcademic = (todayTime .getFullYear());
                        var nextYearAcademic = (todayTime .getFullYear() + 1);
                        var academicYearStartDate = yearAcademic+'-'+'09'+'-'+'01';
                        var academicYearEndDate = nextYearAcademic+'-'+'08'+'-'+'31';
                        //alert(academicYearStartDate+'####'+academicYearEndDate);
                        if ( !((dueDateToCompare2 >= academicYearStartDate) && (dueDateToCompare2 <= academicYearEndDate)) ) {
                            $scope.dateErr2 = "Please select a date in the current academic year";
                            error++;
                            return false;
                        }else{
                            $scope.dateErr2 = "";  
                        }
                       
                        //alert(error);
                        if(error == 0)
                        {
                
                            ///LOADER SHOW
                            $(window).scrollTop(0);
                            $("#status_right_content3").css("display", "block");
                            $("#preloader_right_content3").css("display", "block");
                            document.getElementById("createTaskPopupClose").disabled = true;
                            //$scope.isDisabled=true;
              
                            document.getElementById("setTaskPopBtn").disabled = true;
                            
                            fromDate = new Date(curDate2);
                            fromDateTime = fromDate.getTime();
                            
                            var weekDay = fromDate.getDay();
                            if (weekDay == 0) {  
                                var weekStart = $scope.ISOdateConvertion( (fromDateTime-(fromDate.getDay()*86400000))-(86400000*6) );
                                var weekEnd = $scope.ISOdateConvertion( ((fromDateTime-(fromDate.getDay()*86400000))) );
                            }else{
                                var weekStart = $scope.ISOdateConvertion( (((fromDateTime-(fromDate.getDay()*86400000))+86400000)) );
                                var weekEnd = $scope.ISOdateConvertion( (((fromDateTime-(fromDate.getDay()*86400000))+(86400000*7))) );
                            }
                            
                            var k1=0;
                            //$(".file_attachment_class2").each(function(){
                            //    var file_attachment_id = $(this).attr('id');
                            //   k++;
                            //    
                            //});
                            $(".file_attachment_class2").each(function(){
                                //alert($(this).attr('id'));
                                var file_attachment_id1 = $.trim($(this).attr('id')).replace("file_attachment2", "");;
                                
                                if( ($('#individual_file_size2'+file_attachment_id1).val()!=0) &&
                                    ($('#individual_file_size2'+file_attachment_id1).val()!='') &&
                                    ($('#individual_file_size2'+file_attachment_id1).val()!= undefined) &&
                                    ($('#individual_file_size2'+file_attachment_id1).val()!='undefined')) {
                                    k1++;
                                }
                            });
                         //alert(k1);
                            if (k1 != 0)
                            {
                                //alert('calling');
                                
                                homeService.fileUploadForPopUp(access_token,function (fileUploadResponse)
                                {
                                    console.log("CTRL RESPONSE");                      
                                    console.log(JSON.parse(fileUploadResponse));
                                
                                    homeService.setTaskResponse(access_token,StudentIds2,tasktype2,title2,description2,classId,dueDate2,fileUploadResponse, function (response)
                                    {
                                        document.getElementById("setTaskPopBtn").disabled = false;
                                        if(response == true)
                                        {
                                            //$('#loader_settask2').hide();
                                            ///LOADER HIDE
                                            $(window).scrollTop(0);
                                            $("#status_right_content3").fadeOut();
                                            $("#preloader_right_content3").delay(200).fadeOut("slow");
                                            /*Reset all fields in CREATE NEW TASK POP UP on submit*/
                                            $("#taskCreatePopUpReset").click();
                                            $("#tasktype2").change();
                                            $("#day2").change();
                                            $("#mnth2").change();
                                            $("#year2").change();
                                           
                                            $scope.allTaskPopupClick();
                                            $scope.successMsg1 = 'Task successfully set';
                                            $('#successMsg1').click();
                                            $("#createTaskPopUpClose").click();
                                            setTimeout(function () {
                                                setOnlyCookie("weekStartDate", convertDate(weekStart), 60 * 60 * 60);
                                                setOnlyCookie("weekEndDate", convertDate(weekEnd), 60 * 60 * 60);
                                                $scope.toggle_status_my_task = "tab";
                                                document.getElementById("createTaskPopupClose").disabled = false;
                                                $("#myTask").click(); //get redirected to My Weekly task page
                                               
                                            }, 500); 
                                        }else{
                                            //$('#loader_settask2').hide();
                                            ///LOADER HIDE
                                            $(window).scrollTop(0);
                                            $("#status_right_content3").fadeOut();
                                            $("#preloader_right_content3").delay(200).fadeOut("slow");
                                            document.getElementById("createTaskPopupClose").disabled = false;
                                            $scope.successMsg1 = 'Task not set';
                                            $('#successMsg1').click();
                                        }
                                        setTimeout(function () {
                                            $('.modal-backdrop').hide(); // for black background
                                            $('body').removeClass('modal-open'); // For scroll run
                                            $('#successMsg_modal1').modal('hide');                                                         
                                        }, 2000); 
                                    });
                                });
                            }else{
                                var fileUploadResponse = null;
                                homeService.setTaskResponse(access_token,StudentIds2,tasktype2,title2,description2,classId,dueDate2,fileUploadResponse, function (response)
                                {
                                    document.getElementById("setTaskPopBtn").disabled = false;
                                    if(response == true)
                                    {
                                        //$('#loader_settask2').hide();
                                        ///LOADER HIDE
                                        $(window).scrollTop(0);
                                        $("#status_right_content3").fadeOut();
                                        $("#preloader_right_content2").delay(200).fadeOut("slow");
                                        /*Reset all fields in CREATE NEW TASK POP UP on submit*/
                                        $("#taskCreatePopUpReset").click();
                                        $("#tasktype2").change();
                                        $("#day2").change();
                                        $("#mnth2").change();
                                        $("#year2").change();
                                       
                                        $scope.allTaskPopupClick();
                                        $scope.successMsg1 = 'Task successfully set';
                                        $('#successMsg1').click();
                                        $("#createTaskPopUpClose").click();
                                        setTimeout(function () {
                                            setOnlyCookie("weekStartDate", convertDate(weekStart), 60 * 60 * 60);
                                            setOnlyCookie("weekEndDate", convertDate(weekEnd), 60 * 60 * 60);
                                            document.getElementById("createTaskPopupClose").disabled = false;
                                            $scope.toggle_status_my_task = "tab";
                                            $("#myTask").click(); //get redirected to My Weekly task page
                                           
                                        }, 500); 
                                    }else{
                                        //$('#loader_settask2').hide();
                                        ///LOADER HIDE
                                        $(window).scrollTop(0);
                                        $("#status_right_content3").fadeOut();
                                        $("#preloader_right_content3").delay(200).fadeOut("slow");
                                        document.getElementById("createTaskPopupClose").disabled = false;
                                        $scope.successMsg1 = 'Task not set';
                                        $('#successMsg1').click();
                                    }
                                    setTimeout(function () {
                                        $('.modal-backdrop').hide(); // for black background
                                        $('body').removeClass('modal-open'); // For scroll run
                                        $('#successMsg_modal1').modal('hide');                                                         
                                    }, 2000); 
                                });  
                            }
                        }
                    }
                    //$scope.removeAttachmentCreateTaskPopup = function(val)
                    //{
                    //    //$scope.files.splice(attachmentName,1);
                    //  
                    //    $("#attachmentCreateTaskPopup"+val).remove();
                    //    var fileNum2=parseInt($('#fileNum2').val())-1;
                    //    $('#fileNum2').val(fileNum2);
                    // 
                    //};
                    var dynamicId = 0;
                    $scope.attach2 = function()
                    {
                        var fileNum=parseInt($('#fileNum2').val());
                        if (fileNum < 4){
                            fileNum=fileNum+1;
                            $('#fileNum2').val(fileNum);
                            dynamicId++;
                            $('#adddiv2').append('<div class="pdf_pic clearfix" style="cursor: pointer;" id="attachmentCreateTaskPopup'+(dynamicId-1)+'"><div class="pdf_left w3attach"><input type="file" id="file_attachment2'+(dynamicId-1)+'" onclick="file_upload2('+(dynamicId-1)+');" class="upload file_attachment_class2" style="cursor: pointer;opacity: 0;position: absolute;" /><label class="file_div attc" for="file_attachment2'+(dynamicId-1)+'">  <a class="vcard-hyperlink" href="javascript:void(0)"><img src="images/push-pin.png" alt=""><span class="ng-binding fleSpan" id="span2'+(dynamicId-1)+'">Choose file..</span></a>  </label></div><span onclick="removeAttachmentCreateTaskPopup('+(dynamicId-1)+');" class="remove_btn_class"><i class="fa fa-times" aria-hidden="true"></i></span><input type="hidden" id="individual_file_size2'+(dynamicId-1)+'" value="0" class="indiFsize2"></div>');
                            
                            $('#file_attachment2'+(dynamicId-1)).click();
                            
                        }else{
                            document.getElementById('fileUploadErrMsg').innerHTML = "A maximum of 4 attachments is permitted";
                            $("#fileErr").click();
                        }
                        if (fileNum == 1){
                            $('#attach_pic2').css("display", "none");
                            $('#add_more2').css("display", "block");
                        }
                       
                    };
                    
                    $scope.cancelClickPop=function()
                    {
                        /*todays date*/
                        var todayTime = new Date();
                        var current_month = (todayTime .getMonth() + 1);
                        var current_day = (todayTime .getDate());
                        var current_year = (todayTime .getFullYear());
                        
                        var tasktype2 = $('#tasktype2').val();
                        var title2 = $.trim($('#title2').val());
                        var description2 = $.trim($('#description2').val());
                        var classId = getOnlyCookie("classId");       
                        var day2 = $('#day2').val();
                        var mnth2 = $('#mnth2').val();
                        var year2 = $('#year2').val();  
                        var StudentIds2 = $.trim($('#studentIdsForTaskPopUp').val());
                        var fileNum =$('#fileNum2').val();
                        var studentListDiv = $.trim($('.studentListInTaskPopup').html());
       
                        var flag = 0;
            
                        if(studentListDiv != ''){
                            flag++;
                        }
                        if (StudentIds2 != ''){          
                            flag++;
                        } 
                        if(tasktype2=='' || tasktype2 == null || tasktype2 == 'null')
                        {
                            
                        }else{
                            flag++; 
                        }
                        if(title2 == ''|| title2 == null)
                        {
                            
                        }else{
                            flag++; 
                        }
                        if(description2 == ''|| description2 == null)
                        {
                           
                        }else{
                            flag++; 
                        }
                        if(day2!=current_day || mnth2!=current_month || year2!=current_year)
                        {
                            flag++; 
                        }
                        if ( fileNum != 0 )
                        {
                            flag++; 
                        }
                        //alert(StudentIds+'####2'+tasktype+'####3'+title+'####4'+description);
                        //alert(flag);
                        if (flag > 0){
                            $('#dataLostConfyPop').click();
                            flag = 0;
                        } else {
                            $('.showStudentDivPopup').css({'display':'none'});
                            var nothing="";
                            setTimeout(function () {
                                $('select[id=selectClassDdp]').val(0);
                                $("#selectClassDdp").change();
                                $('.selectpicker').selectpicker('refresh');
                                $('#studentIdsForTaskPopUp').val(nothing);
                                $scope.studentList = '';
                            },200);
                           
                            $('#noRecord5').css({'display':'none'});
                            $('.showStudentDivPopup').css({'display':'none'});
                            $('.select_outter_new').css({'border':'2px solid #54c9e8'});
                            $('.select_outter_new').addClass('blink_me');
                            $scope.countSelectStudentsTaskPopup = 0;
                            
                            $('#createTaskPopUpClose').click();
                            /*reset all fields*/
                            $scope.countSelectStudentsTaskPopup = 0;
                            $("#studentIdsForTaskPopUp").val('');
                            /*clear the attachment div*/
                            $('#adddiv2').html('');
                            /*reset file upload fields*/
                            $('#fileNum2').val(0);
                            $('#file_size2').val(0);
                            /**************************/
                        }
                        
                        $scope.yesBtnClick=function()
                        {
                            $('.showStudentDivPopup').css({'display':'none'});
                            var nothing="";
                            setTimeout(function () {
                                $('select[id=selectClassDdp]').val(0);
                                $("#selectClassDdp").change();
                                $('.selectpicker').selectpicker('refresh');
                                $('#studentIdsForTaskPopUp').val(nothing);
                                $scope.studentList = '';
                            },200);
                           
                            $('#noRecord5').css({'display':'none'});
                            $('.showStudentDivPopup').css({'display':'none'});
                            $('.select_outter_new').css({'border':'2px solid #54c9e8'});
                            $('.select_outter_new').addClass('blink_me');
                            $scope.countSelectStudentsTaskPopup = 0;
                            
                            $('#createTaskPopUpClose').click();
                            /*reset all fields*/
                            $scope.countSelectStudentsTaskPopup = 0;
                            $("#studentIdsForTaskPopUp").val('');
                            /*clear the attachment div*/
                            $('#adddiv2').html('');
                            /*reset file upload fields*/
                            $('#fileNum2').val(0);
                            $('#file_size2').val(0);
                            /**************************/
                        }
                        
                    }
                  
            }          
            
            //removing the validation error of task type dropdown field of create task on mouse click
            $scope.onCategoryChange=function()
            {
                $('#tasktypeErr2').html('');
                var tasktype2 = $('#tasktype2').val();
                if(tasktype2=='' || tasktype2==null)
                {
                    $scope.tasktypeErr2 = "Please enter Task Type";
                    return false;
                }else{
                    $scope.tasktypeErr2 = "";
                }
            };
            
            //removing the validation error of title field of create task on mouse click
            $( "#title2" ).mousedown(function() {
                $("#title2").attr("placeholder","Title").removeClass('red_place');  
            });
            
            //removing the validation error of title field of update task on mouse click
            $( "#title3" ).mousedown(function() {
                $("#title3").attr("placeholder","Title").removeClass('red_place');  
            });
            
             //removing the validation error of decsription field of create task on mouse click
            $( "#description2" ).mousedown(function() {
                $("#description2").attr("placeholder","Description").removeClass('red_place');  
            });
            
            //removing the validation error of decsription field of update task on mouse click
            $( "#description3" ).mousedown(function() {
                $("#description3").attr("placeholder","Description").removeClass('red_place');  
            });
                    
            /*Reset all fields in CREATE NEW TASK POP UP ON CLICKING create task icon*/
            $scope.createTaskFieldsReset = function()
            {
                //alert('create task ### refresh');
                    setTimeout(function()
                    {
                        // $("#selectClassDdp").change();
                        $("#taskCreatePopUpReset").click();
                        $("#tasktype2").change();
                        $("#day2").change();
                        $("#mnth2").change();
                        $("#year2").change();
                        
                        $scope.tasktypeErr2 = "";
                        $("#title2").attr("placeholder","Title").removeClass('red_place');
                        $("#description2").attr("placeholder","Description").removeClass('red_place');  
                        $scope.dateErr2 = "";           
                        
                        var dynamicId = 0;
                        $('#selectClassDdp option[value='+dynamicId+']').prop('selected', true);
                        //$("#selectClassDdp").selectpicker('refresh');
                        //
                        //$('#selectClassDdp option').prop('selected', function() {
                        //    return this.defaultSelected;
                        //});
            
            
                        //$("#selectClassDdp").bind("click", function () {
                        //    $("#selectClassDdp")[0].selectedIndex = 0;
                        //});

                        
                        //$('#selectClassDdp option').each(function (index, option) {
                        //    if(index!=0)
                        //    {
                        //        $(this).remove();
                        //    }
                        //});
                        $("#status_right_content3").css("display", "none");
                        $("#preloader_right_content3").css("display", "none");
                        document.getElementById("createTaskPopupClose").disabled = false;
                            
                        $("select option[value='']").attr("selected","selected");
                        $('.poplist').css({"display":"none"});
                        //$("#createTaskMessage").css("display", "block");    
                        
                        $('.studentIdTaskPopupCheckbox').attr('checked', "false");
                        $('.studentIdTaskPopupCheckbox').prop('checked', false);
                        $('#remember4').attr('checked', "false");
                        $('#remember4').prop('checked', false);
                                      
                    },500);
        
            };
              
    /*********************************CREATE NEW TASK POP UP ends***********************************************/
               
    /*********************************TASK DESCRIPTION POP UP & EDIT TASK POP UP begins************************/
            $scope.taskDescription = function(taskId,className,taskType,SubjectName,ClassId)
            {
            
                /*highlight div when edit / delete is clicked*/
                $('.post_row').css("background-color", "");
                //$('#highlightRow'+taskId).css("background-color", "rgba(84,201,232,0.2)");
                
                $scope.className = className;
                $scope.taskType = taskType;
                $scope.SubjectName = SubjectName;
                $scope.ClassId = ClassId;
             
                /*for student list class wise*/
                homeService.studentListResponse(access_token, ClassId, function (response) {
                    if(response.status){ 
                        if(response != ''){
                            $('.showStudentDiv').show();
                            $scope.studentList = response;
                            $scope.noOfStudents = response.length;
                            $scope.nodesc1="";
                            $scope.nodesc2="";
                            $scope.nodesc3="";
                            $scope.nodesc4="";
                            $scope.nodesc5="";
                            $('#noRecord13').removeClass('noRecord');
                            $('#noRecord14').removeClass('noRecord');
                     
                        }else{
                            $('.showStudentDiv').hide();
                            $scope.studentList = "";
                            $scope.noOfStudents = 0;
                            $scope.nodesc1 = "No Students Found… ";
                            $scope.nodesc2="Try: ";
                            $scope.nodesc3="1. Reload the webpage.";
                            $scope.nodesc4="2. If the problem persists, please submit your query";
                            $scope.nodesc5="here.";
                            $('#noRecord13').addClass('noRecord');
                            $('#noRecord14').addClass('noRecord');    
                        }     
                    } else if(response.msg == "ERR_INTERNET_DISCONNECTED") {//ERROR : 500 in api
                       $('.showStudentDiv').hide();
                        $scope.studentList = "";
                        $scope.noOfStudents = 0;
                        $("#confy1").click();
                        $scope.msg = 'Server failed to respond. Please check your internet connection.';
                        $scope.noOfStudents = 0;
                        $scope.nodesc1 = "No Students Found… ";
                        $scope.nodesc2="Try: ";
                        $scope.nodesc3="1. Reload the webpage.";
                        $scope.nodesc4="2. If the problem persists, please submit your query";
                        $scope.nodesc5="here.";
                        $('#noRecord13').addClass('noRecord');
                        $('#noRecord14').addClass('noRecord');
                    } else{
                        $('.showStudentDiv').hide();
                        $scope.studentList = "";
                        $scope.noOfStudents = 0;
                        $scope.nodesc1 = "No Students Found… ";
                        $scope.nodesc2="Try: ";
                        $scope.nodesc3="1. Reload the webpage.";
                        $scope.nodesc4="2. If the problem persists, please submit your query";
                        $scope.nodesc5="here.";
                        $('#noRecord13').addClass('noRecord');
                        $('#noRecord14').addClass('noRecord');
                    }
                });
                
            
               
                $scope.downloadAttachment = function(uploadedFileId)
                {
                    console.log(uploadedFileId);
                    $http({
                            async: true,
                            crossDomain: true,
                            url:  api_base_url+"api/files/taskattachment="+uploadedFileId,
                            method: "GET",
                            headers: {
                                "Content-type": "application/json",
                                "authorization": "Bearer "+access_token,
                                "cache-control": "no-cache",            
                            },
                            processData: false,
                            // contentType: false,
                            // mimeType: "multipart/form-data",
                            responseType: "arraybuffer"
                        }).success(function (data, status, headers, config) {
                            console.log("DOWNLOAD RESPONSE");
                            console.log(data);
                            var file = new Blob([data], { type: 'application/binary' });
                            var fileURL = URL.createObjectURL(file);
                            window.open(fileURL);
                            // var link=document.createElement('a');
                            // link.href=fileURL;
                            // link.download=fileURL;
                            // link.click();
                            // window.open(objectUrl);
                        }).error(function (data, status, headers, config) {
                            //upload failed
                    });
                };
               
                //var totFileSize = 0;
                /*for details of tasks in TASK*/
                homeService.taskDescriptionResponse(access_token,taskId, function (response) {
                        console.log('TASK DESCRIPTION');
                        console.log(response);
                        
                        if(response.status){ 
                            if(response != '')
                            { 
                                $scope.TaskType = response.TaskType;
                                $scope.Title = response.Title;
                                $scope.Description = response.Description;
                                $scope.CreatedDate = response.CreatedDate;
                                $scope.DueDate = response.DueDate;
                               
                                $scope.AttachmentCount = response.Attachments.length;
                                var AttachmentCount = response.Attachments.length;
                                $scope.Attachments = response.Attachments;
                               
                                ////var fileSize = 2000000;
                                //for(i=0;i<AttachmentCount;i++){
                                //    var fileSize = response.Attachments[i]['Size'];
                                //    totFileSize = totFileSize + fileSize;
                                //}
                                //$scope.totFileSize = totFileSize;
                           
                                $scope.selectedStudentCount = response.StudentIds.length;
                                document.getElementById('studentIdsAssigned').value = response.StudentIds;
                                
                                var studentIdsAssigned = response.StudentIds;
                                var responseDueDate = response.DueDate;                         
                                var responseDueDateExplode = responseDueDate.split('T');
                                var DueDateStr = responseDueDateExplode[0];
                                var DueDateStrExplode = DueDateStr.split('-');                               
                                var DueDateYear = DueDateStrExplode[0];
                                var DueDateMnth = DueDateStrExplode[1];
                                var DueDateDay = DueDateStrExplode[2];
                                
                                $scope.DueDateDisplay = DueDateMnth+'/'+DueDateDay+'/'+DueDateYear;
     
                                var responseCreatedDate = response.CreatedDate;                         
                                var responseCreatedDateExplode = responseCreatedDate.split('T');
                                var CreatedDateStr = responseCreatedDateExplode[0];
                                var CreatedDateStrStrExplode = CreatedDateStr.split('-');                               
                                var CreatedDateStrYear = CreatedDateStrStrExplode[0];
                                var CreatedDateStrMnth = CreatedDateStrStrExplode[1];
                                var CreatedDateStrDay = CreatedDateStrStrExplode[2];
                                
                                $scope.CreatedDateDisplay = CreatedDateStrMnth+'/'+CreatedDateStrDay+'/'+CreatedDateStrYear;

                                //alert(DueDateYear +'&&&'+ DueDateMnth +'&&&'+ DueDateDay);
                                $scope.DueDateYear = DueDateYear;
                                $scope.DueDateMnth = DueDateMnth;
                                $scope.DueDateDay = DueDateDay;
                                $('#day3').val(DueDateDay);
                                $("#day3").change();
                                $('#mnth3').val(DueDateMnth);
                                $("#mnth3").change();
                                $('#year3').val(DueDateYear);
                                $("#year3").change();

                                /******already assigned student will be checked******/
                                var SelectedStudentIds =  response.StudentIds;
                                $scope.isExist = function(id){                                     
                                        return SelectedStudentIds.indexOf(id);
                                }
                                var numberOfChecked = SelectedStudentIds.length;
                                     var totalCheckboxes = $('input:checkbox.studentListInEditPopupCheckbox').length;
                                     console.log(numberOfChecked+"_____"+totalCheckboxes);
                                     if(numberOfChecked!=totalCheckboxes)
                                        {
                                            $('#remember3').prop('checked', false);
                                            $('#remember3').removeAttr('checked');
                                        }else{
                                            $('#remember3').attr('checked',"true");
                                            $('#remember3').prop('checked', true);
                                        }
                            }else{  
                              $scope.TaskType = '';
                              $scope.Title =  '';
                              $scope.Description =  '';
                              $scope.CreatedDate =  '';
                              $scope.DueDate =  '';
                              $scope.StudentIds =  '';
                              $scope.selectedStudentCount = 0;
                            }     
                        }else{//ERROR : 500 in api
                              $scope.TaskType = '';
                              $scope.Title =  '';
                              $scope.Description =  '';
                              $scope.CreatedDate =  '';
                              $scope.DueDate =  '';
                              $scope.StudentIds =  '';
                              $scope.selectedStudentCount = 0;
                        }
                        console.log('studentIdsAssigned'+studentIdsAssigned);
                        if(typeof studentIdsAssigned!="undefined" )
                        {
                             $scope.studentIdsAssigned = studentIdsAssigned.toString();       
                        }   
                });
    
                
                $scope.selectedStudentCount = 0;
                /*ONCLICK SELECT ALL CHECKBOX*/
                
                $scope.eachEditTaskClick = function (student_id) //click on each checkbox
                {   
                    //console.log('STUD ID =======>>> '+student_id);
                    
                        var studentIds = new Array();   
                        var i = 0;
                        /*for active class :: click on each check box*/
                        if ($('#studentEditPopup'+student_id).attr('checked')=="checked") {          
                                    setTimeout(function(){
                                        $('#studentEditPopup'+student_id).removeAttr('checked');
                                       
                                        $('#studentListInEditPopup'+student_id).removeClass('active');  
                                    },100);
                                             
                        }else{        
                                    setTimeout(function(){
                                        $('#studentEditPopup'+student_id).attr('checked',"true");
                                        $('#studentEditPopup'+student_id).prop('checked',true);
                                        $('#studentListInEditPopup'+student_id).addClass('active'); 
                                    },100);                                  
                        }

                        
                        $("input[type=checkbox]:checked").each(function ()
                        {
                            
                            if ($(this).attr("studentEditPopup") != undefined) 
                            { 
                                studentIds[i] = $(this).attr("studentEditPopup");
                                $("#studentEditPopup"+studentIds[i]).addClass('active');                          
                                i++;
                            }    
                        });
                        var numberOfChecked = $('input:checkbox.studentListInEditPopupCheckbox:checked').length;
                        
                        var totalCheckboxes = $('input:checkbox.studentListInEditPopupCheckbox').length;
                        if(numberOfChecked!=totalCheckboxes)
                        {
                            $('#remember3').prop('checked', false);
                            $('#remember3').removeAttr('checked');
                        }else{
                            $('#remember3').attr('checked',"true");
                            $('#remember3').prop('checked', true);
                        }
                        $scope.selectedStudentCount = numberOfChecked;
                    
                        document.getElementById('studentIdsAssigned').value = studentIds.toString();
                
                };
               
                //click on select all checkbox
                $("#remember3").on("click", function()
                {
                        var studentIds = Array();
                        var i = 0;
                      
                        if (this.checked) 
                        {
                            //alert('checked');
                            $("#remember3").attr("checked","true");
                            $("#remember3").prop("checked",true);                         
                            $("input[name='studentEditPopupCheckbox[]']").each(function ()                                            
                            {
                                if ($(this).attr("studentEditPopup") != undefined)
                                {
                                    studentIds[i] = $(this).attr("studentEditPopup");  
                                    $("#studentListInEditPopup"+studentIds[i]).addClass('active');
                                    var Attr = $("#studentEditPopup"+studentIds[i]).attr('checked');
                                    // For some browsers, `attr` is undefined; for others,
                                    // `attr` is false.  Check for both. 
                                    if (typeof Attr == typeof undefined || Attr == false) {                                      
                                         $("#studentEditPopup"+studentIds[i]).attr("checked", "true");
                                         $("#studentEditPopup"+studentIds[i]).prop("checked",true);
                                    }
                                    i++;
                                }
                            });
                           
                            //$(".user_box").addClass("active");                
                         
                            document.getElementById('studentIdsAssigned').value=studentIds.toString();

                        }else{
                            //alert('unchecked');
                            $("#remember3").prop("checked",false);
                            $("#remember3").removeAttr("checked");
                            
                            $("input[name='studentEditPopupCheckbox[]']").each(function ()
                            {                
                                if ($(this).attr("studentEditPopup") != undefined)
                                {                                  
                                    studentIds[i] = $(this).attr("studentEditPopup");
                                    $("#studentListInEditPopup"+studentIds[i]).removeClass('active');
                                    $("#studentEditPopup"+studentIds[i]).prop("checked",false);
                                    $("#studentEditPopup"+studentIds[i]).removeAttr("checked");    
                                    i++;
                                }
                            });
                            //$(".user_box").removeClass("active");
                           
                            document.getElementById('studentIdsAssigned').value="";
                        }
                        var numberOfChecked = $('input:checkbox.studentListInEditPopupCheckbox:checked').length;
                        var totalCheckboxes = $('input:checkbox.studentListInEditPopupCheckbox').length;
                        $scope.selectedStudentCount = numberOfChecked;
                               
                });
              
                /*UPDATE BUTTON CLICK IN EDIT TASK POP UP*/
                $scope.checkCalendarEditPop = function(val)
                {
                    var day3 = $('#day3').val();
                    var mnth3 = $('#mnth3').val();
                    var year3 = $('#year3').val();
                    
                    if(day3=='' || mnth3=='' || year3=='' || day3==null || mnth3==null || year3==null)
                    {
                        $scope.dateErr3 = "Please select date";
                    }else{
                        $scope.dateErr3 = "";
                    }
                    /*date validation for valid / invalid date*/
                    var text2 = mnth3+'/'+day3+'/'+year3;
                    var curDate2='"'+mnth3+'-'+day3+'-'+year3+'"';
                    var comp2 = text2.split('/');
                    var m2 = parseInt(comp2[0], 10);
                    var d2 = parseInt(comp2[1], 10);
                    var y2 = parseInt(comp2[2], 10);
                    var date2 = new Date(y2,m2-1,d2);
                    if (date2.getFullYear() == y2 && date2.getMonth() + 1 == m2 && date2.getDate() == d2) {
                        //alert('Valid date');
                        //$scope.dateErr = "Please select Date";
                        var dueDate2 = year3+'-'+mnth3+'-'+day3+'T'+'00:00:00';
                        $scope.dateErr3 = "";
                    }else{
                        $scope.dateErr3 = "Please enter a valid date";
                    }

                    /*date validation for date greater than or eqqual to today*/
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear();
                    if(dd<10){
                        dd='0'+dd
                    } 
                    if(mm<10){
                        mm='0'+mm
                    } 
                    var currentDate2 =yyyy+'-'+mm+'-'+dd;
                    var dueDateToCompare2 = year3+'-'+mnth3+'-'+day3;
                   
                    if(dueDateToCompare2 > currentDate2){
                        var dueDate2 = year3+'-'+mnth3+'-'+day3+'T'+'00:00:00';
                        $scope.dateErr3 = "";
                    }else if(dueDateToCompare2 == currentDate2){
                        var dueDate2 = year3+'-'+mnth3+'-'+day3+'T'+'00:00:00';
                        $scope.dateErr3 = "";
                    }else{ 
                        $scope.dateErr3 = "Please enter a date in the future";
                    }
                    
                    var todayTime = new Date();
                    var monthAcademic = (todayTime .getMonth() + 1);
                    var dayAcademic = (todayTime .getDate());
                    var yearAcademic = (todayTime .getFullYear());
                    var nextYearAcademic = (todayTime .getFullYear() + 1);
                    var academicYearStartDate = yearAcademic+'-'+'09'+'-'+'01';
                    var academicYearEndDate = nextYearAcademic+'-'+'08'+'-'+'31';
                    
                    if ( !((dueDateToCompare2 >= academicYearStartDate) && (dueDateToCompare2 <= academicYearEndDate)) ) {
                        $scope.dateErr3 = "Please select a date in the current academic year";
                    }else{
                        $scope.dateErr3 = "";  
                    }
                  
                }
                
                $scope.removeAttachmentOld = function(attachmentId)
                {
                    ///*file size gets deducted everytime a file is removed*/
                    //var file_size = parseInt($('#individual_file_size_old'+(attachmentId)).val());
                    //var total_file_size = parseInt($('#totFileSizeOld').val());
                    //var update_file_size = parseInt(total_file_size) - parseInt(file_size);
                    //$('#totFileSizeOld').val(update_file_size);
                    $("#attachmentDivOld"+attachmentId).remove();
                    var noOfOldFiles = $('#noOfOldFiles').val();
                    $scope.AttachmentCount = noOfOldFiles - 1;
                }
               
                var dynamicId = 0;
                $scope.attach3=function()
                {
                    //var newAttach=$('#newAttach').val();
                    var noOfOldFiles = $('#noOfOldFiles').val();
                    var remainingNoOfFileCanBeUploaded = 4 - noOfOldFiles;
                    //alert(remainingNoOfFileCanBeUploaded);
                   
                    var fileNum=parseInt($('#fileNum3').val());
                    if (fileNum < remainingNoOfFileCanBeUploaded)
                    {
                        fileNum=fileNum+1;
                        $('#fileNum3').val(fileNum);
                        dynamicId++;
                        $('#adddiv3').append('<div class="pdf_pic clearfix" style="cursor: pointer;" id="attachmentDivNew'+(dynamicId-1)+'"><div class="pdf_left attachmentEditNew w3attach"><input type="file" id="file_attachment3'+(dynamicId-1)+'" onclick="file_upload3('+(dynamicId-1)+');" class="upload file_attachment_class3" style="cursor: pointer;opacity: 0;position: absolute;" /><label class="file_div attc" for="file_attachment3'+(dynamicId-1)+'"><a class="vcard-hyperlink" href="javascript:void(0)"><img src="images/push-pin.png" alt=""><span class="ng-binding fleSpan" id="span3'+(dynamicId-1)+'">Choose file..</span></a></label><span onclick="removeAttachmentEdit('+(dynamicId-1)+');" class="remove_btn_class"><i class="fa fa-times" aria-hidden="true"></i></span></div><input type="hidden" id="individual_file_size3'+(dynamicId-1)+'" value="0" class="indiFsize3"></div>');
                        
                        $('#file_attachment3'+(dynamicId-1)).click();
                    }else{
                        document.getElementById('fileUploadErrMsg').innerHTML = "A maximum of 4 attachments is permitted";
                        $("#fileErr").click();
                    }
                    
                    if (fileNum == 1){
                        $('#attach_pic3').css("display", "none");
                        $('#add_more3').css("display", "block");
                    }
                   
                };
                
                $('#adddiv').html('');
                $('#fileNum3').val(0);
                $scope.updateTask = function()
                {
                    //$('#loader_settask3').show();
                    var title = $.trim($('#title3').val());
                    var description = $.trim($('#description3').val());
                    //$scope.SelectedDay = Days; 
                    var day = $('#day3').val();
                    var mnth = $('#mnth3').val();
                    var year = $('#year3').val();
                    var StudentIds = $('#studentIdsAssigned').val();
                    var tot_file_size = $('#file_size3').val();
                   
                    var error = 0;
                
                    if(StudentIds == ''){
                        //alert("Please select Students");
                        $("#confy").click();
                        $scope.message="Please select students";
                        error++;
                        return false;
                    }
                    if( $('#title3').val().toString().trim() == '' )
                    {              
                        $('#title3').val('');                       
                        $("#title3").attr("placeholder","Please enter task title").addClass('red_place');
                        error++;
                        return false;
                    }else{                       
                        $("#title3").attr("placeholder","Title").removeClass('red_place');  
                    }
                    if(title.length > 50)
                    {                        
                        $("#title3").attr("placeholder","Task title must not be more than 50 characters").addClass('red_place');
                        error++;
                        return false;
                    }else{                      
                        $("#title3").attr("placeholder","Title").removeClass('red_place');  
                    }
                    if( $('#description3').val().toString().trim() == '' )
                    {              
                        $('#description3').val('');         
                        $("#description3").attr("placeholder","Please enter task description").addClass('red_place');
                        error++;
                        return false;
                    }else{                       
                        $("#description3").attr("placeholder","Description").removeClass('red_place');  
                    }
                    if(description.length > 500)
                    {
                        $("#description3").attr("placeholder","Task description must not be more than 500 characters").addClass('red_place');
                        error++;
                        return false;
                    }else{
                        $("#description3").attr("placeholder","Description").removeClass('red_place');  
                    }
                    if (tot_file_size >=5120000) {
                        document.getElementById('fileUploadErrMsg').innerHTML = "Total file size of attachments exceeded. Maximum 5MB permitted";
                        $("#fileErr").click();
                        error++;
                        return false;       
                    }
                    if(day=='' || mnth=='' || year=='' || day==null || mnth==null || year==null)
                    {
                        $scope.dateErr3 = "Please select date";
                        error++;
                        return false;
                    }else{
                        $scope.dateErr3 = "";
                    }
                    
                    var text = mnth+'/'+day+'/'+year;
                    var curDate='"'+mnth+'-'+day+'-'+year+'"';
                    var comp = text.split('/');
                    var m = parseInt(comp[0], 10);
                    var d = parseInt(comp[1], 10);
                    var y = parseInt(comp[2], 10);
                    var date = new Date(y,m-1,d);
                    if (date.getFullYear() == y && date.getMonth() + 1 == m && date.getDate() == d) {
                        var dueDate = year+'-'+mnth+'-'+day+'T'+'00:00:00';
                        $scope.dateErr3 = "";
                    }else{
                        $scope.dateErr3 = "Please enter a valid date";
                        error++;
                        return false;
                    }
                    
                    var dueDateToCompare = year+'-'+mnth+'-'+day;
                    var today = new Date();
                    var dd = today.getDate();
                    var mm = today.getMonth()+1; //January is 0!
                    var yyyy = today.getFullYear();
                    if(dd<10){
                        dd='0'+dd
                    } 
                    if(mm<10){
                        mm='0'+mm
                    } 
                    var currentDate =yyyy+'-'+mm+'-'+dd;
                    //alert(dueDateToCompare +'@@@@@@@@@@@@@'+ currentDate);
                    if(dueDateToCompare > currentDate){
                        var dueDate = year+'-'+mnth+'-'+day+'T'+'00:00:00';
                        $scope.dateErr3 = "";
                    }else if(dueDateToCompare == currentDate){
                        var dueDate = year+'-'+mnth+'-'+day+'T'+'00:00:00';
                        $scope.dateErr3 = "";
                    }else{ 
                        $scope.dateErr3 = "Please enter a date in the future";
                        error++;
                        return false;
                    }
                    
                    var todayTime = new Date();
                    var monthAcademic = (todayTime .getMonth() + 1);
                    var dayAcademic = (todayTime .getDate());
                    var yearAcademic = (todayTime .getFullYear());
                    var nextYearAcademic = (todayTime .getFullYear() + 1);
                    var academicYearStartDate = yearAcademic+'-'+'09'+'-'+'01';
                    var academicYearEndDate = nextYearAcademic+'-'+'08'+'-'+'31';
                    
                    if ( !((dueDateToCompare >= academicYearStartDate) && (dueDateToCompare <= academicYearEndDate)) ) {
                        $scope.dateErr3 = "Please select a date in the current academic year";
                        error++;
                        return false;
                    }else{
                        $scope.dateErr3 = "";  
                    }
       
                    if(StudentIds != ''){
                        StudentIdsStr = StudentIds;
                    }
                    
                    if(error == 0)
                    {
                        document.getElementById("editPopupClose").disabled = true;
                        ///LOADER SHOW
                        $(window).scrollTop(0);
                        $("#status_right_content2").css("display", "block");
                        $("#preloader_right_content2").css("display", "block");
                        
                        //return false;
                        
                        var attachmentId=new Array();
                        var attachmentName=new Array();
                        var existingFileUploadData=new Array();
                        
                        var k=0;
                        //$(".file_attachment_class3").each(function(){
                        //    var file_attachment_id = $(this).attr('id');
                        //   k++;
                        //    
                        //});
                        
                        $(".file_attachment_class3").each(function(){
                            //alert($(this).attr('id'));
                            var file_attachment_id = $.trim($(this).attr('id')).replace('file_attachment3','');
                            //alert($('#individual_file_size3'+file_attachment_id).val());
                            if(($('#individual_file_size3'+file_attachment_id).val()!=0) &&
                               ($('#individual_file_size3'+file_attachment_id).val()!='') &&
                               ($('#individual_file_size3'+file_attachment_id).val()!=undefined) &&
                               ($('#individual_file_size3'+file_attachment_id).val()!='undefined')) {
                                k++;
                            }
                        });
                        //alert(k);
                        if (k != 0)
                        {
                            //alert('file');
                            //var noOfAttach=$('.attachmentEditNew').length;
                            homeService.fileUploadForEdit(access_token,function (fileUploadResponse)
                            {
                                console.log('FILE UPLOAD RES');
                                console.log(fileUploadResponse);
                                var s=0;
                        
                                $("div[name='attachmentEdit[]']").each(function (){
                                    attachmentId[s] = $(this).attr("attachmentId");
                                    attachmentName[s] = $(this).attr("attachmentName");
                                    existingFileUploadData[s] = { "Id": attachmentId[s], "Name": attachmentName[s] };
                                    s++;
                                });
                                
                                console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                                console.log(existingFileUploadData);
                                console.log(fileUploadResponse);
                                console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@');
                                
                                homeService.updateTaskResponse(access_token,StudentIdsStr,taskId,title,description,dueDate,fileUploadResponse,existingFileUploadData,function (response)
                                {
                                    //document.getElementById("editTaskPopBtn").disabled = true;
                                    var dueDateExp = dueDate.split('T');
                                    fromDate3 = new Date(convertDate(dueDateExp[0]));
                                    //alert(fromDate3);
                                    fromDateTime3 = fromDate3.getTime();
                                  
                                    var weekDay = fromDate3.getDay();
                                    if (weekDay == 0) {  
                                        var weekStartDate = $scope.ISOdateConvertion( (fromDateTime3-(fromDate3.getDay()*86400000))-(86400000*6) );
                                        var weekEndDate = $scope.ISOdateConvertion( ((fromDateTime3-(fromDate3.getDay()*86400000))) );
                                    }else{
                                        var weekStartDate = $scope.ISOdateConvertion( (((fromDateTime3-(fromDate3.getDay()*86400000))+86400000)) );
                                        var weekEndDate = $scope.ISOdateConvertion( (((fromDateTime3-(fromDate3.getDay()*86400000))+(86400000*7))) );
                                    }
                                    //alert(dueDateExp+'  start= '+weekStartDate+'  end=  '+weekEndDate);                        
                                    if(response == true)
                                    {
                                        //$('#loader_settask3').hide();
                                        ///LOADER HIDE
                                        $(window).scrollTop(0);
                                        $("#status_right_content2").fadeOut();
                                        $("#preloader_right_content2").delay(200).fadeOut("slow");
                                   
                                        $scope.successMsg1 = 'Task successfully updated';
                                        
                                        $('#successMsg1').click();
                                        setTimeout(function () {
                                            /*close the edit pop up*/
                                            /*redirects to the updated week*/  
                                            setOnlyCookie("weekStartDate", weekStartDate, 60 * 60 * 60);
                                            setOnlyCookie("weekEndDate", weekEndDate, 60 * 60 * 60);
                                            
                                            //alert(fromDate3+'  &&&&&&&&  '+weekStartDate+'   &&&&&&&&&&   '+weekEndDate);
                                            /*clear the attachment div*/
                                            $('#adddiv3').html('');
                                            /*reset file upload fields*/
                                            $('#fileNum3').val(0);
                                            $('#file_size3').val(0);
                                            //$('#totFileSizeOld').val(0);
                                            /**************************/
                                            $('.modal-backdrop').hide(); // for black background
                                            $('body').removeClass('modal-open'); // For scroll run
                                            $('#edit_task').modal('hide');
                                            document.getElementById("editPopupClose").disabled = false;
                                            $scope.toggle_status_my_task = "tab";
                                            $("#myTask").click();
                                            
                                        }, 500);  
                                        setTimeout(function () {
                                            $('.modal-backdrop').hide(); // for black background
                                            $('body').removeClass('modal-open'); // For scroll run
                                            $('#successMsg_modal1').modal('hide');                                                         
                                        }, 1500);     
                                    }else{
                                        //$('#loader_settask3').hide();
                                        ///LOADER HIDE
                                        $(window).scrollTop(0);
                                        $("#status_right_content2").fadeOut();
                                        $("#preloader_right_content2").delay(200).fadeOut("slow");
                                        document.getElementById("editPopupClose").disabled = false;
                                        $scope.successMsg1 = 'Task not updated';
                                        $('#successMsg1').click();
                                        setTimeout(function () {
                                            $('.modal-backdrop').hide(); // for black background
                                            $('body').removeClass('modal-open'); // For scroll run
                                            $('#successMsg_modal1').modal('hide');
                                        }, 1500);  
                                    }  
                                });
                            });
                            
                        } else {
                            
                            //alert('no file');
                            var s=0;
                            $("div[name='attachmentEdit[]']").each(function (){
                                   attachmentId[s] = $(this).attr("attachmentId");
                                   attachmentName[s] = $(this).attr("attachmentName");
                                   existingFileUploadData[s] = { "Id": attachmentId[s], "Name": attachmentName[s] };
                                   s++;
                            });
                            
                            var fileUploadResponse = null;
                            
                            homeService.updateTaskResponse(access_token,StudentIdsStr,taskId,title,description,dueDate,fileUploadResponse,existingFileUploadData,function (response) {
                                //document.getElementById("editTaskPopBtn").disabled = true;
                                var dueDateExp = dueDate.split('T');
                                fromDate3 = new Date(convertDate(dueDateExp[0]));
                                //alert(fromDate3);
                                fromDateTime3 = fromDate3.getTime();
                                
                                var weekDay = fromDate3.getDay();
                              
                                if (weekDay == 0) {  
                                    var weekStartDate = $scope.ISOdateConvertion( (fromDateTime3-(fromDate3.getDay()*86400000))-(86400000*6) );
                                    var weekEndDate = $scope.ISOdateConvertion( ((fromDateTime3-(fromDate3.getDay()*86400000))) );
                                }else{
                                    var weekStartDate = $scope.ISOdateConvertion( (((fromDateTime3-(fromDate3.getDay()*86400000))+86400000)) );
                                    var weekEndDate = $scope.ISOdateConvertion( (((fromDateTime3-(fromDate3.getDay()*86400000))+(86400000*7))) );
                                }
                                //alert(dueDateExp+'  start= '+weekStartDate+'  end=  '+weekEndDate);                      
                                if(response == true)
                                {
                                    //$('#loader_settask3').hide();
                                    ///LOADER HIDE
                                    $(window).scrollTop(0);
                                    $("#status_right_content2").fadeOut();
                                    $("#preloader_right_content2").delay(200).fadeOut("slow");
                                    $scope.successMsg1 = 'Task successfully updated';
                                    $('#successMsg1').click();
                                    setTimeout(function () {
                                        /*close the edit pop up*/
                                        /*redirects to the updated week*/  
                                        setOnlyCookie("weekStartDate", weekStartDate, 60 * 60 * 60);
                                        setOnlyCookie("weekEndDate", weekEndDate, 60 * 60 * 60);
                                        
                                        //alert(fromDate3+'  &&&&&&&&  '+weekStartDate+'   &&&&&&&&&&   '+weekEndDate);
                                        
                                        $('.modal-backdrop').hide(); // for black background
                                        $('body').removeClass('modal-open'); // For scroll run
                                        $('#edit_task').modal('hide');
                                        document.getElementById("editPopupClose").disabled = false;
                                        $scope.toggle_status_my_task = "tab";
                                        $("#myTask").click();
                                     
                                    }, 500);  
                                    setTimeout(function () {
                                        $('.modal-backdrop').hide(); // for black background
                                        $('body').removeClass('modal-open'); // For scroll run
                                        $('#successMsg_modal1').modal('hide');                                                         
                                    }, 1500);     
                                }else{
                                    //$('#loader_settask3').hide();
                                    ///LOADER HIDE
                                    $(window).scrollTop(0);
                                    $("#status_right_content2").fadeOut();
                                    $("#preloader_right_content2").delay(200).fadeOut("slow");
                                    document.getElementById("editPopupClose").disabled = false;
                                    $scope.successMsg1 = 'Task not updated';
                                    $('#successMsg1').click();
                                    setTimeout(function () {
                                        $('.modal-backdrop').hide(); // for black background
                                        $('body').removeClass('modal-open'); // For scroll run
                                        $('#successMsg_modal1').modal('hide');
                                    }, 1500);  
                                }  
                            });
                        } 
                    }
                };
                
                //setTimeout(function () {
                //    $("#closeModal").click();                                                              
                //}, 200);
                
                /*CANCEL BUTTON CLICK IN EDIT TASK POP UP*/
                $scope.cancelTask = function()
                {
                    $('#studentsReset6').click();
                    $("#tasktype3").change();
                    $("#day3").change();
                    $("#mnth3").change();
                    $("#year3").change();
                    
                    $scope.tasktypeErr3 = "";
                    $scope.tasktitleErr3 = "";
                    $scope.taskdescErr3 = "";
                    $scope.dateErr3 = "";
                    $('#adddiv3').html('');
                    $('.post_row').css("background-color", "");
                    $('#editPopupClose').click();
                    $('.modal-backdrop').hide(); // for black background
                    $('body').removeClass('modal-open'); // For scroll run
                    $('#edit_task').modal('hide');      
                };
                $scope.cancelClick=function()
                {
                    $('#dataLostConfy').click();
                   // /*clear the attachment div*/
                   // $('#adddiv3').html('');
                   // /*reset file upload fields*/
                   // $('#fileNum3').val(0);
                   // $('#file_size3').val(0);
                   //// $('#totFileSizeOld').val(0);
                   // /**************************/
    
                }
                /*CLOSE BTN IN EDIT POP UP*/
                $scope.editclose=function()
                {
                    $('#dataLostConfy').click();
                     // $('.post_row').css("background-color", "");
                };  
                /*EDIT BUTTON CLICK IN TASK DESCRIPTION POP UP*/
                $scope.editModalOpen = function()
                {
                    $("#taskDescriptionClose").click();
                    setTimeout(function () {
                        $("#editMyTask"+taskId).click();
                    }, 500);
                };
                $scope.deselect=function()
                {
                    $('.post_row').css("background-color", "");
                };
                $scope.deleteModalOpenforDesc=function()
                {
                    $('#deleteMyTask'+taskId).click();
                    /*********************************DELETE TASK POP UP begins*******************************************/
                    $scope.taskDelete = function()
                    {
                        homeService.deleteTaskResponse(access_token,taskId,function (response) {
                            if(response == true)
                            {
                                 //alert('Task successfully deleted');
                                 $scope.successMsg1 = 'Task successfully deleted';
                                 $('#successMsg1').click();
                                 $("#taskDescriptionClose").click();
                                 setTimeout(function () {
                                     var displayStartDate = convertDate(getOnlyCookie("weekStartDate"));
                                     var displayEndDate = convertDate(getOnlyCookie("weekEndDate"));
                                     $scope.selectWeek(displayStartDate+"T00:00:00",displayEndDate+"T00:00:00");
                                 }, 500);
                            }else{
                                 //alert('Task not deleted ');
                                 $scope.successMsg1 = 'Task not deleted';
                                 $('#successMsg1').click();
                            }
                            setTimeout(function () {
                                 $('.modal-backdrop').hide(); // for black background
                                 $('body').removeClass('modal-open'); // For scroll run
                                 $('#successMsg_modal1').modal('hide'); 
                                                                                           
                            }, 1500); 
                        });   
                    };
                    $scope.noDeleteBtn = function()
                    {
                         $('#highlight'+taskId).css("background-color", "");
                    }
                };
            };
            
            
            $scope.resetEditPopup = function(){
                    $('#studentsReset6').click();
                    $("#tasktype3").change();
                    $("#day3").change();
                    $("#mnth3").change();
                    $("#year3").change();
                    $("#status_right_content2").css("display", "none");
                    $("#preloader_right_content2").css("display", "none");
                    document.getElementById("editPopupClose").disabled = false;
                    
                    $(".file_attachment_class3").each(function(){
                        var file_attachment_id = $.trim($(this).attr('id')).replace('file_attachment3','');
                       
                        if(($('#individual_file_size3'+file_attachment_id).val()==0) ||
                           ($('#individual_file_size3'+file_attachment_id).val()=='') ||
                           ($('#individual_file_size3'+file_attachment_id).val()==undefined) ||
                           ($('#individual_file_size3'+file_attachment_id).val()=='undefined'))
                        {
                                $('#attachmentDivNew'+file_attachment_id).remove();
                        }
                    });
                    
                    $scope.tasktypeErr3 = "";
                    $scope.tasktitleErr3 = "";
                    $scope.taskdescErr3 = "";
                    $scope.dateErr3 = "";
            };
            
            /*********************************TASK DESCRIPTION POP UP & EDIT TASK POP UP ends************************/
            
   
           
    };
    
    /*DELETE BUTTON CLICK IN TASK DESCRIPTION POP UP*/
            $scope.deleteModalOpen = function(taskId)
            {            //alert(taskId);
                //$('#highlight'+taskId).css({"background-color": "rgb(221, 244, 250)"});
                $('#highlight'+taskId).css("background-color", "#DDF4FA");
   
                
                /*********************************DELETE TASK POP UP begins***********************************************/
                $scope.taskDelete = function()
                {
                    //alert(taskId);
                    homeService.deleteTaskResponse(access_token,taskId,function (response) {
                            if(response == true)
                            {
                                 //alert('Task successfully deleted');
                                 $scope.successMsg1 = 'Task successfully deleted';
                                 $('#successMsg1').click();
                                 $("#taskDescriptionClose").click();
                                 setTimeout(function () {
                                     var displayStartDate = convertDate(getOnlyCookie("weekStartDate"));
                                     var displayEndDate = convertDate(getOnlyCookie("weekEndDate"));
                                     $scope.selectWeek(displayStartDate+"T00:00:00",displayEndDate+"T00:00:00");
                                 }, 500);
                            }else{
                                 //alert('Task not deleted ');
                                 $scope.successMsg1 = 'Task not deleted';
                                 $('#successMsg1').click();
                            }
                            setTimeout(function () {
                                 $('.modal-backdrop').hide(); // for black background
                                 $('body').removeClass('modal-open'); // For scroll run
                                 $('#successMsg_modal1').modal('hide'); 
                                                                                           
                            }, 1500); 
                    });   
                };
                $scope.noDeleteBtn = function()
                {
                     $('#highlight'+taskId).css("background-color", "");
                }
                /*********************************DELETE TASK POP UP ends***********************************************/
            };
/*********************************MY TASK SECTION ends****************************************************************/

        /*TASK TYPE LIST*/
        homeService.taskListResponse(access_token, function (response) {
            $scope.taskList = response;
            
            setTimeout(function () {
                initDropdown();
            }, 200);
        });

        /*SIDE PANEL CLICK*/
        //$scope.clickSidePanelTab = function ($event) {
        //    alert('clickSidePanelTab');
        //
        //    if ($($event.currentTarget).parent('li').hasClass('active')) {
        //        $(".table_outter .right_content.tab-content .tab-pane.fade").removeClass('active').removeClass('in');
        //        var currentTarget = $($event.currentTarget).data('target');
        //        $(currentTarget).addClass('active in');
        //    }
        //    $(".right_srl").mCustomScrollbar("destroy"); 
        //    $(".right_srl").mCustomScrollbar({
        //    axis:"x",
        //    theme:"3d",
        //    scrollInertia:550,
        //    scrollbarPosition:"outside"
        //    });
        //    
        //};
  

        function convertDate(inputFormat) {
            function pad(s) { return (s < 10) ? '0' + s : s; }
            var d = new Date(inputFormat);
            return [d.getFullYear(),pad(d.getMonth()+1),pad(d.getDate())].join('-');
        }
        

        /*LOGOUT*/
        $scope.logout = function () {
         
            removeItem("access_token");
            removeItem("userid");
            removeItem("teacherId");
            removeItem("classId");
            removeItem("weekEndDate");
            removeItem("weekStartDate");
            
            removeItem("firstWeekRangeEndDate");
            removeItem("firstWeekRangeStartDate");
            removeItem("lastWeekRangeEndDate");
            removeItem("lastWeekRangeStartDate");
            
            removeItem("tab");
       
            var URL = base_url + 'login';
            window.location = URL;
        };
        
       
        //$scope.multiple_file_upload = function(){
        //    alert('1');
        //    file_attachment1
        //}
        
        
        

    });
    
    
    



/*remove newly included attachements*/
function removeAttachmentCreateTask(val1)
{
    /*file size gets deducted everytime a file is removed*/
    var file_size = $('#individual_file_size1'+val1).val();
    var total_file_size = $('#file_size1').val();
    var update_file_size = parseInt(total_file_size) - parseInt(file_size);
    $('#file_size1').val(parseInt(update_file_size));
    $("#attachmentCreateTask"+val1).remove();
    var fileNum=parseInt($('#fileNum').val())-1;
    $('#fileNum').val(fileNum);
};
function removeAttachmentCreateTaskPopup(val)
{
    /*file size gets deducted everytime a file is removed*/
    var file_size = parseInt($('#individual_file_size2'+(val)).val());
    var total_file_size = parseInt($('#file_size2').val());
    var update_file_size = parseInt(total_file_size) - parseInt(file_size);
    $('#file_size2').val(update_file_size);
    $("#attachmentCreateTaskPopup"+val).remove();
    var fileNum2=parseInt($('#fileNum2').val())-1;
    $('#fileNum2').val(fileNum2);
 
};
function removeAttachmentEdit(val)
{
    /*file size gets deducted everytime a file is removed*/
    var file_size = parseInt($('#individual_file_size3'+(val)).val());
    var total_file_size = parseInt($('#file_size3').val());
    var update_file_size = parseInt(total_file_size) - parseInt(file_size);
    $('#file_size3').val(update_file_size);
    $("#attachmentDivNew"+val).remove();
    var fileNum3=parseInt($('#fileNum3').val())-1;
    $('#fileNum3').val(fileNum3);
    
    //$("#attachmentDivNew"+val).remove();
    //var fileNum3=parseInt($('#fileNum3').val())-1;
    //$('#fileNum3').val(fileNum3);
}
function file_upload1(dynamicId1)
{
    var x = document.getElementsByClassName("indiFsize");
    //alert(x.length);
        $('#file_attachment1'+(dynamicId1)).change(function(event)
        {
            var file_size = this.files[0].size;
            $('#individual_file_size1'+(dynamicId1)).val(file_size);
            var tS=0;
            for(i=0;i<x.length;i++)
            {
              var tS=tS+parseInt(x[i].value);
            }
            var tot_file_size=tS;
            //alert(parseInt(tot_file_size));
            if (parseInt(tot_file_size) >= 5120000) {
                $("#file_attachment1"+dynamicId1).val('');
                 //$("#span1"+(dynamicId1)).html(this.files[0].name);
                $('#individual_file_size1'+(dynamicId1)).val('0');
                document.getElementById('fileUploadErrMsg').innerHTML = "Total file size of attachments exceeded. Maximum 5MB permitted";
                $("#fileErr").click();
            }else{
                $("#span1"+(dynamicId1)).html(this.files[0].name);
                //$("#file_attachment_name"+dynamicId).html(this.files[0].name);
                $('#file_attachment1'+(dynamicId1)).attr('disabled',true);
                $('#file_size1').val(parseInt(tot_file_size));
            }
        });
}
//create task popup
function file_upload2(dynamicId)
{
    var x = document.getElementsByClassName("indiFsize2");
    $('#file_attachment2'+(dynamicId)).change( function(event)
    {
        var file_size = this.files[0].size;
        $('#individual_file_size2'+(dynamicId)).val(file_size);
        var tS=0;
        for(i=0;i<x.length;i++)
        {
          var tS=tS+parseInt(x[i].value);
        }
        var tot_file_size=tS;
        if (parseInt(tot_file_size) >= 5120000) {
            
            $("#file_attachment2"+dynamicId).val('');
            
            $('#individual_file_size2'+(dynamicId)).val('0');
            document.getElementById('fileUploadErrMsg').innerHTML = "Total file size of attachments exceeded. Maximum 5MB permitted";
            $("#fileErr").click();
        }else{
            var file_name = this.files[0].name;
            $("#span2"+(dynamicId)).html(this.files[0].name);
            //$("#file_attachment_name2"+dynamicId).html(this.files[0].name);
            $('#file_attachment2'+(dynamicId)).attr('disabled',true);
            $('#file_size2').val(tot_file_size);
        }
    });
}

//edit file upload
function file_upload3(dynamicId)
{
    //var totFileSizeOld = $("#totFileSizeOld").val();
    var x_old = document.getElementsByClassName("indiFsize_old");
    var x = document.getElementsByClassName("indiFsize3");
    $('#file_attachment3'+(dynamicId)).change( function(event)
    {
        var file_size = this.files[0].size;
        $('#individual_file_size3'+(dynamicId)).val(file_size);
        var tS=0;
        for(i=0;i<x.length;i++)
        {
          var tS=tS+parseInt(x[i].value);
        }
        
        var tS_old=0;
        for(j=0;j<x_old.length;j++)
        {
          var tS_old=tS_old+parseInt(x_old[j].value);
        }
        var tot_file_size = tS + tS_old;
        if (parseInt(tot_file_size) >= 5120000) {
            $("#file_attachment3"+dynamicId).val('');
            $('#individual_file_size3'+(dynamicId)).val('0');
            document.getElementById('fileUploadErrMsg').innerHTML = "Total file size of attachments exceeded. Maximum 5MB permitted";
            $("#file_attachment2"+dynamicId).val('');
            $("#fileErr").click();
        }else{
            var file_name = this.files[0].name;
            $("#span3"+(dynamicId)).html(this.files[0].name);
            // $("#file_attachment_name3"+dynamicId).html(this.files[0].name);
            $('#file_attachment3'+(dynamicId)).attr('disabled',true);
            $('#file_size3').val(tot_file_size);
        }
    
    });
}
function printDiv(divName)
{
        var contents = $("#"+divName).html();
        var frame1 = $('<iframe />');
        frame1[0].name = "frame1";
        //frame1.css({ "position": "absolute", "top": "-1000000px" });
        $("body").append(frame1);
        var frameDoc = frame1[0].contentWindow ? frame1[0].contentWindow : frame1[0].contentDocument.document ? frame1[0].contentDocument.document : frame1[0].contentDocument;
        frameDoc.document.open();
        //Create a new HTML document.
        frameDoc.document.write('<html><head><title>Performance</title>');
        frameDoc.document.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Montserrat:400,700" type="text/css" media="print" />');
        frameDoc.document.write('<link rel="stylesheet" href="http://esolz.co.in/lab3/involved/css/font-awesome.min.css" type="text/css" media="print" />');
        frameDoc.document.write('<link rel="stylesheet" href="http://esolz.co.in/lab3/involved/css/bootstrap.css" type="text/css" media="print" />');
        frameDoc.document.write('<link rel="stylesheet" href="http://esolz.co.in/lab3/involved/css/bootstrap-select.css" type="text/css" media="print" />');
        frameDoc.document.write('<link rel="stylesheet" href="http://esolz.co.in/lab3/involved/css/jquery-ui.css" type="text/css" media="print" />');
        frameDoc.document.write('<link rel="stylesheet" href="http://esolz.co.in/lab3/involved/css/circle.css" type="text/css" media="print" />');
        frameDoc.document.write('<link rel="stylesheet" href="http://esolz.co.in/lab3/involved/css/custom.css" type="text/css" media="print" />');
        frameDoc.document.write('<link rel="stylesheet" href="http://esolz.co.in/lab3/involved/css/developer.css" type="text/css" media="print" />');
        frameDoc.document.write('<link rel="stylesheet" href="http://esolz.co.in/lab3/involved/css/jquery.mCustomScrollbar.css" type="text/css" media="print" />');
        frameDoc.document.write('<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,900italic,900,700italic,700,500,500italic,400italic" type="text/css" media="print" />');
        //Append the DIV contents.
        frameDoc.document.write(contents);
        frameDoc.document.write('</body></html>');
        frameDoc.document.close();
        setTimeout(function () {
            window.frames["frame1"].focus();
            window.frames["frame1"].print();
            frame1.remove();
        }, 500);
        
        
        
        //var dataUrl = document.getElementById(divName).toDataURL(); //attempt to save base64 string to server using this var
        //console.log(dataUrl);
        //var windowContent = '<!DOCTYPE html>';
        //windowContent += '<html>'
        //windowContent += '<head><title>Print canvas</title></head>';
        //windowContent += '<body>'
        //windowContent += '<img src="' + dataUrl + '">';
        //windowContent += '</body>';
        //windowContent += '</html>';
        //var printWin = window.open();
        //printWin.document.open();
        //printWin.document.write(windowContent);
        //printWin.document.close();
        //printWin.focus();
        //printWin.print();
        //printWin.close();
        //    
        

}

