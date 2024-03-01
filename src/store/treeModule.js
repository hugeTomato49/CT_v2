import axios from "axios"
import { cloneDeep, update } from 'lodash'
import { transformData, filterDataByTimeRange } from "../computation/basicComputation"
import { updateSelectionFromOriginal, addLevels, updateSeriesCollection } from "../update/updateTree"
import { addPlotScale, addYScale } from "../update/updateScale"



const state = {
    originalTree : [],
    selectionTree : [], 
    seriesCollection: [],
    dataset: 'PV',
    levels: ['Transformer', 'Converter', 'Line'],
    level_id_list: [],
    timeRange: [],
    colorBar: ["#4B99D0", "#4B99D0", "#4B99D0","#4B99D0", "#4B99D0","#4B99D0"],
    groupState: false

    

}

const mutations = {
    UPDATE_ORIGINAL_TREE(state, payload){
        state.originalTree = payload
    },
    UPDATE_SELECTION_TREE(state, payload){
        // console.log("CHECK SelectionTree")
        // console.log(payload)
        state.selectionTree = payload
    },
    UPDATE_SERIES_COLLECTION(state, payload){
        // console.log("CHECK Series Collection")
        // console.log(payload)
        state.seriesCollection = payload
    },
    UPDATE_TIME_RANGE(state, payload){
      state.timeRange = payload
    },
    UPDATE_LEVEL_ID_LIST(state, payload) {
      state.level_id_list = payload
    },
    UPDATE_LEVELS(state, payload) {
      state.levels = payload
    }

}

