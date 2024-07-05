import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../../shared/angular-material/angular-material.module';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../core/service/task.service';
import { ToastrService } from 'ngx-toastr';
import { taskInterface } from '../../../core/interface/task.interface';
import { CommonModule, DatePipe } from '@angular/common';




@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [AngularMaterialModule, ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css',
  providers: [provideNativeDateAdapter(), DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTaskComponent implements OnInit {
  statuses = [
  "Not Started",
  "In Progress",
  "Completed",
  "Pending Review",
  "On Hold",
  "Cancelled",
  "Deferred",
  "Blocked",
  "In Dev",
  "Ready for Testing"
  ];
   range:any = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  formGroup!: FormGroup;
  taskId: string | null = null;
  btnhandle: string = 'Save Task';
  isLoading: boolean = false; // Loading flag
  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private _fb: FormBuilder,
    private router: Router,
    private taskService: TaskService,
    private toastr: ToastrService
  ) {}
  ngOnInit() {
    this.initializeForm();
    
    this.taskId = this.route.snapshot.queryParamMap.get('id');

    if (this.taskId) {
      this.btnhandle = 'Update Task';
      this.taskService.currentData.subscribe((task: taskInterface | null) => {
        if (task) {
          
          
          const date = task.duedate.split(" - ")
          const start = date[0]
          const end = date[1]
          this.range.setValue({
            start: new Date(start),
            end: new Date(end),
          });
          this.formGroup.patchValue({
            title: task.title,
            description: task.description,
            status: task.status,
          
          });
        }
      });
    }
  }

  initializeForm() {
    this.formGroup = this._fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required],
      
    });
  }



  saveTask() {
    try {
      if (this.formGroup.valid) {
        this.isLoading = true; // Start loading
        const form = this.formGroup.value;
        const start = this.formatDate(this.range.value.start);
        const end = this.formatDate(this.range.value.end);
        const payload:any = {
          title: form.title,
          description: form.description,
          status: form.status,
          duedate: `${start} - ${end}`
        };

        if (this.taskId) {
          // Update existing task
          this.taskService.updateTask(payload, this.taskId).subscribe({
            next: (res) => {
              this.toastr.success('Task updated successfully');
              this.router.navigateByUrl('dashboard');
              this.formGroup.reset();
              this.btnhandle = 'Save Task'; 
              this.isLoading = false;
            },
            error: (err) => {
              this.toastr.error('Error updating task', err);
              this.isLoading = false;
            },
          });
        } else {
          // Create new task
          this.taskService.addTask(payload).subscribe({
            next: (res) => {
              this.toastr.success('Task added successfully');
              this.router.navigateByUrl('dashboard');
              this.formGroup.reset();
              this.isLoading = false;
            },
            error: (err) => {
              this.toastr.error('Error adding task', err);
              this.isLoading = false;
            },
          });
        }
      } else {
        this.toastr.warning('Please fill in all required fields');
      }
    } catch (error:any) {
      this.toastr.error('An unexpected error occurred', error);
      this.isLoading = false;
    }
  }
reset(){
  this.formGroup.reset()
  this.range.reset()
  this.btnhandle= 'Save Task';
  this.taskId = null;
}
  formatDate(date: string): string | null {
    return this.datePipe.transform(date, 'dd-MM-yyyy');
  }
}
