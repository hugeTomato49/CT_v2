<template>
    <div 
    v-if="showState"
    class="w-full h-full">
        <NodeCard 
        :id = '1'
        :level = '1'
        />
        <PathCard 
        :id_list = id_list
        :level_list = level_list
        :related= true
        />
        <TreeCard 
        :id_list=tree_id_list
        :level_list=tree_level_list
        :related= false
        />
        <TreeCard 
        :id_list=tree_id_list
        :level_list=tree_level_list
        :related= true
        />
  
    </div>
    <ConfigureButton 
        buttonName="show"
        @click="toggleShowState()"
    /> 

</template>

<script>
import NodeCard from './selection_panel/NodeCard.vue'
import PathCard from './selection_panel/PathCard.vue'
import TreeCard from './selection_panel/TreeCard.vue'
import ConfigureButton from './table/ConfigureButton.vue'

import { useStore } from 'vuex'
import { computed, ref } from 'vue' 
export default {
    name: 'SelectionPanel',
    components: {
        NodeCard,
        PathCard,
        TreeCard,
        ConfigureButton
    },
    setup() {
        const store = useStore()
        const showState = ref(false)


        const toggleShowState = () => {
            showState.value = !showState.value
        }

        const id_list =  ref(['2','30'])
        const level_list =  ref(['2','3'])
        const tree_id_list = ref([1,5,7,8,9])
        const tree_level_list = ref([1,2,2,2,2])

        return {
            showState,
            toggleShowState,
            id_list,
            level_list,
            tree_id_list,
            tree_level_list

        }






    }

}


</script>


<style>


</style>