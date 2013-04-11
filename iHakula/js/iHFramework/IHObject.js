
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
  
//  Object.prototype.extend = function(sourceObj){
//    for(var f in sourceObj){
//      this[f] = sourceObj[f];
//    }
//    return this;
//  };
 
  var extend = function(targetObj, sourceObj){
    for(var f in sourceObj){
      targetObj[f] = sourceObj[f];
    }
    return targetObj;
  };
  
  Function.prototype.method = function(name, fct){
    this.prototype[name] = fct;
    return this;
  };
  
  // iHObjects
  // $Object, add some more useful methods to original Object
  ns.$Object = {
      clone : function(){
        // Deep clone
        var c = {};
        extend(c, this);
        return c;
      }
  };
  
  ns.$O = function(o){  
    return extend(ns.$Object, o || {});  
  };
  
  // $Array : add some more useful methods to original Array
  ns.$Array = {
    push : function(o){
      this[this.length] = o;
    },
    
    pop : function(){
      --this.length;
    },
    
    each : function(fct){
      for(var i = 0; i < this.length; i++){
        fct(this[i]);
      }
    },
    
    indexOf : function(o){
      for(var i = 0; i < this.length; i++){
        // === means strictly equals, include type and value
        if(this[i] === o){
          return i;
        }
      }
      return -1;
    }, 
    
    contains : function(o){
      return this.indexOf(o) >= 0;
    },
    
    remove : function(o){
      var index = this.indexOf(o);
      if(index >= 0){
        return this.splic(index, 1)[0];
      }
    }, 
    
    find : function(fct){
      for(var i = 0; i < this.length; i++){
        if(fct(this[i])){
          return this[i];
        }
      }
    }
  };
  
  ns.$A = function(a){
    if(a == null){
      a = [];
    }else if(a instanceof Array){
      //Do nothing
    }else{
      a = [a];
    }
    return extend(a, ns.$Array);
  };
  
  // $Function
  ns.$Function = {
 // Bind method has implemented by Native Javascript
//    bind : function(thisObj, argsArr){
//      fct = this;
//      
//      if(argsArr == null || argsArr.length == 0){
//        return ns.$F(function(){
//          return fct.apply(thisObj, arguments);
//        });
//      }else{
//        // when we have agruments
//      }
//    }
  };
  
  ns.$F = function(fct){
    return extend(fct, ns.$Function);
  };
  
  // $Asynchronous
  ns.$Y = function(f){
    return function(){
      var cb = new ns.$AsyncCB(this, arguments);
      var rv = new ns.$MethodRV(cb);
      rv.whenDone(arguments[1]);
      f.apply(this, [cb]);
      return rv;
    };
  };
  
  // $Asynchronous call back
  ns.$AsyncCB = function(thisObj, thisArgs){
    this._thisobj = thisObj;
    this.args = thisArgs;
  };
  
  ns.$AsyncCB
  .method('done', function(rv){//cb.done(rvObj);
    if(this._ondone && typeof(this._ondone) == 'function'){
      this._ondone(rv);
    }
  });
  
  // Method return value
  ns.$MethodRV = function(cb){
    this._cb = cb;
    //Key step, bind RV to the _ondone function, so, when this function called, the scope is RV
    cb._ondone = this._ondone.bind(this);
  };
  
  ns.$MethodRV
  .method('_trigger', function(rv){
    this._rv = rv;
    this._done = true;
  })
  .method('whenDone', function(f){
    this._callbackFct = f;
  })
  .method('_ondone', ns.$F(function(rv){
    this._trigger(rv);
    this._onCallback();
  }))
  .method('_onCallback', function(){
    if(this._done && this._callbackFct && typeof(this._callbackFct) == 'function'){
      this._callbackFct(this._rv);
    }
  });
  
})(window.ih = window.ih || {});
