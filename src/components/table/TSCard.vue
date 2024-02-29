<template>
    <div 
    class="w-full p-0.8" 
    :style="{ height: rowHeight + 'px' }" 
    @click="foldState ? unfold(node_id) : fold(node_id)"
    >
        <div :class="['w-full h-full card', { 'hover-effect': !foldState }]" id="cardContainer">
            <svg class="w-full h-full bg-stone-100">
                <g ref="brushRef"></g>
                <path
                :stroke="colorBar[level-1]"
                fill="none"
                stroke-width="2"
                :d="generatePath(seriesData,xScale,yScale)"
                >
                </path>
            </svg>
        </div>
    </div>
</template>
    

<script>
import { useStore } from 'vuex';
import { ref, computed, onMounted } from 'vue'
import * as d3 from 'd3'
import { generatePath } from "../../generator/generator"
export default {
    name: 'TSCard',
    props: ['seriesData', 'level', 'node_id', 'groupedNode'],
    setup(props) {
        const store = useStore()
        const selectionTree = computed(() => store.getters["tree/selectionTree"])
        const colorBar = computed(()=>store.getters["tree/colorBar"])
        const rowHeight = computed(()=>store.getters['size/rowHeight'])
        const cardHeight = computed(()=>store.getters['size/cardHeight'])
        const cardWidth = computed(()=>store.getters['size/cardWidth'])

        const foldState = ref(!props.groupedNode)

        const xScale = computed(()=>store.getters['size/xScale'])
        const yScale = computed(()=>store.getters['size/yScale'][props.level-1])

        const brushRef = ref(null)

        const setupBrush = () => {
            const brush = d3.brushX() 
                .extent([[0, 0], [cardWidth.value, cardHeight.value]]) 
                .on('end', brushed)
            d3.select(brushRef.value).call(brush);

            // Store the brush for later use
            brushRef.value.brush = brush;
        };

        const brushed = (event) => {
            const selection = event.selection;
            if (selection) {
                const newTimeRange = selection.map(xScale.value.invert)
                store.dispatch('tree/updateTimeRange', newTimeRange)
                // console.log('Selected Time Range:', newTimeRange)
                d3.select(brushRef.value).call(brushRef.value.brush.move, null)
            }
        }

        const unfold = (id) => {
            store.dispatch('tree/selectNodeAndChildren', id)
            foldState.value = false
        }

        const fold = (id) => {
            store.dispatch('tree/deselectNodeAndChildren', id)
            foldState.value = true
        }
        
        onMounted(()=>{
            cardContainer.value = document.querySelector("#cardContainer")
            store.dispatch('size/updateCardWidth', cardContainer.value?.offsetWidth)
            store.dispatch('size/updateCardHeight', cardContainer.value?.offsetHeight)
            setupBrush()
        })

        return {
            rowHeight,
            xScale,
            yScale,
            generatePath,
            brushRef,
            colorBar,
            foldState,
            fold,
            unfold
        }
    }
}

</script>

<style>
.brush .selection {
    fill: rgb(100, 102, 102);
    opacity: 0.3;
}

.hover-effect {
    box-shadow: 0 5px 4px -2.5px rgba(39, 39, 38, 0.3);
}

.card :hover {
    box-shadow: 0 5px 4px -2.5px rgba(161, 187, 205, 0.6);
}


</style>


