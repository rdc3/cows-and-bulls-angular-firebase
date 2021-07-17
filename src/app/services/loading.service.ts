import { BehaviorSubject } from 'rxjs';
import { LoadingComponent } from './../components/loading/loading.component';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadPercent = 0;
  private loadPercent$: BehaviorSubject<string> = new BehaviorSubject(this.loadPercent.toFixed(2).toString());
  private dialogRef: MatDialogRef<any>;
  private dialogOpen = false;
  public loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(public dialog: MatDialog) { }

  openDialog() {
    this.loadPercent = 0;
    const config: MatDialogConfig = {
      backdropClass: 'bg-loading',
      disableClose: true,
      data: this.loadPercent$
    }
    this.dialogRef = this.dialog.open(LoadingComponent, config);
    this.dialogOpen = true;
    this.loading$.next(true);
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false;
      this.loading$.next(false);
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
  setLoadPercentage(value: number) {
    if (!this.dialogOpen) { this.openDialog(); }
    this.loadPercent = value > 0 ? value < 100 ? value : 100 : 0;
    if (this.loadPercent >= 100) {
      this.closeDialog();
    }
    this.loadPercent$.next(this.loadPercent.toString());
  }
  increaseLoadPercentage(value: number) {
    this.setLoadPercentage(value + this.loadPercent);
    this.loadPercent$.next(this.loadPercent.toString());
  }
}
