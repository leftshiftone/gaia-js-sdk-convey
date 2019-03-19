import * as d3 from "d3";
import {BaseType, ScaleBand, ScaleLinear} from "d3";
import StackedbarOptions from './StackedbarOptions';
import {getDigit, getLetter} from '../../../support/Strings';

export default class Stackedbar {

    private readonly options: StackedbarOptions;
    private readonly idMap: Map<string, number> = new Map<string, number>();

    constructor(options: StackedbarOptions = new StackedbarOptions()) {
        this.options = options;
    }

    public render() {
        const div = document.createElement("div");
        div.classList.add("lto-vis-stackedbar");
        div.innerHTML = `<svg width=${this.options.width} height=${this.options.height}></svg>`;

        return div;
    }

    public init(element: HTMLElement) {
        this.options.data.then(data => {
            const svg = d3.select(element.querySelector("svg"));
            const margin = {top: 20, right: 20, bottom: 50, left: 40};
            const width = +svg.attr("width") - margin.left - margin.right;
            const height = +svg.attr("height") - margin.top - margin.bottom;
            const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            const x = d3.scaleBand().rangeRound([0, width]).padding(0.1).align(0.1);
            const y = d3.scaleLinear().rangeRound([height, 0]);

            let layers;
            let rect;

            if (this.options.sort) {
                data.sort((a: any, b: any) => b.total - a.total);
            }

            const columns: Array<string> = this.getLabels(data);
            const numStates = data.length;
            const stack = d3.stack().keys(columns);

            layers = stack(data).map((layer: any) => layer.map((e: any, i: any) => {
                return {
                    type: e.data.type,
                    x: i,
                    y: this.getValues(columns, e.data)[columns.indexOf(layer.key)],
                    column: layer.key
                };
            }));
            for (let s = 0; s < numStates; ++s) {
                let y0 = 0;
                for (let ag = 0; ag < columns.length; ++ag) {
                    const e = layers[ag][s];
                    e.y0 = y0;
                    y0 += e.y;
                }
            }

            /*
             * Calculate the maximum of the total populations,
             * and the maximum of the age groups.
             */
            // const yGroupMax = d3.max(layers, (layer: any) => d3.max(layer, (d: any) => d.y));
            const yStackMax = d3.max(layers, (layer: any) => d3.max(layer, (d: any) => d.y0 + d.y));
            /*
             * Set the domains for the x-, y-axis and categorical color scales.
             */
            x.domain(data.map((d: any) => d.type));
            // @ts-ignore
            y.domain([0, d3.max(data, (d: any) => this.sumup(d))]).nice();
            /*
             * Render the bars.
             */
            g.selectAll(".serie")
                .data(layers)
                .enter().append("g")
                .attr("class", (d: any) => `serie lto-vis-${getDigit(this.idMap, d[0].column)} lto-vis-${getLetter(this.idMap, d[0].column)}`)
                .selectAll("rect")
                .data((d: any) => d)
                .enter().append("rect")
                .attr("x", (d: any) => x(d.type) as number)
                .attr("y", height)
                .attr("width", x.bandwidth())
                .attr("height", 0);
            rect = g.selectAll("rect");
            // Initial animation to gradually "grow" the bars from the x-axis.
            rect.transition()
                .delay((d, i) => i)
                .attr("y", (d: any) => y(d.y0 + d.y))
                .attr("height", (d: any) => y(d.y0) - y(d.y0 + d.y));

            // add svg title for tooltip support
            rect.append("svg:title")
                .text((d: any) => d.type + ", " + d.column + ": " + d.y + " (total: " + this.sumup(d) + ")");
            /*
             * X-axis set-up.
             * Note that we do not set up the Y-axis, since the bar heights are
             * scaled dynamically.
             */
            g.append("g")
                .attr("class", "axis axis--x")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add labels to the axes.
            svg.append("text")
                .attr("class", "axis axis--x")
                .attr("text-anchor", "middle")
                .attr("transform", "translate(" + (width / 2) + "," + (height + 60) + ")")
                .text(this.options.textX);
            svg.append("text")
                .attr("class", "axis axis--y")
                .attr("text-anchor", "middle")
                .attr("transform", "translate(0," + (height / 2) + ")rotate(-90)")
                .attr("dy", "20.0")
                .text(this.options.textY);

            if (this.options.legend) {
                const legend = g.selectAll(".legend")
                    .data(columns.reverse())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", (d, i) => "translate(" + ((i % 4) * 100) + ", " + (Math.floor(i / 4) * 20) + ")");
                legend.append("rect")
                    .attr("x", 0)
                    .attr("width", 18)
                    .attr("height", 18)
                    .attr("class", (d: any) => `serie lto-vis-${getDigit(this.idMap, d[0].column)} lto-vis-${getLetter(this.idMap, d[0].column)}`);
                legend.append("text")
                    .attr("x", 20)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .attr("text-anchor", "start")
                    .text((d: any) => d);
            }

            this.transitionStacked(x, y, rect, parseFloat(yStackMax as string));
        });
    }

    /*
     * Reset the domain for the y-axis scaling to maximum of the population totals,
     * transition the y-axis changes to the bar heights, and then transition the
     * x-axis changes to the bar widths.
     */
    private transitionStacked(x: ScaleBand<string>, y: ScaleLinear<number, number>,
                              rect: d3.Selection<BaseType, any, any, any>, yStackMax: number) {
        y.domain([0, yStackMax]);
        rect.transition()
            .duration(500)
            .delay((d: any, i: any) => i)
            .attr("y", (d: any) => ((y(d.y0 + d.y) * 0.85) + 40))
            .attr("height", (d: any) => (y(d.y0) - y(d.y0 + d.y)) * 0.85)
            .transition()
            .attr("x", (d: any) => x(d.type) as number)
            .attr("width", x.bandwidth());
    }

    private sumup(data: any) {
        let sum = 0.0;
        Object.keys(data).forEach(key => {
            if (typeof data[key] === "number") {
                sum += data[key];
            }
        });
        return sum;
    }

    private getLabels(data: [any]): Array<string> {
        const labels: Array<string> = [];
        data.forEach(e => {
            e.labels.forEach((key: string) => {
                if (key !== "type") {
                    if (labels.indexOf(key) < 0) {
                        labels.push(key);
                    }
                }
            });
        });
        return labels;
    }

    private getValues(labels: Array<string>, data: any) {
        const values: Array<number> = Array.from({length: labels.length}, () => 0);
        data.labels.forEach((key: string) => {
            const index = labels.indexOf(key);
            values[labels.indexOf(key)] = data.values.length > index ? data.values[index] : 0;
        });
        return values;
    }

}
