import { Component, Input, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { FileData } from '../types';

@Component({
  selector: 'app-pie-chart',
  template: `<div #svg></div>`,
})
export class PieChartComponent {
  @Input('data') data: FileData[] = [];
  @ViewChild('svg', { static: true }) svg: any;

  private width = 250;
  private height = 250;
  private colors: any;
  private radius = Math.min(this.width, this.height) / 2 - 50;

  ngOnInit(): void {
    if (this.data.length) {
      this.createColors(this.data);
      this.drawChart();
    }
  }

  private createColors(data: any[]): void {
    const defaultColors = [
      '#ADDFAD',
      '#50C878',
      '#54FF9F',
      '#006633',
      '#004524',
      '#1E5945',
      '#343B29',
      '#2E8B57',
    ];

    this.colors = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.value))
      .range(defaultColors);
  }

  private drawChart(): void {
    const svg: any = d3
      .select(this.svg.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'pie-chart')
      .append('g')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    const pie = d3
      .pie()
      .sort((a: any, b: any) => d3.ascending(a.category, b.category))
      .value((d: any) => d.value);

    const arcs = pie(this.data as any);

    const mainArc = d3
      .arc()
      .innerRadius(this.radius * 0.5)
      .outerRadius(this.radius * 0.8);

    const labelArc = d3
      .arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9);

    svg
      .selectAll()
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', mainArc) // прогон по данным
      .attr('fill', (d: any) => this.colors(d.data.value)) // заливка цветом
      .attr('stroke', 'white') // границы сегментов
      .style('stroke-width', '2px') // ширина границы сегментов
      .style('opacity', 0.7); // прозрачность сегментов

    svg
      .selectAll()
      .data(arcs)
      .enter()
      .append('polyline') // линии от сегметов
      .attr('stroke', 'black')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', (d: any) => {
        const posA = mainArc.centroid(d); // центральная точка на дуге сегмента
        const posB = labelArc.centroid(d); // точка на дуге сегмента для лейблс
        const posC = labelArc.centroid(d); // Делаем копию
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // вычесляем угол, чтобы узнать вправо рисовать продолжение линии или влево
        posC[0] = this.radius * 0.95 * (midangle < Math.PI ? 1 : -1); // меняем координату в зависимости от угла
        return [posA, posB, posC];
      });

    svg
      .selectAll()
      .data(arcs)
      .enter()
      .append('text')
      .text((d: any) => `${d.data.category} - ${d.data.value}`)
      .attr('transform', (d: any) => {
        const pos = labelArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = this.radius * 0.95 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', (d: any) => {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? 'start' : 'end';
      });
  }
}
