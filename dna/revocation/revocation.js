function genesis(){
  /*
  This is called in genesis just for testing
  Later once the UI is done it will be called when the user wants to revke his key
  */
  //  revocation();
  //  debug("==============THIS IS THE SECOND DEBUG==================");
  //  revocation("joash");
  return true
}

function revocation(arg){
  debug("===========================(Starts) - Revocation===========================");
  // this is called when the user wants to revoke his keys
  if(!isRegistered()){return false}
  else{
  test=  callRevocaiton(arg);
  if(test==true){regenUser(arg);}
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

function getRevocationKeyLink(){
  key=getLink(getMeAgent(),"keyRegistration",{Load:true});
//  keyRegistration=JSON.parse(key.Links[0].E);
  return key.Links[0].H;
}
function getRevocationKey(){
  key=getLink(getMeAgent(),"keyRegistration",{Load:true});
  keyRegistration=JSON.parse(key.Links[0].E);
  return keyRegistration
}

function callRevocaiton(arg){
// Depending on the choice that was made for the Revocation Method that has to be formed

revocationKey=getRevocationKey();
choice=keyRegistration.revocation_Method_ID
if(choice=="1"){
  if(arg.revocationKey==getRevocationKeyLink()){
    debug("Revoaction key Verified")
  test=  revokeKeySelf(revocationKey);
  }
  else{return false}
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
debug("===========================(Completed) - Revocation===========================");

return test
}


function revokeKeyMN(revocationKey){
debug("++++++++Call revokeKeyMN+++++++")
//Get the list of users
n_user_list=getUserList();
keyRegistration=getRevocationKey()
key={keyRegistration:makeHash(keyRegistration),
n_user_list:n_user_list}
//Get the key signed by the users
test=getKeySigned(key);
//TODO check the signed key
//CONDITION passes return revoke()
return
}

//Returns the list of users that the initial user had created while registration
function getUserList(){
  a=getLink(getMeAgent(),"nUserList",{Load:true});
  return JSON.parse(a.Links[0].E)
}


function revoke(){
  old_Agent_TopHash=App.Agent.TopHash;
  updateAgent({Revocation:"revoked this key"});
  new_Agent_TopHash=App.Agent.TopHash;
return  checkUpdate(old_Agent_TopHash,new_Agent_TopHash);
}
/*
M of N Revoaction
*/
function getKeySigned(key){
  keyRegistration=key.keyRegistration;
  n_user_list=key.n_user_list;
  //user 1
  reply1=send(getAgent(n_user_list.un1),keyRegistration)
//user 2
  reply2=send(getAgent(n_user_list.un2),keyRegistration)
//user 3
  reply3=send(getAgent(n_user_list.un3),keyRegistration)
//user 4
  reply4=send(getAgent(n_user_list.un4),keyRegistration)

//TODO This has to wait for all the replys to come. and then proceed
if(!reply1||!reply2||!reply3||!reply4){
  ret=false
}else{
  user_signed_details =[{keyRegistration:keyRegistration},{signed:reply1,agent_id:n_user_list.un1},
    {signed:reply2,agent_id:n_user_list.un2},
    {signed:reply3,agent_id:n_user_list.un3},
    {signed:reply4,agent_id:n_user_list.un4}]
    ret = commitSignedDetails(user_signed_details)
}

return ret
}


//This is the code that is recived by the N users who has to decide to sign the key
function receive(from,keyRegistration){
  //TODO give the user the option to choose if he wants to sign
  signed=signFriendsKey(keyRegistration)
//  debug("Signed message"+signed);
  return signed
}

function signFriendsKey(keyRegistration){
  signed=sign(keyRegistration)
  return signed
}



function commitSignedDetails(user_signed_details){

  //Commiting all the signed keys
    key=commit("user_signed_details",JSON.stringify(user_signed_details));
    commit("user_signed_details_link", {Links:[{Base:getMeAgent(),Link:key,Tag:"user_signed_details"}]});
  //debug("user_signed_details_link: "+JSON.stringify(getLink(getMeAgent(),"user_signed_details",{Load:true})));
  a=getLink(getMeAgent(),"user_signed_details",{Load:true});
  return a.Links[0].H
}

//Verifys the entire list that is retrived and passed if its verifyed or not in an []
function verifySigOfList(){
  a=getLink(getMeAgent(),"user_signed_details",{Load:true});
  signed_details=JSON.parse(a.Links[0].E)
  var vr=[]
    vr[0]=verifySig(signed_details[1].signed,signed_details[0].keyRegistration,getAgent(signed_details[1].agent_id))
    vr[1]=verifySig(signed_details[2].signed,signed_details[0].keyRegistration,getAgent(signed_details[2].agent_id))
    vr[2]=verifySig(signed_details[3].signed,signed_details[0].keyRegistration,getAgent(signed_details[3].agent_id))
    vr[3]=verifySig(signed_details[4].signed,signed_details[0].keyRegistration,getAgent(signed_details[4].agent_id))
    return vr
}

//Used to check the number of responses from the other users in the list are enough for the revocation to be called
function verifyNumOfSig(vr){
  //TODO Decide the Nummber of signatures we require for this to pass
  count=0
  for(i=0;i<4;i++){
    if(!vr[i]){
      count++
    }
  }
  if(count>1)
  return "UNSUCCESSFUL : No response from "+count+" users"
  else return true
}

//Called to verify the signature of a certain data and user
function verifySig(signature,data,public_key_Hash){
  var public_key = get(public_key_Hash,{GetMask:HC.GetMask.Entry});
  if(!verifySignature(signature,data,public_key)){
    return false
  }
  else{
    return true
  }
}
/*
END  M of N Revocation
*/

function revokeKeySelf(revocationKey){
//  debug("++++++++Call revokeKeySelf+++++++")
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

function regenUser(arg){
//  debug("Enter the regenUser");

  call("users","usersUpdateDetails",arg);
//  debug("Calling keyRegistration for regen");
  call("keyRegistration","keyRegistrationUpdate",arg);
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

//==============================
// Support functions
//===============================

//This is just going to check if the userAddress that was given actually exits
// return the source i.e the public_key if it exists else false
function getAgent(handleHash) {
    var directory = getDirectory();
  //  var handleHash = makeHash(handle);
    var sources = get(handleHash,{GetMask:HC.GetMask.Sources});
debug("Sources: "+sources)
    if (isErr(sources)) {sources = [];}
    if (sources != undefined) {
        var n = sources.length -1;
        return (n >= 0) ? sources[n] : false;
    }
    return false;
}
function isErr(result) {
    return ((typeof result === 'object') && result.name == "HolochainError");
  }
