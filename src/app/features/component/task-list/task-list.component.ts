import { AngularMaterialModule } from '../../../shared/angular-material/angular-material.module';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  EventEmitter,
  inject,
  NgModule,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { TaskService } from '../../../core/service/task.service';
import { taskInterface } from '../../../core/interface/task.interface';
import { ToastrService } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DeleteComponent } from '../../../shared/delete/delete.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers: [provideNativeDateAdapter(), DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskListComponent implements OnInit, AfterViewInit {
  statuses = [
    'Not Started',
    'In Progress',
    'Completed',
    'Pending Review',
    'On Hold',
    'Cancelled',
    'Deferred',
    'Blocked',
    'In Dev',
    'Ready for Testing',
  ];
  displayedColumns: string[] = [
    'title',
    'description',
    'status',
    'dueDate',
    'Action',
    'Delete',
  ];
  dataSource!: MatTableDataSource<taskInterface>;
  selectedStatus: string = '';
  selectedDate: any;
  dataArray: any[] = [];
  range! : FormGroup

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  readonly dialog = inject(MatDialog);
  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private taskService: TaskService,
    private toastr: ToastrService,
    private formBuilder:FormBuilder,
    private spinner: NgxSpinnerService
  ) {
    this.range = this.formBuilder.group({
      start: [''], 
      end: ['']
    });
  }
  @Output() dataEvent = new EventEmitter<taskInterface[]>();
  ngOnInit(): void {
    this.getTaskList();
    this.range.valueChanges.subscribe(() => {
      const { start, end } = this.range.value;
      if (start && end) {
        this.applyFilter();
      
      }
    });
  }

  getTaskList() {
    try {
      this.spinner.show();
      this.taskService.taskList().subscribe({
        next: (res: taskInterface[]) => {
          this.dataArray = Object.entries(res).map(([CustomID, value]) => ({
            CustomID,
            ...value,
          }));
          setTimeout(() => {
            
            this.spinner.hide();
          }, 500);
          this.dataEvent.emit(this.dataArray);
          this.dataSource = new MatTableDataSource(this.dataArray);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          this.toastr.error(err);
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            this.spinner.hide();
          }, 500);
        },
      });
    } catch (error: any) {
      this.toastr.error(error.message);
    }
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  applyFilter() {
   debugger
    let filteredData = [...this.dataArray];
    let filtered: any = [];
    if (this.selectedStatus) {
      filtered = filteredData.filter(
        (task) => task.status === this.selectedStatus
      );
      this.range.reset();
    }
    this.selectedStatus = "";

    if (this.range.value.start && this.range.value.end) {
      filtered = filteredData.filter(task =>{
        return  this.isWithinDateRange(task.duedate, this.range.value.start, this.range.value.end)
      }
    
      );
    }
 

    this.dataSource.data = filtered;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  isWithinDateRange(dateString: string | Date, startDate: string | Date, endDate: string | Date): boolean {
    const dueDate = this.convertToDate(dateString);
    const startdate = this.convertToDate(startDate);
    const enddate = this.convertToDate(endDate);
  
    if (!dueDate || !startdate || !enddate) {
      return false;
    }
  
    return dueDate >= startdate && dueDate <= enddate;
  }
  
  convertToDate(date: string | Date): Date | null {
    if (date instanceof Date) {
      return date;
    }
  
    if (typeof date === 'string') {
      const [day, month, year] = date.split('-').map(part => parseInt(part, 10));
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, month - 1, day);
      }
    }
  
    return null;
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'not started':
        return 'badge bg-light';
      case 'in progress':
        return 'badge bg-warning';
      case 'completed':
        return 'badge bg-success';
      case 'pending review':
        return 'badge bg-primary';
      case 'on hold':
        return 'badge bg-secondary';
      case 'cancelled':
        return 'badge bg-danger';
      case 'deferred':
        return 'badge bg-dark';
      case 'blocked':
        return 'badge bg-secondary';
      case 'in dev':
        return 'badge bg-info';
      case 'ready for testing':
        return 'badge bg-primary';
      default:
        return 'badge bg-light';
    }
  }

  edit(el: any) {
    this.taskService.shareData(el);
    this.router.navigate(['add-task'], { queryParams: { id: el.CustomID } });
  }

  deleteFun(el: any): void {
    const dialogRef = this.dialog.open(DeleteComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        try {
          this.taskService.deleteTask(el.CustomID).subscribe({
            next: (res: any) => {
              this.getTaskList();
            },
            error: (err) => {
              this.toastr.error(err);
            },
          });
        } catch (error: any) {
          this.toastr.error(error.message);
        }
      }
    });
  }

  addTask() {
    this.router.navigateByUrl('add-task');
  }
}
