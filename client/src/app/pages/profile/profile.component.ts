import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { AnimalsService } from '../../shared/services/animals.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  user: any;
  showDeletePopup = false;
  favouriteAnimals: any[] = [];

  constructor(
    private userService: UserService,
    private location: Location,
    private router: Router,
    private authService: AuthService,
    private animalService: AnimalsService
  ) {}

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(
      (data) => {
        this.user = data;
        if (this.user.favourite_animals?.length) {
          this.loadFavouriteAnimals(this.user.favourite_animals);
        }
      },
      (error) => {
        console.log('Error fetching user profile', error);
      }
    );
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

  deletePopupShow(): void {
    this.showDeletePopup = true;
  }

  closeDeletePopup(): void {
    this.showDeletePopup = false;
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
