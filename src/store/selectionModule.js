import { ifEmphasize } from "../computation/treeComputation"

const state = {
    //list of obj: [{entityID: 1, type: "tree", "id_list": [], "level_list": []}, {entityID: 2, type: "node", "id": 1, "level":1}]
    entityCollection: [],
    entityID: 1,
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
    deleteIdFromEntity({ commit, state }, deleteItem) {
        const index = state.entityCollection.findIndex(entity => entity.entityID === deleteItem.entityID);
        console.log("id is", deleteItem.id)
        console.log("entity id is", deleteItem.entityID)
        console.log("index is", index)
        if (index !== -1) {
            const levelIndex = state.entityCollection[index].path.findIndex(id => id === deleteItem.id);
            state.entityCollection[index].path = state.entityCollection[index].path.filter(item => item !== deleteItem.id)

            console.log("level index is", levelIndex)
            state.entityCollection[index].levelList.splice(levelIndex, 1)
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
    }
}
const getters = {
    entityCollection: state => state.entityCollection,
}

const selectionModule = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default selectionModule