
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/16/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */


ih.defineClass("ih.AMPEngineTester", null, null, function(TESTER, tester) {
               
  tester.prototype.init = function(){
    ih.ampE = new ih.AMPEngine("./js/Plugins/ampConf.xml");
    
    var f = function(){
      console.log(ih.ampE.root);
    };
        
  };

});