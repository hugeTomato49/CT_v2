<template>
    <svg width="16" height="16"> 
        <circle cx="8" cy="8" r="8" fill="#DDEAF7" /> 
        <text x="50%" y="50%" fill="white" font-size="8" alignment-baseline="middle" text-anchor="middle">{{ number }}</text> 
    </svg>
</template>

<script>
export default {
    name: 'CircleIcon',
    props: ['number'],
    setup() {
        
    }
}
</script>

<style>

</style>
