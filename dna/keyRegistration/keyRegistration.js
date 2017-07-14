function genesis(){
  keyRegistrationCreate("1");
  return true;
}

function keyRegistrationCreate(choice){
  debug("Creating the user's keyRegistration");
  //debug("choice :"+choice);
  keyRegistration={perm_dpki_id:App.Agent.Hash,public_key:App.Key.Hash,shared_ID:App.Agent.String,revocation_Method_ID:choice};
  //debug("keyRegistration="+keyRegistration);
  directory=getDirectory();
  key=commit("keyRegistration",keyRegistration);
  commit("user_keyRegistration_link", {Links:[{Base:directory,Link:key,Tag:"keyRegistration"}]});
  debug("user_keyRegistration_link: "+JSON.stringify(getLink(directory,"keyRegistration",{Load:true})));
  debug("User keyRegistration Created with the preset revocation Methord to 1");
  debug("===========================Phase 1.1 End===========================");
}

function selectRevocationMethord(choice){
  // This is a multiple choice
  // 1 = Revocation Key
  // 2 = M of N Revocation
  // 3 = Revocation Athority
  return choice;
}

function keyRegistrationRead(){
return true;
}
function keyRegistrationUpdate(){
return true;
}
function keyRegistrationDelete(){
return true;
}

//==============================
// Support functions
//===============================
function getDirectory() {return App.DNA.Hash;}
function getMePublic() {return App.Key.Hash;}
function getMePrivate(){return App.Agent.Hash;}
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
