
function revoke(){
  $.post("/fn/revocation/revocation", "",
      function(registered) {

          if(!JSON.parse(registered)){
              alert("Revocation Failed");
          } else {
          alert("Revocation was Succesfull");  
          }

      }
  ).error(function(response) {

  });
}


$(window).ready(function() {
   $.post("/fn/keyRegistration/isRegistered", "",
       function(registered) {

           if(!JSON.parse(registered)){
               modal.style.display = "block";
           } else {
              // alert("You have already been Registered");
           }

       }
   ).error(function(response) {

   });
$("#butt").click(revoke);

});
