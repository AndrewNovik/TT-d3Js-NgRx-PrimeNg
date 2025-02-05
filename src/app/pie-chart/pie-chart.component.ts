import { Component, Input, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { FileData } from '../types';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pie-chart',
  template: `<div
      class="flex align-content-center justify-content-between py-2"
    >
      <span>В алфавитном порядке</span
      ><p-toggleswitch
        [(ngModel)]="sortAlphabetically"
        (onChange)="changeSortingPie(sortAlphabetically)"
      />
    </div>
    <div class="custom-overflow " #svg></div>`,
  styles: ['.custom-overflow { overflow-x: scroll; max-width: 30vw}'],
  imports: [ToggleSwitchModule, FormsModule],
  standalone: true,
})
export class PieChartComponent {
  @Input('data') data: FileData[] = [];
  @ViewChild('svg', { static: true }) svg: any;

  public sortAlphabetically = false;
  private svgChart: any;
  private pieChart: any;
  private mainArc: any;
  private labelArc: any;
  private arcs: any;

  public isChartCreated: boolean = false;
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

  private drawChart(alfabeticalSort: boolean = false): void {
    if (this.isChartCreated) {
      this.svgChart = d3.select(this.svg.nativeElement).select('svg').remove();
    }

    // если файл с большим набором данных, чтобы не слипались значения
    if (this.data.length > 10) {
      this.width = this.data.length * 20;
      this.height = this.data.length * 20;
      this.radius = this.width / 2 - 50;
    }

    this.svgChart = d3
      .select(this.svg.nativeElement)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('class', 'pie-chart')
      .append('g')
      .attr('viewBox', '0 0 500 500')
      .attr('transform', `translate(${this.width / 2},${this.height / 2})`);

    this.pieChart = d3
      .pie()
      .sort((a: any, b: any) => {
        return alfabeticalSort ? d3.ascending(a.category, b.category) : -1;
      })
      .value((d: any) => d.value);

    this.arcs = this.pieChart(this.data as any);

    this.pieChart = d3
      .pie()
      .sort((a: any, b: any) => {
        return alfabeticalSort ? d3.ascending(a.category, b.category) : -1;
      })
      .value((d: any) => d.value);

    this.mainArc = d3
      .arc()
      .innerRadius(this.radius * 0.5)
      .outerRadius(this.radius * 0.8);

    this.labelArc = d3
      .arc()
      .innerRadius(this.radius * 0.9)
      .outerRadius(this.radius * 0.9);

    this.svgChart
      .selectAll()
      .data(this.arcs)
      .enter()
      .append('path')
      .attr('d', this.mainArc) // прогон по данным
      .attr('fill', (d: any) => this.colors(d.data.value)) // заливка цветом
      .attr('stroke', 'white') // границы сегментов
      .style('stroke-width', '2px') // ширина границы сегментов
      .style('opacity', 0.7); // прозрачность сегментов

    this.svgChart
      .selectAll()
      .data(this.arcs)
      .enter()
      .append('polyline') // линии от сегметов
      .attr('stroke', 'black')
      .style('fill', 'none')
      .attr('stroke-width', 1)
      .attr('points', (d: any) => {
        const posA = this.mainArc.centroid(d); // центральная точка на дуге сегмента
        const posB = this.labelArc.centroid(d); // точка на дуге сегмента для лейблс
        const posC = this.labelArc.centroid(d); // Делаем копию
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // вычесляем угол, чтобы узнать вправо рисовать продолжение линии или влево
        posC[0] = this.radius * 0.95 * (midangle < Math.PI ? 1 : -1); // меняем координату в зависимости от угла
        return [posA, posB, posC];
      });

    this.svgChart
      .selectAll()
      .data(this.arcs)
      .enter()
      .append('text')
      .text((d: any) => `${d.data.category} - ${d.data.value}`)
      .attr('transform', (d: any) => {
        const pos = this.labelArc.centroid(d);
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = this.radius * 0.95 * (midangle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style('text-anchor', (d: any) => {
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? 'start' : 'end';
      });

    this.isChartCreated = true;
  }

  changeSortingPie(sortAlfabetical: boolean) {
    this.drawChart(sortAlfabetical);
  }
}
