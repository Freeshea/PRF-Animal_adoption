import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdoptionService } from '../../shared/services/adoption.service';
import { Router } from '@angular/router';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { UserService } from '../../shared/services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-adoption-requests',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepicker,
    MatDatepickerModule,
    MatDatepickerToggle,
    MatOption,
    MatSelect,
    MatButton,
    MatNativeDateModule,
  ],
  templateUrl: './adoption-requests.component.html',
  styleUrl: './adoption-requests.component.scss',
})
export class AdoptionRequestsComponent implements OnInit {
  requests: any[] = [];
  currentUser: any = null;
  isAdmin: boolean = false;

  constructor(
    private adoptionService: AdoptionService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.isAdmin = (user as any).role === 'admin';
        this.loadRequests();
      },
      error: (err) => console.error('User fetch error:', err),
    });
  }

  loadRequests(){
    this.adoptionService.getAdoptionRequests().subscribe({
      next: (data) => (this.requests = data),
      error: (err) => console.error('Request fetch rrror: ', err),
    });
  }

  goToDetails(id: string) {
    this.router.navigateByUrl('/pet-details/' + id);
  }

  canEdit(request: any): boolean {
    // Admin minden kérvényt szerkeszthet, User csak a sajátját
    return this.isAdmin || request.user_id._id === this.currentUser._id;
  }

  updateRequest(request: any) {
    const updateData: any = {
      meetingDate: request.meetingDate,
    };

    if (this.isAdmin) {
      updateData.status = request.status;
    }

    this.adoptionService.updateRequest(request._id, updateData).subscribe({
      next: () => {
        console.log('Request updated');
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }

  deleteRequest(id: string) {
    if (!confirm('Biztosan törölni szeretnéd ezt a kérelmet?')) {
      return;
    }

    this.adoptionService.deleteRequest(id).subscribe({
      next: () => {
        this.requests = this.requests.filter(r => r._id !== id);
      },
      error: (err) => {
        console.error('Delete failed', err);
      }
    });
  }


}
