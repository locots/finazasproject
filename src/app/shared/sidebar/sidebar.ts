import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',  // Cambiar de template a templateUrl
  styleUrl: './sidebar.css'      // Cambiar de styles a styleUrl
})
export class SidebarComponent {
  constructor(private authService: AuthService) {}
  
  logout() {
    this.authService.logout();
  }
}