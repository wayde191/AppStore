
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