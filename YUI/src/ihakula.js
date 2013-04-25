
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/25/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

// Namespace is www.ihakula => ih

(function(ns){
  
//  Object.prototype.extend = function(sourceObj){
//    for(var f in sourceObj){
//      this[f] = sourceObj[f];
//    }
//    return this;
//  };
 
  var extend = function(targetObj, sourceObj){
    for(var f in sourceObj){
      targetObj[f] = sourceObj[f];
    }
    return targetObj;
  };
  
  Function.prototype.method = function(name, fct){
    this.prototype[name] = fct;
    return this;
  };
  
  // iHObjects
  // $Object, add some more useful methods to original Object
  ns.$Object = {
      clone : function(){
        // Deep clone
        var c = {};
        extend(c, this);
        return c;
      }
  };
  
  ns.$O = function(o){  
    return extend(ns.$Object, o || {});  
  };
  
  // $Array : add some more useful methods to original Array
  ns.$Array = {
    push : function(o){
      this[this.length] = o;
    },
    
    pop : function(){
      --this.length;
    },
    
    each : function(fct){
      for(var i = 0; i < this.length; i++){
        fct(this[i]);
      }
    },
    
    indexOf : function(o){
      for(var i = 0; i < this.length; i++){
        // === means strictly equals, include type and value
        if(this[i] === o){
          return i;
        }
      }
      return -1;
    }, 
    
    contains : function(o){
      return this.indexOf(o) >= 0;
    },
    
    remove : function(o){
      var index = this.indexOf(o);
      if(index >= 0){
        return this.splic(index, 1)[0];
      }
    }, 
    
    find : function(fct){
      for(var i = 0; i < this.length; i++){
        if(fct(this[i])){
          return this[i];
        }
      }
    }
  };
  
  ns.$A = function(a){
    if(a == null){
      a = [];
    }else if(a instanceof Array){
      //Do nothing
    }else{
      a = [a];
    }
    return extend(a, ns.$Array);
  };
  
  // $Function
  ns.$Function = {
 // Bind method has implemented by Native Javascript
//    bind : function(thisObj, argsArr){
//      fct = this;
//      
//      if(argsArr == null || argsArr.length == 0){
//        return ns.$F(function(){
//          return fct.apply(thisObj, arguments);
//        });
//      }else{
//        // when we have agruments
//      }
//    }
  };
  
  ns.$F = function(fct){
    return extend(fct, ns.$Function);
  };
  
  // $Asynchronous
  ns.$Y = function(f){
    return function(){
      var cb = new ns.$AsyncCB(this, arguments);
      var rv = new ns.$MethodRV(cb);
      rv.whenDone(arguments[1]);
      f.apply(this, [cb]);
      return rv;
    };
  };
  
  // $Asynchronous call back
  ns.$AsyncCB = function(thisObj, thisArgs){
    this._thisobj = thisObj;
    this.args = thisArgs;
  };
  
  ns.$AsyncCB
  .method('done', function(rv){//cb.done(rvObj);
    if(this._ondone && typeof(this._ondone) == 'function'){
      this._ondone(rv);
    }
  });
  
  // Method return value
  ns.$MethodRV = function(cb){
    this._cb = cb;
    //Key step, bind RV to the _ondone function, so, when this function called, the scope is RV
    cb._ondone = this._ondone.bind(this);
  };
  
  ns.$MethodRV
  .method('_trigger', function(rv){
    this._rv = rv;
    this._done = true;
  })
  .method('whenDone', function(f){
    this._callbackFct = f;
  })
  .method('_ondone', ns.$F(function(rv){
    this._trigger(rv);
    this._onCallback();
  }))
  .method('_onCallback', function(){
    if(this._done && this._callbackFct && typeof(this._callbackFct) == 'function'){
      this._callbackFct(this._rv);
    }
  });
  
})(window.ih = window.ih || {});

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
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/25/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

// Namespace is www.ihakula => ih

