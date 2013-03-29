
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 3/29/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

  ih.defineClass("ih.plugins.rootDataModel", null, null, function(DM, dm){
  
    dm.prototype.init = function(){
      this.request = new ih.Service();
      this.sysUser = new ih.User();
      this.delegate = null;
      this.awards = null;
    };
    
    dm.prototype.doLogin = function(){
      var username = $("#user_login")[0].value;
      var password = $("#user_pass")[0].value;
      if(username && password) {
          this.request.callService({username:username, password:password}, ih.$F(function(response){
                  console.log(response);
                  if (1 == response.status) {
                      this.sysUser.setUserInfo(response);
                      this.delegate.loginSuccess();
                  } else {
                      
                  }
              }).bind(this), ih.rootUrl + "/user/login", "POST");
      } else {
          ih.userDefaultEngine.logConsole.push(new ih.HLog("HoneyDataModel", "doLogin username or passwrd is empty"));
      }
    };
    
    dm.prototype.doRegister = function(paras){
      this.request.callService(paras, ih.$F(function(response){
              console.log(response);
              if (1 == response.status) {
                  this.sysUser.setUserInfo(response);
                  this.delegate.loginSuccess();
              } else {
                  
              }
          }).bind(this), ih.rootUrl + "/user/login", "POST");
    };

  });


//$.ajax({url:"./js/Plugins/root/main-content.html",
//              type:"GET",
//              complete: ih.$F(function(XMLHttpRequest, textStatus){
//              setContent(XMLHttpRequest.responseText);
//        }).bind(this)});