import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdoptionService {
  constructor(private http: HttpClient) {}

  getAdoptionRequests(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:5000/app/adoptionRequests', {
      withCredentials: true,
    });
  }

  updateRequest(id: string, data: any): Observable<any> {
    return this.http.put<any>(`http://localhost:5000/app/adoptionRequests/`+id, data, {
      withCredentials: true,
    });
  }

  deleteRequest(id: string): Observable<any> {
    return this.http.delete<any>(`http://localhost:5000/app/adoptionRequests/`+id, {
      withCredentials: true,
    });
  }

}
