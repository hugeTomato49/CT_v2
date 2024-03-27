<template>
  <div
    class="w-1/3 h-full flex justify-center"
  >
    <div class="w-1/2 h-full name flex mt-1">
      <div class="text-[#4B99D0] ml-6">{{ entityName }}</div>
    </div>
    <div class="w-1/2 h-full mt-1 flex flex-row">
      <svg class="w-1/4 h-full" viewBox="0 0 16 16" >
        <circle cx="8" cy="2" r="7" fill="#D2E6F8" />
        <text
          x="8"
          y="2"
          :fill="themeColor"
          class="circleNumber"
          text-anchor="middle"
          alignment-baseline="central"
          font-size="10"
        >
          {{ number }}
        </text>
      </svg>
      <div class="w-1/2 h-full ml-2">
        <div @click="toggleVisibility" class="cursor-pointer">
          <font-awesome-icon
            :icon="entityVisiable == 1 ? ['fas', 'eye'] : ['fas', 'eye-slash']"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { computed, ref, onMounted, watch, watchEffect } from "vue";

export default {
  name: "EntityHeader",
  props: ["entityName", "number", 'entityVisiable'],
  setup(props) {
    const store = useStore();
    const themeColor = computed(() => store.getters["tree/themeColor"]);
    const toggleVisibility = () => {
      const currentValue = props.entityVisiable; // 假设所有初始值相同
      const newValue = !currentValue; // 切换值
      // 更新 Vuex 状态
      switch (props.entityName) {
        case "Node":
          store.dispatch("selection/updateNodeVisiable", newValue);
          break;
        case "Path":
          store.dispatch("selection/updatePathVisiable", newValue);
          break;
        case "Tree":
          store.dispatch("selection/updateTreeVisiable", newValue);
          break;
        default:
          // 可以处理无效的 entityName 或不做任何事
          console.warn("Unknown entityName:", props.entityName);
      }
    };
    return { themeColor, toggleVisibility,};
  },
};
</script>

<style scoped>
.circleNumber {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: "semibold";
  font-variation-settings: "slnt" 0;
}
.name {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: "semibold";
  font-variation-settings: "slnt" 0;
}
</style>