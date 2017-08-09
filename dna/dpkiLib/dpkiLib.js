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


function verifyUser(agent_id){
if(!getAgent(agent_id)){
  return false
}
else{
  return true
}
}
//This is just going to check if the userAddress that was given actually exits
function getAgent(handleHash) {
    var directory = App.DNA.Hash;
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
