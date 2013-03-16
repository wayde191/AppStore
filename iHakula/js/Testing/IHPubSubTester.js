
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/14/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */


ih.defineClass("ih.PubSubTester", null, null, function(TESTER, tester) {
               
  tester.prototype.init = function(){
    var ps = new ih.PubSub();
    
    this.viewDidLoad = function(){
      console.log("viewdidload");
    };
    
    ps.subscribe("packageDidLoad", this, this.viewDidLoad);
    ps.publish("packageDidLoad");
  };

});


