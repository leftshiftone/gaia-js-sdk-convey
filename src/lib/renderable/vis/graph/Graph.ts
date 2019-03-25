import * as d3 from "d3";
import GraphOptions from './GraphOptions';

/**
 * Implementation of the 'graph' markup element.
 */
export class Graph {

    private options: GraphOptions;

    constructor(options: GraphOptions = new GraphOptions()) {
        this.options = options;
    }

    /**
     * {@inheritDoc}
     */
    public render(): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("lto-vis-graph");
        div.innerHTML = `<svg width="${this.options.width}" height="${this.options.height}" />`;
        return div;
    }

    public init(element: HTMLElement) {
        this.options.data.then(data => {
            const links = data.links.map((d: any) => Object.create(d));
            const nodes = data.nodes.map((d: any) => Object.create(d));

            const svg = d3.select(element.querySelector("svg"));

            this.generateArrow(svg);

            const simulation = d3.forceSimulation(nodes)
                .force("link", d3.forceLink(links).id((d: any) => d.id).distance(this.options.distance))
                .force("name", d3.forceCollide(this.options.collision))
                .force("charge", d3.forceManyBody().strength(this.options.charge))
                .force("center", d3.forceCenter(this.options.width / 2, this.options.height / 2));

            const link = svg.append("g")
                .selectAll("line")
                .data(links)
                // @ts-ignore
                .join("line")
                .attr("marker-end", "url(#arrow)");

            const node = svg.append("g")
                .selectAll("circle")
                .data(nodes)
                // @ts-ignore
                .join("circle")
                .attr("r", this.options.radius)
                .attr("class", (d: any) => "lto-node lto-node-" + d.group)
                .call(this.drag(simulation));

            node.append("title").text((d: any) => d.group);

            const text = svg.append("g")
                .attr("text-anchor", "middle")
                .selectAll("text")
                .data(nodes)
                // @ts-ignore
                .join("text")
                .attr("x", (d: any) => d.cx)
                .attr("y", (d: any) => d.cy + (this.options.radius + (this.options.fontSize * 0.7)))
                .text((d: any) => d.id)
                .attr("class", (d: any) => "lto-node-text lto-node-test-" + d.group)
                .call(this.drag(simulation));

            simulation.on("tick", () => {
                link.attr("x1", (d: any) => d.source.x)
                    .attr("y1", (d: any) => d.source.y)
                    .attr("x2", (d: any) => d.target.x)
                    .attr("y2", (d: any) => d.target.y);

                node.attr("cx", (d: any) => d.x)
                    .attr("cy", (d: any) => d.y);

                text.attr("x", (d: any) => d.x)
                    .attr("y", (d: any) => d.y + (this.options.radius + (this.options.fontSize * 0.7)));
            });
        });
    }

    private drag(simulation: any) {
        function dragstarted(d: any) {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(d: any) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d: any) {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    private generateArrow(svg: any) {
        svg.append("svg:defs").selectAll("marker")
            .data(["arrow"])
            .enter().append("svg:marker")
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", this.options.radius + 10)
            .attr("refY", -1.5)
            .attr("markerWidth", 10)
            .attr("markerHeight", 10)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");
    }

}
