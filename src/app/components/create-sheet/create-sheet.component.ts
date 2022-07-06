import {Component, HostListener, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {CanDeactivateComponent} from "../../guards/pending-changes-guard.service";
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-create-sheet',
  templateUrl: './create-sheet.component.html',
  styleUrls: ['./create-sheet.component.css']
})

export class CreateSheetComponent implements OnInit, CanDeactivateComponent {

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
        event.returnValue = this.dataService.existUnsavedChanges;
    }
}
