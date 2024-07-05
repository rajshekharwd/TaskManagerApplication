
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalErrorService } from './globalerror.service';
import { apiEndPoint } from '../../shared/apiendpoint/api-endPoint';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { taskInterface } from '../interface/task.interface';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl: string = environment.baseURL;
  private dataSource = new BehaviorSubject<taskInterface | null>(null);
  currentData = this.dataSource.asObservable();

  constructor(
    private http: HttpClient,
    private globalErrorService: GlobalErrorService
  ) {}

  taskList(): Observable<taskInterface[]> {
    return this.http
      .get<taskInterface>(this.baseUrl + apiEndPoint.tasklist + '.json')
      .pipe(
        map((response: any) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) =>
          this.globalErrorService.handleGlobalError(error)
        )
      );
  }


  addTask(payload: taskInterface): Observable<taskInterface> {
    return this.http
      .post<taskInterface>(this.baseUrl + apiEndPoint.tasklist + '.json', payload)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.globalErrorService.handleGlobalError(error)
        )
      );
  }

  updateTask(payload: taskInterface, id: string): Observable<taskInterface> {
    return this.http
      .put<taskInterface>(`${this.baseUrl}${apiEndPoint.tasklist}/${id}.json`, payload)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.globalErrorService.handleGlobalError(error)
        )
      );
  }

  deleteTask(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseUrl}${apiEndPoint.tasklist}/${id}.json`)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          this.globalErrorService.handleGlobalError(error)
        )
      );
  }

  shareData(element: taskInterface) {
    this.dataSource.next(element);
  }
}
