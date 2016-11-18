//CONSTANTS DEFINED FOR JS PAGES
var base_url        = "http://esolz.co.in/lab3/involved/";
var PhysicalPath    = "/var/www/esolz.co.in/public/lab3/involved/";
var api_base_url    = "http://server.involvedtech.co.uk/";


function setSession(name,value, hours)
{    
            var date = new Date();
            date.setTime(date.getTime() + Number(hours) * 3600 * 1000);
            document.cookie = name + "=" + value + "; path=/;expires = " + date.toGMTString();   
}

function getSession(name)
{
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
}

function removeItem(name){

        expireAt = new Date;
        document.cookie = name + "=;path=/;expires=" + expireAt.toGMTString();
}
function removeItemSession(name)
{
        expireAt = new Date;
        document.cookie = name + "=;path=/;expires=" + expireAt.toGMTString();
}

function ClearAll()
{
        expireAt = new Date;
        if (document.cookie != "")
        {
                crumbs = document.cookie.split(";");
                for(i=0; i < crumbs.length; i++)
                {
                    crumbName = crumbs[i].split("=")[0];
                    document.cookie = crumbName + "=;path=/;expires=" + expireAt.toGMTString();
                }
        }
}

function setOnlyCookie(cookiename, cookievalue, hours)
{

            var date = new Date();
            date.setTime(date.getTime() + Number(hours) * 3600 * 1000);
            document.cookie = cookiename + "=" + cookievalue + "; path=/;expires = " + date.toGMTString();
          
}
function getOnlyCookie(name)
{
            //alert(name);
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
}
function ClearAllCookie()
{
  
        expireAt = new Date;
        if (document.cookie != "")
        {
                crumbs = document.cookie.split(";");
                for(i=0; i < crumbs.length; i++)
                {
                    crumbName = crumbs[i].split("=")[0];
                    document.cookie = crumbName + "=;path=/;expires=" + expireAt.toGMTString();
                }
        }
        
}
