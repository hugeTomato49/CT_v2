<template>
  <div
    class="w-full h-full rounded-md flex flex-row tableContainer"
    id="tableContainer"
  >
    <div
      v-for="(level_id, index) in level_id_list"
      :key="level_id"
      class="flex flex-row h-full"
    >
      <div
        class="h-full flex flex-col border-1 rounded-md overflow overflow-scroll"
        :style="{
          width: tableContainer?.offsetWidth * columnPercentage - 30 + 'px',
        }"
      >
        <TSCard
          v-for="(id, index) in selectionTree
            .filter((node) => node.level == level_id)
            .map((node) => node.id)"
          :key="id"
          :seriesData="findSeriesData(id)"
          :level="level_id"
          :node_id="id"
          :node_name="findNodeName(id)"
          :groupedNode="groupedNodeFlag(id)"
        />
      </div>
      <div class="w-30px h-full">
        <LinkColumn v-if="level_id != level_id_list.length" :level="level_id" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watchEffect, onMounted, watch } from "vue";
import { useStore } from "vuex";
import TSCard from "./TSCard.vue";
import LinkColumn from "./LinkColumn.vue";

export default {
  name: "Table",
  components: {
    TSCard,
    LinkColumn,
  },
  setup() {
    const tableContainer = ref(null);

    const store = useStore();
    const selectionTree = computed(() => store.getters["tree/selectionTree"]);
    const seriesCollection = computed(
      () => store.getters["tree/seriesCollection"]
    );
    const columnPercentage = computed(
      () => store.getters["size/columnPercentage"]
    );
    const rowNum = computed(() => store.getters["size/rowNum"]);

    const level_id_list = computed(() => store.getters["tree/level_id_list"]);

    // above are form vuex, which we further moderate inside the component to achieve:
    //(1) not interfere with the state of vuex
    //(2) further change the data to suit various interactions

    const groupedIdCollection = (level_id, tree) => {
      // console.log("Check groupedID")
      // console.log(selectionTree.value.filter(node => node.level == level_id).map(node => node.id))
      return tree
        .filter((node) => node.level == level_id)
        .map((node) => node.id);
    };

    const findSeriesData = (id) => {
      return (
        seriesCollection.value.find((node) => node.id == id)?.seriesData ?? []
      );
    };

    const findNodeName = (id) => {
      return (
        seriesCollection.value.find((node) => node.id == id)?.node_name ?? ""
      );
    };

    const groupedNodeFlag = (id) => {
      const attribute =
        selectionTree.value.find((node) => node.id == id)?.attribute ?? "";
      if (attribute.includes("group")) {
        return true;
      } else {
        return false;
      }
    };

    onMounted(() => {
      tableContainer.value = document.querySelector("#tableContainer");
      store.dispatch(
        "size/updateRowHeight",
        tableContainer.value?.offsetHeight / rowNum.value
      );
    });

    return {
      selectionTree,
      findSeriesData,
      findNodeName,
      level_id_list,
      columnPercentage,
      tableContainer,
      groupedIdCollection,
      groupedNodeFlag,
    };
  },
};
</script>

<style>
</style>