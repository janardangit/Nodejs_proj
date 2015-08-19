var TASRightView = {}
function FilterReclassificationView(){
	Utils.call(this);
    this.gbl_cgi_script_file_name = "webintf/cgi_web_extract_lmdb.py";
    this.gbl_cgi_script_file_path = "cgi-bin/TR_Legal_2013_12_23_web/slt_Code/";
    this.gbl_ref_json_info = {};
}    
FilterReclassificationView.prototype		= new Utils();
FilterReclassificationView.prototype.constructor	= FilterReclassificationView;
(function(){
    this.init = function(data){
        this.gbl_data = data;
        var nodes = this.Id('right_section').children;
        for(var ind = 0, len = nodes.length; ind < len; ind++){
            nodes[ind].style.display = "none";
        }
        this.Id('filter_reclassify_main_div').style.display = "block";
        this.addProgressBar();
        this.init_view();
    }
    this.init_view = function()
    {
        this.hide_process_bar();
        this.show_process_bar();
        this.gbl_ref_json_info = {project_id:Number(this.gbl_data.project_id), user_id:Number(this.gbl_data.user_id), agent_id:Number(this.gbl_data.agent_id), mgmt_id:Number(this.gbl_data.mgmt_id), url_id:Number(this.gbl_data.url_id), taxo_id:Number(this.gbl_data.taxo_id), taxo_name:this.gbl_data.taxo_name};
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 142;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        this.Log("Pannel Profile CGI... "+vservice_path+" === ");
        var callback = "TASRightView.gbl.load_reclassification_full_view(json)";
        this.send_ajax_request(vservice_path, null, 1, callback , "GET", true);
    }
    /**
     * Description
     * @method send_ajax_request
     * @param {} cgi_file
     * @param {} post_data
     * @param {} succ_flag
     * @param {} callback
     * @param {} request_type
     * @param {} asyn
     * @return 
     */
    this.send_ajax_request = function(cgi_file, post_data,succ_flag,callback,request_type,asyn){
            var xmlhttp = (window.XMLHttpRequest)?(new XMLHttpRequest()):(new ActiveXObject("Microsoft.XMLHTTP"));
            xmlhttp.onreadystatechange=function(){
                    if(xmlhttp.readyState ==4 && xmlhttp.status==200 && succ_flag == 1) {
                            var text        = xmlhttp.responseText;
                            var xml         = xmlhttp.responseXML;
                            try{var json    = JSON && JSON.parse(text) || eval(text);}catch(e){}
                            var callfunc    = eval(callback);
                    }
            }
            xmlhttp.open(request_type,cgi_file,asyn);
            xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xmlhttp.send(post_data);
    }
    this.load_reclassification_full_view = function(body_data){
        this.hide_process_bar();
        if (body_data && body_data.length > 0){
            if (this.Id("filter_reclassify_kve_content_table")){
                this.Id("filter_reclassify_kve_content_table").parentNode.removeChild(this.Id("filter_reclassify_kve_content_table"))
            }
            var row, tds = [], table = this.createDom("table", {border:"1", width:"100%", id:"filter_reclassify_kve_content_table", height:"auto"}, this.Id('filter_reclassify_Con_Div'))
            tr = this.createDom("tr", {}, table);
            td = this.createDom("th", {style:"padding:4px;width:2%", txt:"Sl No."}, tr);
            td = this.createDom("th", {style:"padding:4px;width:10%", txt:"Profile Id"}, tr);
            td = this.createDom("th", {style:"padding:4px;width:3%", txt:"Level Id"}, tr);
            td = this.createDom("th", {style:"width:2%"}, tr);
            this.createDom("input", {name:"select_all", type:"checkbox", level:(ind+1), style:"margin:0px 1px; vertical-align:middle;", id:"kve_select_all_"+(ind+1), onclick:"TASRightView.gbl.select_all_rows(this)"}, td)
            td = this.createDom("th", {}, tr);
            var ttable = this.createDom("table", {style:"width:100%"}, td);
            tr = this.createDom("tr", {}, ttable);
            td = this.createDom("td", {style:"width:2%;border:0px;border-right:1px solid #c5c5c5;"}, tr);
            td = this.createDom("td", {style:"width:10%;border:0px;border-right:1px solid #c5c5c5;"}, tr);
            this.createDom("input", {name:"select_all_inner", type:"checkbox", style:"margin:0px 1px; vertical-align:middle;",  onclick:"TASRightView.gbl.select_all_rows_inner(this)"}, td)
            td = this.createDom("td", {txt:"Content", style:"width:70%;border:0px;border-right:1px solid #c5c5c5;"}, tr);
            td = this.createDom("td", {txt:"Taxonomy", style:"border:0px;"}, tr);
            var sub_data = [], color, doc_id, level_id, level_index, prof_id, pw, ph;
            var gbl_page_data = [];
            for(var ind = 0, len = body_data.length; ind < len; ind++){
                tr = this.createDom("tr", {}, table);
                td = this.createDom("td", {style:"padding:4px;width:2%;border-bottom-width: 3px;", txt:(ind+1)}, tr);
                sub_data    = body_data[ind]['data'];
                doc_id      = body_data[ind]['doc_id'];
                level_id    = body_data[ind]['levelid'];
                level_index = body_data[ind]['levelindex'];
                prof_id     = body_data[ind]['prof_id_str'];
                pw          = body_data[ind]['pw'];
                ph          = body_data[ind]['ph'];
                td = this.createDom("td", {style:"padding:4px;width:10%;border-bottom-width: 3px;", txt:prof_id+" ("+doc_id+")"}, tr);
                td = this.createDom("td", {style:"padding:4px;width:3%;border-bottom-width: 3px;", txt:level_id+"."+(parseInt(level_index)+1)}, tr);
                td = this.createDom("td", {style:"width:2%;border-bottom-width: 3px;"}, tr);
                if (Object.keys(body_data[ind]).length == 0){
                    td = this.createDom("td", {style:"border-bottom-width: 3px;", id:'kve_content_td_'+doc_id}, tr);
                    continue
                }
                this.createDom("input", {name:"apply_action", type:"checkbox", doc_id:doc_id,style:"margin:0px 1px; vertical-align:middle;", id:"kve_row_"+ind}, td)
                td = this.createDom("td", {style:"border-bottom-width: 3px;", id:'kve_content_td_'+doc_id}, tr);
                gbl_page_data.push(body_data[ind]);
                this.fill_td_cell(td, sub_data[1], ind, doc_id, pw, ph, body_data[ind]['unit_taxonomy']); 
            }
            this.Id("kve_0_0_0").click();
        }
    }
    this.select_all_classify_unit = function(elem){
        var flg = false, inputElms;
        if (elem.checked){
            inputElms = Id('filter_reclassify_Con_Div').querySelectorAll('input[unit_type="reclassify_unit"]:not(:checked)');
            flg = true;
        }
        else{
            inputElms = Id('filter_reclassify_Con_Div').querySelectorAll('input[unit_type="reclassify_unit"]:checked');
        }
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = flg;
        } 
    }
    this.select_all_source_unit = function(elem){
        var flg = false, inputElms;
        if (elem.checked){
            inputElms = Id('filter_reclassify_Con_Div').querySelectorAll('input[unit_type="source_unit"]:not(:checked)');
            flg = true;
        }
        else{
            inputElms = Id('filter_reclassify_Con_Div').querySelectorAll('input[unit_type="source_unit"]:checked');
        }
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = flg;
        } 
    }


    this.select_all_rows = function(elem){
        var flg = false, inputElms;
        if (elem.checked){
            inputElms = Id('filter_reclassify_Con_Div').querySelectorAll('input[name="apply_action"]:not(:checked)');
            flg = true;
        }
        else{
            inputElms = Id('filter_reclassify_Con_Div').querySelectorAll('input[name="apply_action"]:checked');
        }
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = flg;
        } 
    }
    this.select_all_rows_inner = function(elem){
        var flg = false, inputElms;
        if (elem.checked){
            inputElms = Id('filter_reclassify_Con_Div').querySelectorAll('input[name="apply_action_inner"]:not(:checked)');
            flg = true;
        }
        else{
            inputElms = Id('filter_reclassify_Con_Div').querySelectorAll('input[name="apply_action_inner"]:checked');
        }
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = flg;
        } 
    }
    this.fill_td_cell = function(cell, subData, gr_index, doc_id, pw, ph, taxo_unit){
        var div, color, unit_type, cnt = 1;
        var taxo_lst, tr, td, table = this.createDom("table", {style:"width:100%"}, cell);
        for(var i=0; i<subData.length; i++){
            taxo_lst = taxo_unit[i];
            unit_type = (this.gbl_ref_json_info.taxo_id == taxo_lst[0]) ? "source_unit" : "reclassify_unit";
            if (subData.length -1 == i){
                tr = this.createDom("tr", {}, table);
                td = this.createDom("td", {style:"width:2%;border:0px;border-right:2px solid #c5c5c5;", txt:(i+1)}, tr);
                td = this.createDom("td", {style:"width:10%;border:0px;border-right:2px solid #c5c5c5;"}, tr);
                this.createDom("input", {name:"apply_action_inner", unit_type:unit_type, unit_id:i, doc_id:doc_id, type:"checkbox", style:"margin:0px 1px; vertical-align:middle;", id:"kve_row_"+(i+1)}, td)
                td = this.createDom("td", {style:"width:70%; border:0px;border-right:2px solid #c5c5c5;"}, tr);
                this.createDom("td", {txt:taxo_lst[1], taxo_id:taxo_lst[0], style:"border:0px;"}, tr);
            }
            else{
                tr = this.createDom("tr", {}, table);
                td = this.createDom("td", {style:"width:2%;border:0px;border-bottom:2px solid #c5c5c5;border-right:2px solid #c5c5c5;", txt:(i+1)}, tr);
                td = this.createDom("td", {style:"width:10%;border:0px;border-bottom:2px solid #c5c5c5;border-right:2px solid #c5c5c5;"}, tr);
                this.createDom("input", {name:"apply_action_inner", unit_type:unit_type, unit_id:i, doc_id:doc_id, type:"checkbox", style:"margin:0px 1px; vertical-align:middle;", id:"kve_row_"+(i+1)}, td)
                td = this.createDom("td", {style:"width:70%; border:0px;border-bottom:2px solid #c5c5c5;border-right:2px solid #c5c5c5;"}, tr);
                this.createDom("td", {txt:taxo_lst[1], taxo_id:taxo_lst[0], style:"border:0px;border-bottom:2px solid #c5c5c5;"}, tr);
            }
            //color = (subData[i][7] == 1) ? "#B5E784" : "#ff0000";
            color = "#4484F2";
            for (var j=0; j<subData[i][1].length; j++){
                this.createDom("div", {id:"kve_"+gr_index+'_'+i+'_'+j, txt:subData[i][1][j], style:"color:"+color+";", gid:"GR_"+doc_id+"_"+cnt, gr_index:gr_index, doc_id:doc_id, pw:pw, ph:ph}, td);
            }
            cnt += 1;
        }
    }
    this.delete_reclassify_row = function(elem){
        var prof_doc_ids = [], unit_doc_ids = [];
        var inputElms = this.Id('filter_reclassify_kve_content_table').querySelectorAll('input[name="apply_action"]:checked');
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            prof_doc_ids.push(Number(inputElms[i].getAttribute('doc_id')))
        }  
        inputElms = this.Id('filter_reclassify_kve_content_table').querySelectorAll('input[name="apply_action_inner"]:checked');
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            unit_doc_ids.push([Number(inputElms[i].getAttribute('doc_id')), Number(inputElms[i].getAttribute('unit_id'))])
        } 
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 143;
        json['profile_delete'] = prof_doc_ids;
        json['unit_delete'] = unit_doc_ids;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        this.Log("Delete Profile CGI... "+vservice_path+" === ");
        var callback = "TASRightView.gbl.init_view(json)";
        this.send_ajax_request(vservice_path, null, 1, callback , "GET", true);
    }
    this.restore_reclassify_row = function(elem){
        var prof_doc_ids = [], unit_doc_ids = [];
        var inputElms = this.Id('filter_reclassify_kve_content_table').querySelectorAll('input[name="apply_action"]:checked');
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            prof_doc_ids.push(Number(inputElms[i].getAttribute('doc_id')))
        }  
        inputElms = this.Id('filter_reclassify_kve_content_table').querySelectorAll('input[name="apply_action_inner"]:checked');
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            unit_doc_ids.push([Number(inputElms[i].getAttribute('doc_id')), Number(inputElms[i].getAttribute('unit_id'))])
        } 
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 144;
        json['profile_restore'] = prof_doc_ids;
        json['unit_restore'] = unit_doc_ids;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        this.Log("Restore Profile CGI... "+vservice_path)
        var callback = "TASRightView.gbl.init_view(json)";
        this.send_ajax_request(vservice_path, null, 1, callback , "GET", true);
    }
    this.addProgressBar = function(){
        try{
            if (!this.Id('process_png')){
                this.createDom("div", {id:'process_png', class:"disable_action"}, document.body);
                //this.createDom("img", {src:"images/process_rnd.gif",style:"position:absolute;left:45%;top:25%;z-index:9999"}, this.Id('process_png'));
            }
        }catch(e){
        }
        this.Id('process_png').style.display = 'none';
    }
 
}).apply(FilterReclassificationView.prototype);
