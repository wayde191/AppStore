(function ($) {
  "use strict";

  /**
   * Handsontable RemoveRow extension. See `demo/buttons.html` for example usage
   */
  Handsontable.PluginHooks.push('walkontableConfig', function (walkontableConfig) {
    var instance = this;

    var getButton = function (td) {
      return $(td).parents('tr').find('th.htRemoveRow:eq(0) .btn');
    };

    instance.rootElement.on('mouseover', 'tbody th, tbody td', function () {
      getButton(this).show();
    });
    instance.rootElement.on('mouseout', 'tbody th, tbody td', function () {
      getButton(this).hide();
    });

    instance.rootElement.addClass('htRemoveRow');

    if(!walkontableConfig.frozenColumns) {
      walkontableConfig.frozenColumns = [];
    }
    walkontableConfig.frozenColumns.unshift(function(row, elem){
      if(elem.nodeName == 'COL') {
        $(elem).addClass('htRemoveRow');
        return;
      }

      var $div = $('<div class="btn">x</div>');
      $div.on('mouseup', function(){
        instance.alter("remove_row", row);
        console.log(ih.ampE);
        console.log(ih.ampE.test);
        console.log(this.rootElement[0].id);
        var f = ih.ampE.test.bind(ih.ampE);
        f(row);
      });

      var $th = $(elem);
      $th.addClass('htRemoveRow htNoFrame').html($div);
    });
  });
})(jQuery);