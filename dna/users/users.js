function genesis(){
  usersCreate();
  return true;
}
function usersCreate(){
  debug("Creating the user");
  user={perm_dpki_id:App.Agent.TopHash,public_key:App.Key.Hash,shared_ID:App.Agent.String};
  //debug("user="+user);
  directory=getDirectory();
  me=getMeAgent();
  users=commit("users",user);
  commit("users_me_link", {Links:[{Base:me,Link:users,Tag:"users"}]});
  debug("users_me_link: "+JSON.stringify(getLink(me,"users",{Load:true})));
  a=getLink(me,"users",{Load:true})
  return a.Links[0].H;
}

function usersUpdateDetails(arg){
  debug("++++Update users Details+++++")
  me=getMeAgent();
  var user = doGetLink(me,"users");
  var n = user.length - 1;
  debug("N="+n);
  if (n >= 0) {
  var oldKey = user[n];
  debug("olduser"+ JSON.stringify(oldKey))

  new_user={perm_dpki_id:App.Agent.TopHash,public_key:App.Key.Hash,shared_ID:arg.username,email:arg.email,address:arg.address};

  var key = update("users",new_user,oldKey);
  debug(new_user+" is "+key);
  commit("users_me_link",
         {Links:[
             {Base:me,Link:oldKey,Tag:"users",LinkAction:HC.LinkAction.Del},
             {Base:me,Link:key,Tag:"users"}
         ]});
      }
  debug("New_user_me_link: "+JSON.stringify(getLink(me,"users",{Load:true})));
  a=getLink(me,"users",{Load:true});
  return a.Links[0].H;
}

function usersUpdate(){
  debug("++++Update users+++++")
    debug("App.Agent.Hash="+App.Agent.Hash)
    debug("App.AgentTop.Hash="+App.Agent.TopHash)
    debug("App.Key.Hash="+App.Key.Hash)

  me=getMeAgent();
  var user = doGetLink(me,"users");
  var n = user.length - 1;
  debug("N="+n);
  if (n >= 0) {
  var oldKey = user[n];
  debug("olduser"+ JSON.stringify(oldKey))
  new_user={perm_dpki_id:App.Agent.TopHash,public_key:App.Key.Hash,shared_ID:App.Agent.String};

  var key = update("users",new_user,oldKey);
  debug(new_user+" is "+key);
  commit("users_me_link",
         {Links:[
             {Base:me,Link:oldKey,Tag:"users",LinkAction:HC.LinkAction.Del},
             {Base:me,Link:key,Tag:"users"}
         ]});
      }
  debug("New_user_me_link: "+JSON.stringify(getLink(me,"users",{Load:true})));
  a=getLink(me,"users",{Load:true});
  return a.Links[0].H;
}


//======================
function usersRead(){
return true;
}
function usersDelete(){
return true;
}
function addusersDetails(){
return true;
}
function addusersLinks(){
return true;
}

//==============================
// Support functions
//===============================
function getDirectory() {return App.DNA.Hash;}
function getMePublic() {return App.Key.Hash;}
function getMeAgent(){return App.Agent.Hash;}

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
    if (linkEntryType=="users_me_link") {
        var length = links.length;
        // a valid users_me_link is when:
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
    //debug("validate mod: "+entry_type+" header:"+JSON.stringify(header)+" replaces:"+JSON.stringify(replaces));
    return true;
}
function validateDel(entry_type,hash,pkg,sources) {
    //debug("validate del: "+entry_type);
    return true;
}

function validatePutPkg(entry_type) {return null;}
function validateModPkg(entry_type) { return null;}
function validateDelPkg(entry_type) { return null;}
function validateLinkPkg(entry_type) { return null;}
