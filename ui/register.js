
function checkInputs(){
  var arg = {
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
    doRegister(arg);
  }
}


function doRegister(arg){

  console.log('registering clicked');
  $.post("/fn/keyRegistration/keyRegistrationCreate", JSON.stringify(arg),
    function(hash) {
      console.log('register: '+hash)
      $.post("/fn/keyRegistration/isRegistered", "",
          function(registered) {
              console.log('registered: '+registered)
              if(JSON.parse(registered)) {
                $('#registerDialog').modal('hide');
              } else {
                $('#registerDialog').modal('show');
              }
          });
    },
    "json"
  );
      modal.style.display = "none";
}
function isRegistered(){
  $.post("/fn/keyRegistration/isRegistered", "",
      function(registered) {

          if(!JSON.parse(registered)){
            modal.style.display = "block";
          } else {
            alert("You have already been Registered");
          }

      }
  ).error(function(response) {
  });
}

function openRegistration(){
  modal.style.display = "block";
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
$("#check").click(isRegistered);
 $("#keyRegistrationButton").click(checkInputs);

});
