<template>
    <div class="h-17/18 w-full flex flex-row">
        <div class="w-2/17 h-full pl-2 py-5"></div>
        <div class="w-13/17 h-full p-5">
            <Finder />
        </div>
        <div class="w-2/17 h-full pr-2 py-5"></div>


    </div>

</template>

<script>
import Finder from './Finder.vue';
export default {
    name: 'ChronoTable',
    components: {
        Finder,

    }
}



</script>

<style>

</style>