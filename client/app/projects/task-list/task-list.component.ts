import { Component, OnInit, Input, EventEmitter, Output} from '@angular/core';
import { Router } from '@angular/router';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';
import { TaskDetailsComponent } from './../task-details/task-details.component';

@Component({
  selector: 'hc-task-list',
  templateUrl: 'task-list.component.html',
  styleUrls:  [
    'task-list.component.css'
  ]
})
export class TaskListComponent implements OnInit{

    constructor(
      private dbService: DBService,
      private router: Router
    ){}
    
    @Input() taskList: object;
    @Input() set uncompletedTasksOnly(value: boolean) {
      this._uncompletedTasksOnly = value;
      this.refreshTasks();
    }
    @Output() onDelete = new EventEmitter();
    @Output() onTaskOpened = new EventEmitter();

    private tasksSumUp: Array<object> = [];
    private _uncompletedTasksOnly: boolean = false;

    ngOnInit(){}

    private refreshTasks(){
      this.tasksSumUp = [];
      let filters = {
        "task_list": this.taskList["id"]
      };
      if(this._uncompletedTasksOnly){
        filters['completed'] = false;
      }

      this.dbService.list("tasks-sum-up", filters).subscribe((items) => {
        items.forEach((value) => {
          this.insertItem(value, "saved");
        });
      });
    }

    openTask(taskId: object): void {
      this.dbService.get("tasks", taskId).subscribe((task) => {
        this.onTaskOpened.emit({
          "task": task
        });
      });
    }

    private insertItem(value ?: object, status ? : string){
      value = value || {
        "task_list": {
          "id": this.taskList['id']
        },
        "title": "",
        "completed": 0
      };
  
      status = status || "new";
  
      if(status === "new"){
        this.dbService.save("tasks", value).subscribe((saved) => {
          value['id'] = saved['inserted_id'];
          this.tasksSumUp.push({
            "status": "saved",
            "value": value
          });
        });
      }
      else{
        this.tasksSumUp.push({
          "status": "saved",
          "value": value
        });
      }
    }

    

    private onTitleChange(){
      this.dbService.update('task-lists', {
        "id": this.taskList['id']
      }, {
        "title": this.taskList['title']
      }).subscribe((result) => {

      });
    }
    
    private getTaskIndexById(id: string){
      for(var i = 0; i < this.tasksSumUp.length; i++){
        if(this.tasksSumUp[i]['value']['id'] === id){
          return i;
        }
      }
      return -1;
    }

    private deleteTaskFromId(taskId: number){
      for(var i = 0; i < this.tasksSumUp.length; i++){
        if(this.tasksSumUp[i]['id'] === taskId){
          this.tasksSumUp.splice(i, 1);
          break;
        }
      }
    }

    private deleteTask(taskId: number){
      
      this.dbService.delete("tasks", {
        "id": taskId
      }).subscribe(() => {
        let position = this.fetchItemPosition(taskId);
        this.tasksSumUp.splice(position, 1);
        this.deleteTaskFromId(taskId);
      });
    }

    private updateTaskTile(taskId){
      this.dbService.get("tasks-sum-up", taskId).subscribe((taskSumUp) => {
        this.updateValue(taskId, taskSumUp);
      })
    }

    private fetchItemPosition(taskId: number){
      for(var i = 0; i < this.tasksSumUp.length; i++){
        if(this.tasksSumUp[i]['value']['id'] === taskId){
          return i;
        }
      }
    }

    private updateValue(taskId: number, value: object){
      let position = this.fetchItemPosition(taskId);
      this.tasksSumUp[position]['value'] = value;
    }

    public updateTaskItem(id: string){
      this.dbService.get("tasks-sum-up", id).subscribe((task) => {
        let index = this.getTaskIndexById(id);
        this.tasksSumUp[index]['value'] = task;
      });
    }

    
}