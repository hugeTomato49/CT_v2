<template>
  <div class="container w-full h-full ">
    <div class="data-set w-full h-1/2">
      <div class="title text-lg  text-[#4B99D0] text-center">
        <text>DataSet</text>
        <div class="border-solid border-1 border-light-800 mt-2"></div>
      </div>
      <div class="flex flex-row w-full h-1/2 justify-around mt-5">
        <div class="w-5/12 h-1/2 border-solid border-light-700 border-2"></div>
        <div class="w-5/12 h-1/2 border-solid border-light-700 border-2"></div>
      </div>
      <!-- dataSet 内容 -->
    </div>
    <div class="title configuration w-full h-1/2 flex-column">
      <div class="w-full text-lg text-[#4B99D0] text-center" >
        <text>Configuration</text>
        <div class="border-solid border-1 border-light-800 mt-2"></div>
      </div>
      <div class="flex flex-row w-full mt-6 ml-3">
        <div class="w-1/10 text-[#4B99D0] text-2xl">K</div>
        <div class="w-4/5 ml-2">
          <a-row>
            <a-col :span="12">
              <a-slider v-model:value="inputValue" :min="1" :max="50" />
            </a-col>
            <a-col :span="4">
              <a-input-number
                v-model:value="inputValue"
                :min="1"
                :max="20"
                style="margin-left: 16px"
                class="text-base"
                onChangeComplete="onChange"
              />
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { Slider, InputNumber } from "ant-design-vue";
export default {
  name: "Configuration",
  components: {
    "a-slider": Slider,
    "a-input-numer": InputNumber,
    // 'a-row':Slider,
    // 'a-col':Slider
  },
  setup() {
    const store = useStore();
    const inputValue = ref(0);
    const onChange = () => {
        console.log("input value is", inputValue.value)
    }

    return {
      inputValue,
      onChange
    };
  },
};
</script>


<style>
.title {
    font-family: "Inter", sans-serif;
    font-optical-sizing: auto;
    font-weight: 500;
    font-style: "regular";
    font-variation-settings:
        "slnt" 0;
}
</style>