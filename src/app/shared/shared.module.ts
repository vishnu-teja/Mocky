import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule
  ],
  exports: [
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatInputModule,
    MatCardModule,
    MatGridListModule
  ]
})
export class SharedModule {}
