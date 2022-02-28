import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
    private dialogRef: MatDialogRef<DialogComponent>
  ) {}

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
            alert('ФИО добавлены успешно');
            this.nameForm.reset();
            this.dialogRef.close('Сохранить');
          },
          error: () => {
            alert('Ошибка при добавлении ФИО');
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
        alert('Данные изменены успешно');
        this.nameForm.reset();
        this.dialogRef.close('Обновить');
      },
      error: () => {
        alert('Ошибка при обновлении данных ');
      },
    });
  }
}
