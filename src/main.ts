import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TableVirtualScrollModule } from 'ng-table-virtual-scroll';
import { MatBadgeModule } from "@angular/material/badge";
import { MatButtonModule } from '@angular/material/button'
import {MatPaginatorModule} from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';

import { ArchiveComponent, DialogOverviewExampleDialog, CreateReportComponent, SelectReportComponent } from './app/archive/archive.component';

import { MaterialExampleModule } from './material.module';
import { FormsModule } from '@angular/forms';



@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatTableModule,
    ScrollingModule,
    TableVirtualScrollModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatPaginatorModule,
    HttpClientModule,
    MaterialExampleModule,  
    FormsModule
  ],
  entryComponents: [ArchiveComponent],
  declarations: [ArchiveComponent, DialogOverviewExampleDialog, CreateReportComponent, SelectReportComponent],
  bootstrap: [ArchiveComponent],
})
export class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
