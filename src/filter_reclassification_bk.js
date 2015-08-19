/**************************************************************************************************************************/
function Filter_reclassification(){
	Utils.call(this);
	this.profile_grid	= 45;
	this.trained_grid 	= 14;
	this.mark_grid 	= 15;
	this.taxo_grid 	= 25;
    this.cgi_script_file_name = "webintf/cgi_web_extract_lmdb.py";
    this.gbl_meta_data = {project_id:TASApp.gbl.project_id, user_id:TASApp.gbl.user_id, agent_id:TASApp.gbl.agent_id, mgmt_id:Number(TASApp.gbl.mgmt_id), url_id:Number(TASApp.gbl.url_id)};
    TASApp.config.IMAGE_IP = TASApp.config.CGI_IP;
}
Filter_reclassification.prototype		= new Utils();
Filter_reclassification.prototype.constructor	= Filter_reclassification;
(function(){
    this.init = function(){
        this.make_layout();
        this.init_layout();
        this.fill_sub_tabs();
    }

   	/**
	 * Description
	 * @method make_layout
	 * @return 
	 */
	this.make_layout	= function(){
		TASApp.gbl.canvas_data	= [];
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
    this.fill_sub_tabs = function(){
        var subDiv = this.Id('kve_sub_sub_tab_header');
        subDiv.innerHTML = "";
        var ul = this.createDOM("ul", {}, subDiv);
        this.createDOM("li", {txt:"Reclassify", id:"kve_sub_sub_tab_1", class:'active', onclick:"TASApp.gbl.search_tab.active_reclassify_tab(this);"}, ul);
        this.createDOM("li", {txt:"UnitsDuplicate", id:"kve_sub_sub_tab_2", onclick:"TASApp.gbl.search_tab.active_unit_duplicate_tab(this);"}, ul);
        this.Id("kve_sub_sub_tab_1").click();
    }
    this.active_reclassify_tab = function(elem){
        try{this.Id("kve_sub_sub_tab_header").querySelector("li.active").className = "";}catch(e){}
        elem.className = "active";
        this.add_kve_trained_index_table();
        this.cgi_fill_kve_trained_index_table();
    }
    this.active_unit_duplicate_tab = function(elem){
        try{this.Id("kve_sub_sub_tab_header").querySelector("li.active").className = "";}catch(e){}
        elem.className = "active";
        this.add_kve_trained_index_table_dup();
        this.cgi_fill_kve_trained_index_table_dup();
    }
    this.merge_json = function(attr_json){
        var json   = JSON.parse(JSON.stringify(this.gbl_meta_data));
        for (var key in attr_json){
            json[key] = attr_json[key];
        }
        return json
    }
    this.init_layout = function(){
        this.trained_grid_height_new = this.profile_height +this.trained_grid_height+this.url_height+this.url_element_height;
        var profile_div		= this.Id('url_content_1_home');
        profile_div.innerHTML = "";
	    this.createDOM("div",{id:"kve_sub_sub_tab_header", style:"height:25px; width:100%; float: left;"}, profile_div);
	    this.createDOM("div",{id:"kve_tab_trained_content", style:"height: "+this.trained_grid_height_new+"px; width:100%; float: left;"}, profile_div);
	    this.createDOM("div",{id:"kve_tab_mark_content", style:"height: "+this.url_height+"px; width:100%; float: left; display:none;"}, profile_div);
	    this.createDOM("div",{id:"kve_tab_taxonomy_content", style:"height: "+this.url_element_height+"px; width:100%; float: left;display:none;"}, profile_div);

        var menu        = this.Id('profile_div');
        menu.innerHTML = "";
        /*this.createDOM("div",{id:"kve_prof_tab_menu_header", class:"sb_kveRemainderMainDiv", style:"height: 25px;"}, menu);
        this.createDOM("div",{id:"kve_prof_tab_menu_content", style:"height: "+(this.profile_height-25)+"px; width:100%; float: left; overflow: auto; max-height: "+(this.profile_height-25)+"px;"}, menu);*/
    }
    this.add_crop_tool_elems	= function(){
	    this.Id("crop_tool_header").style.display			= "block";
	    var crop_tool	= this.Id('crop_tool_header');
       	crop_tool.innerHTML		= '';
       	this.createDOM("span", {class:"review-span", style:"float:left;", txt:"Delete", id:'del-multi', onclick:"TASApp.gbl.search_tab.delete_profiles()"}, crop_tool);
    }
    this.add_kve_trained_index_table    = function(){
        this.trained_grid_height_new = (this.profile_height + this.trained_grid_height + this.url_height+this.url_element_height);
        this.Id("kve_tab_trained_content").style.height = this.trained_grid_height_new+"px";;
        var height = this.trained_grid_height_new-25;
        content_div = this.Id("kve_tab_trained_content");
        content_div.innerHTML = "";
        content_div.style.maxHeight = this.trained_grid_height_new+"px";
        var table = this.createDOM("table",{id:"kve_tained_table_prof", width:"100%"}, content_div);
        var theader = this.get_table_row(table, {}, "th", [{txt:"TId", class:"kve_header", width:"10%"}, {txt:"Topic", width:"30%", class:"kve_header"}, {txt:"Total", width:"30%", class:"kve_header"}, {txt:"Action", class:"kve_header"}])
        row = this.createDOM("tr", {}, table);
        var td = this.createDOM("td", {colspan:"4"}, row);
        var inner_div = this.createDOM("div", {id:"kve_tained_table_prof_div_inner", style:"height:"+height+"px;overflow: auto;float:left;width:100%"}, td);
        this.createDOM("table",{id:"kve_tained_table_prof_inner", width:"100%", style:"border-collapse: collapse; border-bottom:#d3e8f7 1px solid;"}, inner_div);
    }
    this.add_kve_trained_index_table_dup    = function(){
        this.trained_grid_height_new = (this.profile_height + this.trained_grid_height + this.url_height+this.url_element_height);
        this.Id("kve_tab_trained_content").style.height = this.trained_grid_height_new+"px";;
        var height1, height2, height = this.trained_grid_height_new - 50;
        height1 = height/2
        height2 = height - height1; 
        
        content_div = this.Id("kve_tab_trained_content");
        content_div.innerHTML = "";
	    this.createDOM("div",{id:"kve_sub_sub_classify_unit_header", style:"height:25px; width:100%; float: left;background:#3C9BB4;", txt:"Classified Units"}, content_div);
	    var content_div1 = this.createDOM("div",{id:"kve_sub_sub_classify_unit_content", style:"height:"+height1+"px; width:100%; float: left;"}, content_div);
	    this.createDOM("div",{id:"kve_sub_sub_unclassify_unit_header", style:"height:25px; width:100%; float: left;background:#3C9BB4;", txt:"Unclassified Units"}, content_div);
	    content_div2 = this.createDOM("div",{id:"kve_sub_sub_unclassify_unit_content", style:"height:"+height2+"px; width:100%; float: left;"}, content_div);
        content_div1.style.maxHeight = height1+"px";
        content_div2.style.maxHeight = height2+"px";

        var table = this.createDOM("table",{width:"100%"}, content_div1);
        var theader = this.get_table_row(table, {}, "th", [{txt:"TId", class:"kve_header", width:"10%"}, {txt:"Topic", width:"30%", class:"kve_header"}, {txt:"TId", width:"30%", class:"kve_header"}, {txt:"Topic", class:"kve_header"}])
        row = this.createDOM("tr", {}, table);
        var td = this.createDOM("td", {colspan:"4"}, row);
        var inner_div = this.createDOM("div", {id:"kve_tained_table_prof_div_inner_1", style:"height:"+(height1-25)+"px;overflow: auto;float:left;width:100%"}, td);
        this.createDOM("table",{id:"kve_tained_table_prof_inner_1", width:"100%", style:"border-collapse: collapse; border-bottom:#d3e8f7 1px solid;"}, inner_div);
        
        var table = this.createDOM("table",{width:"100%"}, content_div2);
        var theader = this.get_table_row(table, {}, "th", [{txt:"TId", class:"kve_header", width:"10%"}, {txt:"Topic", width:"30%", class:"kve_header"}, {txt:"TId", width:"30%", class:"kve_header"}, {txt:"Topic", class:"kve_header"}])
        row = this.createDOM("tr", {}, table);
        var td = this.createDOM("td", {colspan:"4"}, row);
        var inner_div = this.createDOM("div", {id:"kve_tained_table_prof_div_inner_2", style:"height:"+(height2-25)+"px;overflow: auto;float:left;width:100%"}, td);
        this.createDOM("table",{id:"kve_tained_table_prof_inner_2", width:"100%", style:"border-collapse: collapse; border-bottom:#d3e8f7 1px solid;"}, inner_div);
    }
    this.cgi_fill_kve_trained_index_table_dup   = function(){
            this.show_process_bar();
            this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif", style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_tained_table_prof_inner"));
            var json	= this.merge_json({cmd_id:101});
			var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
			vservice_path		+= JSON.stringify(json);
			this.Logger.push("Profile CGI... "+vservice_path+" === ");
       		this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.fill_kve_trained_index_table(json)" , "GET", true);
    }
    this.fill_kve_trained_index_table   = function(idata){
        var data = idata[0];
        innertable = this.Id("kve_tained_table_prof_inner");
        innertable.innerHTML = "";
        var row;
        for(var i = 0; i < data.length; i++){
             row = this.get_table_row(innertable, {id:'kve_trained_prof_'+(i+1), 'kve_train_index':data[i][4], taxo_id:data[i][0], taxo_name:data[i][1]}, "td", [{class:"prof_td", width:"10%", txt:data[i][0], style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.load_taxonomy_wise_input_data(this)"}, {taxo_id:data[i][0], txt:data[i][1], width:"30%", class:"prof_td", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.load_taxonomy_wise_input_data(this)"}, {txt:data[i][2], width:"30%", class:"prof_td", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.load_taxonomy_wise_input_data(this)"}, {txt:"", class:"prof_td", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.selected_topic_unit(this)"}]);
        }
        this.hide_process_bar();
    }
    this.cgi_fill_kve_trained_index_table   = function(){
            this.show_process_bar();
            this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif", style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_tained_table_prof_inner"));
            var json	= this.merge_json({cmd_id:101});
			var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
			vservice_path		+= JSON.stringify(json);
			this.Logger.push("Profile CGI... "+vservice_path+" === ");
       		this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.fill_kve_trained_index_table(json)" , "GET", true);
    
    }
    this.fill_kve_trained_index_table   = function(idata){
        var data = idata[0];
        innertable = this.Id("kve_tained_table_prof_inner");
        innertable.innerHTML = "";
        var row;
        for(var i = 0; i < data.length; i++){
             row = this.get_table_row(innertable, {id:'kve_trained_prof_'+(i+1), 'kve_train_index':data[i][4], taxo_id:data[i][0], taxo_name:data[i][1]}, "td", [{class:"prof_td", width:"10%", txt:data[i][0], style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.load_taxonomy_wise_input_data(this)"}, {taxo_id:data[i][0], txt:data[i][1], width:"30%", class:"prof_td", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.load_taxonomy_wise_input_data(this)"}, {txt:data[i][2], width:"30%", class:"prof_td", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.load_taxonomy_wise_input_data(this)"}, {txt:"", class:"prof_td", style:"text-align: center; color:#6E9DBF", onclick:"TASApp.gbl.search_tab.load_taxonomy_wise_input_data(this)"}]);
        }
        this.hide_process_bar();
    }
    this.load_taxonomy_wise_input_data = function(tdelem){
        elem = tdelem.parentNode;
        elem.scrollIntoView();
        try{elem.parentNode.querySelector("tr.active_kve_table_prof_row").className = 'prof_td'}catch(e){}
        elem.className = 'active_kve_table_prof_row';
        var selected_parent_taxo_id = elem.getAttribute('taxo_id');
        var selected_parent_taxo_name = elem.getAttribute('taxo_name');
        this.kve_load_html(selected_parent_taxo_id, selected_parent_taxo_name);
    }
    this.kve_load_html = function(taxo_id, taxo_name){
        var json = JSON.parse(JSON.stringify(this.gbl_meta_data)); 
        json.doc_image_path = TASApp.config.IMAGE_IP;
        json.server_cgi_path = TASApp.config.CGI_IP;
        json.taxo_id = taxo_id;
        json.taxo_name = taxo_name;
        TASRightView.gbl = TASApp.gbl.search_tab.rightView = new FilterReclassificationView();
        TASApp.gbl.search_tab.rightView.init(json);
    }
}).apply(Filter_reclassification.prototype);
