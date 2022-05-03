import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,throwError  } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {Topic, GetTopicsResponse} from './topic_def';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-exercise',
  templateUrl: './add-exercise.component.html',
  styleUrls: ['./add-exercise.component.css']
})


export class AddExerciseComponent implements OnInit {
    items : Topic[] =[]; // list of topics to be displayed

    // api paths
      topics_url = 'http://127.0.0.1:5000/api/exercises/topics';
      post_url = 'http://127.0.0.1:5000/api/exercises/add';

    // object needed for managing the input fields
      uploadForm = new FormGroup({
        title: new FormControl('', [Validators.required, Validators.minLength(1)]),
        topic_name: new FormControl('', [Validators.required, Validators.minLength(1)]),
        exercise: new FormControl('', [Validators.required, Validators.minLength(1)]),
        solution: new FormControl('', [Validators.required, Validators.minLength(1)]),
        customFile: new FormControl('', [])
      });

    // file names
      myFiles:string [] = [];

      constructor(private formBuilder: FormBuilder, private http: HttpClient) { }



        private get_topics() {
            return this.http.get<Topic[]>(this.topics_url).subscribe({
                next: data => {
                    // alert(JSON.stringify(data))
                    // alert(JSON.stringify(data[0]))
                    this.items = data;
                },
                error: error => {
                    console.error('There was an error!', error);
                }
            });
        }




          onFileChange(event: any) {
            for (var i = 0; i < event.target.files.length; i++) {
                this.myFiles.push(event.target.files[i]); // add filenames when a new file is uploaded
            }
          }


        onSubmit() {
            const formData = new FormData();

            formData.append('title', this.uploadForm.get('title')!.value);
            formData.append('topic', this.uploadForm.get('topic_name')!.value.topic_name);
            formData.append('exercise', this.uploadForm.get('exercise')!.value);
            formData.append('solution', this.uploadForm.get('solution')!.value);
            //formData.append('file', this.uploadForm.get('customFile')!.value);
            for (var i = 0; i < this.myFiles.length; i++) {
                formData.append("file[]", this.myFiles[i]);
              }
              // send the content to the server
            this.http.post<any>(this.post_url, formData).subscribe(
              (res) => console.log(res),
              (err) => console.log(err)
            );
          }


        ngOnInit(): void {
            this.uploadForm.reset();
            this.get_topics();
        }

}