(function(ns){
  
  var extend = function(targetObj, sourceObj){
    for(var f in sourceObj){
      targetObj[f] = sourceObj[f];
    }
    return targetObj;
  };
  
  ns.IHInterface = function(name){
    try{
      if(arguments.length < 2){
        throw 'Interface exception : ' + 'The arguments length is actually more than two, not ' + arguments.length;
      }
      this.name = name;
      this.methods = [];
      
      var len = arguments.length;
      for(var i = 1; i < len; i++){
        var methodArray = arguments[i];
        if(!methodArray instanceof Array){
          throw 'Interface methods : ' + 'The methods group should be an intanceof Array, not ' + typeof(methodArray);
        }else{
          var mlen = methodArray.length;
          for(var j = 0; j < mlen; j++){
            var mname = methodArray[j];
            if(typeof(mname) != 'string'){
              throw 'Method name : ' + 'The typeof method in KInterface should be string';
            }else{
              this.methods.push(mname);
            }
          }
        }
      }
      
    }catch(e){
      console.log(e);
    }
  };
  
  /**
    *@return null
    *@arguments objClass (Function), the class implemented the interface; interfaces (jsk.KInterface), interfaces
    * Make sure the class implemented all the interfaces it includes
    * ih.ensureImplements(Class, [interface1, interface2]);
    */
  ns.ensureImplements = function(objClass, interfaces){
    try{
      if(arguments.length < 2){
        throw 'IHInterface implements : The arguments expected is actually more than two';
      }
      var len = interfaces.length, mlen = 0;
      for(var i = 0; i < len; i++){
        var interfaceObj = interfaces[i];
        if(interfaceObj.constructor != ns.IHInterface){
          throw 'Implements interface : ' + interfaceObj + ' is not an IHInterface';
        }
        mlen = interfaceObj.methods.length;
        for(var j = 0; j < mlen; j++){
          var method = interfaceObj.methods[j];
          if(!objClass[method] || typeof(objClass[method]) != 'function'){
            throw 'Interface method : ' +  method + ' in ' + objClass.__classname +  ' not implemented yet';
          }
        }
      }
    }catch(e){
      console.log(e);
    }
  };
  
  /**
    *@return null
    *@arguments subClass (Function), sub class; superClass (Function), super class
    * Provide a new method which implements extend function
    */
  ns.cextends = function(subClass, superClass){
    var F = function(){}; //An empty function for prototype transfer
    F.prototype = superClass.prototype;//A reference point to superclass
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    
    subClass.prototype.superclass = superClass.prototype;
    if(superClass.prototype.constructor == Object.prototype.constructor){
      //when the super class is Object, make sure the value of superClass.prototype.constructor is not null
      superClass.prototype.constructor = superClass;
    }
  };
  
  /**
    *@return jsk.class (Function)
    *@arguments name (String), class name; superClass (Function), super class; interfaces (jsk.Interface), fct (Function), body;
    * Jsk.Class function
    */
  ns.defineClass = function(name, superclass, interfaces, fct){
    try{
      
      //Check class name is availabe or not
      if(typeof(name) != 'string'){
        throw 'Define class : ' + 'Class name' + name + 'should be typeof stirng, not ' + typeof(name);
      }
      
      //Check function body is available or not
      if(!(fct && fct instanceof Function)){
        throw 'Define class : ' + 'the class' + name + 'function is invalid';
      }else{
      //Check are passed
        var staticObj = {};
        var proObj = {};
        proObj.prototype = {};
        //Get the static method/data and prototype method/data back
        fct(staticObj, proObj);
      }
      
      //Made the class name exists in Dom
      var nameObjArray = name.split('.');
      for(var n = 0; n < nameObjArray.length - 1; n++){
        var m = 0;
        var nameString = '';
        while(m <= n){
          m == n ? nameString += nameObjArray[m] : nameString += nameObjArray[m] + '.';
          m++;
        }
        eval('window.' + nameString + '=' + 'window.' + nameString + '|| {};');
      }

      var c; // Class
      if(superclass == null || superclass == ''){//No super class
        window.__kinit = function(){//Call the init() function as the constructor function
          if(this.init && this.init instanceof Function){
            this.init.apply(this, arguments);
          }
        };
        //Create Class and set it's body as __kinit()
        c = eval(name + '=' + window.__kinit);
        extend(c, staticObj);
        extend(c.prototype, proObj.prototype);
 
      }else{//Extend from super class
        if(!(superclass && superclass instanceof Function)){
          throw 'Define class : ' + 'Superclass ' + superclass + ' is invalid';
        }else{
        //Because super class also has init() method, so, we need to store it temporay
          window.__kinit = function(){
            var t = this.init;
            this.init = this.superclass.init;
            //Call superclass constructor firstly
            this.superclass.constructor.apply(this, arguments);
            //another way ? works fine, it means the constructor is also the part of prototype
            //this.init = this.superclass.constructor; //this will change the prototype of the superclass, not correct
            //this.superclass.constructor.apply(this.superclass, arguments);
            if(t && t instanceof Function){
              this.init = t;
              this.init.apply(this, arguments);
            }
          };
          c = eval(name + '=' + window.__kinit);
          //Extends superclass first, or the prototype will be overwritted
          ns.cextends(c, superclass);
          extend(c, staticObj);
          extend(c.prototype, proObj.prototype);
        }
      }
      
      delete window.__kinit;
      //set class name
      c.prototype.__classname = name;
      
      //Check interface methods are implemented or not
      if(!(interfaces == null || interfaces == '')){
        var _tinstance = new c("__ti");
        ns.ensureImplements(_tinstance, interfaces);
        delete _tinstance;
      }
      
      delete c;
      
    }catch(e){
      console.log(e);
    }
  };
    
  })(window.ih = window.ih || {});
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/28/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

