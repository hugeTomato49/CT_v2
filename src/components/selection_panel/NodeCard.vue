<template>
    <div class="w-full p-2 pt-0 round-md pb-3">
        <div class="w-full py-2 px-5 entityCard" style="background-color: rgba(245, 245, 245, 0.6); ">
            <div class="w-full flex flex-col">
                <div class="w-full h-30px flex flex-row items-center" :style="{ 'border-bottom': '1px solid' + themeColor }">
                    <div class="text-sm cardTitle" :style="{ 'color': themeColor }"> Node </div>
                    <div class="flex-1"></div>
                    <div class="flex flex-row">
                        <font-awesome-icon :icon="['fas', 'magnifying-glass']" :style="{color: themeColor}" class="mr-2" size="sm"/>
                        <font-awesome-icon :icon="['fas', 'gear']" :style="{color: themeColor}" class="mr-2" size="sm"/>
                        <font-awesome-icon :icon="['fas', 'circle-xmark']" :style="{color: themeColor}" class="mr-2" size="sm"/>
                    </div>
                </div>
                <div class="w-full h-70px flex flex-row">
                    <div class="w-1/7 h-full p-0 flex flex-row items-center justify-center">
                        <div class="w-full flex flex-col " :style="{ 'color': themeColor }">
                            <div class="meta">Converter1</div>
                            <div class="description text-xs">{{ description[level - 1] }}</div>
                        </div>
                    </div>
                    <div class="w-11/14 h-full  flex flex-row justify-center ">
                        <div class="w-full h-full" :style="{ 'border-bottom': '1px solid' + themeColor }" id="seriesContainer">
                            <svg class="w-full h-full">
                                <path
                                :stroke="themeColor"
                                fill="none"
                                stroke-width="2.5"
                                :d="generatePath(seriesData,xScale,yScale)"
                                >
                                </path>
                            </svg>
                        </div>
                    </div>
                    <div class="w-1/14 h-full ">
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>



<script>
import { useStore } from 'vuex'
import { computed, onMounted, ref, watchEffect, watch } from 'vue'
import { generatePath } from '../../generator/generator'
export default {
    name: 'NodeCard',
    props: ['id', 'level'],
    setup(props) {
        //define static value using ref
        const seriesContainer = ref(null)
        const width = ref(0)
        const height = ref(0)
        const xScale = ref(null)
        const yScale = ref(null)
        const seriesData = ref([])

        //store
        const store = useStore()
        const themeColor = computed(() => store.getters["tree/themeColor"])
        const levels = computed(() => store.getters["tree/levels"])
        const description = computed(() => store.getters["tree/description"])

 
        onMounted(() => {
            seriesContainer.value = document.querySelector('#seriesContainer')
            width.value =  seriesContainer.value.offsetWidth
            height.value = seriesContainer.value.offsetHeight

            if(store.getters["tree/seriesCollection"].length>0){
                seriesData.value = store.getters["tree/seriesCollection"].find(node => node.id == props.id).seriesData
            }
            if(store.getters["size/xScale"].length > 0){
                xScale.value = store.getters["size/xScale"].range([5, width.value-5])
            }
            if(store.getters["size/yScale"].length > 0){
                yScale.value = store.getters["size/yScale"][props.level-1].range([height.value-10, 10])
                console.log("check scale")
                console.log(yScale.value(0))
            }

           
        })

 
        return {
            themeColor,
            levels,
            description,
            xScale,
            yScale,
            seriesData,
            generatePath
        }


    }
}


</script>

<style>
.cardTitle {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 800;
  font-style: "regular";
  font-variation-settings:
    "slnt" 0;
}

.entityCard {
    box-shadow: 0 3px 4px -3px rgba(138, 139, 139, 0.6);
}

.meta {
  font-size: 0.75rem;
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: "regular";
  font-variation-settings:
    "slnt" 0;

}

.description {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: "regular";
  font-variation-settings:
    "slnt" 0;

}


</style>