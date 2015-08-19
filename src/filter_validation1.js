/**************************************************************************************************************************/
function Filter_validation_one(){
	Utils.call(this);
	this.profile_grid	= 45;
	this.trained_grid 	= 14;
	this.mark_grid 	= 15;
	this.taxo_grid 	= 25;
   	this.cgi_script_file_name = "webintf/cgi_web_extract_lmdb.py";
   	this.gbl_meta_data = {project_id:TASApp.gbl.project_id, user_id:TASApp.gbl.user_id, agent_id:TASApp.gbl.agent_id, mgmt_id:Number(TASApp.gbl.mgmt_id), url_id:Number(TASApp.gbl.url_id)};
}
Filter_validation_one.prototype		= new Utils();
Filter_validation_one.prototype.constructor	= Filter_validation_one;
(function(){
    this.init = function(){
        this.make_layout();
        this.init_layout();
        this.load_filter_one_stats();
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
		var total_h	= height	- parseInt(TASApp.gbl.tab) - parseInt(TASApp.gbl.tab_menu) - parseInt(TASApp.gbl.footer) - parseInt(TASApp.gbl.crop_tool);
		this.Logger.push("total_h === "+total_h +" === "+ content_window.height);
       	this.profile_height                             = total_h * (this.profile_grid/100);
		this.trained_grid_height		                = total_h * (this.trained_grid/100); 
		this.url_height		                            = total_h * (this.mark_grid/100); 
		this.url_element_height		                    = total_h * (this.taxo_grid/100); 
		this.Id("profile_top_header_1_home").style.height	= total_h * (this.profile_grid/100) +"px";
		this.Id("url_content_1_home").style.height		    = this.trained_grid_height + this.url_height + this.url_element_height+"px";
       	this.add_crop_tool_elems(); 
       	this.Id('tab_menu_header').style.display                = "";
		this.Id('profile_div').innerHTML			            = '';
       	this.Id('profile_div').style.height                  = "100%";
       	this.Id('footerDiv').innerHTML = "";
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
        this.trained_grid_height_new = this.trained_grid_height+this.url_height+this.url_element_height;
        var profile_div		= this.Id('url_content_1_home');
        profile_div.innerHTML = "";
	    this.createDOM("div",{id:"kve_tab_trained_content", style:"height: "+this.trained_grid_height_new+"px; width:100%; float: left;"}, profile_div);
	    this.createDOM("div",{id:"kve_tab_mark_content", style:"height: "+this.url_height+"px; width:100%; float: left; display:none;"}, profile_div);
	    this.createDOM("div",{id:"kve_tab_taxonomy_content", style:"height: "+this.url_element_height+"px; width:100%; float: left;display:none;"}, profile_div);

        var menu        = this.Id('profile_div');
        menu.innerHTML = "";
        this.createDOM("div",{id:"kve_prof_tab_menu_header", class:"sb_kveRemainderMainDiv", style:"height: 25px;"}, menu);
        this.createDOM("div",{id:"kve_prof_tab_menu_content", style:"height: "+(this.profile_height-25)+"px; width:100%; float: left; overflow: auto; max-height: "+(this.profile_height-25)+"px;"}, menu);
    }
    this.add_crop_tool_elems	= function(){
		this.Id("crop_tool_header").style.display			= "block";
		var crop_tool	= this.Id('crop_tool_header');
       	crop_tool.innerHTML		= '';
       	this.createDOM("span", {class:"review-span", style:"float:left;", txt:"Delete", id:'del-multi', onclick:"TASApp.gbl.search_tab.delete_profiles()"}, crop_tool);
    }
    this.load_filter_one_stats = function(){
        var json	= this.merge_json({cmd_id:154});
	    var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name + '?input_str=';
	    vservice_path		+= JSON.stringify(json);
	    this.Logger.push("Filter One stats... "+vservice_path+" === ");
       	this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.show_filter_one_stats(json)" , "GET", true);
    }
    this.show_filter_one_stats = function(data){
        content_div = this.Id("kve_tab_trained_content");
        content_div.innerHTML = '';
        //content_div.style.overflow = "auto"
        content_div.style.maxHeight = this.trained_grid_height_new+"px";
        var height = this.trained_grid_height_new-40;
        var table = this.createDOM("table",{id:"kve_tained_table_prof", width:"100%"}, content_div);
        var theader = this.get_table_row(table, {}, "th", [{txt:"Taxo Id", width:"19%", class:"kve_header"}, {txt:"Topic", width:"19%", class:"kve_header"}, {txt:"Orginal-Count", width:"18%", class:"kve_header"}, {txt:"F2 Count", width:"18%", class:"kve_header"}, {txt:"F1 Count", class:"kve_header"}])
        row = this.createDOM("tr", {}, table);
        var td = this.createDOM("td", {colspan:"5"}, row);
        var inner_div = this.createDOM("div", {id:"kve_tained_table_prof_div_inner", style:"height:"+height+"px;overflow: auto;float:left;width:100%"}, td);
        this.createDOM("table",{id:"kve_tained_table_prof_inner", width:"100%", style:"border-collapse: collapse; border-bottom:#d3e8f7 1px solid;"}, inner_div);
        this.load_filter_one_stats_table(data);
    } 
    this.load_filter_one_stats_table = function(data){
        var row, table = this.Id('kve_tained_table_prof_inner');
        table.innerHTML = "";
        for (var i=0; i<data.length; i++){
            row = this.get_table_row(table, {}, "td", [{txt:data[i][0], width:"19%", class:"prof_td"}, {txt:data[i][1], width:"19%", class:"prof_td"}, {txt:data[i][2], width:"18%", class:"prof_td"}, {txt:data[i][3], width:"18%", class:"prof_td"}, {txt:data[i][4],class:"prof_td"}])
        }
    }
}).apply(Filter_validation_one.prototype);
