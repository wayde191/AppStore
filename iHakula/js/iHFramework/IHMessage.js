
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/26/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

// Namespace is www.ihakula => ih

  (function(ih){
    ih.HException = function(comment, message){
      this.isHException = true;
      this.comment = comment;
      this.message = message;
    };
    
    ih.HLog = function(comment, message){
      this.isHLog = true;
      this.comment = comment;
      this.message = message;
    };
    
    ih.defineClass("ih.Message", null, null, function(smethod, pmethod){
      
      pmethod.prototype.init = function(nameStr){
        this.name = nameStr;
        this.on = false;
        this.msgArray = new ih.$A();
        this.windowInstance = null;
      };
      
      pmethod.prototype.push = function(msgObject){
        this.msgArray.push(msgObject);
      };
      
      pmethod.prototype.pop = function(){
        this.msgArray.pop();
      };
      
      pmethod.prototype.close = function(){
        if(!this.on){
          return;
        }
        if(!this.windowInstance.closed){
          this.windowInstance.close();
        }
        this.windowInstance = null;
      };
      
      pmethod.prototype.open = function(){
        if(this.windowInstance && !this.windowInstance.closed){
          this.close();
        }
        this.windowInstance = window.open('about:blank', 'default', 'height=400, width=600, resizable=yes, scrollbars=yes, top=100, left=200');
        //this.windowInstance.document.title = this.name;
        this.windowInstance.document.write('<html><head><title>' + this.name + '</title><style type="text/css">' + this.style + '</style></head><body><div id="content"></body></html>');
        this.windowInstance.document.close();
        this.windowInstance.focus();
      };
      
      pmethod.prototype.setMsgStyle = function(commentColor, messageColor){
        var ccolor = commentColor || '#8A2BE2';
        var mcolor = messageColor || '#000000';
        this.style = 'p {color:' + ccolor + ';}' + 'span {color:' + mcolor + ';}';
      };
      
      pmethod.prototype.showMessage = function(){
        if(this.windowInstance && !this.windowInstance.closed){
          this.close();
        }
        this.open();
        var w = this.windowInstance;
        this.msgArray.each(ih.$F(function(msgObj){
          var divContent = w.document.getElementById('content');
          var pObj = w.document.createElement('p');
          pObj.appendChild(w.document.createTextNode(msgObj.comment + ' : '));
          var spanObj = w.document.createElement('span');
          spanObj.appendChild(w.document.createTextNode(msgObj.message));
          pObj.appendChild(spanObj);
          divContent.appendChild(pObj);
        }).bind(w));
      };
      
    });

  })(window.ih = window.ih || {});
  
  