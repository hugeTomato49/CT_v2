<!-- 由于循环的原因，这个card的width设置暂时有些问题，但不影响界面，后续有时间需要完善 -->

<template>
  <div class="w-full round-md py-[0.5em]">
    <div class="w-full py-[0.1em] px-[1.5em] entityCard" :style="{
      'background-color': related ? themeColor : 'rgba(245, 245, 245, 0.6)',
    }">
      <div class="w-full flex flex-col">
        <div class="w-full h-[1.8em] flex flex-row items-center" :style="{ 'border-bottom': '1px solid' + '#ABABAB' }"
          id="pathTitleContainer">
          <div class="text-sm cardTitle" :style="{ color: themeColor }">
            Path
          </div>
          <div class="flex-1"></div>
          <div class="flex flex-row">
            <font-awesome-icon :icon="['fas', 'eye']" size="xs" class="icon mr-2 cursor-pointer" />
            <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="icon mr-2 cursor-pointer" size="xs" />
            <font-awesome-icon :icon="['fas', 'gear']" class="icon mr-2 cursor-pointer" size="xs" />
            <font-awesome-icon :icon="['fas', 'circle-xmark']" class="delete-icon cursor-pointer" size="xs"
              @click="deletePathEntity" />
          </div>
        </div>
        <div class="w-full max-h-[10em] overflow overflow-scroll">
          <div 
          v-for="(id, index) in seriesData_list.map((series) => series.id)" 
          :key="id"
          class="w-full h-[4.4em] flex flex-row" :style="{ 'border-bottom': index !== seriesData_list.length - 1 ? '1px solid #ABABAB' : 'none' }">
            <div class="w-full h-[4em] flex flex-col mt-[0.6em]">
              <div class="w-1/7 h-[0.4em] flex flex-row items-center meta "
                :style="{ color: themeColor }">
                <div>{{ getCategoryBySeriesId(id) }}</div>
              </div>
              <div class="w-full h-[3.6em] flex flex-row justify-center mt-[0.2em] ">
                <div class="w-full h-full " id="seriesContainer">
                  <svg class="w-full h-full" :ref="el => setSvgRef(el, index)">
                    <g v-if="chartType === 'line chart'">
                      <path :stroke="themeColor" fill="none" stroke-width="2.5" :d="generateSelectedPath(
                        JSON.parse(
                          JSON.stringify(
                            seriesData_list.find((series) => series.id == id)
                              .data
                          )
                        ),
                        xScale,
                        yScale_list[index]
                      )
                        "></path>
                    </g>

                  </svg>
                  <HorizonChart :data="
                      seriesData_list.find((series) => series.id == id)
                        .data
                  " :bands="4" height=50 width=500 :svgContainer="svgRefs[index]"
                    :chartType="chartType" />
                </div>
              </div>
            </div>
            <div class="w-1/10 pl-[1em] h-[4em] pt-[0.5em] justify-center flex  items-center ">
              <font-awesome-icon :icon="['fas', 'trash-can']" @click="deletePath(id)" class="delete-icon cursor-pointer"
                size="lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, onMounted, watch, watchEffect } from "vue";
