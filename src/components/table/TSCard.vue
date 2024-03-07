<template>
    <div 
    :class="['w-full p-0.8 hover:opacity-100', {'opacity-40': !ifEmphasize(selectionTree, node_id, level, level_id_list)}, {'emphasizeCard': ifEmphasize(selectionTree, node_id, level, level_id_list)}]" 
    :id="'card' + node_id"
    :style="{ height: rowHeight + 'px' }" 
    @mouseover="handleMouseOver(node_id)"
    @mouseout="handleMouseOut(node_id)"
    @click="!hasChildren(selectionTree, node_id) ? unfold(node_id) : fold(node_id)"
    @dblclick="filterCurrentCard(node_id)"
    >
        <div 
        :class="['w-full h-full card ', { 'emphasize-effect': ifEmphasize(selectionTree, node_id, level, level_id_list) }]" 
        id="cardContainer">
            <svg class="w-full h-full bg-stone-100">
                <text x="5" y="12" class="node-name text-ms">{{ node_name }}</text>
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
import { hasChildren, ifEmphasize, findAllRelatedNodeIds, highlightLinks, findChildrenIds } from '../../computation/treeComputation'
import { highlightNodes, deHighlightNodes, highlightEmphaizeCards, deHighlightEmphasizeCards } from "../../highlight/highlight"


export default {
    name: 'TSCard',
    props: ['seriesData', 'level', 'node_id', 'node_name', 'groupedNode'],
    setup(props) {
        const store = useStore()
        const selectionTree = computed(() => store.getters["tree/selectionTree"])
        const level_id_list = computed(()=> store.getters["tree/level_id_list"])
        const colorBar = computed(()=>store.getters["tree/colorBar"])
        const rowHeight = computed(()=>store.getters['size/rowHeight'])
        const cardHeight = computed(()=>store.getters['size/cardHeight'])
        const cardWidth = computed(()=>store.getters['size/cardWidth'])


        const xScale = computed(()=>store.getters['size/xScale'])
        const yScale = computed(()=>store.getters['size/yScale'][props.level-1])

        const originalTree = computed(() => store.getters["tree/originalTree"])
        const plot_X_Scale = computed(() => store.getters["scatterPlot/plot_X_Scale"])
        const plot_Y_Scale = computed(() => store.getters["scatterPlot/plot_Y_Scale"])
        const coordinateCollection = computed(() => store.getters["scatterPlot/coordinateCollection"])
        const columnWidth = computed(() => store.getters["scatterPlot/columnWidth"])



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


        }

        const fold = (id) => {
            store.dispatch('tree/deselectNodeAndChildren', id)
        }

        const filterCurrentCard = (id) => {
            const currentNode = selectionTree.value.find(node => node.id == id)
            const level = currentNode.level
            const id_list = selectionTree.value.filter(node => node.id != id && node.level == level).map(node => node.id)
            id_list.forEach(id => {
                store.dispatch('tree/deselectNodeAndChildren', id)
            })
        }

        const handleMouseOver = (id) => {
            if(ifEmphasize(selectionTree.value, id, props.level, level_id_list.value)){
                deHighlightEmphasizeCards()
            }
            const id_list = findChildrenIds(id, originalTree.value)
            highlightNodes(id_list)
            store.dispatch('scatterPlot/updateBezierPaths',      
                highlightLinks(
                id,
                originalTree.value,
                coordinateCollection.value,
                plot_X_Scale.value,
                plot_Y_Scale.value,
                columnWidth.value
            ))

        };

        const handleMouseOut = (id) => {
            if(ifEmphasize(selectionTree.value, id, props.level, level_id_list.value)){
                highlightEmphaizeCards()
            }
            const id_list = findChildrenIds(id, originalTree.value)
            deHighlightNodes(id_list)
            store.dispatch('scatterPlot/updateBezierPaths',[])
        };
        
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
            fold,
            unfold,
            selectionTree,
            hasChildren,
            ifEmphasize,
            level_id_list,
            filterCurrentCard,
            handleMouseOver,
            handleMouseOut
        }
    }
}

</script>

<style>
.brush .selection {
    fill: rgb(100, 102, 102);
    opacity: 0.3;
}

.emphasize-effect {
    box-shadow: 0 5px 4px -2.5px rgba(151, 192, 204, 0.6);
}

.card :hover {
    box-shadow: 0 5px 4px -2.5px rgba(151, 192, 204, 0.6);
}

.node-name {
    font-size: 6px; 
    fill: #4B99D0; 
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: "semibold italic";
    font-variation-settings:
    "slnt" 0;

}



</style>


