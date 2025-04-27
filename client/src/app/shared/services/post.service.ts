import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'http://localhost:5000/app/posts';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { withCredentials: true });
  }

  createPost(postData: {
    title: string;
    description: string;
    animal_id: string }): Observable<any> {
    return this.http.post<any>('http://localhost:5000/app/posts', postData, {
      withCredentials: true,
    });
  }

  updatePost(
    id: string,
    postData: { title: string; description: string }
  ): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, postData, {
      withCredentials: true,
    });
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }
}
