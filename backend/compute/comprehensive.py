'''
@Description: 
@Author: 
@Date: 2024-03-13 19:51:25
@LastEditTime: 2024-03-13 19:52:34
@LastEditors: Nemo
'''
from compute.TSfuncCal import GetMax, GetMin
from compute.filter import getTSdata
def getBoundary(pv_tree_data, folder_path, timeRange=[]):
    level_max=[]
    level_min=[]
    for node in pv_tree_data:
        node_TS_data = {'data':getTSdata(node['node_name'], folder_path, timeRange)}
        node_max = GetMax(node_TS_data)
        node_min = GetMin(node_TS_data)
        if node['level'] > len(level_max):
            level_max.append(node_max)
            level_min.append(node_min)
        else:
            if node_max > level_max[node['level']-1]:
                level_max[node['level']-1] = node_max
            if node_min > level_min[node['level']-1]:
                level_min[node['level']-1] = node_min
    # print(level_max)
    # print(level_min)
    result = []
    for i in range(len(level_max)):
        tmp_dict = {'level':i+1, 'max':level_max[i], 'min':level_min[i]}
        result.append(tmp_dict)
    return {'result':result}

