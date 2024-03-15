import { ifEmphasize } from "../computation/treeComputation"

const state = {
    //list of obj: [{entityID: 1, type: "tree", "id_list": [], "level_list": []}, {entityID: 2, type: "node", "id": 1, "level":1}]
    entityCollection: [],
    entityID: 1
}

const mutations =  {
    //不用mutations, 直接actions, 改变entityCollection
   
}

const actions = {
    addEntity({state}, obj){
        const newEntity = {
            entityID: state.entityID,
            ...obj // 合并传入的对象，例如{ type: 'Node' }，到新对象中
          };
          // 将新对象添加到entityCollection数组中
          state.entityCollection.push(newEntity);
          // 自增entityID以备下次使用
          state.entityID++;
    },
    deleteEntity({state}, entityID){
        // console.log("index is", entityID)
        state.entityCollection = state.entityCollection.filter(entity => entity.entityID !== entityID);
    }
    
    

    
}
const getters = {
    entityCollection: state => state.entityCollection
}

const selectionModule = {
    namespaced:true,
    state,
    mutations,
    actions,
    getters
}

export default selectionModule