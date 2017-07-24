function genesis(){
  UserCreate();
  return true;
}
function UserCreate(){
  debug("===========================Phase 1.1 Begin===========================");
  debug("Creating the user");
  user={perm_dpki_id:App.Agent.Hash,public_key:App.Key.Hash,shared_ID:App.Agent.String};
  //debug("user="+user);
  directory=getDirectory();
  users=commit("User",user);
  commit("user_directory_link", {Links:[{Base:directory,Link:users,Tag:"User"}]});
  debug("user_directory_link: "+JSON.stringify(getLink(directory,"User",{Load:true})));
  a=getLink(directory,"User",{Load:true})
  return a.Links[0].H;
}


function UserUpdate(){
  debug("++++Update User+++++")
  directory=getDirectory();
  var user = doGetLink(directory,"User");
  var n = user.length - 1;
  debug("N="+n);
  if (n >= 0) {
  var oldKey = user[n];
  debug("olduser"+ JSON.stringify(oldKey))

  //TODO change the "App.Agent.String" when the revocation methord is called from the UI Hash actually changes
  /*Done so that the same vause is not replaced in the DHT wheich gives an ERROR*/
  new_user={perm_dpki_id:App.Agent.Hash,public_key:App.Key.Hash,shared_ID:"App.Agent.String"};

  var key = update("User",new_user,oldKey);
  debug(new_user+" is "+key);
  commit("user_directory_link",
         {Links:[
             {Base:directory,Link:oldKey,Tag:"User",LinkAction:HC.LinkAction.Del},
             {Base:directory,Link:key,Tag:"User"}
         ]});
      }
  debug("New_user_directory_link: "+JSON.stringify(getLink(directory,"User",{Load:true})));
  a=getLink(directory,"User",{Load:true});
  return a.Links[0].H;
}


//======================
function UserRead(){
return true;
}
function UserDelete(){
return true;
}
function add_Users_Details(){
return true;
}
function add_User_Links(){
return true;
}

//==============================
// Support functions
//===============================
function getDirectory() {return App.DNA.Hash;}
function getMePublic() {return App.Key.Hash;}
function getMePrivate(){return App.Agent.Hash;}

// helper function to call getLinks, handle the no links entry error, and build a simpler links array.
function doGetLink(base,tag) {// get the tag from the base in the DHT
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
    if (linkEntryType=="user_directory_link") {
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
