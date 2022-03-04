import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  nameForm!: FormGroup;
  actionBtn: string = 'Сохранить';
  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private api: ApiService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}
  
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnInit(): void {
    this.nameForm = this.formBuilder.group({
      nameValue: ['', Validators.required],
      cityValue: ['', Validators.required],
    });

    if (this.editData) {
      this.actionBtn = 'Обновить';
      this.nameForm.controls['nameValue'].setValue(this.editData.nameValue);
      this.nameForm.controls['cityValue'].setValue(this.editData.cityValue);
    }
  }


  
  addName() {
    if (!this.editData) {
      if (this.nameForm.valid) {
        this.api.postData(this.nameForm.value).subscribe({
          next: (res) => {
            this.openSnackBar('ФИО добавлены успешно','Закрыть')
            // alert('ФИО добавлены успешно');
            this.nameForm.reset();
            this.dialogRef.close('Сохранить');
          },
          error: () => {
            this.openSnackBar('Ошибка при добавлении ФИО','Закрыть')
            // alert('Ошибка при добавлении ФИО');
          },
        });
      }
    } else {
      this.updateData();
    }
  }
  updateData() {
    this.api.putData(this.nameForm.value, this.editData.id).subscribe({
      next: (res) => {
        this.openSnackBar('Данные изменены успешно','Закрыть')
        // alert('Данные изменены успешно');
        this.nameForm.reset();
        this.dialogRef.close('Обновить');
      },
      error: () => {
        // alert('Ошибка при обновлении данных ');
      },
    });
  }
}