ih.defineClass('ih.XML', null, null, function(XML, xml){
  
  XML.arrMSXMLProgIDs = ["MSXML4.DOMDocument", "MSXML3.DOMDocument", "MSXML2.DOMDocument", "MSXML.DOMDocument", "Microsoft.XmlDom"];
  
  XML.strMSXMLProgID = '';
  XML.blnFailed = false;
  
  xml.prototype.init = function(){
    this.initData();
  };
  
  /**
    *@return Null
    *@arguments Null
    * According to Browser type, overwrite the Dom Document
    */
  xml.prototype.initData = function(){
    var b = ih.browserDetect();
    //IE : Find out the valid MSXML type
    if(b == 'IE'){
      var blnSuccess = false;
      for(var i = 0; i < ih.XML.arrMSXMLProgIDs.length && !blnSuccess; i++){
        try{
          var strMSXML = ih.XML.arrMSXMLProgIDs[i];
          var oDOMDocument = new ActiveXObject(strMSXML);
          ih.XML.strMSXMLProgID = strMSXML;
          blnSuccess = true;
        }catch(oException){
          //Do nothing. We just want to keep on looping. We will check for a Success further down.
        }
      }
      //If there is no MSXML match the requirement, throw KException
      if(!blnSuccess){
        ih.blnFailed = true;
      }
    }else if(b == 'MZ'){
      // It seems that Document has take some measure to protect load function from rewritten
      // Recommend blow by MZ
//      function reqListener () {
//        console.log(this.responseText);
//      };
//       
//      var oReq = new XMLHttpRequest();
//      oReq.onload = reqListener;
//      oReq.open("get", "yourFile.txt", true);
//      oReq.send();
      Document.prototype.__load__ = Document.prototype.load;
      Document.prototype.load = ih.XML._Moz_Document_load;
      
      Document.prototype.loadXML = ih.XML._Moz_Document_loadXML;
      Document.prototype.parseError = 0;
      Document.prototype.readystate = 0;
      Document.prototype.onreadystatechange = null;
      
      Node.prototype.transformNode = ih.XML._Moz_node_transformNode;
      Node.prototype.transformNodeToObject = ih.XML._Moz_node_transformNodeToObject;
      Node.prototype.__defineGetter__('xml', ih.XML._Moz_Node_getXML);
      
    }else if(b == 'CH' ||  b == 'SF' ){
      //Because on Chrome, I use this object as Document 
      this.load = ih.XML._Chrome_Document_load;
      Document.prototype.load = ih.XML._Chrome_Document_load;
      this.loadXML = ih.XML._Chrome_Document_loadXML;
      Document.prototype.loadXML = ih.XML._Chrome_Document_loadXML;
      Document.prototype.parseError = 0;
      Document.prototype.readystate = 0;
      Document.prototype.onreadystatechange = null;
    }else{
      ih.blnFailed = true;
    }
  };
  
  //Chrome setting
  /**
    *@return Null
    *@arguments strURL (String) : the address of xml file
    * use XMLHttpRequest to get file loaded
    */
  XML._Chrome_Document_load = function(strURL){
    try{
      var xmlhttp = new window.XMLHttpRequest();
      xmlhttp.open('GET', strURL, false);
      xmlhttp.send(null);
      var oDOMDocument = xmlhttp.responseXML;
      if(this.onreadystatechange && typeof this.onreadystatechange == 'function'){
        oDOMDocument.onreadystatechange = this.onreadystatechange;
      }
      oDOMDocument.parseError = 0;
    }catch(e){
      this.parseError = -1;
    }
    XML.updateReadyState(oDOMDocument, 4);  
  };
  
  /**
    *@return Null
    *@arguments strXML (String) : the xml body content
    * Load a string and parse as XML Dom
    */
  XML._Chrome_Document_loadXML = function(strXML){
    try{
      var xmlParser = new DOMParser();
      var oDOMDocument = xmlParser.parseFromString(strXML, "text/xml");

      if(this.onreadystatechange && typeof this.onreadystatechange == 'function'){
        oDOMDocument.onreadystatechange = this.onreadystatechange;
      }
      oDOMDocument.parseError = 0;
    }catch(e){
      this.parseError = -1;
    }
    XML.fireOnLoad(oDOMDocument);
  };
  
  //Mozilla Setting
  XML._Moz_Node_getXML = function(){
  //Use XMLExtras XMLSerializer to return a the serialzide contents of 'this' node.
    return (new XMLSerializer()).serializeToString(this);
  };
  
  /**
    *@return Null
    *@arguments strURL (String) : the xml file address
    * Encapsulate Mozilla Document load function 
    * LOADING : LOADED : INTERACTIVE : COMPLETED
    * 1 : Indicates that the loading process has started and the data is being retrieved.
    * 2 : Indicates that the data has been retrieved and that the parser is parsing the XML document. At this point, the object model is not available.
    * 3 : Indicates that some data has been parsed, and the object model is available on a partial data set. At this stage, the object model is read-only.
    * 4 : Indicates that the loading process is finished. Doesn��t indicate whether the document was successfully loaded. 
    */
  XML._Moz_Document_load = function(strURL){//not called, it seems that we have no right to overwrite the load function of Dom
    XML.updateReadyState(this, 1);
    try{
      this.__load__(strURL);
    }catch(e){
      this.parseError = -1;
    }
    XML.updateReadyState(this, 4);
  };
  
  /**
    *@return Null
    *@arguments strXML (String) : the xml body content
    * Load a string and parse as XML Dom
    */
  XML._Moz_Document_loadXML = function(strXML){

    XML.updateReadyState(this, 1);
    var oDOMParser = new DOMParser();
    var oDOM = oDOMParser.parseFromString(strXML, 'text/xml');
    
    while(this.hasChildNodes()){
      this.removeChild(this.lastChild);
    }
    
    for(var i = 0; i < oDOM.childNodes.length; i++){
      var oImportNode = this.importNode(oDOM.childNodes[i], true);
      this.appendChild(oImportNode);
    }

    XML.fireOnLoad(this);
  };
  
  XML.document_onload = function(){
    ih.XML.fireOnLoad(this);
  };
  
  /**
    *@return Null
    *@arguments oDOMDocument (Document) : the Document instance
    * check after load, the resource is loaded correct or not, if is, update this.readystate to 4, which means 'complete'
    */
  XML.fireOnLoad = function(oDOMDocument){
    if(!oDOMDocument.documentElement || oDOMDocument.documentElement.tagName == 'parsererror'){
      oDOMDocument.parseError = -1;
    }
    XML.updateReadyState(oDOMDocument, 4);
  };
  
  /**
    *@return Null
    *@arguments oDOMDocument (Document) : the Document instance; readystate (Number) : represent the state of the xml loading state
    * update the readystate to latest version
    */
  XML.updateReadyState = function(oDOMDocument, readystate){
    oDOMDocument.readystate = readystate;
    if(oDOMDocument.onreadystatechange && typeof(oDOMDocument.onreadystatechange) == 'function'){
      oDOMDocument.onreadystatechange();
    }
  };
  
  XML._Moz_node_transformNode = function(oStylesheetDOM){
    var oXSLTProcessor = new XSLTProcessor();
    var oOutDom = document.implementation.createDocument('', '', null);
    oXSLTProcessor.transformDocument(this, oStylesheetDOM, oOutDom, null);
    return (new XMLSerializer()).serializeToString(oOutDom);
  };
  
  XML._Moz_node_transformNodeToObject = function(oStylesheetDOM, oOutputDom){
    var oXSLTProcessor = new XSLTProcessor();
    oXSLTProcessor.transformDocument(this, oStylesheetDOM, oOutputDom, null);
    XML.updateReadyState(oOutputDom, 4);
    return 1;
  };
  
  /**
    *@return oDOMDocument (Document)
    *@arguments null
    * According to browser type, create a instance of Document
    */
  xml.prototype.createDOMDocument = function(){
    var oDOMDocument = null;
    var b = ih.browserDetect();
    if(b == 'IE'){
      oDOMDocument = new ActiveXObject(ih.XML.strMSXMLProgID);
      oDOMDocument.preservWhiteSpace = true;
    }else if(b == 'MZ'){
      oDOMDocument = document.implementation.createDocument('', '', null);
      ih.addEvent(oDOMDocument, 'load', ih.XML.document_onload);
    }else if(b == 'CH' ||  b == 'SF'){
      oDOMDocument = this;
    }
    return oDOMDocument;
  };
  
});
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/14/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

  ih.defineClass('ih.Scroll', null, null, function(S, s){
  
    s.prototype.steepLength = 100;
    
    /**
      *@return Null
      *@arguments ele (String) : the string id of the element
      * Initializtion the whole element, and count the scrollLeft and scrollTop
      */
    s.prototype.init = function(ele){
      this.element = document.getElementById(ele);
      this.scrollLeft = this.element.scrollLeft;
      this.scrollTop = this.element.scrollTop;
    };
    
    /**
      *@return Null
      *@arguments ele (String) : the string id of the element to move to; time (Integer) : the time to reach to target element
      * Move to target element by using 'time';
      * @1 : Get the target offset
      * @2 : use sqrt(pow(x, 2) + pow(y, 2)) get distance
      * @3 : get xDis and yDis first, then use format s = 0.5 * Accelerate * pow(time, 2) to count out x and y accelerate
      */
    s.prototype.toElement = function(ele, time){
      this._time = time / this.steepLength;
      this.target = document.getElementById(ele);
      this.offsetObj = ih.browserDetect() == "IE" ? this.getOffset(this.target) : { left: this.target.offsetLeft, top: this.target.offsetTop };//@1
      this.distance = Math.sqrt(Math.pow(this.offsetObj.left - this.scrollLeft, 2) + Math.pow(this.offsetObj.top - this.scrollTop, 2));//@2
      if(this.distance == 0){
        return;
      }else{//@3
        this.xDistance = this.offsetObj.left - this.scrollLeft;
        this.yDistance = this.offsetObj.top - this.scrollTop;
        this.xAccelerate = (2 * this.xDistance)/Math.pow(time/1000, 2);
        this.yAccelerate = (2 * this.yDistance)/Math.pow(time/1000, 2);
        this._keepMoving();
      }
    };
    
    /**
      *@return Null
      *@arguments left (Number) : the scroll left of init object; top (Number) : the scroll top of the init object
      * Change the scroll value to make the screen looks like scroll
      */
    s.prototype.scrollTo = function(left, top){
      this.element.scrollLeft = left;
      this.element.scrollTop = top;
      //console.log(left + " : " + top);
    };
    
    /**
      *@return Null
      *@arguments Null
      * Implement the function which makes element move to target position
      * @1 : if use this.steepLength times to get to target position
      * @2 : use 0.5 * a * pow(t, 2) to count out distance went, and add the initialize postion to get the now position
      */
    s.prototype._keepMoving = function(){
      this.startTime = 0;
      this._invokeFct = ih.$F(function invokeFct(){
        if(this instanceof ih.Scroll){
          this.startTime += this._time;
          if(this.startTime == this._time * this.steepLength){//@1
            this.scrollTo(this.offsetObj.left, this.offsetObj.top);
            this.scrollLeft = this.offsetObj.left;
            this.scrollTop = this.offsetObj.top;
            clearInterval(_interval);
          }else{//@2
            var l = this.scrollLeft + 0.5 * this.xAccelerate * Math.pow(this.startTime/1000, 2);
            var t = this.scrollTop + 0.5 * this.yAccelerate * Math.pow(this.startTime/1000, 2);
            this.scrollTo(l, t);
          }
        }
      }).bind(this);
      _interval = setInterval(this._invokeFct, this._time);
    };
    
    /**
      *@return Object, with left and top value
      *@arguments objElement (Element) : the target Element
      * Under IE, the scroll value is different from other browsers, which means scroll to parent element, but body
      */
    s.prototype.getOffset = function(objElement) {
      var offsetleft = objElement.offsetLeft;
      var offsettop = objElement.offsetTop;
      while (objElement.offsetParent != document.body) {
        objElement = objElement.offsetParent;
        offsetleft += objElement.offsetLeft;
        offsettop += objElement.offsetTop;
      }
      offsetleft += document.body.offsetLeft;
      offsettop += document.body.offsetTop;
      return { left: offsetleft, top: offsettop };
    };
    
  });
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/28/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */
  
  ih.defineClass("ih.PubSub", null, null, function(smethod, pmethod){
    
    pmethod.prototype.init = function(){
      this.msgBox = ih.$A();
    };
    
    pmethod.prototype.subscribe = function(stringSubject, objTarget, fctMehod){
      var list = this.msgBox[stringSubject];
      if(!list){
        this.msgBox[stringSubject] = [[objTarget, fctMehod]];
      }else{
        list[list.length] = [objTarget, fctMehod];
      }
    };
    
    pmethod.prototype.unsubscribe = function(stringSubject, objTarget){
      var list = this.msgBox[stringSubject];
      if(!list){
        return;
      }else{
        for(var i = 0; i < list.length; i++){
          if(list[i][0] == objTarget){
            list.splice(i, 1);
            return;
          }
        }
      }
    };
    
    pmethod.prototype.publish = function(stringSubject, objEvent){
      var list = this.msgBox[stringSubject];
      if(!list){
        return;
      }else{
        for(var i = 0; i < list.length; i++){
          list[i][1].apply(list[i][0], [objEvent]);
        }
      }
    };
    
  });
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/26/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

