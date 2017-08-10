/***********
File for library of Methods
************/
/*
function doGetTagLinkLoad(base, tag) {
    // get the tag from the base in the DHT
    var links = getLink(base, tag,{Load:true});
    if (isErr(links)) {
      debug("isErr");
        links = [];
    } else {

       links = links.Links;
    }
    var links_filled = [];
    for (var i=0;i <links.length;i++) {
        var link = {H:links[i].H};
        link[tag] = links[i].E;
        links_filled.push(link);
    }
    debug("Links Filled:"+JSON.stringify(links_filled));
    return links_filled;
}
*/
// TODO This function will be used by the other application's
//  by passing a public_key of the users they want to verify (i.e if he exist in the DHT of the DPKI)



function bridgeGenesis()
{
  return true;
}

function receive(from, arg)
{
  if(arg.type == "verifyUser")
  {
    var val = verifyUser(arg.app_agent_id)
  }
  else if(arg.type == "registerUserApp")
  {
    var val=registerUserApp(arg.app_agent_id)
  }
  return val;
}

function registerUserApp(app_agent_id){
  keyRegistration=getLink(App.Agent.Hash,"keyRegistration",{Load:true});
  debug(keyRegistration)
  keyRegistrationHash=makeHash(keyRegistration.Links[0].E)
  z=commit("app_agent_id_link", {Links:[{Base:app_agent_id,Link:keyRegistrationHash,Tag:"app_agent_id"}]});
  debug(z)
  debug("app_agent_id_link: "+JSON.stringify(getLink(app_agent_id,"app_agent_id",{Load:true})));
  a=getLink(app_agent_id,"app_agent_id",{Load:true})
  return true
}


function verifyUser(app_agent_id){
  var sources = get(app_agent_id,{GetMask:HC.GetMask.Sources});
  debug("Sources of the app_agent: "+sources)
  if (isErr(sources)) {sources = [];}
  if (sources != undefined) {
      var n = sources.length -1;
      return (n >= 0) ? sources[n] : false;
  }
  return false;
}


function getUserDetails(app_agent_id){
  key=getLink(app_agent_id,"app_agent_id",{Load:true})
  source=JSON.parse(key.Links[0].E)
  a=getLink(source.perm_dpki_id,"users",{Load:true})
  userDetails=JSON.parse(a.Links[0].E)
  arg={
    key : key.Links[0].E,
    shared_ID : userDetails.shared_ID,
    address : userDetails.address,
    email : userDetails.email
  }
  debug(arg);
  return JSON.stringify(arg)
}
/*
//This is just going to check if the userAddress that was given actually exits
function getAgent(app_agent_id) {
    var sources = get(app_agent_id,{GetMask:HC.GetMask.Sources});
    debug("Sources of the app_agent: "+sources)
    if (isErr(sources)) {sources = [];}
    if (sources != undefined) {
        var n = sources.length -1;
        return (n >= 0) ? sources[n] : "";
    }
    return "";
}
function isErr(result) {
    return ((typeof result === 'object') && result.name == "HolochainError");
  }
*/


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
      if (linkEntryType=="app_agent_id_link") {
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
