/**
  *@Version : 1.0
  *@Author : Wayde Sun
  *@Time : 2010.3.4
  */

  ih.defineClass("ih.plugins.ganttViewController", null, null, function(GANTT, gantt){
  
    gantt.prototype.init = function(){
      this.loadContent();
    };
    
    gantt.prototype.loadContent = function(){
      this.tableStyle = '<style class="common">' +
                          '.handsontable .currentRow {' +
                            'background-color: #E7E8EF;' +
                          '}' +
                          '.handsontable .currentCol {' +
                            'background-color: #F9F9FB;' +
                          '}' +
                        '</style>';
      this.contentHtml = '<div style="clear:both">' +
                            '<h2>Gantt</h2>' +
                            '<span>Project Name</span>' +
                            '<a id="ih-login-button" class="button-fillet" style="text-decoration: none;float:right; margin-left:8px;">Draw Gantt</a>' +
                            '<a id="ih-login-button" class="button-fillet" style="text-decoration: none;float:right; margin-left:8px;">New Project</a>' +
                            '<select style="float:right;"><option>good game</option></select>' +
                            '<div id="ih-gantt-table" style="margin-top:20px;"></div>' +
                          '</div>';
      $("#content").html(this.tableStyle + this.contentHtml);

      $('#ih-gantt-table').handsontable({
          colWidths: [140, 140, 140, 140, 140],
          currentRowClassName: 'currentRow',
          currentColClassName: 'currentCol',
          onChange: function () {
            console.log(arguments);
          },
          colHeaders: ["工作任务", "开始时间", "结束时间", "主要负责人", "任务进度"],
          columns: [
              {
                data: "工作任务",
                readOnly: true
              },
              {
                data: "开始时间"
              },
              {
                data: "结束时间"
              },
              {
                data: "主要负责人"
              },{
                data: "任务进度"
              }
            ],
            rowHeaders: true,
            RemoveRow: true,
            minSpareRows: 1
        });
        
        window.f = function(para){
          console.log(para + " delete");
        };
        
        window.ihSysEngine.pubsub.subscribe("ih-gantt-tableSubject", window, f);
        
        var me = this;
        var ff = function(){
          var data = [
            {"工作任务": "Nissan", "开始时间": 2009, "结束时间": "black", "主要负责人": "black","任务进度": "black"},
            {"工作任务": "Nissan", "开始时间": 2006, "结束时间": "blue", "主要负责人": "blue","任务进度": "black"},
            {"工作任务": "Chrysler", "开始时间": 2004, "结束时间": "yellow", "主要负责人": "black","任务进度": "black"},
            {"工作任务": "Volvo", "开始时间": 2012, "结束时间": "white", "主要负责人": "gray","任务进度": "black"}
          ];
          $('#ih-gantt-table').handsontable('loadData', data)
        };
        
        window.setTimeout(ff, 3000);
    };
    
    

  });