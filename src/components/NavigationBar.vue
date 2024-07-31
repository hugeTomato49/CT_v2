<template>
    <div
      class="w-full h-1/25 flex flex-row items-center"
      id="navigationBar"
      :style="{ backgroundColor: themeColor }"
    >
      <div class="ml-4 text-[1.4em] text-center text-white pacifico-regular">
        ChronoDeck
      </div>
      <!-- global tips -->
      <div class="h-full flex flex-row justify-end flex-grow items-center">
        <!-- Cluster_Num -->
        <!-- <div class="name text-sm text-[#FFFFFF] cursor-pointer">Cluster_Num</div>
        <div class="w-5 h-4/5 ml-4 mt-2 text-lg text-center">
          <var-input
            placeholder=""
            type="number"
            v-model="cluster_value"
            text-color="#FFFFFF"
            style="
              --input-input-font-size: 0.6em;
              --input-input-color:#ffffff;
              --field-decorator-blur-color: white;
              --field-decorator-standard-normal-margin-bottom: -0.1em;
              --field-decorator-standard-normal-margin-top: 0px;
            "
          />
        </div> -->
        <!-- chart -->
        <div class="ml-10 name text-[0.9em] text-[#FFFFFF] cursor-pointer">Chart</div>
        <div class="w-[7em] h-4/5 ml-4  mb-[0.5em]  flex items-center">
          <var-select
            :hint="false"
            v-model="chart"
            text-color="#FFFFFF"
            style="
              --select-label-font-size: 0.8em;
              --field-decorator-blur-color: #ffffff;
              --field-decorator-focus-color: #ffffff;
              --field-decorator-standard-normal-margin-bottom: -0.em;
            "
            class="w-full "
            @change="toggleChartType"
          >
            <var-option
              v-for="(item, index) in chartOptions"
              :key="index"
              :label="item"
              style="---option-font-size: 0.6em"
            />
          </var-select>
        </div>
        <!-- Scale -->
        <div class="ml-10 name text-[0.9em] text-[#FFFFFF] cursor-pointer">Scale</div>
        <div class="w-[7em] h-4/5 ml-4  mb-[0.5em]  flex items-center">
          <var-select
            :hint="false"
            v-model="placement"
            text-color="#FFFFFF"
            style="
              --select-label-font-size: 0.8em;
              --field-decorator-blur-color: #ffffff;
              --field-decorator-focus-color: #ffffff;
              --field-decorator-standard-normal-margin-bottom: -0.em;
            "
            class="w-full "
          >
            <var-option
              v-for="(item, index) in placementOptions"
              :key="index"
              :label="item"
              style="---option-font-size: 0.6em"
            />
          </var-select>
        </div>
        <!-- Link -->
        <div class="flex flex-row ml-5 items-center">
          <div class="mr-4 name text-[0.9em] text-[#FFFFFF] cursor-pointer">Link</div>
          <var-switch
            variant
            v-model="link_switch"
            @click="toggleLinkVisible"
            style="
              --switch-track-active-background: #ffffff;
              --switch-variant-handle-background: #3182bd;
              --switch-variant-handle-active-background: #3182bd;
              --switch-variant-width: 2.9em;
              --switch-variant-height: 1.5em;
              --switch-variant-handle-width: 1.1em;
              --switch-variant-handle-height: 1.1em;
            "
          />
        </div>
        <!-- 这里的color属性不是很好用变量，暂时直接赋值-->
        <!-- HL -->
        <div class="flex flex-row ml-5 items-center">
          <div class="mr-4 name text-[0.9em] text-[#FFFFFF] cursor-pointer">HL</div>
          <var-switch
            variant
            v-model="HL_switch"
            @click="toggleHighlightVisible"
            style="
              --switch-track-active-background: #ffffff;
              --switch-variant-handle-background: #3182bd;
              --switch-variant-handle-active-background: #3182bd;
              --switch-variant-width: 2.9em;
              --switch-variant-height: 1.5em;
              --switch-variant-handle-width: 1.1em;
              --switch-variant-handle-height: 1.1em;
            "
          />
        </div>
        
        <!-- palette  size?-->
        <div class="ml-8">
          <font-awesome-icon
            :icon="['fas', 'palette']"
            size="lg"
            style="color: #ffffff"
          />
        </div>
        <!-- question -->
        <div class="ml-5 mr-5">
          <font-awesome-icon
            size="lg"
            :icon="['fas', 'question-circle']"
            style="color: #ffffff"
          />
        </div>
      </div>
    </div>
  </template>
  
  
  
  <script>
  import { useStore } from "vuex";
  import { computed, ref, onMounted } from "vue";
import { faL } from "@fortawesome/free-solid-svg-icons";
  
  export default {
    name: "NavigationBar",
    setup() {
      const store = useStore();
      const themeColor = computed(() => store.getters["color/themeColor"]);
      const navigationBar = ref(null);
      const headerHeight = ref(0)
      const linkVisible = computed(
        () => store.getters["scatterPlot/linkVisible"]
      );
      const highlightVisible = computed(
        () => store.getters["scatterPlot/highlightVisible"]
      );
      const cluster_value = ref("5");
      const placement = ref("by level");
      const placementOptions = ["by level", "by card"];
      const chart = ref("line chart");
      const chartOptions = ["line chart", "horizon chart"];
      const link_switch = ref(false);
      const HL_switch = ref(false);

      const toggleChartType = () => {
        store.dispatch("card/updateChartType",chart.value)
        console.log("chart is ",chart.value)
      }

      const toggleLinkVisible = () => {
        store.dispatch("scatterPlot/toggleLinkVisible");
      };
  
      const toggleHighlightVisible = () => {
        store.dispatch("scatterPlot/toggleHighlightVisible");
      };

      onMounted (()=>{
        navigationBar.value = document.querySelector('#navigationBar');
        headerHeight.value = navigationBar.value.offsetHeight;
        navigationBar.value.style.fontSize = `${headerHeight / 300}px`;
        // console.log("font size is", headerHeight.value)
      })
      
      return {
        themeColor,
        cluster_value,
        placement,
        placementOptions,
        link_switch,
        HL_switch,
        linkVisible,
        highlightVisible,
        toggleHighlightVisible,
        toggleLinkVisible,
        toggleChartType,
        chart,
        chartOptions
      };
    },
  };
  </script>
  
  <style>
  .pacifico-regular {
    font-family: "Inter", sans-serif;
    font-weight: 800;
    font-style: normal;
  }
  </style>