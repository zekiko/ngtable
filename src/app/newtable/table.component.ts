import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';

/* interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
} */

class PeriodicElement {
  os: number;
  temporary: boolean;
  cut: boolean;
  critical: boolean;
  stopFrequencyHz: number;
  confidence: number;
  startTimeMs: number;
  startFrequencyHz: number;
  samplingFrequencyHz: number;
  channelized: boolean;
  signalId: number;
  signalType: string;
  snrDbm: number;
  stopTimeMs: number;
  enterCase: string;
  currentIdInfo: string;
  oprNote: string;
  status: string;
  position: number;
}

/* let ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, os: 1, temporary: true, cut: true, critical: true, stopFrequencyHz: 1, confidence: 1, startTimeMs: 1, startFrequencyHz: 1, samplingFrequencyHz: 1, channelized: true, signalId: 1, snrDbm: 10, stopTimeMs: 1, enterCase: "a", currentIdInfo: "a", oprNote: "cag", signalType: "a", status: "canlı" },
  { position: 2, os: 2, temporary: false, cut: false, critical: false, stopFrequencyHz: 2, confidence: 2, startTimeMs: 2, startFrequencyHz: 2, samplingFrequencyHz: 2, channelized: true, signalId: 2, snrDbm: 20, stopTimeMs: 2, enterCase: "b", currentIdInfo: "b", oprNote: "zek", signalType: "b", status: "kesildi" },
  { position: 3, os: 1, temporary: true, cut: true, critical: true, stopFrequencyHz: 1, confidence: 1, startTimeMs: 1, startFrequencyHz: 1, samplingFrequencyHz: 1, channelized: true, signalId: 2, snrDbm: 10, stopTimeMs: 1, enterCase: "a", currentIdInfo: "a", oprNote: "cag", signalType: "a", status: "canlı" },
  { position: 4, os: 2, temporary: false, cut: false, critical: false, stopFrequencyHz: 2, confidence: 2, startTimeMs: 2, startFrequencyHz: 2, samplingFrequencyHz: 2, channelized: true, signalId: 4, snrDbm: 20, stopTimeMs: 2, enterCase: "b", currentIdInfo: "b", oprNote: "zek", signalType: "b", status: "kesildi" },
  { position: 5, os: 1, temporary: true, cut: true, critical: true, stopFrequencyHz: 1, confidence: 1, startTimeMs: 1, startFrequencyHz: 1, samplingFrequencyHz: 1, channelized: true, signalId: 5, snrDbm: 10, stopTimeMs: 1, enterCase: "a", currentIdInfo: "a", oprNote: "cag", signalType: "a", status: "canlı" },
  { position: 6, os: 2, temporary: false, cut: false, critical: false, stopFrequencyHz: 2, confidence: 2, startTimeMs: 2, startFrequencyHz: 2, samplingFrequencyHz: 2, channelized: true, signalId: 6, snrDbm: 20, stopTimeMs: 2, enterCase: "b", currentIdInfo: "b", oprNote: "zek", signalType: "b", status: "kesildi" },
  { position: 7, os: 1, temporary: true, cut: true, critical: true, stopFrequencyHz: 1, confidence: 1, startTimeMs: 1, startFrequencyHz: 1, samplingFrequencyHz: 1, channelized: true, signalId: 7, snrDbm: 10, stopTimeMs: 1, enterCase: "a", currentIdInfo: "a", oprNote: "cag", signalType: "a", status: "canlı" },
  { position: 8, os: 2, temporary: false, cut: false, critical: false, stopFrequencyHz: 2, confidence: 2, startTimeMs: 2, startFrequencyHz: 2, samplingFrequencyHz: 2, channelized: true, signalId: 8, snrDbm: 20, stopTimeMs: 2, enterCase: "b", currentIdInfo: "b", oprNote: "zek", signalType: "b", status: "kesildi" },
  { position: 9, os: 1, temporary: true, cut: true, critical: true, stopFrequencyHz: 1, confidence: 1, startTimeMs: 1, startFrequencyHz: 1, samplingFrequencyHz: 1, channelized: true, signalId: 9, snrDbm: 10, stopTimeMs: 1, enterCase: "a", currentIdInfo: "a", oprNote: "cag", signalType: "a", status: "canlı" },
  { position: 10, os: 2, temporary: false, cut: false, critical: false, stopFrequencyHz: 2, confidence: 2, startTimeMs: 2, startFrequencyHz: 2, samplingFrequencyHz: 2, channelized: true, signalId: 10, snrDbm: 20, stopTimeMs: 2, enterCase: "b", currentIdInfo: "b", oprNote: "zek", signalType: "b", status: "kesildi" },
] */

@Component({
  selector: 'table-example',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class Table implements OnInit {

  //displayedColumns: string[] = ['select', 'position', 'name', 'weight', 'symbol'];
  displayedColumns: string[] = [
    'signalId',
    'frequency',
    'bandWidth',
    'snrDbm',
    'signalType',
    'confidence',
    'currentIdInfo',
    'status',
    'startDate',
    'finishDate',
    'oprNote',
  ];
  //dataSource = new TableVirtualScrollDataSource<PeriodicElement>(ELEMENT_DATA);
  selection = new SelectionModel<PeriodicElement>(true, []);

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  id: null | ReturnType<typeof setTimeout> = null

  ngOnInit() {
    this.dataSource.sort = this.sort;
    
    this.createMockData();
    this.id = setInterval(() => {
      this.createMockData();
    }, 200);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach((row: PeriodicElement) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  mockDataList: any[] = [];
  mockDataLength: number = 30
  dataSource: any = [];
  //dataSource = new TableVirtualScrollDataSource<PeriodicElement>();

  counter = 0
  createMockData() {
    const ELEMENT_DATA: PeriodicElement[] = Array.from({ length: this.mockDataLength }, (v, i) => (
      {
        os: i,
        temporary: true,
        cut: true,
        critical: true,
        stopFrequencyHz: i * 10,
        confidence: 1 * 2,
        startTimeMs: i * 100,
        startFrequencyHz: i * 3,
        samplingFrequencyHz: i * 20,
        channelized: true,
        signalId: i + 1,
        signalType: i + "cag",
        snrDbm: i,
        stopTimeMs: i * 400,
        enterCase: i + "enter",
        currentIdInfo: i + "current",
        oprNote: i + "note",
        status: i + "status",
        position: i
      }
    ));
    
    this.mockDataLength = this.mockDataLength + 50
    if(this.counter === 0){
      this.dataSource = new TableVirtualScrollDataSource<PeriodicElement>(ELEMENT_DATA);
    }
    //this.dataSource.data = [...this.dataSource.data, ...ELEMENT_DATA]
    this.dataSource.sort = this.sort;
    this.counter = this.counter + 1
    console.log('this.counter', this.counter)
    
    //console.log('this.dataSource', this.dataSource) 
    //console.log(ELEMENT_DATA.length, this.dataSource.length, this.counter)
    
  }


}