// Namespace is www.ihakula => ih

  (function(ih){
    ih.HException = function(comment, message){
      this.isHException = true;
      this.comment = comment;
      this.message = message;
    };
    
    ih.HLog = function(comment, message){
      this.isHLog = true;
      this.comment = comment;
      this.message = message;
    };
    
    ih.defineClass("ih.Message", null, null, function(smethod, pmethod){
      
      pmethod.prototype.init = function(nameStr){
        this.name = nameStr;
        this.on = false;
        this.msgArray = new ih.$A();
        this.windowInstance = null;
      };
      
      pmethod.prototype.push = function(msgObject){
        this.msgArray.push(msgObject);
      };
      
      pmethod.prototype.pop = function(){
        this.msgArray.pop();
      };
      
      pmethod.prototype.close = function(){
        if(!this.on){
          return;
        }
        if(!this.windowInstance.closed){
          this.windowInstance.close();
        }
        this.windowInstance = null;
      };
      
      pmethod.prototype.open = function(){
        if(this.windowInstance && !this.windowInstance.closed){
          this.close();
        }
        this.windowInstance = window.open('about:blank', 'default', 'height=400, width=600, resizable=yes, scrollbars=yes, top=100, left=200');
        //this.windowInstance.document.title = this.name;
        this.windowInstance.document.write('<html><head><title>' + this.name + '</title><style type="text/css">' + this.style + '</style></head><body><div id="content"></body></html>');
        this.windowInstance.document.close();
        this.windowInstance.focus();
      };
      
      pmethod.prototype.setMsgStyle = function(commentColor, messageColor){
        var ccolor = commentColor || '#8A2BE2';
        var mcolor = messageColor || '#000000';
        this.style = 'p {color:' + ccolor + ';}' + 'span {color:' + mcolor + ';}';
      };
      
      pmethod.prototype.showMessage = function(){
        if(this.windowInstance && !this.windowInstance.closed){
          this.close();
        }
        this.open();
        var w = this.windowInstance;
        this.msgArray.each(ih.$F(function(msgObj){
          var divContent = w.document.getElementById('content');
          var pObj = w.document.createElement('p');
          pObj.appendChild(w.document.createTextNode(msgObj.comment + ' : '));
          var spanObj = w.document.createElement('span');
          spanObj.appendChild(w.document.createTextNode(msgObj.message));
          pObj.appendChild(spanObj);
          divContent.appendChild(pObj);
        }).bind(w));
      };
      
    });

  })(window.ih = window.ih || {});
  
  
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/26/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

 ih.defineClass("ih.KeyMap", null, null, function(smethod, pmethod){
   
   var keyCodeToFunctionKey = {
       8:"backspace", 9:"tab", 13:"return", 19:"pause", 27:"escape", 32:"space",
       33:"pageup", 34:"pagedown", 35:"end", 36:"home", 37:"left", 38:"up",
       39:"right", 40:"down", 44:"printscreen", 45:"insert", 46:"delete",
       112:"f1", 113:"f2", 114:"f3", 115:"f4", 116:"f5", 117:"f6", 118:"f7",
       119:"f8", 120:"f9", 121:"f10", 122:"f11", 123:"f12",
       144:"numlock", 145:"scrolllock"  
   };
   
   var keyCodeToPrintableChar = {
       48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8",
       57:"9", 59:";", 61:"=", 65:"a", 66:"b", 67:"c", 68:"d",
       69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l", 77:"m",
       78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v",
       87:"w", 88:"x", 89:"y", 90:"z", 107:"+", 109:"-", 110:".", 188:",",
       190:".", 191:"/", 192:"'", 219:"[", 220:"\\", 221:"]", 222:"\""  
   };
   
   
   pmethod.prototype.init = function(bindings){
     this.map = {
       'default' : function(){}
     };
     
     if(bindings){
       for(name in bindings){
         this.map[name.toLowerCase()] = bindings[name];
       }
     }
   };
   
   pmethod.prototype.install = function(element){ //Install the function to keyboard event
     var keymap = this;
     
     function handler(event){
       return keymap.dispatch(event);
     }
     
     ih.addEvent(element, 'keydown', handler);
     ih.addEvent(element, 'keypress', handler);
   };
   
   pmethod.prototype.dispatch = function(event){ //Dispatch the event keyboard published
     var e = event || window.event;
     var modifiers = '';
     var keyname = null;
     if(e.type == 'keydown'){
       var code = e.keyCode;
       //keycode 16 = Shift_L
       //keycode 17 = Control_L
       //keycode 18 = Alt_L
       if(code == 16 || code == 17 || code == 18){
         return;
       }
       keyname = keyCodeToFunctionKey[code];
       if(!keyname && (e.altKey || e.ctrlKey)){
         keyname = keyCodeToPrintableChar[code];
       }
       if(keyname){
         if(e.ctrlKey) modifiers += 'ctrl_';
         if(e.altKey) modifiers += 'alt_';
         if(e.shiftKey) modifiers += 'shift_';
       }
       else return;
     }else if(e.type == 'keypress'){
       if(e.altKey || e.ctrlKey){
         return;
       }
       if(e.charCode != undefined && e.charCode == 0){
         return;
       }
       var code = e.charCode || e.keyCode;
       keyname = String.fromCharCode(code);
       var lowercase = keyname.toLowerCase();
       if(keyname != lowercase){
         keyname = lowercase;
         modifies = 'shift_';
       }
     }
     
     //Build the modifiers to ctrl_alt_l or something like it
     var fct = this.map[modifiers + keyname];
     if(!fct){
       fct = this.map['default'];
     }else{
       var target = e.target;
       if(!target){
         target = e.srcElement;
       }
       //callback function called with three arguments
       fct(target, modifiers + keyname, e);
       
       //Cancel default event
       /* if(e.stopPropagation) e.stopPropagation();
       else e.cancelBubble = true;
       if(e.preventDefault) e.preventDefault();
       else e.returnValue = false; */
       return false;
     }
   };
   
 });
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 17/7/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

