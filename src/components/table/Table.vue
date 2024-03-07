<template>
        <div class="w-full h-full rounded-md flex flex-row tableContainer" id="tableContainer">
            <div 
            v-for="(level_id, index) in level_id_list"
            :key="level_id"
            class="flex flex-row h-full "
            >
                <div 
                class="h-full flex flex-col border-1 rounded-md overflow overflow-scroll"
                :style="{
                width: tableContainer?.offsetWidth * columnPercentage - 30 + 'px'
                }">
                    <Section
                    v-for="(parent_id, index) in groupLevelByParentId(level_id, selectionTree)"
                    :key = parent_id
                    :node_id_list = "findNodesByParentId(parent_id, selectionTree)"
                    :level_id = "level_id"
                    />
                </div>
                <div class="w-30px h-full">
                    <LinkColumn 
                    v-if="level_id != level_id_list.length"
                    :level = level_id
                    />

                </div>
            </div>
        </div>
</template>

<script>
import { computed, ref, watchEffect, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import Section from "./Section.vue"
import LinkColumn from './LinkColumn.vue'



export default {
    name: 'Table',
    components: {
        Section,
        LinkColumn
    },
    setup() {
        const tableContainer = ref(null)

        const store = useStore()
        const selectionTree = computed(()=>store.getters['tree/selectionTree'])
        const seriesCollection = computed(()=>store.getters['tree/seriesCollection'])
        const columnPercentage = computed(()=>store.getters['size/columnPercentage'])
        const rowNum = computed(()=>store.getters['size/rowNum'])

        const level_id_list = computed(() => store.getters["tree/level_id_list"])





        const groupLevelByParentId = (level_id, tree) => {
            const parent_list = [...new Set(tree.filter(node => node.level == level_id).map( node => node.parent_id))]
            return parent_list
        }
        
        const findNodesByParentId = (parent_id,tree) => {
            return tree.filter(node => node.parent_id == parent_id).map(node => node.id)
        }





        onMounted(()=>{
            tableContainer.value = document.querySelector("#tableContainer")
            store.dispatch("size/updateRowHeight", tableContainer.value?.offsetHeight / rowNum.value)
        })




        return {
            selectionTree,
            level_id_list,
            columnPercentage,
            tableContainer,
            groupLevelByParentId,
            findNodesByParentId
        }
    }
}



</script>

<style>

</style>