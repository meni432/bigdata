import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {MdButtonModule, MdCheckboxModule} from '@angular/material';

import { HttpModule, JsonpModule } from '@angular/http';

import { FormsModule } from '@angular/forms';
import { Ng2TableModule } from 'ng2-table/ng2-table';

import {NgxPaginationModule} from 'ngx-pagination';
import { PaginationModule } from 'ngx-bootstrap';

import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MdButtonModule,
    HttpModule,
    JsonpModule,
    MdCheckboxModule,
    Ng2TableModule,
    FormsModule,
    NgxPaginationModule,
    PaginationModule.forRoot(),
    ChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]

})
export class AppModule { }
