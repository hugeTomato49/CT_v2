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
                headerContainer?.offsetWidth * columnPercentage - 20 + 'px',
              backgroundColor: colorBar[index],
            }"
          >
            <div class="ml-2 text-ms font-serif text-center text-white title">
              {{ level_name }}
            </div>
            <div class="flex-1 h-full"></div>
            <div class="flex flex-row mr-2">
              <font-awesome-icon 
              :icon="['fas', 'object-ungroup']" 
              class="cursor-pointer"
              style="color: #ffffff;" 
              @click="createLayers(level_id_list[index])"
              />
            </div>
          </div>
          <div
            class="h-full px-0.5px bg-stone-100 cursor-pointer flex flex-row justify-center items-center"
            :style="{ width: 20 + 'px' }"
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
              <path
                v-for="pathObj in bezierPaths"
                :key="pathObj.key"
                :d="pathObj.d"
                stroke="rgb(243,194,18)"
                stroke-width="2"
                fill="none"
              />
              <path
                v-for="pathObj in selectNodePaths"
                :key="pathObj.key"
                :d="pathObj.d"
                stroke="rgb(243,194,18)"
                stroke-width="2"
                stroke-opacity="0.8"
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
                  :width="headerContainer?.offsetWidth * columnPercentage - 20"
                  height="100%"
                  stroke="#e5e7eb"
                  stroke-width="2"
                  fill="none"
                  rx="5"
                ></rect>
                <circle
                  v-for="circle in circlesData[level_id_list[index]] ?? []"
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
import { useStore } from "vuex";
import { computed, ref, onMounted } from "vue";
import {
  highlightNodes,
  resetNodes,
  calculatePlotLinks,
  calculateCircles,
  hasChildren,
  ifEmphasize,
  hasNode,
} from "../computation/treeComputation";


export default {
  name: "TableHeader",
  setup() {
    const headerContainer = ref(null);
    const plotContainer = ref(null);
    const store = useStore();
    const columnPercentage = computed(
      () => store.getters["size/columnPercentage"]
    );

    const colorBar = computed(() => store.getters["tree/colorBar"]);

    const dataset = computed(() => store.getters["tree/dataset"]);
    const originalTree = computed(() => store.getters["tree/originalTree"]);
    const selectionTree = computed(() => store.getters["tree/selectionTree"]);
    const levels = computed(() => store.getters["tree/levels"]);
    const level_id_list = computed(() => store.getters["tree/level_id_list"]);
    const level_name_list = computed(() =>
      level_id_list.value.map((id) => levels.value[id - 1])
    );

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

    const bezierPaths = ref([]);
    //step2: 取对应的scale和coordindateCollection数据
    const plot_X_Scale = computed(
      () => store.getters["scatterPlot/plot_X_Scale"]
    );
    const plot_Y_Scale = computed(
      () => store.getters["scatterPlot/plot_Y_Scale"]
    );
    const coordinateCollection = computed(
      () => store.getters["scatterPlot/coordinateCollection"]
    );
    const selectNodePaths = computed(() => {
      let allPaths = []
      const newTree = selectionTree.value.filter(node => ifEmphasize(selectionTree.value, node.id, node.level, level_id_list.value))
      console.log("CHECK")
      console.log(newTree.length)
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
      console.log(allPaths.length)
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

    const handleMouseOver = (id) => {
      highlightNodes(id, originalTree.value);
      bezierPaths.value = calculatePlotLinks(
        id,
        selectionTree.value,
        coordinateCollection.value,
        plot_X_Scale.value,
        plot_Y_Scale.value,
        headerContainer.value.offsetWidth * columnPercentage.value
      );
    };

    const handleMouseOut = () => {
      bezierPaths.value = [];
      resetNodes(selectionTree.value);
    };

    const handleNodeClick = (id) => {
      if (!hasChildren(selectionTree.value, id)) {
        store.dispatch("tree/selectNodeAndChildren", id);
      } else {
        store.dispatch("tree/deselectNodeAndChildren", id);
      }
    };

    const addColumn = () => {
      store.dispatch("tree/addLevelToLevelIdList");
    };

    const createLayers = (level_id) => {
      const obj = { dataset: dataset.value, level_id: level_id };
      store.dispatch("tree/addLayer", obj);
    };

    const filterCurrentNode = (id) => {
        const currentNode = selectionTree.value.find(node => node.id == id)
        const level = currentNode.level
        const id_list = selectionTree.value.filter(node => node.id != id && node.level == level).map(node => node.id)
        id_list.forEach(id => {
            store.dispatch('tree/deselectNodeAndChildren', id)
        })
    }

    onMounted(() => {
      headerContainer.value = document.querySelector("#headerContainer");
      plotContainer.value = document.querySelector("#plotContainer");
      store.dispatch(
        "scatterPlot/updatePlotWidth",
        headerContainer.value.offsetWidth * columnPercentage.value - 20
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
      handleMouseOut,
      handleMouseOver,
      addColumn,
      createLayers,
      filterCurrentNode,
      hasNode
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