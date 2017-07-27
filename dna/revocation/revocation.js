function genesis(){
  /*
  This is called in genesis just for testing
  Later once the UI is done it will be called when the user wants to revke his key
  */
    revocation("joel");
  //  debug("==============THIS IS THE SECOND DEBUG==================");
  //  revocation("joash");
}

function revocation(identity){
  debug("===========================Phase 2 (Starts) - Revocation===========================");
  // this is called when the user wants to revoke his keys
  key=getLink(getMeAgent(),"keyRegistration",{Load:true});
  keyRegistration=JSON.parse(key.Links[0].E);
test=  callRevocaiton(keyRegistration.revocation_Method_ID,keyRegistration,identity);
return test
}

function getKeyRegistrationLink(){
  key=getLink(getMeKey(),"keyRegistration",{Load:true});
  keyRegistration=JSON.parse(key.Links[0].E);
  return key.Links[0].H;
}
function callRevocaiton(choice, revocationKey,identity){
// Depending on the choice that was made for the Revocation Methord that has to be formed
if(choice=="1"){
test=  revocation_Key(revocationKey,identity);

/*  debug("App.Agent.Hash="+App.Agent.Hash)
  debug("App.AgentTop.Hash="+App.Agent.TopHash)
  debug("App.Key.Hash="+App.Key.Hash)
  */
}
else if(choice=="2"){
test=  revocation_MN(revocationKey)
}
else if(choice=="3"){
test=  revocation_Athority(revocationKey);
}
debug("===========================Phase 2 (Completed) - Revocation===========================");
return test

}

function revocation_Key(revocationKey,identity){
  //debug("++++++++Call revocation_Key+++++++")
  official_revocationKey=makeHash(revocationKey);
  user_revocationKey=official_revocationKey; //TODO get key from user the user_revocationKey.
  if(user_revocationKey!=official_revocationKey){
    debug("**ERROR: Revocation Key Does'nt match**")
  }else{
    //revoked_key=getMeKey();
    revoked_key=App.Agent.Hash;
    old_Agent_TopHash=App.Agent.TopHash;

    debug("revoked_key="+revoked_key)
debug("UpdateAgent called")
updateAgent({Revocation:"revoked this key"});
//the identity can be used if we want to update the key.hash only
//updateAgent({Identity:identity});
new_Agent_TopHash=App.Agent.TopHash;
debug("App.Agent.Hash="+App.Agent.Hash)
debug("App.AgentTop.Hash="+App.Agent.TopHash)
debug("App.Key.Hash="+App.Key.Hash)

regen_user(revoked_key); //reinitialize a the new details and the new key Registration
if(old_Agent_TopHash==new_Agent_TopHash){
debug("[Revocation ERROR: **Revocation Key not Succesfull]")
  return false}
else{
  debug("||->Revocation Succesfull")
return true}
  }
//  debug("++++++++Revocation key Completed++++++++++");
}

/*
Funtion user to re-generate the user that just revorked his old keys
*/

function regen_user(revoked_key){
//  debug("Enter the regen_user");

  call("users","UserUpdate","");
//  debug("Calling keyRegistration for regen");
  call("keyRegistration","keyRegistrationUpdate",revoked_key);
}

function revocation_MN(revocationKey){
debug("++++++++Call revocation_MN+++++++")
}
function revocation_Athority(revocationKey){
debug("++++++++Call revocation_Athority+++++++")
}


function getDirectory() {return App.DNA.Hash;}
function getMeKey() {return App.Key.Hash;}
function getMeAgent(){return App.Agent.Hash;}


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
