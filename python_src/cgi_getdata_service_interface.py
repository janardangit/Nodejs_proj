#!/usr/bin/python
# -*- coding:utf-8 -*-
import ast,sys, os
sys.path.append('../../cgi-bin/TR_Legal_2013_12_23_web/slt_Code/GetData_master_taxonomy/')
import GetData 
def display_data(s):
        jsonObj = ast.literal_eval(s)
        project_id = jsonObj.get('project_id', "")
        if project_id:
            objGD = GetData.GetData()
            res = objGD.Process_interface(int(project_id))
        return str(res) 
        
       

if __name__=="__main__":
   print display_data(sys.argv[1])
   sys.stdout.flush()
