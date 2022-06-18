import {Component, HostListener, OnInit} from '@angular/core';
import {Observable, of} from "rxjs";
import {DataService} from "../../services/data.service";
import {CanDeactivateComponent} from "../../guards/pending-changes-guard.service";

@Component({
    selector: 'app-edit-sheet',
    templateUrl: './edit-sheet.component.html',
    styleUrls: ['./edit-sheet.component.css']
})
export class EditSheetComponent implements OnInit, CanDeactivateComponent {

    constructor(private dataService: DataService) {
    }

    ngOnInit() {
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
