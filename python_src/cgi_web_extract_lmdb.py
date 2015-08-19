#!/usr/bin/python
# -*- coding:utf-8 -*-
import os, sys
import ast, copy, json
sys.path.append('../../cgi-bin/TR_Legal_2013_12_23_web/slt_Code/webintf/')
import modules.web_extract_intf.web_extract_intf_lmdb as web_extract_intf

def display_data(input_str):
    res = {}
    jsondata = ast.literal_eval(input_str)

    project_id = jsondata.get('project_id', -1)
    url_id = jsondata.get('url_id', -1)
    user_id = jsondata.get('user_id', -1)
    agent_id = jsondata.get('agent_id', -1)
    mgmt_id = jsondata.get('mgmt_id', -1)
    cmd_id = jsondata.get('cmd_id', -1)

    project_id = int(project_id)
    url_id = int(url_id)
    user_id = int(user_id)
    agent_id = int(agent_id)
    mgmt_id = int(mgmt_id)
    cmd_id = int(cmd_id)

    if 1:
        idata = copy.deepcopy(jsondata)
        weObj = web_extract_intf.web_extract_intf(project_id, url_id, user_id, agent_id, mgmt_id, '/var/www/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/webintf/config_lmdb.ini')
        res = weObj.process(cmd_id, idata)

    res = json.dumps(res, ensure_ascii=False)
    return res
        
if __name__=="__main__":
    print display_data(sys.argv[1])
    sys.stdout.flush()
