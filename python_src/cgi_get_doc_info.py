#!/usr/bin/python
# -*- coding:utf-8 -*-
import os, sys
import ast
import json
sys.path.append('../../cgi-bin/TR_Legal_2013_12_23_web/slt_Code/verify_pre_data_html/')
import get_doc_info as get_doc_info
def display_data(input_str):
    res = {}
    if 1:
        jsonObj  = ast.literal_eval(input_str)
        dObj = get_doc_info.get_doc_info(4)
        res = dObj.get_doc_pages_count(jsonObj)
        res = json.dumps(res)
        return res
        
if __name__=="__main__":
    print display_data(sys.argv[1])
    sys.stdout.flush()
