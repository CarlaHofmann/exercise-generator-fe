import {Component, HostListener, OnInit} from '@angular/core';
import {CanDeactivateComponent} from "../../guards/pending-changes-guard.service";
import {Observable, of} from "rxjs";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-create-sheet',
  templateUrl: './create-sheet.component.html',
  styleUrls: ['./create-sheet.component.css']
})

export class CreateSheetComponent implements OnInit, CanDeactivateComponent {

    public randomizedSheet: Boolean = true;

    constructor(private dataService: DataService) {
    }

    ngOnInit(): void {
    }

    public selectSheetType(): void {
        this.randomizedSheet = !this.randomizedSheet;
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
