var result_tab_selected = 1;
function SubUnits(){
	Utils.call(this);
	this.profile_grid	= 65;
	this.trained_grid 	= 10;
	this.mark_grid 	= 10;
	this.taxo_grid 	= 20;
    this.trained_grid_height_new = "";
    this.gbl_meta_data = {project_id:TASApp.gbl.project_id, user_id:TASApp.gbl.user_id, agent_id:TASApp.gbl.agent_id, mgmt_id:Number(TASApp.gbl.mgmt_id), url_id:Number(TASApp.gbl.url_id)};
    TASApp.config.IMAGE_IP = TASApp.config.CGI_IP;
    TASApp.config.CGI_DIR_new   = 'cgi-bin/TR_Legal_2013_12_23_web/slt_Code/';
    sessionStorage['gbl_taxo_id'] = '';
    this.gbl_selected_value = 'reminder';
}
SubUnits.prototype		= new Utils();
SubUnits.prototype.constructor	= SubUnits;
(function(){
   	/**
	 * Description
	 * @method make_layout
	 * @return 
	 */
	this.make_layout	= function(){
        sessionStorage['gbl_taxo_id'] = '';
		var content_window      = this.Id('left_section'); //main_container3');
		var rect                = content_window.getBoundingClientRect();
		var height              = (rect.bottom - rect.top);
		var total_h	            = height	-  parseInt(TASApp.gbl.tab) - parseInt(TASApp.gbl.tab_menu) - parseInt(TASApp.gbl.footer) ;
       	this.profile_height                         = total_h * (this.profile_grid/100);
		this.trained_grid_height		                = total_h * (this.trained_grid/100); 
		this.url_height		                            = total_h * (this.mark_grid/100); 
		this.url_element_height		                    = total_h * (this.taxo_grid/100); 
		this.Id("profile_top_header_1_home").style.height	= total_h * (this.profile_grid/100) +"px";
		this.Id("url_content_1_home").style.height		    = this.trained_grid_height + this.url_height + this.url_element_height+"px";
        this.Id('crop_tool_header').innerHTML                = '';
        this.Id('crop_tool_header').style.display            = 'none';
        this.Id('footerDiv').innerHTML                       = '';
      	this.Id('tab_menu_header').style.display             = "none";
		this.Id('profile_div').innerHTML			            = '';
       	this.Id('profile_div').style.height                  = "100%";
       	this.Id('url_content_1_home').innerHTML              = "";
	}

    this.init = function(){
	    var iframe = this.Id('iframe_filter');
	    iframe.setAttribute('src','');
        this.make_layout();
        this.init_layout();
        this.cgi_fill_kve_trained_index_table();
    }

    this.cgi_fill_count_table = function(){
        var json    = this.merge_json({"taxo_id":sessionStorage.gbl_taxo_id, "flag":'8'});
        var vservice_path   = TASApp.config.CGI_IP+TASApp.config.CGI_DIR_new + 'pattern_generation_v13/cgi_train_f2_data.py?input_str=';
        vservice_path       += JSON.stringify(json);
        this.Logger.push("Count Table CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.CallBack_cgi_fill_count_table(json)" , "GET", true);
    }
    this.CallBack_cgi_fill_count_table = function(json){
        var json = eval(json);
        var myDiv   = this.Id('kve_tab_taxonomy_content');
        myDiv.innerHTML = '';
        var table = this.createDOM("table",{id:"kve_taxonomy_table_cnt", width:"100%", style:"margin-top:2px;border-top:#ededed 1px solid;" }, myDiv);
        var th = this.create_row_and_cols(table, "th", {class:"prof_td"},['Topic Name','Profile-Remainder','Profile-Partial', 'Profile-Cleared', 'UnitWise - M/C/Total Done' ] );
        var row = this.create_row_and_cols(table, "td", {class:"prof_td"}, [sessionStorage.new_taxo_name, json['prof_reminder'], json['prof_partial'], json['prof_cleared'], json['manual_done_cnt']+' / '+json['query_done_cnt']+' / '+json['total_cnt']] );
        row.cells[0].setAttribute('style','width:30%;text-align:center;');
        row.cells[1].setAttribute('style','width:13%;text-align:center;');
        row.cells[2].setAttribute('style','width:14%;text-align:center;');
        row.cells[3].setAttribute('style','width:14%;text-align:center;');
        row.cells[4].setAttribute('style','width:29%;text-align:center;');
        th.setAttribute('style','background: none repeat scroll 0% 0% #6B9EDB;color:#fff;');
    }

    this.cgi_fill_kve_trained_index_table   = function(){
        var json	= this.merge_json({flag:'1'});
        var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR_new + 'pattern_generation_v13/cgi_train_f2_data.py?input_str=';
        vservice_path		+= JSON.stringify(json);
        this.Logger.push("Profile CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.fill_kve_trained_index_table(json)" , "GET", true);
    }
    this.fill_kve_trained_index_table   = function(data){
        this.add_kve_remainder_elems();
        json            = eval(data);
        var profile_div     = this.Id("kve_tab_trained_content");
        profile_div.innerHTML   = '';
        var div = this.createDOM('div', {class:'fixed-table-container', style:"float:left;height:"+(parseInt(this.trained_grid_height_new)+31)+"px;"}, profile_div); 
        var div1 = this.createDOM('div', {class:'header-background', style:"background:#7691a4;"}, div);
        div = this.createDOM('div', {class:'fixed-table-container-inner'}, div);
        var table = this.createDOM("table",{id:"Topic_SubUnits_level1_table", class:"prof_table taxo-classification",  width:"100%"}, div);
        var row  = this.get_table_row(table, {}, "th", [{class:"taxo_header"},{class:"taxo_header"}, {class:"taxo_header"},{class:"taxo_header"}]);
        row.cells[0].innerHTML = '<div class="th-inner">Topic Id</div>'        
        row.cells[1].innerHTML = '<div class="th-inner">Topic Name</div>'        
        row.cells[2].innerHTML = '<div class="th-inner">Topic Count</div>'        
        row.cells[3].innerHTML = '<div class="th-inner">Populate</div>'        

        var sl_no           = 1;
        var img_path        = TASApp.config.IP+TASApp.config.JS_DIR+'/images/';
        for(var x in json){
            var taxo_name_new = json[x]['taxo_name'];
            var row = this.create_row_and_cols(table, "td", {class:"prof_td",onclick:"TASApp.gbl.search_tab.cgi_load_SubUnits_taxonomy_list(2,"+json[x]["taxo_id"]+",this)" },[json[x]['taxo_id'],json[x]['taxo_name'],json[x]['count'], '<img src="images/right.png" onclick="TASApp.gbl.search_tab.populate_topics(this)" />' ]);
            row.setAttribute('t_name',taxo_name_new);
            row.cells[0].setAttribute('style','width:15%;textAlign:left;');
            row.cells[1].setAttribute('style','width:45%;textAlign:left;');
            row.cells[2].setAttribute('style','width:20%;textAlign:left;');
            row.cells[3].setAttribute('style','width:20%;text-align:center;');
        }
        try{table.rows[2].cells[1].click();}catch(e){}
    }

    this.cgi_load_SubUnits_taxonomy_list = function(cnt, taxo_id, elem){
        this.Id('kve_tab_taxonomy_content').innerHTML = '';
        var myFrame = this.Id('iframe_filter');
        myFrame.setAttribute('src','blank.html');
        try{this.Id('Topic_SubUnits_level1_table').querySelector('tr.active_kve_table_prof_row').className = "";}catch(e){}
        elem.parentNode.className = "active_kve_table_prof_row";
        var new_taxo_name = elem.parentNode.getAttribute('t_name');
        sessionStorage['new_taxo_name'] = '';
        sessionStorage['new_taxo_name'] = new_taxo_name;
        sessionStorage['gbl_taxo_id'] = taxo_id;
        taxo_id = sessionStorage.gbl_taxo_id;
        this.Id('kve_prof_tab_menu_header').style.display = 'none';
        this.Id('kve_prof_tab_menu_content').innerHTML = '';
        this.createDOM("img", {src:"images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
        this.change_tabs(cnt);

        var json	= this.merge_json({"taxo_id":taxo_id,"flag":'6'});
        var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR_new + 'pattern_generation_v13/cgi_train_f2_data.py?input_str=';
        vservice_path		+= JSON.stringify(json);
        this.Logger.push("SubUnits CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.CallBack_load_SubUnits_taxonomy_list(json)" , "GET", true);
    }
    this.CallBack_load_SubUnits_taxonomy_list = function(json){
        var json = eval(json);
        var table_div = this.Id('kve_prof_tab_menu_content');
        table_div.innerHTML = '';
        var table       = this.createDOM("table",{id:"Topic_SubUnits_level1_table2", class:"prof_table taxo-classification", style:"width:100%"},table_div);
        if(json['Data'] == 'No data'){
            return;
        }
        for(var x in json){
            if(json[x]['profile_name'] == 'Remainder'){
                var row = this.create_row_and_cols(table, "td", {class:"prof_td" },[json[x]['sl_no'], json[x]['profile_name'], json[x]['total_trained_cnt']+ ' / '+ json[x]['manual_done_cnt'] + '/'+ json[x]['query_done_cnt']+' / '+json[x]['total_cnt'],'' ]);
            }
            else{
                var row = this.create_row_and_cols(table, "td", {class:"prof_td" },[json[x]['sl_no'], 'Profile ID '+json[x]['profile_name'], json[x]['total_trained_cnt']+' / '+json[x]['manual_done_cnt']+' / '+json[x]['query_done_cnt']+ ' / '+json[x]['total_cnt'], '' ]);
            }
            if(json[x]['done_flag'] == 1){
                row.setAttribute('style','background-color:#c7e3ff;');
            }
            row.cells[0].setAttribute('style','text-align:center');
            row.cells[1].setAttribute('style','text-align:center');
            row.cells[2].setAttribute('style','text-align:center');
            row.cells[3].setAttribute('style','text-align:center');
            var level_strA = json[x]['level_str'];
            for(var i=0; i<level_strA.length; i++){
                var div       = this.createDOM("div",{id:"kve_td_"+x+"_"+i, class:"kve_prof_level_data_green",style:"float:left;"},row.cells[3]);
                var span       = this.createDOM("span",{id:level_strA[i].split('~')[1], onclick:"TASApp.gbl.search_tab.load_row_SubUnits_taxonomy_list(this,1)"},div);
                span.innerHTML = level_strA[i].split('~')[0];
            }
        }
        
        table.rows[0].cells[3].firstChild.firstChild.click();

        this.cgi_fill_count_table();
    }
    this.cgi_fill_kve_trained_index_tabl_view_all = function(){
        var flagA = 2;
        var doc_id_All = 'All';
        var url     = "blockData.html?project_id="+TASApp.gbl.project_id +"&doc_id="+doc_id_All+"&user_id="+TASApp.gbl.user_id+"&agent_id="+TASApp.gbl.agent_id+"&mgmt_id="+TASApp.gbl.mgmt_id+"&taxo_id="+sessionStorage.gbl_taxo_id+"&flagA="+flagA+"&remainder_flag="+result_tab_selected;
        var myFrame = this.Id('iframe_filter');
        myFrame.setAttribute('src',url);
    }

    this.cgi_fill_kve_remainder_table = function(selected_value){
        gbl_selected_value = selected_value;
        this.createDOM("img", {src:"images/small-loader.gif",style:"float:left;margin-left:45%;display:block;margin-top:20%;"}, this.Id("kve_prof_tab_menu_content"));
        var json   = {"agent_id":5,"mgmt_id":1,"user_id":21,"taxo_id":57, "flag":7 };
        var vservice_path   = TASApp.config.CGI_IP+TASApp.config.CGI_DIR_new + 'pattern_generation_v13/cgi_train_f2_data.py?input_str=';
        vservice_path       += JSON.stringify(json);
        this.Logger.push("===="+vservice_path);
        this.send_ajax_request(vservice_path, null, 1, "TASApp.gbl.search_tab.CallBack_cgi_fill_kve_remainder_table(json)" , "GET", true);    
    }
    this.CallBack_cgi_fill_kve_remainder_table = function(json){
        var json = eval(json);
        var new_json = '';
        if(gbl_selected_value == 'reminder'){
            new_json = json['0'];
            this.Id('kve_remainder_complete_tab_id').className = 'tab_menu_active';
            this.Id('kve_remainder_partial_tab_id').className = '';
            this.Id('kve_cleared_tab_id').className = '';
        }else if (gbl_selected_value == 'partial'){
            new_json = json['1'];
            this.Id('kve_remainder_complete_tab_id').className = '';
            this.Id('kve_remainder_partial_tab_id').className = 'tab_menu_active';
            this.Id('kve_cleared_tab_id').className = '';
        }else if(gbl_selected_value == 'cleared'){
            new_json    = json['2'];
            this.Id('kve_remainder_complete_tab_id').className = '';
            this.Id('kve_remainder_partial_tab_id').className = '';
            this.Id('kve_cleared_tab_id').className = 'tab_menu_active';
            if(new_json == ''){
                var myFrame = this.Id('iframe_filter');
                myFrame.setAttribute('src','');
            }
        }
        var table_div = this.Id('kve_prof_tab_menu_content');
        table_div.innerHTML = '';
        var table       = this.createDOM("table",{id:"Topic_SubUnits_level1_table2", class:"prof_table taxo-classification"},table_div);
        for(var x in new_json){
            var row = this.create_row_and_cols(table, "td", {class:"prof_td" },[new_json[x]['sl_no'], 'Profile ID '+new_json[x]['profile_name'],'' ]);
            var level_strA = new_json[x]['level_str'];
            for(var i=0; i<level_strA.length; i++){
                var div       = this.createDOM("div",{id:"kve_td_"+x+"_"+i, class:"kve_prof_level_data_green",style:"float:left;"},row.cells[2]);
//                var span       = this.createDOM("span",{id:level_strA[i].split('~')[1], onclick:"TASApp.gbl.search_tab.load_row_SubUnits_taxonomy_list(this)", style:"float:left;"},div);
                var span       = this.createDOM("span",{id:level_strA[i].split('~')[1], onclick:"TASApp.gbl.search_tab.load_row_SubUnits_taxonomy_list(this,2)", style:"float:left;"},div);
                span.innerHTML = level_strA[i].split('~')[0];
            }
        }
        table.rows[0].cells[2].firstChild.firstChild.click();
    }

    this.load_row_SubUnits_taxonomy_list  = function(doc_idA,flagA){
        try{
            var remainder_value = doc_idA.innerHTML;
            var Table_id        = doc_idA.parentNode.parentNode.parentNode.parentNode.id;
            this.Id(Table_id).querySelector('tr.active_kve_table_prof_row').className = "";}catch(e){}
//          this.Id('Topic_SubUnits_level1_table2').querySelector('tr.active_kve_table_prof_row').className = "";}catch(e){}
            doc_idA.parentNode.parentNode.parentNode.className = "active_kve_table_prof_row";

            var url     = "blockData.html?project_id="+TASApp.gbl.project_id +"&doc_id="+doc_idA.id+"&user_id="+TASApp.gbl.user_id+"&agent_id="+TASApp.gbl.agent_id+"&mgmt_id="+TASApp.gbl.mgmt_id+"&taxo_id="+sessionStorage.gbl_taxo_id+"&flagA="+flagA+"&remainder_flag="+result_tab_selected+"&remainder_value="+remainder_value;
            var myFrame = this.Id('iframe_filter');
            myFrame.setAttribute('src',url);
    }
    this.merge_json = function(attr_json){
        var json   = JSON.parse(JSON.stringify(this.gbl_meta_data));
        for (var key in attr_json){
            json[key] = attr_json[key];
        }
        return json
    }
    this.init_layout = function(){
        this.trained_grid_height_new = this.trained_grid_height;
        var profile_div		= this.Id('url_content_1_home');
        profile_div.innerHTML = "";
	    this.createDOM("div",{id:"kve_tab_trained_content", style:"height: "+(parseInt(this.trained_grid_height_new)+54)+"px; width:100%; float: left;"}, profile_div);
//	    this.createDOM("div",{id:"kve_tab_mark_content", style:"height: "+this.url_height+"px; width:100%; float: left; display:none;"}, profile_div);
	    this.createDOM("div",{id:"kve_tab_taxonomy_content", style:"height: "+this.url_element_height+"px; width:100%; float: left;"}, profile_div);

        var menu        = this.Id('profile_div');
        menu.innerHTML = "";
	    this.createDOM("div",{id:"kve_prof_tab_menu_header1", class:"sb_kveRemainderMainDiv", style:"height: 25px;"}, menu);
        this.createDOM("div",{id:"kve_prof_tab_menu_header", class:"sb_kveRemainderMainDiv", style:"height: 25px;"}, menu);
        this.createDOM("div",{id:"kve_prof_tab_menu_content", style:"height: "+(this.profile_height-25)+"px; width:100%; float: left; overflow: auto; max-height: "+(this.profile_height-25)+"px;"}, menu);
    }
    this.set_drag_events    = function(elem){
        elem.setAttribute("ondragstart","return dragStart(event)");
        elem.setAttribute("draggable","true");
    }
    this.cgi_fill_kve_trained_index_table_tab =function(Obj){
        this.Id('kve_prof_tab_menu_content').innerHTML='';
        if(1==Obj){
            this.Id('kve_prof_tab_menu_header').style.display = 'block';
            this.Id('res_view_all').style.display = 'block';
            this.Id('kve_prof_tab_menu_content').innerHTML = '';
            result_tab_selected = 1;
            TASApp.gbl.search_tab.cgi_fill_kve_remainder_table('reminder');
        }else if(2 == Obj){
            this.Id('kve_prof_tab_menu_header').style.display = 'none';
            this.Id('res_view_all').style.display = 'none';
            this.Id('kve_prof_tab_menu_content').innerHTML = '';
            gbl_taxo_id = sessionStorage.gbl_taxo_id;
            if(gbl_taxo_id != ''){
                    TASApp.gbl.search_tab.cgi_fill_kve_trained_index_table();
//                TASApp.gbl.search_tab.cgi_load_SubUnits_taxonomy_list(2,gbl_taxo_id);
            }
        }else if(3 == Obj){
            this.Id('kve_prof_tab_menu_header').style.display = 'none';
        }
        this.change_tabs(Obj)
    }
    this.change_tabs    = function(Obj){
        for(var i=1; i<=3; i++){
            var Tbs = 'fTbs_'+i;
            try{
                if(i == Obj){
                    this.Id(Tbs).style.background = '#92BFCB';
                }else{
                    this.Id(Tbs).style.background = '#3C9BB4';
                }
            }catch(err){}
        }
    }

    this.add_kve_remainder_elems    = function(){
        var tab_div = this.Id("kve_prof_tab_menu_header")
        tab_div.innerHTML = '';

	    var tab_div1 = this.Id("kve_prof_tab_menu_header1")
        tab_div1.innerHTML = '';

        var index_div2   = this.createDOM("div",{style:"background:#3C9BB4;width:30%;float:right;"}, tab_div1);
        var view_all  = this.createDOM("span",{text:"View All",id:"res_view_all", style:"color:#fff;display:none;cursor:pointer;float:right;padding-right:10px;padding-top:3px;", onclick:"TASApp.gbl.search_tab.cgi_fill_kve_trained_index_tabl_view_all();"}, index_div2);
        view_all.innerHTML = "View All";

        var index_div1   = this.createDOM("div",{style:"background:#3C9BB4;width:70%;"}, tab_div1);
        var ul  = this.createDOM("ul",{id:"kve_index_prof_tab1", style:"margin:0;", kve_train_id:"0"}, index_div1);
        this.createDOM("li", {txt:"Results", id:"fTbs_1", onclick:"TASApp.gbl.search_tab.cgi_fill_kve_trained_index_table_tab(1);"}, ul);
        this.createDOM("li", {txt:" | "}, ul);
        this.createDOM("li", {txt:"Training Samples", id:"fTbs_2", onclick:"TASApp.gbl.search_tab.cgi_fill_kve_trained_index_table_tab(2);"}, ul);
        this.Id('fTbs_2').style.background = '#92BFCB';
        this.Id('kve_prof_tab_menu_header').style.display = 'none';


        var index_div   = this.createDOM("div",{}, tab_div);
        var ul  = this.createDOM("ul",{id:"kve_index_prof_tab", style:"margin:0;", kve_train_id:"0"}, index_div);
        this.createDOM("li", {txt:"Remainder", id:"kve_remainder_complete_tab_id", onclick:"TASApp.gbl.search_tab.results_tabs(this,'reminder')"}, ul);
        this.createDOM("li", {txt:" | "}, ul);
        this.createDOM("li", {txt:"Partial", id:"kve_remainder_partial_tab_id", onclick:"TASApp.gbl.search_tab.results_tabs(this,'partial')"}, ul);
        this.createDOM("li", {txt:" | "}, ul);
        this.createDOM("li", {txt:"Cleared", id:"kve_cleared_tab_id", onclick:"TASApp.gbl.search_tab.results_tabs(this,'cleared')"}, ul);
    }
    this.results_tabs = function(Obj,s_value){  
        if(s_value == 'reminder'){
            result_tab_selected = 1;
        }else if(s_value == 'partial'){
            result_tab_selected = 2;
        }else if(s_value == 'cleared'){
            result_tab_selected = 3;
        }
        this.cgi_fill_kve_remainder_table(s_value);
    }
    this.show_process_bar = function()
    {
	var frame       = this.Id('iframe_filter');
        var myFrame     = frame.contentWindow.document;
        myFrame.getElementById('process_div_rnd').style.display = 'block';

       //Panel.browser_window.this.Id('process_div_rnd').style.display = 'block';
       //Panel.browser_window.this.Id('process_div_rnd').scrollIntoView();
        //this.Logger.push("===="+Panel.browser_window.this.Id('process_div_rnd').parentNode.innerHTML);
    }
    this.hide_process_bar = function()
    {
	var frame       = this.Id('iframe_filter');
        var myFrame     = frame.contentWindow.document;

        if (myFrame.getElementById('process_div_rnd')){
            myFrame.getElementById('process_div_rnd').style.display = 'none';
        }
    }
    //add methods in panel side
}).apply(SubUnits.prototype);
