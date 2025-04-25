import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AnimalsService {
  constructor(private http: HttpClient) {}

  getAnimals(): Observable<any> {
    return this.http.get<any>('http://localhost:5000/app/animals');
  }

  getAnimalById(id: string) {
    return this.http.get('http://localhost:5000/app/animals/' + id);
  }

  updateAnimalById(id: string, updatedData: any) {
    return this.http.put('http://localhost:5000/app/animals/' + id, updatedData, {withCredentials: true});
  }

  createAnimal(animal: any){
    return this.http.post('http://localhost:5000/app/animals', animal, {withCredentials: true});
  }

  deleteAnimal(id: string){
    return this.http.delete('http://localhost:5000/app/animals/'+id, {withCredentials:true});
  }

  // TODO
  submitAdoptionRequest(request: {
    animalId: string;
    reason?: string;
    visitDate: string;
  }) {
    return this.http.post('http://localhost:5000/app/adoptionRequests/adopt', request, {
      withCredentials: true,
    });
  }
}
