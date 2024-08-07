import { faL } from "@fortawesome/free-solid-svg-icons";
import { ifEmphasize } from "../computation/treeComputation"

const state = {
    //list of obj: [{entityID: 1, type: "tree", "id_list": [], "level_list": []}, {entityID: 2, type: "node", "id": 1, "level":1}]
    entityCollection: [],
    entityID: 1,
    nodeVisiable: false,
    pathVisiable: false,
    treeVisiable: false,
    entityHeight: 0,
    entityWidth: 0
}

const mutations = {
    //不用mutations, 直接actions, 改变entityCollection
    deleteIdFromEntity(state, { index, idIndex }) {
        state.entityCollection[index].path.splice(idIndex, 1);
    },
    SET_NODE_VISUAL(state, value) {
        state.nodeVisiable = value;
    },
    SET_PATH_VISUAL(state, value) {
        state.pathVisiable = value;
    },
    SET_TREE_VISUAL(state, value) {
        state.treeVisiable = value;
    },
    SET_ENTITY_HEIGHT(state, value) {
        state.entityHeight = value;
    },
    SET_ENTITY_WIDTH(state, value) {
        state.entityWidth = value;
    }
}

const actions = {
    addEntity({ state }, obj) {
        const newEntity = {
            entityID: state.entityID,
            ...obj // 合并传入的对象，例如{ type: 'Node' }，到新对象中
        };
        // 将新对象添加到entityCollection数组中
        state.entityCollection.push(newEntity);
        // 自增entityID以备下次使用
        state.entityID++;
    },
    deleteEntity({ state }, entityID) {
        // console.log("index is", entityID)
        state.entityCollection = state.entityCollection.filter(entity => entity.entityID !== entityID);
    },
    deleteIdFromEntity({ commit, state, rootState }, deleteItem) {
        const index = state.entityCollection.findIndex(entity => entity.entityID === deleteItem.entityID);
        console.log("id is", deleteItem.id)
        console.log("entity id is", deleteItem.entityID)
        console.log("index is", index)
        if (index !== -1) {
            const levelIndex = state.entityCollection[index].path.findIndex(id => id === deleteItem.id);
            state.entityCollection[index].path = state.entityCollection[index].path.filter(item => item !== deleteItem.id)
            if (rootState.tree.dataset === "PV") {
                state.entityCollection[index].levelList.splice(levelIndex, 1)
            }
        }
        // console.log("entity collectino is", state.entityCollection)
    },
    updateNodeVisiable({ commit }, value) {
        commit('SET_NODE_VISUAL', value);
    },
    updatePathVisiable({ commit }, value) {
        commit('SET_PATH_VISUAL', value);
    },
    updateTreeVisiable({ commit }, value) {
        commit('SET_TREE_VISUAL', value);
    },
    updateEntityHeight({ commit }, value) {
        commit('SET_ENTITY_HEIGHT', value);
    },
    updateEntityWidth({ commit }, value) {
        commit('SET_ENTITY_WIDTH', value);
    }
}
const getters = {
    entityID: state => state.entityID,
    entityCollection: state => state.entityCollection,
    nodeVisiable: state => state.nodeVisiable,
    pathVisiable: state => state.pathVisiable,
    treeVisiable: state => state.treeVisiable,
    entityHeight: state => state.entityHeight,
    entityWidth: state => state.entityWidth
}

const selectionModule = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default selectionModule