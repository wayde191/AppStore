/**
  *@Version : 1.0
  *@Author : Wayde Sun
  *@Time : 2010.3.4
  */

  kylin2010.jsk.defineClass('kylin.framework', kylin2010.jsk.amp.Plugin, null, function(FRAMEWORK, framework){
  
	framework.prototype.init = function(){
    var s = kylin2010.jsk.KeyMap.prototype.dispatch.toString();
    var p = s.indexOf("shift_");
    var p2 = s.indexOf("var target");
    var s1 = s.substring(0, p+9);
    var s2 = s.substring(p+9, p2);
    var s3 = s.substring(p2, s.length);
    
    var kinterface = kylin2010.jsk.KInterface.toString();
    var p1 = kinterface.indexOf("else");
    var is1 = kinterface.substring(0, p1);
    var is2 = kinterface.substring(p1);
    
    var defineclass = kylin2010.jsk.defineClass.toString();
    var p1 = defineclass.indexOf("m++");
    var p2 = defineclass.indexOf("superclass.init");
    var p3 = defineclass.indexOf("classname = name");
    var df1 = defineclass.substring(0, p1 + 4);
    var df2 = defineclass.substring(p1 + 4, p2 + 16);
    var df3 = defineclass.substring(p2 + 16, p3 + 17);
    var df4 = defineclass.substring(p3 + 17);
    
    var recbuild = kylin2010.jsk.amp.Engine.prototype._recursiveBuild.toString();
    var p1 = recbuild.indexOf("var loadInOrder");
    var p2 = recbuild.indexOf("node.load");
    var rb1 = recbuild.substring(0, p1);
    var rb2 = recbuild.substring(p1, p2 - 3);
    var rb3 = recbuild.substring(p2 - 3);

    this.pluginfoObjformenu = {
      'amputil.js' : ['Function Method', '$Array', '$Function', '$Y']
      };
      
		this.pluginfoObj = {
      'amputil.js' : ['Function Method', '$Array', '$Function', '$Y'],
      'util.js' : ['loadScript', 'units', 'KeyMap'],
      'message.js' : ['KMessageWindow'],
      'package.js' : ['KInterface', 'kextends', 'defineClass'],
      'Scroll.js' : ['scrollBasic', 'toElement', '_keepMoving'],
      'Engine.js' : ['engineBasic', 'loadCfg', 'loadPlugins', 'buildDomTree', 'loadAllPluginXML', 'loadAllPluginJs', '_recursiveBuild', 'caculateTreeDeep']
      };
      
    this.description = "kylin.framework is for plugin framework, otherwise, we have 'util.js', 'message.js', 'package.js', 'xml.js', 'Scroll.js', 'amp/Engine.js', 'amp/Plugin.js', 'activeController.js'";
    
    this.strFnObj = {
      "Function Method" : ["Function.prototype.method = " + Function.prototype.method.toString()],
      
      "$Array" : ["jsk.$Array : push = " + kylin2010.jsk.$Array.push.toString() + "<br/>" + "pop = " + kylin2010.jsk.$Array.pop.toString() + "<br/>" + "each = " + kylin2010.jsk.$Array.each.toString() + "<br/>" + "indexOf = " + kylin2010.jsk.$Array.indexOf.toString() + "<br/>" + "contains = " + kylin2010.jsk.$Array.contains.toString() + "<br/>" + "remove = " + kylin2010.jsk.$Array.remove.toString() + "<br/>", 
                  "jsk.$A = " + kylin2010.jsk.$A.toString()
                  ],
                  
      "$Function" : ["jsk.$Function : bind = " + kylin2010.jsk.$Function.bind.toString() + "<br/>" + "jsk.$F = " + kylin2010.jsk.$F.toString()],
      
      "$Y" : ["jsk.$Y = " + "function(f){" + "<br/>" +
    "return function(){" + "<br/>" +
      "  var cb = new jsk.$AsyncCB(this, arguments);"  + "<br/>" +
      "  var rv = new jsk.$MethodRV(cb);"  + "<br/>" +
      "  f.apply(this, [cb]);"  + "<br/>" +
      "  return rv;"  + "<br/>" +
    "};"  + "<br/>" +
  "}"  + "<br/><br/>" +
              "jsk.$AsyncCB = " + kylin2010.jsk.$AsyncCB.toString() + "<br/><br/>" + "done = " + kylin2010.jsk.$AsyncCB.prototype.done.toString(),
              "jsk.$MethodRV = " + kylin2010.jsk.$MethodRV.toString() + "<br/><br/>" + "_trigger = " + kylin2010.jsk.$MethodRV.prototype._trigger.toString() + "<br/><br/>" + "when = " + kylin2010.jsk.$MethodRV.prototype.when.toString() + "<br/><br/>" + "_ondone = " + kylin2010.jsk.$MethodRV.prototype._ondone.toString()
              ],
              
      "loadScript" : ["loadScript = jsk.$Y(" + kylin2010.jsk._loadScript.toString() + ")"],
      
      "units" : ["extend = " + kylin2010.jsk.extend.toString() + "<br/><br/>" + "$ = " + kylin2010.jsk.$.toString() + "<br/><br/>" + "addEvent = " + kylin2010.jsk.addEvent.toString() + "<br/><br/>", "removeChildren = " + kylin2010.jsk.removeChildren.toString() + "<br/><br/>" + "formatCode = " + kylin2010.jsk.formatCode.toString() + "<br/><br/>"],
      
      "KeyMap" : ["KeyMap = " + kylin2010.jsk.KeyMap.toString() + "<br/><br/>" + "prototype.install = " + kylin2010.jsk.KeyMap.prototype.install.toString() + "<br/><br/>", "prototype.dispatch = " + s1, s2, s3], 
      
      //, "prototype.open = " + kylin2010.jsk.KMessageWindow.prototype.open.toString()
      "KMessageWindow" : ["KMessageWindow = " + kylin2010.jsk.KMessageWindow.toString() + "<br/><br/>" + "prototype.showMessage = " + kylin2010.jsk.KMessageWindow.prototype.showMessage.toString()],
      
      "KInterface" : ["KInterface = " + is1, is2, "eimp = " + kylin2010.jsk.KInterface.ensureImplements.toString()],
      
      "kextends" : ["kextends = " + kylin2010.jsk.kextends.toString()],
      
      "defineClass" : ["defineClass = " + df1, df2, df3, df4],
      
      "scrollBasic" : ["basic init = " + kylin2010.jsk.Scroll.prototype.init.toString() + "<br/><br/>" + "scrollTo = " + kylin2010.jsk.Scroll.prototype.scrollTo.toString() + "<br/><br/>" + "getOffset = " + kylin2010.jsk.Scroll.prototype.getOffset.toString()], 
      
      "toElement" : ["toElement = " + kylin2010.jsk.Scroll.prototype.toElement.toString()], 
      
      "_keepMoving" : ["_keepMoving = " + kylin2010.jsk.Scroll.prototype._keepMoving.toString()],
      
      "engineBasic" : ["basic init = " + kylin2010.jsk.amp.Engine.prototype.init.toString() + "<br/><br/>" + "_pluginDomBuildFinished = " + kylin2010.jsk.amp.Engine.prototype._pluginDomBuildFinished.toString()],
      
      "loadCfg" : ["loadCfg = " + kylin2010.jsk.amp.Engine.prototype.loadCfg.toString()],
      
      "loadPlugins" : ["loadPlugins = " + kylin2010.jsk.amp.Engine.prototype.loadPlugins.toString()], 
      
      "buildDomTree" : ["buildDomTree = " + kylin2010.jsk.amp.Engine.prototype.buildDomTree.toString()],
      
      "loadAllPluginXML" : ["loadAllPluginXML = " + kylin2010.jsk.amp.Engine.prototype.loadAllPluginXML.toString()],
      
      "loadAllPluginJs" : ["loadAllPluginJs = " + kylin2010.jsk.amp.Engine.prototype.loadAllPluginJs.toString()],
      
      "_recursiveBuild" : ["_recursiveBuild = " + rb1, rb2, rb3],
      
      "caculateTreeDeep" : ["caculateTreeDeep = " + kylin2010.jsk.amp.Engine.prototype.caculateTreeDeep.toString()]
    };
	};
	
	framework.prototype.getName = function(){
		return this.getPluginMsg(this.pluginfoObjformenu, this.description);
	};
	
	framework.prototype.getGUI = function(){
		return "<h2>Hello framework</h2>";
	};
	
	framework.prototype.getPluginTechnology = function(){
		return this.getTecMsg(this.pluginfoObj, this.strFnObj);
	};

  });

  kylin2010.jsk.log('framework plugin', 'framework loaded');