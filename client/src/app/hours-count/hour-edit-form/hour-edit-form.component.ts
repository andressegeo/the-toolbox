import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UserInformationsService } from './../../auth/user-informations.service';
import { DBService } from './../../db/db.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectAssignementService } from './../project-assignement.service';
import * as DBUtils from './../../db/db.utils';


@Component({
  selector: 'hour-edit-form',
  templateUrl: 'hour-edit-form.component.html',
  providers: [],
  styleUrls: ['hour-edit-form.component.css']
})
export class HourEditFormComponent implements OnInit {
  /* Inputs */
  @Input() uuid: string;
  @Input() hour: Object;
  @Input() status: string;
  public projects: Object[];
  public clients: Object[];
  public hours: string[] = [];
  private shortCuts: object[] = [];
  public filteredHours: any;
  public filteredShortCuts: any;

  private timer: Date = null;
  public locked = false;

  /* Output */
  @Output() updated = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() canceled = new EventEmitter();

  public form: FormGroup;
  private appUserId: number = null;

  constructor(
    private fb: FormBuilder,
    private userInformationsService: UserInformationsService,
    private dbService: DBService,
    private projectAssignementService: ProjectAssignementService
  ) {




  }

  ngOnInit() {

    this.userInformationsService.onUpdate.subscribe((userInformations) => {
      this.hour['affected_to'] = userInformations.appUser.id;
      this.appUserId = userInformations.appUser.id;
      this.form = this.fb.group({
        'client': [null, Validators.compose([Validators.required, DBUtils.validDBAutocomplete()])],
        'project': [null, Validators.compose([Validators.required, DBUtils.validDBAutocomplete()])],
        'started_at': [null, Validators.compose([Validators.required, Validators.pattern('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$')])],
        'minutes': [null, Validators.compose([Validators.required, , Validators.min(1)])],
        'issue': [null]
      });
    });


    this.form.controls['client'].valueChanges
      .subscribe(name => {
        if (name != null && name.length > 1) {
          this.filterClients(name).subscribe((result => {
            this.form.controls['project'].setValue(null);
            this.clients = result;
          }));
        }
      });


    this.form.controls['project'].valueChanges
      .subscribe(project => {

        if (project != null && typeof (project) === 'object') {
          this.form.controls['client'].setValue(project.client);
        }


        if (project != null && project.length > 1) {
          this.filterProjects(project).subscribe((result => {
            this.projects = result;
          }));
        }
      });

    this.filteredHours = this.form.controls['started_at'].valueChanges
      .map(name => this.filterHours(name));
    this.hours = this.generateHours();

    this.filteredShortCuts = this.form.controls['minutes'].valueChanges
      .map(name => this.filterShortCuts(name));

    this.shortCuts = this.generateMinutesShortCut();

    if (this.hour != null) {
      const startedAtDate = new Date(this.hour['started_at'] * 1000);
      this.hour['project'] ? this.form.controls['client'].setValue(this.hour['project']['client']) : null;
      this.form.controls['project'].setValue(this.hour['project']);
      this.form.controls['started_at'].setValue(this.getFormatedHourMinute(startedAtDate));
      this.form.controls['minutes'].setValue(this.hour['minutes']);
      this.form.controls['issue'].setValue(this.hour['issue']);
    };


  }

  private filterHours(val: string) {
    return val ? this.hours.filter(s => new RegExp(`^${val}`, 'gi').test(s))
      : this.hours;
  }

  private filterShortCuts(val: string) {
    return val ? this.shortCuts.filter(s => new RegExp(`^${val}`, 'gi').test(s['label']))
      : this.shortCuts;
  }

  private filterMinutes(val: string) {
    return val ? this.hours.filter(s => new RegExp(`^${val}`, 'gi').test(s))
      : this.hours;
  }

  private generateMinutesShortCut() {
    const shortCuts = [];
    let hour = 0;
    let minute = 15;
    while (hour <= 8) {
      while (minute < 60) {
        let label = '';
        if (hour !== 0) {
          label += hour + 'h';
          if (minute !== 0) {
            label += ', ';
          }
        }

        if (minute !== 0) {
          label += minute + ' m';
        }
        shortCuts.push({
          'label': label,
          'minutes': hour * 60 + minute
        });
        minute += 15;
      }
      minute = 0;
      hour++;
    }
    return shortCuts;
  }

  private generateHours() {
    const counter = new Date(this.hour['started_at'] * 1000);
    const minutes = counter.getMinutes();
    counter.setMinutes(minutes - (minutes % 15), 0, 0);
    const hours = [];
    for (let i = 0; i < (4 * 24); i++) {
      hours.push(('0' + counter.getHours()).slice(-2) + ':' + ('0' + counter.getMinutes()).slice(-2));
      counter.setMinutes(counter.getMinutes() + 15);
    }

    return hours;
  }


  private getFormatedHourMinute(date: Date) {
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
  }

  private getDateFromFormatedHourMinute(date: Date) {
    const tab = this.form.controls['started_at'].value.split(':');
    date.setHours(tab[0]);
    date.setMinutes(tab[1]);
    return date;
  }

  private filterProjects(val: string) {
    const filter = {
      'project.name': {
        $regex: ('.*' + val + '.*')
      }
    };
    const clientValue = this.form.controls['client'].value;
    if (clientValue != null) {
      filter['project.client.id'] = clientValue['id'];
    }
    return this.projectAssignementService.listProjectAffectedTo(this.appUserId, filter);
  }

  private filterClients(val: string) {
    return this.projectAssignementService.listClientAffectedTo(this.appUserId, {
      'name': {
        $regex: ('.*' + val + '.*')
      }
    });
  }


  private getProjectFromId(id) {
    for (let i = 0; i < this.projects.length; i++) {
      if (Number(this.projects[i]['id']) === Number(id)) {
        return this.projects[i];
      }
    }
  }

  public getName(obj: any): string {
    return obj ? obj.name : '';
  }

  submitForm(value: any) {
    if (this.form.valid) {
      this.locked = true;
      const ret = {
        uuid: this.uuid,
        hour: this.hour
      };

      /* Date handling to timestamp */
      const startedAtDate = new Date(this.hour['started_at'] * 1000);
      startedAtDate.setHours(value.started_at.split(':')[0]);
      startedAtDate.setMinutes(value.started_at.split(':')[1]);
      this.hour['project'] = value.project;
      ret.hour['started_at'] = Math.floor(startedAtDate.getTime() / 1000)
      ret.hour['minutes'] = Number(value.minutes);
      ret.hour['issue'] = value.issue || '';
      ret.hour['comments'] = null;
      if (this.status === 'new') {
        delete ret.hour['id'];
        this.saved.emit(ret);
      } else {
        this.updated.emit(ret);
      }
    }

  };

  cancel() {
    const ret = {
      uuid: this.uuid
    };
    this.canceled.emit(ret);
  }
  
  get diagnostic() { return JSON.stringify(this.form); }
}