const actions = {
    getPVTree({state, dispatch, commit}) {
        axios.get('/api/PVTree').then((response) => {
            commit('UPDATE_ORIGINAL_TREE', response.data.PV_Tree)
            // console.log("CHECK")
            // console.log(response.data.PV_Tree)
            dispatch('addToSelectionTree',cloneDeep(state.originalTree.slice(0,1)))
        })
    },
    updateSelectionTree({state, commit, dispatch}, currentSelectionTree){
      commit('UPDATE_SELECTION_TREE', currentSelectionTree)
      if(state.level_id_list.length != [...new Set(currentSelectionTree.map((node) => node.level))].length && state.groupState == false){
        dispatch('updateLevelIdList', [...new Set(currentSelectionTree.map((node) => node.level))])
      }
      dispatch('getSeriesCollection', currentSelectionTree)
    },
    getSeriesCollection({state, commit, dispatch}, selectionTree){
      axios.post('/api/SeriesCollection',{"selectionTree":selectionTree, "dataset":state.dataset}).then((response) => {
        const newSeriesCollection = response.data.seriesCollection.map(node => {
          return {
            ...node,
            seriesData: filterDataByTimeRange(transformData(node.seriesData),state.timeRange)
          }
        })
        commit("UPDATE_SERIES_COLLECTION", newSeriesCollection)
        if(state.groupState == false){
          dispatch('size/updateScale', newSeriesCollection, {root : true})
        } 
      })
    },
    updateTimeRange({commit, dispatch}, newTimeRange) {
      commit('UPDATE_TIME_RANGE', newTimeRange)
      dispatch('filterSeriesCollectionByTimeRange', newTimeRange)
      dispatch('scatterPlot/getCoordinateCollection',null, {root:true})
    },
    filterSeriesCollectionByTimeRange({state, commit, dispatch}, newTimeRange){

      let currentSeriesCollection = state.seriesCollection.map(node => {
        return {
          ...node,
          seriesData: filterDataByTimeRange(node['seriesData'], newTimeRange)
        }
      })
      commit('UPDATE_SERIES_COLLECTION', currentSeriesCollection)
      dispatch('size/updateScale', currentSeriesCollection, {root : true})
      
    },
    // fold and unfold operation
    selectNodeAndChildren({state, dispatch}, id) {
        const nodesToAdd = [];
        const findChildren = (parentId) => {
          state.originalTree.forEach(node => {
            if (node.parent_id == parentId) {
              const new_node = cloneDeep(node)
              if(node.children_id.length > 0){
                new_node.leaf = false
              }
              else {
                new_node.leaf = true
              }
              nodesToAdd.push(new_node);
            }
          });
        }
        findChildren(id);
        // console.log(nodesToAdd)
        dispatch('addToSelectionTree',nodesToAdd)
    },
    deselectNodeAndChildren({state, dispatch}, id) {
        const nodesToRemove = []
        const nodeToDeselect = state.selectionTree.find(node => node.id == id)
        nodeToDeselect.children_id = []

        const findChildren = (parentId) => {
          state.originalTree.forEach(node => {
            if (node.parent_id === parentId) {
              const new_node = cloneDeep(node)
              nodesToRemove.push(new_node);
              findChildren(node.id) // find children recursively
            }
          });
        };
        findChildren(id);
        if (nodesToRemove.length > 0) {
            dispatch('removeFromSelectionTree',nodesToRemove)  
        }
    },
    addToSelectionTree({ state, commit, dispatch }, nodes) {
        let currentSelectionTree = state.selectionTree
        nodes.forEach(node => {
          // prevent duplicate
          if (!currentSelectionTree.some(n => n.id == node.id)) {
            //update children
            const nodeToUpdate = currentSelectionTree.find(n => n.id === node.parent_id)
            if(nodeToUpdate) {
                nodeToUpdate.children_id.push(node.id)
            }
            node.children_id = []
            currentSelectionTree.push(node);
          }
        })
        dispatch('updateSelectionTree', currentSelectionTree)

      },
    removeFromSelectionTree({state, dispatch}, nodesToRemove) {
        let currentSelectionTree = state.selectionTree
        currentSelectionTree = currentSelectionTree.filter(node =>
            !nodesToRemove.some(n => n.id === node.id)
        )
        dispatch('updateSelectionTree',currentSelectionTree)
    },
    updateLevelIdList({commit, dispatch}, level_id_list) {
      commit('UPDATE_LEVEL_ID_LIST', level_id_list)
      dispatch('scatterPlot/getCoordinateCollection',null, {root:true})
    },
    addLevelToLevelIdList({state, dispatch}){
      const max = Math.max(...state.level_id_list)
      state.level_id_list.push(max + 1) 
      dispatch('updateLevelIdList', state.level_id_list)
    },
    addLayer({state, dispatch, commit, rootState}, obj){
      state.groupState = true
      axios.post('/api/addLayer',obj).then((response) => {
        // console.log("check newOriginalTree")
        // console.log(response.data.newOriginalTree)
        commit('UPDATE_ORIGINAL_TREE', response.data.newOriginalTree) // originalTree
        dispatch('updateSelectionTree', updateSelectionFromOriginal(state.selectionTree, state.originalTree, obj.level_id)) // selectionTree & seriesCollection
        commit('UPDATE_LEVEL_ID_LIST', [...new Set(state.selectionTree.map(node => node.level))].sort((a, b) => a - b)) // level_id_list
        commit('UPDATE_LEVELS', addLevels(state.levels, obj.level_id)) // levels
        commit('size/UPDATE_Y_SCALE', addYScale(rootState.size.yScale, obj.level_id), { root: true }) // yScale
        commit('scatterPlot/UPDATE_COORDINATE_COLLECTION', response.data.newCoordinateCollection, { root: true }) // coordinateCollection
        const {plotX, plotY} = addPlotScale(rootState.scatterPlot.plot_X_Scale, rootState.scatterPlot.plot_Y_Scale, obj.level_id)
        commit('scatterPlot/UPDATE_PLOT_X_SCALE', plotX, { root: true }) //plot_x_scale
        commit('scatterPlot/UPDATE_PLOT_Y_SCALE', plotY, { root: true }) //plot_y_scale
      })
    }
    
}

const getters = {
    originalTree: state => state.originalTree,
    selectionTree: state => state.selectionTree,
    seriesCollection: state => state.seriesCollection,
    dataset: state => state.dataset,
    levels: state => state.levels,
    level_id_list: state => state.level_id_list,
    timeRange: state => state.timeRange.PV_Tree,
    colorBar: state => state.colorBar,
    groupState: state => state.groupState
    


}


const treeModule  = {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}

export default treeModule


