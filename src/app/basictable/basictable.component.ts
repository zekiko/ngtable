import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

/**
 * @title Table with sorting
 */
@Component({
  selector: 'basictable',
  styleUrls: ['basictable.component.css'],
  templateUrl: 'basictable.component.html',
})
export class BasicTable implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  //dataSource = new MatTableDataSource(ELEMENT_DATA);
  dataSource: any = [];

  constructor(private _liveAnnouncer: LiveAnnouncer) { }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('scrollframe') private myScrollContainer: ElementRef;

  id: null | ReturnType<typeof setTimeout> = null


  ngOnInit(): void {
    this.createMockData();

    this.id = setInterval(() => {
      this.createMockData();
    }, 3000);
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  isFiltering = false
  applyFilter(filterValue: string) {
    if (filterValue.length > 0) {
      this.isFiltering = true
    } else {
      this.isFiltering = false
      this.dataSource = new MatTableDataSource(this.mockDataList.splice(this.mockDataList.length - 10, this.mockDataList.length));
    }
    //console.log('filterValue', filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log("fi,ilter", this.dataSource.filter)
  }

  mockDataList: any[] = [];
  mockDataLength: number = 100
  counter = 0
  createMockData() {
    const ELEMENT_DATA: PeriodicElement[] = Array.from({ length: this.mockDataLength }, (v, i) => (
      {
        name: i + " name",
        position: i + 1,
        weight: i * 10,
        symbol: i + " symbol"
      }
    ));
    this.mockDataList = [...ELEMENT_DATA];

    this.counter++;

    //console.log("lala", this.myScrollContainer?.nativeElement?.scrollTop)
    if (!this.scrolling && !this.isFiltering) {
      this.upScrollStartIndex = this.mockDataList.indexOf(this.mockDataList[this.mockDataList.length - 50])
      this.dataSource = new MatTableDataSource(this.mockDataList.slice(this.upScrollStartIndex, this.mockDataList.length))
      this.dataSource.sort = this.sort;

      this.myScrollContainer?.nativeElement?.scrollTo({
        top: this.myScrollContainer?.nativeElement?.scrollHeight - 700,
        behavior: 'auto'
      })

      this.myScrollContainer?.nativeElement?.scrollTo({
        top: this.myScrollContainer?.nativeElement?.scrollHeight,
        behavior: 'smooth'
      })
    }

    //console.log(this.mockDataList.length, this.scrolling, this.dataSource.length)
    this.mockDataLength = this.mockDataLength + 5

    //console.log('this.counter', this.counter, this.dataSource.length, this.mockDataList.length)
    this.totalrow = this.dataSource.length
  }
  upScrollStartIndex = -1
  pageSize = 10

  //infinite scroll
  selectedRowIndex: number = -1;

  madafaka = 0
  totalrow = 0;
  scrolling = false
  onTableScroll(e: any) {
    this.scrolling = true
    if (this.myScrollContainer.nativeElement.scrollTop + this.myScrollContainer.nativeElement.offsetHeight === this.myScrollContainer.nativeElement.scrollHeight) {
      this.scrolling = false
    }

    //console.log("this.scrolling", this.scrolling)

    if (this.myScrollContainer.nativeElement.scrollTop <= 0) {
      this.madafaka++

      console.log(this.upScrollStartIndex, this.mockDataList.length)
      if (this.upScrollStartIndex >= 0) {
        this.myScrollContainer.nativeElement.scrollTop = 100

        if (this.upScrollStartIndex - this.pageSize < 0 && Math.abs(this.upScrollStartIndex - this.pageSize) < this.pageSize) {
          this.dataSource = new MatTableDataSource([...this.mockDataList.slice(0, this.upScrollStartIndex), ...this.dataSource.data])

        } else {
          this.dataSource = new MatTableDataSource([...this.mockDataList.slice(this.upScrollStartIndex - this.pageSize, this.upScrollStartIndex), ...this.dataSource.data])

        }
        this.upScrollStartIndex = this.upScrollStartIndex - this.pageSize

      }
    }
    this.dataSource.sort = this.sort;

  }

  handleScrollBottomClick() {

    console.log("scoll bottomomomo", this.scrolling)

    this.myScrollContainer.nativeElement.scrollTo({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      behavior: 'smooth'
    })

  }


  getTableData(start: number, end: number) {
    return this.mockDataList.filter((value: any, index: number) => index >= start && index < end)
  }


  selectedRow(row: any) {
    console.log('selectedRow', row)
  }

}