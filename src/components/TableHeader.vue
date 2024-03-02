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
            class="h-full flex flex-row items-center justify-center"
            :style="{
              width:
                headerContainer?.offsetWidth * columnPercentage - 20 + 'px',
              backgroundColor: colorBar[index],
            }"
          >
            <div class="ml-2 text-md font-serif text-center text-white title">
              {{ level_name }}
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
                <!-- Group for positioning the icon at the top-right corner of the rectangle -->
                <g
                  viewBox="0 0 320 512"
                  :transform="`translate(${
                    headerContainer?.offsetWidth * columnPercentage - 50
                  }, 5) scale(0.04)`"
                  class="cursor-pointer"
                  @click="createLayers(level_id_list[index])"
                >
                  <path
                    fill="#F5F5F5"
                    d="M32 119.4C12.9 108.4 0 87.7 0 64C0 28.7 28.7 0 64 0c23.7 0 44.4 12.9 55.4 32H328.6C339.6 12.9 360.3 0 384 0c35.3 0 64 28.7 64 64c0 23.7-12.9 44.4-32 55.4V232.6c19.1 11.1 32 31.7 32 55.4c0 35.3-28.7 64-64 64c-23.7 0-44.4-12.9-55.4-32H119.4c-11.1 19.1-31.7 32-55.4 32c-35.3 0-64-28.7-64-64c0-23.7 12.9-44.4 32-55.4V119.4zM119.4 96c-5.6 9.7-13.7 17.8-23.4 23.4V232.6c9.7 5.6 17.8 13.7 23.4 23.4H328.6c5.6-9.7 13.7-17.8 23.4-23.4V119.4c-9.7-5.6-17.8-13.7-23.4-23.4H119.4zm192 384c-11.1 19.1-31.7 32-55.4 32c-35.3 0-64-28.7-64-64c0-23.7 12.9-44.4 32-55.4V352h64v40.6c9.7 5.6 17.8 13.7 23.4 23.4H520.6c5.6-9.7 13.7-17.8 23.4-23.4V279.4c-9.7-5.6-17.8-13.7-23.4-23.4h-46c-5.4-15.4-14.6-28.9-26.5-39.6V192h72.6c11.1-19.1 31.7-32 55.4-32c35.3 0 64 28.7 64 64c0 23.7-12.9 44.4-32 55.4V392.6c19.1 11.1 32 31.7 32 55.4c0 35.3-28.7 64-64 64c-23.7 0-44.4-12.9-55.4-32H311.4z"
                  />
                </g>
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
                  @mouseover="() => handleMouseOver(circle.key)"
                  @mouseout="handleMouseOut"
                  @click="handleNodeClick(circle.key)"
                ></circle>
              </g>
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
  hasNode,
} from "../computation/treeComputation";
import scatterPlotModule from "../store/scatterPlotModule";

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
    const plotLinks = computed(() => store.getters["scatterPlot/plotLinks"]);
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
      let allPaths = [];
      selectionTree.value.forEach((node) => {
        if (hasChildren(selectionTree.value, node.id)) {
          const pathsForNode = calculatePlotLinks(
            node.id,
            originalTree.value,
            coordinateCollection.value,
            plot_X_Scale.value,
            plot_Y_Scale.value,
            headerContainer.value.offsetWidth * columnPercentage.value
          ); // 根据节点ID计算路径
          allPaths = allPaths.concat(pathsForNode); // 将结果合并到总数组中
        }
      });
      return allPaths;
    });
    const circlesData = computed(() => {
      // const initialCirclesData = level_id_list.value.reduce((acc, level_id) => {
      //   acc[level_id] = [];
      //   return acc;
      // }, {});
      // // 填充数据
      // Object.entries(coordinateCollection.value).forEach(
      //   ([level_id, coordinates]) => {
      //     const xScaleObj = plot_X_Scale.value.find(
      //       (scale) => scale.level_id == level_id
      //     );
      //     const yScaleObj = plot_Y_Scale.value.find(
      //       (scale) => scale.level_id == level_id
      //     );
      //     if (!xScaleObj && !yScaleObj) return; // 确保找到了比例尺
      //     const circles = coordinates.map((coordinate) => ({
      //       cx: xScaleObj.xScale(coordinate.x),
      //       cy: yScaleObj.yScale(coordinate.y),
      //       r: hasNode(selectionTree.value, coordinate.id) ? 12 : 8,
      //       key: coordinate.id,
      //       fillOpacity: hasNode(selectionTree.value, coordinate.id)
      //         ? 0.9
      //         : 0.5,
      //     }));
      //     initialCirclesData[level_id] = circles;
      //   }
      // );
      // return initialCirclesData;
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
        originalTree.value,
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
      // console.log("check dataset")
      // console.log(dataset.value)
      store.dispatch("tree/addLayer", obj);
    };

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
    };
  },
};
</script>

<style>
.title {
  font-family: "Roboto Mono", monospace;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
}
</style>