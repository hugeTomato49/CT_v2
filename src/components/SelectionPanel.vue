<template>
  <div class="w-full h-full">
    <NodeCard
      v-for="entity in nodeEntities"
      :key="entity.id"
      :id="entity.id"
      :entityID="entity.entityID"
      :level="entity.level"
    />
    <PathCard
      v-for="(entity) in pathEntities"
      :key="entity.entityID"
      :id_list="entity.path"
      :level_list="entity.levelList"
      :entityID="entity.entityID"
      :related="false"
    />
    <TreeCard
      v-for="(entity) in treeEntities"
      :key="entity.entityID"
      :id_list="entity.subtreeIds"
      :level_list="entity.levelList"
      :entityID="entity.entityID"
      :related="false"
    />
  </div>
</template>

<script>
import NodeCard from "./selection_panel/NodeCard.vue";
import PathCard from "./selection_panel/PathCard.vue";
import TreeCard from "./selection_panel/TreeCard.vue";
import ConfigureButton from "./table/ConfigureButton.vue";

import { useStore } from "vuex";
import { computed, ref } from "vue";
export default {
  name: "SelectionPanel",
  components: {
    NodeCard,
    PathCard,
    TreeCard,
    ConfigureButton,
  },
  setup() {
    const store = useStore();
    const entityCollection = computed(
      () => store.getters["selection/entityCollection"]
    );
    const nodeEntities = computed(() => {
      return entityCollection.value.filter((entity) => entity.type === "Node");
    });
    const pathEntities = computed(() => {
      return entityCollection.value.filter((entity) => entity.type === "Path");
    });
    const treeEntities = computed(() => {
      return entityCollection.value.filter((entity) => entity.type === "Tree");
    });



    // const id_list = ref(["2", "30"]);
    // const level_list = ref(["2", "3"]);
    // const tree_id_list = ref([1, 5, 7, 8, 9]);
    // const tree_level_list = ref([1, 2, 2, 2, 2]);

    return {
      nodeEntities,
      pathEntities,
      treeEntities,
      entityCollection
    };
  },
};
</script>


<style></style>