import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AnimalsService } from '../../shared/services/animals.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pet-details',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './pet-details.component.html',
  styleUrl: './pet-details.component.scss',
})
export class PetDetailsComponent implements OnInit {

  animal: any; // pet
  showPopup = false;
  adoptionReason = '';
  visitDate!: string;
  showEditPopup = false;
  isAuthenticated = false;
  isAdmin = false;
  isFavourited = false;


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private animalService: AnimalsService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.animalService.getAnimalById(id).subscribe((data) => {
        this.animal = data;
      });
    }

    // Ellenőrizzük, hogy be van-e jelentkezve
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
            }
          });
        }
      },
      error: (err) => {
        console.log('Not logged in.');
      },
    });
  }

  onAdoptionClick(): void {
    this.authService.checkAuth().subscribe({
      next: (isAuthenticated) => {
        if (!isAuthenticated) {
          console.log(
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

    this.animalService.submitAdoptionRequest(requestPayload).subscribe({
      next: () =>{
        console.log("Adoption request sent successfully!");
        alert("Thank you! We will contact you soon.");
        this.closePopup();
      },
      error: (err) =>{
        console.error("Error sending adoption request", err);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  openEditPopup(): void {
    this.showEditPopup = true;
  }

  closeEditPopup(): void {
    this.showEditPopup = false;
  }


  saveAnimal(): void {
    if (!this.animal._id) return;

    this.animalService
      .updateAnimalById(this.animal._id, this.animal)
      .subscribe({
        next: (updated) => {
          console.log('Successful edit:', updated);
          this.showEditPopup = false;
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


}
