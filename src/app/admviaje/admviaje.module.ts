import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdmviajePageRoutingModule } from './admviaje-routing.module';

import { AdmviajePage } from './admviaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdmviajePageRoutingModule
  ],
  declarations: [AdmviajePage]
})
export class AdmviajePageModule {}
