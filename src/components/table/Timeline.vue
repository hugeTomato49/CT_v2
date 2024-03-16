<template>
    <div class="w-full h-full p-0.8 flex flex-col">
        <div class="h-10px w-full" id="TimelineContainer">

        </div>
        <div class="h-4px w-full">
            <svg class="w-full h-full">
                <line :x1="0" :y1="2" :x2="width" :y2="2" stroke="#f5f5f4" stroke-width="4" stroke-linecap="round"></line>
                <!-- <line v-if="timeRange.length>0" :x1="xScale(new Date(timeRange[0]))" :y1="2" :x2="xScale(new Date(timeRange[1]))" :y2="2" :stroke="themeColor" stroke-width="4" stroke-linecap="round"></line> -->
            </svg>
        </div>
    </div>
</template>


<script>
import { useStore } from 'vuex'
import { ref, computed, onMounted, watch } from 'vue'
import { getXScale, getYScale } from '../../scale/scale'
import { cloneDeep } from 'lodash'


export default {
    name: 'Timeline',
    props: ['barChartVisible', 'level_id'],
    setup() {
        const store = useStore()
        const themeColor = computed(() => store.getters["tree/themeColor"])
        const seriesCollection = computed(() => store.getters["tree/seriesCollection"])
        const timeRange = computed(() => store.getters["tree/timeRange"])

        const TimelineContainer = ref(null)
        const width = ref(0)

        const xScale = ref(null)


        watch(seriesCollection, (newValue) => {
            if (newValue !== null) {
                console.log("hey")
                const data = cloneDeep(store.getters["tree/seriesCollection"][0]["seriesData_copy"])
                data.forEach(d => {
                    d.Time = new Date(d.Time)
                })

                xScale.value = getXScale(data, width.value)


                console.log(xScale.value.domain())
                console.log(xScale.value(new Date(timeRange.value[0])))

            

            }
        });





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