
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/13/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

ih.defineClass("ih.ObjectTester", null, null, function(TESTER, tester) {
  
  tester.prototype.init = function(){
    this.testName = "ih.ObjectTester";
    this.value = "wayde";
    this.testF();
    this.testY();
  };
  
  tester.prototype.testF = function(){
    var me = this;
    var f = ih.$F(function(){
      if(this.value == "wayde") {
        console.log(this.testName + "testF passed");
      }
    }).bind(me);
    
    f();
  };
   
  tester.prototype.testY = function(user){
    var me = this;
    var yTest = ih.$Y(ih.$F(function(cb){
      console.log(cb.args[0]);
			cb.done({name : 'cb.done'});
			console.log(this.vt);
		}).bind(me));
    
		yTest("firstPara", ih.$F(function(rv){
      this.vt = "value";
      if(rv.name == "cb.done"){
        console.log(this.testName + "testY passed");
      }
		}).bind(me));
  };

});