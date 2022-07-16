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

        this.id = setInterval(() => {
            this.createMockData();
        }, 1000);
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
    mockDataLength: number = 20
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

        if (this.liveMode) {
            this.mockDataListTemp = [...this.mockDataList]
            if (this.mockDataListTemp.length <= this.pageSize) {
                this.renderedData = [...this.mockDataListTemp]
            } else {
                this.renderedData = [...this.mockDataListTemp.slice(this.mockDataListTemp.length - this.pageSize, this.mockDataListTemp.length)]
            }
            this.totalPageCount = Math.ceil(this.mockDataListTemp.length / this.pageSize)
            this.pageNumber = this.totalPageCount
            this.dataSource = new MatTableDataSource([...this.renderedData])


            //console.log(this.renderedData.length, this.mockDataListTemp.length, this.mockDataList.length, this.pageNumber, this.totalPageCount)
            /* this.scrollToBottom(700, 'auto')
            this.scrollToBottom(0, 'smooth') */
            this.scrollToBottom(500, 'auto')
            setTimeout(() => {
                this.myScrollContainer?.nativeElement?.scrollTo({
                    top: this.myScrollContainer?.nativeElement?.scrollHeight,
                    behavior: 'smooth'
                })
            }, 10)
        }

        this.counter++;
        this.mockDataLength = this.mockDataLength + 60
    }

    //infinite scroll
    selectedRowIndex: number = -1;
    scrolling = false
    onTableScroll(e: any) {
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
            this.dataSource = [...this.renderedData]
            this.scrollToBottom(2500, 'auto')
            console.log("top s roll")
        }

        //bottom scroll
        if (this.myScrollContainer.nativeElement.scrollTop + this.myScrollContainer.nativeElement.offsetHeight === this.myScrollContainer.nativeElement.scrollHeight
            && this.pageNumber < this.totalPageCount) {
            this.renderedData = [...this.mockDataListTemp.slice((this.pageNumber) * this.pageSize, (this.pageNumber + 1) * this.pageSize)]
            if (this.renderedData.length < this.pageSize) {
                this.renderedData = [...this.mockDataListTemp.slice(this.mockDataListTemp.length - this.pageSize, this.mockDataListTemp.length)]
            }
            this.pageNumber++
            this.dataSource = [...this.renderedData]
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