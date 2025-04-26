import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { AnimalsService } from '../../shared/services/animals.service';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatList, MatListItem } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatCard,
    MatList,
    MatListItem,
    MatIcon,
    MatFormField,
    MatFormFieldModule,
    MatLabel,
    MatInput,
    MatError,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  isEditing = false;
  isAdmin = false;
  showDeletePopup = false;
  user: any;
  favouriteAnimals: any[] = [];
  profileForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[A-Za-zÀ-ÖØ-öø-ÿ]+([ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('', [Validators.required]),
  });

  constructor(
    private userService: UserService,
    private location: Location,
    private router: Router,
    private authService: AuthService,
    private animalService: AnimalsService,
  ) {}

  ngOnInit(): void {
    this.profileForm.disable();
    this.userService.getUserProfile().subscribe(
      (data) => {
        this.user = data;
        this.isAdmin = this.user.role === 'admin';
        this.patchValues();
        if (this.user.favourite_animals?.length) {
          this.loadFavouriteAnimals(this.user.favourite_animals);
        }
      },
      (error) => {
        console.log('Error fetching user profile', error);
      }
    );
  }

  patchValues(): void {
    this.profileForm.patchValue({
      name: this.user!.name,
      email: this.user!.email,
      role: this.user!.role,
    });
  }

  loadFavouriteAnimals(animalIds: string[]) {
    animalIds.forEach(id => {
      this.animalService.getAnimalById(id).subscribe({
        next: (animal) => {
          this.favouriteAnimals.push(animal);
        },
        error: (err) => {
          console.warn('Failed to load animal with id:', id);
        }
      });
    });
  }

  goToPetDetails(animalId: string) {
    this.router.navigate(['/pet-details/', animalId]);
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  goToAdopt(){
    this.router.navigate(['/adoption-requests'])
  }

  deletePopupShow(): void {
    this.showDeletePopup = true;
  }

  closeDeletePopup(): void {
    this.showDeletePopup = false;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.profileForm.enable();
      this.profileForm.get('email')!.disable();
      this.profileForm.get('role')!.disable();
    } else {
      this.patchValues();
      this.profileForm.disable();
    }
  }

  saveChanges() {
    if (this.profileForm.valid) {
      const updated = this.profileForm.getRawValue();
      this.userService.updateUserProfile(updated).subscribe(res => {
        this.user = res;
        this.toggleEdit();
      });
    }
  }

  deleteAccount() {
    this.userService.deleteAccount().subscribe({
      next: () => {
        this.authService.logout().subscribe({
          next: () => {
            console.log('Account deleted and logged out successfully');
            this.router.navigate(['/register']);
          },
          error: (logoutErr) => {
            console.error('Logout failed after deletion', logoutErr);
            this.router.navigate(['/register']);
          }
        });
      },
      error: (deleteErr) => {
        console.error('Error deleting account', deleteErr);
      }
    });
  }



  goBack() {
    this.location.back();
  }
}
