<template>
    <div class="w-full h-full p-0.8 flex flex-col">
        <div class="w-full h-full" id="TimelineContainer">
            <div 
            v-if="barChartVisible"
            class="h-40px w-full" >
                <svg class="w-full h-full">
                    <!-- <rect 
                    v-for="(d, index) in SD_Data" 
                    :key="d.Time"
                    :x="xScale(new Date(d.Time))"
                    :y="yScale(d.Value)"
                    :width="barWidth" 
                    :height="height - yScale(d.Value)" 
                    :fill="new Date(d.Time) >= new Date(timeRange[0]) && new Date(d.Time) <= new Date(timeRange[1]) ? themeColor : '#DFDFDF'"  
                    stroke="none"
                    /> -->


                </svg>
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
        const height = ref(40)

        
        const xScale = computed(() => {
            return d3.scaleTime().domain([new Date(wholeTimeRange.value[0]), new Date(wholeTimeRange.value[1])]).range([0, width.value])
        })

        //seriesData_copy


        // yScale


        //color
        const colors = ref([])

        

        



        
        

       

        const SD_Data = computed(() => {
            // console.log("KKK")
            // console.log(store.getters["time/SD"])
            // console.log(store.getters["time/SD"].find(d => d.level == props.level_id)?.SD??[])
            return store.getters["time/SD"].find(d => d.level == props.level_id)?.SD??[]
        })

 


        const yScale = computed(() => {
            if(SD_Data.value.length > 0){
                const scale =  d3.scaleLinear().domain([0, Math.max(...SD_Data.value.map(item => item.Value))]).range([height.value,0])
                console.log("check scale")
                console.log(scale(0))
                return scale
            }
            else {
                return d3.scaleLinear().domain([0,0]).range([0,0])
            }
            
        })

        const barWidth = computed(() => {
            if(SD_Data.value.length > 0){
                console.log("check width")
                console.log(width.value)
                console.log(width.value / SD_Data.value.length )
                return width.value * 1.0 / SD_Data.value.length - 1
            }
            else{
                return 0
            }
        });


        onMounted(() => {
            TimelineContainer.value = document.querySelector('#TimelineContainer')
            width.value = TimelineContainer.value.offsetWidth - 30
        })

        return {
            xScale,
            yScale,
            timeRange,
            themeColor,
            width,
            seriesCollection,
            SD_Data,
            barWidth,
            height,
        }
    }
}
</script>


<style>

</style>