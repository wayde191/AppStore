
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/26/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

 ih.defineClass("ih.KeyMap", null, null, function(smethod, pmethod){
   
   var keyCodeToFunctionKey = {
       8:"backspace", 9:"tab", 13:"return", 19:"pause", 27:"escape", 32:"space",
       33:"pageup", 34:"pagedown", 35:"end", 36:"home", 37:"left", 38:"up",
       39:"right", 40:"down", 44:"printscreen", 45:"insert", 46:"delete",
       112:"f1", 113:"f2", 114:"f3", 115:"f4", 116:"f5", 117:"f6", 118:"f7",
       119:"f8", 120:"f9", 121:"f10", 122:"f11", 123:"f12",
       144:"numlock", 145:"scrolllock"  
   };
   
   var keyCodeToPrintableChar = {
       48:"0", 49:"1", 50:"2", 51:"3", 52:"4", 53:"5", 54:"6", 55:"7", 56:"8",
       57:"9", 59:";", 61:"=", 65:"a", 66:"b", 67:"c", 68:"d",
       69:"e", 70:"f", 71:"g", 72:"h", 73:"i", 74:"j", 75:"k", 76:"l", 77:"m",
       78:"n", 79:"o", 80:"p", 81:"q", 82:"r", 83:"s", 84:"t", 85:"u", 86:"v",
       87:"w", 88:"x", 89:"y", 90:"z", 107:"+", 109:"-", 110:".", 188:",",
       190:".", 191:"/", 192:"'", 219:"[", 220:"\\", 221:"]", 222:"\""  
   };
   
   
   pmethod.prototype.init = function(bindings){
     this.map = {
       'default' : function(){}
     };
     
     if(bindings){
       for(name in bindings){
         this.map[name.toLowerCase()] = bindings[name];
       }
     }
   };
   
   pmethod.prototype.install = function(element){ //Install the function to keyboard event
     var keymap = this;
     
     function handler(event){
       return keymap.dispatch(event);
     }
     
     ih.addEvent(element, 'keydown', handler);
     ih.addEvent(element, 'keypress', handler);
   };
   
   pmethod.prototype.dispatch = function(event){ //Dispatch the event keyboard published
     var e = event || window.event;
     var modifiers = '';
     var keyname = null;
     if(e.type == 'keydown'){
       var code = e.keyCode;
       //keycode 16 = Shift_L
       //keycode 17 = Control_L
       //keycode 18 = Alt_L
       if(code == 16 || code == 17 || code == 18){
         return;
       }
       keyname = keyCodeToFunctionKey[code];
       if(!keyname && (e.altKey || e.ctrlKey)){
         keyname = keyCodeToPrintableChar[code];
       }
       if(keyname){
         if(e.ctrlKey) modifiers += 'ctrl_';
         if(e.altKey) modifiers += 'alt_';
         if(e.shiftKey) modifiers += 'shift_';
       }
       else return;
     }else if(e.type == 'keypress'){
       if(e.altKey || e.ctrlKey){
         return;
       }
       if(e.charCode != undefined && e.charCode == 0){
         return;
       }
       var code = e.charCode || e.keyCode;
       keyname = String.fromCharCode(code);
       var lowercase = keyname.toLowerCase();
       if(keyname != lowercase){
         keyname = lowercase;
         modifies = 'shift_';
       }
     }
     
     //Build the modifiers to ctrl_alt_l or something like it
     var fct = this.map[modifiers + keyname];
     if(!fct){
       fct = this.map['default'];
     }else{
       var target = e.target;
       if(!target){
         target = e.srcElement;
       }
       //callback function called with three arguments
       fct(target, modifiers + keyname, e);
       
       //Cancel default event
       /* if(e.stopPropagation) e.stopPropagation();
       else e.cancelBubble = true;
       if(e.preventDefault) e.preventDefault();
       else e.returnValue = false; */
       return false;
     }
   };
   
 });