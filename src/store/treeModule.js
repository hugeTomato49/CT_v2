import axios from "axios"
import { cloneDeep } from 'lodash'
import { transformData, filterDataByTimeRange, calculateSeriesAverage, calculateSeriesTrend, calculateAverageSeries } from "../computation/basicComputation"
import { merge_trees } from "../computation/treeManipulation"
import { updateSelectionFromOriginal, addLevels, updateSeriesCollection } from "../update/updateTree"
import { addPlotScale, addYScale } from "../update/updateScale"
import { year_data } from "../year_layer_data/PV_Tree_grouped_yearly"
import { yearCoordinate } from "../year_layer_data/region_yearly_points"
import { splitLevel4Nodes, addLevelId, addStockLevel, addCoordinate, getYearSeries } from "../yearCompute/yearCompute"



const state = {
  originalTree: [],
  selectionTree: [],
  seriesCollection: [],
  dataset: 'PV',
  // dataset: 'Stock',
  levels: {
    'PV': ['Transformer', 'Converter', 'Line'],
    // 'Stock':['Index','Sector','Stock'],
    'Stock': ['Country', 'State', 'Region']
    //Region_Year
  },
  description: ['-kw/h', '-kw/h', '-mA', '-mA'],
  level_id_list: [],
  timeRange: [],
  groupState: false,
  year_data,
  yearCoordinate
}

