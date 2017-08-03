function genesis(){
  //keyRegistrationCreate();
  return true;
}

function keyRegistrationCreate(arg,n_user_list){
  debug("select Revocation method");//TODO for now the default selection will be "1" i.e the revocation_key method
  debug("Creating the user's keyRegistration");
  revocation_Method_ID=arg.revocation_method;
  keyRegistration={perm_dpki_id:App.Agent.TopHash,public_key:App.Key.Hash,shared_ID:App.Agent.String,revocation_Method_ID:revocation_Method_ID};
  me=getMeAgent();
  key=commit("keyRegistration",keyRegistration);
  commit("user_keyRegistration_link", {Links:[{Base:me,Link:key,Tag:"keyRegistration"}]});
  debug("user_keyRegistration_link: "+JSON.stringify(getLink(me,"keyRegistration",{Load:true})));
  a=getLink(me,"keyRegistration",{Load:true});
//commit the user list too.

if(revocation_Method_ID==2){
  key={keyRegistration:keyRegistration,
  n_user_list:n_user_list}
  debug(JSON.stringify(key))
keyRegistrationCreateMN(keyRegistration,n_user_list)
}
//Revocation Key can be used for further work from here
  debug("revocationKey is ="+ makeHash(keyRegistration));
//return for the testing the function
return a.Links[0].E;
}

function keyRegistrationCreateMN(key){

  keyRegistration=key.keyRegistration;
  n_user_list=key.n_user_list;
  if(!saveUsersList(n_user_list)){
    return false
  }
  else {
    //TODO Decided what has to be signed ??
    test=getKeySigned(key);
return test
  }
}

function getKeySigned(key){
  keyRegistration=key.keyRegistration;
  n_user_list=key.n_user_list;
  reply1=send(getAgent(n_user_list.un1),keyRegistration)
  reply2=send(getAgent(n_user_list.un2),keyRegistration)
  reply3=send(getAgent(n_user_list.un3),keyRegistration)
  reply4=send(getAgent(n_user_list.un4),keyRegistration)

reply={reply1:reply1,reply2:reply2,reply3:reply3,reply4:reply4}

return reply
}

function receive(from,keyRegistration){
  debug("Recived the message"+keyRegistration);
  return true
}
//Create a list of users using their perm_dpki_id
function saveUsersList(n_user_list){
  me=getMeAgent();
  debug(JSON.stringify(n_user_list))
//Check if user list is valid
  if(!getAgent(n_user_list.un1)||!getAgent(n_user_list.un2)||!getAgent(n_user_list.un3)||!getAgent(n_user_list.un4))
  {
    return false
  }
  key=commit("nUserList",n_user_list);
  debug(key);
  commit("user_nlist_link", {Links:[{Base:me,Link:key,Tag:"nUserList"}]});
  debug("user_nlist_link: "+JSON.stringify(getLink(me,"nUserList",{Load:true})));
test=getLink(me,"nUserList",{Load:false});
return test.Links[0].H
}

//This is just going to check if the userAddress that was given actually exits
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

/*
//This is just going to check if the userAddress that was given actually exits
function checkUserExist(perm_dpki_id){
  debug("user: "+JSON.stringify(getLink(perm_dpki_id,"users",{Load:true})));

  a=getLink(perm_dpki_id,"users",{Load:true})
  error1="{\"message\":\"hash not found\",\"name\":\"HolochainError\"}"
error2="{\"message\":\"multihash length inconsistent: \u0026{126  9924 []}\",\"name\":\"HolochainError\"}"
  //if(JSON.stringify(a)==error){
if(JSON.stringify(a)==error1||JSON.stringify(a)==error2){
    debug("* "+perm_dpki_id+" -> Doesnt Exist");
    return false
  }
  else{
    debug(perm_dpki_id+" ->exists")
    return true
  }

}
*/

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



function selectRevocationMethod(){
  // This is a multiple choice in the UI. return the choice that the  user makes
  // 1 = Revocation Key
  // 2 = M of N Revocation
  // 3 = Revocation Athority
  choice="1";
  return choice;
}

