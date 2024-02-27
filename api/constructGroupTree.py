'''
@Description: 
@Author: 
@Date: 2024-02-26 15:39:05
@LastEditTime: 2024-02-27 21:39:39
@LastEditors: Nemo
'''
import os
import json
from dr import mds_to2d 
from filter import filterDataByTimeRange
from cluster import cluster_dbscan, cluster_kmeans_2d 

folder_path = "./data/PV"
Tree_path = os.path.join(folder_path, "PV_Tree.json")

def constructGT(Tree_path, points, n=5):
    if os.path.exists(Tree_path):
        with open(Tree_path, 'r') as file:
            pv_tree_data = json.load(file)
    num_nodes = len(pv_tree_data)
    clusters = cluster_kmeans_2d(points, n)
    for node in pv_tree_data:
        if node['level'] == 2:
            groups_id_list = []
            groups_list = []
            clusters_id_list = []
            for child_id in node['children_id']:
                child_node = pv_tree_data[child_id - 1]
                for key, value in clusters.items():
                    if child_id in value:
                        cluster_id = int(key)
                        break
                
                group = {}
                if cluster_id == 0 or cluster_id not in clusters_id_list:
                    # init a single group
                    num_nodes += 1
                    group['id'] = num_nodes
                    group["node_name"] = node['node_name']+'-G'+str(len(groups_list)+1)
                    group["parent_id"] = node['id']
                    group["children_id"] = [child_id]
                    group["level"] = 3
                    group["attribute"] = "group"+str(cluster_id)

                    groups_list.append(group)
                    groups_id_list.append(num_nodes)
                    clusters_id_list.append(cluster_id)
                    
                    child_node["parent_id"] = num_nodes
                    child_node["level"] = 4
                else:
                    # rather than init a group, add the node to the exist group
                    index = clusters_id_list.index(cluster_id)
                    groups_list[index]['children_id'].append(child_id)
                    
                    child_node["parent_id"] = groups_list[index]['id']
                    child_node["level"] = 4
            
            node['children_id'] = groups_id_list
            pv_tree_data.extend(groups_list)
    new_Tree_path = Tree_path[:-5]+'_new.json'
    with open(new_Tree_path, 'w') as json_file:
        json.dump(pv_tree_data, json_file)