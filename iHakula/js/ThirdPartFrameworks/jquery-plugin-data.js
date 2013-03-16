/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 4/5/2012
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

(function($) {
  $.setData = function(data,cbFct) {
    var i, newElem, exp, re, rel, t, attr, p, key, value, elem, $wrappedSet = this;
    try {
      $wrappedSet.each(function() {
        elem = $(this);
        rel = elem.attr('rel').match(/data\{([^\}]*)\}/);
        if (!rel) {
          throw 'jquery.data.js: rel tag is invalid.';
        }
        // NOTE: use ; to seperate multi mapping;
        // <li rel="data{menuitem}"><a rel="data{menuitem.text;menuitem.link@href}" class="nav-menu-link"></a></li>
        
        t = rel[1].split(';');
        while(t.length) {
          arr = t.shift().split('@');
          key = arr[0];
          attr = arr[1];
          value = valueForKey(key, data);
          if (value instanceof Array) {
            elem.parent().children('[rel=cp{' + key + '}]').remove();
            elem.show();
            for (i = 0; i < value.length; i++) {
              newElem = elem.clone();
              newElem.attr('rel', 'cp{' + key + '}');
              if (typeof(value[i]) == 'object') {
                newElem.find('[rel*=' + key + ']').attr('rel', function(index, attr) {
                  exp = key.replace('(', '\\(').replace(')', '\\)') + '[^.]*\\.([^;]*)';
                  re = new RegExp(exp, 'g');
                  return attr.replace(re, key + '(' + i + ').' + '$1');
                }).setData(data);
              } else {
                newElem.text(value[i]);
              }
              
              if(cbFct){
                var childTagA = newElem.children('a');
                childTagA.click(cbFct);
              }
              elem.before(newElem);
            }
            if (newElem) {
              newElem.attr('rel', elem.attr('rel'));
              elem.remove();
            } else {
              elem.hide();
            }
          }
          
          if (attr) {
            switch (attr) {
            case 'class':
              elem.addClass(value);
              break;
            case 'html':
              elem.html(value);
              break;
            default:
              elem.attr(attr, value);
            }
          } else {
            elem.text(value);
          }
        }
      });
    } catch(ex) {
      console.log(ex);
    }
    
    function valueForKey(key, dummydata) {
      var keys = key.split(/\./);
      var value = dummydata;
      while (keys.length > 0) {
        if (value) {
          var index = keys.shift();
          if (index.indexOf('(') >= 0) {
            var parts = index.match(/(\w*)\((\d*)\)/);
            if (value[parts[1]]) {
              value = value[parts[1]][parts[2]];
            } else {
              return null;
            }
          } else {
            value = value[index];
          }
        }
        else {
          return null;
        }
      }
      return value;
    }
    return this;
  };
  $.fn.setData = $.setData;  
  
})(jQuery);