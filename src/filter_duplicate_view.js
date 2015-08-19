var TASRightView = {}
function FilterDeDuplicationView(){
	Utils.call(this);
    this.gbl_cgi_script_file_name = "webintf/cgi_web_extract_lmdb.py";
    this.gbl_cgi_script_file_path = "cgi-bin/TR_Legal_2013_12_23_web/slt_Code/";
    this.gbl_ref_json_info = {};
}    
FilterDeDuplicationView.prototype		= new Utils();
FilterDeDuplicationView.prototype.constructor	= FilterDeDuplicationView;
(function(){
    this.init = function(data){
        this.gbl_data = data;
        var nodes = this.Id('right_section').children;
        for(var ind = 0, len = nodes.length; ind < len; ind++){
            nodes[ind].style.display = "none";
        }
        this.Id('filter_de-duplication_main_div').style.display = "block";
        this.addProgressBar();
        this.init_view();
    }
    this.init_view = function()
    {
        this.hide_process_bar();
        this.show_process_bar();
        this.gbl_ref_json_info = {project_id:Number(this.gbl_data.project_id), user_id:Number(this.gbl_data.user_id), agent_id:Number(this.gbl_data.agent_id), mgmt_id:Number(this.gbl_data.mgmt_id), url_id:Number(this.gbl_data.url_id), taxo_id:Number(this.gbl_data.taxo_id), taxo_name:this.gbl_data.taxo_name};
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 201;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        this.Log("Pannel Profile CGI... "+vservice_path+" === ");
        var callback = "TASRightView.gbl.load_full_view(json)";
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
    /*
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
    }*/
    this.load_full_view = function(data){
        this.Id('filter_de-duplication_main_div1').style.overflow = "auto";
        if (data && data.length == 3){
            var header = data[0], tr, td,  body_data=data[1], resStatus=data[2];
            this.Id('filter_de-duplication_header-content').innerHTML = "Taxonomy stats: "+JSON.stringify(resStatus);
            if (this.Id("filter_de-duplication_kve_content_table")){
                this.Id("filter_de-duplication_kve_content_table").parentNode.removeChild(this.Id("filter_de-duplication_kve_content_table"))
            }
            var row, tds = [], table = this.createDom("table", {border:"1", width:"100%", id:"filter_de-duplication_kve_content_table", height:"auto"}, this.Id('filter_de-duplication_main_div1'))
            tr = this.createDom("tr", {}, table);
            td = this.createDom("th", {style:"padding:4px;width:2%", txt:"Sl No."}, tr);
            td = this.createDom("th", {style:"padding:4px;width:10%", txt:"Profile Id"}, tr);
            for(var ind = 0, len = header.length; ind < len; ind++){
                td = this.createDom("th", {style:"width:2%"}, tr);
                this.createDom("input", {name:"select_all", type:"checkbox", level:(ind+1), style:"margin:0px 1px; vertical-align:middle;", id:"filter_de-duplication_kve_select_all_"+(ind+1), onclick:"TASRightView.gbl.select_all_rows(this)"}, td)
                td = this.createDom("th", {txt:header[ind][0]+"."+header[ind][1]}, tr);
            }
            var sub_data = [], color, status_cnt, doc_id;
            for(var ind = 0, len = body_data.length; ind < len; ind++){
                tr = this.createDom("tr", {}, table);
                td = this.createDom("td", {style:"padding:4px;width:2%;border-bottom-width: 3px;", txt:(ind+1)}, tr);
                td = this.createDom("td", {style:"padding:4px;width:10%;border-bottom-width: 3px;", txt:body_data[ind][0][1]}, tr);
                for (var j=0; j<body_data[ind][1].length; j++){
                    
                    td = this.createDom("td", {style:"width:2%;border-bottom-width: 3px;"}, tr);
                    if (Object.keys(body_data[ind][1][j]).length == 0){
                        td = this.createDom("td", {style:"border-bottom-width: 3px;"}, tr);
                        continue
                    }
                    this.createDom("input", {name:"each_cell", level:"level_"+(j+1), type:"checkbox", doc_id:body_data[ind][1][j]['doc_id'],style:"margin:0px 1px; vertical-align:middle;", id:"filter_de-duplication_kve_row_"+j}, td)
                    color = (body_data[ind][1][j]['status'] == 1) ? "#61C03E" : (body_data[ind][1][j]['status'] == 2) ? "#FF4F52" : "";
                    this.Log("color"+color+"==="+body_data[ind][1][j]['status']);
                    if (color)
                        td = this.createDom("td", {style:"border-bottom-width: 3px;background:"+color}, tr);
                    else
                        td = this.createDom("td", {style:"border-bottom-width: 3px;"}, tr);
                    sub_data = body_data[ind][1][j]['data'];
                    doc_id = body_data[ind][1][j]['doc_id'];
                    status_cnt = body_data[ind][1][j]['stats_count'];
                    this.fill_td_cell(td, sub_data[1], doc_id, status_cnt); 
                }
            }
        } 
        this.hide_process_bar();
    }
    this.fill_td_cell = function(td, subData, doc_id, status_cnt){
        var div;
        div = this.createDom("div", {style:"border-bottom:1px solid #c5c5c5;width:100%"}, td);
        this.createDom("div", {txt:doc_id+" : "+JSON.stringify(status_cnt)}, div);
        for(var i=0; i<subData.length; i++){
            if (subData.length -1 == i){
                div = this.createDom("div", {style:"width:100%"}, td);
            }
            else{
                div = this.createDom("div", {style:"border-bottom:1px solid #c5c5c5;width:100%"}, td);
            }
            for (var j=0; j<subData[i][1].length; j++){
                this.createDom("div", {txt:subData[i][1][j]}, div);
            }
        }
    }
    this.select_all_rows = function(elem){ 
        var level = elem.getAttribute('level');
        var flg = false, inputElms;
        if (elem.checked){
            inputElms = this.Id('filter_de-duplication_kve_content_table').querySelectorAll('input[level="level_'+level+'"]:not(:checked)');
            flg = true;
        }
        else{
            inputElms = this.Id('filter_de-duplication_kve_content_table').querySelectorAll('input[level="level_'+level+'"]:checked');
        }
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = flg;
        }  
    } 

    this.delete_filter_data = function(){
        var inputElms = this.Id('filter_de-duplication_kve_content_table').querySelectorAll('input[name="each_cell"]:checked');
        var doc_ids = [];
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            doc_ids.push(Number(inputElms[i].getAttribute('doc_id')))
        }  
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 202;
        json['docid_lst'] = doc_ids;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        var post_data		= "input_str=" + JSON.stringify(json);
        this.Log("delete duplicate CGI... "+vservice_path+post_data+" === ");
        this.send_ajax_request(vservice_path, post_data, 1,  "TASRightView.gbl.init_view(json)", "POST", true);
    }
    this.restore_filter_data = function(){
        var inputElms = this.Id('filter_de-duplication_kve_content_table').querySelectorAll('input[name="each_cell"]:checked');
        var doc_ids = [];
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            doc_ids.push(Number(inputElms[i].getAttribute('doc_id')))
        }  
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 203;
        json['docid_lst'] = doc_ids;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        var post_data		= "input_str=" + JSON.stringify(json);
        console.log("Restore duplicate CGI... "+vservice_path+post_data+" === ");
        this.send_ajax_request(vservice_path, post_data, 1,  "TASRightView.gbl.init_view(json)", "POST", true);
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

}).apply(FilterDeDuplicationView.prototype);
