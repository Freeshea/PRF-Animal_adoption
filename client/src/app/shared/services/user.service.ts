import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserProfile() {
    return this.http.get('http://localhost:5000/app/users/profile', { withCredentials: true });
  }

  deleteAccount() {
    return this.http.delete('http://localhost:5000/app/users/delete', { withCredentials: true });
  }


  addFavourite(petId: string){
    return this.http.post('http://localhost:5000/app/users/favourite', {petId},{withCredentials:true});
  }

  removeFavourite(petId: string) {
    return this.http.post('http://localhost:5000/app/users/unfavourite', { petId }, { withCredentials: true });
  }

}
