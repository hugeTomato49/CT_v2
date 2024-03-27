<template>
  <div
    class="w-full h-full flex justify-center items-center pl-1"
    id="Donut"
  >
    <svg class="w-full h-full mt-2">
      <!-- 绘制甜甜圈背景 -->
      <circle
        :cx="width  * 0.4"
        :cy="height * 0.4"
        :r="12"
        fill="transparent"
        stroke="#eee"
        stroke-width="6"
      />
      <!-- 绘制表示相关性的甜甜圈部分 -->
      <path
        :d="correlationPath"
        :stroke="correlationColor"
        fill="transparent"
        stroke-width="6"
        stroke-linecap="round"
      />
      <!-- 添加一个圆心以形成甜甜圈形状 -->
      <circle :cx="width * 0.4" :cy="height * 0.4" :r="6" fill="white" />
    </svg>
  </div>
</template>
  
<script>
import { useStore } from "vuex";
import { computed, ref, onMounted, watch, watchEffect } from "vue";

export default {
  name: "Donutchart",
  props: ["correlation"],
  setup(props) {
    const width = ref(0);
    const height = ref(0);
    const Donut = ref(null);
    const radius = computed(() => Math.min(width.value, height.value) / 2 - 5); // 假设边距为5
    const correlationPath = computed(() => {
      const percentage = Math.abs(props.correlation); // 使用相关性的绝对值
      const endAngle = percentage * 360; // 相关性从0到1映射到0到360度
      const endRadians = (endAngle - 90) * (Math.PI / 180); // 将角度转换为弧度
      const radius = 12;
      const centerX = width.value * 0.4;
      const centerY = height.value * 0.4;//这里用0.4更加符合div的中心，可能会有适应性方面的不同

      // 大弧标志和终点计算，同样基于新的半径和圆心
      const largeArcFlag = percentage > 0.5 ? 1 : 0;
      const endX = Math.cos(endRadians) * radius + centerX;
      const endY = Math.sin(endRadians) * radius + centerY;

      // 构造SVG路径
      return `M ${centerX},${
        centerY - radius
      } A ${radius},${radius} 0 ${largeArcFlag} 1 ${endX},${endY}`;
    });

    const correlationColor = computed(() => {
      return props.correlation >= 0 ? "#2EB976" : "#DF1C33";
    });
    onMounted(() => {
      Donut.value = document.querySelector("#Donut");
      width.value = Donut.value.offsetWidth;
      height.value = Donut.value.offsetHeight;
      // height.value = 700;
    });

    return { correlationPath, correlationColor, width, height, radius };
  },
};
</script>
  
  <style scoped>
</style>