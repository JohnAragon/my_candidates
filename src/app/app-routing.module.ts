import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidatesComponent } from './components/candidates/candidates.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'candidates', component: CandidatesComponent },
  { path: 'home', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
