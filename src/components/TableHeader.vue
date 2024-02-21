<template>
  <div class="w-full h-full">
    <div class="w-full h-full rounded-md flex flex-col" id="headerContainer">
      <div class="flex flex-row h-1/8 w-full justify-center">
        <div
          v-for="(level_name, index) in level_name_list"
          :key="level_name"
          class="flex flex-row h-full "
          :style="{ width: headerContainer?.offsetWidth * columnPercentage + 'px' }"
        >
          <div
            class="h-full flex flex-row items-center justify-center"
            :style="{
              width: headerContainer?.offsetWidth * columnPercentage - 20 + 'px',
              backgroundColor: colorBar[index],
            }"
          >
            <div class="text-md font-serif text-center text-white title">{{ level_name }}</div>
          </div>
          <div class="h-full px-0.5px bg-stone-100" :style="{ width: 20 + 'px' }">
            <div class="h-full w-full"></div>
          </div>
        </div> 
      </div>
      <div class="w-full h-7/8 py-1">
        <div class="w-full h-full flex flex-row justify-center" id="plotContainer">
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
                  v-for="circle in circlesData[level_id_list[index]]??[]"
                  class="node"
                  :key="circle.key"
                  :cx="circle.cx"
                  :cy="circle.cy"
                  :r="circle.r"
                  :fill = colorBar[index]
                  opacity="50%"
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

export default {

  name: "TableHeader",
  setup() {
    const headerContainer = ref(null)
    const plotContainer = ref(null)
    const store = useStore()
    const columnPercentage = computed(() => store.getters['size/columnPercentage'])

    
   
    const colorBar = computed(()=>store.getters["tree/colorBar"])

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
    const circlesData = computed(() => {
      const initialCirclesData = level_id_list.value.reduce((acc, level_id) => {
        acc[level_id] = [];
        return acc;
      }, {});

      // 填充数据
      Object.entries(coordinateCollection.value).forEach(
        ([level_id, coordinates]) => {
          const xScaleObj = plot_X_Scale.value.find(
            (scale) => scale.level_id === level_id
          );
          const yScaleObj = plot_Y_Scale.value.find(
            (scale) => scale.level_id === level_id
          );
          if (!xScaleObj && !yScaleObj) return; // 确保找到了比例尺

          const circles = coordinates.map((coordinate) => ({
            cx: xScaleObj.xScale(coordinate.x),
            cy: yScaleObj.yScale(coordinate.y),
            r: 6,
            key: coordinate.id,
          }));

          initialCirclesData[level_id] = circles;
        }
      );

      return initialCirclesData;
    });
    const selectionTree = computed(() => store.getters["tree/selectionTree"]);
    const levels = computed(() => store.getters["tree/levels"]);
    const level_id_list = computed(() => [
      ...new Set(selectionTree.value.map((node) => node.level)),
    ]);
    const level_name_list = computed(() =>
      level_id_list.value.map((id) => levels.value[id - 1])
    );

    const dynamicWidth = computed(() => {
      if (headerContainer.value && level_name_list.value) {
        return headerContainer.value.offsetWidth * columnPercentage.value * level_name_list.value.length;
      }
      return 0; 
    });

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
      columnPercentage
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