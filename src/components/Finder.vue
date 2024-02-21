<template>
    <div class="w-full h-full">
        <div class="w-full h-1/4">
            <TableHeader />
        </div>
        <div class="w-full h-3/4 pt-2">
            <Table />

        </div>


    </div>


   
</template>

<script>
import TableHeader from './TableHeader.vue'
import Table from './table/Table.vue'
export default {
    name: 'Finder',
    components: {
        TableHeader,
        Table
    }

}



</script>

<style>

</style>