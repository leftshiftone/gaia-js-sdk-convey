import * as d3 from "d3";
// noinspection TsLint
import D3Support from '../D3Support';
import SankeyOptions from './SankeyOptions';

export class Sankey {

    private options: SankeyOptions;
    private edgeColor = "path";

    private colorSchema:d3.ScaleOrdinal<any, any>;

    constructor(options: SankeyOptions = new SankeyOptions()) {
        this.options = options;
        this.colorSchema = d3.scaleOrdinal(options.color);
    }

    public render() {
        const div = document.createElement("div");
        div.classList.add("lto-vis-sankey");

        return div;
    }

    public init(element:HTMLElement) {
        const d3Sankey = require("d3-sankey");

        this.options.data.then(data => {
            const svg = d3.select(element).append("svg:svg")
                .attr("width", this.options.width)
                .attr("height", this.options.height)
                .style("width", "100%")
                .style("height", "auto");

            const {nodes, links} = this.sankey(data);

            svg.append("g")
                .attr("stroke", "#000")
                .selectAll("rect")
                .data(nodes)
                .enter().append("rect")
                .attr("x", (d: any) => d.x0)
                .attr("y", (d: any) => d.y0)
                .attr("height", (d: any) => d.y1 - d.y0)
                .attr("width", (d: any) => d.x1 - d.x0)
                .attr("fill", (d: any) => this.color(d.name))
                .append("title")
                .text((d: any) => `${d.name}\n${this.format(d.value)}`);

            const link = svg.append("g")
                .attr("fill", "none")
                .attr("stroke-opacity", 0.5)
                .selectAll("g")
                .data(links)
                .enter().append("g")
                .style("mix-blend-mode", "multiply");

            if (this.edgeColor === "path") {
                const gradient = link.append("linearGradient")
                    .attr("id", (d: any) => (d.uid = D3Support.uid("link")).id)
                    .attr("gradientUnits", "userSpaceOnUse")
                    .attr("x1", (d: any) => d.source.x1)
                    .attr("x2", (d: any) => d.target.x0);

                gradient.append("stop")
                    .attr("offset", "0%")
                    .attr("stop-color", (d: any) => this.color(d.source.name));

                gradient.append("stop")
                    .attr("offset", "100%")
                    .attr("stop-color", (d: any) => this.color(d.target.name));
            }

            link.append("path")
                .attr("d", d3Sankey.sankeyLinkHorizontal())
                .attr("stroke", (d: any) => this.edgeColor === "path" ? `url(#${d.uid.id})`
                    : this.edgeColor === "input" ? this.color(d.source.name)
                        : this.color(d.target.name))
                .attr("stroke-width", (d: any) => Math.max(1, d.width));

            link.append("title")
                .text((d: any) => `${d.source.name} → ${d.target.name}\n${this.format(d.value)}`);

            svg.append("g")
                .style("font", "10px sans-serif")
                .selectAll("text")
                .data(nodes)
                .enter().append("text")
                .attr("x", (d: any) => d.x0 < this.options.width / 2 ? d.x1 + 6 : d.x0 - 6)
                .attr("y", (d: any) => (d.y1 + d.y0) / 2)
                .attr("dy", "0.35em")
                .attr("text-anchor", (d: any) => d.x0 < this.options.width / 2 ? "start" : "end")
                .text((d: any) => d.name);
        });
    }

    private sankey(data: any) {
        const d3Sankey = require("d3-sankey");
        return d3Sankey.sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[1, 1], [this.options.width - 1, this.options.height - 5]])(data);
    }

    private color(name: string) {
        return this.colorSchema(name.replace(/ .*/, ""));
    }

    private format(d: any) {
        const f = d3.format(",.0f");
        return `${f(d)} Events`;
    }

}
