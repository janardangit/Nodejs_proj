/**************************************************************************************************************************/
function Units_duplication(){
	Utils.call(this);
	this.profile_grid	= 45;
	this.trained_grid 	= 14;
	this.mark_grid 	= 15;
	this.taxo_grid 	= 25;
    this.cgi_script_file_name = "webintf/cgi_web_extract_lmdb.py";
    this.gbl_meta_data = {project_id:TASApp.gbl.project_id, user_id:TASApp.gbl.user_id, agent_id:TASApp.gbl.agent_id, mgmt_id:Number(TASApp.gbl.mgmt_id), url_id:Number(TASApp.gbl.url_id)};
    TASApp.config.IMAGE_IP = TASApp.config.CGI_IP;
    this.height1 = 0;
    this.height2 = 0;
    this.source_topic = {};
}
Units_duplication.prototype		= new Utils();
Units_duplication.prototype.constructor	= Units_duplication;
(function(){
    this.init = function(){
        this.make_layout();
        this.init_layout();
        this.add_kve_trained_index_table(this.Id("kve_sub_sub_classify_unit_content"), '1')
        this.add_kve_trained_index_table(this.Id("kve_sub_sub_unclassify_unit_content"), '2')
        this.cgi_fill_kve_trained_index_table();
        this.fill_unclassified_tophic_units();
    }

   	/**
	 * Description
	 * @method make_layout
	 * @return 
	 */
	this.make_layout	= function(){
		TASApp.gbl.canvas_data	= [];
        document.body.setAttribute("onkeyup", "");
		var content_window      = this.Id('left_section'); //main_container3');
		var rect        = content_window.getBoundingClientRect();
		var height = (rect.bottom - rect.top);
		var total_h	= height - parseInt(TASApp.gbl.tab) - parseInt(TASApp.gbl.tab_menu) - parseInt(TASApp.gbl.footer) - parseInt(TASApp.gbl.crop_tool);
		this.Logger.push("total_h === "+total_h +" === "+ content_window.height);
       	this.profile_height                             = total_h * (this.profile_grid/100);
		this.trained_grid_height	                = total_h * (this.trained_grid/100); 
		this.url_height		                        = total_h * (this.mark_grid/100); 
		this.url_element_height	                        = total_h * (this.taxo_grid/100); 
		this.Id("profile_top_header_1_home").style.height	= 0 + "px"; //total_h * (this.profile_grid/100) +"px";
		this.Id("url_content_1_home").style.height		    = this.profile_height + 25 + this.trained_grid_height + this.url_height + this.url_element_height+"px";
		this.Id("crop_tool_header").style.display		= "none";
       	this.Id('tab_menu_header').style.display             = "";
		this.Id('profile_div').innerHTML			= '';
       	this.Id('profile_div').style.height                  = "100%";
      	this.Id('footerDiv').innerHTML 			= "";
       	this.Id('url_content_1_home').innerHTML = "";
	}
    this.merge_json = function(attr_json){
        var json   = JSON.parse(JSON.stringify(this.gbl_meta_data));
        for (var key in attr_json){
            json[key] = attr_json[key];
        }
        return json
    }
    this.init_layout = function(){
        this.trained_grid_height_new = this.profile_height + 25 + this.trained_grid_height+this.url_height+this.url_element_height;
        var profile_div		= this.Id('url_content_1_home');
        profile_div.innerHTML = "";
        var height1, height2, height = this.trained_grid_height_new - 50;
        this.height1 = height/2
        this.height2 = height - this.height1; 
        var header = this.createDOM("div",{id:"kve_sub_sub_classify_unit_header"}, profile_div);
        this.createDOM("span", {style:"float: left;margin-top: 4px;", txt:"Source Topics"}, header);
	    this.createDOM("div",{id:"kve_sub_sub_classify_unit_content", style:"height:"+this.height1+"px; width:100%; float: left;"}, profile_div);
	    header = this.createDOM("div",{id:"kve_sub_sub_unclassify_unit_header"}, profile_div);
        this.createDOM("span", {style:"float: left;margin-top: 4px;", txt:"Destination Topics"}, header);
        this.createDOM("span", {style:"float: right;padding: 4px 6px;cursor:pointer;height:25px;background:#d7d7d7;color:#3e3e3e;", txt:"Save", onclick:"TASApp.gbl.search_tab.copy_topic()"}, header);
	    this.createDOM("div",{id:"kve_sub_sub_unclassify_unit_content", style:"height:"+this.height2+"px; width:100%; float: left;"}, profile_div);
        var menu        = this.Id('profile_div');
        menu.innerHTML = "";
    }
    this.copy_topic = function(){
        var inputElms2, inputElms1 = this.Id("kve_sub_sub_classify_unit_content").querySelector('input[name="source_taxonomy"]:checked'); 
        inputElms2 = this.Id("kve_sub_sub_unclassify_unit_content").querySelector('input[name="target_taxonomy"]:checked');    
        var source_taxonomy =  inputElms1.getAttribute('taxo_id');
        var source_taxonomy_name =  inputElms1.getAttribute('taxo_name');
        
        var target_taxonomy =  inputElms2.getAttribute('taxo_id');
        var target_taxonomy_name =  inputElms2.getAttribute('taxo_name');
        if (source_taxonomy == target_taxonomy){
            alert('Both are same topic...please select different topic');
            this.reset_tophic_units();
            return;
        }
        if (target_taxonomy in this.source_topic){
            var r=confirm("Do you want To Override the Topic");
	        if (r==true) {
                this.cgi_copy_topic(source_taxonomy, source_taxonomy_name, target_taxonomy, target_taxonomy_name);
            }else{
                return;
            }
        }else{
                this.cgi_copy_topic(source_taxonomy, source_taxonomy_name, target_taxonomy, target_taxonomy_name);
        }
    }
    this.cgi_copy_topic = function(src_topic_id, src_topic_name, dest_topic_id, dest_topic_name){
            this.show_process_bar();
            this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif", style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_tained_table_prof_inner_1"));
            var json	= this.merge_json({cmd_id:114, taxo_id:src_topic_id, taxo_name:src_topic_name, dst_taxo_id:dest_topic_id, dst_taxo_name:dest_topic_name});
			var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
			vservice_path		+= JSON.stringify(json);
			this.Logger.push("Copy Topic CGI... "+vservice_path+" === ");
       		this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.reset_tophic_units(json)" , "GET", true);
    }
    this.reset_tophic_units = function(data){
        this.hide_process_bar();
        var inputElms2, inputElms1 = this.Id("kve_sub_sub_classify_unit_content").querySelector('input[name="source_taxonomy"]:checked'); 
        if (inputElms1){
            inputElms1.checked = false;
            inputElms1.parentNode.nextSibling.firstChild.className = '';
        }
        inputElms2 = this.Id("kve_sub_sub_unclassify_unit_content").querySelector('input[name="target_taxonomy"]:checked');    
        if (inputElms2){
            inputElms2.checked = false;
            inputElms2.parentNode.nextSibling.firstChild.className = '';
        }
        
    }
    this.add_kve_trained_index_table    = function(content_div, tid){
        var height = (tid == '1') ? this.height1 : this.height2;
        content_div.innerHTML = "";
        content_div.style.maxHeight = this.height1+"px";
        var table = this.createDOM("table",{width:"100%"}, content_div);
        var theader = this.get_table_row(table, {}, "th", [{txt:"SL.No", class:"kve_header", width:"10%"}, {txt:"Topic", width:"30%", class:"kve_header"}, {txt:"SL.No", width:"30%", class:"kve_header"}, {txt:"Topic", class:"kve_header"}])
        row = this.createDOM("tr", {}, table);
        var td = this.createDOM("td", {colspan:"4"}, row);
        var inner_div = this.createDOM("div", {id:"kve_tained_table_prof_div_inner_"+tid, style:"height:"+(height-25)+"px;overflow: auto;float:left;width:100%"}, td);
        this.createDOM("table",{id:"kve_tained_table_prof_inner_"+tid, width:"100%", style:"border-collapse: collapse; border-bottom:#d3e8f7 1px solid;"}, inner_div);
    }
    this.cgi_fill_kve_trained_index_table   = function(){
            this.show_process_bar();
            this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif", style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_tained_table_prof_inner_1"));
            var json	= this.merge_json({cmd_id:101});
			var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
			vservice_path		+= JSON.stringify(json);
			this.Logger.push("Profile CGI... "+vservice_path+" === ");
       		this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.fill_classified_tophic_units(json)" , "GET", true);
    }
    this.fill_classified_tophic_units   = function(idata){
        var taxo_table = this.Id('kve_tained_table_prof_inner_1')
        taxo_table.innerHTML = "";
        var data = idata[0];
        this.source_topic = {};
        var keys    = Object.keys(data);
        keys.sort();
        var len = parseInt(keys.length/2);
        var extra = 0
        if (len*2 != keys.length){
            extra += 1;
        }

        var taxo_table_tr;
        this.Logger.push("load taxonomy === "+len+" === "+keys);
        for(var ind = 0; ind < len; ind++){
            var value1   = data[keys[ind]];
            var value2   = data[keys[ind+len+extra]];
            this.source_topic[value1[0]] = value1[1];
            this.source_topic[value2[0]] = value2[1];
            var class1 = "prof_td"; 
            var row = this.get_table_row(taxo_table, {}, "td", [{class:"prof_td", style:'width:10%'}, {taxo_id:value1[0], txt:"<span>"+value1[1]+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_classified_unit_content(this)"}, {class:"prof_td", style:'width:10%'}, {taxo_id:value2[0], txt:"<span>"+value2[1]+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_classified_unit_content(this)", style:"text-align:left;"}]);
            this.createDOM("input",{id:value1[0], taxo_id: value1[0], taxo_name:value1[1], name:"source_taxonomy", type:"radio", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_classified_unit_content(this)"}, row.cells[0]);
            var label = this.createDOM("label",{style:"margin-left:2px;" },row.cells[0]);
            label.innerHTML = ind + 1;
            this.createDOM("input",{id:value2[0], taxo_id: value2[0], taxo_name:value2[1],  name:"source_taxonomy", type:"radio", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_classified_unit_content(this)"}, row.cells[2]);
            var label = this.createDOM("label",{style:"margin-left:2px;" },row.cells[2]);
            label.innerHTML = ind + len + 1 + extra;
        }
        if (len*2 != keys.length){
            var value   = data[keys[len]];
            this.source_topic[value[0]] = value[1];
            var row = this.get_table_row(taxo_table, {}, "td", [{class:"prof_td", style:'width:10%'}, {taxo_id:value[0], txt:"<span>"+value[1]+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_classified_unit_content(this)"}, {class:"prof_td"}, {class:"prof_td"}]);
            this.createDOM("input",{id:value[0], taxo_id: value[0], taxo_name:value[1], name:"source_taxonomy", type:"radio", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_kv_taxonomy(this)"}, row.cells[0]);
            var label = this.createDOM("label",{style:"margin-left:2px;" },row.cells[0]);
            label.innerHTML = len+1;
        }
        this.hide_process_bar();
    }
    this.fill_unclassified_tophic_units   = function(idata){
        var taxo_table = this.Id('kve_tained_table_prof_inner_2')
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
        for(var ind = 0; ind < len; ind++){
            var value1   = TASApp.gbl.taxo_name_mapping[keys[ind]];
            var value2   = TASApp.gbl.taxo_name_mapping[keys[ind+len+extra]];
            var row = this.get_table_row(taxo_table, {}, "td", [{class:"prof_td", style:'width:10%'}, {taxo_id:value1.id, txt:"<span>"+value1.name+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_unclassified_unit_content(this)"}, {class:"prof_td", style:'width:10%'}, {taxo_id:value2.id, txt:"<span>"+value2.name+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_unclassified_unit_content(this)", style:"text-align:left;"}]);
            this.createDOM("input",{id:value1.id, taxo_id: value1.id, taxo_name:value1.name,  name:"target_taxonomy", type:"radio", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_unclassified_unit_content(this)"}, row.cells[0]);
            var label = this.createDOM("label",{style:"margin-left:2px;" },row.cells[0]);
            label.innerHTML = ind + 1;
            this.createDOM("input",{id:value2.id, taxo_id: value2.id, taxo_name:value2.name,  name:"target_taxonomy", type:"radio", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_classified_unit_content(this)"}, row.cells[2]);
            var label = this.createDOM("label",{style:"margin-left:2px;" },row.cells[2]);
            label.innerHTML = ind + len + 1 + extra;
        }
        if (len*2 != keys.length){
            var value   = TASApp.gbl.taxo_name_mapping[keys[len]];
            var row = this.get_table_row(taxo_table, {}, "td", [{class:"prof_td", style:'width:10%'}, {taxo_id:value.id, txt:"<span>"+value.name+"</span>", class:"prof_td", onclick:"TASApp.gbl.search_tab.select_unclassified_unit_content(this)"}, {class:"prof_td"}, {class:"prof_td"}]);
            this.createDOM("input",{id:value.id, taxo_id: value.id, taxo_name:value.name, name:"target_taxonomy", type:"radio", style:"margin:0px 1px; vertical-align:middle;", onchange:"TASApp.gbl.search_tab.select_unclassified_unit_content(this)"}, row.cells[0]);
            var label = this.createDOM("label",{style:"margin-left:2px;" },row.cells[0]);
            label.innerHTML = len+1;
        }
    }
    this.select_classified_unit_content = function(elem){
        var taxo_id = elem.getAttribute('taxo_id');
        try{elem.parentNode.parentNode.parentNode.querySelector('span.active_taxonomy_index').className = "";}catch(e){}
        elem.parentNode.nextSibling.firstChild.className = 'active_taxonomy_index';
    }
    this.select_unclassified_unit_content = function(elem){
        var taxo_id = elem.getAttribute('taxo_id');
        try{elem.parentNode.parentNode.parentNode.querySelector('span.active_taxonomy_index').className = "";}catch(e){}
        elem.parentNode.nextSibling.firstChild.className = 'active_taxonomy_index';
    }

}).apply(Units_duplication.prototype);
