(function($){
    //Creating cross browsing
    function CreateRequest(){
        var Request = false;

        if(window.XMLHttpRequest) Request = new XMLHttpRequest();
        else if (window.ActiveXObject){
            try {
                Request = new ActiveXObject("Microsoft.XMLHTTP");
            } catch(Exception) {
                Request = new ActiveXObject("Msxml2.XMLHTTP");
            }
        }

        if(!Request) alert("Request Error");

        return Request;
    }
    function SendRequest(method, path, args, handler){
        var Request = CreateRequest();
        if(!Request) return;

        Request.onreadystatechange = function(){
            if(Request.readyState == 4) handler(Request);
        }        

        if(method.toLowerCase() == "get" && args.length > 0) path += "?" + args;

        Request.open(method, path, true);

        if(method.toLowerCase() == "post"){
            Request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
            Request.send(args);
        } else {
            Request.send(null);
        }
    }
    function getFormValues($form){
        data = {};
        data['name'] = $form.find('input[name=name]').val();
        data['email'] = $form.find('input[name=email]').val();;
        data['phone'] = $form.find('input[name=phone]').val();;
        data['capacity'] = $form.find('input[name=capacity]').val();;
        return data;
        
    }


    $(document).ready(function() {
   		$('.popup-content').magnificPopup({
            type: 'inline',
            fixedContentPos: true,
            mainClass: 'mfp-fade',
        });

        $('.popup-thanks').magnificPopup({
            type: 'inline',
            fixedContentPos: true,
            mainClass: 'mfp-fade',
        });

		$('.close-popup').click(function(){
            $.magnificPopup.close();
            console.log('close');
        });

        $('.preloader-popup').magnificPopup({
            type: 'inline',
            fixedContentPos: true,
            showCloseBtn: false
        });
        

        $(".sorts-section__item").click(function(){
            fbq("track", "TreesSortsClick");
        });

        var popupHandler = function (Request){
            var response = Request.responseText;
            if(response == 1){
                dataLayer.push({"event":"send_form"}); 
                fbq("track", "Lead");  

                
                // setTimeout(function(){
                    $('.reset').val('');
                    $('.popup-thanks').magnificPopup("open");  
                // }, 2000);               
            }            
        };

        var popupPriceHandler = function (Request){
            var response = Request.responseText;
            if(response == 1){
                dataLayer.push({"event":"send_form"}); 
                dataLayer.push({"event":"get_price"}); 
                fbq("track", "Lead");  
                
                $('.preloader-popup').magnificPopup("open");
                
                setTimeout(function(){
                    var link = document.createElement('a');
                    link.setAttribute('href','/price.doc');
                    link.setAttribute('download','price.doc');
                    link.click();                
                    
                    $('.reset').val('');
                    $('.popup-thanks').magnificPopup("open");  
                }, 2000);             
            } else {
                console.log(response);
            }           
        };
        
        $('.lead-form').on('submit', function(event) {
            event.preventDefault(); // отменяем событие по умолчанию
            
            var jsonData = JSON.stringify(getFormValues($(this)));
            console.log(jsonData);
            
            
            var purpose = $(this).attr("data-purpose");
            if(purpose == "price-list"){
                SendRequest("POST", "mailer.php", 'data='+jsonData, popupPriceHandler);
            } else{
                SendRequest("POST", "mailer.php", 'data='+jsonData, popupHandler);
            }
        });

        $("#consult-popup").on("submit", function(event){
            fbq("track", "LeadConsultation");
            $.magnificPopup.close();
        });
    });
    

}(jQuery));