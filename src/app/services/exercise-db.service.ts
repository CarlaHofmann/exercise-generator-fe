import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExerciseDbService {

  constructor(private http: HttpClient) { }


  private url_delete = 'http://127.0.0.1:5000/professor/database/';
  private url_exercises = 'http://127.0.0.1:5000/api/database/list';
  private url_notes = 'http://127.0.0.1:5000/api/exercises/notes';

  public getExercises(): Observable<exerciseEntry[]> {
    return this.http.get<exerciseEntry[]>(this.url_exercises);
  }
  public deleteRequest(id: number): Observable<any> {
    return this.http.delete(this.url_delete + id);
  }
  public putNotes(body: any): Observable<any> {
    const headers = { 'content-type': 'text/plain' };
    return this.http.post<any>(this.url_notes, body, { 'headers': headers, observe: 'response' });
  }
}


export interface exerciseEntry {
  id: number;
  title: string;
  category: string;
  shortDescription: string;
  notes: string;
  isUsed: boolean;
}

