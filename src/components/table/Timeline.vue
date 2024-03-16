<template>
    <div class="w-full h-full p-0.8 flex flex-col">
        <div 
        v-if="!barChartVisible"
        class="h-20px w-full" id="TimelineContainer">

        </div>
        <div 
        v-if="!barChartVisible"
        class="h-4px w-full">
            <svg class="w-full h-full">
                <line :x1="0" :y1="2" :x2="width" :y2="2" stroke="#f5f5f4" stroke-width="4" stroke-linecap="round"></line>
                <line v-if="timeRange.length>0" :x1="xScale(new Date(timeRange[0]))" :y1="2" :x2="xScale(new Date(timeRange[1]))" :y2="2" :stroke="themeColor" stroke-width="4" stroke-linecap="round"></line>
            </svg>
        </div>
    </div>
</template>


<script>
import { useStore } from 'vuex'
import { ref, computed, onMounted, watch } from 'vue'
import * as d3 from "d3"


export default {
    name: 'Timeline',
    props: ['barChartVisible', 'level_id'],
    setup(props) {
        const store = useStore()
        const themeColor = computed(() => store.getters["tree/themeColor"])
        const seriesCollection = computed(() => store.getters["tree/seriesCollection"])
        const timeRange = computed(() => store.getters["tree/timeRange"])
        const wholeTimeRange = computed(() => store.getters["time/wholeTimeRange"])

        const TimelineContainer = ref(null)
        const width = ref(0)
        const height = ref(20)

        const SD_Data = computed(() => store.getters["time/SD"].filter(d => d.level == props.level_id))

 

        const xScale = computed(() => {
            return d3.scaleTime().domain([new Date(wholeTimeRange.value[0]), new Date(wholeTimeRange.value[1])]).range([0, width.value])
        })


        onMounted(() => {
            TimelineContainer.value = document.querySelector('#TimelineContainer')
            width.value = TimelineContainer.value.offsetWidth - 30
        })

        return {
            xScale,
            timeRange,
            themeColor,
            width,
            seriesCollection
        }
    }
}
</script>


<style>

</style>