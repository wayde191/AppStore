
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/25/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

// Namespace is www.ihakula => ih

(function(ns){
  
  var extend = function(targetObj, sourceObj){
    for(var f in sourceObj){
      targetObj[f] = sourceObj[f];
    }
    return targetObj;
  };
  
  ns.IHInterface = function(name){
    try{
      if(arguments.length < 2){
        throw 'Interface exception : ' + 'The arguments length is actually more than two, not ' + arguments.length;
      }
      this.name = name;
      this.methods = [];
      
      var len = arguments.length;
      for(var i = 1; i < len; i++){
        var methodArray = arguments[i];
        if(!methodArray instanceof Array){
          throw 'Interface methods : ' + 'The methods group should be an intanceof Array, not ' + typeof(methodArray);
        }else{
          var mlen = methodArray.length;
          for(var j = 0; j < mlen; j++){
            var mname = methodArray[j];
            if(typeof(mname) != 'string'){
              throw 'Method name : ' + 'The typeof method in KInterface should be string';
            }else{
              this.methods.push(mname);
            }
          }
        }
      }
      
    }catch(e){
      console.log(e);
    }
  };
  
  /**
    *@return null
    *@arguments objClass (Function), the class implemented the interface; interfaces (jsk.KInterface), interfaces
    * Make sure the class implemented all the interfaces it includes
    * ih.ensureImplements(Class, [interface1, interface2]);
    */
  ns.ensureImplements = function(objClass, interfaces){
    try{
      if(arguments.length < 2){
        throw 'IHInterface implements : The arguments expected is actually more than two';
      }
      var len = interfaces.length, mlen = 0;
      for(var i = 0; i < len; i++){
        var interfaceObj = interfaces[i];
        if(interfaceObj.constructor != ns.IHInterface){
          throw 'Implements interface : ' + interfaceObj + ' is not an IHInterface';
        }
        mlen = interfaceObj.methods.length;
        for(var j = 0; j < mlen; j++){
          var method = interfaceObj.methods[j];
          if(!objClass[method] || typeof(objClass[method]) != 'function'){
            throw 'Interface method : ' +  method + ' in ' + objClass.__classname +  ' not implemented yet';
          }
        }
      }
    }catch(e){
      console.log(e);
    }
  };
  
  /**
    *@return null
    *@arguments subClass (Function), sub class; superClass (Function), super class
    * Provide a new method which implements extend function
    */
  ns.cextends = function(subClass, superClass){
    var F = function(){}; //An empty function for prototype transfer
    F.prototype = superClass.prototype;//A reference point to superclass
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;
    
    subClass.prototype.superclass = superClass.prototype;
    if(superClass.prototype.constructor == Object.prototype.constructor){
      //when the super class is Object, make sure the value of superClass.prototype.constructor is not null
      superClass.prototype.constructor = superClass;
    }
  };
  
  /**
    *@return jsk.class (Function)
    *@arguments name (String), class name; superClass (Function), super class; interfaces (jsk.Interface), fct (Function), body;
    * Jsk.Class function
    */
  ns.defineClass = function(name, superclass, interfaces, fct){
    try{
      
      //Check class name is availabe or not
      if(typeof(name) != 'string'){
        throw 'Define class : ' + 'Class name' + name + 'should be typeof stirng, not ' + typeof(name);
      }
      
      //Check function body is available or not
      if(!(fct && fct instanceof Function)){
        throw 'Define class : ' + 'the class' + name + 'function is invalid';
      }else{
      //Check are passed
        var staticObj = {};
        var proObj = {};
        proObj.prototype = {};
        //Get the static method/data and prototype method/data back
        fct(staticObj, proObj);
      }
      
      //Made the class name exists in Dom
      var nameObjArray = name.split('.');
      for(var n = 0; n < nameObjArray.length - 1; n++){
        var m = 0;
        var nameString = '';
        while(m <= n){
          m == n ? nameString += nameObjArray[m] : nameString += nameObjArray[m] + '.';
          m++;
        }
        eval('window.' + nameString + '=' + 'window.' + nameString + '|| {};');
      }

      var c; // Class
      if(superclass == null || superclass == ''){//No super class
        window.__kinit = function(){//Call the init() function as the constructor function
          if(this.init && this.init instanceof Function){
            this.init.apply(this, arguments);
          }
        };
        //Create Class and set it's body as __kinit()
        c = eval(name + '=' + window.__kinit);
        extend(c, staticObj);
        extend(c.prototype, proObj.prototype);
 
      }else{//Extend from super class
        if(!(superclass && superclass instanceof Function)){
          throw 'Define class : ' + 'Superclass ' + superclass + ' is invalid';
        }else{
        //Because super class also has init() method, so, we need to store it temporay
          window.__kinit = function(){
            var t = this.init;
            this.init = this.superclass.init;
            //Call superclass constructor firstly
            this.superclass.constructor.apply(this, arguments);
            //another way ? works fine, it means the constructor is also the part of prototype
            //this.init = this.superclass.constructor; //this will change the prototype of the superclass, not correct
            //this.superclass.constructor.apply(this.superclass, arguments);
            if(t && t instanceof Function){
              this.init = t;
              this.init.apply(this, arguments);
            }
          };
          c = eval(name + '=' + window.__kinit);
          //Extends superclass first, or the prototype will be overwritted
          ns.cextends(c, superclass);
          extend(c, staticObj);
          extend(c.prototype, proObj.prototype);
        }
      }
      
      delete window.__kinit;
      //set class name
      c.prototype.__classname = name;
      
      //Check interface methods are implemented or not
      if(!(interfaces == null || interfaces == '')){
        var _tinstance = new c("__ti");
        ns.ensureImplements(_tinstance, interfaces);
        delete _tinstance;
      }
      
      delete c;
      
    }catch(e){
      console.log(e);
    }
  };
    
  })(window.ih = window.ih || {});