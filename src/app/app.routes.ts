import { Routes } from '@angular/router';
import { LoginComponent } from './features/account/login/login.component';
import { LayoutComponent } from './features/layout/layout/layout.component';
import { DashboardComponent } from './features/dashboard/dashboard/dashboard.component';
import { CreateTaskComponent } from './features/component/create-task/create-task.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { authGuard } from './core/authGuard/auth.guard';

export const routes: Routes = [
    { path: 'login',title:"LogIn Page", component: LoginComponent }, 
    { path: '', redirectTo: 'login', pathMatch: 'full'}, 
    {path:'',canActivate:[authGuard], component:LayoutComponent, children:[
        {path:'dashboard',title:"dashboard", component:DashboardComponent},
        {path:'add-task',title:"dashboard", component:CreateTaskComponent}
    ]},  
    { path: '**', component: PageNotFoundComponent }
];
