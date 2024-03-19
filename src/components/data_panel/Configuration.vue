<template>
    <div class="w-full h-full p-2">
        <div class="w-full h-full flex flex-col">
            <div class="w-full flex flex-row justify-center">
                <div class="w-2/3 flex flex-row ">
                    <div class="name " :style="{ 'color': themeColor }"> link </div>
                    <div class="flex-1"></div>
                    <div v-if="linkVisible" @click="toggleLinkVisible" class="cursor-pointer">
                        <font-awesome-icon :icon="['fas', 'eye']" />
                    </div>
                    <div v-else="!linkVisible" @click="toggleLinkVisible" class="cursor-pointer">
                        <font-awesome-icon :icon="['fas', 'eye-slash']" />
                    </div>
                </div>
            </div>
            <div class="w-full flex flex-row justify-center mt-2">
                <div class="w-2/3 flex flex-row">
                    <div class="name " :style="{ 'color': themeColor }"> highlight </div>
                    <div class="flex-1"></div>
                    <div v-if="highlightVisible" @click="toggleHighlightVisible" class="cursor-pointer">
                        <font-awesome-icon :icon="['fas', 'eye']" />
                    </div>
                    <div v-else="!highlightVisible" @click="toggleHighlightVisible" class="cursor-pointer">
                        <font-awesome-icon :icon="['fas', 'eye-slash']" />
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
    name: 'Configuration',
    setup() {
        const store = useStore()
        const themeColor = computed(() => store.getters["tree/themeColor"])

        const linkVisible = computed(() => store.getters["scatterPlot/linkVisible"])
        const highlightVisible = computed(() => store.getters["scatterPlot/highlightVisible"])

        const toggleLinkVisible = () => {
            store.dispatch('scatterPlot/toggleLinkVisible')
        }

        
        const toggleHighlightVisible = () => {
            store.dispatch('scatterPlot/toggleHighlightVisible')
        }
        


        


        return {
            themeColor,
            linkVisible,
            toggleLinkVisible,
            highlightVisible,
            toggleHighlightVisible
        }

    }
}


</script>


<style>
.name {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: "semibold";
  font-variation-settings:
    "slnt" 0;
}



</style>