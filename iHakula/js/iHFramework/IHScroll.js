
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/14/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

  ih.defineClass('ih.Scroll', null, null, function(S, s){
  
    s.prototype.steepLength = 100;
    
    /**
      *@return Null
      *@arguments ele (String) : the string id of the element
      * Initializtion the whole element, and count the scrollLeft and scrollTop
      */
    s.prototype.init = function(ele){
      this.element = document.getElementById(ele);
      this.scrollLeft = this.element.scrollLeft;
      this.scrollTop = this.element.scrollTop;
    };
    
    /**
      *@return Null
      *@arguments ele (String) : the string id of the element to move to; time (Integer) : the time to reach to target element
      * Move to target element by using 'time';
      * @1 : Get the target offset
      * @2 : use sqrt(pow(x, 2) + pow(y, 2)) get distance
      * @3 : get xDis and yDis first, then use format s = 0.5 * Accelerate * pow(time, 2) to count out x and y accelerate
      */
    s.prototype.toElement = function(ele, time){
      this._time = time / this.steepLength;
      this.target = document.getElementById(ele);
      this.offsetObj = ih.browserDetect() == "IE" ? this.getOffset(this.target) : { left: this.target.offsetLeft, top: this.target.offsetTop };//@1
      this.distance = Math.sqrt(Math.pow(this.offsetObj.left - this.scrollLeft, 2) + Math.pow(this.offsetObj.top - this.scrollTop, 2));//@2
      if(this.distance == 0){
        return;
      }else{//@3
        this.xDistance = this.offsetObj.left - this.scrollLeft;
        this.yDistance = this.offsetObj.top - this.scrollTop;
        this.xAccelerate = (2 * this.xDistance)/Math.pow(time/1000, 2);
        this.yAccelerate = (2 * this.yDistance)/Math.pow(time/1000, 2);
        this._keepMoving();
      }
    };
    
    /**
      *@return Null
      *@arguments left (Number) : the scroll left of init object; top (Number) : the scroll top of the init object
      * Change the scroll value to make the screen looks like scroll
      */
    s.prototype.scrollTo = function(left, top){
      this.element.scrollLeft = left;
      this.element.scrollTop = top;
      //console.log(left + " : " + top);
    };
    
    /**
      *@return Null
      *@arguments Null
      * Implement the function which makes element move to target position
      * @1 : if use this.steepLength times to get to target position
      * @2 : use 0.5 * a * pow(t, 2) to count out distance went, and add the initialize postion to get the now position
      */
    s.prototype._keepMoving = function(){
      this.startTime = 0;
      this._invokeFct = ih.$F(function invokeFct(){
        if(this instanceof ih.Scroll){
          this.startTime += this._time;
          if(this.startTime == this._time * this.steepLength){//@1
            this.scrollTo(this.offsetObj.left, this.offsetObj.top);
            this.scrollLeft = this.offsetObj.left;
            this.scrollTop = this.offsetObj.top;
            clearInterval(_interval);
          }else{//@2
            var l = this.scrollLeft + 0.5 * this.xAccelerate * Math.pow(this.startTime/1000, 2);
            var t = this.scrollTop + 0.5 * this.yAccelerate * Math.pow(this.startTime/1000, 2);
            this.scrollTo(l, t);
          }
        }
      }).bind(this);
      _interval = setInterval(this._invokeFct, this._time);
    };
    
    /**
      *@return Object, with left and top value
      *@arguments objElement (Element) : the target Element
      * Under IE, the scroll value is different from other browsers, which means scroll to parent element, but body
      */
    s.prototype.getOffset = function(objElement) {
      var offsetleft = objElement.offsetLeft;
      var offsettop = objElement.offsetTop;
      while (objElement.offsetParent != document.body) {
        objElement = objElement.offsetParent;
        offsetleft += objElement.offsetLeft;
        offsettop += objElement.offsetTop;
      }
      offsetleft += document.body.offsetLeft;
      offsettop += document.body.offsetTop;
      return { left: offsetleft, top: offsettop };
    };
    
  });