<template>
  <div class="w-full h-full">
    <div class="w-full h-full rounded-md flex flex-col" id="headerContainer">
      <div class="flex flex-row h-1/8 w-full">
        <div
          v-for="(level_name, index) in level_name_list"
          :key="level_name"
          class="flex flex-row h-full"
          :style="{
            width: headerContainer?.offsetWidth * columnPercentage + 'px',
          }"
        >
          <div
            class="h-full flex flex-row items-center"
            :style="{
              width:
                headerContainer?.offsetWidth * columnPercentage - 30 + 'px',
              backgroundColor: colorBar[index],
            }"
          >
            <div class="ml-2 text-ms font-serif text-center text-white title">
              {{ level_name }}
            </div>
            <div class="flex-1 h-full"></div>
            <div class="flex flex-row mr-1">
              <font-awesome-icon 
              :icon="['fas', 'toggle-on']" 
              class="mr-2 cursor-pointer"
              style="color: #ffffff;" 
              @click="toggleAlign(level_id_list[index])"
              />
              <font-awesome-icon 
              :icon="['fas', 'arrow-down-short-wide']" 
              class="mr-2 cursor-pointer"
              style="color: #ffffff;" 
              @click="sortColumn(level_id_list[index],'asc')"
              />
              <font-awesome-icon 
              :icon="['fas', 'draw-polygon']" 
              class="mr-2 cursor-pointer"
              style="color: #ffffff;" 
              />
              <font-awesome-icon 
              :icon="['fas', 'object-ungroup']" 
              class="cursor-pointer mr-2"
              style="color: #ffffff;" 
              @click="createLayers(level_id_list[index])"
              />
            </div>
          </div>
          <div
            class="h-full px-0.5px bg-stone-100 cursor-pointer flex flex-row justify-center items-center"
            :style="{ width: 30 + 'px' }"
            @click="addColumn"
          >
            <font-awesome-icon :icon="['fas', 'plus']" style="color: #e2e3e4" />
          </div>
        </div>
      </div>
      <div class="w-full h-7/8 py-1" style="position: relative; z-index: 2">
        <div class="w-full h-full flex flex-row" id="plotContainer">
          <div class="h-full" :style="{ width: dynamicWidth + 'px' }">
            <svg class="h-full" :style="{ width: dynamicWidth + 'px' }">
              <g>
              </g>
              <g>
              </g>
              <path
                v-for="pathObj in selectNodePaths"
                :key="pathObj.key"
                :d="pathObj.d"
                stroke="rgba(243,194,18,0.8)"
                stroke-width="2"
                fill="none"
                class="emphasizeLink cursor-pointer"
                :id="pathObj.key"
                @mouseover = handleMouseOverLink(pathObj.key)
                @mouseleave = handleMouseOutLink(pathObj.key)
              />
              <path
                v-for="pathObj in bezierPaths"
                :key="pathObj.key"
                :d="pathObj.d"
                stroke="rgb(243,194,18)"
                stroke-width="2"
                fill="none"
              />
              <g
                v-for="(level_name, index) in level_name_list"
                :key="level_name"
                class="h-full"
                :transform="
                  'translate(' +
                  headerContainer?.offsetWidth * columnPercentage * index +
                  ', 0)'
                "
              >
                <rect
                  x="0"
                  y="0"
                  :width="headerContainer?.offsetWidth * columnPercentage - 30"
                  height="100%"
                  stroke="#e5e7eb"
                  stroke-width="2"
                  fill="none"
                  rx="5"
                ></rect>
                <circle
                  v-for="circle in circlesData[level_id_list[index]].filter(circle => !hasNode(selectionTree, circle.key))"
                  class="node cursor-pointer"
                  :id="'node' + circle.key"
                  :key="circle.key"
                  :cx="circle.cx"
                  :cy="circle.cy"
                  :r="circle.r"
                  :fill="colorBar[index]"
                  :fill-opacity="circle.fillOpacity"
                  :stroke = "circle.stroke"
                  :stroke-width = "circle.strokeWidth"
                  @click="handleNodeClick(circle.key)"
                  @dblclick="filterCurrentNode(circle.key)"
                  @mouseover="handleMouseOver(circle.key, level_id_list[index])"
                  @mouseout="handleMouseOut(circle.key, level_id_list[index])"
                ></circle>
                <circle
                  v-for="circle in circlesData[level_id_list[index]].filter(circle => hasNode(selectionTree, circle.key) && !ifEmphasize(selectionTree, circle.key, level_id_list[index], level_id_list))"
                  class="node cursor-pointer foldNode"
                  :id="'node' + circle.key"
                  :key="circle.key"
                  :cx="circle.cx"
                  :cy="circle.cy"
                  :r="circle.r"
                  :fill="colorBar[index]"
                  :fill-opacity="circle.fillOpacity"
                  :stroke = "circle.stroke"
                  :stroke-width = "circle.strokeWidth"
                  @click="handleNodeClick(circle.key)"
                  @dblclick="filterCurrentNode(circle.key)"
                  @mouseover="handleMouseOver(circle.key, level_id_list[index])"
                  @mouseout="handleMouseOut(circle.key, level_id_list[index])"
                ></circle>
                <circle
                  v-for="circle in circlesData[level_id_list[index]].filter(circle => ifEmphasize(selectionTree, circle.key, level_id_list[index], level_id_list))"
                  class="node cursor-pointer emphasizeNode"
                  :id="'node' + circle.key"
                  :key="circle.key"
                  :cx="circle.cx"
                  :cy="circle.cy"
                  :r="circle.r"
                  :fill="colorBar[index]"
                  :fill-opacity="circle.fillOpacity"
                  :stroke = "circle.stroke"
                  :stroke-width = "circle.strokeWidth"
                  @mouseover="handleMouseOver(circle.key, level_id_list[index])"
                  @mouseout="handleMouseOut(circle.key, level_id_list[index])"
                  @click="handleNodeClick(circle.key)"
                  @dblclick="filterCurrentNode(circle.key)"
                ></circle>
              </g>  
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex"
import { computed, ref, onMounted } from "vue"
import {
  calculatePlotLinks,
  calculateCircles,
  hasChildren,
  ifEmphasize,
  hasNode,
  highlightLinks,
  findAllRelatedNodeIds,
  findChildrenIds
} from "../computation/treeComputation"
import {
  highlightNodes,
  deHighlightNodes,
  highlightLink,
  highlightEmphaizeCards,
  deHighlightEmphasizeCards
} from "../highlight/highlight"



