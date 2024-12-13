import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmviajePage } from './admviaje.page';

const routes: Routes = [
  {
    path: '',
    component: AdmviajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmviajePageRoutingModule {}
