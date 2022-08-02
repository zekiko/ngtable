import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http'


export interface Detection {
    frequencyHzStart: string;
    frequencyHzEnd: string;
    bandwidthHzStart: string;
    bandwidthHzEnd: string;
    confidenceStart: number;
    confidenceEnd: number;
    startTimeMs: Date;
    endTimeMs: Date;
    durationMsStart: number;
    durationMsEnd: number;
    snrDbStart: number;
    snrDbEnd: number;
    signalType: string
    source: string
    identification: string
}

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


    displayedColumns: string[] = [
        'signalId',
        'frequency',
        'band',
        'snr',
        'signalType',
        'modulation',
        'identification',
        'status',
        'source',
        'start',
        'duration'
    ];
    //dataSource = new MatTableDataSource(ELEMENT_DATA);
    dataSource: any = [];

    constructor(private _liveAnnouncer: LiveAnnouncer, private http: HttpClient) { }

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
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    filterValues : any = {
        frequencyHzStart: '',
        frequencyHzEnd: '',
        bandwidthHzStart: '',
        bandwidthHzEnd: '',
        confidenceStart: 0,
        confidenceEnd: 0,
        startTimeMs: '',
        endTimeMs: '',
        durationMsStart: 0,
        durationMsEnd: 0,
        snrDbStart: 0,
        snrDbEnd: 0,
        signalType: '',
        source: '',
        identification: ''
    }

    handleSearchInput(filterValue: string, type: string) {
        console.log("applying filter", filterValue, type)
        this.filterValues[type] = filterValue;
        console.log(this.filterValues)
    }

    handleClearButton(){
        this.filterValues = {
            frequencyHzStart: '',
            frequencyHzEnd: '',
            bandwidthHzStart: '',
            bandwidthHzEnd: '',
            confidenceStart: 0,
            confidenceEnd: 0,
            startTimeMs: '',
            endTimeMs: '',
            durationMsStart: 0,
            durationMsEnd: 0,
            snrDbStart: 0,
            snrDbEnd: 0,
            signalType: '',
            source: '',
            identification: ''
        }
        console.log(this.filterValues)
    }

    handleSearchButton(){
        this.http
        //.post(this.url + '/api/audio-session/', model.encode())
        .get(`http://ews-build.esensi.local:8085/api/detection/gist/`, { responseType: 'text' }) //todo: parametrik olacak, yeri değişecek
        .toPromise()
        .then((response) => {
          let resObj = JSON.parse(response)
          
        })
        .catch((e) => console.log('Error', e));
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

    scrollToBottom(buffer: number, behavior: string) {
        //console.log(this.myScrollContainer.nativeElement.scrollTop + this.myScrollContainer.nativeElement.offsetHeight, this.myScrollContainer.nativeElement.scrollHeight)
        this.myScrollContainer?.nativeElement?.scrollTo({
            top: this.myScrollContainer?.nativeElement?.scrollHeight - buffer,
            behavior: behavior
        })
    }

}