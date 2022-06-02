import {Component, OnInit} from '@angular/core';
import {ExerciseApiService, SheetApiService} from "../../../../build/openapi";
import {ActivatedRoute, Router} from "@angular/router";
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";

@Component({
    selector: 'app-pdf-viewer',
    templateUrl: './pdf-viewer.component.html',
    styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {
    public pdfUrl: string;

    public isLoaded = false;

    public showAlert = false;
    public alertMessage = "";

    constructor(private router: Router,
                private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                private exerciseApiService: ExerciseApiService,
                private sheetApiService: SheetApiService) {
    }

    ngOnInit(): void {
        const route = this.router.url;

        if(route.includes("exercise")){
            this.route.params.subscribe({
                next: params => this.loadExercisePdf(params["id"])
            });
        }else{
            this.route.params.subscribe({
                next: params => this.loadSheetPdf(params["id"])
            });
        }
    }

    private loadExercisePdf(id: string): void{
        this.exerciseApiService.getExercisePdf(id).subscribe({
            next: response => {
                const pdf = new Blob([response], {type: "application/pdf"});
                this.pdfUrl = URL.createObjectURL(pdf);

                this.isLoaded = true;
            },
            error: err => {
                this.displayAlert("Error while trying to get PDF.", err);
                this.isLoaded = true;
            }
        });
    }

    private loadSheetPdf(id: string): void{
        this.sheetApiService.getSheetPdf(id).subscribe({
            next: response => {
                const pdf = new Blob([response], {type: "application/pdf"});
                this.pdfUrl = URL.createObjectURL(pdf);

                this.isLoaded = true;
            },
            error: err => {
                this.displayAlert("Error while trying to get PDF.", err);
                this.isLoaded = true;
            }
        });
    }

    public getSanitizedUrl(url: string): SafeResourceUrl{
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    public displayAlert(message: string, error: string): void {
        this.alertMessage = message;
        this.showAlert = true;
        console.log(error);
    }

    public closeAlert(): void {
        this.showAlert = false;
    }
}