export default {
  name: "TableHeader",
  setup() {
    const headerContainer = ref(null);
    const plotContainer = ref(null);
    const store = useStore();
    const columnPercentage = computed(
      () => store.getters["size/columnPercentage"]
    );

    const colorBar = computed(() => store.getters["tree/colorBar"])
    const dataset = computed(() => store.getters["tree/dataset"])
    const originalTree = computed(() => store.getters["tree/originalTree"])
    const selectionTree = computed(() => store.getters["tree/selectionTree"])
    const levels = computed(() => store.getters["tree/levels"])
    const level_id_list = computed(() => store.getters["tree/level_id_list"])
    const level_name_list = computed(() =>level_id_list.value.map((id) => levels.value[id - 1]))
    const alignState = computed(() => store.getters["align/alignState"])

    const dynamicWidth = computed(() => {
      if (headerContainer.value && level_name_list.value) {
        return (
          headerContainer.value.offsetWidth *
          columnPercentage.value *
          level_name_list.value.length
        );
      }
      return 0;
    });

    const bezierPaths = computed(() => store.getters["scatterPlot/bezierPaths"])
    const plot_X_Scale = computed(() => store.getters["scatterPlot/plot_X_Scale"]);
    const plot_Y_Scale = computed(() => store.getters["scatterPlot/plot_Y_Scale"]);
    const coordinateCollection = computed(() => store.getters["scatterPlot/coordinateCollection"]);
    const selectNodePaths = computed(() => {
      let allPaths = []
      const newTree = selectionTree.value.filter(node => ifEmphasize(selectionTree.value, node.id, node.level, level_id_list.value))
      newTree.forEach((node) => {
        if (hasChildren(selectionTree.value, node.id)) {
          const pathsForNode = calculatePlotLinks(
            node.id,
            selectionTree.value,
            coordinateCollection.value,
            plot_X_Scale.value,
            plot_Y_Scale.value,
            headerContainer.value.offsetWidth * columnPercentage.value,
            level_id_list.value
          ); // 根据节点ID计算路径
          allPaths = allPaths.concat(pathsForNode); // 将结果合并到总数组中
        }
      });
      // console.log(allPaths.length)
      return allPaths;
    });
    const circlesData = computed(() => {
      return calculateCircles(
        level_id_list.value,
        coordinateCollection.value,
        plot_X_Scale.value,
        plot_Y_Scale.value,
        selectionTree.value
      );
    });

    const handleMouseOver = (id,level) => {
      if(ifEmphasize(selectionTree.value, id, level, level_id_list.value)){
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
        headerContainer.value.offsetWidth * columnPercentage.value
      ))
    }

    const handleMouseOut = (id,level) => {
      if(ifEmphasize(selectionTree.value, id, level, level_id_list.value)){
        highlightEmphaizeCards() 
      }
      const id_list = findChildrenIds(id, originalTree.value)
      deHighlightNodes(id_list)
      store.dispatch('scatterPlot/updateBezierPaths',[])
    }

    const handleMouseOverLink = (key) => {
      deHighlightEmphasizeCards()
      highlightNodes(key.split('-'))
      highlightLink(key)

    }

    const handleMouseOutLink = (key) => {
      highlightEmphaizeCards()
      deHighlightNodes(key.split('-'))
    }

    const handleNodeClick = (id) => {
      if (!hasChildren(selectionTree.value, id)) {
        store.dispatch("tree/selectNodeAndChildren", id);
      } else {
        store.dispatch("tree/deselectNodeAndChildren", id);
      }
    }

    const addColumn = () => {
      store.dispatch("tree/addLevelToLevelIdList");
    }

    const sortColumn = (level,mode) => {
      const id_list = selectionTree.value.filter(node => node.level == level).map(node => node.id)
      store.dispatch("tree/sortSelectionTree", {"id_list":id_list, "mode":mode})

    }

    const createLayers = (level_id) => {
      const obj = { dataset: dataset.value, level_id: level_id };
      store.dispatch("tree/addLayer", obj);
    }

    const filterCurrentNode = (id) => {
        const currentNode = selectionTree.value.find(node => node.id == id)
        const level = currentNode.level
        const id_list = selectionTree.value.filter(node => node.id != id && node.level == level).map(node => node.id)
        id_list.forEach(id => {
            store.dispatch('tree/deselectNodeAndChildren', id)
        })
    }

    const toggleAlign = (level_id) => {
      if(alignState.value == false){
        store.dispatch("align/updateAlignState", true)
        store.dispatch("align/updateAlignLevel", level_id)
        store.dispatch("align/calculateAlignID")
      }
      else {
        store.dispatch("align/updateAlignState", false)
        store.dispatch("align/updateAlignLevel", 1)
        store.dispatch("align/calculateAlignID")
      }
    }

    



    onMounted(() => {
      headerContainer.value = document.querySelector("#headerContainer");
      plotContainer.value = document.querySelector("#plotContainer");
      store.dispatch(
        "scatterPlot/updatePlotWidth",
        headerContainer.value.offsetWidth * columnPercentage.value - 30
      )
      store.dispatch(
        "scatterPlot/updateColumnWidth",
        headerContainer.value.offsetWidth * columnPercentage.value 
      );
      store.dispatch(
        "scatterPlot/updatePlotHeight",
        plotContainer.value.offsetHeight
      );
    });

    return {
      selectionTree,
      headerContainer,
      plotContainer,
      level_id_list,
      level_name_list,
      colorBar,
      plot_X_Scale,
      plot_Y_Scale,
      coordinateCollection,
      circlesData,
      dynamicWidth,
      columnPercentage,
      bezierPaths,
      selectNodePaths,
      handleNodeClick,
      handleMouseOver,
      handleMouseOut,
      handleMouseOverLink,
      handleMouseOutLink,
      addColumn,
      sortColumn,
      createLayers,
      filterCurrentNode,
      hasNode,
      ifEmphasize,
      alignState,
      toggleAlign

    };
  },
};
</script>

<style>
.title {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: "semibold";
  font-variation-settings:
    "slnt" 0;
}
</style>