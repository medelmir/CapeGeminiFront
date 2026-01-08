import { Routes } from '@angular/router';
import { BoiteListComponent } from './components/boite-list/boite-list.component';
import { ReservationListComponent } from './components/reservation-list/reservation-list.component';
import { HomeComponent } from './components/home/home.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { LefatComponent } from './components/lefat/lefat.component';

export const routes: Routes = [
  { path: 'login', component: LoginFormComponent },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'lefat',
    component: LefatComponent,
  },
  {
    path: 'boites',
    component: BoiteListComponent,
  },
  {
    path: 'reservations',
    component: ReservationListComponent,
  },
  { path: '**', redirectTo: 'login' }
];