const mutations = {
  UPDATE_ORIGINAL_TREE(state, payload) {
    // console.log("check originalTree")
    // console.log(payload)
    state.originalTree = payload
  },
  UPDATE_SELECTION_TREE(state, payload) {
    // if(state.groupState == true) {
    //   console.log("CHECK SelectionTree")
    //   console.log(payload)
    // }
    state.selectionTree = payload
  },
  UPDATE_SERIES_COLLECTION(state, payload) {
    // console.log("CHECK Series Collection")
    // console.log(payload)
    state.seriesCollection = payload
  },
  UPDATE_TIME_RANGE(state, payload) {
    // console.log("check timeRange")
    // console.log(payload)
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
  getPVTree({ state, dispatch, commit }) {
    axios.get('/api/PVTree').then((response) => {
      commit('UPDATE_ORIGINAL_TREE', response.data.PV_Tree)
      dispatch('addToSelectionTree', cloneDeep(state.originalTree.slice(0, 1)))
      dispatch("time/updateSD", response.data.SD, { root: true })
    })
  },
  updateSelectionTree({ state, commit, dispatch }, currentSelectionTree) {
    commit('UPDATE_SELECTION_TREE', currentSelectionTree)
    if (state.level_id_list.length != [...new Set(currentSelectionTree.map((node) => node.level))].length && state.groupState == false) {
      dispatch('updateLevelIdList', [...new Set(currentSelectionTree.map((node) => node.level))])
    }
    if (state.level_id_list.length === 5) {
      commit("UPDATE_SERIES_COLLECTION", getYearSeries(state.selectionTree, state.seriesCollection))
    } else {
      dispatch('getSeriesCollection', currentSelectionTree)
    }
  },
  getSeriesCollection({ state, commit, dispatch }, selectionTree) {
    axios.post('/api/SeriesCollection', { "selectionTree": selectionTree, "dataset": state.dataset }).then((response) => {
      const newSeriesCollection = response.data.seriesCollection.map(node => {
        return {
          ...node,
          seriesData: filterDataByTimeRange(transformData(node.seriesData), state.timeRange)
        }
      })
      commit("UPDATE_SERIES_COLLECTION", newSeriesCollection)
      // if(state.groupState == false && newSeriesCollection.length == 1)
      if (state.groupState == false) {
        dispatch('size/updateScale', newSeriesCollection, { root: true })
      }
    })
  },
  sortSelectionTree({ state, commit }, obj) {
    let updatedSelectionTree = [...state.selectionTree];
    const averageMap = new Map();
    state.selectionTree.forEach(node => {
      if (obj.id_list.includes(node.id)) {
        const seriesNode = state.seriesCollection.find(item => item.id === node.id)
        let average = 0
        if (state.dataset == 'PV') {
          average = seriesNode ? calculateSeriesAverage(seriesNode.seriesData) : 0
        }
        else if (state.dataset == 'Stock') {
          average = seriesNode ? calculateSeriesTrend(seriesNode.price) : 0
        }
        averageMap.set(node.id, average);
      }
    });
    updatedSelectionTree = updatedSelectionTree.map(node => {
      if (obj.id_list.includes(node.id)) {
        return { ...node, average: averageMap.get(node.id) }
      }
      return node
    })
    if (obj.mode == "desc") {
      updatedSelectionTree.sort((a, b) => obj.id_list.includes(a.id) && obj.id_list.includes(b.id) ? b.average - a.average : 0)
    }
    else if (obj.mode == "asc") {
      updatedSelectionTree.sort((a, b) => obj.id_list.includes(a.id) && obj.id_list.includes(b.id) ? a.average - b.average : 0)
    }
    updatedSelectionTree = updatedSelectionTree.map(({ average, ...node }) => node)
    commit('UPDATE_SELECTION_TREE', updatedSelectionTree);
  },
  updateTimeRange({ state, commit, dispatch }, newTimeRange) {
    if (state.dataset == 'PV') {
      newTimeRange = [new Date('2022-12-15'), new Date('2022-12-29')]
    }
    else if (state.dataset == 'Stock') {
      // newTimeRange = [new Date('2023-03-10'), new Date('2023-03-18')]
      newTimeRange = [new Date('2010-01-01'), new Date('2016-10-01')]
    }
    console.log("newTimeRange")
    console.log(newTimeRange)
    commit('UPDATE_TIME_RANGE', newTimeRange)
    dispatch('filterSeriesCollectionByTimeRange', newTimeRange)
    dispatch('scatterPlot/getCoordinateCollection', null, { root: true })
  },
  filterSeriesCollectionByTimeRange({ state, commit, dispatch }, newTimeRange) {

    let currentSeriesCollection = state.seriesCollection.map(node => {
      return {
        ...node,
        seriesData: filterDataByTimeRange(node['seriesData'], newTimeRange)
      }
    })
    commit('UPDATE_SERIES_COLLECTION', currentSeriesCollection)
    if (state.groupState == false) {
      dispatch('size/updateScale', currentSeriesCollection, { root: true })
    }
  },
  // fold and unfold operation
  selectNodeAndChildren({ state, dispatch }, id) {
    const nodesToAdd = [];
    const findChildren = (parentId) => {
      state.originalTree.forEach(node => {
        if (node.parent_id == parentId) {
          const new_node = cloneDeep(node)
          if (node.children_id.length > 0) {
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
    dispatch('addToSelectionTree', nodesToAdd)
  },
  deselectNodeAndChildren({ state, dispatch }, id) {
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
      dispatch('removeFromSelectionTree', nodesToRemove)
    }
  },
  addToSelectionTree({ state, commit, dispatch }, nodes) {
    let currentSelectionTree = state.selectionTree
    nodes.forEach(node => {
      // prevent duplicate
      if (!currentSelectionTree.some(n => n.id == node.id)) {
        //update children
        const nodeToUpdate = currentSelectionTree.find(n => n.id === node.parent_id)
        if (nodeToUpdate) {
          nodeToUpdate.children_id.push(node.id)
        }
        node.children_id = []
        currentSelectionTree.push(node);
      }
    })
    dispatch('updateSelectionTree', currentSelectionTree)

  },
  removeFromSelectionTree({ state, dispatch }, nodesToRemove) {
    let currentSelectionTree = state.selectionTree
    currentSelectionTree = currentSelectionTree.filter(node =>
      !nodesToRemove.some(n => n.id === node.id)
    )
    dispatch('updateSelectionTree', currentSelectionTree)
  },
  updateLevelIdList({ commit, dispatch }, level_id_list) {
    commit('UPDATE_LEVEL_ID_LIST', level_id_list)
    dispatch('scatterPlot/getCoordinateCollection', null, { root: true })
  },
  addLevelToLevelIdList({ state, dispatch }) {
    const max = Math.max(...state.level_id_list)
    state.level_id_list.push(max + 1)
    dispatch('updateLevelIdList', state.level_id_list)
  },
  addLayer({ state, dispatch, commit, rootState }, obj) {
    state.groupState = true
    axios.post('/api/addLayer', obj).then((response) => {
      // console.log("check newOriginalTree")
      // console.log(response.data.newOriginalTree)
      commit('UPDATE_ORIGINAL_TREE', response.data.newOriginalTree) // originalTree
      dispatch('updateSelectionTree', updateSelectionFromOriginal(state.selectionTree, state.originalTree, obj.level_id)) // selectionTree & seriesCollection
      commit('UPDATE_LEVEL_ID_LIST', [...new Set(state.selectionTree.map(node => node.level))].sort((a, b) => a - b)) // level_id_list
      commit('UPDATE_LEVELS', addLevels(state.levels, obj.level_id, state.dataset)) // levels
      commit('size/UPDATE_Y_SCALE', addYScale(rootState.size.yScale, obj.level_id), { root: true }) // yScale
      commit('scatterPlot/UPDATE_COORDINATE_COLLECTION', response.data.newCoordinateCollection, { root: true }) // coordinateCollection
      const { plotX, plotY } = addPlotScale(rootState.scatterPlot.plot_X_Scale, rootState.scatterPlot.plot_Y_Scale, obj.level_id)
      commit('scatterPlot/UPDATE_PLOT_X_SCALE', plotX, { root: true }) //plot_x_scale
      commit('scatterPlot/UPDATE_PLOT_Y_SCALE', plotY, { root: true }) //plot_y_scale
    })
  },
  addYearLayer({ state, dispatch, commit, rootState }, obj) {
    const yearTree = splitLevel4Nodes(state.originalTree)
    commit('UPDATE_ORIGINAL_TREE', yearTree)
    commit('UPDATE_LEVEL_ID_LIST', addLevelId(state.level_id_list, 5))
    commit('UPDATE_LEVELS', addStockLevel(state.levels, 'Region_Year'))
    commit('scatterPlot/UPDATE_COORDINATE_COLLECTION', addCoordinate(rootState.scatterPlot.coordinateCollection, yearCoordinate), { root: true })
    // const {plotX, plotY} = addPlotScale(rootState.scatterPlot.plot_X_Scale, rootState.scatterPlot.plot_Y_Scale, obj.level_id)
    //   commit('scatterPlot/UPDATE_PLOT_X_SCALE', plotX, { root: true }) //plot_x_scale
    //   commit('scatterPlot/UPDATE_PLOT_Y_SCALE', plotY, { root: true }) //plot_y_scale
    dispatch('scatterPlot/updatePlotScale', null, { root: true })
    // dispatch('selectNodeAndChildren', id)
  },
  mergeTrees({ state, commit, rootState }, obj) {
    merge_trees({ state, commit, rootState }, obj)
  },
  deleteNodes({ state }, deleteIds) {
    let selectionTree = cloneDeep(state.selectionTree)
    selectionTree = selectionTree.filter(node => !deleteIds.includes(node.id))
    const id = deleteIds[0]
    const parent_node = selectionTree.find(node => node.children_id.includes(id))
    parent_node.children_id = parent_node.children_id.filter(id => !deleteIds.includes(id))
    state.selectionTree = selectionTree
  },
  adjustSelectionTree({ state, commit}) {
    const newSelectionTree = cloneDeep(state.selectionTree)
    const sequence = [1,5,6,3,2,4,7,8]
    newSelectionTree.sort((a, b) => sequence.indexOf(a.id) - sequence.indexOf(b.id))
    commit('UPDATE_SELECTION_TREE', newSelectionTree)
  }
}

const getters = {
  originalTree: state => state.originalTree,
  selectionTree: state => state.selectionTree,
  seriesCollection: state => state.seriesCollection,
  dataset: state => state.dataset,
  levels: state => state.levels,
  level_id_list: state => state.level_id_list,
  description: state => state.description,
  timeRange: state => state.timeRange,
  groupState: state => state.groupState,
  year_tree: state => state.year_tree
}

const treeModule = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}

export default treeModule


