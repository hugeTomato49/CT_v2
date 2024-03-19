<template>
  <div class="container w-full h-full ">
    <div class="data-set w-full h-1/2">
      <div class="content-center align-middle text-[30px] text-[#4B99D0] text-center">
        <text>DataSet</text>
        <div class="border-solid border-1 border-light-800 mt-2"></div>
      </div>
      <div class="flex-row">
        <div></div>
        <div></div>
      </div>
      <!-- dataSet 内容 -->
    </div>
    <div class="configuration w-full h-1/2 flex-column">
      <div class="w-full text-[30px] text-[#4B99D0] text-center" >
        <text>Configuration</text>
        <div class="border-solid border-1 border-light-800 mt-2"></div>
      </div>
      <div class="flex flex-row w-full">
        <div class="w-1/10 text-[#4B99D0] text-2xl">K</div>
        <div class="w-4/5">
          <a-row>
            <a-col :span="12">
              <a-slider v-model:value="inputValue" :min="1" :max="20" />
            </a-col>
            <a-col :span="4">
              <a-input-number
                v-model:value="inputValue"
                :min="1"
                :max="20"
                style="margin-left: 16px"
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
</style>