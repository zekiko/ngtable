import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClient } from '@angular/common/http'

import { MatSidenav } from '@angular/material/sidenav';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


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

export interface DialogData {
    animal: string;
    name: string;
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

    showFiller = false;
    isDrawerOpen = false


    constructor(private _liveAnnouncer: LiveAnnouncer,
        private http: HttpClient,
        public dialog: MatDialog) { }

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

    filterValues: any = {
        frequencyHzStart: 0,
        frequencyHzEnd: 0,
        bandwidthHzStart: 0,
        bandwidthHzEnd: 0,
        confidenceStart: 0,
        confidenceEnd: 0,
        startTimeMs: 0,
        endTimeMs: 0,
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

    handleClearButton() {
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

    handleSearchButton() {
        console.log(this.filterValues)
        this.http
            //.post(this.url + '/api/audio-session/', model.encode())
            .get(`http://ews-build.esensi.local:8085/api/detection/gist/cagri/`, { responseType: 'text' }) //todo: parametrik olacak, yeri değişecek
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


    /* animal: string;
    name: string;
    openDialog(): void {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
            width: '250px',
            data: { name: this.name, animal: this.animal },
        });
        
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.animal = result;
        });
    } */

    isSelectDrawerOpen = false
    handleSelectDrawerClick() {
        this.isSelectDrawerOpen = true
        this.isCreateReportOpen = false
        this.isDrawerOpen = true
    }

    isCreateReportOpen = false
    handleCreateReportButton() {
        console.log("create")
        this.isCreateReportOpen = true
        this.isSelectDrawerOpen = false
        this.isDrawerOpen = true
    }

    reportCanceled(eventData: { open: boolean }) {
        console.log("reportCanceled...", eventData)
        this.isCreateReportOpen = eventData.open
        this.isDrawerOpen = eventData.open
    }

    handleDrawerClose() {
        this.isCreateReportOpen = false
        this.isSelectDrawerOpen = false
        this.isDrawerOpen = false
    }

}

@Component({
    selector: 'create-report',
    templateUrl: 'create-report.html',
    styleUrls: ['create-report.scss'],

})
export class CreateReportComponent {
    constructor() { }

    @Input() data: any = {}
    @Output() reportCancel = new EventEmitter<{ open: boolean }>();
    drawerOpen: boolean;

    handleCancelReport() {
        console.log("cancel report")
        this.data = {}
        this.drawerOpen = false
        this.reportCancel.emit({ open: this.drawerOpen });
    }

    reportName: string = ''
    handleReportNameInput(e: any) {
        console.log(this.reportName, e)
    }

    handleSaveReport() { //request to backend
        console.log(this.data, this.reportName)
    }
}

@Component({
    selector: 'select-report',
    templateUrl: 'select-report.html',
    styleUrls: ['select-report.scss'],

})
export class SelectReportComponent implements OnInit {
    constructor() { }
    panelOpenState = false;
    reportDataList : any = []

    ngOnInit(){
        this.createMockReportList()
        console.log(this.reportDataList)
    }

    handleSelectReport(e: any){
console.log(e)
    }

    createMockReportList() {
        for (let i = 0; i < 100; i++) {
            const reportData = {
                reportName: i + 'name',
                frequencyHzStart: i + 'frequencyHzStart',
                frequencyHzEnd: i + 'frequencyHzEnd',
                bandwidthHzStart: i + 'bandwidthHzStart',
                bandwidthHzEnd: i + 'bandwidthHzEnd',
                confidenceStart: i + 'confidenceStart',
                confidenceEnd: i + 'confidenceEnd',
                startTimeMs: i + 'startTimeMs',
                endTimeMs: i + 'endTimeMs',
                durationMsStart: i + 'durationMsStart',
                durationMsEnd: i + 'durationMsEnd',
                snrDbStart: i + 'snrDbStart',
                snrDbEnd: i + 'snrDbEnd',
                signalType: i + 'signalType',
                source: i + 'source',
                identification: i + 'identification',
            }
            this.reportDataList = [...this.reportDataList, reportData]
        }

    }

}

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog.html',
    styleUrls: ['dialog.scss'],

})
export class DialogOverviewExampleDialog {
    constructor(
        public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}