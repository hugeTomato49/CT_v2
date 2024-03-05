<template>
    <div class="w-full h-full">
        <NodeCard />
        <PathCard />
        <TreeCard />
        
    </div>

</template>

<script>
import NodeCard from './selection_panel/NodeCard.vue'
import PathCard from './selection_panel/PathCard.vue'
import TreeCard from './selection_panel/TreeCard.vue'
export default {
    name: 'SelectionPanel',
    components: {
        NodeCard,
        PathCard,
        TreeCard
    }
}


</script>


<style>


</style>