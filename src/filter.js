Filter_validation_one = null;
Filter_duplication = null;
Filter_reclassification = null;
Units_duplication = null;
function Filter_Level_One(){
	Utils.call(this);
	this.profile_grid	= 48;
	this.trained_grid 	= 14;
	this.mark_grid 	= 15;
	this.taxo_grid 	= 25;
    this.id = 'filter-sub-tab';
    this.selected_div_json = {};
    this.selected_div_json_crop = {};
    this.classify_taxonomy = {};
    this.color_group_type = ['#ff0000', '#0000ff'];
    this.gbl_sort_data = ["Default", "Sort By ProfileId"];
    //this.gbl_sort_data = ["Sort By Key Value", "Sort By Description", "Sort By Header", "Sort By ProfileId"];
    this.gbl_action_lst = ['SPLIT-SIMILAR', 'SPLIT-FIXED', 'MERGE-SIMILAR', 'MERGE-FIXED'];
    this.gbl_delimiter_lst = ["'", '"', '*', ':', '=', ';', '.', ',', '(', ')', '[', ']', ' '];
    this.sort_index = 0;
    this.selected_action = "";
    this.selected_delimiter = "";
    this.gbl_selected_level_id = "";
    this.selected_group_type_idx = "";
    this.trained_grid_height_new = "";
    this.process_type = 0;
    this.gbl_deleted_doc_ids = [];
    this.gbl_sign_level_dict = {};
    this.cgi_script_file_name = "webintf/cgi_web_extract_lmdb.py";
    this.gbl_meta_data = {project_id:TASApp.gbl.project_id, user_id:TASApp.gbl.user_id, agent_id:TASApp.gbl.agent_id, mgmt_id:Number(TASApp.gbl.mgmt_id), url_id:Number(TASApp.gbl.url_id)};
    TASApp.config.IMAGE_IP = TASApp.config.CGI_IP;
    this.selected_profile_document_active = "";
    this.selected_profile_document_active_className = "";
    this.selected_tab_one_flag = "fTbs_2";
    this.selected_tab_two_flag = "kve_cleared_tab_id";
    this.load_data_status = false;
}
Filter_Level_One.prototype		= new Utils();
Filter_Level_One.prototype.constructor	= Filter_Level_One;
(function(){
    this.active_filter = function(){
        this.active_first_level_filter();
    }
   	/**
	 * Description
	 * @method make_layout
	 * @return 
	 */
	this.make_layout	= function(){
		TASApp.gbl.canvas_data	= [];
        document.body.setAttribute("onkeyup", "TASApp.gbl.search_tab.getKeyStatus(event)");
		var content_window      = this.Id('left_section'); //main_container3');
		var rect        = content_window.getBoundingClientRect();
		var height = (rect.bottom - rect.top);
		var total_h	= height	-  parseInt(TASApp.gbl.tab) - parseInt(TASApp.gbl.tab_menu) - parseInt(TASApp.gbl.footer) - parseInt(TASApp.gbl.crop_tool);
        	this.profile_height                             = total_h * (this.profile_grid/100);
		this.trained_grid_height		                = total_h * (this.trained_grid/100); 
		this.url_height		                            = total_h * (this.mark_grid/100); 
		this.url_element_height		                    = total_h * (this.taxo_grid/100); 
		this.Id("profile_top_header_1_home").style.height	= total_h * (this.profile_grid/100) +"px";
		this.Id("url_content_1_home").style.height		    = this.trained_grid_height + this.url_height + this.url_element_height+"px";
       	this.Id('tab_menu_header').style.display                = "";
		this.Id('profile_div').innerHTML			            = '';
       	this.Id('profile_div').style.height                  = "100%";
       	this.Id('url_content_1_home').innerHTML = "";
        this.Id("filter_level_Con_Div").innerHTML = "";
	}
    this.merge_json = function(attr_json){
        var json   = JSON.parse(JSON.stringify(this.gbl_meta_data));
        for (var key in attr_json){
            json[key] = attr_json[key];
        }
        return json
    }
    this.delete_profiles = function(elem){
        var r=confirm("Do you want To Delete the selected Page Filter Group ");
	    if (r==true) {
            if (this.process_type == 2){
                this.cgi_multi_delete_group();
            }
            else{
                this.cgi_delete_group();
            }
        }else
            return;
    }
    this.cgi_multi_delete_group = function(){
        var tmp_doc_ids = [], inputElms = this.Id("kve_table_prof").querySelectorAll('input[name="profile_action"]:checked'); 
        this.gbl_deleted_doc_ids = [];
        for (var i=0; i<inputElms.length; i++){
            tmp_doc_ids = JSON.parse(inputElms[i].parentNode.getAttribute('doc_ids'));
            this.gbl_deleted_doc_ids = this.gbl_deleted_doc_ids.concat(tmp_doc_ids);
            this.Id("kve_table_prof").removeChild(inputElms[i].parentNode.parentNode.parentNode);
        } 
    }

    this.cgi_delete_group = function(){
        this.show_process_bar();
        var signJson = this.get_sign_info();
        var json	= this.merge_json({cmd_id:115, doc_id:this.gbl_doc_id, taxo_id:this.selected_parent_taxo_id, taxo_name:this.selected_parent_taxo_name, sysgrptype:this.selected_group_type_idx, sigconfig:signJson});
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
		vservice_path	    += JSON.stringify(json);
		this.Logger.push("DELETE PAGE FILTER GR CGI... "+vservice_path+" === ");
   		this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.reset_profile_after_delete(json)" , "GET", true);
    }
    
    this.reset_profile_after_delete = function(data){
        this.hide_process_bar();
        this.sort_by();
        this.cgi_fill_kve_trained_index_table();
    }

    this.add_populate_data = function(){
        this.Id('footerDiv').innerHTML = "";
       	this.createDOM("span", {class:"footSpan", style:"float:right;margin-left:0px;", txt:"SaveTopicUnits", id:'kve_populate_taxonomy', onclick:"TASApp.gbl.search_tab.populate_taxonomy(this)"}, this.Id('footerDiv'));
        //this.createDOM("input",{name:"select_for_doc", type:"checkbox", style:"margin:0px 1px; vertical-align:middle;float:right;", onchange:"TASApp.gbl.search_tab.select_all_level_id(this)"}, this.Id('footerDiv'));
        this.createDOM("input",{id:"kve_doc_id_wise_save", name:"select_for_doc", type:"checkbox", style:"float:right; margin-top:7px;", checked:"true", onchange:"TASApp.gbl.search_tab.select_all_level_id(this)"}, this.Id('footerDiv'));
        this.add_level_drop_down();
        
    }
    this.add_level_drop_down = function(){
        var json	= this.merge_json({cmd_id:123});
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
		vservice_path      += JSON.stringify(json);
	 	this.Logger.push("Level Id Cgi... "+vservice_path+" === ");
   		this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.show_level_info(json)" , "GET", true);
    }
    this.show_level_info = function(data){
        var select_elm = this.createDOM('select', {id:"kve_level_id_drop_down", style:"width: 105px;float:left;border:1px solid #dedede;height:18px;background:none;color:#fff; margin:5px 0px;float:right;"}, this.Id('footerDiv'));
        this.createDOM('option', {txt:"Select Level"}, select_elm);
        for (var i=0; i<data.length; i++){
            this.createDOM('option', {level_id:data[i], txt:"LEVEL "+data[i], onclick:"TASApp.gbl.search_tab.kve_select_level(this);"}, select_elm);
        }
       	//this.createDOM("span", {class:"footSpan", style:"float:right;margin-left:0px;margin-right:2px;", txt:"LoadGroups", id:'kve_save_filter_data', onclick:"TASApp.gbl.search_tab.save_filter_data(this)"}, this.Id('footerDiv'));
        this.createDOM("img", {id:"filter_one_sign_post_map_status", src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/icon_red.png", style:"float:left;margin:4.5px 0px;", alt:"OK"}, this.Id('footerDiv'));
       	this.createDOM("span", {class:"footSpan", style:"float:left;margin-left:0px;", txt:"LoadPostMap", id:'kve_load_post_mapdata', onclick:"TASApp.gbl.search_tab.LoadPostMap_data(this)"}, this.Id('footerDiv'));
    }
    this.LoadPostMap_data = function(elem){
        /*
        var all_h = this.Id('tab_menu_header').getElementsByTagName('LI');
        for(var i=0;i<all_h.length;i++){
           all_h[i].style.color = "#FFFFFF";
        }
	    this.Id('kve_load_post_mapdata').style.color = "#f60";
        try{this.Id('kv_filter_new').querySelector(".tab_menu_active").className	= '';}catch(e){}
	    this.Id('kve_load_post_mapdata').className	= "tab_menu_active";
        */
        var r=confirm("Do you want to load post map..");
	    if (r==true) {
            this.show_process_bar();
            //this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("url_content_1_home"));
            var json	= this.merge_json({cmd_id:181});
		    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
		    vservice_path      += JSON.stringify(json);
	 	    this.Logger.push("LoadPostMap Cgi... "+vservice_path+" === ");
   		    this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.finish_LoadPostMap(json)" , "GET", true);
        }else{
            return;
        }

    }
    this.finish_LoadPostMap = function(data){
        this.hide_process_bar();
        this.active_first_level_filter();
    }
    this.kve_select_level = function(elem){
        var level_id = elem.getAttribute('level_id');
        this.gbl_selected_level_id = level_id;
    }
    this.save_filter_data = function(elem){
        var r=confirm("Do you want to save the selected group ");
	    if (r==true) {
            this.show_process_bar();
            var json	= this.merge_json({cmd_id:121});
		    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
		    vservice_path      += JSON.stringify(json);
	 	    this.Logger.push("Save filter... "+vservice_path+" === ");
   		    this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.ret_save_filter_data(json)" , "GET", true);
        }else
            return;
    }
    this.populate_taxonomy = function(elem){
        var r=confirm("Do you want to populate the selected group ");
	    if (r==true) {
            var inputElms = this.Id("kve_tained_table_prof_inner").querySelectorAll('input[name="filter_taxo_key"]:checked')
            var taxo_id, taxo_name;
            var data = [];
            for (var i=0; i<inputElms.length; i++){
                taxo_id = inputElms[i].getAttribute('taxo_id'); 
                taxo_name = inputElms[i].getAttribute('taxo_name'); 
                data.push({taxo_id:taxo_id, taxo_name:taxo_name})
            }
            this.show_process_bar();
            if (this.Id("kve_doc_id_wise_save").checked){
                var json	= this.merge_json({cmd_id:122, save_data:data, level_id:this.gbl_selected_level_id});
            }else{
                var json	= this.merge_json({cmd_id:122, save_data:data, level_id:this.gbl_selected_level_id, doc_id:this.gbl_doc_id});
            }
		    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?';
		    var post_data		= "input_str=" + JSON.stringify(json);
	 	    this.Logger.push("Save Populate... "+vservice_path+post_data+" === ");
   		    this.send_ajax_request(vservice_path, post_data, 1, "TASApp.gbl.search_tab.save_data_populate(json)" , "POST", true);
        }else
            return;
    }
    this.ret_save_filter_data = function(data){
        this.hide_process_bar();
    }
    this.save_data_populate = function(data){
        this.gbl_selected_level_id = "";
        this.Id("kve_level_id_drop_down").selectedIndex = 0;
        var inputElms = this.Id("kve_tained_table_prof_inner").querySelectorAll('input[name="filter_taxo_key"]:checked')
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
        }
        this.hide_process_bar();
    }
    this.add_crop_tool_elems	= function(){
        if (this.Id('dynamic_drop_down')){
            this.Id('dynamic_drop_down').parentNode.removeChild(this.Id('dynamic_drop_down'));
        }
	this.Id("crop_tool_header").style.display			= "block";
	var crop_tool	= this.Id('crop_tool_header');
       	crop_tool.innerHTML		= '';
       	this.createDOM("span", {class:"review-span", style:"float:left;", txt:"Delete", id:'del-multi', onclick:"TASApp.gbl.search_tab.delete_profiles()"}, crop_tool);
        this.createDOM("div", {style:"float:left;", id:"kve_sort_by_menu"}, crop_tool);
        this.createDOM("div", {style:"float:left;", id:"kve_action_list_menu"}, crop_tool);
        //this.createDOM("label", {class:"review-span", for:"omark", style:"margin:0px 1px; vertical-align:middle;", txt:"remark" }, crop_tool);
        //this.createDOM("input",{id:"omark",   name:"taxomark", value: "omark", type:"radio",  style:"margin:0px 2px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.get_crop_coordinates(this)"}, crop_tool);
        //this.createDOM("span", {class:"review-span", style:"float:left;", txt:"Configure", id:'kve_signature_type_drop_down', onclick:"TASApp.gbl.search_tab.configure_signature(this)"}, crop_tool);
        var imgdiv = this.createDOM("div", {style:"float:left;"}, crop_tool);
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/setting_black.png", alt:"Configure", id:'kve_signature_type_drop_down', onclick:"TASApp.gbl.search_tab.configure_signature(this)"}, imgdiv);
       	this.createDOM("span", {class:"review-span", style:"float:right;padding-left: 20px;", txt:"Reload", id:'kve_reload_tab', onclick:"TASApp.gbl.search_tab.reload_index_data(this)"}, crop_tool);
       	this.createDOM("span", {class:"review-span", style:"float:right;padding-left: 20px;display:none;", txt:"Save", id:'kve_save_tab', onclick:"TASApp.gbl.search_tab.save_index_data(this)"}, crop_tool);
       	this.createDOM("span", {class:"review-span", style:"float:right;padding-left: 5px;display:none;", txt:"LocalApply", id:'kve_local_apply_tab', onclick:"TASApp.gbl.search_tab.apply_index_data(this)"}, crop_tool);
       	this.createDOM("span", {class:"review-span", style:"float:right;padding-left: 5px;display:none;", txt:"GlobalApply", id:'kve_global_apply_tab', onclick:"TASApp.gbl.search_tab.apply_index_data(this)"}, crop_tool);
       	this.createDOM("span", {class:"review-span", style:"float:right;padding-left: 20px;display:none;", txt:"Agree", id:'kve_apply_agree_tab', onclick:"TASApp.gbl.search_tab.show_applied_data(this)"}, crop_tool);
       	this.createDOM("span", {class:"review-span", style:"float:right;padding-left: 10px;display:none;", txt:"clear", id:'kve_clear_tab', onclick:"TASApp.gbl.search_tab.clear_canvas_data(this)"}, crop_tool);
    }
    this.show_signature_taxo = function(elem){
            elem.innerHTML = "";
            var select_elm = this.createDOM('select', {style:"width: 120px;"}, elem);
            this.load_classified_taxo_info(select_elm)
    }
    this.load_option = function(elem){
        elem.onchange = function(){
            var elm = this.Id('dynamic_drop_down').querySelector('[name="default_action"]')
            elm.checked = false;
            if ((this.getAttribute('name') == 'before_action') && (this.getAttribute('ttype') != 'TAXONOMY')){
                this.Id("before_sign_taxo").selectedIndex = 0;
                this.Id("before_sign_taxo").disabled=true;
            }
            else if ((this.getAttribute('name') == 'after_action') && (this.getAttribute('ttype') != 'TAXONOMY')){
                this.Id("after_sign_taxo").selectedIndex = 0;
                this.Id("after_sign_taxo").disabled=true;
            }
        }
    }
    this.reset_option = function(elem){
        elem.onchange = function(){
            if (this.checked){
                //this.Id("before_sign_taxo").selectedIndex = 0;
                //this.Id("before_sign_taxo").disabled=true;
                //this.Id("after_sign_taxo").selectedIndex = 0;
                //this.Id("after_sign_taxo").disabled=true;
                this.Id("kve_select_all_level_id").checked = false;
                this.Id("kve_select_all_level_id").click();
                this.Id("key_complete_action_id").click();
                /*
                var elms = this.Id('dynamic_drop_down').querySelectorAll('[default_action="true"]')
                for (var i=0, len=elms.length; i<len; i++){
                    elms[i].checked = true;
                }*/
            }
        }
    }
    this.close_popup = function(){
        this.Id('dynamic_drop_down').style.display = "none";
        this.Id('kve_signature_type_drop_down').setAttribute('dis_status', 'N');
    }
    this.configure_signature = function(elem){
        var dis_status = elem.getAttribute('dis_status');
        if (dis_status == 'Y'){
            this.Id('dynamic_drop_down').style.display = "none";
            elem.setAttribute('dis_status', 'N');
        }else{
            elem.style.display = "block";
            elem.setAttribute('dis_status', 'Y');
            if (this.Id('dynamic_drop_down')){
                this.Id('dynamic_drop_down').style.display = "block";
                return;
            }
            var height =  this.trained_grid_height + this.url_height + this.url_element_height + 32;
            var pos = this.get_absolute_pos(this.Id('crop_tool_header'));
            var pos1 = this.get_absolute_pos(this.Id('main_container3'));
            var top_pos = pos[1];//parseInt(this.getstyle(elem, "top"));
            var left_pos = pos[0];//parseInt(this.getstyle(elem, "left"));
            var height = (top_pos - pos1[1]);
            //var drop_down  = this.createDOM('div',{id:'dynamic_drop_down', style:'position:absolute; width:98%; height:'+height+'px;background:#E1E1E1; box-shadow:2px 2px 4px 0px; padding:1px; font-size:12px;border:2px solid #ff0000;z-index:9999999;'}, document.getElementsByTagName('body')[0]); 
            var drop_down  = this.createDOM('div',{id:'dynamic_drop_down', style:'position:absolute; width:30%; height:'+height+'px;background:#FFFFFF; box-shadow:1px 1px 2px 0px; padding:0px; font-size:11px;z-index:9999999;'}, document.getElementsByTagName('body')[0]);
            drop_down.style.top = 48+"px";
            drop_down.style.left = (left_pos+1) +"px";
            var div = this.createDOM('div',{style:"background:#3c6570;height:25px;width:100%;"}, drop_down);
            this.createDOM('Span', {txt:'Configure', style:"padding-top:4px;padding-left:3px;color:#ffffff; font-size: 13px; font-weight: bold; float:left;"}, div)
            this.createDOM('img', {src:'icons/close_grey.png', style:"width:14px; height:14px; padding:5px;float:right;", onclick:"TASApp.gbl.search_tab.close_popup()"}, div)
            var div = this.createDOM('div',{style:"width:100%;overflow:auto;height:"+(height-25)+"px"}, drop_down);
            //var table = this.createDOM('table',{width:"100%" , height:(height-25)+"px"}, div);
            var table = this.createDOM('table',{width:"100%" ,}, div);

            var input, row = this.get_table_row(table, {style:"border-bottom:1px solid #3B3A3A;"}, 'td', [{txt:"", width:"70%", style:"text-align: left;"}, {txt:"Default", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"default_action",  type:"checkbox", style:"vertical-align:middle;", checked:true}, row.cells[2]);
            this.reset_option(input);
            /* //pravat
            var input, row = this.get_table_row(table, {}, 'td', [{txt:"Contains", width:"70%", style:"text-align: left;padding-left:5px;"}, {txt:"Structure", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"contain_action",  type:"radio", default_action:true, ttype:"VALUE", style:"vertical-align:middle;", checked:true}, row.cells[2]);
            this.load_option(input);
            row = this.get_table_row(table, {style:"border-bottom:1px solid #3B3A3A;"}, 'td', [{width:"70%"}, {txt:"Partial Structure", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"contain_action",  type:"radio", ttype:"PARTIAL_VALUE", style:"vertical-align:middle;"}, row.cells[2]);
            this.load_option(input);
            */ //pravat
            /*
            row = this.get_table_row(table, {}, 'td', [{width:"70%"}, {txt:"Content", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"contain_action",  type:"radio", ttype:"KEY", style:"vertical-align:middle;"}, row.cells[2]);
            this.load_option(input);
            row = this.get_table_row(table, {}, 'td', [{width:"70%"}, {txt:"Mixed", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"contain_action",  type:"radio", ttype:"MULTI", style:"vertical-align:middle;"}, row.cells[2]);
            this.load_option(input);
            row = this.get_table_row(table, {style:"border-bottom:1px solid #3B3A3A;"}, 'td', [{width:"70%"}, {txt:"Single", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"contain_action",  type:"radio", style:"vertical-align:middle;", ttype:"SINGLE"}, row.cells[2]);
            this.load_option(input);
            */

            /* //pravat
            row = this.get_table_row(table, {}, 'td', [{txt:"Before", width:"70%", style:"text-align: left;padding-left:5px;"}, {txt:"Structure", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"before_action",  type:"radio", style:"vertical-align:middle;", default_action:true, ttype:"VALUE", checked:true}, row.cells[2]);
            this.load_option(input);
            row = this.get_table_row(table, {}, 'td', [{width:"70%"}, {txt:"Content", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"before_action",  type:"radio", style:"vertical-align:middle;", ttype:"KEY"}, row.cells[2]);
            this.load_option(input);
            row = this.get_table_row(table, {}, 'td', [{width:"70%"}, {width:"20%"}, {}])
            this.createDOM("input", {name:"before_action",  type:"radio", gid:"before_sign_taxo", ttype:"TAXONOMY", style:"vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_taxo_action_sign(this)"}, row.cells[2]);
            var select_elm = this.createDOM('select', {style:"width: 120px;", id:"before_sign_taxo", disabled:true}, row.cells[1]);
            row = this.get_table_row(table, {style:"border-bottom:1px solid #3B3A3A;"}, 'td', [{width:"70%"}, {txt:"None", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"before_action",  type:"radio", style:"vertical-align:middle;", ttype:"NONE"}, row.cells[2]);

            this.load_option(input);



            row = this.get_table_row(table, {}, 'td', [{txt:"After", width:"70%", style:"text-align: left;padding-left:5px;"}, {txt:"Structure", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"after_action",  type:"radio", style:"vertical-align:middle;", ttype:"VALUE"}, row.cells[2]);
             this.load_option(input);
            row = this.get_table_row(table, {}, 'td', [{width:"70%"}, {txt:"Content", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"after_action",  type:"radio", style:"vertical-align:middle;", default_action:true, checked:true, ttype:"KEY"}, row.cells[2]);
            this.load_option(input);
            row = this.get_table_row(table, {}, 'td', [{width:"70%"}, {width:"20%"}, {}])
            this.createDOM("input", {name:"after_action",  type:"radio", gid:"after_sign_taxo", style:"vertical-align:middle;", ttype:"TAXONOMY", onchange:"TASApp.gbl.search_tab.select_taxo_action_sign(this)"}, row.cells[2]);
            var select_elm = this.createDOM('select', {style:"width: 120px;", id:"after_sign_taxo", disabled:true}, row.cells[1]);
            row = this.get_table_row(table, {style:"border-bottom:1px solid #3B3A3A;"}, 'td', [{width:"70%"}, {txt:"None", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"after_action",  type:"radio", style:"vertical-align:middle;", ttype:"NONE"}, row.cells[2]);
            this.load_option(input);
            //this.Logger.push('HTML : '+dynamic_drop_down.outerHTML);
            
            row = this.get_table_row(table, {}, 'td', [{txt:"Key", width:"70%", style:"text-align: left;padding-left:5px;"}, {txt:"Partial", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"key_action",  type:"radio", style:"vertical-align:middle;", ttype:"KEY_PARTIAL", onchange:"TASApp.gbl.search_tab.get_selected_content_sign_reset(this)"}, row.cells[2]);
            row = this.get_table_row(table, {}, 'td', [{width:"70%"}, {txt:"Complete", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {id:"key_complete_action_id", name:"key_action",  type:"radio", style:"vertical-align:middle;", checked:true, ttype:"KEY_COMPLETE", onchange:"TASApp.gbl.search_tab.get_selected_content_sign_reset(this)"}, row.cells[2]);
            row = this.get_table_row(table, {style:"border-bottom:1px solid #3B3A3A;"}, 'td', [{width:"70%"}, {width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"key_secific_action", id:"key_content_action_id", type:"text", style:"vertical-align:left; width: 120px;", placeholder:"Specific Text", disabled:true, ttype:"KEY_TEXT"}, row.cells[1]);
            input = this.createDOM("input", {name:"key_action",  type:"radio", style:"vertical-align:middle;", ttype:"KEY_SPECIFIC", onchange:"TASApp.gbl.search_tab.get_selected_content_sign(this)"}, row.cells[2]);
            */ //pravat
            /*
            row = this.get_table_row(table, {}, 'td', [{txt:"Value", width:"70%", style:"text-align: left;padding-left:5px;"}, {width:"20%", style:"text-align: right;"}, {}])
            row = this.get_table_row(table, {style:"border-bottom:1px solid #3B3A3A;"}, 'td', [{width:"70%"}, {width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"value_specific_action",  type:"text", style:"vertical-align:left; width: 120px;", placeholder:"Specific Text", disabled:true, ttype:"VALUE_TEXT"}, row.cells[1]);
            input = this.createDOM("input", {name:"value_action",  type:"radio", style:"vertical-align:middle;", ttype:"VALUE SPECIFIC"}, row.cells[2]);
            */
            row = this.get_table_row(table, {}, 'td', [{txt:"Level", width:"70%", style:"text-align: left;padding-left:5px;"}, {txt:"All", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {id:"kve_select_all_level_id", name:"level_action",  type:"checkbox", style:"vertical-align:middle;", ttype:"ALL LEVEL", onclick:"TASApp.gbl.search_tab.get_selected_all_level_sign(this)"}, row.cells[2]);
            row = this.get_table_row(table, {}, 'td', [{width:"70%"}, {width:"20%", style:"text-align: right;"}, {style:"text-align: left;"}])
            row = this.get_table_row(table, {style:"border-bottom:1px solid #3B3A3A;"}, 'td', [{width:"100%", colspan:3}])
            div = this.createDOM("div", {id:"level_sign_div", style:"height:100px;overflow:auto;"}, row.cells[0]);
            var level_ids = Object.keys(this.gbl_sign_level_dict)
            level_ids.sort();
            var sub_level_ids, li, ul1, ul = this.createDOM("ul", {}, div);
            for (var i=0, len=level_ids.length; i<len; i++){
                sub_level_ids = this.gbl_sign_level_dict[level_ids[i]] 
                li = this.createDOM("li", {txt:level_ids[i]}, ul);
                this.createDOM("input", {name:"level_select",  type:"checkbox", level_id:level_ids[i], onchange:"TASApp.gbl.search_tab.get_selected_level_sign(this)"}, li);
                ul1 = this.createDOM("ul", {}, ul);
                for (var j=0; j<sub_level_ids.length; j++){
                    li = this.createDOM("li", {txt:level_ids[i]+"."+(sub_level_ids[j]+1)}, ul1);
                    this.createDOM("input", {name:"each_level_select",  type:"checkbox", level_id:level_ids[i], sub_level_id:sub_level_ids[j], onchange:"TASApp.gbl.search_tab.get_selected_level_sign_single()"}, li);
                }
            }
            row = this.get_table_row(table, {}, 'td', [{txt:"sig_marked_only", width:"70%", style:"text-align: left;padding-left:5px;"}, {txt:"", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {id:"kve_sig_marked_only", name:"sig_marked_only",  type:"checkbox", style:"vertical-align:middle;"}, row.cells[2]);
            this.Logger.push('LEVEL'+JSON.stringify(this.gbl_sign_level_dict)) 
            this.Logger.push('LEVEL TREE'+this.Id("level_sign_div").outerHTML) 
            this.Id("kve_select_all_level_id").click();
        }
    }
    this.get_selected_content_sign_reset = function(elem){
            this.Id('key_content_action_id').value = "";
            this.Id('key_content_action_id').disabled = true;   
            if (elem.id != 'key_complete_action_id'){
                var elm = this.Id('dynamic_drop_down').querySelector('[name="default_action"]')
                elm.checked = false;
            }
    }
    this.get_selected_content_sign = function(elem){
        this.Id('key_content_action_id').disabled = false;   
        var elm = this.Id('dynamic_drop_down').querySelector('[name="default_action"]')
        elm.checked = false;
    }
    this.get_selected_level_sign = function(elem){
        var sib = elem.parentNode.nextSibling;
        var flg = false, inputElms;
        if (elem.checked){
            inputElms = sib.querySelectorAll('input[name="each_level_select"]:not(:checked)');
            flg = true;
        }
        else{
            inputElms = sib.querySelectorAll('input[name="each_level_select"]:checked');
        }
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = flg;
        } 
    } 
    this.get_selected_all_level_sign = function(elem){
        var flg = false, inputElms;
        if (elem.checked){
            inputElms = this.Id('level_sign_div').querySelectorAll('input[name="level_select"]:not(:checked)');
            flg = true;
        }
        else{
            inputElms = this.Id('level_sign_div').querySelectorAll('input[name="level_select"]:checked');
        }
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = flg;
        } 
        flg = false;
        if (elem.checked){
            inputElms = this.Id('level_sign_div').querySelectorAll('input[name="each_level_select"]:not(:checked)');
            flg = true;
        }
        else{
            inputElms = this.Id('level_sign_div').querySelectorAll('input[name="each_level_select"]:checked');
        }
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = flg;
        } 
    }

    this.select_taxo_action_sign = function(elem){
        if (elem.checked){
            var select_elm = elem.parentNode.previousSibling.firstChild;
            select_elm.disabled=false;
            var exist = this.load_classified_taxo_info(select_elm)
            if (!exist)
                elem.checked = false;
        }
    }
    this.reload_index_data = function(elem){
        var r=confirm("Do you want to reload the selected group");
	    if (r==true) {
            this.cgi_reload_group();
        }else
            return;
    }
    this.cgi_reload_group = function(){
        this.show_process_bar();
        var isSaveKey = 0, key_node = this.Id('kve_tained_table_prof_inner').querySelector('input[name="action_key"]:checked')
        if (!!key_node){
            isSaveKey = 1;
        }
        var signJson = this.get_sign_info();
        var json	= this.merge_json({cmd_id:118, doc_id:this.gbl_doc_id, taxo_id:this.selected_parent_taxo_id, taxo_name:this.selected_parent_taxo_name, sysgrptype:this.selected_group_type_idx, overwrite:1, key_include:isSaveKey, sigconfig:signJson});
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
		vservice_path	    += JSON.stringify(json);
		this.Logger.push("RELOAD PAGE FILTER GR CGI... "+vservice_path+" === ");
   		this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.reset_profile_after_delete(json)" , "GET", true);

    }
    this.apply_index_data = function(elem){
        this.Id('kve_save_tab').style.display = 'none';
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif", style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
        this.Id("kve_prof_tab_menu_content").style.display = 'none';
        this.cgi_apply_index_data(elem);
    }
    this.clear_canvas_data = function(elem){
        var can_div  = this.Id('mg_kdiv_tt');
        if (can_div){
            can_div.parentNode.removeChild(can_div);
            this.Id('kve_remark_tab').className = ''
            this.Id('kve_mark_taxonomy_tab').click();
    	    this.Id("kve_clear_tab").style.display = 'none';

        }
        //this.Id('omark').checked = false;
    } 
    this.apply_agree_index_data = function(){
        this.Id("kve_prof_tab_menu_content").style.display = 'block';
    } 
    this.kve_show_remark_index = function(crop_crods, crop_id, index_type){
        this.selected_action = "SPLIT-SIMILAR";
        this.cgi_apply_index_data = this.apply_index_data_remark;
        this.cmd_id = 11;
        crop_id = crop_id + ":^^:" + this.gbl_doc_id; 
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id] = {};
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].apply = 0;
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].taxo_id = "";
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].taxo_name = "";
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].doc_id = this.gbl_doc_id;
        gr_type = TASApp.gbl.search_tab.selected_div_json_crop[crop_id].modify_key_type = (index_type == 'Key Index')?'KEY':'VALUE';
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].cord = crop_crods;
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].action_type = this.selected_action;
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].delimiter_type = this.selected_delimiter;
        var tindex_type = (index_type == 'Key Index')?'Key':'Value';
        //Panel.browser_window.load_blocks_highlight_dyn(crop_crods, crop_id , '#0000ff');
        table_head_tr = this.get_table_row(this.Id("kve_taxonomy_table"), {id:crop_id, kv_ref_id:crop_id, group_type:2}, "td", [{class:"prof_td", txt:crop_crods, width:"24%", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.kve_highlight_group_dyn(this);"}, {class:"prof_td", txt:tindex_type, width:"50%", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.kve_highlight_group_dyn(this);"}, {class:"prof_td", txt:"", style:"text-align: center; color:#6E9DBF"}]);
        var div = this.createDOM("div", {}, table_head_tr.cells[2]);
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"images/closex.png", width:17+'px', height:17+'px', style:"padding:0px 1px; margin:0px 0px; vertical-align:middle;", onclick:"TASApp.gbl.search_tab.kve_delete_selected_group_dyn(this)"}, div);
	    //this.createDOM("input", {name:"remark_apply_flag", type:"checkbox", style:"float:right;", checked:"true", onchange:"TASApp.gbl.search_tab.update_remark_apply_flag(this)"}, table_head_tr.cells[3]);
        this.selected_delimiter = "";
        //try{this.Id('kve_action_tab_content_table_inner').querySelector("td.Delimeter_action_active").className = 'Delimeter_action';}catch(e){}
        
		var json	= {doc_id:this.gbl_doc_id, cords:[crop_crods], taxo_id_lst:[], prof_id:1, user_id:TASApp.gbl.user_id, agent_id:TASApp.gbl.agent_id, mgmt_id:TASApp.gbl.mgmt_id, group_id:1, pw:"", ph:"", d_cord:"", idx:"", parent_idx:"", idx_key:"", level_id:""};
		TASApp.gbl.canvas_data.push(json)
    }
    this.highlight_cord_in_canvas = function(crop_crods, index_type){
        var can_div = Panel.browser_window.this.Id('mg_kdiv_tt');
        var wnd         = get_content_window();
        content     = wnd;
        var doc     = wnd.document;
        if (!can_div){
            //draw_canvas(doc, data.page_size.h, data.page_size.w); 
            runcanvas_mgnt();
            mdtool_select = 'select';
            create_taxo_tree_extd_kve(doc);
            gbl_prof_id = 'kve';
        }
        this.Id("kve_clear_tab").style.display = 'block';
        var dCordsAll = crop_crods.split('_');
        BoxColor = (index_type == 'KEY')?"#ff0000":"#0000ff";
		addRect(parseInt(dCordsAll[0]), parseInt(dCordsAll[1]), parseInt(dCordsAll[2]),  parseInt(dCordsAll[3]), BoxColor, false, '','','');
		var scrollX = parseInt(dCordsAll[0]);
		var scrollY = parseInt(dCordsAll[1]);
        this.Id("main_div1").scrollTop = scrollY - 50;
        doc.getElementsByTagName("body")[0].scrollTop = scrollY - 50;
        mdtool_select = 'select';
    }
    this.get_crop_coordinates = function(elem){
//	alert('filter')
        //this.show_mark_table();
        this.Id("kve_reload_tab").style.display = 'none';
        this.Id("kve_clear_tab").style.display = 'block';
        this.Id("kve_local_apply_tab").style.display = 'block';
        this.Id("kve_global_apply_tab").style.display = 'block';
        this.Id("kve_apply_agree_tab").style.display = 'none';
        this.Id("kve_save_tab").style.display = 'none';
        //this.add_kve_action_index_table([]);
        //this.Id("kve_action_menu_drop_down").style.display = 'block';
        //this.Id("kve_action_menu_drop_down").firstChild.click();
        
        TASApp.gbl.search_tab.selected_div_json  = {};
        var can_div = this.Id('mg_kdiv_tt');
	    if (can_div){
	        return;
        }
        try{this.Id("kve_taxonomy_header").querySelector("li.active").className = "";}catch(e){}
        elem.className = "active";
        var taxo_table = this.Id("kve_taxonomy_table");
        taxo_table.innerHTML = "";
        row  = this.get_table_row(taxo_table, {group_type:2}, "th", [{class:"taxo_header", style:"text-align: center;"},{class:"taxo_header", style:"text-align: center;"}, {class:"taxo_header", style:"text-align: center;"}]);
        row.cells[0].innerHTML = '<div class="th-inner">Coordinate</div>'        
        row.cells[1].innerHTML = '<div class="th-inner">Index Type</div>'        
        row.cells[2].innerHTML = '<div class="th-inner">Del</div>'        
        this.Id('spliter_close_Y').click();
        //var wnd         = get_content_window();
        //content     = wnd;
        //draw_canvas(doc, data.page_size.h, data.page_size.w); 
        
        TASApp.gbl.search_tab.canvas = new Canvas();
        TASApp.gbl.search_tab.canvas.init(this.Id('filter_level_Con_Div'), document, "filter_level_main_div1", this.save_crop_data, 'group_highlighter');
        TASApp.gbl.search_tab.canvas.runcanvas_mgnt();
        TASApp.gbl.search_tab.canvas.show_taxonomy_tree();
        /*
        runcanvas_mgnt('filter_level_Con_Div');
        mdtool_select = 'group_highlighter';
        var doc     = document;
        //mdtool_select = 'select';
        create_taxo_tree_extd_kve(doc);
        gbl_prof_id = 'kve';*/
    }
    this.save_crop_data = function(){
        var taxo_id = this.data.taxo_id;
        var taxo_name = this.data.taxo_name; 
	    var co_ordi     = this.getSelectedCord();
	    var rect_id     = this.getSelectedCord_undo();
        TASApp.gbl.search_tab.kve_show_remark_index(co_ordi, rect_id, taxo_name);
        //alert("taxo_id : "+taxo_id+"==="+taxo_name);
        this.mdtool_select = "group_highlighter";
        this.hide_popup_div(); 
    }
    this.show_user_actions = function(){
            var div = this.Id("kve_action_list_menu");
            div.innerHTML = "";
            var select_elm = this.createDOM('select', {id:"kve_action_menu_drop_down", style:"width: 120px;display:none;"}, div);
            for(var i = 0; i < this.gbl_action_lst.length; i++){
                this.createDOM('option', {id:this.gbl_action_lst[i], txt:this.gbl_action_lst[i], onclick:"TASApp.gbl.search_tab.kve_select_action(this);"}, select_elm);
            }
            this.Id("kve_action_menu_drop_down").firstChild.click();
    }

    this.sort_by = function(){
            var div = this.Id("kve_sort_by_menu");
            div.innerHTML = "";
            var select_elm = this.createDOM('select', {id:"kve_sort_prof_tab_menu_drop_down", style:"width: 120px;background: none repeat scroll 0px 0px transparent;border: 1px solid #DEDEDE;"}, div);
            for(var i = 0; i < this.gbl_sort_data.length; i++){
                this.createDOM('option', {id:i, txt:this.gbl_sort_data[i], onclick:"TASApp.gbl.search_tab.kve_sort_profile_index_table(this)"}, select_elm);
            }
            //this.Id("kve_sort_prof_tab_menu_drop_down").firstChild.click();
    }
    this.sort_by_old = function(){
            var div = this.Id("kve_sort_by_menu");
            div.innerHTML = "";
            var select_elm = this.createDOM('select', {id:"kve_sort_prof_tab_menu_drop_down"}, div);
            for(var i = 0; i < this.gbl_sort_data.length; i++){
                this.createDOM('option', {id:i, txt:this.gbl_sort_data[i], onclick:"TASApp.gbl.search_tab.kve_sort_profile_index_table(this)"}, select_elm);
            }
            this.Id("kve_sort_prof_tab_menu_drop_down").firstChild.click();
    }

    this.kve_sort_profile_index_table = function(elem){
        this.sort_index = Number(elem.id);
        this.show_profile_table();
    }
    this.save_index_data_remark = function(elem){
        this.process_type = 3;
        this.show_process_bar();
        this.Id("kve_sort_by_menu").style.display = 'block';
        
        elem.style.display = "none";
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:1%;"}, this.Id("kve_prof_tab_menu_content"));
        var listofcords = [];
        for (kk in this.selected_div_json_crop){
            jsonMarkData = {doc_id:this.selected_div_json_crop[kk].doc_id,remark_cords:this.selected_div_json_crop[kk].cord, index_type:this.selected_div_json_crop[kk].modify_key_type.toLowerCase(), action_type:this.selected_div_json_crop[kk].action_type, delimiter_type:this.selected_div_json_crop[kk].delimiter_type, apply:this.selected_div_json_crop[kk].apply}
            listofcords.push(jsonMarkData);
        }
        
        var isSaveKey = 0, key_node = this.Id('kve_tained_table_prof_inner').querySelector('input[name="action_key"]:checked')
        if (!!key_node){
            isSaveKey = 1;
        }
        sig_marked_only = 0
        if (this.Id("kve_sig_marked_only") && this.Id("kve_sig_marked_only").checked){
            sig_marked_only = 1
        }
        var signJson = this.get_sign_info();
        var json	= this.merge_json({cmd_id:108, remark_data:listofcords, taxo_id:this.selected_parent_taxo_id, taxo_name:this.selected_parent_taxo_name, sysgrptype:this.selected_group_type_idx, deleted_doc_ids:this.gbl_deleted_doc_ids, key_include:isSaveKey, sigconfig:signJson, sig_marked_only:sig_marked_only});
        
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?';
		var post_data		= "input_str=" + JSON.stringify(json);
		this.Logger.push("Save Remark CGI... "+vservice_path+post_data+" === ");
   		this.send_ajax_request(vservice_path, post_data, 1, "TASApp.gbl.search_tab.show_save_data_remark(json)" , "POST", true);
    } 


    this.save_index_data_taxonomy = function(elem){
        this.show_process_bar();
        this.Id("kve_sort_by_menu").style.display = 'block';
        
        elem.style.display = "none";
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:1%;"}, this.Id("kve_prof_tab_menu_content"));
        var listofcords = [];
        for (kk in this.selected_div_json_crop){
            jsonMarkData = {doc_id:this.selected_div_json_crop[kk].doc_id,remark_cords:this.selected_div_json_crop[kk].cord, taxo_id:this.selected_div_json_crop[kk].taxo_id, taxo_name:this.selected_div_json_crop[kk].taxo_name, index_type:this.selected_div_json_crop[kk].modify_key_type.toLowerCase()}
            listofcords.push(jsonMarkData);
        }
        
        var isSaveKey = 0, key_node = this.Id('kve_tained_table_prof_inner').querySelector('input[name="action_key"]:checked')
        if (!!key_node){
            isSaveKey = 1;
        }
        var signJson = this.get_sign_info();
        var json	= this.merge_json({cmd_id:107, data:TASApp.gbl.search_tab.selected_div_json, overlay_mark:listofcords, taxo_id:this.selected_parent_taxo_id, taxo_name:this.selected_parent_taxo_name, sysgrptype:this.selected_group_type_idx, key_include:isSaveKey, sigconfig:signJson});
        
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?';
		var post_data		= "input_str=" + JSON.stringify(json);
		this.Logger.push("Save CGI... "+vservice_path+post_data+" === ");
   		this.send_ajax_request(vservice_path, post_data, 1, "TASApp.gbl.search_tab.show_save_data_taxonomy(json)" , "POST", true);
    } 

    this.apply_index_data_remark = function(elem){
            var apply_flag_1 = (elem.id == 'kve_local_apply_tab') ? 1 : 0;
            this.Id('kve_apply_agree_tab').style.display = "none";
            this.Id("kve_local_apply_tab").style.display = 'none';
            this.Id("kve_global_apply_tab").style.display = 'none';
            this.save_index_data = this.save_index_data_remark;
            this.show_process_bar();
 
            this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
            var listofcords = [];
            for (kk in this.selected_div_json_crop){
                this.selected_div_json_crop[kk].apply = apply_flag_1;
                jsonMarkData = {doc_id:this.selected_div_json_crop[kk].doc_id,remark_cords:this.selected_div_json_crop[kk].cord, index_type:this.selected_div_json_crop[kk].modify_key_type.toLowerCase(), action_type:this.selected_div_json_crop[kk].action_type, delimiter_type:this.selected_div_json_crop[kk].delimiter_type, apply:this.selected_div_json_crop[kk].apply}
                listofcords.push(jsonMarkData);
            }
            
            var isSaveKey = 0, key_node = this.Id('kve_tained_table_prof_inner').querySelector('input[name="action_key"]:checked')
            if (!!key_node){
                isSaveKey = 1;
            }
            sig_marked_only = 0
            if (this.Id("kve_sig_marked_only") && this.Id("kve_sig_marked_only").checked){
                sig_marked_only = 1
            }
            this.process_type = 0;
            var signJson = this.get_sign_info();
            this.apply_data    = this.merge_json({cmd_id:105, remark_data:listofcords, taxo_id:this.selected_parent_taxo_id, taxo_name:this.selected_parent_taxo_name, sysgrptype:this.selected_group_type_idx, key_include:isSaveKey, sigconfig:signJson, sig_marked_only:sig_marked_only});

			//var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
			var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?';
			var post_data		= "input_str=" + JSON.stringify(this.apply_data);
			this.Logger.push("Apply Remark CGI... "+vservice_path+post_data+" === ");
       		this.send_ajax_request(vservice_path, post_data, 1, "TASApp.gbl.search_tab.load_applied_data_remark(json)" , "POST", true);
    }
    this.get_sign_info = function(){
            var signJson = {}
            if (this.Id('dynamic_drop_down')){
                /* //pravat
                var el, elm = this.Id('dynamic_drop_down').querySelector('input[name="contain_action"]:checked')
                if (elm){
                    el = elm.getAttribute('ttype')
                        signJson['contains'] = el;
                }
                elm = this.Id('dynamic_drop_down').querySelector('input[name="before_action"]:checked')
                    if (elm){
                        el = elm.getAttribute('ttype')
                            if (el == 'TAXONOMY'){
                                var select_box = elm.parentNode.previousSibling.firstChild;
                                if (select_box.options.length > 1 && select_box.selectedIndex > 0){
                                    signJson['before'] = el;
                                    var option = select_box.options[select_box.selectedIndex];
                                    signJson['btaxoid'] = option.getAttribute('taxo_id');
                                    signJson['btaxoname'] = option.value;
                                }
                            }
                            else{
                                signJson['before'] = el;
                            }
                    }
                elm = this.Id('dynamic_drop_down').querySelector('input[name="after_action"]:checked')
                    if (elm){
                        el = elm.getAttribute('ttype')
                            if (el == 'TAXONOMY'){
                                var select_box = elm.parentNode.previousSibling.firstChild;
                                if (select_box.options.length > 1 && select_box.selectedIndex > 0){
                                    signJson['after'] = el;
                                    var option = select_box.options[select_box.selectedIndex];
                                    signJson['ataxoid'] = option.getAttribute('taxo_id');
                                    signJson['ataxoname'] = option.value;
                                }
                            }
                            else{
                                signJson['after'] = el;
                            }
                    }
                    */ //pravat
                    var level_id, sub_level_id, inputElms = this.Id('level_sign_div').querySelectorAll('input[name="each_level_select"]:checked');
                    signJson['user_level'] = {}
                    signJson['user_level']['ulevels'] = []
                    signJson['user_level']['ulevelid_lst'] = []
                    for (var i=0; i<inputElms.length; i++){
                        level_id = inputElms[i].getAttribute('level_id')
                        sub_level_id = inputElms[i].getAttribute('sub_level_id')
                        signJson['user_level']['ulevels'].push([Number(level_id), Number(sub_level_id)])
                    }
                    /* //pravat 
                    elm = this.Id('dynamic_drop_down').querySelector('input[name="key_action"]:checked');
                    el = elm.getAttribute('ttype')
                    if (el == "KEY_SPECIFIC"){
                        el = this.Id('key_content_action_id').value;
                        signJson['KEY_TEXT'] = el
                    }
                    else{
                        signJson[el] = 1
                    }
                    */ //pravat
            }
            return signJson
    }
    this.cgi_agree_data_remark = function(){
        this.Id("kve_apply_agree_tab").style.display = 'none';
        this.show_process_bar();
        this.apply_data.cmd_id = 106;
        this.process_type = 2;
       	//var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?';
		var post_data		= "input_str=" + JSON.stringify(this.apply_data);
		this.Logger.push("Agree Remark CGI... "+vservice_path+post_data+" === ");
       	this.send_ajax_request(vservice_path, post_data, 1, "TASApp.gbl.search_tab.load_agree_data_remark(json)" , "POST", true);
    }
    this.apply_index_data_taxonomy = function(elem){
            this.Id('kve_apply_agree_tab').style.display = 'block';
            this.Id("kve_local_apply_tab").style.display = 'none';
            this.Id("kve_global_apply_tab").style.display = 'none';
            this.save_index_data = this.save_index_data_taxonomy;
            this.show_process_bar();
            var inputElm = this.Id("kve_taxonomy_table_inner").querySelector('input:checked')
            if (inputElm){
                inputElm.checked = false;
                this.deselect_kv_taxonomy(inputElm);
            }
            this.Id('kve_clear_tab').click(); 
 
            this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
            var listofcords = [];
            for (kk in this.selected_div_json_crop){
                jsonMarkData = {doc_id:this.selected_div_json_crop[kk].doc_id,remark_cords:this.selected_div_json_crop[kk].cord, taxo_id:this.selected_div_json_crop[kk].taxo_id, taxo_name:this.selected_div_json_crop[kk].taxo_name, index_type:this.selected_div_json_crop[kk].modify_key_type.toLowerCase()}
                listofcords.push(jsonMarkData);
            }
            this.Logger.push("DYN : "+JSON.stringify(this.selected_div_json_crop));
            var isSaveKey = 0, key_node = this.Id('kve_tained_table_prof_inner').querySelector('input[name="action_key"]:checked')
            if (!!key_node){
                isSaveKey = 1;
            }
            var json    = this.merge_json({cmd_id:3, data:TASApp.gbl.search_tab.selected_div_json, overlay_mark:listofcords, taxo_id:this.selected_parent_taxo_id, taxo_name:this.selected_parent_taxo_name});

			var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?';
			var post_data		= "input_str=" + JSON.stringify(json);
			this.Logger.push("Apply Taxonomy CGI... "+vservice_path+post_data+" === ");
       		this.send_ajax_request(vservice_path, post_data, 1, "TASApp.gbl.search_tab.load_applied_data_taxonomy(json)" , "POST", true);

    }
    this.init_layout = function(){
        this.add_crop_tool_elems(); 
        this.add_populate_data();
        this.trained_grid_height_new = this.trained_grid_height;
        var profile_div		= this.Id('url_content_1_home');
        profile_div.innerHTML = "";
	    this.createDOM("div",{id:"kve_tab_trained_content", style:"height: "+this.trained_grid_height_new+"px; width:100%; float: left;"}, profile_div);
	    this.createDOM("div",{id:"kve_tab_mark_content", style:"height: "+this.url_height+"px; width:100%; float: left; display:none;"}, profile_div);
	    this.createDOM("div",{id:"kve_tab_taxonomy_content", style:"height: "+this.url_element_height+"px; width:100%; float: left;"}, profile_div);

        var menu        = this.Id('profile_div');
        menu.innerHTML = "";
	    this.createDOM("div",{id:"kve_prof_tab_menu_header1", class:"sb_kveRemainderMainDiv", style:"height: 25px;"}, menu);
        this.createDOM("div",{id:"kve_prof_tab_menu_header", class:"sb_kveRemainderMainDiv", style:"height: 25px;"}, menu);
        this.createDOM("div",{id:"kve_prof_tab_menu_content", style:"height: "+(this.profile_height-25)+"px; width:100%; float: left; overflow: auto; max-height: "+(this.profile_height-25)+"px;"}, menu);
    }
    this.add_kve_trained_index_table    = function(){
        this.trained_grid_height_new = (this.trained_grid_height + this.url_height);
        this.Id("kve_tab_trained_content").style.height = this.trained_grid_height_new+"px";;
        var height = this.trained_grid_height_new-25;
        content_div = this.Id("kve_tab_trained_content");
        //content_div.style.overflow = "auto"
        content_div.style.maxHeight = this.trained_grid_height_new+"px";
        var table = this.createDOM("table",{id:"kve_tained_table_prof", width:"100%"}, content_div);
        var theader = this.get_table_row(table, {}, "th", [{class:"kve_header", width:"2px"},{txt:"TId", class:"kve_header", width:"3px"}, {txt:"Topic", width:"35%", class:"kve_header"}, {txt:"Total", width:"17%", class:"kve_header"}, {txt:"Save Key", width:"16%", class:"kve_header"}, {txt:"Action", class:"kve_header"}])
        this.createDOM("input",{name:"select_all_taxo_keys", type:"checkbox", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_all_taxonomy_for_populate(this)"}, theader.cells[0]);
        row = this.createDOM("tr", {}, table);
        var td = this.createDOM("td", {colspan:"7"}, row);
        var inner_div = this.createDOM("div", {id:"kve_tained_table_prof_div_inner", style:"height:"+height+"px;overflow: auto;float:left; width:100%"}, td);
        this.createDOM("table",{id:"kve_tained_table_prof_inner", width:"100%", style:"border-collapse: collapse; border-bottom:#d3e8f7 0px solid;"}, inner_div);
    }
    this.cgi_fill_kve_trained_index_table   = function(){
            var json	= this.merge_json({cmd_id:101});
			var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
			vservice_path		+= JSON.stringify(json);
			this.Logger.push("Profile CGI... "+vservice_path+" === ");
       		this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.fill_kve_trained_index_table(json)" , "GET", true);
    
    }
    this.fill_kve_trained_index_table   = function(idata){
        var data = idata[0];
        this.load_data_status = false;
        if (this.Id('filter_one_sign_post_map_status')){
            if (idata[1][0] == 1){
                this.load_data_status = true;
                this.Id('filter_one_sign_post_map_status').src = TASApp.config.IP+TASApp.config.JS_DIR+"/images/icon_green.png";
            }else{
                this.Id('filter_one_sign_post_map_status').src = TASApp.config.IP+TASApp.config.JS_DIR+"/images/icon_red.png";
            }
        }
        innertable = this.Id("kve_tained_table_prof_inner");
        innertable.innerHTML = "";
        var row;
        this.selected_taxonomy_row_id = "";
        for(var i = 0; i < data.length; i++){
             row = this.get_table_row(innertable, {id:'kve_trained_prof_'+(i+1), 'kve_train_index':data[i][4], taxo_id:data[i][0], taxo_name:data[i][1]}, "td", [{class:"prof_td", width:"2px"}, {class:"prof_td", txt:data[i][0], width:"3px", style:"text-align: center;", onclick:"TASApp.gbl.search_tab.load_taxonomy_wise_input_data(this)"}, {taxo_id:data[i][0], txt:data[i][1], width:"35%", class:"prof_td", style:"text-align: left;padding-left:5px;", onclick:"TASApp.gbl.search_tab.load_taxonomy_wise_input_data(this)"}, {txt:data[i][2], width:"19%", class:"prof_td", style:"text-align: center;", onclick:"TASApp.gbl.search_tab.load_taxonomy_wise_input_data(this)"}, {txt:"", width:"18%", class:"prof_td", style:"text-align: center;"}, {txt:"", width:"18%", class:"prof_td", style:"text-align: center;"}]);
             this.createDOM("input",{name:"overwite_save", type:"checkbox", style:"margin:0px 1px; vertical-align:middle;"}, row.cells[5]);
             this.createDOM("a",{style:"margin:0px 1px; vertical-align:middle;", href:"javascript:void(0);", txt:'Save', onclick:"TASApp.gbl.search_tab.save_without_filter(this)"}, row.cells[5]);
             this.createDOM("input",{name:"action_key", type:"radio", style:"margin:0px 1px; vertical-align:middle;"}, row.cells[4]);
             this.createDOM("input",{name:"filter_taxo_key", taxo_id:data[i][0], taxo_name:data[i][1], type:"checkbox", style:"margin:0px 1px; vertical-align:middle;"}, row.cells[0]);
        }
        if (data.length > 0){
            this.selected_taxonomy_row_id = 'kve_trained_prof_1';
            this.Id('kve_trained_prof_1').cells[1].click();
        }
    }
    this.select_all_taxonomy_for_populate = function(elem){
        var flg = false, inputElms;
        if (elem.checked){
            inputElms = this.Id("kve_tained_table_prof_inner").querySelectorAll('input[name="filter_taxo_key"]:not(:checked)')
            flg = true;
        }
        else{
            inputElms = this.Id("kve_tained_table_prof_inner").querySelectorAll('input[name="filter_taxo_key"]:checked')
        }
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = flg;
        } 
    }
    this.save_without_filter = function(elem){
        
        if (elem.parentNode.parentNode.className != 'active_kve_table_prof_row'){
            elem.parentNode.parentNode.firstChild.click();
        }
        var isOverwrite = 0;
        var massg = "Do you want to save the selected group directly"
        if (elem.parentNode.firstChild.checked){
                isOverwrite = 1;
                massg = "Do you want to overwrite selected group"
        }
        var r=confirm(massg);
	    if (r==true) {
            this.show_process_bar();
            var isSaveKey = (elem.parentNode.previousSibling.firstChild.checked) ? 1 : 0;
            var signJson = this.get_sign_info();
            var json	= this.merge_json({cmd_id:118, taxo_id:this.selected_parent_taxo_id, taxo_name:this.selected_parent_taxo_name, key_include:isSaveKey, sysgrptype:this.selected_group_type_idx, overwrite:isOverwrite, sigconfig:signJson});
	        var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
		    vservice_path		+= JSON.stringify(json);
		    this.Logger.push("Save Data without filter CGI... "+vservice_path+" === ");
       	    this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.show_save_data_taxonomy(json)" , "GET", true);
        }else
            return;
    }
    
    this.load_taxonomy_wise_input_data = function(tdelem){
        
        elem = tdelem.parentNode;
        this.selected_taxonomy_row_id = elem.id;
//        elem.scrollIntoView();
        try{elem.parentNode.querySelector("tr.active_kve_table_prof_row").className = 'prof_td'}catch(e){}
        elem.className = 'active_kve_table_prof_row';
        this.selected_parent_taxo_id = elem.getAttribute('taxo_id');
        this.selected_parent_taxo_name = elem.getAttribute('taxo_name');

        this.cgi_get_classified_taxonomy();
        this.sort_by();
        this.add_kve_remainder_elems();
        this.selected_tab_one_flag = "fTbs_2";
        this.Id(this.selected_tab_one_flag).click();
    }
    this.add_taxonomy_tab = function(header_td){
        var div = this.createDOM("div", {id:"kve_taxonomy_header"}, header_td);
        var ul = this.createDOM("ul", {}, div);
        this.createDOM("li", {txt:"Remark", id:"kve_remark_tab", onclick:"TASApp.gbl.search_tab.get_crop_coordinates(this);"}, ul);
        this.createDOM("li", {txt:"Topic-Classified", id:"kve_mark_taxonomy_tab", class:"active", onclick:"TASApp.gbl.search_tab.get_classified_taxonomy(this);"}, ul);
        this.createDOM("li", {txt:"Topic-Unclassified", id:"kve_unmark_taxonomy_tab",  onclick:"TASApp.gbl.search_tab.get_unclassified_taxonomy(this)"}, ul);
//        var li = this.createDOM("li", {id:"kve_group_type_tab", style:"display:block;padding:"+padding}, ul);
        var li = this.createDOM("li", {id:"kve_group_type_tab", style:"display:block;"}, ul);
        this.createDOM("select", {id:"kve_group_type_select_tab", style:"width: 95px;margin:-3px 0px;float:left;border:1px solid #dedede;height:18px;background:none;color:#fff;"},li)
    }
    this.cgi_add_group_types = function(){
        this.Id('kve_group_type_tab').style.display = 'block';
        var json	= this.merge_json({cmd_id:110});
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
		vservice_path		+= JSON.stringify(json);
		this.Logger.push("Group type CGI... "+vservice_path+" === ");
       	this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.add_group_types(json)" , "GET", true);

    }
    this.add_group_types = function(data){
        var select_elm = this.Id('kve_group_type_select_tab');
        select_elm.innerHTML = '';
        if (data.length > 0){
            this.createDOM('option', {txt:"select_type", gid:"", selected:"selected", onclick:"TASApp.gbl.search_tab.select_group_type(this)"}, select_elm);
        }
        for(var ind = 0, len=data.length; ind < len; ind++){
             this.createDOM('option', {gid:data[ind][1]+":^:"+data[ind][0], txt:data[ind][1], onclick:"TASApp.gbl.search_tab.select_group_type(this)"}, select_elm);
        }
        //select_elm.firstChild.click();
    }
    this.select_group_type = function(elem){
        this.selected_group_type_idx = elem.getAttribute('gid');
        this.show_profile_table();
    }
    this.add_kve_taxonomy_index    = function(classify_taxonomy){
        this.classify_taxonomy = classify_taxonomy;
        this.selected_group_type_idx = "";
        this.cgi_add_group_types();
        this.Id("kve_mark_taxonomy_tab").click();
        
    }
    this.add_kve_taxonomy_index_table    = function(classify_taxonomy){
        var content_div		= this.Id('kve_tab_taxonomy_content');
        content_div.innerHTML = "";
        this.add_taxonomy_tab(content_div);
        var div = this.createDOM('div', {class:'fixed-table-container', style:"float:left;height:"+(this.url_element_height-50)+"px;"}, content_div);       
        var div1 = this.createDOM('div', {class:'header-background', style:"background:#7691a4;"}, div);
        div = this.createDOM('div', {class:'fixed-table-container-inner'}, div);
        var table = this.createDOM("table",{id:"kve_taxonomy_table", width:"100%"}, div);
    }        
    this.hide_mark_table = function(){
        if (this.trained_grid_height == this.trained_grid_height_new){
            this.trained_grid_height_new = (this.trained_grid_height + this.url_height);
            this.Id("kve_tab_trained_content").style.height = this.trained_grid_height_new+"px";
            this.Id("kve_tab_trained_content").maxHeight = this.trained_grid_height_new+"px";
            this.Id("kve_tained_table_prof_div_inner").style.height = (this.trained_grid_height_new-25)+"px";
            this.Id("kve_tab_mark_content").style.display = 'none'; 
        }
    }
    this.show_mark_table = function(){
        if (this.trained_grid_height != this.trained_grid_height_new){
            this.trained_grid_height_new = this.trained_grid_height;
            this.Id("kve_tab_trained_content").style.height = this.trained_grid_height_new+"px";
            this.Id("kve_tab_trained_content").maxHeight = this.trained_grid_height_new+"px";
            this.Id("kve_tained_table_prof_div_inner").style.height = (this.trained_grid_height_new-25)+"px";
            this.Id("kve_tab_mark_content").style.display = 'block'; 
        }
    }
    this.get_unclassified_taxonomy = function(elem){
        this.hide_mark_table();
        //this.Id("kve_action_menu_drop_down").style.display = 'none';
        this.add_kve_mark_index_table([]);
        TASApp.gbl.search_tab.selected_div_json_crop  = {};
        this.Id('kve_clear_tab').click(); 
        try{this.Id("kve_taxonomy_header").querySelector("li.active").className = "";}catch(e){}
        elem.className = "active";
        var taxo_table = this.Id("kve_taxonomy_table");
        taxo_table.innerHTML = "";
        var row  = this.get_table_row(taxo_table, {}, "th", [{class:"taxo_header"},{class:"taxo_header"}, {class:"taxo_header"},{class:"taxo_header"}]);
        row.cells[0].innerHTML = '<div class="th-inner">SL.No</div>'        
        row.cells[1].innerHTML = '<div class="th-inner">Topic Name</div>'        
        row.cells[2].innerHTML = '<div class="th-inner">SL.No</div>'        
        row.cells[3].innerHTML = '<div class="th-inner">Topic Name</div>'        
        var keys = [], tkeys = Object.keys(TASApp.gbl.taxo_name_mapping);
        for(var ind = 0; ind < tkeys.length; ind++){
            if ((tkeys[ind] == 'key index') || (tkeys[ind] == 'value index')){
                continue
            }
            keys.push(tkeys[ind])
        }
        keys.sort();
        var len = parseInt(keys.length/2);
        var extra = 0
        if (len*2 != keys.length){
            extra += 1;
        }
        var taxo_table_tr;
        this.Logger.push("load taxonomy === "+len+" === "+keys);
        for(var ind = 0; ind < len; ind++){
            var value1   = TASApp.gbl.taxo_name_mapping[keys[ind]];
            var value2   = TASApp.gbl.taxo_name_mapping[keys[ind+len+extra]];
            
            var row = this.get_table_row(taxo_table, {}, "td", [{class:"prof_td", style:'width:10%'}, {taxo_id:value1.id, txt:"<span>"+value1.name+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_kv_taxonomy_content(this)"}, {class:"prof_td", style:'width:10%'}, {taxo_id:value2.id, txt:"<span>"+value2.name+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_kv_taxonomy_content(this)", style:"text-align:left;"}]);
            this.createDOM("input",{id:value1.id, taxo_id: value1.id,  name:"target_taxonomy", type:"radio", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_kv_taxonomy(this)"}, row.cells[0]);
            var label = this.createDOM("label",{style:"margin-left:2px;" },row.cells[0]);
            label.innerHTML = ind+1;
            this.createDOM("input",{id:value2.id,taxo_id: value2.id, name:"target_taxonomy", type:"radio", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_kv_taxonomy(this)"}, row.cells[2]);
            var label = this.createDOM("label",{style:"margin-left:2px;" },row.cells[2]);
            label.innerHTML = ind + len + 1 + extra;
        }
        if (len*2 != keys.length){
            var value   = TASApp.gbl.taxo_name_mapping[keys[len]];
            var row = this.get_table_row(taxo_table, {}, "td", [{class:"prof_td", style:'width:10%'}, {taxo_id:value.id, txt:"<span>"+value.name+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_kv_taxonomy_content(this)"}, {class:"prof_td"}, {class:"prof_td"}]);
            this.createDOM("input",{id:value.id, taxo_id: value.id, name:"target_taxonomy", type:"radio", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_kv_taxonomy(this)"}, row.cells[0]);
            var label = this.createDOM("label",{style:"margin-left:2px;" },row.cells[0]);
            label.innerHTML = len+1;
        }

    }
    this.get_unclassified_taxonomy_bak = function(elem){
        this.hide_mark_table();
        //this.Id("kve_action_menu_drop_down").style.display = 'none';
        this.add_kve_mark_index_table([]);
        TASApp.gbl.search_tab.selected_div_json_crop  = {};
        this.Id('kve_clear_tab').click(); 
        try{this.Id("kve_taxonomy_header").querySelector("li.active").className = "";}catch(e){}
        elem.className = "active";
        taxo_table = this.Id("kve_taxonomy_table_inner");
        taxo_table.innerHTML = "";
        var keys = [], tkeys = Object.keys(TASApp.gbl.taxo_name_mapping);
        for(var ind = 0; ind < tkeys.length; ind++){
            if ((tkeys[ind] == 'key index') || (tkeys[ind] == 'value index')){
                continue
            }
            keys.push(tkeys[ind])
        }
        keys.sort();
        var len = parseInt(keys.length/2);
        var extra = 0
        if (len*2 != keys.length){
            extra += 1;
        }
        var taxo_table_tr;
        this.Logger.push("load taxonomy === "+len+" === "+keys);
        for(var ind = 0; ind < len; ind++){
            var value1   = TASApp.gbl.taxo_name_mapping[keys[ind]];
            var value2   = TASApp.gbl.taxo_name_mapping[keys[ind+len+extra]];
            
            var row = this.get_table_row(taxo_table, {}, "td", [{class:"prof_td", style:'width:10%'}, {taxo_id:value1.id, txt:"<span>"+value1.name+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_kv_taxonomy_content(this)"}, {class:"prof_td", style:'width:10%'}, {taxo_id:value2.id, txt:"<span>"+value2.name+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_kv_taxonomy_content(this)"}]);
            this.createDOM("input",{id:value1.id, taxo_id: value1.id,  name:"target_taxonomy", type:"radio", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_kv_taxonomy(this)"}, row.cells[0]);
            var label = this.createDOM("label",{style:"margin-left:2px;" },row.cells[0]);
            label.innerHTML = ind+1;
            this.createDOM("input",{id:value2.id,taxo_id: value2.id, name:"target_taxonomy", type:"radio", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_kv_taxonomy(this)"}, row.cells[2]);
            var label = this.createDOM("label",{style:"margin-left:2px;" },row.cells[2]);
            label.innerHTML = ind + len + 1 + extra;
        }
        if (len*2 != keys.length){
            var value   = TASApp.gbl.taxo_name_mapping[keys[len]];
            var row = this.get_table_row(taxo_table, {}, "td", [{class:"prof_td", style:'width:10%'}, {taxo_id:value.id, txt:"<span>"+value.name+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_kv_taxonomy_content(this)"}, {class:"prof_td"}, {class:"prof_td"}]);
            this.createDOM("input",{id:value.id, taxo_id: value.id, name:"target_taxonomy", type:"radio", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_kv_taxonomy(this)"}, row.cells[0]);
            var label = this.createDOM("label",{style:"margin-left:2px;" },row.cells[0]);
            label.innerHTML = len+1;
        }
    }
    this.select_kv_taxonomy_content = function(elem){
        var taxo_id = elem.getAttribute('taxo_id');
        this.Id(""+taxo_id).click(); 
    }
    this.highlight_kv_taxonomy_content = function(taxo_id){
        try{
           this.Id(""+taxo_id).click();
           this.Id(""+taxo_id).scrollIntoView();
        }catch(e){}
    }
    this.get_classified_taxonomy = function(elem){
        if (TASApp.gbl.search_tab.rightView){
            TASApp.gbl.search_tab.rightView.open_block();
        }
        TASApp.gbl.search_tab.selected_classified_taxo_id = "";
        this.hide_mark_table();
        //this.Id("kve_action_menu_drop_down").style.display = 'none';
        this.add_kve_mark_index_table([]);
        TASApp.gbl.search_tab.selected_div_json_crop  = {};
        this.Id('kve_clear_tab').click(); 
        try{this.Id("kve_taxonomy_header").querySelector("li.active").className = "";}catch(e){}
        elem.className = "active";
        var taxo_table = this.Id("kve_taxonomy_table");
        taxo_table.innerHTML = "";
        var row  = this.get_table_row(taxo_table, {}, "th", [{class:"taxo_header"},{class:"taxo_header"}, {class:"taxo_header"},{class:"taxo_header"}]);
        row.cells[0].innerHTML = '<div class="th-inner">SL.No</div>'        
        row.cells[1].innerHTML = '<div class="th-inner">Topic Name</div>'        
        row.cells[2].innerHTML = '<div class="th-inner">Applied Docs</div>'        
        row.cells[3].innerHTML = '<div class="th-inner" style="width:15%;">Del</div>'        
        var keys    = Object.keys(this.classify_taxonomy);
        keys.sort();
        var len = keys.length;
        var taxo_table_tr;
        this.Logger.push("load taxonomy === "+len+" === "+keys);
        for(var ind = 0; ind < len; ind++){
            var value1   = this.classify_taxonomy[keys[ind]];
            var class1 = (TASApp.gbl.search_tab.selected_classified_taxo_id == Number(keys[ind]))?"active_taxonomy_index":"prof_td"; 
            var row = this.get_table_row(taxo_table, {taxo_id:keys[ind], style:"text-align:center;"}, "td", [{class:"prof_td", style:"width:10%;"}, {class:"prof_td", style:"width:50%;"}, {class:"prof_td", style:"width:20%;"}, {class:"prof_td"}]);
            this.createDOM("span", {txt:(ind+1)}, row.cells[0]);
            this.createDOM("span", {taxo_id:keys[ind], txt:value1[0]}, row.cells[1]);
            //this.createDOM("a", {href:"javascript:void(0)", col_type:"profwise", tot_ext:value1[1], txt:value1[1]+"/"+value1[2], style:"color:"+this.color_group_type[value1[5]], onclick:"TASApp.gbl.search_tab.get_classified_profiles(this)"}, row.cells[2]);
            this.createDOM("a", {href:"javascript:void(0)", col_type:"profwise", tot_ext:value1[1], txt:value1[1], style:"color:"+this.color_group_type[value1[5]], onclick:"TASApp.gbl.search_tab.get_classified_profiles(this)"}, row.cells[2]);
            this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"images/closex.png", width:17+'px', height:17+'px', style:"padding:0px 1px; margin:0px 0px; vertical-align:middle;", onclick:"TASApp.gbl.search_tab.kve_delete_classified_selected_group(this)"}, row.cells[3]);
        }
    }
    this.kve_delete_classified_selected_group = function(elem){
        var taxo_id = elem.parentNode.parentNode.getAttribute('taxo_id');
        var taxo_name = this.classify_taxonomy[taxo_id][0];
        //this.Id(''+taxo_id).click();
        var r=confirm('Do you want To Delete the "'+taxo_name+'" Across ');
        if (r==true) {
           this.cgi_kve_delete_classified_selected_group(elem);
        }else
            return;
    }
    this.cgi_kve_delete_classified_selected_group = function(elem){
        this.show_process_bar();
        TASApp.gbl.search_tab.selected_taxo_id = "";
        var taxo_id = elem.parentNode.parentNode.getAttribute('taxo_id');
        var taxo_name = this.classify_taxonomy[taxo_id][0];
        var signJson = this.get_sign_info();
        var json	= this.merge_json({cmd_id:115, taxo_id:taxo_id, taxo_name:taxo_name, sigconfig:signJson});
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
		vservice_path		+= JSON.stringify(json);
		this.Logger.push("Delete taxo CGI... "+vservice_path+" === ");
       	this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.show_classified_profiles_delete(json)" , "GET", true);
    }
    this.show_classified_profiles_delete = function(data){
        this.hide_process_bar();
        this.sort_by();
        this.cgi_fill_kve_trained_index_table();
    }
    this.change_sort_order = function(){
        var elem = this.Id("kve_taxonomy_table").querySelector('td.active_taxonomy_index');
        if (elem){
            elem.firstChild.click();
        }
    } 
    this.get_classified_profiles_old = function(elem){
        var taxo_id = Number(elem.parentNode.previousSibling.firstChild.id);
        TASApp.gbl.search_tab.selected_classified_taxo_id = taxo_id;
        var taxo_name = this.classify_taxonomy[taxo_id][0];
        elem.parentNode.previousSibling.firstChild.click();
        try{elem.parentNode.parentNode.parentNode.querySelector('td.active_taxonomy_index').className = "prof_td";}catch(e){}
        elem.parentNode.className = 'active_taxonomy_index';
        
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
        var json	= this.merge_json({cmd_id:12, ref_index:this.sort_index, taxo_id:taxo_id, taxo_name:taxo_name});
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
		vservice_path		+= JSON.stringify(json);
		this.Logger.push("Classify taxo CGI... "+vservice_path+" === ");
       	this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.show_classified_profiles(json)" , "GET", true);
    }

    this.get_classified_profiles = function(elem){
        //this.show_profile_table= this.change_sort_order;
        var col_type = elem.getAttribute('col_type');
        var tot_ext = elem.getAttribute('tot_ext');
        var taxo_id = Number(elem.parentNode.parentNode.getAttribute('taxo_id'));
        TASApp.gbl.search_tab.selected_classified_taxo_id = taxo_id;
        TASApp.gbl.search_tab.tot_ext = tot_ext;
        TASApp.gbl.search_tab.col_type = col_type;
        var taxo_name = this.classify_taxonomy[taxo_id][0];
        try{elem.parentNode.parentNode.parentNode.querySelector('td.active_taxonomy_index').className = "prof_td";}catch(e){}
        elem.parentNode.className = 'active_taxonomy_index';
        this.selected_tab_one_flag = "fTbs_1";
        this.selected_tab_two_flag = "kve_remainder_complete_tab_id";
        this.Id(this.selected_tab_one_flag).click()
    } 
        
    this.load_topic_profile_data = function(){
        var taxo_id = TASApp.gbl.search_tab.selected_classified_taxo_id;
        var taxo_name = this.classify_taxonomy[taxo_id][0]; 
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
        var json	= this.merge_json({cmd_id:112, ref_index:this.sort_index, taxo_id:taxo_id, taxo_name:taxo_name});
        json[TASApp.gbl.search_tab.col_type] = TASApp.gbl.search_tab.tot_ext;
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
		vservice_path		+= JSON.stringify(json);
		this.Logger.push("Classify taxo CGI... "+vservice_path+" === ");
       	this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.show_classified_profiles(json)" , "GET", true);
    }
    this.show_classified_profiles = function(data){
        TASApp.gbl.search_tab.kve_classify_data = data;
        if (data && data[1].length > 0){
            this.Id("kve_remainder_complete_tab_id").click();
        } else if (data && data[2].length > 0){
            this.Id("kve_remainder_partial_tab_id").click();
        }else{
            this.Id("kve_cleared_tab_id").click();
        }
    }
    this.select_kv_taxonomy = function(elem){
         //TASApp.gbl.search_tab.selected_taxo_id = Number(elem.id);
         var taxo_name = TASApp.gbl.taxo_mapping[elem.id];
         TASApp.gbl.search_tab.rightView.assign_taxonomy(Number(elem.id), taxo_name);
         //elem.scrollIntoView();
         try{elem.parentNode.parentNode.parentNode.querySelector('span.active_taxonomy_index').className = "";}catch(e){}
         elem.parentNode.nextSibling.firstChild.className = 'active_taxonomy_index';
    }
    this.select_kv_taxonomy_classified = function(elem){
         TASApp.gbl.search_tab.selected_taxo_id = Number(elem.id);
         //elem.scrollIntoView();
         try{elem.parentNode.parentNode.parentNode.querySelector('span.active_taxonomy_index').className = "";}catch(e){}
         elem.parentNode.nextSibling.firstChild.className = 'active_taxonomy_index';
    }

    this.deselect_kv_taxonomy = function(elem){
         TASApp.gbl.search_tab.selected_taxo_id = Number(elem.id);
         //elem.scrollIntoView();
         try{elem.parentNode.parentNode.parentNode.querySelector('span.active_taxonomy_index').className = "";}catch(e){}
    }
    this.add_kve_action_index_table    = function(data){
        this.selected_delimiter = "";
        //var present_div_ids  = Panel.browser_window.dataJson;
        var profile_div		= this.Id('kve_tab_mark_content');
        profile_div.innerHTML = "";
        var table = this.createDOM("table",{id:"kve_mark_tab_content_table", width:"100%"}, profile_div);
        var table_head = this.createDOM("thead",{}, table);
        this.get_table_row(table_head, {class:"kve_mark_tab_content_table_header"}, "th", [{txt:"Delimiters", width:"10%"}])
        var table_body = this.createDOM("tbody",{}, table);
        var table_tr = this.createDOM("tr",{}, table_body);
        var table_td = this.createDOM("td",{colspan:"10"}, table_tr);
        var inner_div = this.createDOM("div",{style:"height:"+(this.url_height-25)+"px;overflow: auto;"}, table_td);
        var innertable = this.createDOM("table",{id:"kve_action_tab_content_table_inner", width:"100%", style:"border-collapse: collapse; border-bottom:#d3e8f7 1px solid;"}, inner_div);
        var tr = this.createDOM("tr",{}, innertable);;
        var ind = 1;
        for (var i=0; i<this.gbl_delimiter_lst.length; i++){
            if (ind > 10){
                tr = this.createDOM("tr",{}, innertable); 
                ind = 1
            }
            td = this.createDOM("td",{del:this.gbl_delimiter_lst[i], txt:this.gbl_delimiter_lst[i], class:"Delimeter_action", width:"10%", onclick:"TASApp.gbl.search_tab.kve_select_delimiter(this);"}, tr);
            ind += 1;
        }
        return
    }
    this.kve_select_delimiter = function(elem){
        this.selected_delimiter = elem.getAttribute('del');
        try{elem.parentNode.parentNode.querySelector("td.Delimeter_action_active").className = 'Delimeter_action';}catch(e){}
        elem.className = 'Delimeter_action_active';
    }
    this.kve_select_action = function(elem){
        this.selected_action = elem.id;
    }
    this.add_kve_mark_index_table    = function(data){
        //var present_div_ids  = Panel.browser_window.dataJson;
        var profile_div		= this.Id('kve_tab_mark_content');
        profile_div.innerHTML = "";
        var table = this.createDOM("table",{id:"kve_mark_tab_content_table", width:"100%"}, profile_div);
        var table_head = this.createDOM("thead",{}, table);
        this.get_table_row(table_head, {class:"kve_mark_tab_content_table_header"}, "th", [{txt:"Mark Index", width:"24%"}, {txt:"Index Type", width:"25%"}, {txt:"Taxonomy Name", width:"25%"}, {txt:"", width:"25%"}])
        var table_body = this.createDOM("tbody",{}, table);
        var table_tr = this.createDOM("tr",{}, table_body);
        var table_td = this.createDOM("td",{colspan:"4"}, table_tr);
        var inner_div = this.createDOM("div",{style:"height:"+(this.url_height-25)+"px;overflow: auto;"}, table_td);
        var innertable = this.createDOM("table",{id:"kve_mark_tab_content_table_inner", width:"100%", style:"border-collapse: collapse; border-bottom:#d3e8f7 1px solid;"}, inner_div);
    }
    this.kve_deleteMarkRow = function(div_id){
        this.Id("kve_mark_tab_content_table_inner").removeChild(this.Id(div_id));
        if (div_id in TASApp.gbl.search_tab.selected_div_json){
           delete TASApp.gbl.search_tab.selected_div_json[div_id]; 
        }
        if (div_id in TASApp.gbl.search_tab.selected_div_json_crop){
           delete TASApp.gbl.search_tab.selected_div_json_crop[div_id]; 
        }
    }
    this.kve_change_box_type = function(crop_id, chg_box_type){
        var modify_key_type = (chg_box_type == '3')?'VALUE':(chg_box_type == '2')?'KEY':'BOUNDARY';
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].modify_key_type = modify_key_type;
        this.Id(''+crop_id).cells[1].innerHTML = modify_key_type;
    }
    this.kve_addCropDyn = function(crop_crods, crop_id, index_type){
        var taxo_name = TASApp.gbl.taxo_mapping[TASApp.gbl.search_tab.selected_taxo_id];
        if (taxo_name == ''){
           return false;   
        }   
        crop_id = crop_id + ":^^:" + this.gbl_doc_id; 
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id] = {}
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].taxo_id = TASApp.gbl.search_tab.selected_taxo_id;
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].taxo_name = taxo_name;
        gr_type = TASApp.gbl.search_tab.selected_div_json_crop[crop_id].modify_key_type = (index_type == 'Key Index')?'KEY':'VALUE';
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].cord = crop_crods;
        Panel.browser_window.load_blocks_highlight_dyn(crop_crods, crop_id , '#0000ff');
        table_head_tr = this.get_table_row(this.Id("kve_mark_tab_content_table_inner"), {id:crop_id, kv_ref_id:crop_id, group_type:2}, "td", [{class:"prof_td", txt:crop_crods, width:"24%", style:"text-align: center;", onclick:"TASApp.gbl.search_tab.kve_highlight_group_dyn(this);"}, {class:"prof_td", txt:gr_type, width:"25%", style:"text-align: center;", onclick:"TASApp.gbl.search_tab.kve_highlight_group_dyn(this);"}, {class:"prof_td", txt:taxo_name, width:"25%", style:"text-align: center;", onclick:"TASApp.gbl.search_tab.kve_highlight_group_dyn(this);"}, {class:"prof_td", txt:"", width:"25%", style:"text-align: center;"}]);
        var div = this.createDOM("div", {}, table_head_tr.cells[3]);
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"images/closex.png", width:17+'px', height:17+'px', style:"padding:0px 1px; margin:0px 0px; vertical-align:middle;", onclick:"TASApp.gbl.search_tab.kve_delete_selected_group_dyn(this)"}, div);
        return true;
    }
    this.update_remark_apply_flag = function(elem){
        var ref_id = elem.parentNode.parentNode.id;
        if (!elem.checked){
            TASApp.gbl.search_tab.selected_div_json_crop[ref_id].apply = 1;
        }    
        else{
            TASApp.gbl.search_tab.selected_div_json_crop[ref_id].apply = 0;
        }
    }
    this.update_apply_flag = function(elem){
        var ref_id = elem.parentNode.parentNode.id;
        if (!elem.checked){
            TASApp.gbl.search_tab.selected_div_json[ref_id].apply = 1;
        }    
        else{
            TASApp.gbl.search_tab.selected_div_json[ref_id].apply = 0;
        }
    }
    this.kve_highlight_group_dyn = function(elem){
        var ref_id = elem.parentNode.getAttribute('kv_ref_id');
        var fields = ref_id.split(':^^:');
        if (this.gbl_doc_id == Number(fields[7])){
            //Panel.browser_window.load_blocks_highlight_dyn(TASApp.gbl.search_tab.selected_div_json_crop[elem.parentNode.id].cord, ref_id, '#0000ff');
            //var taxo_id = TASApp.gbl.search_tab.selected_div_json_crop[elem.parentNode.id].taxo_id;
            //this.Id(""+taxo_id).click(); 
            //this.Id(""+taxo_id).scrollIntoView();
            this.highlight_cord_in_canvas(TASApp.gbl.search_tab.selected_div_json_crop[elem.parentNode.id].cord, TASApp.gbl.search_tab.selected_div_json_crop[elem.parentNode.id].modify_key_type);
        }
    }
    this.kve_delete_selected_group_dyn_old = function(elem){
        var div_id = elem.parentNode.parentNode.parentNode.id;
        //if (TASApp.gbl.search_tab.tab_index == 1){
        //    Panel.browser_window.delete_block(div_id);
        //}
        if (div_id in TASApp.gbl.search_tab.selected_div_json_crop){
           delete TASApp.gbl.search_tab.selected_div_json_crop[div_id]; 
           Panel.browser_window.delete_block_dyn(div_id);
        }
        this.Id("kve_mark_tab_content_table_inner").removeChild(this.Id(div_id));
        var vcord_ids = div_id.split(":^^:")
        var vcord_tt = vcord_ids[0]+"_"+vcord_ids[1]+"_"+vcord_ids[2]+"_"+vcord_ids[3];
        //alert('hhhhhh'+vcord_tt);
        RemoveRect(vcord_tt);
    }
    this.kve_delete_selected_group_dyn = function(elem){
        var div_id = elem.parentNode.parentNode.parentNode.id;
        //if (TASApp.gbl.search_tab.tab_index == 1){
        //    Panel.browser_window.delete_block(div_id);
        //}
        if (div_id in TASApp.gbl.search_tab.selected_div_json_crop){
           delete TASApp.gbl.search_tab.selected_div_json_crop[div_id]; 
           Panel.browser_window.delete_block_dyn(div_id);
        }
        this.Id("kve_taxonomy_table").removeChild(this.Id(div_id));
        var vcord_ids = div_id.split(":^^:")
        var vcord_tt = vcord_ids[0]+"_"+vcord_ids[1]+"_"+vcord_ids[2]+"_"+vcord_ids[3];
        //alert('hhhhhh'+vcord_tt);
        RemoveRect(vcord_tt);
    }

    this.kve_delete_selected_group = function(elem){
        var div_id = elem.parentNode.parentNode.parentNode.id;
        if (TASApp.gbl.search_tab.tab_index == 1){
            Panel.browser_window.delete_block(div_id);
        }
        if (div_id in TASApp.gbl.search_tab.selected_div_json){
           delete TASApp.gbl.search_tab.selected_div_json[div_id]; 
        }
        this.Id("kve_mark_tab_content_table_inner").removeChild(this.Id(div_id));
    }
    this.add_kve_profile_index_table    = function(data){
//        alert('website Creating Table....')
        this.display_row = this.kve_create_level_data;
        var profile_div        = this.Id('kve_prof_tab_menu_content');
        profile_div.innerHTML = "";
		var table = this.createDOM("table",{id:"kve_table_prof", width:"100%"}, profile_div);
        var table_head_tr;
        var group_flag = 'R';
        if (this.process_type == 2){
            group_flag = 'N';
        }
        for(var i=0;i<data.length;i++){
             if (data[i]){
                table_head_tr = this.get_table_row(table, {id:'kve_profile_index_tab_'+(i+1)}, "td", [{class:"prof_td", width:'10%', style:"text-align: center;color:#3e3e3e;"}, {class:"prof_td", width:'30%', style:"text-align: left;padding-left:5px; color:#3e3e3e;"}, {class:"prof_td", width:'60%', style:"text-align: center;color:#3e3e3e"}]);
                this.createDOM("span", {txt:i+1, id:"kve_sino_idx"}, table_head_tr.cells[0]);
	            var first_td_div	= this.createDOM("div",{}, table_head_tr.cells[1]);
	            //this.createDOM("span", {txt:"Profile ID "+data[i][0][1]}, first_td_div);
	            this.createDOM("span", {txt:""+data[i][0][1]}, first_td_div);
                if (group_flag == "R"){
	                this.createDOM("input", {name:"profile_action",  class:"kve_prof_check_box_idx", type:"checkbox", style:"float:right;", disabled:"true"}, first_td_div);
                }
                else{
	                this.createDOM("input", {name:"profile_action", class:"kve_prof_check_box_idx", type:"checkbox", style:"float:right;"}, first_td_div);
                }
                table_head_tr.cells[2].style.textAlign  = 'left';
	            var second_td_div	= this.createDOM("div",{}, table_head_tr.cells[2]);
                this.display_row(data, second_td_div, i, group_flag)
             }
        }
        if (data.length > 0){
            this.Id("kve_profile_index_tab_1").cells[2].firstChild.firstChild.firstChild.click();
        }
    }
    this.kve_create_level_data = function(data, td_div_main, i, group_flag){
         var td_div;
	 this.selected_profile_document_active = "";
	 this.selected_profile_document_active_className = "";
         var all_doc_ids = [];
         for (var ind = 1; ind < data[i].length; ind++){
            all_doc_ids.push(data[i][ind][3])
            td_div = this.createDOM("div", {id:"kve_td_"+i+"_"+ind, style:"float:left;"}, td_div_main);
            this.createDOM("span", {txt:data[i][ind][2]+'.'+(data[i][ind][1]+1)+' ', id:data[i][0][0]+'_'+data[i][0][1]+'_'+data[i][ind].join('_'), kve_doc_id:data[i][ind][3], pw:data[i][ind][4]||800, ph:data[i][ind][5]||2500, cmd_id:this.apply_cmd_id, onclick:"TASApp.gbl.search_tab.kve_load_html(this)"}, td_div);
            if (data[i][ind][6] == 0){
	    	td_div.className = "kve_prof_level_data_red"; 
            }else{
	    	td_div.className = "kve_prof_level_data_green"; 
            }

         }
         this.Id("kve_profile_index_tab_"+(i+1)).cells[1].firstChild.setAttribute('doc_ids', JSON.stringify(all_doc_ids))
    }

    this.kve_create_level_data_apply = function(data, td_div, i, group_flag){
         this.createDOM("span", {txt:data[i].join("!!"), cmd_id:4, id:data[i].join('_'), kve_doc_id:data[i][5], pw:data[i][10]||800, ph:data[i][10]||2500, class:"kve_prof_level_data", onclick:"TASApp.gbl.search_tab.kve_load_html(this)"}, td_div);
         //this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"images/closex.png", width:13+'px', height:13+'px', style:"padding:0px 1px; margin:0px 0px; vertical-align:middle;"}, td_div);
    }

    this.kve_load_html = function(elem){
         if (TASApp.gbl.search_tab.rightView)
             TASApp.gbl.search_tab.rightView.open_block();
   	     //Panel.hide_panel_window();
         var pw = elem.getAttribute('pw'); 
         var ph = elem.getAttribute('ph');
         var cmd_id = elem.getAttribute('cmd_id');
         var doc_id = elem.getAttribute('kve_doc_id')
         this.gbl_doc_id = Number(doc_id);
         if (this.gbl_doc_id != Number(doc_id) && cmd_id == '103' && TASApp.gbl.search_tab.tab_index == 1){
            this.reset_mark_table();
         }
         //try{document.querySelector("#kve_table_prof .active_kve_table_prof_row").className = ''}catch(e){}
//         elem.scrollIntoView();
         try{this.Id('kve_table_prof').querySelector("tr.active_kve_table_prof_row").className = ''}catch(e){}
         elem.parentNode.parentNode.parentNode.parentNode.className = 'active_kve_table_prof_row';
         //try{document.querySelector("#kve_table_prof .active_kve_table_prof_level").className = 'kve_prof_level_data'}catch(e){}
	 if (elem.parentNode.className == ""){
           try{this.Id('kve_table_prof').querySelector("span.active_kve_table_prof_level").className = 'kve_prof_level_data'}catch(e){}
           elem.className = 'active_kve_table_prof_level';
	 }
	 else{
		var activeElm = this.Id(this.selected_profile_document_active);
       		if (activeElm){
			activeElm.className = this.selected_profile_document_active_className;
         	}
	 	this.selected_profile_document_active = elem.parentNode.id;
	 	this.selected_profile_document_active_className = elem.parentNode.className;
	 	elem.parentNode.className = this.selected_profile_document_active_className + " kve_prof_level_data_hover";
	 }
	 this.Logger.push("CLICKED DOC_ID : "+doc_id+" ===== ref_id :"+ elem.id+"=====taxo_id : "+this.selected_parent_taxo_id+"=====taxo_name : "+this.selected_parent_taxo_name);
    var json = JSON.parse(JSON.stringify(this.gbl_meta_data)); 
    json.doc_image_path = TASApp.config.IMAGE_IP;
    json.server_cgi_path = TASApp.config.CGI_IP;
    json.doc_id = doc_id;
    json.pw = pw;
    json.ph = ph;
    json.ref_id = elem.id;
    json.cmd_id = ""+cmd_id;
    json.select_id = "";
    json.taxo_id = this.selected_parent_taxo_id;
    json.taxo_name = this.selected_parent_taxo_name;
    json.sysgrptype = this.selected_group_type_idx;
    this.Id("main_filter_level").style.display = "";
    this.Id("main_div1").style.display = "none";
    this.Id("parent").style.display = "none";
    TASApp.gbl.search_tab.rightView = active_filter_view(json);

//	 var url		= TASApp.config.IP + "TR_Legal_2013_12_23_web/source/plugin/load_html/popUpProfile_prmy_filter.html?project_id="+TASApp.gbl.project_id+"&stage_id="+TASApp.gbl.active_stage_id+"&user_id="+TASApp.gbl.user_id+"&mgmt_id="+TASApp.gbl.mgmt_id+"&url_id="+TASApp.gbl.url_id+"&doc_server_path="+TASApp.config.IMAGE_IP+"&cgi_server_path="+TASApp.config.CGI_IP+"&agent_id="+TASApp.gbl.agent_id+"&doc_id="+doc_id+"&pw="+pw+"&ph="+ph+"&ref_id="+encodeURIComponent(elem.id)+"&cmd_id="+cmd_id+"&taxo_id="+this.selected_parent_taxo_id+"&taxo_name="+this.selected_parent_taxo_name+"&sysgrptype="+encodeURIComponent(this.selected_group_type_idx);
	 //var url		= "popUpProfile_prmy_filter.html?project_id="+TASApp.gbl.project_id+"&stage_id="+TASApp.gbl.active_stage_id+"&user_id="+TASApp.gbl.user_id+"&mgmt_id="+TASApp.gbl.mgmt_id+"&url_id="+TASApp.gbl.url_id+"&doc_server_path="+TASApp.config.IMAGE_IP+"&cgi_server_path="+TASApp.config.CGI_IP+"&agent_id="+TASApp.gbl.agent_id+"&doc_id="+doc_id+"&pw="+pw+"&ph="+ph+"&ref_id="+encodeURIComponent(elem.id)+"&cmd_id="+cmd_id+"&taxo_id="+this.selected_parent_taxo_id+"&taxo_name="+this.selected_parent_taxo_name+"&sysgrptype="+encodeURIComponent(this.selected_group_type_idx);
   	 //Panel.hide_panel_window();
         //Panel.show_panel_window(url);
    }
    this.kve_load_html_preview = function(doc_id, pw, ph, cmd_id, ref_id, select_id){
	     this.Logger.push("CLICKED DOC_ID : "+doc_id+" ===== ref_id :"+ ref_id);
	     var url		= TASApp.config.IP + "TR_Legal_2013_12_23_web/source/plugin/load_html/popUpProfile_prmy.html?project_id="+TASApp.gbl.project_id+"&stage_id="+TASApp.gbl.active_stage_id+"&user_id="+TASApp.gbl.user_id+"&mgmt_id="+TASApp.gbl.mgmt_id+"&url_id="+TASApp.gbl.url_id+"&doc_server_path="+TASApp.config.IMAGE_IP+"&cgi_server_path="+TASApp.config.CGI_IP+"&agent_id="+TASApp.gbl.agent_id+"&doc_id="+doc_id+"&pw="+pw+"&ph="+ph+"&ref_id="+encodeURIComponent(ref_id)+"&cmd_id="+cmd_id+"&select_id="+encodeURIComponent(select_id);
   	     //Panel.hide_panel_window();
	     Panel.show_panel_window(url);
    }
    this.set_drag_events    = function(elem){
        elem.setAttribute("ondragstart","return dragStart(event)");
        elem.setAttribute("draggable","true");
    }


    this.cgi_fill_kve_trained_index_table_tab =function(Obj){
                this.Id('kve_prof_tab_menu_content').innerHTML='';
                if(1==Obj){
                        var elem = this.Id("kve_taxonomy_table").querySelector('td.active_taxonomy_index');
                        if (!elem){
                            this.Id('kve_taxonomy_table').firstChild.cells[1].firstChild.click(); 
                        }
                        this.Id('kve_prof_tab_menu_header').style.display = 'block';
                        this.Id('kve_prof_tab_menu_content').style.height = (this.profile_height-50)+'px'; 
                        this.Id('kve_prof_tab_menu_content').style.maxHeight = (this.profile_height-50)+'px'; 
                        this.show_profile_table = this.load_topic_profile_data;
                }else if(2 == Obj){
                        if (TASApp.gbl.search_tab.selected_classified_taxo_id != ""){
                            this.Id("kve_mark_taxonomy_tab").click();
                        }
                        this.Id('kve_prof_tab_menu_header').style.display = 'none';
                        this.Id('kve_prof_tab_menu_content').style.height = (this.profile_height-25)+'px'; 
                        this.Id('kve_prof_tab_menu_content').style.maxHeight = (this.profile_height-25)+'px'; 
                        this.show_profile_table = this.cgi_add_kve_profile_index_table;
                }
                for(var i=1; i<3; i++){
                        var Tbs = 'fTbs_'+i;
                        if(i == Obj){
                                this.Id(Tbs).style.background = '#34495E';
                        }else{
                                this.Id(Tbs).style.background = '';
                        }
                }
                this.Id("kve_sort_prof_tab_menu_drop_down").firstChild.click(); 
    }



    this.add_kve_remainder_elems    = function(){
        var tab_div = this.Id("kve_prof_tab_menu_header")
        tab_div.innerHTML = '';

	    var tab_div1 = this.Id("kve_prof_tab_menu_header1")
        tab_div1.innerHTML = '';

        var index_div1   = this.createDOM("div",{style:"background:#7691A4;width:100%;"}, tab_div1);
        var ul  = this.createDOM("ul",{id:"kve_index_prof_tab1", style:"margin:0;float:left; width:40%", kve_train_id:"0"}, index_div1);
        this.createDOM("li", {txt:"Results", id:"fTbs_1", onclick:"TASApp.gbl.search_tab.cgi_fill_kve_trained_index_table_tab(1);"}, ul);
        //this.createDOM("li", {txt:" | "}, ul);
        this.createDOM("li", {txt:"Training Samples", id:"fTbs_2", onclick:"TASApp.gbl.search_tab.cgi_fill_kve_trained_index_table_tab(2);"}, ul);
        this.Id('fTbs_1').style.background = '#92BFCB';
        var index_div2  = this.createDOM("div",{style:"float:right;"}, index_div1);
        this.createDOM("label", {class:"review-span", for:"chgLang", style:"vertical-align:middle;", txt:"Language" }, index_div2);
        this.createDOM("input",{id:"chgLang",   name:"change_language", value: "EN", type:"checkbox",  style:"margin:5px 4px; vertical-align:middle;"}, index_div2);


        var index_div   = this.createDOM("div",{}, tab_div);
        var ul  = this.createDOM("ul",{id:"kve_index_prof_tab", style:"margin:0;", kve_train_id:"0"}, index_div);
        this.createDOM("li", {txt:"Not cleared", id:"kve_remainder_complete_tab_id", onclick:"TASApp.gbl.search_tab.kve_show_all_reminded_complete_profile_info(this)"}, ul);
        this.createDOM("li", {txt:" | "}, ul);
        this.createDOM("li", {txt:"Partial", id:"kve_remainder_partial_tab_id", onclick:"TASApp.gbl.search_tab.kve_show_all_partial_profile_info(this)"}, ul);
        this.createDOM("li", {txt:" | "}, ul);
        this.createDOM("li", {txt:"Cleared", id:"kve_cleared_tab_id", onclick:"TASApp.gbl.search_tab.kve_show_all_cleared_profile_info(this)"}, ul);
    }

    this.kve_show_all_reminded_complete_profile_info = function(elem){
        this.Id('kve_remainder_partial_tab_id').className    = "";
        this.Id('kve_remainder_complete_tab_id').className   = "tab_menu_active";
        this.Id('kve_cleared_tab_id').className              = "";
        //alert('==========='+TASApp.gbl.search_tab.tab_index);
        if (TASApp.gbl.search_tab.tab_index == 1){
            var data = TASApp.gbl.search_tab.kve_classify_data[1]||[];
            this.add_kve_profile_index_table(data);
        }else if (TASApp.gbl.search_tab.tab_index == 2){
            var data = TASApp.gbl.search_tab.kve_applyed_data[this.alpply_selected_taxo_id][1] || []; 
            this.add_kve_profile_index_table(data);
        }else{
            //var data = TASApp.gbl.search_tab.kve_applyed_data[1]||[];
            var data = TASApp.gbl.search_tab.kve_applyed_data[this.alpply_selected_remark_row_index][1]||[];
            this.add_kve_profile_index_table(data);
        }
    }
    this.kve_show_all_cleared_profile_info = function(elem){
        this.Id('kve_remainder_partial_tab_id').className    = "";
        this.Id('kve_remainder_complete_tab_id').className   = "";
        this.Id('kve_cleared_tab_id').className              = "tab_menu_active";
        if (TASApp.gbl.search_tab.tab_index == 1){
            var data = TASApp.gbl.search_tab.kve_classify_data[0]||[];
            this.add_kve_profile_index_table(data);
        }else if (TASApp.gbl.search_tab.tab_index == 2){
            var data = TASApp.gbl.search_tab.kve_applyed_data[this.alpply_selected_taxo_id][0] || []; 
            this.show_applied_data_profile(data);
        }else{
            //var data = TASApp.gbl.search_tab.kve_applyed_data[0]||[];
            var data = TASApp.gbl.search_tab.kve_applyed_data[this.alpply_selected_remark_row_index][0]||[];
            //this.add_kve_profile_index_table(data);
            this.show_applied_data_profile(data);
        }
    }
    this.kve_show_all_partial_profile_info = function(elem){
        this.Id('kve_remainder_partial_tab_id').className    = "tab_menu_active";
        this.Id('kve_remainder_complete_tab_id').className   = "";
        this.Id('kve_cleared_tab_id').className              = "";
        if (TASApp.gbl.search_tab.tab_index == 1){
            var data = TASApp.gbl.search_tab.kve_classify_data[2]||[];
            this.add_kve_profile_index_table(data);
        }else if (TASApp.gbl.search_tab.tab_index == 2){
            var data = TASApp.gbl.search_tab.kve_applyed_data[this.alpply_selected_taxo_id][2] || []; 
            this.show_applied_data_profile(data);
        }else{
            var data = TASApp.gbl.search_tab.kve_applyed_data[this.alpply_selected_remark_row_index][2]||[];
            this.add_kve_profile_index_table(data);
        }
    }

    this.cgi_add_kve_profile_index_table = function(){
            this.apply_cmd_id = 104;
            TASApp.gbl.search_tab.tab_index = 1;
            this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
            var json	= this.merge_json({cmd_id:103, ref_index:this.sort_index, taxo_id:this.selected_parent_taxo_id, taxo_name:this.selected_parent_taxo_name, sysgrptype:this.selected_group_type_idx});
			var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
			vservice_path		+= JSON.stringify(json);
			this.Logger.push("Profile CGI... "+vservice_path+" === ");
       		this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.add_kve_profile_index_table(json)" , "GET", true);
    }
    this.add_kve_profile_index_table_apply    = function(elem){
        this.alpply_selected_taxo_id = elem.id;
        this.Id('kve_cleared_tab_id').click();
    }

    this.add_kve_profile_index_table_apply_remark    = function(elem){
        this.alpply_selected_remark_row_index = elem.id;
        this.Id('kve_cleared_tab_id').click();
    }
    this.show_applied_data_profile = function(data){
        //this.display_row = this.kve_create_level_data_apply;
        var profile_div        = this.Id('kve_prof_tab_menu_content');
        profile_div.innerHTML = "";
		var table = this.createDOM("table",{id:"kve_table_prof", width:"100%"}, profile_div);
        var table_head_tr;
        var group_flag = 'C';
        for(var i=0;i<data.length;i++){
             if (data[i]){
                //table_head_tr = this.get_table_row(table, {id:'kve_profile_index_tab_'+(i+1)}, "td", [{class:"prof_td", width:'10%', style:"text-align: center; color:#6E9DBF"}, {class:"prof_td", width:'30%', style:"text-align: center; color:#6E9DBF"}, {class:"prof_td", width:'60%', style:"text-align: center; color:#6E9DBF"}]);
                table_head_tr = this.get_table_row(table, {id:'kve_profile_index_tab_'+(i+1)}, "td", [{class:"prof_td", width:'50%', style:"text-align: center; color:#6E9DBF"}, {class:"prof_td", width:'50%', style:"text-align: center; color:#6E9DBF"}]);
                this.createDOM("span", {txt:i+1, id:"kve_sino_idx", style:"float:left; "}, table_head_tr.cells[0]);
	            var first_td_div	= this.createDOM("div",{id:"kve_td_"+i+"_"+1, class:""}, table_head_tr.cells[1]);
	            //this.createDOM("span", {txt:"Profile ID "+data[i][4], id:data[i].join('_'), cmd_id:4, kve_doc_id:data[i][6], pw:data[i][1]||800, ph:data[i][2]||2500,onclick:"TASApp.gbl.search_tab.kve_load_html(this)", class:"kve_prof_level_data"}, first_td_div);
	            this.createDOM("span", {txt:""+data[i][4], id:data[i].join('_'), cmd_id:4, kve_doc_id:data[i][6], pw:data[i][1]||800, ph:data[i][2]||2500,onclick:"TASApp.gbl.search_tab.kve_load_html(this)", class:"kve_prof_level_data"}, first_td_div);
             }
        }
        if (data.length > 1){
            this.Id("kve_profile_index_tab_1").cells[1].firstChild.firstChild.click();
        }
    }
    this.reset_mark_table = function(){
        if (this.Id("kve_mark_tab_content_table_inner"))
           this.Id("kve_mark_tab_content_table_inner").innerHTML = '';
        TASApp.gbl.search_tab.selected_div_json = {};
        TASApp.gbl.search_tab.selected_div_json_crop = {};
        var inputElm = this.Id("kve_taxonomy_table").querySelector('input:checked')
        if (inputElm){
            inputElm.checked = false;
            this.deselect_kv_taxonomy(inputElm);
        }
    }
    this.show_save_data_taxonomy = function(data){
        TASApp.gbl.search_tab.kve_applyed_data = [];
        this.reset_mark_table();
        this.hide_process_bar();
        this.show_profile_table = this.cgi_add_kve_profile_index_table;
        this.sort_by();
        this.cgi_fill_kve_trained_index_table();
        this.Id("kve_clear_tab").style.display = 'none';
        this.Id("kve_local_apply_tab").style.display = 'none';
        this.Id("kve_global_apply_tab").style.display = 'none';
        this.Id("kve_apply_agree_tab").style.display = 'none';
        this.Id("kve_save_tab").style.display = 'none';
        this.Id("kve_reload_tab").style.display = 'block';
    }
    this.show_save_data_remark = function(data){
        this.hide_process_bar();
        this.process_type = 0;
        TASApp.gbl.search_tab.kve_applyed_data = [];
        this.reset_mark_table();

        //this.show_profile_table = this.cgi_add_kve_profile_index_table;
        //this.sort_by();
        //this.cgi_fill_kve_trained_index_table();
        this.Id('kve_clear_tab').click(); 
        this.Id("kve_reload_tab").style.display = 'block';
        this.Id(this.selected_taxonomy_row_id).cells[1].click();
    }
    this.load_report_data  = function(){
	     var url		= TASApp.config.IP + "TR_Legal_2013_12_23_web/source/plugin/load_html/popUpProfile_prmy_report_html.html?project_id="+TASApp.gbl.project_id+"&stage_id="+TASApp.gbl.active_stage_id+"&user_id="+TASApp.gbl.user_id+"&mgmt_id="+TASApp.gbl.mgmt_id+"&url_id="+TASApp.gbl.url_id+"&doc_server_path="+TASApp.config.IMAGE_IP+"&cgi_server_path="+TASApp.config.CGI_IP+"&agent_id="+TASApp.gbl.agent_id+"&cmd_id="+this.cmd_id;
	     Panel.show_panel_window(url);
    }
    this.load_applied_data_remark = function(data){
        this.hide_process_bar();
        //this.load_report_data();
        TASApp.gbl.search_tab.tab_index = 3;
        //TASApp.gbl.search_tab.kve_applyed_data = data;
        this.show_applied_data_remark_new(data);
    } 
    this.load_agree_data_remark = function(data){
        this.hide_process_bar();
        TASApp.gbl.agree_data_remark = data;
        //this.load_report_data();
        TASApp.gbl.search_tab.tab_index = 3;
        //TASApp.gbl.search_tab.kve_applyed_data = data;
        this.Id("kve_prof_tab_menu_content").style.display = 'block';
        //this.Id('kve_apply_tab').style.display = "block";
        this.Id('kve_save_tab').style.display = "block"; 
        this.apply_cmd_id = 107;
        this.add_kve_profile_index_table(data);
        this.apply_cmd_id = 104;
    } 

    this.show_applied_data_remark_new = function(data){
        this.Id("kve_prof_tab_menu_content").style.display = 'block';
        this.Id('kve_apply_agree_tab').style.display = "block";
        this.Id("kve_sort_by_menu").style.display = 'none';
        this.apply_cmd_id = 107;
        this.add_kve_profile_index_table(data);
        this.apply_cmd_id = 104;
        this.show_applied_data = this.cgi_agree_data_remark;
    }
    this.show_applied_data_remark = function(){
        this.Id("kve_prof_tab_menu_content").style.display = 'block';
        //this.Id('kve_apply_tab').style.display = "block";
        //this.Id('kve_save_tab').style.display = "block"; 
        var div = this.Id("kve_sort_by_menu");
        div.innerHTML = "";
        //this.Id('kve_cleared_tab_id').click();
        var select_elm = this.createDOM('select', {id:"kve_sort_prof_tab_menu_drop_down", style:"width: 120px;"}, div);
       //this.Logger.push("REMARK DATA : "+JSON.stringify(data));
        for(var taxo_key in TASApp.gbl.search_tab.kve_applyed_data){
             var taxo_key_ids = taxo_key.split(':!:')
             this.createDOM('option', {id:taxo_key, txt:taxo_key_ids[1], onclick:"TASApp.gbl.search_tab.add_kve_profile_index_table_apply_remark(this)"}, select_elm);
        }
        this.Id("kve_sort_prof_tab_menu_drop_down").firstChild.click();

    }
    this.load_applied_data_taxonomy = function(data){
        this.hide_process_bar();
        TASApp.gbl.agree_html_table_str = data[0] || "";
        this.load_report_data();
        TASApp.gbl.search_tab.tab_index = 2;
        TASApp.gbl.search_tab.kve_applyed_data = data[1];
        this.show_applied_data = this.show_applied_data_taxonomy;
    }
    this.show_applied_data_taxonomy = function(){
        this.Id('kve_apply_agree_tab').style.display = "none";
        this.Id("kve_local_apply_tab").style.display = 'block';
        this.Id("kve_global_apply_tab").style.display = 'block';
        this.Id("kve_prof_tab_menu_content").style.display = 'block';
        this.Id('kve_save_tab').style.display = "block"; 
        var div = this.Id("kve_sort_by_menu");
        div.innerHTML = "";
        var select_elm = this.createDOM('select', {id:"kve_sort_prof_tab_menu_drop_down", style:"width: 120px;"}, div);
        for(var taxo_key in TASApp.gbl.search_tab.kve_applyed_data){
             var taxo_key_ids = taxo_key.split(':!:')
             this.createDOM('option', {id:taxo_key, txt:taxo_key_ids[1], onclick:"TASApp.gbl.search_tab.add_kve_profile_index_table_apply(this)"}, select_elm);
        }
        this.Id("kve_sort_prof_tab_menu_drop_down").firstChild.click();
    }
    this.cgi_get_classified_taxonomy = function(){
        var json	= this.merge_json({cmd_id:102, taxo_id:this.selected_parent_taxo_id, taxo_name:this.selected_parent_taxo_name});
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
		vservice_path		+= JSON.stringify(json);
		this.Logger.push("TAXO CGI... "+vservice_path+" === ");
       	this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.add_kve_taxonomy_index(json)" , "GET", true);
        
    }
    this.init = function(){
        this.make_layout();
        this.init_layout();
        this.cgi_fill_level_info();
        this.add_kve_taxonomy_index_table();
        this.add_kve_trained_index_table();
        this.cgi_fill_kve_trained_index_table();
    }
    this.cgi_fill_level_info = function()
    {
            var json	= this.merge_json({cmd_id:13});
			var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
			vservice_path		+= JSON.stringify(json);
			this.Logger.push("SIGN LEVEL CGI... "+vservice_path+" === ");
       		this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.fill_level_info(json)" , "GET", true);
    }    
    this.fill_level_info = function(data)
    {
        this.gbl_sign_level_dict = data; 
    }
    this.toggle_filter_actions = function(display_flag){
        this.Id('filter-sub-tab-1').style.display = display_flag;
        this.Id('filter-sub-tab-2').style.display = display_flag;
        this.Id('filter-sub-tab-3').style.display = display_flag;
        this.Id('filter-sub-tab-4').style.display = display_flag;
        this.Id('filter-sub-tab-5').style.display = display_flag;
        if (display_flag == 'none'){
            this.Id('kve_load_post_mapdata').style.display = 'block';  
        }
        else{
            this.Id('kve_load_post_mapdata').style.display = 'none';  
        }
    }
    this.active_first_level_filter = function(){
        this.set_active_first_level_filter(1);
        return
        var json	= this.merge_json({cmd_id:182});
        this.show_process_bar();
        var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
        vservice_path		+= JSON.stringify(json);
        this.Logger.push("status CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.set_active_first_level_filter(json)" , "GET", true);
    }
    this.set_active_first_level_filter = function(data){
        TASApp.gbl.search_tab.load_data_status = data;
        this.hide_process_bar();
        this.set_filter_tabs();
        this.active_filter_sub_tab();
    }
    
    this.set_filter_tabs = function(){
        var menu		= this.Id('tab_menu_header');
        menu.innerHTML		= '';
        var div	= this.createDOM("div",{}, menu);
        var ul	= this.createDOM("ul",{id:"kv_filter_new"}, div);
        this.createDOM("li", {txt:"Load Data", class:"tab_menu_active", style:"display:none;", id:"kve_load_post_mapdata", onclick:"TASApp.gbl.search_tab.LoadPostMap_data(this)"}, ul);
        this.createDOM("li", {txt:"Units-Classification", class:"tab_menu_active", style:"display:none;", id:"filter-sub-tab-1", onclick:"TASApp.TAB.switch_filter_sub_tabs(1)"}, ul);
        this.createDOM("li", {txt:"Units-Stats", id:"filter-sub-tab-2", class:'tab_menu_inactive', style:"display:none;", onclick:"TASApp.TAB.switch_filter_sub_tabs(2);"}, ul);
        this.createDOM("li", {txt:"Reclassify", id:"filter-sub-tab-3", class:'tab_menu_inactive', style:"display:none;", onclick:"TASApp.TAB.switch_filter_sub_tabs(3);"}, ul);
        this.createDOM("li", {txt:"De-Dup", id:"filter-sub-tab-4", class:'tab_menu_inactive', style:"display:none;", onclick:"TASApp.TAB.switch_filter_sub_tabs(4);"}, ul);
        this.createDOM("li", {txt:"Topic-Copy", id:"filter-sub-tab-5", class:'tab_menu_inactive', style:"display:none;", onclick:"TASApp.TAB.switch_filter_sub_tabs(5);"}, ul);
    }
    this.active_filter_sub_tab = function(){
        if (TASApp.gbl.search_tab.load_data_status == 1){
            TASApp.gbl.search_tab.toggle_filter_actions('block');
            var tab_no = sessionStorage.sub_tab_no || 1;
            this.Id('filter-sub-tab-'+tab_no).click();
    	}else{
            TASApp.gbl.search_tab.toggle_filter_actions('none');
            TASApp.gbl.search_tab.make_layout();
            this.Id("profile_header_1_home").style.display       = "none";
            this.Id('profile_div').innerHTML			            = '';
            this.Id('profile_div').style.height                  = "100%";
            this.Id('url_content_1_home').innerHTML = "";
            this.Id("crop_tool_header").style.display			= "none";
            this.Id('footerDiv').innerHTML = "";
            this.createDOM("img", {id:"filter_one_sign_post_map_status", src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/icon_red.png", style:"float:left;margin:4.5px 0px;", alt:"OK"}, this.Id('footerDiv'));
        }
    }
    this.getKeyStatus = function(e) {
        //e = e || window.event;
        switch (e.keyCode) {
            case 37: /*Left Arrow*/
                var elem = document.getElementsByClassName("kve_prof_level_data_hover")[0];
                var kid = elem.id.split('_');
                kid[3] = Number(kid[3])-1;
                kid = kid.join('_');
                try{this.Id(kid).firstChild.click();}catch(e){}
                break;
            case 38: /*Up Arrow*/
                var elem = document.getElementsByClassName("kve_prof_level_data_hover")[0];
                var kid = elem.id.split('_');
                kid[2] = Number(kid[2])-1;
                kid = kid.join('_');
                try{this.Id(kid).firstChild.click();}catch(e){}
                break;
            case 39: /*Right Arrow*/
                var elem = document.getElementsByClassName("kve_prof_level_data_hover")[0];
                var kid = elem.id.split('_');
                kid[3] = Number(kid[3])+1;
                kid = kid.join('_');
                try{this.Id(kid).firstChild.click();}catch(e){}
                break;
            case 40: /* Down Arrow*/
                var elem = document.getElementsByClassName("kve_prof_level_data_hover")[0];
                var kid = elem.id.split('_');
                kid[2] = Number(kid[2])+1;
                kid = kid.join('_');
                try{this.Id(kid).firstChild.click();}catch(e){}
                break;
        }
    }
    //add methods in panel side
}).apply(Filter_Level_One.prototype);
