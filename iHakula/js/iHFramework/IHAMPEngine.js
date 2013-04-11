
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