import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatsComponent } from './components/chats/chats.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AccessGuard } from './gaurds/access.guard';

const routes: Routes = [
  { path: 'chats', component: ChatsComponent, canActivate: [AccessGuard] },

  { path: '', redirectTo: 'signIn', pathMatch: 'full' },

  { path: 'signIn', component: SignInComponent, canActivate: [AccessGuard] },
  {
    path: 'profile/:userName',
    component: ProfileComponent,
    canActivate: [AccessGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
