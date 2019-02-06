import "./Sunburst.scss";
import * as d3 from "d3";
import {Arc, PartitionLayout} from "d3";
import data from "./data";
import {HtmlSelection} from '../D3Support';

/**
 * Implementation of the 'sunburst' vis markup element.
 */
export class Sunburst {

    private width = 750;
    private height = 600;
    private radius = Math.min(this.width, this.height) / 2;
    private totalSize: number = 0;
    private b = {w: 75, h: 30, s: 3, t: 10, r: 3};

    private colors = {
        home: "#5687d1",
        product: "#7b615c",
        search: "#de783b",
        account: "#6ab975",
        other: "#a173d1",
        end: "#bbbbbb"
    };

    public render(): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("lto-vis-sunburst");
        div.innerHTML = `
        <div>
            <div id="legend" />
        </div>
        <div id="chart">
            <div id="explanation" style="visibility: hidden;">
                <span id="percentage" />
            </div>
        </div>`;
        return div;
    }

    public init() {
        const vis = d3.select("#chart").append("svg:svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .append("svg:g")
            .attr("id", "container")
            .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

        const partition = d3.partition().size([2 * Math.PI, this.radius * this.radius]);

        const arc = d3.arc()
            .startAngle((d: any) => d.x0)
            .endAngle((d: any) => d.x1)
            .innerRadius((d: any) => Math.sqrt(d.y0))
            .outerRadius((d: any) => Math.sqrt(d.y1));

        this.createVisualization(data, vis, partition, arc);
    }

    private createVisualization(json: any, vis: HtmlSelection, partition: PartitionLayout<{}>, arc: Arc<any, any>) {
        this.initializeBreadcrumbTrail();
        this.drawLegend();

        // Bounding circle underneath the sunburst, to make it easier to detect when the mouse leaves the parent g.
        vis.append("svg:circle").attr("r", this.radius).style("opacity", 0);

        const root = d3.hierarchy(json)
            .sum((d) => d.size)
            .sort((a: any, b: any) => b.value - a.value);

        const nodes = partition(root).descendants().filter((d) => (d.x1 - d.x0 > 0.005));

        const path = vis.data([json]).selectAll("path")
            .data(nodes)
            .enter().append("svg:path")
            .attr("display", (d) => d.depth ? null : "none")
            .attr("d", arc)
            .attr("fill-rule", "evenodd")
            .style("fill", (d: any) => this.colors[d.data.name])
            .style("opacity", 1)
            .on("mouseover", (d) => this.mouseover(d, vis, this.totalSize));

        d3.select("#container").on("mouseleave", (d) => this.mouseleave(d, vis));
        this.totalSize = path.datum().value as number;
    }

    private initializeBreadcrumbTrail() {
        const trail = d3.select("#legend").append("svg:svg")
            .attr("width", this.width)
            .attr("height", 50)
            .attr("id", "trail");
        trail.append("svg:text")
            .attr("id", "endlabel")
            .style("fill", "#000");
    }

    private mouseleave(d: any, vis: HtmlSelection) {
        d3.select("#trail").style("visibility", "hidden");

        d3.selectAll("path").on("mouseover", null);
        d3.selectAll("path")
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .on("end", () => {
                vis.selectAll("path").on("mouseover", (x: any) => this.mouseover(x, vis, this.totalSize));
            });
        d3.select("#explanation").style("visibility", "hidden");
    }

    private mouseover(d: any, vis: HtmlSelection, totalSize: number) {
        const percentage = parseFloat((100 * d.value / totalSize).toPrecision(3));
        const percentageString = (percentage < 0.1) ? "< 0.1%" : percentage + "%";

        d3.select("#percentage").text(percentageString);
        d3.select("#explanation").style("visibility", "");

        const sequenceArray = d.ancestors().reverse();
        sequenceArray.shift(); // remove root node from the array
        this.updateBreadcrumbs(sequenceArray, percentageString);

        d3.selectAll("path").style("opacity", 0.3);
        vis.selectAll("path")
            .filter((node) => (sequenceArray.indexOf(node) >= 0))
            .style("opacity", 1);
    }

    private breadcrumbPoints(d: any, i: any) {
        const points = [];
        points.push("0,0");
        points.push(this.b.w + ",0");
        points.push(this.b.w + this.b.t + "," + (this.b.h / 2));
        points.push(this.b.w + "," + this.b.h);
        points.push("0," + this.b.h);
        if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
            points.push(this.b.t + "," + (this.b.h / 2));
        }
        return points.join(" ");
    }

    private updateBreadcrumbs(nodeArray: any, percentageString: string) {
        const trail = d3.select("#trail")
            .selectAll("g")
            .data(nodeArray, (d: any) => d.data.name + d.depth);

        trail.exit().remove();

        const entering = trail.enter().append("svg:g");
        entering.append("svg:polygon")
            .attr("points", this.breadcrumbPoints.bind(this))
            .style("fill", (d: any) => this.colors[d.data.name]);

        entering.append("svg:text")
            .attr("x", (this.b.w + this.b.t) / 2)
            .attr("y", this.b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text((d: any) => d.data.name);

        entering.merge(trail).attr("transform", (d: any, i: any) => "translate(" + i * (this.b.w + this.b.s) + ", 0)");
        d3.select("#trail").select("#endlabel")
            .attr("x", (nodeArray.length + 0.5) * (this.b.w + this.b.s))
            .attr("y", this.b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text(percentageString);

        d3.select("#trail").style("visibility", "");
    }

    private drawLegend() {
        const legend = d3.select("#legend").append("svg:svg")
            .attr("width", d3.keys(this.colors).length * (this.b.w + this.b.s))
            .attr("height", this.b.h);
        const g = legend.selectAll("g")
            .data(d3.entries(this.colors))
            .enter().append("svg:g")
            .attr("transform", (d: any, i: any) => "translate(" + i * (this.b.w + this.b.s) + ", 0)");

        g.append("svg:rect")
            .attr("rx", this.b.r)
            .attr("ry", this.b.r)
            .attr("width", this.b.w)
            .attr("height", this.b.h)
            .style("fill", (d: any) => d.value);
        g.append("svg:text")
            .attr("x", this.b.w / 2)
            .attr("y", this.b.h / 2)
            .attr("dy", "0.35em")
            .attr("text-anchor", "middle")
            .text((d: any) => d.key);
    }

}
