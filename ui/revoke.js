function checkInputs(){
  var arg = {
    revocationKey: $("#revocationKey").val(),
    username: $("#name").val(),
    email: $("#email").val(),
    address: $("#address").val(),
    revocation_method: $("#revocation_method").val()
  };

  if(arg.username==""||arg.email==""||arg.address==""||arg.revocation_method==0){
    alert("Invalid Input- [Please see that you have filled all the blocks]"+arg.username+"arg"+arg.email+"arg"+arg.address+"arg"+arg.revocation_method);
  modal.style.display = "block";
  }
  else{
    revoke(arg);
  }
}

function revoke(arg){
  $.post("/fn/revocation/revocation", JSON.stringify(arg),
      function(registered) {

          if(!JSON.parse(registered)){
              alert("ERROR : Revocation Failed");
          } else {
          alert("Revocation was Succesfull");
          }

      }
  ).error(function(response) {

  });
  modal.style.display = "none";
}


function clickRevoke(){
  $.post("/fn/keyRegistration/isRegistered", "",
      function(registered) {

          if(!JSON.parse(registered)){
           alert("ERROR : You have Not Registered");
          } else {
             modal.style.display = "block";
          }

      }
  ).error(function(response) {

  });



}

$(window).ready(function() {
   $.post("/fn/keyRegistration/isRegistered", "",
       function(registered) {

           if(!JSON.parse(registered)){
            alert("ERROR : You have Not Registered");
           } else {
            //   alert("You have already been Registered");
           }

       }
   ).error(function(response) {

   });
$("#butt").click(clickRevoke);
$("#revoke").click(checkInputs);
});
