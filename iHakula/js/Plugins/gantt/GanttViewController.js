/**
  *@Version : 1.0
  *@Author : Wayde Sun
  *@Time : 2010.3.4
  */

  ih.defineClass("ih.plugins.ganttViewController", null, null, function(GANTT, gantt){
  
    gantt.prototype.init = function(){
      this.dm = new ih.plugins.ganttDataModel();
      this.dm.delegate = this;
      this.doSubscribes();
      this.loadContent();
      this.setupEvents();
      this.loadProjects();
    };
    
    gantt.prototype.doSubscribes = function(){
      ih.plugins.rootViewController.dm.pubsub.subscribe("loginSucceed", this, this.loadProjects);
    };
    
    gantt.prototype.loadProjects = function(){
      if(ih.plugins.rootViewController.dm.sysUser.isLogin()){
        this.dm.doLoadProjects({"ihakulaID":ih.plugins.rootViewController.dm.sysUser.id});
      } else {
        this.showLoginDialog();
      }
    };
    
    gantt.prototype.updateProjectOptions = function(){
      var optionsHtml = "";
      for(var i = 0; i < this.dm.projects.length; i++) {
        var project = this.dm.projects[i];
        if(i == 0) {
          this.dm.selectedProject = project;
        }
        optionsHtml += "<option project_id='" + project.id
                    + "' value='" + project.name + "' index_id='" + i + "' >" +
                    project.name + "</option>";
      }
      $("#ih-project-select").html(optionsHtml);
      this.onProjectSelected();
    };
    
    gantt.prototype.updateTasks = function(){
      var data = [];
      for(var i = 0; i < this.dm.tasks.length; i++) {
        var item = this.dm.tasks[i];
        var task = {
          "工作任务":item.name,
          "开始时间":item.beginDate,
          "结束时间":item.endDate,
          "主要负责人":item.principal,
          "任务进度":item.schedule
        };
        data.push(task);
      }
      
      $('#ih-gantt-table').handsontable('loadData', data);
    };
    
    gantt.prototype.updateSuccess = function(){
      ih.plugins.rootPlugin.hideMaskSpinner();
    };
    
    gantt.prototype.onProjectSelected = function(){
      $("#ih-gantt-project-name").html(this.dm.selectedProject.name);
      this.dm.doLoadTasks();
    };
    
    gantt.prototype.showLoginDialog = function(){
      window.setTimeout(ih.$F(ih.plugins.rootViewController.onLoginBtnClicked).bind(ih.plugins.rootViewController), 2000);
    };
    
    gantt.prototype.setupEvents = function(){
      $("#ih-new-project-button").click(ih.$F(function(){
        
      }).bind(this));
      $("#ih-draw-gantt-button").click(ih.$F(function(){
        
      }).bind(this));
      
      $("#ih-project-select").change(function(){
        var indexId = this.getAttribute("index_id");
        this.dm.selectedProject = this.dm.projects[indexId];
        this.onProjectSelected();
      });
    };
    
    gantt.prototype.onTableValueChanged = function(selectedValue){
      if(selectedValue[2] && selectedValue[2] != selectedValue[3]) {
        // index 3 is new data
        var refreshedData = me.dm.tasks[selectedValue[0]];
        var columnName = selectedValue[1];
        var tableName = me.columnAdapter[columnName];
        refreshedData[tableName] = selectedValue[3];
        ih.plugins.rootPlugin.showMaskSpinner();
        me.dm.doUpdateTask(refreshedData);
      } else if(!selectedValue[2]){
        var row = selectedValue[0];
        var name = $('#ih-gantt-table').handsontable('getDataAtCell', row, 0);
        var beginDate = $('#ih-gantt-table').handsontable('getDataAtCell', row, 1);
        var endDate = $('#ih-gantt-table').handsontable('getDataAtCell', row, 2);
        var principal = $('#ih-gantt-table').handsontable('getDataAtCell', row, 3);
        var schedule = $('#ih-gantt-table').handsontable('getDataAtCell', row, 4);
        
        if(name && beginDate && endDate && principal && schedule) {
          console.log("hahaha");
        }
      }
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
                            '<span id="ih-gantt-project-name">Project Name</span>' +
                            '<a id="ih-draw-gantt-button" class="button-fillet" style="text-decoration: none;float:right; margin-left:8px;">Draw Gantt</a>' +
                            '<a id="ih-new-project-button" class="button-fillet" style="text-decoration: none;float:right; margin-left:8px;">New Project</a>' +
                            '<select id="ih-project-select" style="float:right;"><option>good game</option><option>good choice</option></select>' +
                            '<div id="ih-gantt-table" style="margin-top:20px;"></div>' +
                          '</div>';
      $("#content").html(this.tableStyle + this.contentHtml);

      this.columnAdapter = {
        "工作任务":"name",
        "开始时间":"beginDate",
        "结束时间":"endDate",
        "主要负责人":"principal",
        "任务进度":"schedule"
      };
      var me = this;
      $('#ih-gantt-table').handsontable({
          colWidths: [140, 140, 140, 140, 140],
          currentRowClassName: 'currentRow',
          currentColClassName: 'currentCol',
          onChange: function (data) {
            if(data) {
              var selectedValue = data[0];
              if(selectedValue) {
                me.onTableValueChanged(selectedValue);
              }
            }
          },
          colHeaders: ["工作任务", "开始时间", "结束时间", "主要负责人", "任务进度"],
          columns: [
              {
                data: "工作任务"
                //readOnly: true
              },
              {
                data: "开始时间"
              },
              {
                data: "结束时间"
              },
              {
                data: "主要负责人"
              },
              {
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
    };
    
    

  });