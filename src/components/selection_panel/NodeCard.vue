<template>
    <div class="w-full h-3/25 p-2 pt-0 round-md pb-3">
        <div class="w-full h-full py-2 px-5 entityCard" style="background-color: rgba(245, 245, 245, 0.6); ">
            <div class="w-full h-full flex flex-col">
                <div class="w-full h-35px flex flex-row items-center" :style="{ 'border-bottom': '1px solid' + themeColor }">
                    <div class="text-md cardTitle" :style="{ 'color': themeColor }"> Node </div>
                    <div class="flex-1"></div>
                    <div class="flex flex-row">
                        <font-awesome-icon :icon="['fas', 'magnifying-glass']" :style="{color: themeColor}" class="mr-2"/>
                        <font-awesome-icon :icon="['fas', 'gear']" :style="{color: themeColor}" class="mr-2"/>
                        <font-awesome-icon :icon="['fas', 'circle-xmark']" :style="{color: themeColor}" class="mr-2"/>
                    </div>
                </div>
                <div class="w-full h-3/4 flex flex-row p-1">
                    <div class="w-1/7 h-full p-2">
                        <div class="w-full h-full flex flex-col">
                            <!-- <div>{{ Converter1 }}</div>
                            <div>{{ description[node.level-1] }}</div> -->
                        </div>
                    </div>
                    <div class="w-5/7 h-full bg-blue-100">
                        
                    </div>
                    <div class="w-1/7 h-full bg-green-100">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
    name: 'NodeCard',
    props: ['id'],
    setup(props) {
        const store = useStore()
        const themeColor = computed(() => store.getters["tree/themeColor"])
        const selectionTree = computed(() => store.getters["tree/selectionTree"])
        const seriesCollection = computed(() => store.getters["tree/seriesCollection"])
        const levels = computed(() => store.getters["tree/levels"])
        const description = computed(() => store.getters["tree/description"])
        const xScale = computed(()=>store.getters['size/xScale'])
        const yScale = computed(()=>store.getters['size/yScale'])

        const node = computed(() => selectionTree.value.find(node => node.id == props.id))
        const seriesData = computed(() => seriesCollection.value.find(node => node.id == props.id).seriesData)
        
        

       



        return {
            themeColor,
            levels,
            node,
            description,
            seriesData,
            xScale,
            yScale
        }


    }
}


</script>

<style>
.cardTitle {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: "regular";
  font-variation-settings:
    "slnt" 0;
}

.entityCard {
    box-shadow: 0 3px 4px -3px rgba(138, 139, 139, 0.6);
}

</style>