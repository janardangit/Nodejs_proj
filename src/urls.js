function URL(){
	Utils.call(this);
    //this.id = "111";
}
URL.prototype		= new Utils();
URL.prototype.constructor	= URL;
(function(){
    this.get_url_lists	= function(){
        var vservice_path = TASApp.config.CGI_IP+TASApp.config.CGI_DIR + 'user_mgmt/cgi_user_urls_display.py?input_str=';
	    var json	= {user_id:sessionStorage.user_id,project_id:sessionStorage.project_id};
	    vservice_path	+= JSON.stringify(json);
        this.Id('progress').className = "";
	    this.Logger.push("URL.get_url_lists === "+vservice_path);
	    this.send_ajax_request(vservice_path, null, 1, "TASApp.URL.load_batch_lists(text)","GET", true);
    }
    this.load_batch_lists	= function(txt, extract){
        this.Id('progress').className = "progres_div_none";
        txt	= txt.trim();
        if(txt == '')	return;
        var json	= JSON && JSON.parse(txt) || eval(txt);
        var keys	= Object.keys(json);
        keys.sort();
        this.Id("select_Div").innerHTML	= '';
        var lists	= this.createDOM("select",{id:"batch-lists"}, this.Id("select_Div"));
        lists.onchange	= function(){
            TASApp.URL.load_url_lists(this);
        }
        keys.forEach(function(value,index){
            json[value]['batch_id']	= value;
            var option	= TASApp.URL.createDOM("option",{txt:json[value]['batch_name'],value:value, custom_data:JSON.stringify(json[value])}, lists);
        });
        if(keys.length)
            lists.onchange();
    }
    this.load_Ip_lists	= function(json){
        this.Id("select_Div").innerHTML	= '';
        var machine_lists = [{'IP':'172.16.20.163', 'CGI_IP':"172.16.20.45",  'IMG_IP':"172.16.20.45"},
                             {'IP':'172.16.20.163', 'CGI_IP':'172.16.20.133', 'IMG_IP':'172.16.20.133'}, 
                             {'IP':'172.16.20.163', 'CGI_IP':'172.16.20.136', 'IMG_IP':'172.16.20.136'},
                             {'IP':'172.16.20.163', 'CGI_IP':'172.16.20.137', 'IMG_IP':'172.16.20.137'},
                             {'IP':'172.16.20.163', 'CGI_IP':'172.16.20.138', 'IMG_IP':'172.16.20.138'},
                             {'IP':'172.16.20.163', 'CGI_IP':'172.16.20.139', 'IMG_IP':'172.16.20.139'},
                             {'IP':'172.16.20.163', 'CGI_IP':'172.16.20.251', 'IMG_IP':'172.16.20.251'},
                             {'IP':'172.16.20.163', 'CGI_IP':'172.16.20.241', 'IMG_IP':'172.16.20.241'},
                             {'IP':'172.16.20.163', 'CGI_IP':'172.16.20.242', 'IMG_IP':'172.16.20.242'},
                             {'IP':'172.16.20.163', 'CGI_IP':'172.16.20.163', 'IMG_IP':'172.16.20.163'}];
        var table	= this.Id("doc_master_tableA");
        table.innerHTML	= '';
        var header	= this.create_row_and_cols(table, "th", {class:"table_header"},["No.", "host","Machine ID", "Process"]);
        header.cells[0].setAttribute('width','5%');
        header.cells[1].setAttribute('width','80%');
        header.cells[2].setAttribute('width','10%');
        header.cells[3].setAttribute('width','5%');

        header.className = 'table-header-row';
        machine_lists.forEach(function(arr, index){
            var row	= TASApp.URL.create_row_and_cols(table, "td", {class:"table_cells"},[(index + 1), arr['CGI_IP'], (index + 1) ,'<img src="images/process.png" width="20" height="20" class="load_url" />']);
            row.setAttribute('custom_data', JSON.stringify(arr));
            row.onclick	= function(e){
                TASApp.URL.ip_row_select(this,e);
            }
        });
        this.hide_process_bar();
    }

    this.load_url_lists	= function(lists){
        var json	= JSON.parse(lists.options[lists.selectedIndex].getAttribute("custom_data"));
        var table	= this.Id("doc_master_tableA");
        table.innerHTML	= '';
        var url_lists	= json['url_info'];
        var header	= this.create_row_and_cols(table, "th", {class:"table_header"},["No.","Date", "Agent ID","URL ID","Base Urls","Final Urls","Process","Delete"]);
        header.cells[0].setAttribute('width','5%');
        header.cells[1].setAttribute('width','15%');
        header.cells[2].setAttribute('width','5%');
        header.cells[3].setAttribute('width','5%');
        header.cells[4].setAttribute('width','30%');
        header.cells[5].setAttribute('width','30%');
        header.cells[6].setAttribute('width','5%');
        header.cells[7].setAttribute('width','5%');

        header.className = 'table-header-row';
        url_lists.forEach(function(arr, index){
            var json_data	= {batch_id:json['batch_id'], url_info:arr};
            var row	= TASApp.URL.create_row_and_cols(table, "td", {class:"table_cells"},[(index + 1),arr['adate'], arr['agent_id'],arr['url_id'],TASApp.URL.get_mgnt_pages(arr['url_name'], arr['mgmt_pages']),TASApp.URL.get_mgnt_pages(arr['home_page'], arr['mgmt_pages'], true,arr['url_status']),'<img src="images/process.png" width="20" height="20" class="load_url" />','<img class="remove-url" src="images/delete_x.png" width="20" height="20" />']);
            row.setAttribute('custom_data', JSON.stringify(json_data));
            row.onclick	= function(e){
                TASApp.URL.url_row_select(this,e);
            }
        });
        this.hide_process_bar();
    }
    this.get_mgnt_pages = function(url, mgnt, tas_url, url_status){
        var mgnt_urls		= ( mgnt.length)?"disc-list":''
        url_status		= (url_status == 'Y')?'<img style="float:right" src="images/tick1.png" width="20" height="20" />':'';
        var float_list		= 'float:left;';
        if(tas_url == true && url){
                var home_url    = '<ul style="float:left;width:100%"><li class="home-url '+mgnt_urls+'" style="width:100%">'+'<div style="float:left;;width: 70%;overflow: hidden;height: 25px;text-overflow: ellipsis;white-space: nowrap;">'+url.slice(0,20)+'</div>'+url_status;
            float_list	= 'float:left;';
        }else
                var home_url    = '<ul style="float:left;width:100%;"><li class="home-url '+mgnt_urls+'" style="width:100%"><div style="float:left;;width: 90%;overflow: hidden;height: 16px;text-overflow: ellipsis;white-space: nowrap;">'+url.slice(0,20)+'</div>';
            var final_str   = '';
            mgnt.forEach(function(value, index){
            var mgnt_id	= (value['mgmt_id'])?value['mgmt_id']:(index +1);
            var review_img	= '<img src="images/review.png" style="float:right;margin-right:3px;" width="20" height="20" doc_id="'+value['doc_id']+'" mgnt_id="'+mgnt_id+'" class="review-mgnt" />' 
            var flag_green	= '<img src="images/icon_green.png" style="float:right;margin-right:3px;" width="20" height="20" />';
            var flag_red	= '<img src="images/icon_red.png" style="float:right;margin-right:3px;" width="20" height="20" />';
            var edit        = '<img src="images/edit_icon.png" style="float:right;margin-right:3px;" width="20" height="20" class="edit-mgnt" doc_id="'+value['doc_id']+'" mgnt_id="'+mgnt_id+'" />';
            edit		= '';
            var review	=review_img+flag_red;// (value['mgmt_status'] == 'Y' && value['feedback_status'] == "Done")?(review_img+flag_green):(value['mgmt_status'] == 'Y' && value['feedback_status'] == "Not Done")?(review_img+flag_red):(edit+flag_red);
            var mgnt_id_sl_no     = (value['mgmt_id'])?value['mgmt_id']:'';
                final_str   += '<li style="height:26px"><div style="float:left;width: 70%;overflow: hidden;">'+mgnt_id_sl_no+" . "+value['url']+'</div><img style="float:right" class="remove-mgnt" doc_id="'+value['doc_id']+'" src="images/delete_x.png" width="20" height="20" />'+review+'</li>';
            });
            if(final_str != '')
                     final_str      = '<ul class="sub-lists hide" style="'+float_list+'">'+final_str+'</ul>'; 
            home_url        += final_str+'</li></ul>'; 
            return home_url;
    }
    this.ip_row_select	= function(row, ent){
        try{
            var active_elm = document.getElementsByClassName("active_row")[0]
            active_elm.className = ""
            var sub_lists = active_elm.getElementsByClassName("sub-lists show");
            if(sub_lists.length){
                sub_lists[0].className  = 'sub-lists hide';
            }
        }catch(e){}

        row.className	= "active_row";
        var json_data	= JSON.parse(row.getAttribute("custom_data"));
        var class_name	= ent.target.className;
        var list_element	= (ent.target.nodeType == 3)?ent.target.parentNode:ent.target;
        switch(true){
            case /load_url/.test(class_name):
                this.load_new_ip(json_data);
            break;
        }
    }

    this.url_row_select	= function(row, ent){
        try{
            var active_elm = document.getElementsByClassName("active_row")[0]
            active_elm.className = ""
            var sub_lists = active_elm.getElementsByClassName("sub-lists show");
            if(sub_lists.length){
                sub_lists[0].className  = 'sub-lists hide';
            }
        }catch(e){}

        row.className	= "active_row";
        var json_data	= JSON.parse(row.getAttribute("custom_data"));
        var class_name	= ent.target.className;
        var list_element	= (ent.target.nodeType == 3)?ent.target.parentNode:ent.target;
        switch(true){
            case /home-url/.test(class_name) || /home-url/.test(list_element.parentNode.className):
                var list_element	= (/home-url/.test(list_element.parentNode.className))?list_element.parentNode:list_element;
                var sub_lists = list_element.getElementsByClassName("sub-lists");
                if(sub_lists.length){
                    sub_lists[0].className	= (/hide/.test(sub_lists[0].className))?'sub-lists show':'sub-lists hide';
                }
            break;
            case /load_url/.test(class_name):
                //this.load_new_url(json_data);
            break;
            case /remove-url/.test(class_name):
                //this.delete_url(row, json_data);
            break;
            case /remove-mgnt/.test(class_name):
                //this.delete_mgnt_url(row,ent.target.getAttribute("doc_id"), json_data);
            break;
            case /review-mgnt/.test(class_name):
                this.load_mgnt_review(row,ent.target.getAttribute("doc_id"), json_data, ent.target.getAttribute("mgnt_id"));
            break;
            case /edit-mgnt/.test(class_name):
                this.load_mgnt_edit(row,ent.target.getAttribute("doc_id"), json_data, ent.target.getAttribute("mgnt_id"));
                break;
        }
        
    }
    this.load_new_ip = function(json){
        TASApp.config.IPNo = json.CGI_IP;
        TASApp.config.IP = sessionStorage['IP'] = "http://"+json.IP+"/";
        TASApp.config.IMG_IP = sessionStorage['IMG_IP'] = "http://"+json.IMG_IP+"/";
        TASApp.config.CGI_IP = sessionStorage['CGI_IP'] = "http://"+json.CGI_IP+"/";
        TASApp.UserLoginAction.Go_To_Mgmt();
    }
    this.load_mgnt_review	= function(row, doc_id, json_data, mgnt_id){ 
        TASApp.gbl.mdoc_id	= doc_id;//json_data['url_info']['home_doc_id'];
        TASApp.gbl.agent_id	= json_data['url_info']['agent_id'];
        TASApp.gbl.url_id	= json_data['url_info']['url_id'];
        this.Logger.push("Agent id ==== "+TASApp.gbl.agent_id+" === "+TASApp.gbl.main_doc_id+" === "+mgnt_id);
        TASApp.gbl.mgmt_id	= mgnt_id;
        sessionStorage['mdoc_id'] = doc_id;
        sessionStorage['agent_id'] = json_data['url_info']['agent_id'];
        sessionStorage['url_id'] = json_data['url_info']['url_id'];
        sessionStorage['mgmt_id'] = mgnt_id;
        sessionStorage['tab_no'] = 2;
        this.load_doc_pw_ph();
    }
    this.load_doc_pw_ph = function(){ 
        var json	= {project_id:TASApp.gbl.project_id, user_id:TASApp.gbl.user_id, agent_id:TASApp.gbl.agent_id, mgmt_id:Number(TASApp.gbl.mgmt_id), url_id:TASApp.gbl.url_id};
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + 'create_sh_file/cgi_get_doc_pw_ph.py?input_str=';
	    vservice_path		+= JSON.stringify(json);
	    this.Logger.push("Doc map CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1, "TASApp.URL.assign_doc_pw_ph(json)" , "GET", true);
    }
    this.assign_doc_pw_ph = function(doc_dict){ 
        TASApp.gbl.DOC_MAP_PW_PH = JSON.parse(JSON.stringify(doc_dict)); //alert(TASApp.gbl.DOC_MAP_PW_PH[4016][0]);
        this.Logger.push('DOC_MAP : '+JSON.stringify(doc_dict));
        sessionStorage['DOC_MAP_PW_PH'] = JSON.stringify(doc_dict);
        this.loadTab();
    }
    this.loadTab = function(){
    	window.location.href = 'tabs.html';
    }
}).apply(URL.prototype);
TASApp.URL = new URL();
