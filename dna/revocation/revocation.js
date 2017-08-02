function genesis(){
  /*
  This is called in genesis just for testing
  Later once the UI is done it will be called when the user wants to revke his key
  */
  //  revocation();
  //  debug("==============THIS IS THE SECOND DEBUG==================");
  //  revocation("joash");
}

function revocation(){
  debug("===========================Phase 2 (Starts) - Revocation===========================");
  // this is called when the user wants to revoke his keys
  if(!isRegistered()){return false}
  else{
  key=getLink(getMeAgent(),"keyRegistration",{Load:true});
  keyRegistration=JSON.parse(key.Links[0].E);
  test=  callRevocaiton(keyRegistration.revocation_Method_ID,keyRegistration);
  return test
}
}

function isRegistered() {
  me=getMeAgent();
    var registered_users_key = getLink(me, "keyRegistration",{Load:true})
    debug("Registered users are: "+JSON.stringify(registered_users_key));
    if( registered_users_key instanceof Error) return false
    registered_users_key = registered_users_key.Links
    var agent_id = App.Key.Hash
    for(var i=0; i < registered_users_key.length; i++) {
        var profile = JSON.parse(registered_users_key[i]["E"])
        debug("Registered user key "+i+" is " + profile.shared_ID)
        if( profile.public_key == agent_id) return true;
    }
    return false;
}

function getKeyRegistrationLink(){
  key=getLink(getMeKey(),"keyRegistration",{Load:true});
  keyRegistration=JSON.parse(key.Links[0].E);
  return key.Links[0].H;
}
function callRevocaiton(choice, revocationKey){
// Depending on the choice that was made for the Revocation Method that has to be formed
if(choice=="1"){
test=  revokeKeySelf(revocationKey);

/*  debug("App.Agent.Hash="+App.Agent.Hash)
  debug("App.AgentTop.Hash="+App.Agent.TopHash)
  debug("App.Key.Hash="+App.Key.Hash)
  */
}
else if(choice=="2"){
test=  revokeKeyMN(revocationKey)
}
else if(choice=="3"){
test=  revokeKeyAthority(revocationKey);
}
debug("===========================Phase 2 (Completed) - Revocation===========================");

if(test==true){regenUser(App.Agent.Hash);}
return test

}

function revokeKeySelf(revocationKey){
  //debug("++++++++Call revokeKeySelf+++++++")
  official_revocationKey=makeHash(revocationKey);
  user_revocationKey=official_revocationKey; //TODO get key from user the user_revocationKey.
  if(user_revocationKey!=official_revocationKey){
    debug("**ERROR: Revocation Key Does'nt match**")
    return false
  }else{
    //revoked_key=getMeKey();
  //  revoked_key=App.Agent.Hash;
    old_Agent_TopHash=App.Agent.TopHash;

    //debug("revoked_key="+revoked_key)
//debug("UpdateAgent called")
updateAgent({Revocation:"revoked this key"});
//the identity can be used if we want to update the key.hash only
//updateAgent({Identity:identity});
new_Agent_TopHash=App.Agent.TopHash;
debug("App.Agent.Hash="+App.Agent.Hash)
debug("App.AgentTop.Hash="+App.Agent.TopHash)
debug("App.Key.Hash="+App.Key.Hash)

//regenUser(revoked_key); //reinitialize a the new details and the new key Registration
    }

return  checkUpdate(old_Agent_TopHash,new_Agent_TopHash);
//  debug("++++++++Revocation key Completed++++++++++");
}

function checkUpdate(old_Agent_TopHash,new_Agent_TopHash){
  if(old_Agent_TopHash==new_Agent_TopHash){
    debug("[Revocation ERROR: **Revocation Key not Succesfull]")
    return false}
  else{
    debug("||->Revocation Succesfull")
    return true
  }
}
/*
Funtion user to re-generate the user that just revorked his old keys
*/

function regenUser(revoked_key){
//  debug("Enter the regenUser");

  call("users","usersUpdate","");
//  debug("Calling keyRegistration for regen");
  call("keyRegistration","keyRegistrationUpdate",revoked_key);
}

function revokeKeyMN(revocationKey){
debug("++++++++Call revokeKeyMN+++++++")
}
function revokeKeyAthority(revocationKey){
debug("++++++++Call revokeKeyAthority+++++++")
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
