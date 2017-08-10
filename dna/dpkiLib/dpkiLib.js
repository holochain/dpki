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
  me=App.Agent.Hash
  app_agent_id_hash=commit("app_agent_id",app_agent_id);
  commit("app_agent_id_link", {Links:[{Base:me,Link:app_agent_id_hash,Tag:"app_agent_id"}]});
  debug("app_agent_id_link: "+JSON.stringify(getLink(me,"app_agent_id",{Load:true})));
  a=getLink(me,"app_agent_id",{Load:true})
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
source=getAgent(app_agent_id);
if(source==""){
  return false
}else{
  a=getLink(source,"users",{Load:true})
  return a.Links[0].E
}

}

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
