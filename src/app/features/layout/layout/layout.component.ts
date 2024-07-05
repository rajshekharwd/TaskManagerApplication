import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header/header.component';
import { DashboardComponent } from '../../dashboard/dashboard/dashboard.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet,HeaderComponent,DashboardComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
