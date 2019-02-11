// noinspection TsLint
import "./Doughnut.scss";
import * as d3 from "d3";
import DoughnutOptions from './DoughnutOptions';

/**
 * Implementation of the 'headmap' markup element.
 */
export class Doughnut {

    private options:DoughnutOptions;
    private radius: number;

    private color = d3.scaleOrdinal()
        .domain(["Event A", "Event B", "Event C", "Event D", "Event E"])
        .range(["#30c4c4", "#008d8d", "#0fb5b5", "#53d4d4", "#83e5e5"]);

    constructor(options:DoughnutOptions = new DoughnutOptions()) {
        this.options = options;
        this.radius = Math.min(options.width, options.height) / 2;
    }


    /**
     * {@inheritDoc}
     */
    public render(): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("lto-vis-doughnut");
        div.innerHTML = '<svg />';
        div.style.height = this.options.height + "px";
        div.style.width = (this.options.width + 200) + "px";
        return div;
    }

    public init(element:HTMLElement) {
        const svg = d3.select(element.querySelector("svg")).append("g");

        svg.append("g").attr("class", "slices");
        svg.append("g").attr("class", "labels");
        svg.append("g").attr("class", "lines");

        svg.attr("transform", "translate(" + ((this.options.width / 2) + 100) + "," + this.options.height / 2 + ")");

        const $this = this;
        function randomData() {
            const labels = $this.color.domain();
            return labels.map((label:string) => {
                return {label, value: Math.random()};
            });
        }

        this.change(randomData(), svg);

        // d3.select(".randomize").on("click", () => this.change(randomData(), svg));
    }

    private change(data:any, svg:any) {
        const arc = d3.arc().outerRadius(this.radius * 0.8).innerRadius(this.radius * this.options.doughnutRatio);
        const outerArc = d3.arc().innerRadius(this.radius * 0.9).outerRadius(this.radius * 0.9);

        const pie = d3.pie().sort(null).value((d:any) => d.value);
        const key = (d:any) => d.data.label;
        /* ------- PIE SLICES -------*/
        const slice = svg.select(".slices").selectAll("path.slice").data(pie(data), key);

        let _current:any;

        slice.enter()
            .insert("path")
            .style("fill", (d:any) => this.color(d.data.label) as string)
            .attr("class", "slice")
            // @ts-ignore
            .merge(slice)
            .transition().duration(1000)
            .attrTween("d", (d:any) => {
                _current = _current || d;
                const interpolate = d3.interpolate(_current, d);
                _current = interpolate(0);
                return (t:any) => arc(interpolate(t)) as string;
            });

        slice.exit()
            .remove();

        const $this = this;

        /* ------- TEXT LABELS -------*/

        const text = svg.select(".labels").selectAll("text")
            .data(pie(data), key);

        function midAngle(d:any) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;

        }

        text.enter()
            .append("text")
            .attr("dy", ".35em")
            .text((d:any) => d.data.label)
            // @ts-ignore
            .merge(text)
            .transition().duration(1000)
            .attrTween("transform", (d:any) => {
                _current = _current || d;
                const interpolate = d3.interpolate(_current, d);
                _current = interpolate(0);
                return function (t:any) {
                    const d2 = interpolate(t);
                    const pos = outerArc.centroid(d2);
                    pos[0] = $this.radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate(" + pos + ")";
                };
            })
            .styleTween("text-anchor", (d:any) => {
                _current = _current || d;
                const interpolate = d3.interpolate(_current, d);
                _current = interpolate(0);
                return function (t:any) {
                    const d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start" : "end";
                };
            });

        text.exit()
            .remove();

        /* ------- SLICE TO TEXT POLYLINES -------*/

        const polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data), key);

        polyline.enter()
            .append("polyline")
            .style("stroke", (d:any) => this.color(d.data.label) as string)
            // @ts-ignore
            .merge(polyline)
            .transition().duration(1000)
            .attrTween("points", (d:any) => {
                _current = _current || d;
                const interpolate = d3.interpolate(_current, d);
                _current = interpolate(0);
                return function (t:any) {
                    const d2 = interpolate(t);
                    const pos = outerArc.centroid(d2);
                    pos[0] = $this.radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };
            });

        polyline.exit()
            .remove();
    }

}
