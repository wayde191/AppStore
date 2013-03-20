
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/14/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */


ih.defineClass("ih.PackageTester", null, null, function(TESTER, tester) {
               
  tester.prototype.init = function(){
    this.testName = "ih.PackageTester";
    this.value = "wayde";
    this.testPackage();
  };
  
  tester.prototype.testPackage = function(){
    
    var cc = new ih.IHInterface('ccTest', ['hh']);
  
    ih.defineClass('test.firstclass', null, null, function(s, p){
      s.h1 = function(){};
      p.prototype.conf = "";
      p.prototype.name = "";
      p.prototype.hh = function(){};
      p.prototype.init = function(a1){
        this.name = a1 + ' wei';
        console.info(this);
      };
    });
    
    var testCase = new test.firstclass('wayde');
    console.log(testCase);
    var testcase2 = new test.firstclass('sun');
    console.log(testcase2);
    
//    ih.defineClass('test.firstclass.case1', test.firstclass, [cc], function(s, p){
//      s.h3 = function(){};
//      p.prototype.h4 = function(){};
//      p.prototype.init = function(a2){
//        this.name2 = a2 + ' wayde'
//        //console.info('hello :', a2);
//      };
//    
//    });
//    
//    var testcase2 = new test.firstclass.case1("sun");
//    console.log(testcase2);
//

  var f = function(){};
  f.prototype.hello = "yes";
  var xx = new f();
  xx.hello = "no";
  console.log(xx);
  
//
//    console.log(testcase2.name);
//    console.log(testcase2.name2);
  };

});