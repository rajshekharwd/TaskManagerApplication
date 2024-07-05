import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AngularMaterialModule } from '../../../shared/angular-material/angular-material.module';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,AngularMaterialModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
constructor(private authService:AuthService, private router:Router){}

  logout() {
    this.router.navigate(['/login']);
    this.authService.removeAuthToken();
    console.log('Logged out successfully');
    // Optionally, navigate to the login page or home page
  }
}
