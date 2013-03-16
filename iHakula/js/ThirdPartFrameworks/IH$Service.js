
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 4/10/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

ih.defineClass("ih.$Service", null, null, function(SERVICE, service){
  
  service.prototype.merge = function() {
    var args = Array.prototype.slice.call(arguments);
    var host = args.shift();
    while (args.length) {
      var guest = args.shift();
      for (var p in guest) {
        host[p] = guest[p];
      }
    }
    return host;
  };
  
  service.prototype.service = function() {
    
    $.ajaxSetup({timeout: 10000});
    var defOptions = {
      type: 'POST',
      async: true,
      serviceRoot: '',
      endpoint: '',
      timeout: 10000,
      url: '',
      success: function(data, status, xhr) {
        
      },
      error: function(xhr, status, err) {
        console.log('Ajax Error: ' + status + '.');
      }
    };
    var regSvcs = {};
    
    var me = this;
    return {
      
      register: function(name, options) {
        regSvcs[name] = options;
      },
      
      call: function() {
        var opts = {};
        me.merge.apply(this, typeof(arguments[0]) == 'object' ? [opts, defOptions, arguments[0]] : [opts, defOptions, regSvcs[arguments[0]], arguments[1]]);
        if (!opts.url) {
          if (opts.endpoint && opts.serviceRoot) {
            opts.url = opts.serviceRoot + opts.endpoint;
          } else {
            throw '$ns.1';
          }
        }
        $.ajax(opts);
        return this;
      },
      /**
         * @param opts {object | string}
         * @param value {string | function | object} optional
         */
      setDefOpts: function(opts, value) {
        if (typeof(opts) == 'object') {
          defOptions = opts;
        } else {
          defOptions[opts] = value;
        }
        return this;
      },
      
      loadXML : function(filePath, successHandler){
        var opts = {
            url : filePath,
            success : function(data, textStatus, jqXHR){
              var xml;
              if (typeof data == "string") {
                  xml = new ActiveXObject("Microsoft.XMLDOM");
                  xml.async = false;
                  xml.loadXML(data);
              } else {
                  xml = data;
              }
              successHandler(xml);
            }
        };
        me.merge.apply(opts, defOptions);
        $.ajax(opts);
        return this;
      }
    };
  };

  
});