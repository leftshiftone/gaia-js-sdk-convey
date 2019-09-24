import * as d3 from "d3";
import {range} from "d3";
import Bar3DOptions from './Bar3DOptions';

/**
 * Implementation of the '3d bar' markup element.
 */
export class Bar3D {

    private mx: number = 0;
    private my: number = 0;
    private mouseX: number = 0;
    private mouseY: number = 0;

    // runtime
    private beta = 0;
    private alpha = 0;

    // data
    private yLine: any[] = [];
    private scatter: any[] = [];
    private xGrid: any[] = [];

    private options: Bar3DOptions;

    constructor(options: Bar3DOptions = new Bar3DOptions()) {
        this.options = options;
    }

    /**
     * @inheritDoc
     */
    public render(): HTMLElement {
        const div = document.createElement("div");
        div.classList.add("lto-vis-bar3d");
        div.innerHTML = `<svg width="${this.options.width}" height="${this.options.height}" />`;
        return div;
    }

    public init(element: HTMLElement) {
        this.options.data.then(data => {
            const grid3d = this.init3DElement("GRID", 20);
            const point3d = this.init3DElement("LINE");
            const yScale3d = this.init3DElement("LINE_STRIP");

            const svg: any = d3.select(element.querySelector("svg"));
            svg.call(d3.drag()
                .on('drag', this.dragged(svg, grid3d, point3d, yScale3d))
                .on('start', this.dragStart.bind(this))
                .on('end', this.dragEnd.bind(this))).append('g');
            range(-10, 10).forEach(z => range(-10, 10).forEach(x => this.xGrid.push([x, 0, z])));
            this.scatter.push.apply(this.scatter, data.map(e => [{x: e.x, y: e.y, z: e.z}, {x: e.x, y: 0, z: e.z}]));
            range(0, 11, 1).forEach((d: any) => this.yLine.push([-11, -d, -11]));

            const barData = [
                grid3d(this.xGrid),
                point3d(this.scatter),
                yScale3d([this.yLine])
            ];
            this.processData(barData, this.options.duration, svg, grid3d, yScale3d);
        });
    }

    private init3DElement(shape: string, coords?:number) {
        const d3_3d = require("d3-3d");
        const element = d3_3d._3d()
            .shape(shape, coords)
            .origin(this.options.origin(this.options.width, this.options.height))
            .rotateY(this.options.startAngle)
            .rotateX(-this.options.startAngle)
            .scale(this.options.scale);

        if (shape === "LINE") {
            element
                .x((d: any) => d.x)
                .y((d: any) => d.y)
                .z((d: any) => d.z);
        }
        return element;
    }

    private processData(data: any, duration: any, svg: any, grid3d: any, yScale3d: any) {
        const xGrid = svg.selectAll('path.grid').data(data[0], (d: any) => d.id);

        xGrid.enter()
            .append('path')
            .attr('class', (d: any) => '_3d grid ' + (d.ccw ? "ccw" : ""))
            .merge(xGrid)
            .attr('d', grid3d.draw);
        xGrid.exit().remove();

        const lines = svg.selectAll('line').data(data[1], (d: any) => d.id);
        lines
            .enter()
            .append('line')
            .attr('class', (d:any) => '_3d lto-vis-' + this.options.toGroup(Math.abs(d[0].y as number)))
            .attr('opacity', 0)
            .attr('x1', (d: any) => d[0].projected.x)
            .attr('y1', (d: any) => d[0].projected.y)
            .attr('x2', (d: any) => d[1].projected.x)
            .attr('y2', (d: any) => d[1].projected.y)
            .merge(lines)
            .transition().duration(duration)
            .attr('opacity', 1)
            .attr('x1', (d: any) => d[0].projected.x)
            .attr('y1', (d: any) => d[0].projected.y)
            .attr('x2', (d: any) => d[1].projected.x)
            .attr('y2', (d: any) => d[1].projected.y);
        lines.exit().remove();

        const yScale = svg.selectAll('path.yScale').data(data[2]);
        yScale.enter()
            .append('path')
            .attr('class', '_3d yScale legend')
            .merge(yScale)
            .attr('d', yScale3d.draw);
        yScale.exit().remove();

        this.renderLegendX(svg, data[0]);
        this.renderLegendY(svg, data[2][0]);
        this.renderLegendZ(svg, data[0]);

        const d3_3d = require("d3-3d");
        d3.selectAll('._3d').sort(d3_3d._3d().sort);
    }

    private renderLegendX(svg: any, data: any) {
        const array = data.filter((e:any) => e[0]["2"] === 9).map((e:any) => e[0]);

        const xText = svg.selectAll('text.xText').data(array);
        xText.enter()
            .append('text')
            .attr('class', '_3d xText')
            .attr('dx', '.3em')
            .merge(xText)
            .each((d: any) => d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z})
            .attr('x', (d: any) => d.projected.x)
            .attr('y', (d: any) => d.projected.y)
            .text(this.options.textX);
        xText.exit().remove();
    }

    private renderLegendY(svg: any, data: any) {
        const yText = svg.selectAll('text.yText').data(data);
        yText.enter()
            .append('text')
            .attr('class', '_3d yText')
            .attr('dx', '.3em')
            .merge(yText)
            .each((d: any) => d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z})
            .attr('x', (d: any) => d.projected.x)
            .attr('y', (d: any) => d.projected.y)
            .text(this.options.textY);
        yText.exit().remove();
    }

    private renderLegendZ(svg: any, data: any) {
        const array = data.filter((e:any) => e[0]["0"] === 9).map((e:any) => e[0]);

        const zText = svg.selectAll('text.zText').data(array);
        zText
            .enter()
            .append('text')
            .attr('class', '_3d zText')
            .attr('dx', '.3em')
            .merge(zText)
            .each((d: any) => d.centroid = {x: d.rotated.x, y: d.rotated.y, z: d.rotated.z})
            .attr('x', (d: any) => d.projected.x)
            .attr('y', (d: any) => d.projected.y)
            .text(this.options.textZ);
        zText.exit().remove();
    }

    private dragStart() {
        this.mx = d3.event.x;
        this.my = d3.event.y;
    }

    private dragged(svg: any, grid3d: any, point3d: any, yScale3d: any) {
        return () => {
            this.mouseX = this.mouseX || 0;
            this.mouseY = this.mouseY || 0;
            this.beta = (d3.event.x - this.mx + this.mouseX) * Math.PI / 230;
            this.alpha = (d3.event.y - this.my + this.mouseY) * Math.PI / 230 * (-1);
            const data = [
                grid3d.rotateY(this.beta + this.options.startAngle).rotateX(this.alpha - this.options.startAngle)(this.xGrid),
                point3d.rotateY(this.beta + this.options.startAngle).rotateX(this.alpha - this.options.startAngle)(this.scatter),
                yScale3d.rotateY(this.beta + this.options.startAngle).rotateX(this.alpha - this.options.startAngle)([this.yLine]),
            ];
            this.processData(data, 0, svg, grid3d, yScale3d);
        };
    }

    private dragEnd() {
        this.mouseX = d3.event.x - this.mx + this.mouseX;
        this.mouseY = d3.event.y - this.my + this.mouseY;
    }

}
