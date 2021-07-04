import { Injectable } from '@angular/core';
import {
  MatSnackBar
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(
    private snackBar: MatSnackBar
  ) { }
  popup(message: string, action: string) {
    console.log('Snackbar opened')
    this.snackBar.open(message, action, {
      duration: 20000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
