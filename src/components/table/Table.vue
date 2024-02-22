<template>
        <div class="w-full h-full rounded-md flex flex-row justify-center " id="tableContainer">
            <div 
            v-for="(level_id, index) in level_id_list"
            :key="level_id"
            class="flex flex-row h-full "
            >
                <div 
                class="h-full  flex flex-col border-1 rounded-md"
                :style="{
                width: tableContainer?.offsetWidth * columnPercentage - 20 + 'px'
                }">
                    <TSCard
                    v-for = "(id,index) in groupedIdCollection(level_id)"
                    :key = "id"
                    :seriesData = findSeriesData(id)
                    :level = "level_id"
                    :id = "id"
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

        const groupedIdCollection = (level_id)=> {
         
            console.log("Check groupedID")
            console.log(selectionTree.value.filter(node => node.level == level_id).map(node => node.id))
            return selectionTree.value.filter(node => node.level == level_id).map(node => node.id)
        }

    
        const findSeriesData = (id) => {
            return seriesCollection.value.find(node => node.id ==id)?.seriesData??[]
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
        }



    }
}



</script>

<style>

</style>