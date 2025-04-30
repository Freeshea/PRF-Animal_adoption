import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AnimalsService } from '../../shared/services/animals.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  animals: any[] = [];
  newAnimal: any = {
    name: '',
    gender: '',
    species: '',
    age: 0,
    health: '',
    nature: '',
    photos: [],
    isAdopted: false,
  };

  constructor(private animalService: AnimalsService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAnimals();
  }

  fetchAnimals() {
    this.animalService.getAnimals().subscribe({
      next: (res) => (this.animals = res),
      error: (err) => console.error(err),
    });
  }

  createAnimal() {
    this.animalService.createAnimal(this.newAnimal).subscribe({
      next: (_) => {
        this.newAnimal = {};
        this.fetchAnimals();
      },
      error: (err) => console.error(err),
    });
  }

  deleteAnimal(id: string) {
    this.animalService.deleteAnimal(id).subscribe({
      next: (_) => this.fetchAnimals(),
      error: (err) => console.error(err),
    });
  }

  goToPetDetails(animalId: string) {
    this.router.navigate(['/pet-details/', animalId]);
  }

  // TODO létrehozásnál a 3. try-on nem működik az automata isadopted:yes
  // lehet hozzá kéne tenni csak hogy könnyebb legyen egy adopted?: fieldet hozzáadásnál
  // Illetve formázni ezt az oldalt még.
}
