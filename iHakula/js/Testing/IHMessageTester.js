
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/14/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */


ih.defineClass("ih.MessageTester", null, null, function(TESTER, tester) {
               
  tester.prototype.init = function(){
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
      
      this.logConsole.push(new ih.HLog("GanttDataModel", "User not logged in, but request data"));
      this.logConsole.push(new ih.HException("GanttDataModelHException", "User not logged in, but request data"));
  };

});