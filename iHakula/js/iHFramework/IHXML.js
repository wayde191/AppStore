
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
    * 4 : Indicates that the loading process is finished. Doesn¡¯t indicate whether the document was successfully loaded. 
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