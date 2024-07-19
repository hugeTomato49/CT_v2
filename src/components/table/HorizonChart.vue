<template>
    <div ref="chart"></div>
</template>

<script>
import * as d3 from 'd3';
import { onMounted, ref, watch } from 'vue';

export default {
    name: 'HorizonChart',
    props: {
        data: Array,
        bands: Number,
        height: Number
    },
    setup(props) {
        const chart = ref(null);

        const drawChart = () => {
            d3.select(chart.value).selectAll("svg").remove();
            const { data, bands } = props;
            const colors = [
                "#9ecae1", "#6baed6",
                "#4292c6", "#2171b5", "#08519c", "#08306b"
            ];

            const marginTop = 15;
            const marginRight = 10;
            const marginBottom = 0;
            const marginLeft = 10;
            const width = 500;
            const size = props.height; // height of each band
            const padding = 1;

            // Calculate height based on the number of data points
            const height = size + marginTop + marginBottom;

            // Create the horizontal (temporal) scale
            const x = d3.scaleUtc()
                .domain(d3.extent(data, d => d.Time))
                .range([0, width]);

            // Create the vertical scale
            const y = d3.scaleLinear()
                .domain([d3.min(data, d => d.value), d3.max(data, d => d.value)])
                .range([size, size - bands * (size - padding)]);

            const area = d3.area()
                .defined(d => !isNaN(d.value))
                .x(d => x(d.Time))
                .y0(size)
                .y1(d => y(d.value));

            // Unique identifier for clip paths and reusable paths
            const uid = `O-${Math.random().toString(16).slice(2)}`;

            // Create the SVG container
            const svg = d3.create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("viewBox", [0, 0, width, height])
                .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

            // Create a G element for the data
            const g = svg.append("g")
                .attr("transform", `translate(0,${marginTop})`);

            // Add a rectangular clipPath and the reference area
            const defs = g.append("defs");
            defs.append("clipPath")
                .attr("id", `${uid}-clip`)
                .append("rect")
                .attr("y", padding)
                .attr("width", width)
                .attr("height", size - padding);

            defs.append("path")
                .attr("id", `${uid}-path`)
                .attr("d", area(data));

            // Create a group for the data and replicate the reference area for each band
            g.append("g")
                .attr("clip-path", `url(${new URL(`#${uid}-clip`, location)})`)
                .selectAll("use")
                .data(new Array(bands).fill(0))
                .enter().append("use")
                .attr("xlink:href", `${new URL(`#${uid}-path`, location)}`)
                .attr("fill", (_, i) => colors[i])
                .attr("transform", (_, i) => `translate(0,${i * size})`);

            // Add the horizontal axis
            // svg.append("g")
            //   .attr("transform", `translate(0,${marginTop})`)
            //   .call(d3.axisTop(x).ticks(width / 80).tickSizeOuter(0))
            //   .call(g => g.selectAll(".tick").filter(d => x(d) < marginLeft || x(d) >= width - marginRight).remove())
            //   .call(g => g.select(".domain").remove());

            chart.value.appendChild(svg.node());
        };

        onMounted(() => {
            drawChart();
        });

        watch(() => props.data, () => {
            drawChart();
        }, { deep: true });

        return {
            chart,
        };
    },
};
</script>

<style scoped>
/* Add any additional styling here */
</style>