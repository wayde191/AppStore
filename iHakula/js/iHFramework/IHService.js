
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 4/10/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

ih.defineClass("ih.Service", null, null, function(SERVICE, service){
  
  service.prototype.init = function(){
    this._jsxescapemap = {'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};
  };
  
  service.prototype.getRequest = function(){
    var IE = '\v' == 'v';
    return IE ? new ActiveXObject("Msxml2.XMLHTTP") : new XMLHttpRequest(); 
  };
  
  //handle CSRF attacks by attaching the document cookie (a double-submit); returns null if no document cookie is found
  service.prototype.getSessionCookie = function(){
    if(document.cookie.search(/ihengine-utilities-session-sid=([^;]*)/) != -1) {
      var c = RegExp.$1;
      return (c != null && c != "") ? c : null;
    }
  };
  
  service.prototype.strEscapeJSON = function(str,em) {
    if(!em)
      em = this._jsxescapemap;
    if (/["\\\x00-\x1f]/.test(str)) { //"'/
      return '"' + str.replace(/[\x00-\x1f\\"]/g, function (a) {
        var c = em[a];
        if (c)
          return c;
        c = a.charCodeAt();
        return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
      }) + '"';
    }
    return '"' + str + '"';
  };
  
  //the server always responds with a JSON string (unless a CDF request); eval with try catch to ensure consistent error handling
  service.prototype._evalWithCatch = function(s, r) {
    try {
      var o = window.eval("(" + s + ")");
      if(typeof(o.status) == "undefined")
        o.status = "ok";
    } catch(e) {
      var o = {"status":"-1","error":{"detailed_message":"Client-side error\n\n" + e + "\n\n" + this.strEscapeJSON(s) + "\n\n" + r.status + " " + r.statusText,"code":"-1"}};
    }
    
    return o;
  };
  
  //sends the request either async or sync; for beta1, the server will only issue the following HTTP status codes:
  service.prototype._sendReceive = ih.$F(function(r, fnCallback, strContent, bNoEval) {
    var self = this;
    if(fnCallback) {
      r.onreadystatechange = function() {
        if(r.readyState == 4) {
          //if the server (a service-oriented Ajax server) throws an error, the response text will be a JSON object with details regarding the error
          if(r.status == 403 || r.status == 404 || r.status == 500) {
            var objR = self._evalWithCatch(r.responseText, r);
            objR.httpstatus = r.status;
            fnCallback(objR); 
          } else {
          //var obj = bNoEval ? r.responseText:_evalWithCatch(r.responseText,r);
            fnCallback(bNoEval ? r.responseText:self._evalWithCatch(r.responseText,r));
          }
        }
      };
      r.send(strContent || "");
    } else {
      r.send(strContent || "");
      if(r.status == 403 || r.status == 404 || r.status == 500) {
        var objR = self._evalWithCatch(r.responseText, r);
        objR.httpstatus = r.status;
        return objR;
      } else {
        return bNoEval ? r.responseText : self._evalWithCatch(r.responseText, r);
      }
    }
  });
  
  //GENERIC METHOD THAT HANDLES ALL COMMUNICATIONS (SERVICE CALLS) WITH THE REMOTE SERVER
  //objParam: generic parameter object to unpackage; NOTE: the calling method must create a flattened object for this method to work
  //fnCallback: optional callback method
  //strURI: the URI for the Web Service to call
  //strMethod: either get or post
  //bNoEval: if true, the resonse will not be evaluated; if false or null, the server response will be evaluated (the default)
  //arrParam: if the calling method needs to package the parameter object in a unique way, it can pass the array of encoded parameters
  service.prototype.callService = function(objParam, fnCallback, strURI, strMethod, bNoEval) {
    var bPost = strMethod.toUpperCase() == "POST";
    var arrParam = new Array();
    if(bPost) {
      for(var p in objParam) 
        arrParam.push(p + "=" + window.encodeURIComponent(objParam[p]));
        var c = this.getSessionCookie();
      if(c)
        arrParam.push("cookie=" + window.encodeURIComponent(c));
        var strData = arrParam.join("&");
    } else {
      var strDelim = strURI.indexOf("?") > -1 ? "&" : "?";
      for(var p in objParam) 
        arrParam.push(p + "=" + window.encodeURIComponent(objParam[p]));
      strURI += strDelim + arrParam.join("&");
      var strData;
    }
    var objRequest = this.getRequest();
    objRequest.open(strMethod, strURI, fnCallback != null);
    if(bPost)
      objRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
      
    this._sendReceive.bind(this);
    return this._sendReceive(objRequest, fnCallback, strData, bNoEval);
  };
});