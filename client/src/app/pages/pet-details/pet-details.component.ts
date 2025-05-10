import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalsService } from '../../shared/services/animals.service';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { MatIconModule } from '@angular/material/icon';
import { AdoptionService } from '../../shared/services/adoption.service';

@Component({
  selector: 'app-pet-details',
  imports: [CommonModule, FormsModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './pet-details.component.html',
  styleUrl: './pet-details.component.scss',
})
export class PetDetailsComponent implements OnInit {
  animal: any;
  animalForm!: FormGroup;

  // Adoption-request fields
  adoptionReason = '';
  visitDate!: string;
  minDate!: string;
  showPopup = false; // Adoption popup

  showEditPopup = false; // Edit popup
  isFavourited = false; // Favourite icon boolean
  isAdmin = false; // Show/hide Edit button
  isAuthenticated = false; // Adoption request button check auth

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private animalService: AnimalsService,
    private authService: AuthService,
    private userService: UserService,
    private adoptionService: AdoptionService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD" format
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.animalService.getAnimalById(id).subscribe((data) => {
        this.animal = data;
        this.initForm();
      });
    }

    // Check auth
    this.authService.checkAuth().subscribe({
      next: (isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;

        if (isAuthenticated) {
          this.userService.getUserProfile().subscribe({
            next: (user) => {
              const userData = user as any;
              this.isFavourited = userData.favourite_animals.includes(id);
              this.isAdmin = userData.role === 'admin';
            },
            error: () => {
              console.log('Error fetching user profile');
            },
          });
        }
      },
      error: (err) => {
        console.log('Not logged in. ', err);
      },
    });
  }

  initForm() {
    this.animalForm = this.fb.group({
      name: [
        this.animal?.name || '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(
            /^[A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+([, '-][A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*\.?$/
          ),
        ],
      ],
      age: [
        this.animal?.age || 0,
        [Validators.required, Validators.min(0), Validators.max(200)],
      ],
      species: [
        this.animal?.species || '',
        [
          Validators.required,
          Validators.pattern(
            /^[A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+([, '-][A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*\.?$/
          ),
        ],
      ],
      health: [
        this.animal?.health || '',
        [
          Validators.required,
          Validators.pattern(
            /^[A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+([, '-][A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*\.?$/
          ),
        ],
      ],
      nature: [
        this.animal?.nature || '',
        [
          Validators.required,
          Validators.pattern(
            /^[A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+([, '-][A-Za-zÀ-ŐØ-őø-ÿÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)*\.?$/
          ),
        ],
      ],
      gender: [this.animal?.gender || '', Validators.required],
      isAdopted: [this.animal?.isAdopted || false, Validators.required],
    });
  }

  onAdoptionClick(): void {
    this.authService.checkAuth().subscribe({
      next: (isAuthenticated) => {
        if (!isAuthenticated) {
          console.error(
            'Please log in or register to request a meet-up with an animal.'
          );
          this.router.navigate(['/register']);
          return;
        }

        this.showPopup = true;
      },
      error: (err) => {
        console.log('Auth check error: ', err);
        this.router.navigate(['/register']);
      },
    });
  }

  // Adoption popup
  closePopup(): void {
    this.showPopup = false;
    this.adoptionReason = '';
    this.visitDate = '';
  }

  submitAdoptionRequest(): void {
    if (!this.visitDate) {
      console.error('Please select a date!');
      return;
    }

    const requestPayload = {
      animalId: this.animal._id,
      reason: this.adoptionReason,
      visitDate: this.visitDate,
    };

    this.adoptionService.createAdoptionRequest(requestPayload).subscribe({
      next: () => {
        console.log('Adoption request sent successfully!');
        alert('Thank you! We will contact you soon.');
        this.closePopup();
      },
      error: (err) => {
        console.error('Error sending adoption request', err);
      },
    });
  }

  openEditPopup(): void {
    this.showEditPopup = true;
    this.initForm();
  }

  closeEditPopup(): void {
    this.showEditPopup = false;
  }

  saveAnimal(): void {
    if (!this.animal._id) return;

    const updatedAnimal = { ...this.animal, ...this.animalForm.value };

    this.animalService
      .updateAnimalById(this.animal._id, updatedAnimal)
      .subscribe({
        next: (updated) => {
          console.log('Successful edit:', updated);
          this.showEditPopup = false;
          this.animal = updated;
        },
        error: (err) => {
          console.error('Error occured:', err);
        },
      });
  }

  toggleFavourite(): void {
    if (!this.animal?._id) return;

    if (this.isFavourited) {
      this.userService.removeFavourite(this.animal._id).subscribe(() => {
        this.isFavourited = false;
      });
    } else {
      this.userService.addFavourite(this.animal._id).subscribe(() => {
        this.isFavourited = true;
      });
    }
  }

  goBack() {
    this.location.back();
  }
}
