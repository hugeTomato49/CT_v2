<template>
        <div class="w-full h-full rounded-md flex flex-row" id="tableContainer">
            <div 
            v-for="(level_id, index) in level_id_list"
            :key="level_id"
            class="flex flex-row h-full "
            >
                <div 
                class="h-full flex flex-col border-1 rounded-md overflow overflow-scroll"
                :style="{
                width: tableContainer?.offsetWidth * columnPercentage - 20 + 'px'
                }">
                    <TSCard
                    v-for = "(id,index) in groupedIdCollection(level_id)"
                    :key = "id"
                    :id="'card' + id"
                    :seriesData = findSeriesData(id)
                    :level = "level_id"
                    :node_id = "id"
                    :groupedNode = groupedNodeFlag(id)
                    />
                </div>
                <div class="w-20px h-full"></div>
            </div>
        </div>
</template>

<script>
import { computed, ref, watchEffect, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import TSCard from './TSCard.vue'
import { selection } from 'd3'





export default {
    name: 'Table',
    components: {
        TSCard
    },
    setup() {
        const tableContainer = ref(null)

        const store = useStore()
        const selectionTree = computed(()=>store.getters['tree/selectionTree'])
        const seriesCollection = computed(()=>store.getters['tree/seriesCollection'])
        const columnPercentage = computed(()=>store.getters['size/columnPercentage'])
        const rowNum = computed(()=>store.getters['size/rowNum'])

        const level_id_list = computed(() => store.getters["tree/level_id_list"])


        // above are form vuex, which we further moderate inside the component to achieve:
        //(1) not interfere with the state of vuex
        //(2) further change the data to suit various interactions

        const groupedIdCollection = (level_id)=> {
         
            // console.log("Check groupedID")
            // console.log(selectionTree.value.filter(node => node.level == level_id).map(node => node.id))
            return selectionTree.value.filter(node => node.level == level_id).map(node => node.id)
        }

    
        const findSeriesData = (id) => {
            return seriesCollection.value.find(node => node.id ==id)?.seriesData??[]
        }

        const groupedNodeFlag = (id) => {
            const attribute = selectionTree.value.find(node => node.id == id)?.attribute??""
            if(attribute.includes("group")) {
                return true
            }
            else {
                return false
            }    
        }

        const getAverageSeriesData = (id) => {
            const id_list = selectionTree.value.find(node => node.id == id).children_id
            const series_list = seriesCollection.value.filter(node => id_list.includes(node.id)).map(node => node.seriesData)
            const average_series = series_list[0].map((item, index) => {
                let totalValue = 0;
                series_list.forEach(dataset => {
                    totalValue += dataset[index].value
                });
                const averageValue = totalValue / series_list.length
                return {
                    Time: item.Time,
                    value: averageValue
                }
            })

            return average_series
        }



        onMounted(()=>{
            tableContainer.value = document.querySelector("#tableContainer")
            store.dispatch("size/updateRowHeight", tableContainer.value?.offsetHeight / rowNum.value)
        })




        return {
            findSeriesData,
            level_id_list,
            columnPercentage,
            tableContainer,
            groupedIdCollection,
            groupedNodeFlag,
            getAverageSeriesData
        }



    }
}



</script>

<style>

</style>