
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 5/8/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

ih.defineClass("ih.Category", null, null, function(CAT, cat){
  
  cat.prototype.init = function(data){
    this.id = data.id;
    this.width = data.width;
    this.height = data.height;
    // #fff or #fff-#000
    this.bgColor = data.bgColor;
    this.title = data.title;
    this.content = data.content;
    this.bgLogo = data.bgLogo;
    this.link = data.link; 
    this.shapeType = data.shapType;
  };
  
  // draw itself
  cat.prototype.draw = function(){
    var element = document.createElement("div");
    element.id = this.id;
    element.className = "category-block";
    element.style.width = this.width;
    element.style.height = this.height;
    if (this.bgColor.indexOf("-") > 0) {
     this.drawBgColor(element); 
    } else {
      element.style.backgroundColor = this.bgColor;
    }
    this.drawContent(element);
    return element;
  };
  
  cat.prototype.drawContent = function(ele){
    // content type 1, 2, 3, 4
    // Simple factory design parttner
    var blockEle;
    switch (this.shapeType) {
      case "wrectangle":
        blockEle = this.wrectangle();
        break;
      case "hrectangle":
        blockEle = this.hrectangle();
        break;
      case "contentBlock":
        blockEle = this.contentBlock();
        break;
      default :
        blockEle = this.square();
        break;
    }
    ele.appendChild(blockEle);
  };
  
  cat.prototype.contentBlock = function(){
    var ele = document.createElement('div');
    ele.style.width = this.width;
    ele.style.height = this.height;
    ele.style.background = 'url(' + this.bgLogo + ') no-repeat center center';
    
    // Add title
    ele.style.position = "relative";
    var titleEle = $(document.createElement("div"));
    titleEle.css('width', this.width);
    titleEle.text(this.title);
    $(ele).append(titleEle);
    
    // Add content
    var contentEle = $(document.createElement("div"));
    contentEle.css('width', this.width);
    contentEle.css('position', 'absolute');
    contentEle.css('bottom', 0);
    contentEle.text(this.title);
    $(ele).append(contentEle);
    
    // Add the click event
    var me = this;
    $(ele).click(ih.$F(function(){
      window.location.href = this.link;
      }).bind(me));
    return ele;
  };
  
  cat.prototype.hrectangle = function(){
    var ele = document.createElement('div');
    ele.style.width = this.width;
    ele.style.height = this.height;
    ele.style.background = 'url(' + this.bgLogo + ') no-repeat center center';
    
    // Add title
    ele.style.position = "relative";
    var titleEle = $(document.createElement("div"));
    titleEle.css('height', this.height);
    titleEle.css('float', 'left');
    titleEle.text(this.title);
    $(ele).append(titleEle);
    
    // Add the click event
    var me = this;
    $(ele).click(ih.$F(function(){
      window.location.href = this.link;
      }).bind(me));
    return ele;
  };
  
  cat.prototype.wrectangle = function(){
    var ele = ih.square();
    return ele;
  };
  
  cat.prototype.square = function(){
    var ele = document.createElement('div');
    ele.style.width = this.width;
    ele.style.height = this.height;
    ele.style.background = 'url(' + this.bgLogo + ') no-repeat center center';
    
    // Add title
    ele.style.position = "relative";
    var titleEle = $(document.createElement("div"));
    titleEle.css('width', this.width);
    titleEle.css('position', 'absolute');
    titleEle.css('bottom', 0);
    titleEle.text(this.title);
    $(ele).append(titleEle);
    
    // Add the click event
    var me = this;
    $(ele).click(ih.$F(function(){
      window.location.href = this.link;
      }).bind(me));
    return ele;
  };
  
  cat.prototype.drawBgColor = function(ele){
    var syntax;
    var syntaxCheck = document.createElement('syntax');
    var syntaxFound = false;
    while(!syntaxFound) {
    
         syntaxCheck.style.backgroundImage = '-webkit-gradient(linear,left top,right bottom,from(#9f9),to(white))';
         if(syntaxCheck.style.backgroundImage.indexOf( 'webkit' ) !== -1) {
              syntax = 'webkit';
              syntaxFound = true;
              break;
         }
    
         syntaxCheck.style.backgroundImage = '-moz-linear-gradient(left top,#9f9, white)';
         if(syntaxCheck.style.backgroundImage.indexOf( 'moz' ) !== -1) {
              syntax = 'moz';
              syntaxFound = true;
              break;
         }
    }
    
    var colors = this.bgColor.split("-");
    if(syntax == 'webkit') { // use -webkit syntax 
      ele.style.backgroundImage = "-webkit-gradient(linear,left top,right bottom,from(" + colors[0] + "),to(" + colors[1] + ")) ";
    } else if(syntax == 'moz') { // use -moz syntax
       ele.style.backgroundImage = "-moz-linear-gradient(left top, " + colors[0] + ", " + colors[1]+ ")";
    }
  };

});
  