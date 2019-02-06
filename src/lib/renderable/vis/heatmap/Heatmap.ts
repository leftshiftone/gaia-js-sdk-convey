import * as d3 from 'd3';
// noinspection TsLint
import dataTs from "./data";
import "./Heatmap.scss";
import D3Support from '../D3Support';

/**
 * Implementation of the 'headmap' markup element.
 */
export class Heatmap {

    private itemSize = 18;
    private cellSize = this.itemSize - 1;
    private width = 800;
    private height = 800;
    private margin = {top: 20, right: 20, bottom: 20, left: 25};
    private colorCalibration = ['#f6faaa', '#FEE08B', '#FDAE61', '#F46D43', '#D53E4F', '#9E0142'];

    /**
     * {@inheritDoc}
     */
    public render(): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("lto-vis-heatmap");
        div.innerHTML = '<svg class="heatmap"></svg>';
        return div;
    }

    public init() {
        const dailyValueExtent = {};

        const svg = d3.select('.heatmap');
        const heatmap = D3Support.initSvg(svg, this.width, this.height, this.margin);

        const data = dataTs;
        data.forEach((valueObj: any) => {
            valueObj['date'] = new Date(valueObj['timestamp']);
            const day = valueObj['day'] = D3Support.getMonthAndDay(valueObj.date);

            const dayData = dailyValueExtent[day] = (dailyValueExtent[day] || [1000, -1]);
            const pmValue = valueObj['value'];
            dayData[0] = d3.min([dayData[0], pmValue]);
            dayData[1] = d3.max([dayData[1], pmValue]);
        });

        const dateExtent = d3.extent(data, (d: any) => d.date);
        const dayOffset = D3Support.getDayOfYear(dateExtent[0]);
        this.renderAxis(this.itemSize, dateExtent, svg, this.margin);
        const rect = this.renderRects(heatmap.selectAll('rect'), data, dayOffset);
        this.renderColor(true, dayOffset, dailyValueExtent, rect);

        d3.select(self.frameElement).style('height', '600px');
    }

    private renderAxis(itemSize: number, dateExtent: any[], svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>, margin: any) {
        const axisWidth = itemSize * (D3Support.getDayOfYear(dateExtent[1]) - D3Support.getDayOfYear(dateExtent[0]) + 1);
        const axisHeight = itemSize * 24;

        const xAxisScale = d3.scaleTime();
        const yAxisScale = d3.scaleLinear().range([0, axisHeight]).domain([0, 24]);
        const xAxis = d3.axisTop(xAxisScale).ticks(d3.timeDay.every(3)).tickFormat((a) => D3Support.getMonthAndDay(a as Date));
        const yAxis = d3.axisLeft(yAxisScale).ticks(5).tickFormat((a) => d3.format('02d')(a as Number));

        xAxis.scale(xAxisScale.range([0, axisWidth]).domain([dateExtent[0], dateExtent[1]]));
        svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('class', 'x axis')
            .call(xAxis)
            .append('text')
            .text('date')
            .attr('transform', 'translate(' + (axisWidth + 20) + ',-10)');
        svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('class', 'y axis')
            .call(yAxis)
            .append('text')
            .text('time')
            .attr('transform', 'translate(-10,' + axisHeight + ') rotate(-90)');
    }

    private renderColor(renderByCount:boolean, dayOffset:number, dailyValueExtent:any, rect:d3.Selection<SVGRectElement, any, any, any>) {
        rect.filter((d: any) => (d.value >= 0))
            .transition()
            .delay((d: any) => (D3Support.getDayOfYear(d.date) - dayOffset) * 15)
            .duration(500)
            .attrTween('fill', (d: any, i: any, a: any) => {
                const colorIndex = d3.scaleQuantize()
                    .range([0, 1, 2, 3, 4, 5])
                    .domain((renderByCount ? [0, 500] : dailyValueExtent[d.day]));

                return d3.interpolate(a, this.colorCalibration[colorIndex(d.value)]);
            });
    }

    private renderRects(rect:d3.Selection<d3.BaseType, any, SVGGElement, any>, data:any, dayOffset:number) {
        const newRect = rect
            .data(data)
            .enter()
            .append('rect')
            .attr('width', this.cellSize)
            .attr('height', this.cellSize)
            .attr('x', (d: any) => this.itemSize * (D3Support.getDayOfYear(d.date) - dayOffset))
            .attr('y', (d: any) => parseInt(d.timestamp.substr(11, 2), 10) * this.itemSize)
            .attr('fill', '#ffffff');
        rect.filter((d: any) => d.value > 0)
            .append('title')
            .text((d: any) => D3Support.getMonthAndDay(d.date) + ' ' + d.value);

        return newRect;
    }

}
