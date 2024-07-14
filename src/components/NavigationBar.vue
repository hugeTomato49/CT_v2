<template>
    <div 
    class="w-full h-1/25 flex flex-row items-center "
    :style="{ backgroundColor: themeColor }"
    >
        <div class="ml-4 text-xl  text-center text-white pacifico-regular">ChronoDeck</div>
    </div>
</template>



<script>
import { useStore } from 'vuex'
import { computed } from 'vue'

export default {
    name: 'NavigationBar',
    setup() {
        const store = useStore()
        const themeColor = computed(() => store.getters['color/themeColor'])
        return {
            themeColor
        }

    }
}


</script>

<style>
.pacifico-regular {
    font-family: "Inter", sans-serif;
    font-weight: 800;
    font-style: normal;
}


</style>