// noinspection TsLint
import LineOptions from './LineOptions';
import * as d3 from "d3";

/**
 * Implementation of the 'line' markup element.
 */
export class Line {

    private options: LineOptions;

    constructor(options: LineOptions = new LineOptions()) {
        this.options = options;
    }

    /**
     * {@inheritDoc}
     */
    public render(): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("lto-vis-line");
        div.innerHTML = `<svg width="${this.options.width}" height="${this.options.height}" />`;
        return div;
    }

    public init(element: HTMLElement) {
        this.options.data.then(data => {
            const svg = d3.select(element.querySelector("svg"));

            const dates = data.dates.map((e: number) => new Date(e));
            const line = d3.line().defined(this.options.isDefined).x((d, i) => x(data.dates[i])).y(d => y(d));

            const x = d3.scaleTime()
            // @ts-ignore
                .domain(d3.extent(dates))
                .range([this.options.margin.left, this.options.width - this.options.margin.right]);

            const y = d3.scaleLinear()
            // @ts-ignore
                .domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
                .range([this.options.height - this.options.margin.bottom, this.options.margin.top]);

            svg.append("g").call(this.xAxis(x));
            svg.append("g").call(this.yAxis(y, data));
            svg.append("g").call(this.grid(x));

            let counter = 0;
            const path = svg.append("g")
                .attr("class", () => "lto-vis-lines")
                .selectAll("path")
                .data(data.series)
                // @ts-ignore
                .join("path")
                .style("mix-blend-mode", "color-dodge")
                .attr("class", () => "lto-vis-line-" + counter++)
                .attr("d", (d: any) => {
                    const _line = line(d.values);
                    // console.debug("LINE");
                    // console.debug(_line);
                    return _line;
                })
                .style("stroke-dasharray", (d: any, e: any, f: any) => Math.max.apply(null, f.map((e: any) => e.getTotalLength())))
                .style("stroke-dashoffset", (d: any, e: any, f: any) => Math.max.apply(null, f.map((e: any) => e.getTotalLength())));

            svg.call(this.hover(x, y, data), path);
        });
    }

    private xAxis(x: any) {
        return (g: d3.Selection<SVGGElement, {}, null, any>) => g
            .attr("transform", `translate(0,${this.options.height - this.options.margin.bottom})`)
            .call(d3.axisBottom(x).ticks(this.options.width / 80).tickSizeOuter(0));
    }

    private yAxis(y: any, data: any) {
        return (g: d3.Selection<SVGGElement, {}, null, any>) => {
            g
                .attr("transform", `translate(${this.options.margin.left},0)`)
                .call(d3.axisLeft(y))
                .call(g => g.select(".domain").remove())
                .call(g => g.select(".tick:last-of-type text").clone()
                    .attr("x", 3)
                    .attr("class", "lto-vis-text-0")
                    .attr("text-anchor", "start")
                    .attr("font-weight", "bold")
                    .text(data.y));
            if (data.y2) {
                g.call(g => g.select(".tick:last-of-type text").clone()
                    .attr("x", 3)
                    .attr("y", 15)
                    .attr("class", "lto-vis-text-1")
                    .attr("text-anchor", "start")
                    .attr("font-weight", "bold")
                    .text(data.y2));
            }
            return g;
        };
    }

    private hover(x: any, y: any, data: any) {
        return (svg: any, path: any) => {
            svg.style("position", "relative");

            if ("ontouchstart" in document) {
                svg
                    .style("-webkit-tap-highlight-color", "transparent")
                    .on("touchmove", moved)
                    .on("touchstart", entered)
                    .on("touchend", left);
            } else {
                svg
                    .on("mousemove", moved)
                    .on("mouseenter", entered)
                    .on("mouseleave", left);
            }

            const dot = svg.append("g").attr("display", "none");
            dot.append("circle").attr("r", 2.5);

            dot.append("text")
                .style("font", "10px sans-serif")
                .attr("text-anchor", "middle")
                .attr("y", -8);

            function moved() {
                d3.event.preventDefault();
                const ym = y.invert(d3.event.layerY);
                const xm = x.invert(d3.event.layerX);
                const i1 = d3.bisectLeft(data.dates, xm, 1);
                const i0 = i1 - 1;
                const i = xm - data.dates[i0] > data.dates[i1] - xm ? i1 : i0;
                const s = data.series.reduce((a: any, b: any) => Math.abs(a.values[i] - ym) < Math.abs(b.values[i] - ym) ? a : b);
                path.attr("stroke", (d: any) => d === s ? null : "#ddd").filter((d: any) => d === s).raise();
                dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
                dot.select("text").text(s.name);
            }

            function entered() {
                path.style("stroke-dasharray", null);
                path.style("stroke-dashoffset", null);
                path.style("mix-blend-mode", null).attr("stroke", "#ddd");
                dot.attr("display", null);
            }

            function left() {
                path.style("mix-blend-mode", "color-dodge").attr("stroke", null);
                dot.attr("display", "none");
            }
        };
    }

    private grid(x: any) {
        return (g: d3.Selection<SVGGElement, {}, null, any>) => {
            g.append("path")
                .attr("class", "lto-grid")
                .attr("stroke", "gray")
                .attr("d", `M ${this.options.margin.left} ${this.options.height / 3} L ${this.options.width - this.options.margin.right} ${this.options.height / 3} Z`);
            g.append("path")
                .attr("class", "lto-grid")
                .attr("stroke", "gray")
                .attr("d", `M ${this.options.margin.left} ${this.options.height / 3 * 2} L ${this.options.width - this.options.margin.right} ${this.options.height / 3 * 2} Z`);
        };
    }

}
