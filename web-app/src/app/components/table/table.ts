import { Component, EventEmitter, Input, output, Output } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PagedData } from '../../interfaces/paged-data';

@Component({
  selector: 'app-table',
  imports: [MatTableModule, MatCardModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  @Input() pagedData!: PagedData<any>;
  @Input() displayedColumns: any[] = [];
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
  @Output() onPageChange = new EventEmitter<any>();
  @Output() rowClick = new EventEmitter<any>();
  @Input() pageIndex!: number;
  @Input() pageSize!: number;
  @Input() showPage = true;

  cols: any[] = [];
  ngOnInit() {
    this.cols = this.displayedColumns.map((x) => x.key || x);
  }

  edit(rowData: any) {
    console.log('Edit', rowData);
    this.onEdit.emit(rowData);
  }

  delete(rowData: any) {
    console.log('Delete', rowData);
    this.onDelete.emit(rowData);
  }

  pageChange(event: any) {
    console.log(event);
    this.onPageChange.emit(event);
  }

  onButtonClick(btn: string, rowData: any) {
    this.rowClick.emit({
      btn,
      rowData,
    });
  }
}
