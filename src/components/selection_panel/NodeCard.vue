<template>
  <div class="w-full round-md py-[0.5em]">
    <div class="w-full py-[0.1em] px-[1.5em] entityCard" style="background-color: rgba(245, 245, 245, 0.6)">
      <div class="w-full flex flex-col">
        <div class="w-full h-[1.8em] flex flex-row items-center " :style="{ 'border-bottom': '1px solid' + '#ABABAB' }">
          <div class="text-sm cardTitle" :style="{ color: themeColor }">
            Node
          </div>
          <div class="flex-1"></div>
          <div class="flex flex-row ">
            <font-awesome-icon :icon="['fas', 'eye']" size="xs" class="icon mr-2 cursor-pointer" />
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="icon mr-2 cursor-pointer" size="xs" />
            <font-awesome-icon :icon="['fas', 'gear']" class="icon mr-2 cursor-pointer" size="xs" />
            <font-awesome-icon :icon="['fas', 'circle-xmark']" class="delete-icon cursor-pointer" size="xs"
              @click="deleteNodeEntity" />
          </div>
        </div>
        <div class="w-full h-full flex flex-row " :style="{ 'border-bottom': '0.01em solid' + themeColor }">
          <div class="w-full h-[3.8em] flex flex-col mt-[0.6em]">
            <div class="w-1/7 h-[0.4em] flex flex-row items-center meta " :style="{ color: themeColor }">
              {{ getCategoryBySeriesId(id) }}
            </div>
            <div class="w-full h-[3.6em] flex flex-row  mt-[0.2em] ">
              <div class="w-full h-full " id="seriesContainer">
                <svg class="w-full h-full" ref="svgContainer">
                  <g v-if="chartType === 'line chart'">
                    <path :stroke="themeColor" fill="none" stroke-width="2.5"
                      :d="generatePath(seriesData, xScale, yScale)">
                    </path>
                  </g>

                </svg>
                <HorizonChart :data="seriesData" :bands="4" height=50 width=480 :svgContainer="svgContainer"
                  :chartType="chartType" />
              </div>
            </div>
          </div>
          <div class="w-1/7 pl-[1em]  h-[4em] pt-[0.5em] justify-center flex  items-center">
            <font-awesome-icon :icon="['fas', 'trash-can']" class="delete-icon cursor-pointer"
              @click="deleteNodeEntity" size="lg"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { useStore } from "vuex";
import { computed, onMounted, ref, watchEffect, watch } from "vue";
import { cloneDeep } from "lodash";
import { generatePath } from "../../generator/generator";
import HorizonChart from "../table/HorizonChart.vue";
import * as d3 from "d3";
export default {
  name: "NodeCard",
  props: ["id", "level", "entityID"],
  components: {
    HorizonChart
  },
  setup(props) {
    //define static value using ref
    const seriesContainer = ref(null)
    const width = ref(0)
    const height = ref(0)
    const xScale = ref(null)
    const yScale = ref(null)
    const seriesData = ref([])
    const selectionTree = computed(() => store.getters["tree/selectionTree"])
    const originalTree = computed(() => store.getters["tree/originalTree"])
    const nodeVisiable = computed(() => store.getters["selection/nodeVisiable"])

    //store
    const store = useStore()
    const themeColor = computed(() => store.getters["color/themeColor"])
    const levels = computed(() => store.getters["tree/levels"])
    const dataset = computed(() => store.getters["tree/dataset"])
    const description = computed(() => store.getters["tree/description"])
    const chartType = computed(() => store.getters['card/chartType'])
    const svgContainer = ref(null);

    const deleteNodeEntity = () => {
      store.dispatch("selection/deleteEntity", props.entityID);
    };
    const extractLastNumber = (str) => {
      const regex = /(?:-|^)([^-]+)$/;
      const match = str.match(regex);
      const result = match ? match[1] : ""; // 如果有匹配的话，结果在match的第二个元素中
      return result;
    };
    const getCategoryBySeriesId = (id) => {
      const categoryName = levels.value[dataset.value][props.level - 1]
      const firstChar = categoryName[0];
      // 在 selectionTree 中查找对应的节点
      const node = originalTree.value.find((node) => node.id === id);
      const nodeName = node ? node.node_name : "";
      const number = extractLastNumber(nodeName); // 提取编号

      // 组合类别名称和编号
      return `${number}`;
    };

    onMounted(() => {
      seriesContainer.value = document.querySelector("#seriesContainer");
      width.value = seriesContainer.value.offsetWidth;
      height.value = seriesContainer.value.offsetHeight;

      if (store.getters["tree/seriesCollection"].length > 0) {
        seriesData.value = cloneDeep(
          store.getters["tree/seriesCollection"].find(
            (node) => node.id == props.id
          ).seriesData
        );
      }
      if (store.getters["size/xScale"].length > 0) {
        xScale.value = d3
          .scaleTime()
          .domain(store.getters["size/xScale"].domain())
          .range([0, width.value - 5]);
      }
      if (store.getters["size/yScale"].length > 0) {
        if (dataset.value === "PV") {
          yScale.value = d3
            .scaleLinear()
            .domain(store.getters["size/yScale"][props.level - 1].domain())
            .range([height.value, 0]);
          console.log("check scale");
          console.log(yScale.value(0));
        }
        else {
          const max = Math.max(...seriesData.value.map(item => item.value))
          const min = Math.min(...seriesData.value.map(item => item.value))
          yScale.value = d3.scaleLinear().domain([min, max]).range([height.value - 10, 7])
        }



      }
    });

    return {
      themeColor,
      levels,
      description,
      xScale,
      yScale,
      seriesData,
      generatePath,
      deleteNodeEntity,
      getCategoryBySeriesId,
      nodeVisiable,
      chartType,
      height,
      width,
      svgContainer
    };
  },
};
</script>

<style>
.icon {
  color: #ABABAB;
  transition: color 0.3s;
  /* 添加过渡效果 */
}

.icon:hover {
  color: #3182BD;
  /* 悬停时变为红色 */
}

.delete-icon {
  color: #ABABAB;
  transition: color 0.3s;
  /* 添加过渡效果 */
}

.delete-icon:hover {
  color: #CC1515;
  /* 悬停时变为红色 */
}

.cardTitle {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 800;
  font-style: "regular";
  font-variation-settings: "slnt" 0;
}

.entityCard {
  box-shadow: 0 3px 4px -3px rgba(138, 139, 139, 0.6);
}

.meta {
  font-size: 0.6rem;
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: "regular";
  font-variation-settings: "slnt" 0;
}

.description {
  font-size: 0.55rem;
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: "regular";
  font-variation-settings: "slnt" 0;
}
</style>