import { NgModule }      from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule }   from '@angular/router';
import { DBModule } from './../db/db.module';
import { DragulaService } from 'ng2-dragula';
import { FlexLayoutModule } from "@angular/flex-layout";
import { AppCommonModule } from './../app-common/app-common.module'
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { ProjectListMenuComponent } from './project-list-menu/project-list-menu.component';
import { ProjectListItemComponent } from './project-list-item/project-list-item.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { ProjectFormComponent } from './project-form/project-form.component';
import { ProjectMembersComponent } from './project-members/project-members.component';
import { ProjectMemberForm } from './project-member-form/project-member-form.component';
import { ProjectFileForm } from './project-file-form/project-file-form.component';
import { ProjectFilesComponent } from './project-files/project-files.component';
import { ProjectIndicatorsComponent } from './project-indicators/project-indicators.component';
import { GoogleColorsService } from './../app-common/google-colors.service';
import { PieChartModule, GaugeModule } from '@swimlane/ngx-charts';
import { CollectionButtonsComponent } from './../app-common/collection-buttons/collection-buttons.component';
import { TaskListItemComponent } from './task-list-item/task-list-item.component';
import MaterialModule from './../material/material.module';
import { TaskMenuComponent } from './task-menu/task-menu.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { ProjecLoadComponent } from './project-load/project-load.component';
import { ProjecLoadLineComponent } from './project-load-line/project-load-line.component';
import { QuillModule } from './../quill/quill.module';
import { TaskCommentsComponent } from './task-comments/task-comments.component';
import { TaskCommentComponent } from './task-comment/task-comment.component';
import { EntityAffectationComponent } from './entity-affectation/entity-affectation.component';
import { DragulaModule } from 'ng2-dragula';


@NgModule({
  imports:      [
    MaterialModule,
    CommonModule,
    DBModule,
    FormsModule,
    DragulaModule,
    ReactiveFormsModule,
    AppCommonModule,
    FlexLayoutModule,
    PieChartModule,
    GaugeModule,
    QuillModule,
    RouterModule.forChild(
      [
        {
          path: '',
          component: ProjectListMenuComponent
        },
        {
          path: 'new',
          component: ProjectDashboardComponent
        },
        {
          path: ':id/:tabName',
          component: ProjectDashboardComponent
        },
        {
          path: ':id/:tabName/:taskId',
          component: ProjectDashboardComponent
        }
      ]
    )
    
  ],
  declarations: [ 
    ProjectIndicatorsComponent,
    ProjectDashboardComponent,
    ProjectListMenuComponent,
    ProjectListItemComponent,
    ProjectMembersComponent,
    ProjectFilesComponent,
    ProjectFormComponent,
    ProjectMemberForm,
    ProjectFileForm,
    CollectionButtonsComponent,
    TaskMenuComponent,
    TaskListComponent,
    TaskListItemComponent,
    ProjecLoadComponent,
    TaskDetailsComponent,
    EntityAffectationComponent,
    ProjecLoadLineComponent,
    TaskCommentsComponent,
    TaskCommentComponent
  ],
  exports: [ ],
  providers: [
    GoogleColorsService,
    DragulaService
  ],
  entryComponents: [
    ProjectListItemComponent,
    TaskDetailsComponent
  ]
})
export class ProjectsModule { }
