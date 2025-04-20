
import { Component, OnInit } from '@angular/core';
import { AnimalsService } from '../../shared/services/animals.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  animals: any[] = [];

  constructor(private router: Router, private animalService: AnimalsService){}

  ngOnInit(): void {
    this.animalService.getAnimals().subscribe((data)=>{
      this.animals = data;
    });
  }

  goToPetDetails(animalID: string){
    this.router.navigate(['pet-details',animalID]);
  }
}
