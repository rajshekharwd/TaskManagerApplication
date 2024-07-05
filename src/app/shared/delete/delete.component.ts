import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [AngularMaterialModule,MatDialogActions,
    MatDialogClose,
     MatDialogTitle, 
     MatDialogContent],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteComponent>);
}
