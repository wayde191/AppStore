/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/16/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

(function($) {
    
//  flash:(bounce,shake,tada,swing,wobble,pulse)
//
//  (currently Webkit, Firefox, IE10 only)
//  Flippers:(flip,flipInX,flipOutX,flipInY,flipOutY)
//
//  Fading entrances:(fadeIn,fadeInUp,fadeInDown,fadeInLeft,fadeInRight,fadeInUpBig,fadeInDownBig,fadeInLeftBig,fadeInRightBig)
//  Fading exits:(fadeOut,fadeOutUp,fadeOutDown,fadeOutLeft,fadeOutRight,fadeOutUpBig,fadeOutDownBig,fadeOutLeftBig,fadeOutRightBig)
//
//  Bouncing entrances:(bounceIn,bounceInDown,bounceInUp,bounceInLeft,bounceInRight)
//  Bouncing exits:(bounceOut,bounceOutDown,bounceOutUp,bounceOutLeft,bounceOutRight)
//
//  Rotating entrances:(rotateIn,rotateInDownLeft,rotateInDownRight,rotateInUpLeft,rotateInUpRight)
//  Rotating exits:(rotateOut,rotateOutDownLeft,rotateOutDownRight,rotateOutUpLeft,rotateOutUpRight)
//
//  Specials:(hinge,rollIn,rollOut)
  
  $.cssAnimate = function(action){
    var className = "animated " + action;
    
    var animateFct = ih.$F(function(name){
      this.removeClass().addClass(name);
      window.setTimeout(ih.$F(function(){
        this.removeClass();
      }).bind(this), 1300);
    }).bind(this);
    
    animateFct(className);
    
  };
  $.fn.cssAnimate = $.cssAnimate;
  
 
})(jQuery);