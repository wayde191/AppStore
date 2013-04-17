
/*
 * Copyright (c) 2012-2020, iHakula Studio Software Inc.
 * Use, modification, and distribution subject to terms of license.
 * @version: 1.0
 * @date: 1/8/2013
 * @author: Wayde Sun
 * @email: hakula@ihakula.com
 * @website: www.ihakula.com
 */

ih.defineClass("ih.Gantt", null, null, function(GANTT, gantt){
    
    gantt.prototype.init = function(divObj){
        this._taskList = [];
        this._ganttDiv = divObj;
        this._firstRowStr = "<table border=1 style='border-collapse:collapse'><tr><td rowspan='2' width='300px' style='width:300px;'><div class='GTaskTitle' style='width:300px;'>Task</div></td>";
        this._thirdRow = "";
        this._gStr = "";
        this._maxDate = new Date();
        this._minDate = new Date();
        this._dTemp = new Date();
        this._colSpan = 0;
        this.counter = 0;
    };
    
    //this.addTaskDetail(new this.task('2013-01-10', '2013-01-20', '<b>1：修改1、2、4、5、6、8、9、13、15、16、22</b>', '<b>陆国宁</b>', 0));
    gantt.prototype.addTaskDetail = function(task){
        this._taskList.push(task);
    };
    
    gantt.prototype.task = function(from, to, task, resource, progress)
	{
		var _from = new Date();	
		var _to = new Date();
		var _task = '<b>' + task + '</b>';
		var _resource = '<b>' + resource + '</b>';						
		var _progress = progress;
		var dvArr = from.split('-');
		_from.setFullYear(parseInt(dvArr[0], 10), parseInt(dvArr[1], 10) - 1, parseInt(dvArr[2], 10));
		dvArr = to.split('-');
		_to.setFullYear(parseInt(dvArr[0], 10), parseInt(dvArr[1], 10) - 1, parseInt(dvArr[2], 10));
		
		this.getFrom = function(){ return _from};
		this.getTo = function(){ return _to};
		this.getTask = function(){ return _task};
		this.getResource = function(){ return _resource};
		this.getProgress = function(){ return _progress};
	}
    
    gantt.prototype.getProgressDiv = function(progress){
		return "<div class='GProgress' style='width:" + progress + "%; overflow:hidden'></div>"
	}
    
    gantt.prototype.setMinMaxDate = function(){
    
        this._maxDate.setFullYear(this._taskList[0].getTo().getFullYear(), this._taskList[0].getTo().getMonth(), this._taskList[0].getTo().getDate());
        this._minDate.setFullYear(this._taskList[0].getFrom().getFullYear(), this._taskList[0].getFrom().getMonth(), this._taskList[0].getFrom().getDate());
        
        for(i = 0; i < this._taskList.length; i++)
        {
            if(Date.parse(this._taskList[i].getFrom()) < Date.parse(this._minDate))
                this._minDate.setFullYear(this._taskList[i].getFrom().getFullYear(), this._taskList[i].getFrom().getMonth(), this._taskList[i].getFrom().getDate());
            if(Date.parse(this._taskList[i].getTo()) > Date.parse(this._maxDate))
                this._maxDate.setFullYear(this._taskList[i].getTo().getFullYear(), this._taskList[i].getTo().getMonth(), this._taskList[i].getTo().getDate());						
        }
        
        //---- Fix this._maxDate value for better displaying-----
        // Add at least 5 days
        
        if(this._maxDate.getMonth() == 11) //December
        {
            if(this._maxDate.getDay() + 5 > ih.getDaysInMonth(this._maxDate.getMonth() + 1, this._maxDate.getFullYear()))
                this._maxDate.setFullYear(this._maxDate.getFullYear() + 1, 1, 5); //The fifth day of next month will be used
            else
                this._maxDate.setFullYear(this._maxDate.getFullYear(), this._maxDate.getMonth(), this._maxDate.getDate() + 5); //The fifth day of next month will be used
        }
        else
        {
            if(this._maxDate.getDay() + 5 > ih.getDaysInMonth(this._maxDate.getMonth() + 1, this._maxDate.getFullYear()))
                this._maxDate.setFullYear(this._maxDate.getFullYear(), this._maxDate.getMonth() + 1, 5); //The fifth day of next month will be used
            else
                this._maxDate.setFullYear(this._maxDate.getFullYear(), this._maxDate.getMonth(), this._maxDate.getDate() + 5); //The fifth day of next month will be used
        }
    }
    
    gantt.prototype.drawThirdRow = function(){
        var _currentDate = new Date();
        _currentDate.setFullYear(_currentDate.getFullYear(), _currentDate.getMonth(), _currentDate.getDate());
        _currentDate.setHours(0);
        _currentDate.setMinutes(0);
        _currentDate.setSeconds(0);
        
        var tmpDate = new Date();
        tmpDate.setFullYear(this._dTemp.getFullYear(), this._dTemp.getMonth(), this._dTemp.getDate());
        tmpDate.setHours(0);
        tmpDate.setMinutes(0);
        tmpDate.setSeconds(0);
        
        //Weekend
        if(tmpDate.getDay() % 6 == 0) {
            this._gStr += "<td class='GWeekend'><div style='width:24px;'>" + tmpDate.getDate() + "</div></td>";
            if(Date.parse(tmpDate) == Date.parse(_currentDate))
                this._thirdRow += "<td id='GC_" + (this.counter++) + "' class='GToday' style='height:" + (this._taskList.length * 21) + "px'>&nbsp;</td>";
            else
                this._thirdRow += "<td id='GC_" + (this.counter++) + "' class='GWeekend' style='height:" + (this._taskList.length * 21) + "px'>&nbsp;</td>";
        } else {
            this._gStr += "<td class='GDay'><div style='width:24px;'>" + tmpDate.getDate() + "</div></td>";
            if(Date.parse(tmpDate) == Date.parse(_currentDate))
                this._thirdRow += "<td id='GC_" + (this.counter++) + "' class='GToday' style='height:" + (this._taskList.length * 21) + "px'>&nbsp;</td>";
            else
                this._thirdRow += "<td id='GC_" + (this.counter++) + "' class='GDay'>&nbsp;</td>";
        }
    };
    
    gantt.prototype.drawFirstRow = function(){
        
        if(this._dTemp.getDate() < ih.getDaysInMonth(this._dTemp.getMonth() + 1, this._dTemp.getFullYear()))
        {
            if(Date.parse(this._dTemp) == Date.parse(this._maxDate))
            {							
                this._firstRowStr += "<td class='GMonth' colspan='" + (this._colSpan + 1) + "'>T" + (this._dTemp.getMonth() + 1) + "/" + this._dTemp.getFullYear() + "</td>";							
            }
            this._dTemp.setDate(this._dTemp.getDate() + 1);
            this._colSpan++;
        }					
        else 
        {
            this._firstRowStr += "<td class='GMonth' colspan='" + (this._colSpan + 1) + "'>T" + (this._dTemp.getMonth() + 1) + "/" + this._dTemp.getFullYear() + "</td>";
            this._colSpan = 0;
            if(this._dTemp.getMonth() == 11) //December
            {
                this._dTemp.setFullYear(this._dTemp.getFullYear() + 1, 0, 1);
            }
            else
            {
                this._dTemp.setFullYear(this._dTemp.getFullYear(), this._dTemp.getMonth() + 1, 1);
            }
        }
    };
    
    gantt.prototype.drawTasks = function(){
        var _offSet = 0;
        var _dateDiff = 0;
        
        for(i = 0; i < this._taskList.length; i++) {
            _offSet = (Date.parse(this._taskList[i].getFrom()) - Date.parse(this._minDate)) / (24 * 60 * 60 * 1000);
            _dateDiff = (Date.parse(this._taskList[i].getTo()) - Date.parse(this._taskList[i].getFrom())) / (24 * 60 * 60 * 1000) + 1;
               
            this._gStr += "<div style='position:absolute; top:" + (20 * (i + 2) + 8) + "px; left:" + (_offSet * 25 + 302) + "px; width:" + (25 * _dateDiff + 100) + "px'><div title='" + this._taskList[i].getTask() + "' class='GTask' style='float:left; width:" + (25 * _dateDiff - 1) + "px;'>" + this.getProgressDiv(this._taskList[i].getProgress()) + "</div><div style='float:left; padding-left:3px'>" + this._taskList[i].getResource() + "</div></div>";
            this._gStr += "<div style='position:absolute; top:" + (20 * (i + 2) + 1) + "px; left:5px'>" + this._taskList[i].getTask() + "</div>";
        }
    };
    
    gantt.prototype.draw = function() {
        if(this._taskList.length > 0) {
            this.setMinMaxDate();
            
            this._gStr = "";
            this._gStr += "</tr><tr>";
            this._thirdRow = "<tr><td>&nbsp;</td>";
            
            this._dTemp.setFullYear(this._minDate.getFullYear(), this._minDate.getMonth(), this._minDate.getDate());
            while(Date.parse(this._dTemp) <= Date.parse(this._maxDate)){
                this.drawThirdRow();
                this.drawFirstRow();
            }
            
            this._thirdRow += "</tr>"; 				
            this._gStr += "</tr>" + this._thirdRow;
            this._gStr += "</table>";
            this._gStr = this._firstRowStr + this._gStr;
            
            this.drawTasks();
            this._ganttDiv.innerHTML = this._gStr;
        }
    }
    
    
    
});