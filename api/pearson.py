'''
@Description: a file define the pearson correlation coefficient function.
@Author: Nemo
@Date: 2024-01-31 15:19:43
@LastEditTime: 2024-01-31 18:30:54
@LastEditors: Nemo
'''
import pandas as pd
import numpy as np
from backend.compute.jsonTransfer import TSjson_exp

def pearson_cal(json_data):
    '''
    @description: the function deal with the double-TS data and calculate the pearson 
    correlation coefficient between them.
    @Author: Nemo
    @Date: 2024-01-31 18:12:07
    @return {*} if json_data wrong : return '' and print DataError type;
    else : return the pearson correlation coefficient
    @param {*} json_data : the TS json data(from request)
    '''
    try:
        _, array = TSjson_exp(json_data)

        if array.shape[1] == 3:    # only two list in json, pass

            arrary_1 = array[:,1].astype(float)
            arrary_2 = array[:,2].astype(float)

            pearson = np.corrcoef(arrary_1, arrary_2)[0,1]
            return pearson
        else:
            print("Data Error _02")
            return 2

    except Exception as e:

        print("Data Error _01")
        return ''