const state = {
    SD: [],
    wholeTimeRange: ['2022-11-27','2023-3-27']
    //wholeTimeRange: ['2023-1-3', '2023-12-29']

}

const mutations = {

}

const actions = {
    updateSD({state}, SD_result){
        state.SD = SD_result
        // console.log("update")
        // console.log(state.SD)
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