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
    function priceFormSteps(){
       
    }


    $(document).ready(function() {
        $("input[type=tel]").mask("+38 (000) 000-00-00");

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

        $('.price-popup').magnificPopup({
            type: 'inline',
            fixedContentPos: true,
            mainClass: 'mfp-fade',
            callbacks: {
                open: function() {
                    var $popup = $("#price-popup");
                    $popup.find(".btn-next").click(function(){
                        var type = $(this).attr("data-donwloadtype");
                        if(type == "email") $popup.find(".direct").hide();
                        if(type == "direct") $popup.find(".email").hide();
                        
                        $popup.find(".screen").removeClass("active");
                        $popup.find(".screen:nth-child(2)").addClass("active");
            
                        setTimeout(function(){
                            if(type == "direct"){
                                var link = document.createElement('a');
                                link.setAttribute('href','/price.doc');
                                link.setAttribute('download','price.doc');
                                link.click();          
                            }
            
                            $popup.find(".screen").removeClass("active");
                            $popup.find(".screen:nth-child(3)").addClass("active");
                        }, 2000);
                    });
                },
                close: function() {
                    var $popup = $("#price-popup");
                    $popup.find(".email, .direct").show();
                    $popup.find(".screen").removeClass("active");
                    $popup.find(".screen:nth-child(1)").addClass("active");
                }
            }
        });
        

        $(".sorts-section__item").click(function(){
            fbq("track", "TreesSortsClick");
        });
        // TODO: uncomment event
        var popupHandler = function (Request){
            var response = Request.responseText;
            if(response == 1){
                $('.popup-thanks').magnificPopup("open");                 
            }            
        };

        var popupPriceHandler = function (Request){
            var response = Request.responseText;
            if(response == 1){
                $('.price-popup').magnificPopup("open");           
                dataLayer.push({"event":"get_price"}); 
            } else {
                console.log(response);
            }           
        };
        
        $('.lead-form').on('submit', function(event) {
            event.preventDefault(); // отменяем событие по умолчанию
            
            var jsonData = JSON.stringify(getFormValues($(this)));
            console.log(jsonData);
            
            $('.reset').val('');
            
            var purpose = $(this).attr("data-purpose");
            if(purpose == "price-list"){
                SendRequest("POST", "mailer.php", 'data='+jsonData, popupPriceHandler);
            } else{
                SendRequest("POST", "mailer.php", 'data='+jsonData, popupHandler);
            }

            fbq("track", "Lead");
            dataLayer.push({"event":"send_form"}); 
        });

        $("#consult-popup").on("submit", function(event){
            fbq("track", "LeadConsultation");
            $.magnificPopup.close();
        });

      
    });
    
   

}(jQuery));