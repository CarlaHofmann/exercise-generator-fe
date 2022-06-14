import {Component, HostListener, OnInit} from '@angular/core';
import {CanDeactivateComponent} from "../../guards/pending-changes-guard.service";
import {Observable, of} from "rxjs";
import {DataService} from "../../services/data.service";

@Component({
    selector: 'app-create-exercise',
    templateUrl: './create-exercise.component.html',
    styleUrls: ['./create-exercise.component.css']
})
export class CreateExerciseComponent implements OnInit, CanDeactivateComponent {

    constructor(private dataService: DataService) {
    }

    ngOnInit(): void {
    }

    public canDeactivate(): Observable<boolean> | boolean {
        if (this.dataService.existUnsavedChanges) {
            return of(window.confirm("There are unsaved changes! Are you sure?"));
        }
        return !this.dataService.existUnsavedChanges;
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler(event: BeforeUnloadEvent) {
        if(this.dataService.existUnsavedChanges){
            event.returnValue = true;
        }
    }
}
