import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AnimalsService } from '../../shared/services/animals.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  animalForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private animalService: AnimalsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchAnimals();

    this.animalForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(
            /^[A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+([, '-][A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*\.?$/
          ),
        ],
      ],
      gender: [
        '',
        [Validators.required, Validators.pattern(/^(male|female)$/)],
      ], // enum: male / female
      species: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+([, '-][A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*\.?$/
          ),
        ],
      ],
      age: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(200),
          Validators.pattern(/^[0-9]*$/),
        ],
      ],
      health: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+([, '-][A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*\.?$/
          ),
        ],
      ],
      nature: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+([, '-][A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*\.?$/
          ),
        ],
      ],
      photos: ['', [Validators.required]],
      isAdopted: [false, Validators.required],
    });
  }

  fetchAnimals() {
    this.animalService.getAnimals().subscribe({
      next: (res) => (this.animals = res),
      error: (err) => console.error(err),
    });
  }

  createAnimal() {
    if (this.animalForm.invalid) return;

    const newAnimal = {
      ...this.animalForm.value,
      photos: [this.animalForm.value.photos],
    };

    this.animalService.createAnimal(newAnimal).subscribe({
      next: (_) => {
        this.animalForm.reset({
          name: '',
          gender: '',
          species: '',
          age: 0,
          health: '',
          nature: '',
          photos: '',
          isAdopted: false,
        });

        this.fetchAnimals();
      },
      error: (err) => console.error(err),
    });
  }

  deleteAnimal(id: string) {
    const confirmed = confirm('Are you sure?');
    if (!confirmed) return;

    this.animalService.deleteAnimal(id).subscribe({
      next: (_) => this.fetchAnimals(),
      error: (err) => console.error(err),
    });
  }

  goToPetDetails(animalId: string) {
    this.router.navigate(['/pet-details/', animalId]);
  }
}
