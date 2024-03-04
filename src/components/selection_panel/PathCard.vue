<template>
    <div class="w-full h-1/5 p-2 pt-0 round-md pb-3">
        <div class="w-full h-full py-2 px-5 entityCard" style="background-color: rgba(245, 245, 245, 0.6); ">
            <div class="w-full h-full flex flex-col">
                <div class="w-full h-40px flex flex-row items-center" :style="{ 'border-bottom': '1px solid' + themeColor }">
                    <div class="text-md cardTitle" :style="{ 'color': themeColor }"> Path </div>
                    <div class="flex-1"></div>
                    <div class="flex flex-row">
                        <font-awesome-icon :icon="['fas', 'magnifying-glass']" :style="{color: themeColor}" class="mr-2"/>
                        <font-awesome-icon :icon="['fas', 'gear']" :style="{color: themeColor}" class="mr-2"/>
                        <font-awesome-icon :icon="['fas', 'circle-xmark']" :style="{color: themeColor}" class="mr-2"/>
                    </div>
                </div>
                <div class="w-full h-3/4">
                </div>
            </div>
        </div>
    </div>
</template>



<script>
import { useStore } from 'vuex'
import { computed } from 'vue'
export default {
    name: 'PathCard',
    setup() {
        const store = useStore()
        const themeColor = computed(() => store.getters["tree/themeColor"])
        
        return {
            themeColor
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