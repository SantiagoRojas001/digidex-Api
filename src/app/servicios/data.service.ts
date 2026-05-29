import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Digimon {
  name: string;
  img: string;
  level: string;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = '/api/v1/digimon?pageSize=50';

  constructor(private http: HttpClient) {}

  getDigimons(): Observable<Digimon[]> {
    return this.http.get<Digimon[]>(this.apiUrl);
  }
}
