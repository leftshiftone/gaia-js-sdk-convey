// noinspection TsLint
import * as d3 from "d3";
import BarOptions from './BarOptions';

/**
 * Implementation of the 'line' markup element.
 */
export class Bar {

    private options: BarOptions;

    constructor(options: BarOptions = new BarOptions()) {
        this.options = options;
    }

    /**
     * @inheritDoc
     */
    public render(): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("lto-vis-bar");
        div.innerHTML = `<svg width="${this.options.width}" height="${this.options.height}" viewBox="0,0,${this.options.width},${this.options.height}" />`;
        return div;
    }

    public init(element: HTMLElement) {
        this.options.data.then(data => {
            const svg = d3.select(element.querySelector("svg"));

            const x = this.xBand(data);
            const y = this.yBand();

            svg.append("g")
                .attr("fill", "rgb(0, 200, 220)")
                .selectAll("rect")
                .data(data)
                // @ts-ignore
                .join("rect")
                //@ts-ignore
                .attr("x", (d: any) => x(d.name))
                .attr("y", (d: any) => y(d.value))
                .attr("height", (d: any) => y(0) - y(d.value))
                .attr("width", x.bandwidth());

            svg.append("g").call(this.xAxis(x));
            svg.append("g").call(this.yAxis(y));

            return svg.node();
        });
    }

    private xBand(data: any) {
        return d3.scaleBand()
            .domain(data.map((d: any) => d.name))
            .range([this.options.margin.left, this.options.width - this.options.margin.right])
            .padding(0.1);
    }

    private yBand() {
        return d3.scaleLinear()
        // @ts-ignore
            .domain([0, d3.max(data, d => d.value)]).nice()
            .range([this.options.height - this.options.margin.bottom, this.options.margin.top]);
    }

    private xAxis(x: any) {
        return (g: any) => g
            .attr("transform", `translate(0,${this.options.height - this.options.margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));
    }

    private yAxis(y: any) {
        return (g: any) => g
            .attr("transform", `translate(${this.options.margin.left},0)`)
            .call(d3.axisLeft(y))
            .call((g: any) => g.select(".domain").remove());
    }


}
