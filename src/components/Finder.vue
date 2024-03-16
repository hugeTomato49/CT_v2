<template>
    <div class="w-full h-full flex flex-col">
        <div class="w-full h-1/4">
            <TableHeader />
        </div>
        <div :style="`height: ${height}px`" class="w-full flex flex-row">
            <div 
                v-for="(level_id,index) in level_id_list"
                :key="level_id"
                @click="showBarChart()"
                class="cursor-pointer w-1/4 h-full"
            >
                <Timeline 
                :barChartVisible="barChartVisible"
                :level_id="level_id"
                />
            </div>
        </div>
        <div class="w-full pt-2" :style="`height: calc(75% - ${height}px)`">
            <Table />
        </div>
    </div>
</template>

<script>
import TableHeader from './TableHeader.vue'
import Timeline from './table/Timeline.vue'
import Table from './table/Table.vue'
import { ref,computed } from 'vue' 
import { useStore } from 'vuex'
export default {
    name: 'Finder',
    components: {
        TableHeader,
        Timeline,
        Table
    },
    setup() {
        const store = useStore()
        const level_id_list = computed(() => store.getters["tree/level_id_list"])

        const height = ref(5)
        const barChartVisible = ref(false)

        const showBarChart = () => {
            barChartVisible.value = !barChartVisible.value; 
            height.value = barChartVisible.value ? 20 : 5; 
        }

        return {
            height,
            barChartVisible,
            showBarChart,
            level_id_list,
        }
    }
}
</script>

<style>
/* You can add your styles here */
</style>
