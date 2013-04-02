
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 17/7/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

ih.defineClass("ih.User", null, null, function(USER, user){
    
    user.prototype.init = function(){
        this.id = ih.getcookie("ihengine-utilities-session-sid");
        this.name = ih.getcookie("ihengine-utilities-session-uname");
    };
    
    user.prototype.isLogin = function(){
        if(this.id){
            return true;
        }
        return false;
    };
    
    user.prototype.setUserInfo = function(user){
        this.id = user.id;
        this.name = user.email;
        ih.setcookie("ihengine-utilities-session-sid", this.id);
        ih.setcookie("ihengine-utilities-session-uname", this.name);
    };
    
    user.prototype.logout = function(){
        this.id = null;
        this.name = null;
        ih.setcookie("ihengine-utilities-session-sid", "", -1);
        ih.setcookie("ihengine-utilities-session-uname", "", -1);
    }
});