
import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { TaskListComponent } from '../../component/task-list/task-list.component';
import { AngularMaterialModule } from '../../../shared/angular-material/angular-material.module';
import { taskInterface } from '../../../core/interface/task.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TaskListComponent, AngularMaterialModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent{
  
  receivedData:taskInterface[] = []
 TotalTask:any;
 CompletedTask:any;
 InProgressTask:any;
 PendingReviewTask:any;

 receiveData(data: taskInterface[]) {
  try {
    this.receivedData = data;

    this.TotalTask = this.receivedData.length;
    this.CompletedTask = 0;
    this.InProgressTask = 0;
    this.PendingReviewTask = 0;

    this.receivedData.forEach((item) => {
      if (item.status === 'Completed') {
        this.CompletedTask++;
      } else if (item.status === 'In Progress') {
        this.InProgressTask++;
      } else if (item.status === 'Pending Review') {
        this.PendingReviewTask++;
      }
    });
  } catch (error) {
    console.error('Error in receiveData():', error);
  }
}
}