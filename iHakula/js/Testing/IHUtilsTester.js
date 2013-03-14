
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/14/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

ih.defineClass("ih.UtilsTester", null, null, function(TESTER, tester) {
  
  tester.prototype.init = function(){
    this.testName = "ih.UtilsTester";
    this.value = "wayde";
//    this.testAddEvent();
    this.testBrowserDetect();
    this.testLoadScript();
    this.testCookie();
    this.testDayInMonth();
  };
  
  tester.prototype.testAddEvent = function(){
  // should add code below before script load in html
  // <button id="testButton" type="button">Click Me!</button>
    var button = document.getElementById("testButton");
    var f = function(){
      console.log("button clicked");
    };
    ih.addEvent(button, "click", f);
  };
  
  tester.prototype.testBrowserDetect = function(){
    console.log(ih.browserDetect());
  };
  
  tester.prototype.testLoadScript = function(){
    var me = this;
    ih.loadScript("./js/iHFramework/IHBlock.js", ih.$F(function(rv){
      if(rv.statu == "ok") {
        console.log(this.testName + "testLoadScript passed.");
      }
    }).bind(me));
  };
  
  tester.prototype.testCookie = function(){
    // Not support local file read/write cookie
    ih.setcookie("testCookie", "hello cookie");
    var cookie = ih.getcookie("testCookie");
    if(cookie == "hello cookie") {
      console.log(this.testName + " testCookie passed.");
    } else {
      console.log(this.testName + " testCookie failed!!!!!!");
    }
  };
  
  tester.prototype.testDayInMonth = function(){
    console.log(ih.getDaysInMonth(3, 2013));
  };


});