import HorizonChart from "../table/HorizonChart.vue";
import { cloneDeep } from "lodash";
import { generateSelectedPath } from "../../generator/generator";
import { calculatePearsonCorrelation } from "../../select/entitySelection";
import * as d3 from "d3";
import { size } from "lodash";
export default {
  name: "PathCard",
  props: ["id_list", "level_list", "related", "entityID"],
  components: {
    HorizonChart
  },
  setup(props) {
    const titleContainer = ref(null);
    const seriesContainer = ref(null)
    const width = ref(0);
    const height = ref(56);
    const horizonHeight = ref(50);

    const xScale = ref(null);
    const yScale_list = ref([]);
    const seriesData_list = ref([]);
    const dataset = computed(() => store.getters["tree/dataset"])

    const chartType = computed(() => store.getters['card/chartType'])
    const svgContainer = ref(null);
    const svgRefs = ref([]);

    const store = useStore();
    const themeColor = computed(() => props.related ? "#FFFFFF" : store.getters["color/themeColor"]);
    const selectionTree = computed(() => store.getters["tree/selectionTree"]);
    const originalTree = computed(() => store.getters["tree/originalTree"]);
    const timeRange = computed(() => store.getters["tree/timeRange"]);

    const setSvgRef = (el, index) => {
      svgRefs.value[index] = el;
    }
    const deletePathEntity = () => {
      store.dispatch("selection/deleteEntity", props.entityID);
    };

    const deletePath = (id) => {
      const deleteItem = { entityID: props.entityID, id: id };
      console.log("delete id is", deleteItem)
      store.dispatch("selection/deleteIdFromEntity", deleteItem);
    };
    const extractLastNumber = (str) => {
      const regex = /(?:-|^)([^-]+)$/;
      const match = str.match(regex);
      const result = match ? match[1] : "";
      return result;
    };
    const getCategoryBySeriesId = (id) => {
      const node = originalTree.value.find((node) => node.id === id);
      const nodeName = node ? node.node_name : "";
      const number = extractLastNumber(nodeName); // 提取编号
      return `${number}`;
    };
    const calculateCorrelation = (series1, series2) => {
      return calculatePearsonCorrelation(series1, series2);
    };
    const updateYScales = () => {
      if (dataset.value !== "PV") {
        seriesData_list.value.forEach((seriesData, index) => {
          const max = Math.max(...seriesData.data.map(item => item.value));
          const min = Math.min(...seriesData.data.map(item => item.value));

          yScale_list.value[index] = d3.scaleLinear().domain([min, max]).range([height.value - 10, 7]);
        });
      }
      else {
        if (store.getters["size/yScale"].length > 0) {
          yScale_list.value = props.level_list.map((level) =>
            d3.scaleLinear().domain(store.getters["size/yScale"][level - 1].domain()).range([height.value - 10, 7])
          );
        }
      }

    };
    watch([xScale, () => props.id_list], ([newXScale, newIdList]) => {
      let seriesId = 0;
      if (newXScale !== null) {
        const list = [];
        newIdList.forEach((id) => {
          // 使用新的id列表
          let obj = {};
          obj["seriesId"] = seriesId;
          obj["id"] = id;
          obj["data"] = cloneDeep(
            store.getters["tree/seriesCollection"].find((node) => node.id == id)
              ?.seriesData
          );
          list.push(obj);
          seriesId++;
        });
        seriesData_list.value = list;
        seriesData_list.value.forEach((_, index) => {
          svgRefs.value[index] = document.querySelector(`#svgContainer_${index}`);
        });
        updateYScales();
      }
    });

    onMounted(() => {
      titleContainer.value = document.querySelector("#pathTitleContainer");
      width.value = (titleContainer.value.offsetWidth ) ;

      if (store.getters["size/xScale"].length > 0) {
        xScale.value = d3
          .scaleTime()
          .domain(store.getters["size/xScale"].domain())
          .range([0, width.value /10 *9]);
        const timeRange = store.getters["tree/timeRange"];
      }
      if (store.getters["size/yScale"].length > 0) {
        yScale_list.value = props.level_list.map((level) =>
          d3
            .scaleLinear()
            .domain(store.getters["size/yScale"][level - 1].domain())
            .range([height.value - 5, 0])
        );
      }
    });
    return {
      themeColor,
      xScale,
      yScale_list,
      seriesData_list,
      generateSelectedPath,
      timeRange,
      deletePathEntity,
      deletePath,
      getCategoryBySeriesId,
      calculateCorrelation,
      seriesContainer,
      width,
      height,
      chartType,
      svgContainer,
      svgRefs,
      setSvgRef,
      horizonHeight
    };
  },
};
</script>

<style>
.cardTitle {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: "regular";
  font-variation-settings: "slnt" 0;
}

.meta {
  font-size: 0.6rem;
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: "regular";
  font-variation-settings: "slnt" 0;
}

.entityCard {
  box-shadow: 0 3px 4px -3px rgba(138, 139, 139, 0.6);
}

.icon {
  color: #ABABAB;
  transition: color 0.3s;
}

.icon:hover {
  color: #3182BD;
}

.delete-icon {
  color: #ABABAB;
  transition: color 0.3s;
}

.delete-icon:hover {
  color: #CC1515;
}
</style>