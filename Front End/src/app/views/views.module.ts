import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'angular-calendar';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from '../main-layout/footer/footer.component';



import { StatsCardComponent } from './dashboards/common/stats-card/stats-card.component';
import { Dashboard1Component } from './dashboards/dashboard1/dashboard1.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    CalendarModule.forRoot()
  ],
  declarations: [
    FooterComponent,
    StatsCardComponent,
    Dashboard1Component
  ],
  exports: [
    FooterComponent,
    StatsCardComponent,
    Dashboard1Component,


  ],
  schemas: [NO_ERRORS_SCHEMA]
})
export class ViewsModule { }
