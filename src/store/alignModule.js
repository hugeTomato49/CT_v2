const state = {
    alignState: false,
    alignLevel: 1, //in default, align to the root node of the selectionTree
    alignNumber: 1,
    largestNumber: []

}

const mutations =  {
    UPDATE_ALIGN_STATE(state, payload){
        state.alignState = payload
    },
    UPDATE_ALIGN_LEVEL(state, payload){
        state.alignLevel = payload
    },
    UPDATE_LARGEST_NUMBER(state, payload){
        state.largestNumber = payload
    }
}

const actions = {
    updateAlignState({commit}, value){
        commit('UPDATE_ALIGN_STATE',value)
    },
    updateAlignLevel({commit}, value){
        commit('UPDATE_ALIGN_LEVEL',value)    
    },
    updateLargestNumber({commit}, value){
        commit('UPDATE_LARGEST_NUMBER',value)
    }

    
}
const getters = {
    alignState: state => state.alignState,
    alignLevel: state => state.alignLevel,
    alignNumber: state => state.alignNumber,
    largestNumber: state => state.largestNumber 

}

const alignModule = {
    namespaced:true,
    state,
    mutations,
    actions,
    getters
}

export default alignModule