import {
  Component, OnInit, ViewEncapsulation,
  SimpleChanges, OnChanges, ElementRef,
  ViewChild, ViewChildren, QueryList,
  HostListener
} from '@angular/core';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";

const DATA = Array.from({ length: 10 }, (v, i) => ({
  id: i + 1,
  name: `Element #${i + 1}`
}));


@Component({
  selector: 'app-sticky-example',
  templateUrl: './sticky-example.component.html',
  styleUrls: ['./sticky-example.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})

export class StickyExampleComponent {
  displayedColumns: string[] = [
    'id',
    'frequency',
    'bandWidth',
    'snr',
    'modulation',
    'modulationPercentage',
    'currentIdInfo',
    'status',
    'startDate',
    'finishDate',
    'oprNote',
    'addItem',
  ];

  dataSource = new TableVirtualScrollDataSource(DATA);
  @ViewChild("scrollframe", { static: true })

  public virtualScrollViewport: CdkVirtualScrollViewport;

  id: null | ReturnType<typeof setTimeout> = null
  length3: number = 10
  userScroll: boolean = false
  autoScrolled: boolean = false

  prevScrollHeight: number = 0

  lol = false

  @ViewChildren('item') itemElements: QueryList<any>;
  private scrollContainer: any;
  private isNearBottom = true;

  fon() {
    const DATA = Array.from({ length: this.length3 }, (v, i) => ({
      id: i + 1,
      name: `Element #${i + 1}`
    }));
    this.length3 = this.length3 + 10
    /* console.log(this.dataSource, DATA) */
    this.dataSource = new TableVirtualScrollDataSource(DATA)
    //    console.log('DATA.length', this.dataSource.filteredData.length)
    console.log('this.lol', this.lol)
  }

  ngAfterViewInit() {
    this.scrollContainer = this.virtualScrollViewport.elementRef.nativeElement;
    this.itemElements.changes.subscribe(_ => this.onItemElementsChanged());

    this.prevScrollHeight = this.scrollContainer.scrollHeight
    console.log('ngAfterViewInit ', this.prevScrollHeight, this.scrollContainer.scrollTop)

    this.fon();
    this.id = setInterval(() => {
      this.fon();
    }, 2000);
  }

  handleBasClick() {
    this.lol = !this.lol
  }

  private onItemElementsChanged(): void {
    /* console.log('onItemElementsChanged',
      this.prevScrollHeight,
      this.scrollContainer.scrollHeight,
      this.scrollContainer.scrollTop,
      this.scrollContainer.offsetHeight,
      this.prevScrollHeight - this.scrollContainer.scrollTop - this.scrollContainer.offsetHeight,
      this.scrollContainer.scrollHeight - this.scrollContainer.scrollTop - this.scrollContainer.offsetHeight) */

    if (this.isUserNearBottom()) {
      this.scrollToBottom();
    }

    this.prevScrollHeight = this.scrollContainer.scrollHeight
  }

  private scrollToBottom(): void {
    console.log("scrolled to bottom")
    this.scrollContainer.scroll({
      top: this.scrollContainer.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return this.prevScrollHeight - this.scrollContainer.scrollTop - this.scrollContainer.offsetHeight <= this.scrollContainer.scrollHeight - this.prevScrollHeight;
    //return true
  }

  scrolled(event: any): void {
    /* console.log("scroolled") */
    this.isNearBottom = this.isUserNearBottom();
    /* console.log(this.scrollContainer.scrollHeight,
      this.scrollContainer.scrollTop,
      this.scrollContainer.offsetHeight) */
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

  handleAddButton() {
    console.log("handleAddButton is clicked!")
  }

}
