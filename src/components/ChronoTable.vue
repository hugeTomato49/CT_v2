<template>
    <div class="h-24/25 w-full flex flex-row">
        <div class="w-2/17 h-full pl-2 py-5 bg-stone-100">
            <DataPanel />
        </div>
        <div class="w-11/17 h-full p-5">
            <Finder />
        </div>
        <div class="w-4/17 h-full pr-2 py-5 bg-stone-100">
            <SelectionPanel />
        </div>


    </div>

</template>

<script>
import Finder from './Finder.vue'
import DataPanel from './DataPanel.vue'
import SelectionPanel from './SelectionPanel.vue';

export default {
    name: 'ChronoTable',
    components: {
    Finder,
    DataPanel,
    SelectionPanel
}
}



</script>

<style>

</style>