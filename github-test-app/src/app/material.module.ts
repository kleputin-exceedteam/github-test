import { NgModule } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  exports: [
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule
  ]
})
export class MaterialModule { }
