import * as d3 from 'd3';
// noinspection TsLint
import dataTs from "./data";
import "./Heatmap.scss";
import D3Support from '../D3Support';

/**
 * Implementation of the 'headmap' markup element.
 */
export class Heatmap {

    /**
     * {@inheritDoc}
     */
    public render(): HTMLElement {
        const html = `
    <!-- calibration and render type controller -->
    <div class="calibration" role="calibration">
        <div class="group" role="example">
            <svg width="120" height="17">
            </svg>
            <div role="description" class="description">
                <label>Less</label>
                <label>More</label>
            </div>
        </div>
        <div role="toggleDisplay" class="display-control">
            <div>
                <input type="radio" name="displayType" checked/>
                <label>count</label>
            </div>
            <div>
                <input type="radio" name="displayType"/>
                <label>daily</label>
            </div>
        </div>
    </div>
    <!-- heatmap -->
    <svg role="heatmap" class="heatmap"></svg>
</div>
        `;

        // this.init();
        const div = document.createElement("div");
        div.classList.add("days-hours-heatmap");

        div.innerHTML = html;
        return div;
    }

    public init() {
        //UI configuration
        const itemSize = 18;
        const cellSize = itemSize - 1;
        const width = 800;
        const height = 800;
        const margin = {top: 20, right: 20, bottom: 20, left: 25};

        const monthDayFormat = d3.timeFormat('%m.%d');

        const colorCalibration = ['#f6faaa', '#FEE08B', '#FDAE61', '#F46D43', '#D53E4F', '#9E0142'];
        const dailyValueExtent = {};

        initCalibration();

        const svg = d3.select('[role="heatmap"]');
        const heatmap = svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('width', width - margin.left - margin.right)
            .attr('height', height - margin.top - margin.bottom)
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        const data = dataTs;
        data.forEach((valueObj: any) => {
            valueObj['date'] = new Date(valueObj['timestamp']);
            const day = valueObj['day'] = valueObj.date.getDay() + "." + valueObj.date.getMonth();

            const dayData = dailyValueExtent[day] = (dailyValueExtent[day] || [1000, -1]);
            const pmValue = valueObj['value']['PM2.5'];
            dayData[0] = d3.min([dayData[0], pmValue]);
            dayData[1] = d3.max([dayData[1], pmValue]);
        });

        const dateExtent = d3.extent(data, (d: any) => d.date);

        this.renderAxis(itemSize, dateExtent, svg, margin);

        //render heatmap rects
        const dayOffset = D3Support.getDayOfYear(dateExtent[0]);
        const rect = heatmap.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('width', cellSize)
            .attr('height', cellSize)
            .attr('x', (d: any) => itemSize * (D3Support.getDayOfYear(d.date) - dayOffset))
            .attr('y', (d: any) => parseInt(d.timestamp.substr(11, 2), 10) * itemSize)
            .attr('fill', '#ffffff');

        rect.filter((d: any) => d.value['PM2.5'] > 0)
            .append('title')
            .text((d: any) => monthDayFormat(d.date) + ' ' + d.value['PM2.5']);

        renderColor();

        function initCalibration() {
            d3.select('[role="calibration"] [role="example"]')
                .select('svg')
                .selectAll('rect')
                .data(colorCalibration)
                .enter()
                .append('rect')
                .attr('width', cellSize)
                .attr('height', cellSize)
                .attr('x', (d, i) => i * itemSize)
                .attr('fill', (d) => d);

            d3.selectAll('[role="calibration"] [name="displayType"]')
                .on('click', () => renderColor());
        }

        function renderColor() {
            const radio = document.getElementsByName('displayType')[0] as HTMLInputElement;
            const renderByCount = radio.checked;

            rect.filter((d: any) => (d.value['PM2.5'] >= 0))
                .transition()
                .delay((d: any) => (D3Support.getDayOfYear(d.date) - dayOffset) * 15)
                .duration(500)
                .attrTween('fill', (d: any, i: any, a: any) => {
                    const colorIndex = d3.scaleQuantize()
                        .range([0, 1, 2, 3, 4, 5])
                        .domain((renderByCount ? [0, 500] : dailyValueExtent[d.day]));

                    return d3.interpolate(a, colorCalibration[colorIndex(d.value['PM2.5'])]);
                });
        }
        d3.select(self.frameElement).style('height', '600px');
    }

    private renderAxis(itemSize: number, dateExtent: any[], svg: d3.Selection<d3.BaseType, {}, HTMLElement, any>, margin: any) {
        const monthDayFormat = d3.timeFormat('%m.%d');

        const axisWidth = itemSize * (D3Support.getDayOfYear(dateExtent[1]) - D3Support.getDayOfYear(dateExtent[0]) + 1);
        const axisHeight = itemSize * 24;

        const xAxisScale = d3.scaleTime();
        const yAxisScale = d3.scaleLinear().range([0, axisHeight]).domain([0, 24]);
        const xAxis = d3.axisTop(xAxisScale).ticks(d3.timeDay.every(3)).tickFormat((a) => monthDayFormat(a as Date));
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

}
