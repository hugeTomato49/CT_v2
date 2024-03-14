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

    },
    deleteEntity({state}, entityID){

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