function Mapping(){
	Utils.call(this);
	this.profile_grid	= 48;
	this.trained_grid 	= 10;
	this.mark_grid 	= 14;
	this.taxo_grid 	= 30;
    this.id = 'mapping-sub-tab';
    this.selected_div_json = {};
    this.selected_div_json_new = {}
    this.selected_div_json_crop = {};
    this.classify_taxonomy = {};
    this.color_group_type = ['#ff0000', '#0000ff'];
    this.gbl_sort_data = ["Sort By Key Value", "Sort By Description", "Sort By Header", "Sort By ProfileId", "Sort By Level"];
    this.gbl_signature_type = ["Default", "Open Signature"];
    this.sort_index = 0;
    this.signature_type = 0;
    this.last_action_id = 0;
    this.signature_sign = "none";
    this.gbl_sign_level_dict = {};
    this.gbl_remove_apply_sign_data  = {};
    this.cgi_script_file_name = "webintf/cgi_web_extract_lmdb.py";
    this.gbl_meta_data = {project_id:TASApp.gbl.project_id, user_id:TASApp.gbl.user_id, agent_id:TASApp.gbl.agent_id, mgmt_id:Number(TASApp.gbl.mgmt_id), url_id:Number(TASApp.gbl.url_id)};
    TASApp.config.IMAGE_IP = TASApp.config.CGI_IP;
    this.selected_profile_document_active = "";
    this.selected_profile_document_active_className = "";
    this.selected_tab_one_flag = "Tbs_2";
    this.selected_tab_two_flag = "kve_cleared_tab_id";
    this.selected_taxonomy_row_id = "";
    this.agree_html_table_str = '';
}
Mapping.prototype		= new Utils();
Mapping.prototype.constructor	= Mapping;
(function(){
   	/**
	 * Description
	 * @method make_layout
	 * @return 
	 */
	this.make_layout	= function(){
//        Panel.browser_doc_id    = '';
		TASApp.gbl.canvas_data	= [];
		var content_window      = this.Id('left_section'); //main_container3');
        document.body.setAttribute("onkeyup", "TASApp.gbl.search_tab.getKeyStatus(event)");
		var rect        = content_window.getBoundingClientRect();
		var height = (rect.bottom - rect.top);
		var total_h	= height	- parseInt(TASApp.gbl.tab) - parseInt(TASApp.gbl.footer) - parseInt(TASApp.gbl.crop_tool);
		this.Logger.push("total_h === "+total_h +" === "+ content_window.height);
       	this.profile_height                             = total_h * (this.profile_grid/100);
		this.trained_grid_height		                = total_h * (this.trained_grid/100); 
		this.url_height		                            = total_h * (this.mark_grid/100); 
		this.url_element_height		                    = total_h * (this.taxo_grid/100); 
		this.Id("profile_top_header_1_home").style.height	= total_h * (this.profile_grid/100) +"px";
		this.Id("url_content_1_home").style.height		    = this.trained_grid_height + this.url_height + this.url_element_height+"px";
        this.add_crop_tool_elems(); 
        this.Id('tab_menu_header').style.display                = "none";
		this.Id('profile_div').innerHTML			            = '';
       	this.Id('profile_div').style.height                  = "100%";
       	this.Id('footerDiv').innerHTML = "";
       	this.Id('url_content_1_home').innerHTML = "";
        this.Id('Con_Div').innerHTML = "";
		this.add_footer_elems();
		try{
           	this.disp_block(this.Id("save_panel_data"));
	        this.Id("save_panel_data").setAttribute("onclick","process_extd_page()");
       	}catch(e){}
	}
    this.merge_json = function(attr_json){
        var json   = JSON.parse(JSON.stringify(this.gbl_meta_data));
        for (var key in attr_json){
            json[key] = attr_json[key];
        }
        return json
    }
    this.delete_profiles = function(elem){
        var r=confirm("Do you want To Delete the selected Page User Group ");
	    if (r==true) {
            this.cgi_delete_group();
        }else
            return;
    }
    this.cgi_delete_group = function(){
        var json	= this.merge_json({cmd_id:9, doc_id:this.gbl_doc_id});
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?input_str=';
		vservice_path	    += JSON.stringify(json);
		this.Logger.push("DELETE USER GR CGI... "+vservice_path+" === ");
   		this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.reset_profile_after_delete(json)" , "GET", true);
    }
    this.reset_profile_after_delete = function(data){
         this.Logger.push("ACTION ID : "+this.last_action_id);
         this.show_profile_table(); 
    }
    this.add_footer_elems = function(){
	    var elem    = this.Id('footerDiv');
        elem.innerHTML = "";
        this.createDOM("label", {class:"review-span", for:"kve-select-value", style:"float:right;margin:0px 1px; vertical-align:middle;", txt:"Value" }, elem);
        this.createDOM("input",{id:"kve-select-value", name:"select_value_elem", value: "value", type:"checkbox",  style:"float:right;margin:8px 0px 2px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_kv_type(this)"}, elem);
        this.createDOM("label", {class:"review-span", for:"kve-select-key", style:"float:right;margin:0px 1px; vertical-align:middle;", txt:"Key" }, elem);
        this.createDOM("input",{id:"kve-select-key", name:"select_key_elem",  value: "key", type:"checkbox",  style:"float:right;margin:8px 0px 2px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_kv_type(this)"}, elem);
        this.createDOM("label", {class:"review-span", style:"float:right;margin:0px 1px; vertical-align:middle;", txt:"Continuous Selection by :" }, elem);
    }
    this.select_kv_type = function(elem){
        if (elem.id == "kve-select-value"){
            this.Id("kve-select-key").checked = false;
            TASApp.gbl.select_key_value_type = 3;
        }
        if (elem.id == "kve-select-key"){
            this.Id("kve-select-value").checked = false;
            TASApp.gbl.select_key_value_type = 2;
        }
    } 	

    this.add_crop_tool_elems	= function(){
        if (this.Id('dynamic_drop_down')){
            this.Id('dynamic_drop_down').parentNode.removeChild(this.Id('dynamic_drop_down'));
        }
		this.Id("crop_tool_header").style.display			= "block";
		var crop_tool	= this.Id('crop_tool_header');
       	crop_tool.innerHTML		= '';
       	this.createDOM("span", {class:"review-span", style:"float:left;display:none;", txt:"Delete", id:'del-multi', onclick:"TASApp.gbl.search_tab.delete_profiles(this)"}, crop_tool);
       	//this.createDOM("span", {class:"review-span", style:"float:left;padding-left: 5px;cursor:auto;", txt:"Clearing House by:"}, crop_tool);
       	this.createDOM("span", {class:"review-span", style:"float:left;padding-left: 5px", txt:"Profile", id:'kve_profile_view_tab', onclick:"TASApp.gbl.search_tab.load_profile_view(this)"}, crop_tool);
       	this.createDOM("span", {class:"review-span", style:"float:left;padding-left: 5px", txt:"Topic", id:'kve_topic_view_tab', onclick:"TASApp.gbl.search_tab.load_topic_view(this)"}, crop_tool);
       	this.createDOM("span", {class:"review-span", style:"float:right;padding-left: 20px;display:none;", txt:"Save", id:'kve_save_tab', onclick:"TASApp.gbl.search_tab.save_index_data(this)"}, crop_tool);
       	this.createDOM("span", {class:"review-span", style:"float:right;padding-left: 5px;", txt:"L.apply", id:'kve_local_apply_tab', onclick:"TASApp.gbl.search_tab.apply_index_data(this)"}, crop_tool);
       	this.createDOM("span", {class:"review-span", style:"float:right;padding-left: 20px;", txt:"G.apply", id:'kve_global_apply_tab', onclick:"TASApp.gbl.search_tab.apply_index_data(this)"}, crop_tool);
       	this.createDOM("span", {class:"review-span", style:"float:right;padding-left: 20px;display:none;", txt:"Agree", id:'kve_apply_agree_tab', onclick:"TASApp.gbl.search_tab.show_applied_data(this)"}, crop_tool);
       	this.createDOM("span", {class:"review-span", style:"float:right;padding-left: 20px;display:none;", txt:"clear", id:'kve_clear_tab', onclick:"TASApp.gbl.search_tab.clear_canvas_data(this)"}, crop_tool);
    }
    this.load_profile_view = function(elem){
        if (TASApp.gbl.search_tab.selected_classified_taxo_id != ""){
            this.load_kve_taxonomy_index_table();
            try{this.Id("kve_taxonomy_header").querySelector("li.active").className = "";}catch(e){}
        }
        this.selected_view_tab = 1;
        this.Id('kve_topic_view_tab').style.color = "";
        elem.style.color = "#4dd9bf";
        this.Id(this.selected_tab_one_flag).click();
    }
    this.load_topic_view = function(elem){
        this.selected_view_tab = 2;
        elem.style.color = "#4dd9bf";
        this.Id('kve_profile_view_tab').style.color = "";

        if (TASApp.gbl.search_tab.selected_classified_taxo_id == ""){
            this.Id(this.selected_taxonomy_row_id).cells[2].firstChild.click();
        }
        else{
            this.Id(this.selected_tab_one_flag).click();
        }
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
                this.Id("before_sign_taxo").selectedIndex = 0;
                this.Id("before_sign_taxo").disabled=true;
                this.Id("after_sign_taxo").selectedIndex = 0;
                this.Id("after_sign_taxo").disabled=true;
                this.Id("kve_select_all_level_id").checked = false;
                this.Id("kve_select_all_level_id").click();
                this.Id("key_complete_action_id").click();
                var elms = this.Id('dynamic_drop_down').querySelectorAll('[default_action="true"]')
                for (var i=0, len=elms.length; i<len; i++){
                    elms[i].checked = true;
                }
            }
        }
    }
    this.close_popup = function(){
        this.Id('dynamic_drop_down').style.display = "none";
        this.Id('kve_configure_signature_type_drop_down').setAttribute('dis_status', 'N');
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
            var height =  this.trained_grid_height + this.url_height + this.url_element_height + 50;
            var pos = this.get_absolute_pos(this.Id('kve_prof_tab_menu_header1'));
            var pos1 = this.get_absolute_pos(this.Id('main_container3'));
            var top_pos = pos[1];//parseInt(this.getstyle(elem, "top"));
            var left_pos = pos[0];//parseInt(this.getstyle(elem, "left"));
            var height = (top_pos - pos1[1]);
            var drop_down  = this.createDOM('div',{id:'dynamic_drop_down', style:'position:absolute; width:30%; height:'+height+'px;background:#ffffff; padding:0px; font-size:11px;z-index:9999999;'}, document.getElementsByTagName('body')[0]);
            drop_down.style.top = "48px";
            drop_down.style.left = (left_pos+1) +"px";
            var div = this.createDOM('div',{style:"background:#3c6570;height:25px;width:100%;"}, drop_down);
            this.createDOM('Span', {txt:'Configure', style:"padding-top:4px;padding-left:3px;color:#ffffff; float:left; font-size:12px; font-weight:bold;"}, div)
            this.createDOM('img', {src:'icons/close_grey.png', style:"width:14px; height:14px; padding:5px 7px;float:right;", onclick:"TASApp.gbl.search_tab.close_popup()"}, div)
            var div = this.createDOM('div',{style:"width:100%;overflow:auto;height:"+(height-25)+"px"}, drop_down);
            var table = this.createDOM('table',{width:"100%" ,}, div);

            var input, row = this.get_table_row(table, {style:"border-bottom:1px solid #3B3A3A;"}, 'td', [{txt:"", width:"70%", style:"text-align: left;"}, {txt:"Default", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"default_action",  type:"checkbox", style:"vertical-align:middle;", checked:true}, row.cells[2]);
            this.reset_option(input);
            var input, row = this.get_table_row(table, {}, 'td', [{txt:"Contains", width:"70%", style:"text-align: left;padding-left:5px;"}, {txt:"Structure", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"contain_action",  type:"radio", default_action:true, ttype:"VALUE", style:"vertical-align:middle;", checked:true}, row.cells[2]);
            this.load_option(input);
            row = this.get_table_row(table, {}, 'td', [{width:"70%"}, {txt:"Partial Structure", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"contain_action",  type:"radio", ttype:"PARTIAL_VALUE", style:"vertical-align:middle;"}, row.cells[2]);
            this.load_option(input);

            row = this.get_table_row(table, {style:"border-bottom:1px solid #3B3A3A;"}, 'td', [{width:"70%"}, {txt:"None", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"contain_action",  type:"radio", style:"vertical-align:middle;", ttype:"NONE"}, row.cells[2]);
            this.load_option(input);

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
            
            row = this.get_table_row(table, {}, 'td', [{txt:"Key", width:"70%", style:"text-align: left;padding-left:5px;"}, {txt:"Partial", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"key_action",  type:"radio", style:"vertical-align:middle;", ttype:"KEY_PARTIAL", onchange:"TASApp.gbl.search_tab.get_selected_content_sign_reset(this)"}, row.cells[2]);
            row = this.get_table_row(table, {}, 'td', [{width:"70%"}, {txt:"Complete", width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {id:"key_complete_action_id", name:"key_action",  type:"radio", style:"vertical-align:middle;", checked:true, ttype:"KEY_COMPLETE", onchange:"TASApp.gbl.search_tab.get_selected_content_sign_reset(this)"}, row.cells[2]);
            row = this.get_table_row(table, {style:"border-bottom:1px solid #3B3A3A;"}, 'td', [{width:"70%"}, {width:"20%", style:"text-align: right;"}, {}])
            input = this.createDOM("input", {name:"key_secific_action", id:"key_content_action_id", type:"text", style:"vertical-align:left; width: 120px;", placeholder:"Specific Text", disabled:true, ttype:"KEY_TEXT"}, row.cells[1]);
            input = this.createDOM("input", {name:"key_action",  type:"radio", style:"vertical-align:middle;", ttype:"KEY_SPECIFIC", onchange:"TASApp.gbl.search_tab.get_selected_content_sign(this)"}, row.cells[2]);
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

    this.load_classified_taxo_info = function(elem){
        elem.innerHTML = "";
        var keys    = Object.keys(this.classify_taxonomy);
        keys.sort();
        this.createDOM('option', {txt:"Select Taxonomy", taxo_id:""}, elem);
        for(var ind = 0, len = keys.length; ind < len; ind++){
            var value1   = this.classify_taxonomy[keys[ind]];
            this.createDOM('option', {txt:value1[0], taxo_id:keys[ind]}, elem);
        }
        if (keys.length > 0){
            return true;
        }
        return false;
    }

    this.apply_index_data = function(elem){
        
        this.Id('del-multi').style.display = "none";
        this.gbl_remove_apply_sign_data  = {};
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
            TASApp.gbl.search_tab.selected_classified_taxo_id = ""
            this.selected_taxonomy_row_id = "";
        	this.Id('kve_mark_taxonomy_tab').click();
	        this.Id("kve_clear_tab").style.display = 'none';
	    }
    } 
    this.apply_agree_index_data = function(){
        this.Id("kve_prof_tab_menu_content").style.display = 'block';
    } 
    this.kve_show_remark_index = function(crop_crods, crop_id, index_type){
        this.cgi_apply_index_data = this.apply_index_data_remark;
        this.cmd_id = 11;
        crop_id = crop_id + ":^^:" + TASApp.gbl.search_tab.gbl_doc_id; 
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id] = {}
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].taxo_id = "";
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].taxo_name = "";
        gr_type = TASApp.gbl.search_tab.selected_div_json_crop[crop_id].modify_key_type = (index_type == 'Key Index')?'KEY':'VALUE';
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].cord = crop_crods;
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].apply = 0;
        table_head_tr = this.get_table_row(this.Id("kve_taxonomy_table"), {id:crop_id, kv_ref_id:crop_id, group_type:2}, "td", [{class:"prof_td", txt:crop_crods, width:"24%", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.kve_highlight_group_dyn(this);"}, {class:"prof_td", txt:gr_type, width:"50%", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.kve_highlight_group_dyn(this);"}, {class:"prof_td", txt:"", style:"text-align: center; color:#6E9DBF"}]);
        var div = this.createDOM("div", {}, table_head_tr.cells[2]);
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"images/closex.png", width:17+'px', height:17+'px', style:"padding:0px 1px; margin:0px 0px; vertical-align:middle;", onclick:"TASApp.gbl.search_tab.kve_delete_selected_group_dyn(this)"}, div);
        
		var json	= {doc_id:TASApp.gbl.search_tab.gbl_doc_id, cords:[crop_crods], taxo_id_lst:[], prof_id:1, user_id:TASApp.gbl.user_id, agent_id:TASApp.gbl.agent_id, mgmt_id:TASApp.gbl.mgmt_id, group_id:1, pw:"", ph:"", d_cord:"", idx:"", parent_idx:"", idx_key:"", level_id:""};
		TASApp.gbl.canvas_data.push(json)
    }
    this.highlight_cord_in_canvas = function(crop_crods, index_type){
        var can_div = this.Id('mg_kdiv_tt');
        var doc     = this.doc;
        if (!can_div){
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
        this.Id("kve_configure_signature_type_drop_down").style.display = 'none';
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

        //table_head_tr = this.get_table_row(taxo_table, {group_type:2, style:'background:#DCE6F2;'}, "td", [{class:"prof_td", txt:"Coordinate", width:"24%", style:"text-align: center;"}, {class:"prof_td", txt:"Index Type", width:"50%", style:"text-align: center;"}, {class:"prof_td", txt:"Del", style:"text-align: center;"}]);
        this.Id("kve_clear_tab").style.display = 'block';
        
        var canDiv = this.Id('Con_Div');

        TASApp.gbl.search_tab.canvas = new Canvas();
        TASApp.gbl.search_tab.canvas.init(canDiv, document, "main_div1", this.save_crop_data, 'group_highlighter');
        TASApp.gbl.search_tab.canvas.runcanvas_mgnt();
        TASApp.gbl.search_tab.canvas.show_taxonomy_tree();
    }
    this.save_crop_data = function(){
        var taxo_id = this.data.taxo_id;
        var taxo_name = this.data.taxo_name; 
	    var co_ordi     = this.getSelectedCord();
	    var rect_id     = this.getSelectedCord_undo();
        TASApp.gbl.search_tab.kve_show_remark_index(co_ordi, rect_id, taxo_name);
        this.mdtool_select = "group_highlighter";
        this.hide_popup_div(); 
    }
    this.show_signature_types = function(){
            var div = this.Id("kve_signature_type");
            div.innerHTML = "";
            var select_elm = this.createDOM('select', {id:"kve_signature_type_drop_down", style:"width: 120px;display:none;"}, div);
            for(var i = 0; i < this.gbl_signature_type.length; i++){
                this.createDOM('option', {id:i, txt:this.gbl_signature_type[i], onclick:"TASApp.gbl.search_tab.apply_kve_signature_type(this)"}, select_elm);
            }
            this.Id("kve_signature_type").firstChild.click();
    }
    this.sort_by = function(){
            var div = this.Id("kve_sort_by_menu");
            div.innerHTML = "";
            var select_elm = this.createDOM('select', {id:"kve_sort_prof_tab_menu_drop_down", style:"background: none repeat scroll #7691a4;border:1px solid #dedede; color:#fff;float:left;font-size: 11px;font-family: arial;height:20px;margin: 3px 0px;width:120px;"}, div);
            for(var i = 0; i < this.gbl_sort_data.length; i++){
                this.createDOM('option', {id:i, txt:this.gbl_sort_data[i], onclick:"TASApp.gbl.search_tab.kve_sort_profile_index_table(this)"}, select_elm);
            }
    }
    this.apply_kve_signature_type = function(elem){
        this.signature_type = Number(elem.id);
    }
    this.kve_sort_profile_index_table = function(elem){
        this.sort_index = Number(elem.id);
        this.show_profile_table();
    }
    this.save_index_data_remark = function(elem){
        this.Id('del-multi').style.display = "block";
        this.show_process_bar();
        this.Id("kve_sort_by_menu").style.display = 'block';
        
        elem.style.display = "none";
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:1%;"}, this.Id("kve_prof_tab_menu_content"));
        var listofcords = [];
        for (kk in this.selected_div_json_crop){
            jsonMarkData = {doc_id:TASApp.gbl.search_tab.gbl_doc_id,remark_cords:this.selected_div_json_crop[kk].cord, index_type:this.selected_div_json_crop[kk].modify_key_type.toLowerCase(), apply:this.selected_div_json_crop[kk].apply}
            listofcords.push(jsonMarkData);
        }
        this.Id('kve_clear_tab').click(); 
        var json	= this.merge_json({cmd_id:8, remark_data:listofcords});
        
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?';
		var post_data		= "input_str=" + JSON.stringify(json);
		this.Logger.push("Save Remark CGI... "+vservice_path+post_data+" === ");
   		this.send_ajax_request(vservice_path, post_data, 1, "TASApp.gbl.search_tab.show_save_data_remark(json)" , "POST", true);
    } 


    this.save_index_data_taxonomy = function(elem){
        this.Id('del-multi').style.display = "block";
        this.show_process_bar();
        this.Id("kve_sort_by_menu").style.display = 'block';
        
        elem.style.display = "none";
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:1%;"}, this.Id("kve_prof_tab_menu_content"));
        var listofcords = [];
        for (kk in this.selected_div_json_crop){
            jsonMarkData = {doc_id:TASApp.gbl.search_tab.gbl_doc_id,remark_cords:this.selected_div_json_crop[kk].cord, taxo_id:this.selected_div_json_crop[kk].taxo_id, taxo_name:this.selected_div_json_crop[kk].taxo_name, index_type:this.selected_div_json_crop[kk].modify_key_type.toLowerCase(), apply:this.selected_div_json_crop[kk].apply}
            listofcords.push(jsonMarkData);
        }
        var signJson = this.get_sign_info();
        var json	= this.merge_json({cmd_id:5, data:TASApp.gbl.search_tab.selected_div_json_new, overlay_mark:listofcords, sig_match_type:this.signature_type, sigconfig:signJson, deleted_rows:this.gbl_remove_apply_sign_data});
        this.Id('kve_clear_tab').click(); 
        
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?';
		var post_data		= "input_str=" + JSON.stringify(json);
		this.Logger.push("Save CGI... "+vservice_path+post_data+" === ");
   		this.send_ajax_request(vservice_path, post_data, 1, "TASApp.gbl.search_tab.show_save_data_taxonomy(json)" , "POST", true);
    } 

    this.get_sign_info = function(){
            var signJson = {}
            if (this.Id('dynamic_drop_down')){
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
                    var level_id, sub_level_id, inputElms = this.Id('level_sign_div').querySelectorAll('input[name="each_level_select"]:checked');
                    signJson['user_level'] = {}
                    signJson['user_level']['ulevels'] = []
                    signJson['user_level']['ulevelid_lst'] = []
                    for (var i=0; i<inputElms.length; i++){
                        level_id = inputElms[i].getAttribute('level_id')
                        sub_level_id = inputElms[i].getAttribute('sub_level_id')
                        signJson['user_level']['ulevels'].push([Number(level_id), Number(sub_level_id)])
                    } 
                    elm = this.Id('dynamic_drop_down').querySelector('input[name="key_action"]:checked');
                    el = elm.getAttribute('ttype')
                    if (el == "KEY_SPECIFIC"){
                        el = this.Id('key_content_action_id').value;
                        signJson['KEY_TEXT'] = el
                    }
                    else{
                        signJson[el] = 1
                    }
            }
            return signJson
    }

    this.apply_index_data_remark = function(elem){
            this.Id('kve_apply_agree_tab').style.display = "none";
            this.save_index_data = this.save_index_data_remark;
            this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
            var apply = (elem.id == 'kve_local_apply_tab') ? 1 : 0;
            var listofcords = [];
            for (kk in this.selected_div_json_crop){
                jsonMarkData = {doc_id:TASApp.gbl.search_tab.gbl_doc_id,remark_cords:this.selected_div_json_crop[kk].cord, index_type:this.selected_div_json_crop[kk].modify_key_type.toLowerCase(), apply:apply}
                listofcords.push(jsonMarkData);
            }
            var json    = this.merge_json({cmd_id:7, remark_data:listofcords});
			var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?';
			var post_data		= "input_str=" + JSON.stringify(json);
			this.Logger.push("Apply Remark CGI... "+vservice_path+post_data+" === ");
       		this.send_ajax_request(vservice_path, post_data, 1, "TASApp.gbl.search_tab.load_applied_data_remark(json)" , "POST", true);

    }
    this.apply_index_data_taxonomy = function(elem){
            var apply_flag_1 = (elem.id == 'kve_local_apply_tab') ? 1 : 0;
            this.Id('kve_apply_agree_tab').style.display = 'block';
            this.Id('kve_local_apply_tab').style.display = "none";
            this.Id('kve_global_apply_tab').style.display = "none";
            this.Id("kve_configure_signature_type_drop_down").style.display = 'none';
            this.save_index_data = this.save_index_data_taxonomy;
            this.show_process_bar();
            this.deselect_kv_taxonomy();
            this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
            var listofcords = [];
            for (kk in this.selected_div_json_crop){
                jsonMarkData = {doc_id:TASApp.gbl.search_tab.gbl_doc_id,remark_cords:this.selected_div_json_crop[kk].cord, taxo_id:this.selected_div_json_crop[kk].taxo_id, taxo_name:this.selected_div_json_crop[kk].taxo_name, index_type:this.selected_div_json_crop[kk].modify_key_type.toLowerCase(), apply:apply_flag_1}
                listofcords.push(jsonMarkData);
            }
            for (kk in TASApp.gbl.search_tab.selected_div_json){
                TASApp.gbl.search_tab.selected_div_json[kk].apply = apply_flag_1;
            }
            TASApp.gbl.search_tab.selected_div_json_new = {}
            var tdata = [];
            for (kk in this.selected_div_json){
                if (!TASApp.gbl.search_tab.selected_div_json_new.hasOwnProperty(this.selected_div_json[kk].doc_id)){
                    TASApp.gbl.search_tab.selected_div_json_new[this.selected_div_json[kk].doc_id]  = {};
                }
                if (!TASApp.gbl.search_tab.selected_div_json_new[this.selected_div_json[kk].doc_id].hasOwnProperty(this.selected_div_json[kk].taxo_id)){
                    TASApp.gbl.search_tab.selected_div_json_new[this.selected_div_json[kk].doc_id][this.selected_div_json[kk].taxo_id] = {refids:[], taxo_name:this.selected_div_json[kk].taxo_name};
                }
                tdata = [kk, this.selected_div_json[kk].modify_key_type, this.selected_div_json[kk].apply];
                TASApp.gbl.search_tab.selected_div_json_new[this.selected_div_json[kk].doc_id][this.selected_div_json[kk].taxo_id].refids.push(tdata)
            }

            var signJson = this.get_sign_info();
            this.Logger.push("DYN : "+JSON.stringify(this.selected_div_json_new));
            var json    = this.merge_json({cmd_id:3, data:TASApp.gbl.search_tab.selected_div_json_new, overlay_mark:listofcords, sig_match_type:this.signature_type, sigconfig:signJson});

			var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?';
			var post_data		= "input_str=" + JSON.stringify(json);
			this.Logger.push("Apply Taxonomy CGI... "+vservice_path+post_data+" === ");
       		this.send_ajax_request(vservice_path, post_data, 1, "TASApp.gbl.search_tab.load_applied_data_taxonomy(json)" , "POST", true);

    }

    this.init_layout = function(){
        var profile_div		= this.Id('url_content_1_home');
        profile_div.innerHTML = "";
	    this.createDOM("div",{id:"kve_tab_trained_content", style:"height: "+this.trained_grid_height+"px; width:100%; float: left;"}, profile_div);
	    this.createDOM("div",{id:"kve_tab_mark_content", style:"height: "+this.url_height+"px; width:100%; float: left;"}, profile_div);
	    this.createDOM("div",{id:"kve_tab_taxonomy_content", style:"height: "+this.url_element_height+"px; width:100%; float: left;"}, profile_div);
        var menu        = this.Id('profile_div');
        menu.innerHTML = "";
        this.createDOM("div",{id:"kve_prof_tab_menu_header1", class:"sb_kveRemainderMainDiv", style:"height: 25px;"}, menu);
        this.createDOM("div",{id:"kve_prof_tab_menu_header", class:"sb_kveRemainderMainDiv", style:"height: 25px;"}, menu);
        this.createDOM("div",{id:"kve_prof_tab_menu_content", style:"height: "+(this.profile_height-50)+"px; width:100%; float: left; overflow: auto; max-height: "+(this.profile_height-50)+"px;"}, menu);
    }
    this.cgi_fill_kve_trained_index_table   = function(){
        var json	= this.merge_json({cmd_id:0});
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?input_str=';
	    vservice_path		+= JSON.stringify(json);
	    this.Logger.push("Profile CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.fill_kve_trained_index_table(json)" , "GET", true);
    
    }
    this.fill_kve_trained_index_table   = function(data){
        var content_div = this.Id("kve_tab_trained_content");
        content_div.innerHTML = '';
        var innertable = this.createDOM("table",{id:"kve_tained_table_prof", width:"100%", style:"border-collapse: collapse;"}, content_div);
        this.get_table_row(innertable, {}, "th", [{txt:"Profiles", width:"19%", class:"kve_header"}, {txt:"Trained", width:"19%", class:"kve_header"}, {txt:"Cleared", width:"18%", class:"kve_header"}, {txt:"Not cleared", width:"18%", class:"kve_header"}, {txt:"Partial", class:"kve_header"}])
        var row;
        for(var i = 0; i < data.length; i++){
             row = this.get_table_row(innertable, {id:'kve_trained_prof_'+(i+1), 'kve_train_index':data[i].total_trained}, "td", [{txt:data[i].total_profiles, width:"19%", class:"prof_td", style:"text-align: center; color:#4b606f;"}, {txt:data[i].total_trained, width:"19%", class:"prof_td", style:"text-align: center; color:#4b606f;"}, {txt:data[i].total_clear, width:"19%", class:"prof_td", style:"text-align: center; color:#4b606f;"}, {txt:data[i].total_pending, width:"20%", class:"prof_td", style:"text-align: center; color:#4b606f;"}, {txt:data[i].total_partial, width:"20%", class:"prof_td", style:"text-align: center; color:#4b606f;"}]);
        }
    }
    this.add_taxonomy_tab = function(header_td){
        var div = this.createDOM("div", {id:"kve_taxonomy_header"}, header_td);
        var ul = this.createDOM("ul", {}, div);
        var li = this.createDOM("li", {txt:"Remark", id:"kve_remark_tab", onclick:"TASApp.gbl.search_tab.get_crop_coordinates(this);"}, ul);
        var li = this.createDOM("li", {txt:"Topic-Classified", id:"kve_mark_taxonomy_tab", class:"active", onclick:"TASApp.gbl.search_tab.get_classified_taxonomy(this);"}, ul);
        var li = this.createDOM("li", {txt:"Topic-Unclassified", id:"kve_unmark_taxonomy_tab",  onclick:"TASApp.gbl.search_tab.get_unclassified_taxonomy(this)"}, ul);
        var li = this.createDOM("li", {txt:"Unclassified-Groups", id:"kve_unmark_group_tab",  onclick:"TASApp.gbl.search_tab.get_unclassified_group(this)"}, ul);
    }
    this.get_unclassified_group = function(elem){
        this.show_process_bar();
        TASApp.gbl.search_tab.selected_div_json_crop  = {};
        try{this.Id("kve_taxonomy_header").querySelector("li.active").className = "";}catch(e){}
        elem.className = "active";
        taxo_table = this.Id("kve_taxonomy_table");
        taxo_table.innerHTML = "";
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:10%;"}, this.Id("kve_taxonomy_table"));
        var json	= this.merge_json({cmd_id:16});
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?input_str=';
		vservice_path		+= JSON.stringify(json);
		this.Logger.push("UNCLASSIFIED GROUP CGI... "+vservice_path+" === ");
       	this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.load_kve_unclassified_group(json)" , "GET", true);
    }
    this.load_kve_unclassified_group = function(data){
        this.hide_process_bar();
        var taxo_table = this.Id("kve_taxonomy_table");
        taxo_table.innerHTML = "";
        row  = this.get_table_row(taxo_table, {group_type:2}, "th", [{class:"taxo_header"},{class:"taxo_header"}, {class:"taxo_header", style:"text-align: center;"}]);
        row.cells[0].innerHTML = '<div class="th-inner">SI NO.</div>'        
        row.cells[1].innerHTML = '<div class="th-inner">HEADER NAME</div>'        
        row.cells[2].innerHTML = '<div class="th-inner">TOTAL</div>'        
        for (var i=0; i<data.length; i++){
            row = this.get_table_row(taxo_table, {class:"kve_unclassified_group", id:"kve_taxonomy_table_inner_tr-"+(i+1), onclick:"TASApp.gbl.search_tab.cgi_add_kve_profile_index_table_unclassified(this)", ref_Id:data[i][2]}, "td", [{class:"prof_td", txt:(i+1),  width:'10%'}, {id:i+1, txt:data[i][0], class:"prof_td", width:'70%'}, {txt:data[i][1], class:"prof_td"}]);
        }
        this.Id("kve_taxonomy_table_inner_tr-1").click();
    }
    this.add_kve_taxonomy_index_table    = function(classify_taxonomy){ 
        this.classify_taxonomy = classify_taxonomy;
        this.fire_taxonomy_action();
    }
    this.load_kve_taxonomy_index_table    = function(){ 
        var content_div		= this.Id('kve_tab_taxonomy_content');
        content_div.innerHTML = "";
        this.add_taxonomy_tab(content_div);
        var div = this.createDOM('div', {class:'fixed-table-container', style:"float:left;height:"+(this.url_element_height-50)+"px;"}, content_div);       
        var div1 = this.createDOM('div', {class:'header-background', style:"background:#7691a4;"}, div);
        div = this.createDOM('div', {class:'fixed-table-container-inner'}, div);
        var table = this.createDOM("table",{id:"kve_taxonomy_table", width:"100%"}, div);
    }
    this.taxonomy_action_after_save  = function(){
        var cell_id, tab_type = {'profwise':2, 'keywise':3, 'valwise':4}
        var keys    = Object.keys(this.classify_taxonomy);
        if (keys.length > 0){
            this.Id("kve_mark_taxonomy_tab").click();
            if (this.selected_taxonomy_row_id != ""){
                cell_id = (TASApp.gbl.search_tab.col_type) ? tab_type[TASApp.gbl.search_tab.col_type] : 2;
                this.Id(this.selected_taxonomy_row_id).cells[cell_id].firstChild.click();
            }
            else{
                this.Id("kve_taxonomy_table_inner_tr_1").cells[2].firstChild.click();
            }
        }
        else{
            this.Id("kve_unmark_taxonomy_tab").click();
            this.selected_tab_one_flag = "Tbs_2";
            this.Id('kve_topic_view_tab').click(); 
        } 
    }
    this.taxonomy_action  = function(){
        var keys    = Object.keys(this.classify_taxonomy);
        if (keys.length > 0){
            TASApp.gbl.search_tab.selected_classified_taxo_id = ""
            this.selected_taxonomy_row_id = "";
            this.Id("kve_mark_taxonomy_tab").click();
            this.selected_taxonomy_row_id = "kve_taxonomy_table_inner_tr_1";        
        }
        else{
            this.Id("kve_unmark_taxonomy_tab").click();
            this.selected_tab_one_flag = "Tbs_2";
            this.Id('kve_topic_view_tab').click(); 
        }
    }       
    this.get_unclassified_taxonomy = function(elem){ 
        TASApp.gbl.search_tab.selected_taxo_id = -1;
        this.Id("kve_configure_signature_type_drop_down").style.display = 'block';
        TASApp.gbl.search_tab.selected_div_json_crop  = {};
        try{this.Id("kve_taxonomy_header").querySelector("li.active").className = "";}catch(e){}
        elem.className = "active";
        var taxo_table = this.Id("kve_taxonomy_table");
        taxo_table.innerHTML = "";
        var row  = this.get_table_row(taxo_table, {}, "th", [{class:"taxo_header"},{class:"taxo_header"}, {class:"taxo_header"},{class:"taxo_header"}]);
        row.cells[0].innerHTML = '<div class="th-inner">SL.No</div>'        
        row.cells[1].innerHTML = '<div class="th-inner">Topic Name</div>'        
        row.cells[2].innerHTML = '<div class="th-inner">SL.No</div>'        
        row.cells[3].innerHTML = '<div class="th-inner">Topic Name</div>'        
        var keys = [], tkeys    = Object.keys(TASApp.gbl.taxo_name_mapping);
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
            var row = this.get_table_row(taxo_table, {}, "td", [{class:"prof_td", style:'width:10%'}, {taxo_id:value1.id, txt:"<span>"+value1.name+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_kv_taxonomy_content(this)"  }, {class:"prof_td", style:'width:10%' }, {taxo_id:value2.id, txt:"<span>"+value2.name+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_kv_taxonomy_content(this)", style:"text-align:left;"}]);
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
            var def_scroll = this.Id('kve_taxonomy_table').parentNode.scrollTop;
            this.Id('kve_taxonomy_table').parentNode.scrollTop = def_scroll - 30;
        }catch(e){}
    }
    this.get_classified_taxonomy = function(elem){
        try{this.Id("kve_taxonomy_header").querySelector("li.active").className = "";}catch(e){}
        elem.className = "active";
        this.Id("kve_configure_signature_type_drop_down").style.display = 'block';
        this.Id('kve_clear_tab').click(); 
        TASApp.gbl.search_tab.selected_div_json_crop  = {};
        this.load_classified_taxonomy()
    }
    this.load_classified_taxonomy = function(){
        TASApp.gbl.search_tab.selected_taxo_id = -1;
        taxo_table = this.Id("kve_taxonomy_table");
        taxo_table.innerHTML = "";
        var row  = this.get_table_row(taxo_table, {}, "th", [{class:"taxo_header"},{class:"taxo_header"}, {class:"taxo_header"},{class:"taxo_header"},{class:"taxo_header"},{class:"taxo_header"}]);
        row.cells[0].innerHTML = '<div class="th-inner">SL.No</div>'        
        row.cells[1].innerHTML = '<div class="th-inner">Topic Name</div>'        
        row.cells[2].innerHTML = '<div class="th-inner">Applied Profiles</div>'        
        row.cells[3].innerHTML = '<div class="th-inner">By-Key</div>'        
        row.cells[4].innerHTML = '<div class="th-inner">By-Value</div>'        
        row.cells[5].innerHTML = '<div class="th-inner">Del</div>'        
        var keys    = Object.keys(this.classify_taxonomy);
        keys.sort();
        var len = keys.length;
        var taxo_table_tr;
        this.Logger.push("load taxonomy === "+len+" === "+keys);
        for(var ind = 0; ind < len; ind++){
            var value1   = this.classify_taxonomy[keys[ind]];
            var class1 = (TASApp.gbl.search_tab.selected_classified_taxo_id == Number(keys[ind]))?"active_taxonomy_index":"prof_td"; 
           
            var row = this.get_table_row(taxo_table, {id: "kve_taxonomy_table_inner_tr_"+(ind+1)}, "td", [{class:"prof_td", style:"width:10%;"}, {taxo_id:keys[ind], style:"width:30%;", class:"prof_td"}, {taxo_id:keys[ind], class:"prof_td", style:"width:25%;text-align: center;"}, {taxo_id:keys[ind], class:"prof_td", style:"width:15%;text-align: center;"}, {taxo_id:keys[ind], class:"prof_td", style:"width:15%;text-align: center;"}, {taxo_id:keys[ind], class:"prof_td", style:"text-align: center;"}]);
            row.cells[2].className = (TASApp.gbl.search_tab.col_type == 'profwise') ? class1:"prof_td"; 
            row.cells[3].className = (TASApp.gbl.search_tab.col_type == 'keywise') ? class1:"prof_td"; 
            row.cells[4].className = (TASApp.gbl.search_tab.col_type == 'valwise') ? class1:"prof_td"; 

            this.createDOM("input",{id:keys[ind], taxo_id: keys[ind],  name:"target_taxonomy", type:"radio", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_kv_taxonomy(this)"}, row.cells[0]);
            var label = this.createDOM("label",{style:"margin-left:2px;" },row.cells[0]);
            label.innerHTML = ind+1;
            this.createDOM("span", {taxo_id:keys[ind], txt:value1[0], onclick:"TASApp.gbl.search_tab.select_kv_taxonomy_content(this)"}, row.cells[1]);
            this.createDOM("a", {href:"javascript:void(0)", col_type:"profwise", tot_ext:value1[1], txt:value1[1], style:"color:"+this.color_group_type[value1[5]], onclick:"TASApp.gbl.search_tab.get_classified_profiles(this)"}, row.cells[2]);
            this.createDOM("a", {href:"javascript:void(0)", col_type:"keywise", tot_ext:value1[6], txt:value1[6], style:"color:"+this.color_group_type[value1[5]], onclick:"TASApp.gbl.search_tab.get_classified_profiles(this)"}, row.cells[3]);
            this.createDOM("a", {href:"javascript:void(0)", col_type:"valwise", tot_ext:value1[7], txt:value1[7], style:"color:"+this.color_group_type[value1[5]], onclick:"TASApp.gbl.search_tab.get_classified_profiles(this)"}, row.cells[4]);
            this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"images/closex.png", width:17+'px', height:17+'px', style:"padding:0px 1px; margin:0px 0px; vertical-align:middle;", onclick:"TASApp.gbl.search_tab.kve_delete_classified_selected_group(this)"}, row.cells[5]);
            if (class1  == "active_taxonomy_index"){
                row.cells[0].firstChild.click();
            }
        }
        
        /*var indiv_arr   = [row_Head]
        var table       = taxo_table;    
        this.create_indiv(indiv_arr,table);
        this.assign_fn(table,indiv_arr);
        this.scroll_head(table,indiv_arr);*/
    }
    
    this.kve_delete_classified_selected_group = function(elem){
        var taxo_id = elem.parentNode.getAttribute('taxo_id');
        var taxo_name = this.classify_taxonomy[taxo_id][0];
        this.Id(''+taxo_id).click();
        var r=confirm('Do you want To Delete the "'+taxo_name+'" Across ');
        if (r==true) {
           this.cgi_kve_delete_classified_selected_group(elem);
        }else
            return;
    }
    this.cgi_kve_delete_classified_selected_group = function(elem){
        this.show_process_bar();
        TASApp.gbl.search_tab.selected_taxo_id = -1;
        var taxo_id = elem.parentNode.getAttribute('taxo_id');
        var taxo_name = this.classify_taxonomy[taxo_id][0];
        var signJson = this.get_sign_info();
        var json	= this.merge_json({cmd_id:15, taxo_id:taxo_id, taxo_name:taxo_name, sigconfig:signJson});
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?input_str=';
		vservice_path		+= JSON.stringify(json);
		this.Logger.push("Delete taxo CGI... "+vservice_path+" === ");
       	this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.show_classified_profiles_delete(json)" , "GET", true);
    }
    this.show_classified_profiles_delete = function(data){
        this.hide_process_bar();
        this.reset_profile_after_save();
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
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?input_str=';
		vservice_path		+= JSON.stringify(json);
		this.Logger.push("Classify taxo CGI... "+vservice_path+" === ");
       	this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.show_classified_profiles(json)" , "GET", true);
    }

    this.get_classified_profiles = function(elem){
        this.selected_taxonomy_row_id = elem.parentNode.parentNode.id;
        //this.show_profile_table= this.change_sort_order;
        var col_type = elem.getAttribute('col_type');
        var tot_ext = elem.getAttribute('tot_ext');
        var taxo_id = Number(elem.parentNode.getAttribute('taxo_id'));
        TASApp.gbl.search_tab.selected_classified_taxo_id = taxo_id;
        TASApp.gbl.search_tab.tot_ext = tot_ext;
        TASApp.gbl.search_tab.col_type = col_type;
        var taxo_name = this.classify_taxonomy[taxo_id][0];
        elem.parentNode.parentNode.firstChild.firstChild.click();
        try{elem.parentNode.parentNode.parentNode.querySelector('td.active_taxonomy_index').className = "prof_td";}catch(e){}
        elem.parentNode.className = 'active_taxonomy_index';
        this.selected_tab_one_flag = "Tbs_1";
        this.selected_tab_two_flag = "kve_remainder_complete_tab_id";
        this.Id('kve_topic_view_tab').click();
    } 
        
    this.load_topic_profile_data = function(){
        this.show_process_bar();
        var taxo_id = TASApp.gbl.search_tab.selected_classified_taxo_id;
        var taxo_name = this.classify_taxonomy[taxo_id][0]; 
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
        var json	= this.merge_json({cmd_id:12, ref_index:this.sort_index, taxo_id:taxo_id, taxo_name:taxo_name});
        json[TASApp.gbl.search_tab.col_type] = TASApp.gbl.search_tab.tot_ext;
        this.last_action_id = 2;
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?input_str=';
		vservice_path		+= JSON.stringify(json);
		this.Logger.push("Classify taxo CGI... "+vservice_path+" === ");
       	this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.show_classified_profiles(json)" , "GET", true);
    }
    this.get_profile_view_data = function(){
        this.show_process_bar();
         this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
        var json	= this.merge_json({cmd_id:54, ref_index:this.sort_index});
        this.last_action_id = 2;
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?input_str=';
		vservice_path		+= JSON.stringify(json);
		this.Logger.push("Profile view CGI... "+vservice_path+" === ");
       	this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.show_profile_view(json)" , "GET", true);
    }
    this.show_profile_view = function(data){
        TASApp.gbl.search_tab.kve_classify_data = data;
        this.hide_process_bar();
        this.Id(this.selected_tab_two_flag).click(); 
    }
    this.show_classified_profiles = function(data){
        TASApp.gbl.search_tab.kve_classify_data = data;
        this.hide_process_bar();
        this.Logger.push("===flag :"+this.selected_tab_two_flag);
        this.Id(this.selected_tab_two_flag).click(); 
    }
    this.select_kv_taxonomy = function(elem){
         TASApp.gbl.search_tab.selected_taxo_id = Number(elem.id);
         try{elem.parentNode.parentNode.parentNode.querySelector('span.active_taxonomy_index').className = "";}catch(e){}
         elem.parentNode.nextSibling.firstChild.className = 'active_taxonomy_index';
    }
    this.deselect_kv_taxonomy = function(){
         TASApp.gbl.search_tab.selected_taxo_id = -1;
         var inputElm = this.Id("kve_taxonomy_table").querySelector('input:checked')
         if (inputElm){
                inputElm.checked = false;
                try{inputElm.parentNode.parentNode.parentNode.querySelector('span.active_taxonomy_index').className = "";}catch(e){}
         }
    }

    this.add_kve_mark_index_table    = function(data){
        var profile_div		= this.Id('kve_tab_mark_content');
        profile_div.innerHTML = "";
        var table = this.createDOM("table",{id:"kve_mark_tab_content_table", width:"100%"}, profile_div);
        var table_head = this.createDOM("thead",{}, table);
        var row = this.get_table_row(table_head, {class:"kve_mark_tab_content_table_header"}, "th", [{txt:"Mark Index", width:"24%"}, {txt:"Index Type", width:"25%"}, {txt:"Topic Name", width:"25%"}, {txt:"", width:"25%"}])
        var table_body = this.createDOM("tbody",{}, table);
        var table_tr = this.createDOM("tr",{}, table_body);
        var table_td = this.createDOM("td",{colspan:"4"}, table_tr);
        var inner_div = this.createDOM("div",{style:"height:"+(this.url_height-25)+"px;overflow: auto;float:left;width:100%"}, table_td);
        var innertable = this.createDOM("table",{id:"kve_mark_tab_content_table_inner", width:"100%", style:"border-collapse: collapse; border-bottom:#d3e8f7 1px solid;"}, inner_div);
    }
    this.change_mark_apply_flag = function(elem){
        var flg = false, inputElms;
        if (elem.checked){
            inputElms = this.Id('kve_mark_tab_content_table_inner').querySelectorAll('input[name="apply_flag"]:not(:checked)');
            flg = true;
        }
        else{
            inputElms = this.Id('kve_mark_tab_content_table_inner').querySelectorAll('input[name="apply_flag"]:checked');
        }
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = flg;
        } 
    }
    
    this.kve_deleteMarkRow = function(div_id){
        this.Id("kve_mark_tab_content_table_inner").removeChild(this.Id(div_id+"_left"));
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
        crop_id = crop_id + ":^^:" + TASApp.gbl.search_tab.gbl_doc_id; 
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id] = {}
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].taxo_id = TASApp.gbl.search_tab.selected_taxo_id;
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].taxo_name = taxo_name;
        gr_type = TASApp.gbl.search_tab.selected_div_json_crop[crop_id].modify_key_type = (index_type == 'Key Index')?'KEY':'VALUE';
        TASApp.gbl.search_tab.selected_div_json_crop[crop_id].cord = crop_crods;
        //Panel.browser_window.load_blocks_highlight_dyn(crop_crods, crop_id , '#0000ff');
        table_head_tr = this.get_table_row(this.Id("kve_mark_tab_content_table_inner"), {id:crop_id, kv_ref_id:crop_id, group_type:2}, "td", [{class:"prof_td", txt:crop_crods, width:"24%", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.kve_highlight_group_dyn(this);"}, {class:"prof_td", txt:gr_type, width:"25%", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.kve_highlight_group_dyn(this);"}, {class:"prof_td", txt:taxo_name, width:"25%", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.kve_highlight_group_dyn(this);"}, {class:"prof_td", txt:"", width:"25%", style:"text-align: center; color:#6E9DBF"}]);
        var div = this.createDOM("div", {}, table_head_tr.cells[3]);
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"images/closex.png", width:17+'px', height:17+'px', style:"padding:0px 1px; margin:0px 0px; vertical-align:middle;", onclick:"TASApp.gbl.search_tab.kve_delete_selected_group_dyn(this)"}, div);
        return true;
    }
    this.kve_addMarkRow = function(data, kv_ref_id){
        this.cgi_apply_index_data = this.apply_index_data_taxonomy;
        this.cmd_id = 3;
        var table_head_tr;
        if (TASApp.gbl.search_tab.selected_taxo_id == -1){
           return false;   
        }
        var taxo_name = TASApp.gbl.taxo_mapping[TASApp.gbl.search_tab.selected_taxo_id] || '';
        if (taxo_name == ''){
           return false;   
        }
        for(var i=0;i<data.length;i++){
             var rids = data[i].split('#')
             if (rids[0] in TASApp.gbl.search_tab.selected_div_json){
                var gr_type = (rids[1] == '1')?'KEY VALUE':(rids[1] == '2')?'KEY':(rids[1] == '3')?'VALUE':'BOUNDARY';
                this.Id(rids[0]+"_left").cells[0].innerHTML = data[i];
                this.Id(rids[0]+"_left").cells[1].innerHTML = gr_type;
                TASApp.gbl.search_tab.selected_div_json[rids[0]].modify_key_type = rids[1];
                continue
             }
             TASApp.gbl.search_tab.selected_div_json[rids[0]] = {}
             TASApp.gbl.search_tab.selected_div_json[rids[0]].taxo_id = TASApp.gbl.search_tab.selected_taxo_id;
             TASApp.gbl.search_tab.selected_div_json[rids[0]].taxo_name = taxo_name;
             TASApp.gbl.search_tab.selected_div_json[rids[0]].modify_key_type = rids[1];
             TASApp.gbl.search_tab.selected_div_json[rids[0]].apply = 0;
             TASApp.gbl.search_tab.selected_div_json[rids[0]].doc_id = TASApp.gbl.search_tab.gbl_doc_id;
             var fields = rids[0].split('!!')
             var gr_type = (rids[1] == '1')?'KEY VALUE':(rids[1] == '2')?'KEY':(rids[1] == '3')?'VALUE':'BOUNDARY';
             table_head_tr = this.get_table_row(this.Id("kve_mark_tab_content_table_inner"), {id:rids[0]+"_left", right_ref_id:rids[0], kv_ref_id:kv_ref_id}, "td", [{class:"prof_td", txt:data[i], width:"24%", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.kve_highlight_group(this);"}, {class:"prof_td", txt:gr_type, width:"25%", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.kve_highlight_group(this);"}, {class:"prof_td", txt:taxo_name, width:"25%", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.kve_highlight_group(this);"}, {class:"prof_td", txt:"", width:"15%", style:"text-align: center; color:#6E9DBF"}, {class:"prof_td", txt:"", width:"10%", style:"text-align: center; color:#6E9DBF"}]);
             var div = this.createDOM("div", {}, table_head_tr.cells[3]);
             this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"images/closex.png", width:17+'px', height:17+'px', style:"padding:0px 1px; margin:0px 0px; vertical-align:middle;", onclick:"TASApp.gbl.search_tab.kve_delete_selected_group(this)"}, div);
        }
        return true;   
    } 
    this.update_apply_flag_remark = function(elem){
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
    this.kve_highlight_group = function(elem){
        if (TASApp.gbl.search_tab.tab_index != 1){
            var right_ref_id = elem.parentNode.getAttribute('right_ref_id');
            var ref_id = elem.parentNode.getAttribute('kv_ref_id');
            var fields = ref_id.split('_');
            this.kve_load_html_preview(fields[5], fields[6], fields[7], 2, ref_id, right_ref_id);
            var taxo_id = TASApp.gbl.search_tab.selected_div_json[right_ref_id].taxo_id;
            this.Id(""+taxo_id).click(); 
            this.Id(""+taxo_id).scrollIntoView();
        }
    }
    this.kve_highlight_group_dyn = function(elem){
        var ref_id = elem.parentNode.getAttribute('kv_ref_id');
        var fields = ref_id.split(':^^:');
        if (TASApp.gbl.search_tab.gbl_doc_id == Number(fields[7])){
            this.highlight_cord_in_canvas(TASApp.gbl.search_tab.selected_div_json_crop[elem.parentNode.id].cord, TASApp.gbl.search_tab.selected_div_json_crop[elem.parentNode.id].modify_key_type);
        }
    }
    this.kve_delete_selected_group_dyn_old = function(elem){
        var div_id = elem.parentNode.parentNode.parentNode.id;
        if (div_id in TASApp.gbl.search_tab.selected_div_json_crop){
           delete TASApp.gbl.search_tab.selected_div_json_crop[div_id]; 
           Panel.browser_window.delete_block_dyn(div_id);
        }
        this.Id("kve_mark_tab_content_table_inner").removeChild(this.Id(div_id));
        var vcord_ids = div_id.split(":^^:")
        var vcord_tt = vcord_ids[0]+"_"+vcord_ids[1]+"_"+vcord_ids[2]+"_"+vcord_ids[3];
        RemoveRect(vcord_tt);
    }
    this.kve_delete_selected_group_dyn = function(elem){
        var div_id = elem.parentNode.parentNode.parentNode.id;
        if (div_id in TASApp.gbl.search_tab.selected_div_json_crop){
           delete TASApp.gbl.search_tab.selected_div_json_crop[div_id]; 
           Panel.browser_window.delete_block_dyn(div_id);
        }
        this.Id("kve_taxonomy_table").removeChild(this.Id(div_id));
        var vcord_ids = div_id.split(":^^:")
        var vcord_tt = vcord_ids[0]+"_"+vcord_ids[1]+"_"+vcord_ids[2]+"_"+vcord_ids[3];
        RemoveRect(vcord_tt);
    }

    this.kve_delete_selected_group = function(elem){
        var div_id_act = elem.parentNode.parentNode.parentNode.id;
        var div_id = elem.parentNode.parentNode.parentNode.getAttribute("right_ref_id");
        if (TASApp.gbl.search_tab.tab_index == 1){
            TASApp.gbl.search_tab.rightView.delete_block(div_id);
        }
        if (div_id in TASApp.gbl.search_tab.selected_div_json){
           delete TASApp.gbl.search_tab.selected_div_json[div_id]; 
        }
        this.Id("kve_mark_tab_content_table_inner").removeChild(this.Id(div_id_act));
    }
    this.add_kve_profile_index_table    = function(data){ 
        this.hide_process_bar();
        this.display_row = this.kve_create_level_data;
        var profile_div        = this.Id('kve_prof_tab_menu_content');
        profile_div.innerHTML = "";
		var table = this.createDOM("table",{id:"kve_table_prof", width:"100%"}, profile_div);
        var table_head_tr;
        var group_flag = 'R';
        for(var i=0;i<data.length;i++){
             if (data[i]){
                table_head_tr = this.get_table_row(table, {id:'kve_profile_index_tab_'+(i+1)}, "td", [{class:"prof_td", width:'9%', style:"text-align: center; color:#3e3e3e"}, {class:"prof_td", width:'30%', style:"text-align: left; padding-left:5px; color:#3e3e3e"}, {class:"prof_td", width:'61%', style:"text-align: center; color:#3e3e3e"}]);
                this.createDOM("span", {txt:i+1, id:"kve_sino_idx"}, table_head_tr.cells[0]);
	            var first_td_div	= this.createDOM("div",{}, table_head_tr.cells[1]);
	            //this.createDOM("span", {txt:"Profile ID "+data[i][0][1]}, first_td_div);
	            this.createDOM("span", {txt:""+data[i][0][1]}, first_td_div);
                if (group_flag == "R"){
	                this.createDOM("input", {class:"kve_prof_check_box_idx", type:"checkbox", style:"float:right;", disabled:"true"}, first_td_div);
                }
                else{
	                this.createDOM("input", {class:"kve_prof_check_box_idx", type:"checkbox", style:"float:right;"}, first_td_div);
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
         for (var ind = 1; ind < data[i].length; ind++){
            td_div = this.createDOM("div", {id:"kve_td_"+i+"_"+ind, style:"float:left;"}, td_div_main);

            this.createDOM("span", {txt:data[i][ind][2]+'.'+(data[i][ind][1]+1)+' ', id:data[i][0][0]+'_'+data[i][0][1]+'_'+data[i][ind].join('_'), kve_doc_id:data[i][ind][3], pw:data[i][ind][4]||800, ph:data[i][ind][5]||2500, cmd_id:2, onclick:"TASApp.gbl.search_tab.kve_load_html(this)"}, td_div);
	        if (data[i][ind][6] == 0){
	    	    td_div.className = "kve_prof_level_data_red"; 
	        }else{
	    	    td_div.className = "kve_prof_level_data_green"; 
	        }
         }
    }
    this.kve_load_html = function(elem){
         var pw = elem.getAttribute('pw'); 
         var ph = elem.getAttribute('ph');
	     sessionStorage['pw'] = pw;
         sessionStorage['ph'] = ph;
         var cmd_id = elem.getAttribute('cmd_id');
         var doc_id = elem.getAttribute('kve_doc_id')
	     sessionStorage['ref_id']  = encodeURIComponent(elem.id);
	     sessionStorage['cmd_id']  = cmd_id;
	     sessionStorage['doc_id'] = doc_id;
         if (!TASApp.gbl.search_tab.gbl_doc_id && cmd_id == '2' && TASApp.gbl.search_tab.tab_index == 1){
            TASApp.gbl.search_tab.gbl_doc_id = Number(doc_id);
         }
         if (TASApp.gbl.search_tab.gbl_doc_id != Number(doc_id) && cmd_id == '2' && TASApp.gbl.search_tab.tab_index == 1){
            //this.reset_mark_table();
            TASApp.gbl.search_tab.gbl_doc_id = Number(doc_id);
         }
         try{this.Id('kve_table_prof').querySelector("tr.active_kve_table_prof_row").className = ''}catch(e){}
         elem.parentNode.parentNode.parentNode.parentNode.className = 'active_kve_table_prof_row';
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
	     this.Logger.push("CLICKED DOC_ID : "+doc_id+" ===== ref_id :"+ elem.id);
         var json = JSON.parse(JSON.stringify(this.gbl_meta_data)); 
         json.doc_image_path = TASApp.config.IMAGE_IP;
         json.server_cgi_path = TASApp.config.CGI_IP;
         json.doc_id = doc_id;
         json.pw = pw;
         json.ph = ph;
         json.ref_id = elem.id;
         json.cmd_id = ""+cmd_id;
         json.select_id = "";
         this.Id("main_div1").style.display = "";
         this.Id("parent").style.display = "none";
         TASApp.gbl.search_tab.rightView = active_mapping_view(json)  
    }
    this.kve_load_html_preview = function(doc_id, pw, ph, cmd_id, ref_id, select_id){
         var json = JSON.parse(JSON.stringify(this.gbl_meta_data)); 
         json.doc_image_path = TASApp.config.IMAGE_IP;
         json.server_cgi_path = TASApp.config.CGI_IP;
         json.doc_id = doc_id;
         json.pw = pw;
         json.ph = ph;
         json.ref_id = ref_id;
         json.cmd_id = ""+cmd_id;
         json.select_id = select_id;
         this.Id("main_div1").style.display = "";
         this.Id("parent").style.display = "none";
	     this.Logger.push("CLICKED DOC_ID : "+doc_id+" ===== ref_id :"+ ref_id);
         TASApp.gbl.search_tab.rightView = active_mapping_view(json)  
    }
    this.set_drag_events    = function(elem){
        elem.setAttribute("ondragstart","return dragStart(event)");
        elem.setAttribute("draggable","true");
    }
    this.load_action_tab = function(){
        var tab_div1 = this.Id("kve_prof_tab_menu_header1")
        tab_div1.innerHTML = '';

	    var index_div1   = this.createDOM("div",{style:"background:#7691a4;width:100%;"}, tab_div1);
	    var ul  = this.createDOM("ul",{id:"kve_index_prof_tab1", style:"width:49%; float:left; margin:0;", kve_train_id:"0"}, index_div1);
	    this.createDOM("li", {txt:"Results", id:"Tbs_1", onclick:"TASApp.gbl.search_tab.cgi_add_kve_profile_index_table_tab(1);"}, ul);
	    //this.createDOM("li", {txt:" | ", id:"Tbs_1_sep"}, ul);
	    this.createDOM("li", {txt:"Training Samples", id:"Tbs_2", onclick:"TASApp.gbl.search_tab.cgi_add_kve_profile_index_table_tab(2);"}, ul);
	    this.createDOM("li", {txt:"Results Preview", id:"Tbs_3", style:'display:none;'}, ul);
        this.createDOM("div", {style:"float:left;width:auto;", id:"kve_sort_by_menu"}, index_div1);
        var imgdiv = this.createDOM("div", {style:"float:right;"}, index_div1);
        this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/setting_black.png", alt:"Configure", id:'kve_configure_signature_type_drop_down', onclick:"TASApp.gbl.search_tab.configure_signature(this)"}, imgdiv);
    }
    this.add_kve_remainder_elems    = function(){
        var tab_div = this.Id("kve_prof_tab_menu_header")
        tab_div.innerHTML = '';
        var index_div   = this.createDOM("div",{}, tab_div);
        var ul  = this.createDOM("ul",{id:"kve_index_prof_tab", style:"margin:0;", kve_train_id:"0"}, index_div);
        this.createDOM("li", {txt:"Not cleared", id:"kve_remainder_complete_tab_id", onclick:"TASApp.gbl.search_tab.kve_show_all_reminded_complete_profile_info(this)"}, ul);
        this.createDOM("li", {txt:" | "}, ul);
        this.createDOM("li", {txt:"Conflict", id:"kve_remainder_conflict_tab_id", onclick:"TASApp.gbl.search_tab.kve_show_all_conflict_profile_info(this)"}, ul);
        this.createDOM("li", {txt:" | "}, ul);
        this.createDOM("li", {txt:"Partial", id:"kve_remainder_partial_tab_id", onclick:"TASApp.gbl.search_tab.kve_show_all_partial_profile_info(this)"}, ul);
        this.createDOM("li", {txt:" | "}, ul);
        this.createDOM("li", {txt:"Cleared", id:"kve_cleared_tab_id", onclick:"TASApp.gbl.search_tab.kve_show_all_cleared_profile_info(this)"}, ul);


    }
    this.kve_show_all_reminded_complete_profile_info = function(elem){
        this.selected_tab_two_flag = elem.id;
        this.Id('kve_remainder_partial_tab_id').className    = "";
        this.Id('kve_remainder_complete_tab_id').className   = "tab_menu_active";
        this.Id('kve_remainder_conflict_tab_id').className   = "";
        this.Id('kve_cleared_tab_id').className              = "";
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
        this.selected_tab_two_flag = elem.id;
        this.Id('kve_remainder_partial_tab_id').className    = "";
        this.Id('kve_remainder_complete_tab_id').className   = "";
        this.Id('kve_remainder_conflict_tab_id').className   = "";
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
        this.selected_tab_two_flag = elem.id;
        this.Id('kve_remainder_partial_tab_id').className    = "tab_menu_active";
        this.Id('kve_remainder_complete_tab_id').className   = "";
        this.Id('kve_remainder_conflict_tab_id').className   = "";
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
    this.kve_show_all_conflict_profile_info = function(elem){
        this.selected_tab_two_flag = elem.id;
        this.Id('kve_remainder_partial_tab_id').className    = "";
        this.Id('kve_remainder_complete_tab_id').className   = "";
        this.Id('kve_remainder_conflict_tab_id').className   = "tab_menu_active";
        this.Id('kve_cleared_tab_id').className              = "";
        if (TASApp.gbl.search_tab.tab_index == 1){
            var data = TASApp.gbl.search_tab.kve_classify_data[3]||[];
            this.add_kve_profile_index_table(data);
        }else if (TASApp.gbl.search_tab.tab_index == 2){
            var data = TASApp.gbl.search_tab.kve_applyed_data[this.alpply_selected_taxo_id][3] || []; 
            this.show_applied_data_profile(data);
        }else{
            var data = TASApp.gbl.search_tab.kve_applyed_data[this.alpply_selected_remark_row_index][3]||[];
            this.add_kve_profile_index_table(data);
        }
    }

    this.cgi_add_kve_profile_index_table_unclassified = function(elem){
            this.show_process_bar();
            var ref_id = elem.getAttribute('ref_Id');
            try{elem.parentNode.querySelector("tr.kve_unclassified_group_active").className = 'kve_unclassified_group'}catch(e){}
            elem.className = 'kve_unclassified_group_active';
            TASApp.gbl.search_tab.tab_index = 1;
            this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
            var json	= this.merge_json({cmd_id:17, ref_index:this.sort_index, ref_id:ref_id});
			var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?input_str=';
			vservice_path		+= JSON.stringify(json);
			this.Logger.push("Unclassified Group Profile CGI... "+vservice_path+" === ");
       		this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.add_kve_profile_index_table(json)" , "GET", true);
    }

    this.cgi_add_kve_profile_index_table = function(){ 
            this.show_process_bar();
            TASApp.gbl.search_tab.tab_index = 1;
            this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
            var json	= this.merge_json({cmd_id:1, ref_index:this.sort_index});
            var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?input_str=';
	        vservice_path		+= JSON.stringify(json);
	        this.Logger.push("TRAINING CGI... "+vservice_path+" === ");
       	    this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.add_kve_profile_index_table(json)" , "GET", true);
    }

    this.cgi_add_kve_profile_index_table_tab =function(Obj){
		this.Id('kve_prof_tab_menu_content').innerHTML='';
		if(1==Obj){
			this.Id('kve_prof_tab_menu_header').style.display = 'block';
            this.Id('kve_prof_tab_menu_content').style.height = (this.profile_height-50)+'px'; 
            this.Id('kve_prof_tab_menu_content').style.maxHeight = (this.profile_height-50)+'px'; 
            if (this.selected_view_tab == 1){
                this.show_profile_table = this.get_profile_view_data;
            }
            else if (this.selected_view_tab == 2){
                this.show_profile_table = this.load_topic_profile_data;
            }
		}else if(2 == Obj){
			this.Id('kve_prof_tab_menu_header').style.display = 'none';
            this.Id('kve_prof_tab_menu_content').style.height = (this.profile_height-25)+'px'; 
            this.Id('kve_prof_tab_menu_content').style.maxHeight = (this.profile_height-25)+'px'; 
            this.show_profile_table = this.cgi_add_kve_profile_index_table;
		}
        this.Id("kve_sort_prof_tab_menu_drop_down").firstChild.click(); 
		for(var i=1; i<3; i++){
			var Tbs	= 'Tbs_'+i;
			if(i == Obj){
				this.Id(Tbs).style.background = '#34495e';
			}else{
				this.Id(Tbs).style.background = '';
			}
		}	
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
        var profile_div        = this.Id('kve_prof_tab_menu_content');
        profile_div.innerHTML = "";
	var table = this.createDOM("table",{id:"kve_table_prof", width:"100%"}, profile_div);
        var table_head_tr;
        var group_flag = 'C';
        var stats, taxodict = this.gbl_remove_apply_sign_data[this.alpply_selected_taxo_id] || {};
        for(var i=0;i<data.length;i++){
		if (data[i]){
                	table_head_tr = this.get_table_row(table, {id:'kve_profile_index_tab_'+(i+1)}, "td", [{class:"prof_td", width:'30%', style:"text-align: center; color:#6E9DBF"}, {class:"prof_td", width:'70%', style:"text-align: center; color:#6E9DBF"}]);
                	this.createDOM("span", {txt:i+1, id:"kve_sino_idx", style:"float:left; "}, table_head_tr.cells[0]);
	            	var ss = this.createDOM("input", {name:"apply_sign_taxo", doc_id:data[i][6], taxo_key:this.alpply_selected_taxo_id, type:"checkbox", style:"float:right;", onchange:"TASApp.gbl.search_tab.kve_delete_selected_apply_sign_group(this)"}, table_head_tr.cells[0]);
                	stats = taxodict[data[i][6]] || 0;
                	ss.checked = (stats == 1) ? true : false;
	            	var first_td_div	= this.createDOM("div",{id:"kve_td_"+i+"_"+1, class:""}, table_head_tr.cells[1]);
	            	//this.createDOM("span", {txt:"Profile ID "+data[i][4], id:data[i].join('_'), cmd_id:4, class:'kve_prof_level_data', kve_doc_id:data[i][6], pw:data[i][1]||800, ph:data[i][2]||2500,onclick:"TASApp.gbl.search_tab.kve_load_html(this)"}, first_td_div);
	            	this.createDOM("span", {txt:""+data[i][4], id:data[i].join('_'), cmd_id:4, class:'kve_prof_level_data', kve_doc_id:data[i][6], pw:data[i][1]||800, ph:data[i][2]||2500,onclick:"TASApp.gbl.search_tab.kve_load_html(this)"}, first_td_div);
			//var style = "margin:0 20px; padding:2px; background-color: #ff0000; border:1px solid #3e3e3e; float:left;";
			//first_td_div.setAttribute('style',style)
			
             	}
        }
        if (data.length > 0){
        	this.Id("kve_profile_index_tab_1").cells[1].firstChild.firstChild.click();
        }
    }

    this.kve_delete_selected_apply_sign_group = function(elem){
        var doc_id = elem.getAttribute('doc_id');
        var taxo_key = elem.getAttribute('taxo_key');
        var taxodict = this.gbl_remove_apply_sign_data[taxo_key] || {};
        if (elem.checked){
            taxodict[doc_id] = 1;
            this.gbl_remove_apply_sign_data[taxo_key]  = taxodict;
        }else{
            if (Object.keys(taxodict).length > 0){
                try{delete this.gbl_remove_apply_sign_data[taxo_key][doc_id];}catch(e){}   
            }
        }
    }

    this.reset_mark_table = function(){
        this.Id("kve_mark_tab_content_table_inner").innerHTML = '';
        TASApp.gbl.search_tab.selected_div_json = {};
        TASApp.gbl.search_tab.selected_div_json_crop = {};
        this.deselect_kv_taxonomy();
    }
    this.show_save_data_taxonomy = function(data){
        this.Logger.push("Save Finished");
        this.hide_process_bar();
        TASApp.gbl.search_tab.kve_applyed_data = [];
        TASApp.gbl.search_tab.tab_index = 1;
        this.reset_mark_table();
        this.Id("Tbs_3").style.display = "none";  
        this.Id("Tbs_1").style.display = "block";  
        //this.Id("Tbs_1_sep").style.display = "block";  
        this.Id("Tbs_2").style.display = "block";
        this.reset_profile_after_save();
    }
    this.show_save_data_remark = function(data){
        this.Logger.push("Save Finished");
        this.hide_process_bar();
        TASApp.gbl.search_tab.tab_index = 1;
        TASApp.gbl.search_tab.kve_applyed_data = [];
        this.reset_mark_table();
        this.Id("Tbs_3").style.display = "none";  
        this.Id("Tbs_1").style.display = "block";  
        //this.Id("Tbs_1_sep").style.display = "block";  
        this.Id("Tbs_2").style.display = "block";
        this.active_profile_index();
        this.reset_profile_after_save();
    }
    this.load_report_data  = function(){
        this.Id("main_div1").style.display = "none";
        this.Id("parent").style.display = "block";
        this.Id('content_table').innerHTML = "";
        this.Id('content_table').innerHTML = this.agree_html_table_str;
        try{this.Id('right_section').scrollTop = 0;}catch(e){} 
	    //var url		= "popUpProfile_prmy_report_html.html?project_id="+TASApp.gbl.project_id+"&stage_id="+TASApp.gbl.active_stage_id+"&user_id="+TASApp.gbl.user_id+"&mgmt_id="+TASApp.gbl.mgmt_id+"&url_id="+TASApp.gbl.url_id+"&doc_server_path="+TASApp.config.IMAGE_IP+"&cgi_server_path="+TASApp.config.CGI_IP+"&agent_id="+TASApp.gbl.agent_id+"&cmd_id="+this.cmd_id;
    }
    this.load_applied_data_remark = function(data){
        this.hide_process_bar();
        //this.load_report_data();
        TASApp.gbl.search_tab.tab_index = 3;
        TASApp.gbl.search_tab.kve_applyed_data = data;
        this.show_applied_data_remark();
    } 
    this.show_applied_data_remark = function(){
        this.Id("kve_prof_tab_menu_content").style.display = 'block';
        //this.Id('kve_apply_tab').style.display = "block";
        this.Id('kve_local_apply_tab').style.display = "block";
        this.Id('kve_global_apply_tab').style.display = "block";
        this.Id('kve_save_tab').style.display = "block"; 
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
        this.Logger.push("Apply Finished");
        this.hide_process_bar();
        this.agree_html_table_str = data[0] || "";
        this.load_report_data();
        TASApp.gbl.search_tab.tab_index = 2;
        TASApp.gbl.search_tab.kve_applyed_data = data[1];
        this.show_applied_data = this.show_applied_data_taxonomy;
    }
    this.show_applied_data_taxonomy = function(){
        this.Id("Tbs_3").style.display = "block";  
        this.Id("Tbs_1").style.display = "none";  
        //this.Id("Tbs_1_sep").style.display = "none";  
        this.Id("Tbs_2").style.display = "none";  

        this.Id('kve_apply_agree_tab').style.display = "none";
        //this.Id('kve_apply_tab').style.display = "block";
        this.Id('kve_local_apply_tab').style.display = "block";
        this.Id('kve_global_apply_tab').style.display = "block";
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
	    var json	= this.merge_json({cmd_id:11});
        //var json	= {"project_id":4,"user_id":21,"agent_id":15,"mgmt_id":1,"url_id":28,"cmd_id":11};
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name +'?input_str=';
	    vservice_path		+= JSON.stringify(json);
	    this.Logger.push("TAXO CGI... "+vservice_path+" === ");
       	this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.add_kve_taxonomy_index_table(json)" , "GET", true);
    }
    this.reset_profile_after_save = function(){
        this.cgi_fill_kve_trained_index_table();
        this.fire_taxonomy_action = this.taxonomy_action_after_save;
        this.cgi_get_classified_taxonomy();
        this.sort_by();
    }    

    this.active_profile_index = function(){
        this.make_layout();
        this.init_layout();
        this.load_action_tab();	
        this.fire_taxonomy_action = this.taxonomy_action;
        this.add_kve_mark_index_table([]);
        this.load_kve_taxonomy_index_table();
        this.cgi_fill_kve_trained_index_table();
        this.cgi_get_classified_taxonomy();
        this.cgi_fill_level_info();
        this.sort_by();
        this.add_kve_remainder_elems();
        this.last_action_id = 1;

        this.selected_tab_one_flag = "Tbs_2";
        this.Id('kve_profile_view_tab').click(); 
        //this.show_signature_types();
        //this.add_kve_taxonomy_index_table();
        //this.cgi_add_kve_profile_index_table();
        this.Id("kve_configure_signature_type_drop_down").style.display = 'none';
    }
    this.cgi_fill_level_info = function(){
        var json = this.merge_json({cmd_id:13});
        //var json = {"project_id":4,"user_id":21,"agent_id":15,"mgmt_id":1,"url_id":28,"cmd_id":13};
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
	    vservice_path		+= JSON.stringify(json);
       	this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.fill_level_info(json)" , "GET", true);
    }    
    this.fill_level_info = function(data)
    {
        this.gbl_sign_level_dict = data; 
    }
    this.getKeyStatus = function(e) {
        e = e || window.event;
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
    this.create_indiv = function (dm_arr,tble){
        for (x in dm_arr){
            var dm= dm_arr[x];
            dm.parentNode.parentNode.scrollTop=dm.offsetTop;
            var dm_len = dm.cells.length;
            var tr_dm = dm;
            var pos = this.get_absolute_pos(tr_dm);
            sessionStorage[dm_arr[x].id]= pos[1];
            for (var t=0; t< dm_len;t++){
                            var td_dm =  this.createDOM('div',{class:"indiv"},tr_dm.cells[t]);
                            td_dm.innerHTML= tr_dm.cells[t].textContent;
            }
            var ech_arr=[];
            ech_arr.push(dm);
            this.scroll_head(tble,ech_arr);
        }
    }
    this.scroll_head = function (tbl,dm_arr){
        for (x in dm_arr){
            var dm_len = tbl.rows[x].cells.length;
            var tr_dm = tbl.rows[x];
            for (var t=0; t< dm_len;t++){
                    var ech_td = tr_dm.cells[t];
                    var w= ech_td.offsetWidth;
                    var h= ech_td.offsetHeight;
                    var pos = this.get_absolute_pos(ech_td);
                    var l= pos[0];
                    var in_div = ech_td.querySelector('div');
                    var tp= sessionStorage[dm_arr[x].id];
                    this.setAttr(in_div,{style:'width:'+w+'px;height:'+h+'px;left:'+l+'px;top:'+(tp-1)+'px;'});
            }
         }
    }
    this.assign_fn = function (dm,dm_arr){
        var tbl_prnt_dm  = dm.parentNode;
        tbl_prnt_dm.onscroll = function (){
                TASApp.gbl.search_tab.scroll_head(dm,dm_arr);
        }
        window.addEventListener("resize", function() {
                TASApp.gbl.search_tab.scroll_head(dm,dm_arr)
        });
    } 
    //add methods in panel side
}).apply(Mapping.prototype);
