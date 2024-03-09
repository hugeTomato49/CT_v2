'''
@Description: 
@Author: 
@Date: 2024-03-08 23:30:11
@LastEditTime: 2024-03-09 22:37:10
@LastEditors: Nemo
'''
import os
import json
from compute.TSfuncCal import Eucdis_cal, BestMatchedLayer_cal, Mean_w
from compute.filter import filterDataByTimeRange

def getBT(timeRange, tree_data, target_id, folder_path, mode='similarity'):
    # 需要从函数处读取上级目录，数据目录，需要测试
    # folder_path = os.path.abspath(os.path.join(os.getcwd(), "../.."))
    # folder_path = "../data/PV"

    # 读取目标树
    for node in tree_data:
        if node['id'] == target_id:
            target_level = node['level']
            target_children_id = node['children_id']
            target_father_file_path = os.path.join(folder_path, list(node["node_name"].split("-"))[-2], node["node_name"] + ".json")
            with open(target_father_file_path, 'r') as file:
                target_father_node_data = {'data':filterDataByTimeRange(json.load(file)["data"], timeRange)}
            target_children_node_data = []
            for target_child_id in target_children_id:
                child_node = tree_data[target_child_id-1]
                target_child_file_path = os.path.join(folder_path, list(child_node["node_name"].split("-"))[-2], child_node["node_name"] + ".json")
                with open(target_child_file_path, 'r') as file:
                    target_child_node_data = {'data':filterDataByTimeRange(json.load(file)["data"], timeRange)}
                target_children_node_data.append(target_child_node_data)
            break
    # 得到 target_father_node_data, target_children_node_data
    
    target_children_node_w = [Mean_w(ts_tmp) for ts_tmp in target_children_node_data]
    sorted_target_children_node_w = sorted(target_children_node_w, reverse=False)
    target_children_node_w_o = [sorted_target_children_node_w.index(weight) for weight in target_children_node_w]
    # target_children_node_w_o 是每个子节点的优先级 0号位置代表最先应满足的子节点，例如这里是children[14]

    other_trees_result = []

    for node in tree_data:
        if node['id'] != target_id and node['level'] == target_level:
        # if node['id'] == 3:
            # 读取某棵非目标的树
            other_children_id = node['children_id']
            other_father_file_path = os.path.join(folder_path, list(node["node_name"].split("-"))[-2], node["node_name"] + ".json")
            with open(other_father_file_path, 'r') as file:
                other_father_node_data = {'data':filterDataByTimeRange(json.load(file)["data"], timeRange)}
            other_children_node_data = []
            for other_child_id in other_children_id:
                child_node = tree_data[other_child_id-1]
                other_child_file_path = os.path.join(folder_path, list(child_node["node_name"].split("-"))[-2], child_node["node_name"] + ".json")
                with open(other_child_file_path, 'r') as file:
                    other_child_node_data = {'data':filterDataByTimeRange(json.load(file)["data"], timeRange)}
                other_children_node_data.append(other_child_node_data)
            # 得到 other_father_node_data, other_children_node_data
            
            best_score, best_matched_layer = BestMatchedLayer_cal(target_children_node_data, target_children_node_w_o, other_children_node_data)
            best_score += Eucdis_cal(target_father_node_data, other_father_node_data)
            best_treeid = [node['id']]
            for i in range(len(other_children_id)):
                # best_matched_layerid_a = tree_data[target_children_id[i]-1]['id']
                best_treeid.append(tree_data[other_children_id[best_matched_layer[i]]-1]['id'])
            other_matched_result = {}
            other_matched_result['treeid'] = best_treeid
            other_matched_result['score'] = best_score
            other_trees_result.append(other_matched_result)
    
    if mode == 'similarity':
        sorted_result = sorted(other_trees_result, key=lambda x: x['score'], reverse=False)
    elif mode == 'correlation':
        sorted_result = sorted(other_trees_result, key=lambda x: x['score'], reverse=True)
    else:
        print('mode Error!')
        return
    return sorted_result