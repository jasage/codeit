(function(){
"use strict"
/* Send from data to server */
$(".signup").on('submit',function(ev){
	ev.preventDefault();
	var data= $(this).serialize();
	$.ajax({
		type:'POST',
		data:data,
		url:'http://codeit.pro/codeitCandidates/serverFrontendTest/user/registration',
		dateType:'json',
		success:function(data){
			switch(data.status){
				case "OK":
					window.location.href = "company.html";
					break;
				case "Form Error":
					$("span.required").text(`${data.status} : ${data.message}`);
					break;
				case "Error":
					$("span.required").text(`${data.status} : ${data.message}`);
					break;
				default:
			}
		}
	})
});

})();