
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/28/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

(function(ih){
  
  ih.addEvent = function(obj, type, fct){
    if(obj.addEventListener){
      obj.addEventListener(type, fct, false);
    }else if(obj.attachEvent){
      obj['e' + type + fct] = fct;
      obj[type + fct] = function(){
        obj['e' + type + fct](window.event); 
      };
      obj.attachEvent('on' + type, obj[type + fct]);
    }
  };
  
  ih.browserDetect = function(){
    if('\v' == 'v'){
      return 'IE';
    }else if(/Mozilla/.test(navigator.userAgent) && /Firefox/.test(navigator.userAgent)){
      return 'MZ';
    }else if(/Chrome/.test(navigator.userAgent) && /Mozilla/.test(navigator.userAgent)){
      return 'CH';
    }else if(/KHTML/.test(navigator.userAgent)){
      return 'SF';
    }
  };
  
  ih.loadScript = ih.$Y(function(cb) {
    var path = cb.args[0];
    var element = document.createElement("script");
    element.setAttribute("src", path);
    element.setAttribute("type", 'text/javascript');
    
    var evtHandler = function(e) {
      element.removeEventListener("load", evtHandler, false);
      cb.done({statu : 'ok'});
    };
    
    var evtHandlerIE = function(){
      var state = this.readyState;
      if (state == "loaded" || state == "interactive" || state == "complete") {
        element.onreadystatechange = null;
        cb.done({statu : 'ok'});
      }
    };
    ih.addEvent(element, 'load', evtHandler);
    ih.addEvent(element, 'onreadystatechange', evtHandlerIE);
    
    document.getElementsByTagName("head")[0].appendChild(element);
  });
  
  ih.removeChildren = function(e){
    if(e){
      var childs = e.childNodes;
      for(var i = childs.length - 1; i >= 0; i--) {    
        e.removeChild(childs[i]);  
      } 
    }
  };
  
  /*####################### Cookie Section ###################*/
  ih.setcookie = function(name, value, expires, path, domain, secure) {
    var today = new Date();
    today.setTime(today.getTime());
    if(expires) 
      expires = expires * 1000 * 60 * 60 * 24;
    var expires_date = new Date(today.getTime() + (expires));
    document.cookie = name + "=" +escape(value) +
    ((expires) ? ";expires=" + expires_date.toGMTString() : "") +
    ((path) ? ";path=" + path : "") +
    ((domain) ? ";domain=" + domain : "") +
    ((secure) ? ";secure" : "");
  };
  
  ih.getcookie = function(name) {
    var start = document.cookie.indexOf(name + "=");
    var len = start + name.length + 1;
    if ((!start) && (name != document.cookie.substring(0, name.length)))
      return null;
    if (start == -1) 
      return null;
    var end = document.cookie.indexOf(";", len);
    if (end == -1) 
      end = document.cookie.length;
    return unescape(document.cookie.substring(len, end));
 
// if(document.cookie.search(/ihengine-utilities-session-sid=([^;]*)/) != -1) {
// var c = RegExp.$1;
// return (c != null && c != "") ? c : null;
// }
  };
 
 /*####################### Date Section ###################*/
 ih.getDaysInMonth = function(month, year){
    var days;		
    switch(month)
    {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            days = 31;
            break;
        case 4:
        case 6:
        case 9:
        case 11:
            days = 30;
            break;
        case 2:
            if (((year% 4)==0) && ((year% 100)!=0) || ((year% 400)==0))				
                days = 29;				
            else								
                days = 28;				
            break;
    }
    return (days);
  }
 
})(window.ih = window.ih || {});