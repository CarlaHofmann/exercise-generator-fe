import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueryTopicsService {
    url = "http://localhost:5000/api/get-json"; // flask endpoint

    constructor(private http: HttpClient) { }


}
