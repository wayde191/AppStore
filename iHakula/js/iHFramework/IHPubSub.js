
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/28/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */
  
  ih.defineClass("ih.PubSub", null, null, function(smethod, pmethod){
    
    pmethod.prototype.init = function(){
      this.msgBox = ih.$A();
    };
    
    pmethod.prototype.subscribe = function(stringSubject, objTarget, fctMehod){
      var list = this.msgBox[stringSubject];
      if(!list){
        this.msgBox[stringSubject] = [[objTarget, fctMehod]];
      }else{
        list[list.length] = [objTarget, fctMehod];
      }
    };
    
    pmethod.prototype.unsubscribe = function(stringSubject, objTarget){
      var list = this.msgBox[stringSubject];
      if(!list){
        return;
      }else{
        for(var i = 0; i < list.length; i++){
          if(list[i][0] == objTarget){
            list.splice(i, 1);
            return;
          }
        }
      }
    };
    
    pmethod.prototype.publish = function(stringSubject, objEvent){
      var list = this.msgBox[stringSubject];
      if(!list){
        return;
      }else{
        for(var i = 0; i < list.length; i++){
          list[i][1].apply(list[i][0], [objEvent]);
        }
      }
    };
    
  });