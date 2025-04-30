import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdoptionService } from '../../shared/services/adoption.service';
import { Router } from '@angular/router';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
  MatDatepicker,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatOption } from '@angular/material/autocomplete';
import { MatSelect } from '@angular/material/select';
import { MatButton, MatIconButton } from '@angular/material/button';
import { UserService } from '../../shared/services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-adoption-requests',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatFormFieldModule,
    MatLabel,
    MatInput,
    MatDatepicker,
    MatDatepickerModule,
    MatDatepickerToggle,
    MatOption,
    MatSelect,
    MatButton,
    MatNativeDateModule,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './adoption-requests.component.html',
  styleUrl: './adoption-requests.component.scss',
})
export class AdoptionRequestsComponent implements OnInit {
  requests: any[] = [];
  currentUser: any = null;
  isAdmin: boolean = false;
  minDate!: string;

  constructor(
    private adoptionService: AdoptionService,
    private router: Router,
    private userService: UserService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // "YYYY-MM-DD" format
  }

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

  loadRequests() {
    this.adoptionService.getAdoptionRequests().subscribe({
      next: (data) => {
        this.requests = data.map((r) => ({
          ...r,
          isEditing: false,
          originalMessage: r.message,
          originalDate: r.meetingDate,
        }));
      },
      error: (err) => console.error('Request fetch rrror: ', err),
    });
  }

  goToDetails(id: string) {
    this.router.navigateByUrl('/pet-details/' + id);
  }

  canEdit(request: any): boolean {
    return this.isAdmin || request.user_id._id === this.currentUser._id;
  }

  deleteRequest(id: string) {
    if (!confirm('Are you sure?')) {
      return;
    }

    this.adoptionService.deleteRequest(id).subscribe({
      next: () => {
        this.requests = this.requests.filter((r) => r._id !== id);
      },
      error: (err) => {
        console.error('Delete failed', err);
      },
    });
  }

  saveEdit(request: any) {
    const updateData: any = {
      meetingDate: request.meetingDate,
      message: request.message,
    };

    if (this.isAdmin) {
      updateData.status = request.status;
    }

    this.adoptionService.updateRequest(request._id, updateData).subscribe({
      next: () => {
        request.isEditing = false;
        request.originalMessage = request.message;
        request.originalDate = request.meetingDate;
      },
      error: (err) => {
        console.error('Update failed', err);
      },
    });
  }

  cancelEdit(request: any) {
    request.message = request.originalMessage;
    request.meetingDate = request.originalDate;
    request.isEditing = false;
  }
}
