'''
@Description: a file define the pearson correlation coefficient function.
@Author: Nemo
@Date: 2024-01-31 15:19:43
@LastEditTime: 2024-03-08 23:28:49
@LastEditors: Nemo
'''
import pandas as pd
import numpy as np
from compute.jsonTransfer import TSjson_exp

def Pearson_cal(TS1, TS2):
    _, TS1_datalist = TSjson_exp(TS1)
    TS1_datalist = TS1_datalist[:, 1].astype(float)
    _, TS2_datalist = TSjson_exp(TS2)
    TS2_datalist = TS2_datalist[:, 1].astype(float)
    Pearson = np.corrcoef(TS1_datalist, TS2_datalist)[0,1]
    return Pearson
    
def Eucdis_cal(TS1, TS2):
    _, TS1_datalist = TSjson_exp(TS1)
    TS1_datalist = TS1_datalist[:, 1]
    _, TS2_datalist = TSjson_exp(TS2)
    TS2_datalist = TS2_datalist[:, 1]
    Eucdis = np.linalg.norm(TS1_datalist - TS2_datalist)
    return Eucdis

def BestMatchedLayer_cal(target_children_node_data, target_children_node_w_o, other_children_node_data):
    # final_score = Eucdis_cal(target_father_node_data, other_father_node_data)
    final_score = 0
    best_matched_layer = {}
    for target_index in target_children_node_w_o:
        target_child_node_f = target_children_node_data[target_index]
        tmp_score = 0
        tmp_index = 0
        for other_index in range(len(other_children_node_data)):
            other_child_node_f = other_children_node_data[other_index]
            if other_child_node_f != 0 and Eucdis_cal(target_child_node_f, other_child_node_f) > tmp_score:
                tmp_score = Eucdis_cal(target_child_node_f, other_child_node_f)
                tmp_index = other_index
        final_score += tmp_score
        other_children_node_data[tmp_index] = 0
        best_matched_layer[target_index] = (tmp_index)
    return final_score, best_matched_layer

def Mean_w(TS):
    _, TS_datalist = TSjson_exp(TS)
    TS_datalist = TS_datalist[:, 1].astype(float)
    Mean = np.mean(TS_datalist)
    return Mean