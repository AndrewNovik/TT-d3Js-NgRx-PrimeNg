import { Component, Input, ViewChild } from '@angular/core';
import { FileData } from '../types';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import * as d3 from 'd3';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-bar-chart',
  imports: [ToggleSwitchModule, FormsModule],
  standalone: true,
  template: `<div
      class="flex align-content-center justify-content-between py-2"
    >
      <span>По возрастанию</span
      ><p-toggleswitch
        [(ngModel)]="sortAscending"
        (onChange)="changeSortingBar(sortAscending)"
      />
    </div>
    <div class="custom-overflow" #svg></div>`,
  styles: ['.custom-overflow { overflow-x: scroll; max-width: 40vw}'],
})
export class BarChartComponent {
  @Input() data: FileData[] = [];
  @ViewChild('svg', { static: true }) svg: any;

  public sortAscending: boolean = false;
  public isChartCreated: boolean = false;
  private svgChart: any;
  private width: number = 0;
  private height: number = 0;
  private fontSize: number = 11;

  ngOnInit() {
    if (this.data.length) {
      this.generateBarChart();
    }
  }

  generateBarChart(sortAscending: boolean = false) {
    if (this.isChartCreated) {
      this.svgChart = d3.select(this.svg.nativeElement).select('svg').remove();
    }

    const dataset = this.data.map((d) => d.value);
    this.width = this.data.length * this.fontSize * 4;
    this.height = Math.max(...dataset) * 1.5;

    this.svgChart = d3
      .select(this.svg.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'bar-chart')
      .append('g');

    this.svgChart
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .sort((a: any, b: any) => {
        console.log(a, b);
        return sortAscending ? d3.ascending(a, b) : -1;
      })
      .attr('x', (d: any, i: number) => i * (this.width / dataset.length))
      .attr('width', this.width / dataset.length - 1)
      .attr('y', (d: number) => this.height - d)
      .attr('height', (d: any) => d)
      .attr('fill', '#10b981');

    this.svgChart
      .selectAll('text')
      .data(this.data)
      .enter()
      .append('text')
      .sort((a: any, b: any) => {
        return sortAscending ? d3.ascending(a.value, b.value) : -1;
      })
      .text((d: { category: any; value: any }) => `${d.category} - ${d.value}`)
      .attr(
        'x',
        (d: any, i: number) =>
          i * (this.width / dataset.length) + this.fontSize / 3
      )
      .attr('y', (d: { value: number }) => {
        if (
          this.height - d.value + this.fontSize >
          this.height - this.fontSize
        ) {
          return this.height - d.value - this.fontSize / 2;
        }
        return this.height - d.value + this.fontSize;
      })
      .attr('font-family', 'sans-serif')
      .attr('font-size', `${this.fontSize}`)
      .attr('fill', (d: { value: number }) => {
        if (
          this.height - d.value + this.fontSize >
          this.height - this.fontSize
        ) {
          return 'black';
        } // если шрифт больше чем высота значения бара
        return 'white';
      });

    this.isChartCreated = true;
  }

  changeSortingBar(sortAscending: boolean) {
    this.generateBarChart(sortAscending);
  }
}
