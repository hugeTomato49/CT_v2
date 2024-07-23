<template>
        <div  v-if="checkCollection.includes(node_id)" class="selectCheck absolute " :style="{ top: `${12 + (index * 50)}px` }">
            <font-awesome-icon :icon="['fas', 'circle-check']" size="lg" style="color: #F24E1E;" />
        </div>



</template>


<script>
import { useStore } from 'vuex';
import { ref, computed, onMounted, watchEffect, watch, nextTick } from 'vue'
import * as d3 from 'd3'

export default {
    name: 'SelectionIcon',
    props: [ 'level', 'node_id', 'node_name', 'groupedNode', "index", "checkCollection"],
    components: {

    },
    setup(props) {
        const store = useStore()
        // const checkCollection = computed(() => {
        //     return store.getters["card/selectCheck"]
        // })
        const selectCheck = computed (()=>{
            const array = checkCollection.value
            // if(array.includes(props.node_id)){
            //     return true
            // }
            // else{
            //     return false
            // }
        })
        return {
            selectCheck,
            // checkCollection,
        }
    }
}

</script>

<style>

.selectCheck {
    position: absolute;
    /* top: 20%; */
    left: 97%;
    transform: translate(-50%, -50%);
    z-index: 40;
    /* 确保这个值高于其他内容 */

}

.selectDeny {
    position: absolute;
    top: 50%;
    left: 98%;
    transform: translate(-50%, -50%);
    z-index: 40;
    /* 确保这个值高于其他内容 */

}
</style>
