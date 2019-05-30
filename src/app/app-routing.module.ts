import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatsComponent } from './chats/chats.component';

const routes: Routes = [
  { path: 'chats', component: ChatsComponent },

  { path: '', redirectTo: 'chats', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
