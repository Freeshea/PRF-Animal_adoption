import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdoptionService } from '../../shared/services/adoption.service';

@Component({
  selector: 'app-adoption-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adoption-requests.component.html',
  styleUrl: './adoption-requests.component.scss',
})
export class AdoptionRequestsComponent implements OnInit {
  requests: any[] = [];

  constructor(private adoptionService: AdoptionService) {}

  ngOnInit(): void {
    this.adoptionService.getAdoptionRequests().subscribe({
      next: (data) => (this.requests = data),
      error: (err) => console.error('Error: ', err),
    });
  }
}
