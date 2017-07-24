function genesis(){
  /*
  This is called in genesis just for testing
  Later once the UI is done it will be called when the user wants to revke his key
  */
    revocation();
}

function revocation(){
  debug("===========================Phase 2 (Starts) - Revocation===========================");
  // this is called when the user wants to revoke his keys
  key=getLink(App.Agent.Hash,"keyRegistration",{Load:true});
  keyRegistration=JSON.parse(key.Links[0].E);
  callRevocaiton(keyRegistration.revocation_Method_ID,keyRegistration);

}

function getKeyRegistrationLink(){
  key=getLink(App.Agent.Hash,"keyRegistration",{Load:true});
  keyRegistration=JSON.parse(key.Links[0].E);
  return key.Links[0].H;
}
function callRevocaiton(choice, revocationKey){
// Depending on the choice that was made for the Revocation Methord that has to be formed
if(choice=="1"){
  revocation_Key(revocationKey);
}
else if(choice=="2"){
  revocation_MN(revocationKey)
}
else if(choice=="3"){
  revocation_Athority(revocationKey);
}
debug("===========================Phase 2 (Completed) - Revocation===========================");
}

function revocation_Key(revocationKey){
  debug("++++++++Call revocation_Key+++++++")
  official_revocationKey=makeHash(revocationKey);
  user_revocationKey=official_revocationKey; //TODO get key from user the user_revocationKey.
  if(user_revocationKey!=official_revocationKey){
    debug("**ERROR: Revocation Key Does'nt match**")
  }else{
  //  updateAgent();  //TODO this will call the go code that Eric is working on to update the primary key.
    regen_user(); //reinitialize a the new details and the new key Registration
  }
  debug("++++++++Revocation key Completed++++++++++");
}

/*
Funtion user to re-generate the user that just revorked his old keys
*/
function regen_user(){
  debug("Enter the regen_user");
  call("users","UserUpdate","");

  debug("Calling keyRegistration for regen");
  call("keyRegistration","keyRegistrationUpdate","");
}
function revocation_MN(revocationKey){
debug("++++++++Call revocation_MN+++++++")
}
function revocation_Athority(revocationKey){
debug("++++++++Call revocation_Athority+++++++")
}




function revocationRead(){

}
function revocationUpdate(){

}
function revocationDelete(){

}
function revocation_linksCreate(){

}
function revocation_linksRead(){

}
function revocation_linksUpdate(){

}
function revocation_linksDelete(){

}
