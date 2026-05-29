import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Digimon {
  id: number;
  name: string;
  img: string;
  level: string;
}

export interface DigimonDetail {
  id: number;
  name: string;
  images: { href: string; primary: boolean }[];
  levels: { id: number; level: string }[];
  types: { id: number; type: string }[];
  attributes: { id: number; attribute: string }[];
  descriptions: { origin: string; language: string; description: string }[];
}

interface ApiDigimon {
  id: number;
  name: string;
  href: string;
  image: string;
}

interface ApiListResponse {
  content: ApiDigimon[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = '/api/v1/digimon?pageSize=50';

  constructor(private http: HttpClient) {}

  getDigimons(): Observable<Digimon[]> {
    return this.http.get<ApiListResponse>(this.apiUrl).pipe(
      map(response => response.content.map(d => ({
        id: d.id,
        name: d.name,
        img: d.image,
        level: 'Unknown'
      })))
    );
  }

  getDigimonDetail(id: number): Observable<DigimonDetail> {
    return this.http.get<DigimonDetail>(`/api/v1/digimon/${id}`);
  }
}
