function genesis(){
/*TODO remove this for the app to works
JUST FOR TESTING THE HOLOCHAT APP*/
//  arg={username:"Jack",email:"jackT@hammer.com",address:"123 Moraga St",revocation_method:"1"};
//  keyRegistrationCreate(arg);
  return true;
}

function keyRegistrationCreate(arg){
  call("users","usersUpdateDetails",arg)
  var n_user_list
  debug("select Revocation method");//TODO for now the default selection will be "1" i.e the revocation_key method
  debug("Creating the user's keyRegistration");
  revocation_Method_ID=arg.revocation_method;
  keyRegistration={perm_dpki_id:App.Agent.TopHash,public_key:App.Key.Hash,shared_ID:arg.username,revocation_Method_ID:arg.revocation_method}
  me=getMeAgent();
  key=commit("keyRegistration",keyRegistration);
  commit("user_keyRegistration_link", {Links:[{Base:me,Link:key,Tag:"keyRegistration"}]});
  debug("user_keyRegistration_link: "+JSON.stringify(getLink(me,"keyRegistration",{Load:true})));
  a=getLink(me,"keyRegistration",{Load:true});
//Revocation Key can be used for further work from here
  debug("revocationKey is ="+ makeHash(keyRegistration));
//return for the testing the function
return a.Links[0].E;
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
  debug("New_user_keyRegistration_link: "+JSON.stringify(getLink(App.Agent.Hash,"keyRegistration",{Load:true})));
  a=getLink(App.Agent.Hash,"keyRegistration",{Load:true})
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
