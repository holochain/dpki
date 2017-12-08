function genesis(){
/*TODO remove this for the app to works
JUST FOR TESTING THE HOLOCHAT APP*/
//  arg={username:"Jack",email:"jackT@hammer.com",address:"123 Moraga St",revocation_method:"1"};
//  keyRegistrationCreate(arg);
  return true;
}

function keyRegistrationCreate(arg,n_user_list){
if(arg.revocation_method==1){
  data=keyRegistrationCreateSelf(arg);
}else if(arg.revocation_method==2){
data=keyRegistrationCreateMN(arg,n_user_list);
}else if (arg.revocation_method==3) {

}else return false
  return data
}


function keyRegistrationCreateSelf(arg){
  call("users","usersUpdateDetails",arg)
  var n_user_list
  debug("select Revocation method");
  debug("Creating the user's keyRegistration");
  keyRegistration={perm_dpki_id:App.Agent.TopHash,public_key:App.Key.Hash,shared_ID:arg.username,revocation_Method_ID:arg.revocation_method}
  me=getMeAgent();
  key=commit("keyRegistration",keyRegistration);
  commit("user_keyRegistration_link", {Links:[{Base:me,Link:key,Tag:"keyRegistration"}]});
  debug("user_keyRegistration_link: "+JSON.stringify(getLinks(me,"keyRegistration",{Load:true})));
  a=getLinks(me,"keyRegistration",{Load:true});
//Revocation Key can be used for further work from here
    debug("revocationKey is ="+ makeHash("keyRegistration",keyRegistration));
//return for the testing the function
return a[0].Entry;
}

//TODO CODE for MN
function keyRegistrationCreateMN(arg,n_user_list){
  //update user details
  call("users","usersUpdateDetails",arg)

  //Commit the keyRegistration
  keyRegistration={perm_dpki_id:App.Agent.TopHash,public_key:App.Key.Hash,shared_ID:arg.username,revocation_Method_ID:arg.revocation_method}
  me=getMeAgent();
  key=commit("keyRegistration",keyRegistration);
  commit("user_keyRegistration_link", {Links:[{Base:me,Link:key,Tag:"keyRegistration"}]});
  debug("user_keyRegistration_link: "+JSON.stringify(getLinks(me,"keyRegistration",{Load:true})));
  a=getLinks(me,"keyRegistration",{Load:true});
  debug("revocationKey is ="+ makeHash(keyRegistration));

  //commit the user list too.
    key={keyRegistration:keyRegistration,
    n_user_list:n_user_list}
    debug("Key : "+JSON.stringify(key))

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


//TODO This is the code that is recived by the N users who has to decide to sign the key
function receive(from,keyRegistration){
  debug("Recived the message"+keyRegistration);
//  ret=sign()
  //return ret
  return true
}
//TODO  NOT DONE YET
//TODO here we verify the signature of the N people who sign
function verifySig(signature,data,public_key){
  var public_key = get(public_key_Hash,{GetMask:HC.GetMask.Entry});
  debug(public_key.C)
  //pass=verifySignature(signature,data,public_key)
  if(!verifySignature(signature,data,public_key)){
    return false
  }
  else{
    return true
  }
}

//Create a list of users using their perm_dpki_id
function saveUsersList(n_user_list){
  me=getMeAgent();
  debug(JSON.stringify(n_user_list))
//Check if user list is valid
  if(!getAgent(n_user_list.un1)||!getAgent(n_user_list.un2)||!getAgent(n_user_list.un3)||!getAgent(n_user_list.un4))
  {
    debug("*ERROR : One of the users in the list does'nt Exist")
    return false
  }
  key=commit("nUserList",n_user_list);
  debug(key);
  commit("user_nlist_link", {Links:[{Base:me,Link:key,Tag:"nUserList"}]});
  debug("user_nlist_link: "+JSON.stringify(getLinks(me,"nUserList",{Load:true})));
    links=getLinks(me,"nUserList",{Load:false});
    if (isErr(links) || links.length == 0) {
        return ""
    }
    else {
        return links[0].Hash;
    }
}
////////////////////////////////////////////

//This is just going to check if the userAddress that was given actually exits
// return the source i.e the public_key if it exists else false
function getAgent(handleHash) {
    var directory = getDirectory();
  //  var handleHash = makeHash("handle",handle);
    var sources = get(handleHash,{GetMask:HC.GetMask.Sources});
debug("Sources: "+sources)
    if (isErr(sources)) {sources = [];}
    if (sources != undefined) {
        var n = sources.length -1;
        return (n >= 0) ? sources[n] : false;
    }
    return false;
}



function isRegistered() {
  me=getMeAgent();
    var registered_users_key = getLinks(me, "keyRegistration",{Load:true})
    debug("Registered users are: "+JSON.stringify(registered_users_key));
    if( registered_users_key instanceof Error) return false
    var agent_id = App.Key.Hash
    for(var i=0; i < registered_users_key.length; i++) {
        var profile = registered_users_key[i].Entry
        debug("Registered user key "+i+" is " + profile.shared_ID)
        if( profile.public_key == agent_id) return true;
    }
    return false;
}
function keyRegistrationUpdate(arg){
  debug("++++Update key Registration+++++")
  //me=revoked_key;
  var kr = doGetLink(App.Agent.Hash,"keyRegistration");
  var n = kr.length - 1;
  debug("N="+n);
  if (n >= 0) {
  var oldKey = kr[n];
  debug("oldkeyRegistration"+ JSON.stringify(oldKey))
  //revocation_Method_ID=selectRevocationMethod();
debug(arg.username)
  //TODO change the "2" when the revocation method is called from the UI Hash actually changes
  /*Done because the same vause is not replaced in the DHT wheich gives an ERROR*/
  //new_keyRegistration={perm_dpki_id:App.Agent.Hash,public_key:App.Key.Hash,shared_ID:App.Agent.String,revocation_Method_ID:"2"};
    new_keyRegistration={perm_dpki_id:App.Agent.TopHash,public_key:App.Key.Hash,shared_ID:arg.username,revocation_Method_ID:arg.revocation_method};
  var key = update("keyRegistration",new_keyRegistration,oldKey);
  debug(new_keyRegistration+" is "+key);
  commit("user_keyRegistration_link",
         {Links:[
             {Base:App.Agent.Hash,Link:oldKey,Tag:"keyRegistration",LinkAction:HC.LinkAction.Del},
             {Base:App.Agent.Hash,Link:key,Tag:"keyRegistration"}
         ]});
      }
  debug("New_user_keyRegistration_link: "+JSON.stringify(getLinks(App.Agent.Hash,"keyRegistration",{Load:true})));
    a=getLinks(App.Agent.Hash,"keyRegistration",{Load:true})
  return a[0].Hash;
}

function doGetLink(base,tag) {
    // get the tag from the base in the DHT
    var links = getLinks(base, tag,{Load:true});
    if (isErr(links)) {
        links = [];
    }
    debug("Links:"+JSON.stringify(links));
    var links_filled = [];
    for (var i=0;i <links.length;i++) {
        links_filled.push(links[i].Hash);
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
