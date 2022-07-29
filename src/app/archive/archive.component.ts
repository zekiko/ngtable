import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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
    selector: 'archive',
    styleUrls: ['archive.component.scss'],
    templateUrl: 'archive.component.html',
})
export class ArchiveComponent implements OnInit {
    @ViewChild(MatPaginator) paginator: MatPaginator;

    
    displayedColumns: string[] = ['frequency', 'band', 'modulation', 'snr', 'record', 'location', 'id', 'detail', 'start', 'stop'];
    //dataSource = new MatTableDataSource(ELEMENT_DATA);
    dataSource: any = [];
    
    constructor(private _liveAnnouncer: LiveAnnouncer) { }
    
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('scrollframe') private myScrollContainer: ElementRef;
    
    id: null | ReturnType<typeof setTimeout> = null
    
    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }
    
    ngOnInit(): void {
        this.createMockData();
        /* this.id = setInterval(() => {
            this.createMockData();
        }, 5000); */
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
    zeroCounter = 0
    applyFilter(filterValue: string) {
        if (filterValue.length > 0) {
            this.isFiltering = true
            this.zeroCounter = 0
        } else {
            this.zeroCounter++
            this.isFiltering = false
            if (this.zeroCounter <= 0) {
                let threshold = this.mockDataList.length - 100 < 0 ? 0 : this.mockDataList.length - 100
                this.dataSource = new MatTableDataSource(this.mockDataListTemp.slice(threshold, this.mockDataListTemp.length));
                console.log("girdi", this.dataSource.data.length, this.mockDataListTemp.length, threshold)
            }
        }
        this.dataSource = new MatTableDataSource(this.mockDataList)
        this.dataSource.filter = filterValue.trim().toLowerCase();
        console.log("fiilter", this.dataSource.filter, this.zeroCounter)
    }

    mockDataList: any[] = [];
    mockDataLength: number = 200
    counter = 0
    renderedData: any[] = [];
    mockDataListTemp: any[] = [];
    pageNumber = -1
    totalPageCount = -1
    pageSize = 100
    liveMode = true
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
        this.dataSource = new MatTableDataSource(this.mockDataList)
        this.dataSource.paginator = this.paginator;

        this.counter++;
        this.mockDataLength = this.mockDataLength + 60
    }

    //infinite scroll
    selectedRowIndex: number = -1;
    scrolling = false
    onTableScroll(e: any) {
        if (this.isFiltering)
            return;
        this.scrolling = true
        this.liveMode = false

        if (this.myScrollContainer.nativeElement.scrollTop + this.myScrollContainer.nativeElement.offsetHeight === this.myScrollContainer.nativeElement.scrollHeight) {
            this.scrolling = false
            this.liveMode = true
        }

        //top scroll
        if (this.myScrollContainer.nativeElement.scrollTop <= 0 && this.pageNumber - 2 >= 0) {
            this.renderedData = [...this.mockDataListTemp.slice((this.pageNumber - 2) * this.pageSize, (this.pageNumber - 1) * this.pageSize)]
            this.pageNumber--
            this.dataSource = new MatTableDataSource([...this.renderedData])
            this.dataSource.sort = this.sort;
            this.scrollToBottom(2500, 'auto')
        }

        //bottom scroll
        if (this.myScrollContainer.nativeElement.scrollTop + this.myScrollContainer.nativeElement.offsetHeight === this.myScrollContainer.nativeElement.scrollHeight
            && this.pageNumber < this.totalPageCount) {
            this.renderedData = [...this.mockDataListTemp.slice((this.pageNumber) * this.pageSize, (this.pageNumber + 1) * this.pageSize)]
            if (this.renderedData.length < this.pageSize) {
                this.renderedData = [...this.mockDataListTemp.slice(this.mockDataListTemp.length - this.pageSize, this.mockDataListTemp.length)]
            }
            this.pageNumber++
            this.dataSource = new MatTableDataSource([...this.renderedData])
            this.dataSource.sort = this.sort;
            if (!this.liveModeClicked) {
                this.scrollToBottom(3000, 'auto')
            }
        }
    }

    scrollToBottom(buffer: number, behavior: string) {
        //console.log(this.myScrollContainer.nativeElement.scrollTop + this.myScrollContainer.nativeElement.offsetHeight, this.myScrollContainer.nativeElement.scrollHeight)
        this.myScrollContainer?.nativeElement?.scrollTo({
            top: this.myScrollContainer?.nativeElement?.scrollHeight - buffer,
            behavior: behavior
        })
    }
    liveModeClicked = false
    handleScrollBottomClick() {
        this.liveModeClicked = true
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