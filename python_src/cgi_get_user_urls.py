#!/usr/bin/python
# -*- coding:utf-8 -*-
import os, sys
import ast
import json
sys.path.append('../../cgi-bin/TR_Legal_2013_12_23_web/slt_Code/user_mgmt/')
import get_user_urls

def display_data(project_id, user_id):
    obj = get_user_urls.user_urls(project_id, '/var/www/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/dbConfig.ini');
    return obj.GetData(user_id)

if __name__=="__main__":
     print display_data(sys.argv[1], sys.argv[2])
     sys.stdout.flush()
