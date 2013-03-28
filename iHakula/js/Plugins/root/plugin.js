/**
  *@Version : 1.0
  *@Author : Wayde Sun
  *@Time : 2010.3.4
  */

  ih.defineClass('ih.plugins.root', null, null, function(ROOT, root){
  
    root.prototype.init = function(){
      this.initHtmls();
      this.setupLanguage();
      this.setupSpinnerDefaultOptions();
      this.buildMainPage();
    };
    
    root.prototype.buildMainPage = function(){
      this.buildRecommands();
      this.buildMainContent();
    };
    
    root.prototype.buildMainContent = function(){
      this.localize();
      this.setupClickEvent();
    };
    
    root.prototype.setupClickEvent = function(){
      $("#ih-login-button").click(ih.$F(function(){
        this.onLoginBtnClicked();
      }).bind(this));
    };
    
    root.prototype.onLoginBtnClicked = function(){
      $("#ih-mask").css("display", "block");
      $("#ih-mask").addAnimation("fadeIn");
      $("#ds_container").html(this.loginHtml);
      $("#ds_container").addAnimation("bounceInUp");
      
    };
    
    root.prototype.localize = function(){
      // Main content
      this.mainContent = this.mainContent.replace(/@content-title/i, this.languages[this.selectedLanguage]["content-title"]);
      this.mainContent = this.mainContent.replace(/@content-col-1-title/i, this.languages[this.selectedLanguage]["content-col-1-title"]);
      this.mainContent = this.mainContent.replace(/@content-col-1-description/i, this.languages[this.selectedLanguage]["content-col-1-description"]);
      this.mainContent = this.mainContent.replace(/@content-col-1-link/i, this.languages[this.selectedLanguage]["content-col-1-link"]);
      this.mainContent = this.mainContent.replace(/@content-col-2-title/i, this.languages[this.selectedLanguage]["content-col-2-title"]);
      this.mainContent = this.mainContent.replace(/@content-col-2-description/i, this.languages[this.selectedLanguage]["content-col-2-description"]);
      this.mainContent = this.mainContent.replace(/@content-col-2-link/i, this.languages[this.selectedLanguage]["content-col-2-link"]);
      this.mainContent = this.mainContent.replace(/@content-col-3-title/i, this.languages[this.selectedLanguage]["content-col-3-title"]);
      this.mainContent = this.mainContent.replace(/@content-col-3-description/i, this.languages[this.selectedLanguage]["content-col-3-description"]);
      this.mainContent = this.mainContent.replace(/@content-col-3-link/i, this.languages[this.selectedLanguage]["content-col-3-link"]);
        
      $("#ih-main").html(this.mainContent);
        
      // Footer
      this.mainFooter = this.mainFooter.replace(/@footer-ihakula/i, this.languages[this.selectedLanguage]["footer-ihakula"]);
      this.mainFooter = this.mainFooter.replace(/@footer-aboutme/i, this.languages[this.selectedLanguage]["footer-aboutme"]);
      this.mainFooter = this.mainFooter.replace(/@footer-privacy/i, this.languages[this.selectedLanguage]["footer-privacy"]);
      
      $("#ih-footer").html(this.mainFooter);
    };
    
    root.prototype.buildRecommands = function(){
      var target = document.getElementById('ih-recommands');
      var spinner = new Spinner(this.spinnerDefaultOpts).spin(target);
      
      var replacement = document.getElementById('ih-recommands');
			replacement.id = "ih-recommands";
			var el = document.getElementById('ih-recommands');
			el.parentNode.replaceChild(replacement, el);
            
			coverflow('ih-recommands').setup({
        width: '100%',
        item: 1,
        playlist: [
          {
          "title": "snow-motion",
          "description": "what a massive and unbelievable winter we're having!",
          "image": "http://d3el35u4qe4frz.cloudfront.net/eawtAP1q-720.jpg",
          "link": "http://www.google.com/",
          "duration": "183"
          },
          {
          "title": "driving rain",
          "description": "",
          "image": "http://d3el35u4qe4frz.cloudfront.net/njZMLMwy-720.jpg",
          "duration": "782"
          },
          {
          "title": "winter brook",
          "description": "",
          "image": "http://d3el35u4qe4frz.cloudfront.net/Vg7cPUdl-720.jpg"
          }],
        coverwidth: 360,
        coverheight: 150,
        fixedsize: true,
        textoffset: 50,
        backgroundcolor:"ffffff",
        reflectionopacity:0.1,
        coverdepth:120,
        covergap:80

        })
        .on('ready', function(){
          spinner.stop();
          
          this.on('focus', function(index) {
            console.log(index);
          });
				
          this.on('click', function(index, link) {
            console.log("click" + index);
          });
        
        });
    
      window.onresize = function() {
        coverflow('ih-recommands').resize();
      };
    };
    
    root.prototype.setupSpinnerDefaultOptions = function(){
      this.spinnerDefaultOpts = {
        lines: 11, // The number of lines to draw
        length: 1, // The length of each line
        width: 6, // The line thickness
        radius: 12, // The radius of the inner circle
        corners: 1, // Corner roundness (0..1)
        rotate: 0, // The rotation offset
        color: '#000', // #rgb or #rrggbb
        speed: 0.9, // Rounds per second
        trail: 60, // Afterglow percentage
        shadow: true, // Whether to render a shadow
        hwaccel: true, // Whether to use hardware acceleration
        className: 'spinner', // The CSS class to assign to the spinner
        zIndex: 2e9, // The z-index (defaults to 2000000000)
        top: 'auto', // Top position relative to parent in px
        left: 'auto' // Left position relative to parent in px
      };
    };
    
    root.prototype.setupLanguage = function(){
      this.selectedLanguage = "zh";
      
      this.languages = {
        "zh" : {
          "content-title":"让我们的生活从此变得简单",
          "content-col-1-title":"精品推荐",
          "content-col-1-description":"工作上我们可能会用到的",
          "content-col-1-link":"了解详情",
          "content-col-2-title":"生活常用",
          "content-col-2-description":"生活必需居于中心，一切以它展开",
          "content-col-2-link":"了解详情",
          "content-col-3-title":"友情推荐",
          "content-col-3-description":"不要对你的财富视而不见",
          "content-col-3-link":"了解详情",
          
          "footer-ihakula":"ihakula",
          "footer-aboutme":"关于我",
          "footer-privacy":"隐私权和条款"
        },
        "en" : {
          
        }
      };
    };
    
    root.prototype.initHtmls = function(){
      this.mainContent = '<h3 class="secondary"> @content-title </h3><div class="main-cols"><div class="main-col"><h4>@content-col-1-title</h4><p>@content-col-1-description</p><p><a id="content-col-1-link">@content-col-1-link</a></p></div><div class="main-col"><h4>@content-col-2-title</h4><p>@content-col-2-description</p><p><a id="content-col-2-link">@content-col-2-link</a></p></div><div class="main-col"><h4>@content-col-3-title</h4><p>@content-col-3-description</p><p><a id="content-col-3-link">@content-col-3-link</a></p></div></div>';
      this.mainFooter = '<div class="ih-aux"><ul><li><a id="mf-ihakula">@footer-ihakula</a></li><li><a id="mf-aboutme">@footer-aboutme</a></li><li><a id="mf-privacy">@footer-privacy</a></li></ul></div>';
      this.logoHtml = '<div id="ih-logo"></div>';
      this.loginHtml = this.logoHtml + '<div id="ih-login" class="ih-dialog">' +
            '<header class="hero">' +
              '<hgroup>' +
                '<h3>Sign in</h3>' +
                '<p class="intro">Use the iHakula ID you used to register or register now.</p>' +
              '</hgroup>' +
            '</header>' +
            '<div class="dialog-cell">' +
              '<font size="2"><label for="accountname"><span class="dslabel">iHakula ID:</span></label></font>' +
              '<input size="30" autocapitalize="off" autocorrect="off" maxlength="128" id="accountname" type="text" value="" name="theAccountName"/>' +
            '</div>' +
            '<div class="dialog-cell">' +
              '<font size="2"><label for="accountpassword"><span class="dslabel">Password:</span></label></font>' +
              '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" autocorrect="off" maxlength="32" id="accountpassword" type="password" name="theAccountPW"/>' +
            '</div>' +
            '<div style="height:33px;">' +
              '<a class="button large register-button"><span>Register</span></a>' +
              '<a class="button large blue signin-button"><span>Sign In</span></a>' +
            '</div>' +
            '<div class="divider"></div>' +
            '<a class="forgot-button">Forgot ID or Password?</a>' +
      
          '</div>';
    this.registerHtml = this.logoHtml + '<div id="ih-register" class="ih-dialog">' +
            '<header class="hero">' +
                '<hgroup>' +
                    '<h3>Register</h3>' +
                    '<p class="intro">Use email set as your iHakula ID.</p>' +
                '</hgroup>' +
            '</header>' +
            '<div class="dialog-cell">' +
                '<font size="2"><label for="accountname"><span class="dslabel">iHakula ID:</span></label></font>' +
                '<input size="30" autocapitalize="off" autocorrect="off" maxlength="128" id="accountname" type="text" value="" name="theAccountName"/>' +
            '</div>' +
            '<div class="dialog-cell">' +
                '<font size="2"><label for="accountpassword"><span class="dslabel">Password:</span></label></font>' +
                '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" autocorrect="off" maxlength="32" id="accountpassword" type="password" name="theAccountPW"/>' +
            '</div>' +
            '<div class="dialog-cell">' +
                '<font size="2"><label for="confirmpassword"><span class="dslabel">Confrim:</span></label></font>' +
                '<input size="30" autocapitalize="off" oncut="return false ;" oncopy="return false ;" autocorrect="off" maxlength="32" id="confirmpassword" type="password" name="confirmAccountPW"/>' +
            '</div>' +
            
            '<div style="height:33px;">' +
                '<a class="button large register-button"><span>Cancel</span></a>' +
                '<a class="button large blue signin-button"><span>Sure</span></a>' +
            '</div>' +
            '<div class="divider"></div>' +
            
        '</div>';
    };

  });

  ih.plugins.rootPlugin = new ih.plugins.root();


//$.ajax({url:"./js/Plugins/root/main-content.html",
//              type:"GET",
//              complete: ih.$F(function(XMLHttpRequest, textStatus){
//              setContent(XMLHttpRequest.responseText);
//        }).bind(this)});
