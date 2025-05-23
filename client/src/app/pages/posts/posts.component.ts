import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
  MatCardActions,
  MatCardSubtitle,
} from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { PostService } from '../../shared/services/post.service';
import { UserService } from '../../shared/services/user.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatOption, MatOptionModule } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { AnimalsService } from '../../shared/services/animals.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCard,
    MatButton,
    MatButtonModule,
    MatCardTitle,
    MatCardContent,
    MatCardHeader,
    MatCardActions,
    MatFormField,
    MatFormFieldModule,
    MatIcon,
    MatCardSubtitle,
    MatInputModule,
    MatOptionModule,
    MatOption,
    MatSelect,
    MatInput,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  animals: any[] = [];
  newPost: any = {
    title: '',
    description: '',
    animal_id: '',
  };
  isAdmin = false;
  editingPost: any = null;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private animalService: AnimalsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.checkAdmin();
    this.fetchAnimals();
  }

  loadPosts(): void {
    this.postService.getPosts().subscribe({
      next: (data) => {
        this.posts = data.reverse();
      },
      error: (err) => console.error(err),
    });
  }

  fetchAnimals(): void {
    this.animalService.getAnimals().subscribe((animals) => {
      this.animals = animals;
    });
  }

  checkAdmin(): void {
    this.userService.getUserProfile().subscribe({
      next: (user) => {
        this.isAdmin = (user as any).role === 'admin';
      },
      error: (err) => console.error(err),
    });
  }

  createPost(): void {
    this.postService.createPost(this.newPost).subscribe((post) => {
      this.posts.unshift(post);
      this.newPost = { title: '', description: '', animal_id: '' };
      window.location.reload();
    });
  }

  deletePost(postId: string): void {
    this.postService.deletePost(postId).subscribe(() => {
      this.posts = this.posts.filter((post) => post._id !== postId);
    });
  }

  editPost(post: any): void {
    this.editingPost = { ...post }; // Copy
  }

  cancelEdit(): void {
    this.editingPost = null;
  }

  updatePost(): void {
    if (this.editingPost) {
      this.postService
        .updatePost(this.editingPost._id, {
          title: this.editingPost.title,
          description: this.editingPost.description,
        })
        .subscribe((post) => {
          const index = this.posts.findIndex((p) => p._id === post._id);
          if (index !== -1) {
            this.posts[index] = post;
          }
          this.editingPost = null;
        });
      window.location.reload();
    }
  }

  goToPetDetails(animalId: string) {
    this.router.navigate(['/pet-details/', animalId]);
  }
}
