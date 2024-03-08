'''
@Description: 
@Author: 
@Date: 2024-03-08 23:30:11
@LastEditTime: 2024-03-08 23:56:22
@LastEditors: Nemo
'''
import os
import json
from compute.TSfuncCal import Eucdis_cal, BestMatchedLayer_cal, Mean_w
from compute.filter import filterDataByTimeRange

def getBT(timeRange, pv_tree_data, target_id, folder_path):
    # 需要从函数处读取上级目录，数据目录，需要测试
    # folder_path = os.path.abspath(os.path.join(os.getcwd(), "../.."))
    # folder_path = "../data/PV"

    # 读取目标树
    for node in pv_tree_data:
        if node['id'] == target_id:
            target_level = node['level']
            target_children_id = node['children_id']
            target_father_file_path = os.path.join(folder_path, list(node["node_name"].split("-"))[-2], node["node_name"] + ".json")
            with open(target_father_file_path, 'r') as file:
                target_father_node_data = {'data':filterDataByTimeRange(json.load(file)["data"], timeRange)}
            target_children_node_data = []
            for target_child_id in target_children_id:
                child_node = pv_tree_data[target_child_id-1]
                target_child_file_path = os.path.join(folder_path, list(child_node["node_name"].split("-"))[-2], child_node["node_name"] + ".json")
                with open(target_child_file_path, 'r') as file:
                    target_child_node_data = {'data':filterDataByTimeRange(json.load(file)["data"], timeRange)}
                target_children_node_data.append(target_child_node_data)
            break
    # 得到 target_father_node_data, target_children_node_data
    
    target_children_node_w = [Mean_w(ts_tmp) for ts_tmp in target_children_node_data]
    sorted_target_children_node_w = sorted(target_children_node_w, reverse=True)
    target_children_node_w_o = [sorted_target_children_node_w.index(weight) for weight in target_children_node_w]
    # target_children_node_w_o 是每个子节点的优先级 0号位置代表最先应满足的子节点，例如这里是children[14]

    other_trees_result = []

    for node in pv_tree_data:
        if node['id'] != target_id and node['level'] == target_level:
        # if node['id'] == 3:
            # 读取某棵非目标的树
            other_children_id = node['children_id']
            other_father_file_path = os.path.join(folder_path, list(node["node_name"].split("-"))[-2], node["node_name"] + ".json")
            with open(other_father_file_path, 'r') as file:
                other_father_node_data = {'data':filterDataByTimeRange(json.load(file)["data"], timeRange)}
            other_children_node_data = []
            for other_child_id in other_children_id:
                child_node = pv_tree_data[other_child_id-1]
                other_child_file_path = os.path.join(folder_path, list(child_node["node_name"].split("-"))[-2], child_node["node_name"] + ".json")
                with open(other_child_file_path, 'r') as file:
                    other_child_node_data = {'data':filterDataByTimeRange(json.load(file)["data"], timeRange)}
                other_children_node_data.append(other_child_node_data)
            # 得到 other_father_node_data, other_children_node_data
            
            best_score, best_matched_layer = BestMatchedLayer_cal(target_children_node_data, target_children_node_w_o, other_children_node_data)
            best_score += Eucdis_cal(target_father_node_data, other_father_node_data)
            best_matched_layerid = {}
            for i in range(len(other_children_id)):
                best_matched_layerid_a = pv_tree_data[target_children_id[i]-1]['id']
                best_matched_layerid_b = pv_tree_data[other_children_id[best_matched_layer[i]]-1]['id']
                best_matched_layerid[best_matched_layerid_a] = best_matched_layerid_b
            other_tree_result = (node['id'], best_score, best_matched_layerid)
            other_trees_result.append(other_tree_result)
    len(other_trees_result)

    max_score = float('-inf')
    max_score_result = None
    for result in other_trees_result:
        score = result[1]  # 获取第二个元素
        # print(score)
        if score > max_score:
            max_score = score
            max_score_result = result
    return max_score_result