import * as d3 from "d3";
import {BaseType, ScaleBand, ScaleLinear} from "d3";
import data from "./data";
// noinspection TsLint
import "./Stackedbar.scss";

export default class Stackedbar {

    public render() {
        const div = document.createElement("div");
        div.classList.add("lto-vis-stackedbar");
        div.innerHTML = `<svg width="960" height="500"></svg>`;

        return div;
    }

    public init() {
        const svg = d3.select(".lto-vis-stackedbar > svg");
        const margin = {top: 20, right: 20, bottom: 50, left: 40};
        const width = +svg.attr("width") - margin.left - margin.right;
        const height = +svg.attr("height") - margin.top - margin.bottom;
        const g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const x = d3.scaleBand().rangeRound([0, width]).padding(0.1).align(0.1);
        const y = d3.scaleLinear().rangeRound([height, 0]);

        const colorScale = d3.scaleOrdinal(["#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"]);
        let layers;
        let rect;
        /*
         * Create request for CSV-data, and then process the response.
         */
        data.sort((a: any, b: any) => b.total - a.total);

        const columns = ["a", "b", "c", "d", "e", "f", "g", "total"];
        const numStates = data.length;
        const stack = d3.stack().keys(columns);

        // @ts-ignore
        layers = stack(data).map((layer:any) => layer.map((e:any, i:any) => {
            // console.log("###");
            // console.log(layer.key);

            return {
                type: e.data.type,
                x: i,
                y: e.data[layer.key],
                ageGroup: layer.key,
                total: e.data.total
            };
        }));
        for (let s = 0; s < numStates; ++s) {
            let y0 = 0;
            for (let ag = 0; ag < columns.length; ++ag) {
                const e = layers[ag][s];
                // @ts-ignore
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
        y.domain([0, d3.max(data, (d: any) => d.total)]).nice();
        colorScale.domain(columns);
        /*
         * Render the bars.
         */
        g.selectAll(".serie")
            .data(layers)
            .enter().append("g")
            .attr("class", "serie")
            .attr("fill", (d: any) => {
                console.log("fill");
                console.log(d[0].ageGroup);
                console.log(colorScale(d[0].ageGroup));

                return colorScale(d[0].ageGroup);
            })
            .selectAll("rect")
            .data((d: any) => d)
            .enter().append("rect")
            .attr("x", (d: any) => {
                // console.log(x(d.type) as number);
                return x(d.type) as number;
            })
            .attr("y", height)
            .attr("width", x.bandwidth())
            .attr("height", 0);
        rect = g.selectAll("rect");
        /*
         * Initial animation to gradually "grow" the bars from the x-axis.
         */
        rect.transition()
            .delay((d, i) => i)
            .attr("y", (d: any) => y(d.y0 + d.y))
            .attr("height", (d: any) => y(d.y0) - y(d.y0 + d.y));
        /*
         * Add SVG title elements for each age group bar segment.
         */
        rect.append("svg:title")
            .text((d: any) => d.type + ", " + d.ageGroup + ": " + d.y + " (total: " + d.total + ")");
        /*
         * X-axis set-up.
         * Note that we do not set up the Y-axis, since the bar heights are
         * scaled dynamically.
         */
        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
        /*
         * Add labels to the axes.
         */
        svg.append("text")
            .attr("class", "axis axis--x")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (width / 2) + "," + (height + 60) + ")")
            .text("US States");

        svg.append("text")
            .attr("class", "axis axis--y")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(0," + (height / 2) + ")rotate(-90)")
            .attr("dy", "20.0")
            .text("Population");
        /*
         * Set up the legend explaning the age group categories.
         */
        const legend = g.selectAll(".legend")
            .data(columns.reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => "translate(0," + (i * 20) + ")");
        legend.append("rect")
            .attr("x", width - 38)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", colorScale);
        legend.append("text")
            .attr("x", width - 44)
            .attr("y", 9)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .text((d: any) => d);

        // this.transitionGrouped(x, y, parseFloat(yGroupMax as string), columns, rect, height);
        this.transitionStacked(x, y, rect, parseFloat(yStackMax as string));
    }

    /*
         * Reset the domain for the y-axis scaling to maximum of the age group totals,
         * transition the x-axis changes to the bar widths, and then transition the
         * y-axis changes to the bar heights.
         */
    // private transitionGrouped(x:ScaleBand<string>, y:ScaleLinear<number, number>, yGroupMax:number, columns:string[],
    //                           rect:d3.Selection<BaseType, any, any, any>, height:number) {
    //     y.domain([0, yGroupMax]);
    //     rect.transition()
    //         .duration(500)
    //         .delay((d: any, i: any) => i)
    //         .attr("x", (d: any) => x(d.type) as number + 0.5 + columns.indexOf(d.ageGroup) * (x.bandwidth() / columns.length))
    //         .attr("width", x.bandwidth() / columns.length)
    //         .transition()
    //         .attr("y", (d: any) => y(d.y))
    //         .attr("height", (d: any) => height - y(d.y));
    // }

    /*
 * Reset the domain for the y-axis scaling to maximum of the population totals,
 * transition the y-axis changes to the bar heights, and then transition the
 * x-axis changes to the bar widths.
 */
    private transitionStacked(x:ScaleBand<string>, y:ScaleLinear<number, number>,
                              rect:d3.Selection<BaseType, any, any, any>, yStackMax:number) {
        y.domain([0, yStackMax]);
        rect.transition()
            .duration(500)
            .delay((d:any, i:any) => i)
            .attr("y", (d:any) => y(d.y0 + d.y))
            .attr("height", (d:any) => y(d.y0) - y(d.y0 + d.y))
            .transition()
            .attr("x", (d:any) => x(d.type) as number)
            .attr("width", x.bandwidth());
    }

}
