import { Component } from '@angular/core';
import { AngularMaterialModule } from '../../../shared/angular-material/angular-material.module';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { error } from 'console';
import { CommonModule } from '@angular/common';
import { loginInterface } from '../../../core/interface/login.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AngularMaterialModule,ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
formGroup!:FormGroup
error:boolean= false;
errorshow:string ="";

  constructor(private _fb:FormBuilder, private router:Router,private authService:AuthService ){
  this.formGroup = this._fb.group({
    Email:['',[Validators.required, Validators.email]],
    Password:['',[Validators.required, Validators.minLength(6)]]
  })
  if (typeof window !== 'undefined') {
    this.authService.removeAuthToken();
  }
 
  }
  loginForm() {
    if (this.formGroup.valid) {
      this.error = false;
      const email = this.formGroup.value.Email;
      const password = this.formGroup.value.Password;

      try {
        this.authService.login(email, password).subscribe({
          next: (res: loginInterface) => {
            this.authService.setAuthToken(res);
            this.router.navigateByUrl("/dashboard");
            setTimeout(() => {
              this.error = false;
            }, 500);
          },
          error: (err) => {
            this.error = true;
            this.errorshow = err;

            setTimeout(() => {
              this.error = false;
            }, 1000);
          }
        });
      } catch (error) {
        this.error = true;
        this.errorshow = 'An error occurred while logging in. Please try again later.';
        setTimeout(() => {
          this.error = false;
        }, 1000);
      }
    } else {
      this.error = true;
      this.errorshow = "Enter Email and Password";
      this.formGroup.markAllAsTouched(); // Mark all fields as touched to trigger validation messages
      setTimeout(() => {
        this.error = false;
      }, 3000);
    }
  }
}
