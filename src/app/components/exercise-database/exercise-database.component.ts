import { Component, OnInit } from '@angular/core';
import {AfterViewInit, ViewChild} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort, Sort} from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-exercise-database',
  templateUrl: './exercise-database.component.html',
  styleUrls: ['./exercise-database.component.css']
})
export class ExerciseDatabaseComponent implements OnInit,AfterViewInit {

  constructor(private http: HttpClient, private _liveAnnouncer: LiveAnnouncer, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadExercises();
    this.dataSource.filterPredicate = function (record,filter) {
      return filter.includes(record.topic);
    }

    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }

  url_delete = 'http://127.0.0.1:5000/professor/database/';
  url_exercises = 'http://127.0.0.1:5000/api/database/list'
  displayedColumns: string[] = ['title', 'topic', 'shortDescription', 'action'];
  dataSource = new MatTableDataSource<exerciseEntry>([]);

  showAlert = false;
  alertMessage = "dsadasdas";

  searchString: string;
  topics : string [] = ['dasdas','1111'];
  

  @ViewChild(MatPaginator, { static: false })
  set paginator(v: MatPaginator) {
    this.dataSource.paginator = v;
  }


  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
    
  }

  get isProfessor(): boolean {
    return this.authService.isProfessor;
  }

  closeAlert(): void{
  
    this.showAlert = false;
  }
  removeExercise(id: string){

    this.http.delete(this.url_delete+id).subscribe({
            next: data => {
              // TODO: dialog
                //alert('Delete successful');
                this.loadExercises();
                //refresh list
            },
            error: error => {
                // alert('There was an error: ' + error.message);
                this.alertMessage = 'Error while trying to delete an exercise: '+error.message;
                this.showAlert = true;
            }
        });
  }

  loadExercises(){

    return this.http.get<exerciseEntry[]>(this.url_exercises).subscribe({
      next: data => {
          // alert(JSON.stringify(data))
          // alert(JSON.stringify(data[0]))
          this.dataSource.data = data;
          this.topics = Array.from((new Set(data.map(element=> element.topic))).values());
      },
      error: error => {
         // alert('There was an error: ' + error.message);
         this.alertMessage = 'Error loading the database: '+error.message;
         this.showAlert = true;
      }
  });
  }

  announceSortChange(sortState: any) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filterTopics(values: any){
    if (values.length>0)
       this.dataSource.filter = values;
    else
      this.dataSource.filter = '';
  }

}

export interface exerciseEntry {
    id: number;
    title: string;
    topic: string;
    shortDescription:string;
  }

