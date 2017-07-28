function genesis(){
  //keyRegistrationCreate();
  return true;
}

function keyRegistrationCreate(){
  debug("select Revocation method");//TODO for now the default selection will be "1" i.e the revocation_key method
  debug("Creating the user's keyRegistration");
  revocation_Method_ID=selectRevocationMethod();
  keyRegistration={perm_dpki_id:App.Agent.TopHash,public_key:App.Key.Hash,shared_ID:App.Agent.String,revocation_Method_ID:revocation_Method_ID};
  me=getMeAgent();
  key=commit("keyRegistration",keyRegistration);
  commit("user_keyRegistration_link", {Links:[{Base:me,Link:key,Tag:"keyRegistration"}]});
  debug("user_keyRegistration_link: "+JSON.stringify(getLink(me,"keyRegistration",{Load:true})));
  a=getLink(me,"keyRegistration",{Load:true});
  debug("User keyRegistration Created with the preset revocation method to 1");
  debug("===========================Phase 1.1 End===========================");
  debug("===========================Phase 1.2 Starting===========================");
//Revocation Key can be used for further work from here
  debug("revocationKey is ="+ makeHash(keyRegistration));
  debug("===========================Phase 1.2 End===========================");
//return for the testing the function
return a.Links[0].E;
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
