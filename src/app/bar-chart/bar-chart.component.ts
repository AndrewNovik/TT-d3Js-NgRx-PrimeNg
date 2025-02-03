import { Component, Input, ViewChild } from '@angular/core';
import { FileData } from '../types';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  template: `<div #svg></div>`,
})
export class BarChartComponent {
  @Input() data: FileData[] = [];
  @ViewChild('svg', { static: true }) svg: any;

  private width: number = 0;
  private height: number = 0;
  private fontSize: number = 11;

  ngOnInit() {
    if (this.data.length) {
      this.generateBarChart();
    }
  }

  generateBarChart() {
    const dataset = this.data.map((d) => d.value);
    this.width = this.data.length * this.fontSize * 4;
    this.height = Math.max(...dataset) * 1.5;

    const svg = d3
      .select(this.svg.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'bar-chart')
      .append('g');

    svg
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('x', (d, i) => i * (this.width / dataset.length))
      .attr('width', this.width / dataset.length - 1)
      .attr('y', (d) => this.height - d)
      .attr('height', (d) => d)
      .attr('fill', '#10b981');

    svg
      .selectAll('text')
      .data(this.data)
      .enter()
      .append('text')
      .text((d) => `${d.category} - ${d.value}`)
      .attr(
        'x',
        (d, i) => i * (this.width / dataset.length) + this.fontSize / 3
      )
      .attr('y', (d) => {
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
      .attr('fill', (d) => {
        if (
          this.height - d.value + this.fontSize >
          this.height - this.fontSize
        ) {
          return 'black';
        } // если шрифт больше чем высота значения бара
        return 'white';
      });
  }
}
