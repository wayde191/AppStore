
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 5/12/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

ih.defineClass("ih.Block", null, null, function(BLOCK, block){
  
  block.prototype.init = function(categories){
    this.margin = 10;
    this.column = categories.column || 2;
    this.size = categories.size;
    this.elements = ih.$A(categories.elements);
    this.blockId = categories.blockId;
    
  };
  
  block.prototype.drawBlock = function(){
    var currX = 0;
    var currY = 0;
    var blockEle = $(this.blockId);
    
    currX += 10;
    currY += 10;
    var lastEle = null;
    this.elements.each(function(ele){
      
      var e = $(new ih.Category(ele));
      if(lastEle){
        if(currX + e.width() > this.size.width){
          currX -= (lastEle.width() + this.margin);
          currY += (lastEle.height() + this.margin);
        }
      }
      
      e.css('position', 'absolute');
      e.css('left', currX);
      e.css('top', currY);
      
      lastEle = e;
      var logicX = e.width() + this.margin;
      if(logicX <= this.size.width){
        currX = logicX;
      }
      
      currX += e.width() + this.margin;
      blockEle.append(e);
    
    });
  };
  
  

});
  