import { Component, OnInit, Input } from '@angular/core';
import { DBService } from './../../db/db.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'hc-project-members',
  templateUrl: 'project-members.component.html',
  styleUrls:  [
    'project-members.component.css'
  ]
})
export class ProjectMembersComponent implements OnInit {
    
    @Input() projectId: number;
    constructor(private dbService: DBService){}

    private assignements: Observable<Array<object>>;
    private new: boolean = false;

    private displayNewForm(display: boolean = true){
        this.new = display
    }

    ngOnInit(){
        this.assignements = this.dbService.list("project_assignements", {
            "project.id": this.projectId
        }).map((assignement) => {
            return assignement;
        });
    }

    private refreshMembers(){
        let temp = this.assignements;
    }

    private memberCreated(){
        this.new = false;
    }

    private memberCanceled(){
        this.new = false;
    }

    private deleteMember(assignementId: number){
        this.dbService.delete("project_assignements", {
            "id": assignementId
        }).subscribe((result) => {
            this.refreshMembers();
        });
    }
}