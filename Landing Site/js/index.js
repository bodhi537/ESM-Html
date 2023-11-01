
$(document).ready(function () {
	    //BrowserDetection ();     
});	

  function BrowserDetection (){
	console.log("Detect Browser ii");
    var microsoftexplorer = navigator.userAgent.search("MSIE") >=0;
    var chrome = navigator.userAgent.search("Chrome") >=0;
    var firefox = navigator.userAgent.search("Firefox") >=0; 
    var safari = navigator.userAgent.search("safari") >=0;
    var opera = navigator.userAgent.search("Opera") >=0; 
    var navigation = navigator.userAgent.toString();  
    if (microsoftexplorer){  
    // Do nothing //Msg: CAN app does not support edge    
    } else if (chrome){
	console.log("Chrome");  
    $(".em-l-container").hide();
	$('body').html("<div class='em-l-container'><section class='em-c-section'><div class='em-c-hero--tinted' style='background-image: url(images/moctoolkitscreen.png); background-size:100%; width:auto; height:100%'><div class='em-c-hero__body'><h1 class='em-c-hero__title welcomeslogan'style='color:white' ><strong>We love chrome too!<strong></h1><p class='em-c-hero__desc' style='color:white'>But MOC App does not support google chrome, please kindly access the app through native Internet Explorer and not Edge</p></div><!-- end em-c-hero__body --></div> <!-- end CAN MSG --> </section> <br><section> <h1> Please follow the below steps to make IE your default browser</h1></section><br><p>Step 1: Hit the Windows Key</p><br><p>Step 2: Type default</p><br><p>Step 3: Click Default Apps</p> <br><p>Step 4: Scroll down to Web browser</p><br><p>Step 5: SelectInternet Explorer </p><br> <img src='images/default1.png'><br><br><hr><img src='images/step1.png'</section></div>");
    $(".em-c-header__nav-container").hide();
    $(".em-c-header").removeClass("em-c-header--blue").addClass("em-c-header--red");    
    }    
 } 