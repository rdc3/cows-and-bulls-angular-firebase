import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  loadPercent = '0.00';
  constructor(@Inject(MAT_DIALOG_DATA) public loadPercent$: Observable<string>) {
    loadPercent$.subscribe(value => this.loadPercent = value);
  }
}
