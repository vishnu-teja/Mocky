import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SharedModule } from './../shared/shared.module';
import { SignUpComponent } from './components/sign-up/sign-up.component';

@NgModule({
  declarations: [HeaderComponent, SignUpComponent],

  imports: [CommonModule, SharedModule],
  exports: [HeaderComponent]
})
export class CoreModule {}