function keyRegistrationUpdate(revoked_key){
  debug("++++Update key Registration+++++")
  //me=revoked_key;
  var kr = doGetLink(revoked_key,"keyRegistration");
  var n = kr.length - 1;
  debug("N="+n);
  if (n >= 0) {
  var oldKey = kr[n];
  debug("oldkeyRegistration"+ JSON.stringify(oldKey))
  revocation_Method_ID=selectRevocationMethod();

  //TODO change the "2" when the revocation method is called from the UI Hash actually changes
  /*Done because the same vause is not replaced in the DHT wheich gives an ERROR*/
  //new_keyRegistration={perm_dpki_id:App.Agent.Hash,public_key:App.Key.Hash,shared_ID:App.Agent.String,revocation_Method_ID:"2"};
    new_keyRegistration={perm_dpki_id:App.Agent.TopHash,public_key:App.Key.Hash,shared_ID:App.Agent.String,revocation_Method_ID:revocation_Method_ID};
  /*  debug("App.Agent.Hash="+App.Agent.Hash)
    debug("App.AgentTop.Hash="+App.Agent.TopHash)
    debug("App.Key.Hash="+App.Key.Hash)
  */
  var key = update("keyRegistration",new_keyRegistration,oldKey);
  debug(new_keyRegistration+" is "+key);
  commit("user_keyRegistration_link",
         {Links:[
             {Base:revoked_key,Link:oldKey,Tag:"keyRegistration",LinkAction:HC.LinkAction.Del},
             {Base:revoked_key,Link:key,Tag:"keyRegistration"}
         ]});
      }
  debug("New_user_keyRegistration_link: "+JSON.stringify(getLink(revoked_key,"keyRegistration",{Load:true})));
  a=getLink(revoked_key,"keyRegistration",{Load:true})
  return a.Links[0].H;
}

function doGetLink(base,tag) {
    // get the tag from the base in the DHT
    var links = getLink(base, tag,{Load:true});
    if (isErr(links)) {
        links = [];
    }
     else {
        links = links.Links;
    }
    debug("Links:"+JSON.stringify(links));
    var links_filled = [];
    for (var i=0;i <links.length;i++) {
        links_filled.push(links[i].H);
    }
    return links_filled;
}
function isErr(result) {
    return ((typeof result === 'object') && result.name == "HolochainError");
  }


  function keyRegistrationRead(){
  return true;
  }
function keyRegistrationDelete(){
return true;
}

//==============================
// Support functions
//===============================
function getDirectory() {return App.DNA.Hash;}
  function getMeKey() {return App.Key.Hash;}
function getMeAgent(){return App.Agent.Hash;}
// ===============================================================================
//   VALIDATION functions
// ===============================================================================

function validateCommit(entry_type,entry,header,pkg,sources) {
    debug("validate commit: "+entry_type);
    return validate(entry_type,entry,header,sources);
}

function validatePut(entry_type,entry,header,pkg,sources) {
    debug("validate put: "+entry_type);
    return validate(entry_type,entry,header,sources);
}

function validate(entry_type,entry,header,sources) {
    return true;
}

function validateLink(linkEntryType,baseHash,links,pkg,sources){
    debug("validate link: "+linkEntryType);
    if (linkEntryType=="user_keyRegistration_link") {
        var length = links.length;
        // a valid user_directory_link is when:
        // there should just be one or two links only
        if (length==2) {
            // if this is a modify it will have two links the first of which
            // will be the del and the second the new link.
            if (links[0].LinkAction != HC.LinkAction.Del) return false;
            if (links[1].LinkAction != HC.LinkAction.Add) return false;
        } else if (length==1) {
            // if this is a new handle, there will just be one Add link
            if (links[0].LinkAction != HC.LinkAction.Add) return false;
        } else {return false;}

      return true;
    }
    return true;
}
function validateMod(entry_type,entry,header,replaces,pkg,sources) {
    debug("validate mod: "+entry_type+" header:"+JSON.stringify(header)+" replaces:"+JSON.stringify(replaces));
    return true;
}
function validateDel(entry_type,hash,pkg,sources) {
    debug("validate del: "+entry_type);
    return true;
}

function validatePutPkg(entry_type) {return null;}
function validateModPkg(entry_type) { return null;}
function validateDelPkg(entry_type) { return null;}
function validateLinkPkg(entry_type) { return null;}
