
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/29/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

(function(ih){
  
  ih.defineClass("ih.Engine", null, null, function(ENG, eng){
    
    eng.prototype.init = function(){
      this.exceptionConsole = null;
      this.logConsole = null;
      this.pubsub = new ih.PubSub();
      this.serv = new ih.Service();
    };
    
    eng.prototype.loadPackageWithXML = function(xmlPath){
      var me = this;
      this.serv.service().loadXML(xmlPath, function(objXML){
        var nodelist = objXML.documentElement.getElementsByTagName('script');
        var j = 0;
        for(var i = 0; i < nodelist.length; i++){
          ih.loadScript(nodelist[i].getAttribute('path'), ih.$F(function(rv){
            if(rv.statu = "ok"){
              j++;
              if(j == nodelist.length){
                this.pubsub.publish("packageDidLoad");
              }
            }
          }).bind(me));
        }
      });
      
//      var xml = new ih.XML();
//      var objXML = xml.createDOMDocument();
//      var me = this;
//      objXML.onreadystatechange = function(){
//        if(this.readystate == 4){
//          var nodelist = this.documentElement.getElementsByTagName('script');
//          var j = 0;
//          for(var i = 0; i < nodelist.length; i++){
//            ih.loadScript(nodelist[i].getAttribute('path'), ih.$F(function(rv){
//              if(rv.statu = "ok"){
//                j++;
//                if(j == nodelist.length){
//                  this.pubsub.publish("packageDidLoad");
//                }
//              }
//            }).bind(me));
//          }
//        }
//      };
//      objXML.load(xmlPath);
    };
    
    eng.prototype.installMessageConsoles = function(){
      this.exceptionConsole = new ih.Message('iHakula Exception Console');
      this.logConsole = new ih.Message('iHakula Log Console');
      
      var econsole = ih.$F(function(){
        this.exceptionConsole.setMsgStyle();
        this.exceptionConsole.showMessage();
      }).bind(this);
      
      var lconsole = ih.$F(function(){
        this.logConsole.setMsgStyle();
        this.logConsole.showMessage();
      }).bind(this);
      
      var keybandings = {
        ctrl_alt_e : econsole,
        ctrl_alt_l : lconsole
      };
      
      //Initialization the Message of iHakula
      var keymap = new ih.KeyMap(keybandings);
      keymap.install(window);
    };
  });
  
})(window.ih = window.ih || {});