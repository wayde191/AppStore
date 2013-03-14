
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/14/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */


ih.defineClass("ih.XMLTester", null, null, function(TESTER, tester) {
               
  tester.prototype.init = function(){
    this.testName = "ih.PackageTester";
    this.value = "wayde";
    this.testXML();
  };
  
  tester.prototype.testXML = function(){
  
    var xml = new ih.XML();
		var objXML = xml.createDOMDocument();
		objXML.onreadystatechange = function(){
			if(this.readystate == 4){
				console.log("Load testXML.xml completed");
				var outputString = '';
				//var keywords = this.getElementsByTagName('contact');
				var keywords = this.documentElement.getElementsByTagName('contact');
				for(var i = 0; i < keywords.length; i++){
					outputString += keywords[i].getAttribute('name') + " : ";
				}
				console.log(outputString);
			}
		};
		objXML.load('./js/Testing/testXML.xml');
		
		//loadXML
		var objX = new ih.XML();
		var objx = objX.createDOMDocument();
		objx.onreadystatechange = function(){
			if(this.readystate == 4){
				console.log('Load XML');
				console.log(this.documentElement.getElementsByTagName('a')[0].textContent);
				//console.log(this.documentElement.getElementsByTagName('a')[0].nodeValue);
			}
		}
		objx.loadXML('<data><a>cool</a></data>');
    
  };

});