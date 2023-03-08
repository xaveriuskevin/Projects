'use strict'

function hidename(target){
    var name = target
    var hidden = "";
    for (i = 0; i < name.length; i++) {
        if (i > 2) {
      hidden += "*";
        } else {
      hidden += name[i];
        }
  }
  return hidden
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}


module.exports.makeid = makeid
module.exports.hidename = hidename