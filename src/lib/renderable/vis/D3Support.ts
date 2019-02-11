import * as d3 from 'd3';

export default class D3Support {
    private static dayFormat = d3.timeFormat('%j');
    private static monthDayFormat = d3.timeFormat('%m.%d');

    public static getDayOfYear = (date: Date) => parseInt(D3Support.dayFormat(date), 10);
    public static getMonthAndDay = (date: Date) => D3Support.monthDayFormat(date);

    public static initSvg(svg: d3.Selection<SVGSVGElement | null, {}, null, undefined>, width: number, height: number, margin: any) {
        console.log("width: " + width);
        console.log("height: " + height);

        return svg
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('width', width - margin.left - margin.right)
            .attr('height', height - margin.top - margin.bottom)
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    }

    public static uid(name: string) {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return {id:name + "-" + s4()};
    }

    public static svg(width:number, height:number) {
        const svg = document.createElement("svg");
        svg.setAttribute("width", width + "");
        svg.setAttribute("height", height + "");
        svg.setAttribute("viewBox", `0,0,${width},${height}`);

        return svg;
    }

}

export interface HtmlSelection extends d3.Selection<d3.BaseType, any, HTMLElement, any> {

}
