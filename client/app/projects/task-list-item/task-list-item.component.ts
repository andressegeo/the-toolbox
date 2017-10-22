import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'hc-task-list-item',
  templateUrl: 'task-list-item.component.html',
  styleUrls:  [
    'task-list-item.component.css'
  ]
})
export class TaskListItemComponent {

    @Input() task: object;
    @Output() onDeletedTask = new EventEmitter();
    
    constructor(private dbService: DBService){}
    
    private openTask(taskId: number){
    }

    private deleteTask(taskId: number){
      this.onDeletedTask.emit({
        taskId: this.task['id']
      });
    }
    

    
}