ih.defineClass("ih.User", null, null, function(USER, user){
    
    user.prototype.init = function(){
        this.id = ih.getcookie("ihengine-utilities-session-sid");
        this.name = ih.getcookie("ihengine-utilities-session-uname");
    };
    
    user.prototype.isLogin = function(){
        if(this.id){
            return true;
        }
        return false;
    };
    
    user.prototype.setUserInfo = function(user){
        this.id = user.id;
        this.name = user.email;
        ih.setcookie("ihengine-utilities-session-sid", this.id);
        ih.setcookie("ihengine-utilities-session-uname", this.name);
    };
    
    user.prototype.logout = function(){
        this.id = null;
        this.name = null;
        ih.setcookie("ihengine-utilities-session-sid", "", -1);
        ih.setcookie("ihengine-utilities-session-uname", "", -1);
    }
});
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
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 1/8/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

ih.defineClass("ih.Gantt", null, null, function(GANTT, gantt){
    
    gantt.prototype.init = function(divObj){
        this._taskList = [];
        this._ganttDiv = divObj;
        this._firstRowStr = "<table border=1 style='border-collapse:collapse'><tr><td rowspan='2' width='300px' style='width:300px;'><div class='GTaskTitle' style='width:300px;'>Task</div></td>";
        this._thirdRow = "";
        this._gStr = "";
        this._maxDate = new Date();
        this._minDate = new Date();
        this._dTemp = new Date();
        this._colSpan = 0;
        this.counter = 0;
    };
    
    //this.addTaskDetail(new this.task('2013-01-10', '2013-01-20', '<b>1：修改1、2、4、5、6、8、9、13、15、16、22</b>', '<b>陆国宁</b>', 0));
    gantt.prototype.addTaskDetail = function(task){
        this._taskList.push(task);
    };
    
    gantt.prototype.task = function(from, to, task, resource, progress)
	{
		var _from = new Date();	
		var _to = new Date();
		var _task = '<b>' + task + '</b>';
		var _resource = '<b>' + resource + '</b>';						
		var _progress = progress;
		var dvArr = from.split('-');
		_from.setFullYear(parseInt(dvArr[0], 10), parseInt(dvArr[1], 10) - 1, parseInt(dvArr[2], 10));
		dvArr = to.split('-');
		_to.setFullYear(parseInt(dvArr[0], 10), parseInt(dvArr[1], 10) - 1, parseInt(dvArr[2], 10));
		
		this.getFrom = function(){ return _from};
		this.getTo = function(){ return _to};
		this.getTask = function(){ return _task};
		this.getResource = function(){ return _resource};
		this.getProgress = function(){ return _progress};
	}
    
    gantt.prototype.getProgressDiv = function(progress){
		return "<div class='GProgress' style='width:" + progress + "%; overflow:hidden'></div>"
	}
    
    gantt.prototype.setMinMaxDate = function(){
    
        this._maxDate.setFullYear(this._taskList[0].getTo().getFullYear(), this._taskList[0].getTo().getMonth(), this._taskList[0].getTo().getDate());
        this._minDate.setFullYear(this._taskList[0].getFrom().getFullYear(), this._taskList[0].getFrom().getMonth(), this._taskList[0].getFrom().getDate());
        
        for(i = 0; i < this._taskList.length; i++)
        {
            if(Date.parse(this._taskList[i].getFrom()) < Date.parse(this._minDate))
                this._minDate.setFullYear(this._taskList[i].getFrom().getFullYear(), this._taskList[i].getFrom().getMonth(), this._taskList[i].getFrom().getDate());
            if(Date.parse(this._taskList[i].getTo()) > Date.parse(this._maxDate))
                this._maxDate.setFullYear(this._taskList[i].getTo().getFullYear(), this._taskList[i].getTo().getMonth(), this._taskList[i].getTo().getDate());						
        }
        
        //---- Fix this._maxDate value for better displaying-----
        // Add at least 5 days
        
        if(this._maxDate.getMonth() == 11) //December
        {
            if(this._maxDate.getDay() + 5 > ih.getDaysInMonth(this._maxDate.getMonth() + 1, this._maxDate.getFullYear()))
                this._maxDate.setFullYear(this._maxDate.getFullYear() + 1, 1, 5); //The fifth day of next month will be used
            else
                this._maxDate.setFullYear(this._maxDate.getFullYear(), this._maxDate.getMonth(), this._maxDate.getDate() + 5); //The fifth day of next month will be used
        }
        else
        {
            if(this._maxDate.getDay() + 5 > ih.getDaysInMonth(this._maxDate.getMonth() + 1, this._maxDate.getFullYear()))
                this._maxDate.setFullYear(this._maxDate.getFullYear(), this._maxDate.getMonth() + 1, 5); //The fifth day of next month will be used
            else
                this._maxDate.setFullYear(this._maxDate.getFullYear(), this._maxDate.getMonth(), this._maxDate.getDate() + 5); //The fifth day of next month will be used
        }
    }
    
    gantt.prototype.drawThirdRow = function(){
        var _currentDate = new Date();
        _currentDate.setFullYear(_currentDate.getFullYear(), _currentDate.getMonth(), _currentDate.getDate());
        _currentDate.setHours(0);
        _currentDate.setMinutes(0);
        _currentDate.setSeconds(0);
        
        var tmpDate = new Date();
        tmpDate.setFullYear(this._dTemp.getFullYear(), this._dTemp.getMonth(), this._dTemp.getDate());
        tmpDate.setHours(0);
        tmpDate.setMinutes(0);
        tmpDate.setSeconds(0);
        
        //Weekend
        if(tmpDate.getDay() % 6 == 0) {
            this._gStr += "<td class='GWeekend'><div style='width:24px;'>" + tmpDate.getDate() + "</div></td>";
            if(Date.parse(tmpDate) == Date.parse(_currentDate))
                this._thirdRow += "<td id='GC_" + (this.counter++) + "' class='GToday' style='height:" + (this._taskList.length * 21) + "px'>&nbsp;</td>";
            else
                this._thirdRow += "<td id='GC_" + (this.counter++) + "' class='GWeekend' style='height:" + (this._taskList.length * 21) + "px'>&nbsp;</td>";
        } else {
            this._gStr += "<td class='GDay'><div style='width:24px;'>" + tmpDate.getDate() + "</div></td>";
            if(Date.parse(tmpDate) == Date.parse(_currentDate))
                this._thirdRow += "<td id='GC_" + (this.counter++) + "' class='GToday' style='height:" + (this._taskList.length * 21) + "px'>&nbsp;</td>";
            else
                this._thirdRow += "<td id='GC_" + (this.counter++) + "' class='GDay'>&nbsp;</td>";
        }
    };
    
    gantt.prototype.drawFirstRow = function(){
        
        if(this._dTemp.getDate() < ih.getDaysInMonth(this._dTemp.getMonth() + 1, this._dTemp.getFullYear()))
        {
            if(Date.parse(this._dTemp) == Date.parse(this._maxDate))
            {							
                this._firstRowStr += "<td class='GMonth' colspan='" + (this._colSpan + 1) + "'>T" + (this._dTemp.getMonth() + 1) + "/" + this._dTemp.getFullYear() + "</td>";							
            }
            this._dTemp.setDate(this._dTemp.getDate() + 1);
            this._colSpan++;
        }					
        else 
        {
            this._firstRowStr += "<td class='GMonth' colspan='" + (this._colSpan + 1) + "'>T" + (this._dTemp.getMonth() + 1) + "/" + this._dTemp.getFullYear() + "</td>";
            this._colSpan = 0;
            if(this._dTemp.getMonth() == 11) //December
            {
                this._dTemp.setFullYear(this._dTemp.getFullYear() + 1, 0, 1);
            }
            else
            {
                this._dTemp.setFullYear(this._dTemp.getFullYear(), this._dTemp.getMonth() + 1, 1);
            }
        }
    };
    
    gantt.prototype.drawTasks = function(){
        var _offSet = 0;
        var _dateDiff = 0;
        
        for(i = 0; i < this._taskList.length; i++) {
            _offSet = (Date.parse(this._taskList[i].getFrom()) - Date.parse(this._minDate)) / (24 * 60 * 60 * 1000);
            _dateDiff = (Date.parse(this._taskList[i].getTo()) - Date.parse(this._taskList[i].getFrom())) / (24 * 60 * 60 * 1000) + 1;
               
            this._gStr += "<div style='position:absolute; top:" + (20 * (i + 2) + 8) + "px; left:" + (_offSet * 25 + 302) + "px; width:" + (25 * _dateDiff + 100) + "px'><div title='" + this._taskList[i].getTask() + "' class='GTask' style='float:left; width:" + (25 * _dateDiff - 1) + "px;'>" + this.getProgressDiv(this._taskList[i].getProgress()) + "</div><div style='float:left; padding-left:3px'>" + this._taskList[i].getResource() + "</div></div>";
            this._gStr += "<div style='position:absolute; top:" + (20 * (i + 2) + 1) + "px; left:5px'>" + this._taskList[i].getTask() + "</div>";
        }
    };
    
    gantt.prototype.draw = function() {
        if(this._taskList.length > 0) {
            this.setMinMaxDate();
            
            this._gStr = "";
            this._gStr += "</tr><tr>";
            this._thirdRow = "<tr><td>&nbsp;</td>";
            
            this._dTemp.setFullYear(this._minDate.getFullYear(), this._minDate.getMonth(), this._minDate.getDate());
            while(Date.parse(this._dTemp) <= Date.parse(this._maxDate)){
                this.drawThirdRow();
                this.drawFirstRow();
            }
            
            this._thirdRow += "</tr>"; 				
            this._gStr += "</tr>" + this._thirdRow;
            this._gStr += "</table>";
            this._gStr = this._firstRowStr + this._gStr;
            
            this.drawTasks();
            this._ganttDiv.innerHTML = this._gStr;
        }
    }
    
    
    
});
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/16/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */
  
  ih.defineClass("ih.AMPPlugin", null, null, function(PLUGIN, plugin){
    
    plugin.prototype.id = null;
    plugin.prototype.confXmlPath = "";
    plugin.prototype.parentId = null;
    plugin.prototype.lazyLoad = true;
    plugin.prototype.scriptsLoaded = false;
    
    plugin.prototype.init = function(pluginPath){
      this.childs = new ih.$A();
      this.scripts = new ih.$A();
      this.confXmlPath = pluginPath + "plugin.xml";
      this.initFromConfXMLFile();
    };
    
    plugin.prototype.initFromConfXMLFile = function(){
      var me = this;
      
      var xml = new ih.XML();
      var objXML = xml.createDOMDocument();
      objXML.onreadystatechange = function(){
        if(this.readystate == 4){
          
          // Get scripts
          var scriptNodes = this.documentElement.getElementsByTagName('script')
          for(var i = 0; i < scriptNodes.length; i++) {
            me.scripts.push(scriptNodes[i].getAttribute("path"));
          }
          
          var infoNode = this.documentElement.getElementsByTagName('info')[0];
          me.id = infoNode.getAttribute("id");
          me.parentId = infoNode.getAttribute("parentId");
          if(infoNode.getAttribute("lazyLoad") == "false"){
            me.lazyLoad = false;
            me.loadScripts();
          }
          
          var childNodes = this.documentElement.getElementsByTagName('child');
          for(var i = 0; i < childNodes.length; i++) {
            var aampPlugin = new ih.AMPPlugin(childNodes[i].firstChild.nodeValue);
            me.childs.push(aampPlugin);
          }          
        }
      };
      objXML.load(this.confXmlPath);
    };
    
    plugin.prototype.loadScripts = function(){
      if(this.scriptsLoaded) {
        return;
      }
      
      var me = this;
      var j = 0;
      
      var tempF = function(scriptPath){
        ih.loadScript(scriptPath, ih.$F(function(rv){
            if(rv.statu = "ok"){
              j++;
              if(j == this.scripts.length){
                this.scriptsLoaded = true;
                var pluginClassName = this.id + 'Plugin';
                this.pluginAnchor = eval(pluginClassName + '= new ' + pluginClassName + '();');
                this.pluginAnchor.plugin = this;
                if(typeof(this.pluginAnchor.scriptsLoaded) == 'function'){
                  this.pluginAnchor.scriptsLoaded();
                }
              }
            }
          }).bind(me));
      };
      
      this.scripts.each(tempF);
    };
    
    plugin.prototype.findChildPluginById = function(id){
      var me = this;
      
      for(var i = 0; i < this.childs.length; i++) {
        var plg = this.childs[i];
        if(plg.id == id) {
          return plg;
        }
        
        if(plg.childs.length){
          return plg.findChildPluginById(id);
        }
      }
    };
    
  });
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/16/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */
  
  ih.defineClass("ih.AMPEngine", null, null, function(ENG, eng){
    
    eng.prototype.name = "ihakula.ampEngine";
    eng.prototype.version = "1.0";
    eng.prototype.root = null;
    
    eng.prototype.init = function(confXMLPath){
      ih.plugins = {};
      this.initFromConfXMLFile(confXMLPath);
      this.pubsub = new ih.PubSub();
    };
    
    eng.prototype.initFromConfXMLFile = function(confXMLPath) {
      var me = this;
      
      var xml = new ih.XML();
      var objXML = xml.createDOMDocument();
      objXML.onreadystatechange = function(){
        if(this.readystate == 4){
          
          var plugins = this.documentElement.getElementsByTagName('plugin');
          var root = plugins[0];
          me.root = new ih.AMPPlugin(root.getAttribute("path"));
        }
      };
      objXML.load(confXMLPath);
      
    };
    
  });