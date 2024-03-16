const state = {
    SD: [],
    wholeTimeRange: ['2022-11-27','2023-3-27']

}

const mutations = {

}

const actions = {
    updateSD({state}, SD_result){
        state.SD = SD_result
    }

}
const getters = {
    SD: state => state.SD,
    wholeTimeRange: state => state.wholeTimeRange
    
}

const timeModule = {
    namespaced:true,
    state,
    mutations,
    actions,
    getters
}

export default timeModule