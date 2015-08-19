function Filter() {
    this.profile	= 70;
	this.tree 	= 0;
	this.url 	= 40;
	//Profile.call(this);
    Utils.call(this);

//Filter.prototype		= new Profile();
Filter.prototype		= new Utils();
Filter.prototype.constructor	= Filter;
(function(){
	this.make_layout	= function(){
        TASApp.config.CGI_DIR_new  = 'cgi-bin/TR_Legal_2013_12_23_web/slt_Code/';
        TASApp.config.XML_DIR_path  = 'TR_Legal_XML_Output/';

		var content_window      = this.Id('left_section'); //main_container3');
		var rect                = content_window.getBoundingClientRect();
		var height              = (rect.bottom - rect.top);
		var total_h	            = height - parseInt(TASApp.gbl.tab) -parseInt(TASApp.gbl.tab_menu) - parseInt(TASApp.gbl.footer) - parseInt(TASApp.gbl.crop_tool);
		this.total_h	        = total_h;
		this.tree_h	            = total_h * (this.tree/100);
		this.profile_h	        = total_h * (this.profile/100);
		this.url_h	            = total_h * (this.url/100);
		this.Id("profile_top_header_1_home").style.height	= total_h * (this.profile/100) +"px";
		this.Id("url_content_1_home").style.height	= total_h * (this.url/100) +"px";
		this.Id("website_tree").style.height			= this.tree_h +"px"; 
		this.Id("tree_header_1_home").innerHTML		= "";
       	this.Id('tree_header_1_home').className 		= 'sb_headerDiv extraction';
		this.Id('profile_div').innerHTML			    = '';
//		this.Id('profile_div_1').style.display		= 'block';
		this.Id("my_tree").innerHTML				    = '';
		this.Id("my_tree").style.width			    = '100%';
		this.Id("url_content_1_home").innerHTML		= '';
        this.Id('footerDiv').innerHTML 			    = "";
        var span       = this.createDOM("span",{id:"xml_generation", class:"review-span", style:"float:right;width:106px;height:18px;", onclick:"TASApp.gbl.search_tab.generate_XML()" },this.Id('footerDiv'));
        span.innerHTML = 'XML Generation';
        this.Id('tab_menu_header').style.display     = "none";
        this.Id('crop_tool_header').style.display    = "none";
		disp_none(this.Id('website_tree'));
//		disp_block(this.Id('crop_tool_header'));
		disp_none(this.Id("skip_stage"));
		this.add_crop_tool_elems();
	}
	this.init = function(){
		this.make_layout();
		this.cgi_load_level2_taxonomy_list();
        loadFlg = false;
        var url = "popUpProfile_filter2.html?project_id="+TASApp.gbl.project_id +"&loadFlg=false";
        var iframe = this.Id('iframe_filter');
        iframe.setAttribute('src',url);

		//this.load_taxonomy_lists()
		//this.load_taxoLevelMapping();
	}
    this.generate_XML = function(){
        show_process_barF();
        var input_json 		= { "url_id": TASApp.gbl.url_id, "flag":'4'} ;	
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR_new + 'pattern_generation_v13/cgi_validation_xml_generation_demo.py?input_str=';
		var cgi			= vservice_path+JSON.stringify(input_json);
       	this.send_ajax_request(cgi, null, 1,"TASApp.gbl.search_tab.CallBack_generate_XML(json)", "GET", true);
    }
    this.CallBack_generate_XML      = function(json){
        var json = eval(json);

        if(json['error_flag'] == 'Error'){
            var r = confirm("Some Error Occured.. Do you want continue..");
            if(r == true){
                var XML_path    = TASApp.config.CGI_IP + TASApp.config.XML_DIR_path + json['xml_file_name'];
                this.Id('excel_path1').value = XML_path;
                form_obj = $('#dwnreport');
                form_obj.submit();
                hide_process_barF();
            }else{
                hide_process_barF();
                return;
            }
        }

    }
	this.cgi_load_level2_taxonomy_list = function(){
		var input_json 		= {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "mgmt_id":  TASApp.gbl.mgmt_id, "flag":'1'} ;	
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR_new + 'pattern_generation_v13/cgi_validation_xml_generation_demo.py?input_str=';
		var cgi			= vservice_path+JSON.stringify(input_json);
//        alert(cgi)
       	this.send_ajax_request(cgi, null, 1,"TASApp.gbl.search_tab.load_level2_taxonomy_list(json)", "GET", true);
	}

	this.load_level2_taxonomy_list	= function(json){
		json 			= eval(json);
        var profile_div 	= this.Id("url_content_1_home");
		profile_div.style.overflow = 'auto';
        profile_div.innerHTML   = '';
		var styleA		= 'text-align: left;background: none repeat scroll 0% 0% #395674;color: #FFF;height: 26px;cursor: pointer;';
        var sl_no       	= 1;
        var img_path    	= TASApp.config.IP+TASApp.config.JS_DIR+'/images/';
        var table 		= this.createDOM("table",{id:"Topic_SubUnits_level1_table", class:"prof_table taxo-classification"},profile_div);
        this.create_row_and_cols(table, "th", {class:"kve_header",'style':styleA},["Topic Id", "Topic Name", "Topic Count"]);
        for(var x in json){
            var row = this.create_row_and_cols(table, "td", {class:"prof_td", taxo_id:json[x]['taxo_id'], onclick:"TASApp.gbl.search_tab.cgi_load_filter2_taxonomy_list(this)" },[json[x]['taxo_id'],json[x]['taxo_name'],json[x]['count']]);
	   		row.cells[0].setAttribute('style','width:15%;textAlign:left;');
	   		row.cells[1].setAttribute('style','width:45%;textAlign:left;');
	   		row.cells[2].setAttribute('style','width:15%;textAlign:left;');
        }
        table.rows[1].cells[1].click();
	}

	this.cgi_load_filter2_taxonomy_list = function(elem){
        try{this.Id('Topic_SubUnits_level1_table').querySelector('tr.active_kve_table_prof_row').className = "prof_td";}catch(e){}
        elem.parentNode.className = "active_kve_table_prof_row"; 
        TASApp.gbl.taxo_id  =  elem.getAttribute('taxo_id');
		var input_json 		= {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id,  "mgmt_id":  TASApp.gbl.mgmt_id,'flag':'2',"taxo_id":TASApp.gbl.taxo_id} ;	
        var vservice_path   = TASApp.config.CGI_IP+TASApp.config.CGI_DIR_new + 'pattern_generation_v13/cgi_validation_xml_generation_demo.py?input_str=';
        var cgi             = vservice_path+JSON.stringify(input_json);
//        alert(cgi)
        this.send_ajax_request(cgi, null, 1,"TASApp.gbl.search_tab.call_Back_load_filter2_taxonomy_list(json)", "GET", true);
    }
    this.check_all_sub_taxo_checks = function(elem){
        var sib = elem.parentNode.parentNode.parentNode;
        var flg = false, inputElms;
        if (elem.checked){
            inputElms = sib.querySelectorAll('input[name="select_sub_taxo"]:not(:checked)');
            flg = true;
        }
        else{
            inputElms = sib.querySelectorAll('input[name="select_sub_taxo"]:checked');
        }
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = flg;
        } 
        if (flg){
            TASApp.gbl.search_tab.get_sub_taxo_data(elem.parentNode.parentNode)
        }else{
            var url = "popUpProfile_filter2.html?project_id="+TASApp.gbl.project_id +"&loadFlg=false";
            var iframe = this.Id('iframe_filter');
            iframe.setAttribute('src',url);
        }
    } 
    this.call_Back_load_filter2_taxonomy_list =function(json){
        global_taxo_dict    = {} 
        var lower_div       = this.Id('profile_div_1');
        lower_div.innerHTML = '';

        var table       = this.createDOM('table', { class:'vald_td'},lower_div);
        var tr          = this.createDOM('tr', {class:'vald_td'},table);
        var th          = this.createDOM('th', {txt:'All',style:'width:45px;max-width;50px;',class:'vald_td'},tr);
        var all_chk     = this.createDOM('input', {type:'checkbox', onclick:'TASApp.gbl.search_tab.check_all_sub_taxo_checks(this);',class:'vald_td'},th);
        var th          = this.createDOM('th', {txt:'Sub Taxo ID',class:'vald_td'},tr);
        var th          = this.createDOM('th', {txt:'Count',class:'vald_td'},tr);
        var index       = 1
        for(var y in json){
            var tr          =   this.createDOM('tr',{taxo_id:json[y]['sub_taxo_id'],class:'vald_td_normal'},table);
            global_taxo_dict[json[y]['sub_taxo_id']]  = json[y]['taxo_name'] 
            var td          =   this.createDOM('td', {style:'width:35px; max-width;45px;text-align:center;',class:'vald_td_normal'},tr);
            var chk         =   this.createDOM('input', {type:'checkbox', name:'select_sub_taxo',class:'vald_td_normal'},td);
            chk.onchange        = function(){
                sub_taxo_table_chk  = this;
                TASApp.gbl.search_tab.get_sub_taxo_data(this.parentNode.parentNode)
            }   
            var td          =   this.createDOM('td', {txt:json[y]['taxo_name'],class:'vald_td_normal'},tr);
            var td          =   this.createDOM('td', {txt:json[y]['count'],class:'vald_td_normal'},tr);
        }    
        sessionStorage['global_taxo_dict'] = '';
        sessionStorage['global_taxo_dict'] = JSON.stringify(global_taxo_dict);
    }

    this.sub_taxo_id_ar = [];
    this.get_sub_taxo_data           = function(elm){
        if(elm.cells[0].querySelector('input').checked == true){
			elm.style.backgroundColor = "#d7d7d7";
        }else{
            elm.style.backgroundImage   = '';
        }
        var table               = elm.parentNode;
        var selected_chks       = table.querySelectorAll('input[name=select_sub_taxo]:checked')
        TASApp.gbl.search_tab.sub_taxo_id_ar      = []
        if(selected_chks.length == 0){
            var url = "popUpProfile_filter2.html?project_id="+TASApp.gbl.project_id +"&loadFlg=false";
            var iframe = this.Id('iframe_filter');
            iframe.setAttribute('src',url);
        }
        for(var i=0; i<selected_chks.length; i++){
            TASApp.gbl.search_tab.sub_taxo_id_ar.push(selected_chks[i].parentNode.parentNode.getAttribute('taxo_id'))
        }
        sessionStorage['sub_taxo_id_ar']= '';
        sessionStorage['sub_taxo_id_ar']= JSON.stringify(TASApp.gbl.search_tab.sub_taxo_id_ar);
        var json            = {};
        json['user_id']     = TASApp.gbl.user_id
        json['agent_id']    = TASApp.gbl.agent_id;
        json['mgmt_id']     = TASApp.gbl.mgmt_id;
        json['taxo_id']     = TASApp.gbl.taxo_id;
        json['sub_taxo_ar'] = TASApp.gbl.search_tab.sub_taxo_id_ar;
        json['flag']        = '3';
        var retJ            = null;
        TASApp.gbl.search_tab.get_subtaxo_id_data_ajax(json);
    }
     this.get_subtaxo_id_data_ajax     = function(json){
        show_process_barF();
        var vservice_path  = TASApp.config.CGI_IP+TASApp.config.CGI_DIR_new + 'pattern_generation_v13/cgi_validation_xml_generation_demo.py' + '?';
        var post_data       = "input_str=" + JSON.stringify(json);
        console.log("Save Right CGI... "+vservice_path+post_data+" === ");
        this.send_ajax_request(vservice_path, post_data, 1,  "TASApp.gbl.search_tab.call_back_get_subtaxo_id_data_ajax(json)", "POST", true);
    }
    this.call_back_get_subtaxo_id_data_ajax = function(json){
        if(json == undefined){
            hide_process_barF();
            return;
        }
        sub_taxo_json       = eval(json);
        retJ                = sub_taxo_json[1]
        date_subset_count_json  = sub_taxo_json[0]
        
        sessionStorage['rejson'] = '';
        sessionStorage['date_subset_count_json'] = '';

        sessionStorage['rejson'] = JSON.stringify(retJ);
        sessionStorage.setItem('date_subset_count_json', JSON.stringify(date_subset_count_json));
        TASApp.gbl.search_tab.draw_extd_valdiation_table();
    }    

    this.draw_extd_valdiation_table  = function(){
//        var url     = "popUpProfile_filter2.html?project_id="+TASApp.gbl.project_id +"&loadFlg=true"+"&stage_id="+TASApp.gbl.active_stage_id+"&user_id="+TASApp.gbl.user_id+"&mgmt_id="+TASApp.gbl.mgmt_id+"&url_id="+TASApp.gbl.url_id+"&doc_server_path="+TASApp.config.IMAGE_IP+"&cgi_server_path="+TASApp.config.CGI_IP+"&agent_id="+TASApp.gbl.agent_id+"&cmd_id="+this.cmd_id+"&rejson="+rejson+"&date_subset_count_json="+date_subset_count_json+"&doc_id="+TASApp.gbl.doc_id;
        var url     = "popUpProfile_filter2.html?project_id="+TASApp.gbl.project_id +"&loadFlg=true"+"&stage_id="+TASApp.gbl.active_stage_id+"&user_id="+TASApp.gbl.user_id+"&mgmt_id="+TASApp.gbl.mgmt_id+"&url_id="+TASApp.gbl.url_id+"&doc_server_path="+TASApp.config.IMAGE_IP+"&cgi_server_path="+TASApp.config.CGI_IP+"&agent_id="+TASApp.gbl.agent_id+"&cmd_id="+this.cmd_id+"&doc_id="+TASApp.gbl.doc_id;
        hide_process_barF();
        var myFrame = this.Id('iframe_filter');
        myFrame.setAttribute('src',url);
    }

	this.cgi_populate_taxo	= function(myId){
		var input_json 		= {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "mgmt_id":  TASApp.gbl.mgmt_id, "flag":'1'} ;	
		var input_json 		= {"user_id": TASApp.gbl.user_id, "agent_id":'46', "mgmt_id":'7', "flag":'1'} ;	
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR_new + 'pattern_generation_v13/cgi_train_f2_data.py?input_str=';
		var cgi			= vservice_path+JSON.stringify(input_json);
//		alert(cgi)
      	this.send_ajax_request(cgi, null, 1,"TASApp.gbl.search_tab.call_Back_cgi_populate_taxo(json)", "GET", true);
	}
	this.call_Back_cgi_populate_taxo = function(json){

	}

	this.load_taxonomy_lists = function(){		
		//this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"display:block;margin:0px auto;"}, this.Id("url_content_1_home"));	
		var input_json 		= {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id, "url_id": TASApp.gbl.url_id, "cmd_id":101} ;	
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + 'pattern_generation_v13/cgi_get_taxonomy_and_level_new.py?input_str=';
		var cgi			= vservice_path+JSON.stringify(input_json);
		alert(cgi)
		Log("CGI Taxonomy classification  level 2=== > "+cgi);
        	this.send_ajax_request(cgi, null, 1,"TASApp.gbl.search_tab.taxonomy_lists(json)", "GET", true);
	}
	this.load_taxoLevelMapping = function(){		
		inp_json = {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id};	
        	vservice_path = TASApp.config.CGI_IP+TASApp.config.CGI_DIR +'validate_taxonomy/cgi_validate_taxonomy_mapping.py?input_str=';
		cgi			= vservice_path+JSON.stringify(input_json);
//		alert(cgi)
		Log("CGI Taxonomy Mapping Level 2 === > "+cgi);
        	//this.send_ajax_request(cgi, null, 1,"filterOP.taxoLevelMapping= json;get_all_filter_links();", "GET", true);
        	this.send_ajax_request(cgi, null, 1,"filterOP.taxoLevelMapping= json;", "GET", true);
	}
	this.save_into_filter_mgmt	= function(){
	      	try{show_content_prog_bar();}catch(e){this.Logger.push("Error show_content_prog_bar hide "+e)}
	      	var r=confirm("Do you want to save");
	      	if (r==true){
			Log("Save process");
 	      	}else{
		  return;
              	}
//    		Panel.hide_panel_window();
        	var vservice_path = TASApp.config.CGI_IP+TASApp.config.CGI_DIR +'excell_filter/cgi_save_filter_level_data.py?input_str=';
		var vtt = {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id, 'doc_id':TASApp.gbl.doc_id, 'taxo_id': TASApp.gbl.extraction_main_taxo_id, 'taxo_level_id': TASApp.gbl.filter_stage_id, "level_id":TASApp.gbl.extraction_level_id};
		var cgi			= vservice_path+JSON.stringify(vtt);
		Log("CGI Save Taxonomy classification === > "+cgi);
        	this.send_ajax_request(cgi, null, 1,"TASApp.gbl.search_tab.save_callback(text)", "GET", true);
		
	}
	this.upload_advanced_filter_data	= function(){
	      	try{show_content_prog_bar();}catch(e){this.Logger.push("Error show_content_prog_bar hide "+e)}
	      	var r=confirm("Do you want to Upload");
	      	if (r==true){
			Log("Upload process");
 	      	}else{
			return;
              	}
//    		Panel.hide_panel_window();
		var source_taxo_id	= TASApp.gbl.extraction_main_taxo_id+"_1_1_N";
        	var vservice_path = TASApp.config.CGI_IP+TASApp.config.CGI_DIR +'pattern_generation_v13/cgi_upload_rank_data.py?input_str=';
		var vtt = {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id, 'doc_id':TASApp.gbl.doc_id, 'taxo_id': TASApp.gbl.extraction_main_taxo_id, 'taxo_level_id': TASApp.gbl.filter_stage_id, "level_id":TASApp.gbl.extraction_level_id, source_taxo_id:source_taxo_id};
		var cgi			= vservice_path+JSON.stringify(vtt);
		Log("CGI Save Taxonomy classification === > "+cgi);
        	this.send_ajax_request(cgi, null, 1,"TASApp.gbl.search_tab.save_callback(text)", "GET", true);
		
	}
	this.load_advanced_filter	= function()	{
        	var vservice_path = TASApp.config.CGI_IP+TASApp.config.CGI_DIR +'pattern_generation_v13/cgi_get_count_rows.py?input_str=';
		var vtt = {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id, stage_id:TASApp.gbl.active_stage_id};
		var cgi			= vservice_path+JSON.stringify(vtt);
		Log("CGI load_advanced_filter classification === > "+cgi);
        	this.send_ajax_request(cgi, null, 1,"TASApp.gbl.search_tab.store_advanced_filter_taxo(json)", "GET", true);
	}
	this.generate_html_str_group	= function(){
		Panel.hide_panel_window();
		try{show_content_prog_bar();}catch(e){this.Logger.push("Error show_content_prog_bar hide "+e)}
        	var vservice_path = TASApp.config.CGI_IP+TASApp.config.CGI_DIR +'pattern_generation_v13/cgi_generate_filter_data.py?input_str=';
		var vtt = {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id, stage_id:TASApp.gbl.active_stage_id, level_id:TASApp.gbl.extraction_level_id, taxo_id:TASApp.gbl.extraction_main_taxo_id};
		var cgi			= vservice_path+JSON.stringify(vtt);
		Log("CGI Generate Html === > "+cgi);
        	this.send_ajax_request(cgi, null, 1,"TASApp.gbl.search_tab.generate_html_str_group_callback(text)", "GET", true);
	}
	this.generate_html_str_group_callback	= function(){
		try{show_content_prog_bar(true);}catch(e){this.Logger.push("Error show_content_prog_bar hide "+e)}
		var elem	= document.getElementsByClassName("taxo-active-row")[0];
		Log(elem.outerHtml);
		elem.parentNode.previousSibling.lastChild.checked	= false;
		this.load_slt_filter(elem.id.split('-').pop(), elem);
	}
	this.load_slt_filter	= function(taxo_level, elem, filter_flag){
		TASApp.gbl.extraction_main_taxo_id  = taxo_level.split("^")[1];
		TASApp.gbl.extraction_level_id      = taxo_level.split("^")[0];
		var chkbox  = elem.parentNode.previousSibling.lastChild.checked;
		try{document.getElementsByClassName("taxo-active")[0].className = '';}catch(e){}
		elem.className	= "taxo-active";
		try{document.getElementsByClassName("taxo-active-row")[0].className = '';}catch(e){}
		elem.parentNode.parentNode.className	= "taxo-active-row";
		/*if(chkbox == true){
			var r=confirm("Do you want to generate filter data");
			if (r==true){
				this.generate_html_str_group();
					return;
			}else{
			}
		}*/
		elem.parentNode.previousSibling.lastChild.checked	= false;

		TASApp.gbl.extraction_main_taxo_id	= taxo_level.split("^")[1];
		TASApp.gbl.extraction_level_id		= taxo_level.split("^")[0];
		TASApp.gbl.filter_stage_id		= 1;
		disp_none(this.Id('crop_tool_header'));
		disp_none(this.Id('profile_div'));
		this.Id("website_tree").style.height		= ((this.total_h *0.7)+30) +"px"; 
		var parent_div	= this.Id("my_tree");
		parent_div.innerHTML	= '';
		var main_div		= this.createDOM("div", {id:"pattern_filter_groupData", style:"float:left;width:100%; height:100%; display:none;overflow:auto; background:#fff;"}, parent_div);
		var applicator_res 	= this.createDOM("div",{ id:"pattern_filter_applicator_results", style:"float:left;width:100%; height:100%; overflow:auto"}, main_div);
		//var applicator_res_header = this.createDOM("div",{ id:"pattern_filter_applicator_results_header", style:"float:left; width:100%; height:20px; background:#959595;"}, applicator_res);
		var applicator_res_header1 = this.createDOM("div",{ id:"pattern_filter_applicator_results_header", class:"sb_headerDiv",style:"float:left; width:100%; height:20px; cursor:pointer; font-weight:bold;", onclick:""}, applicator_res);
		this.createDOM("div", {id:"applicator_results", class:"sb_headerDiv", style:"float:left; width:50%; height:100%;color:#fff; cursor:pointer", txt:"Applicator Results"}, applicator_res_header1);
		//this.createDOM("div", {id:"HTML_results", style:"float:left; width:33%; height:100%; text-align:center; color:#fff;cursor:pointer", txt:"HTML"}, applicator_res_header1);
		//this.createDOM("div", {id:"HTML_G_results", style:"float:left; width:33%; height:100%; text-align:center; color:#fff;cursor:pointer", txt:"HTML G"}, applicator_res_header1);
		this.createDOM("div",{id:"pattern_filter_applicator_results_body", style:"float:left; width:100%; height:95%; overflow:auto;"}, applicator_res);
		//var user_results	= this.createDOM("div", {id:"pattern_filter_user_results", style:"float:left;width:100%; height:50%; overlow:auto;"}, main_div);
		//var user_results_header	= this.createDOM("div", {id:"pattern_filter_user_results_header", style:"float:left; width:100%; height:20px; background:#959595;"}, user_results)
		//this.createDOM("div", {style:"cursor:pointer; color:#fff; font-weight:bold", class:"sb_headerDiv", onclick:"panelFilter.getUserSubmittedGroups();", txt:"Final Submitted Groups"}, user_results_header);
		//this.createDOM("div",{id:"pattern_filter_user_results_body", style:"float:left; width:100%; height:85%; overflow:auto;"}, user_results);
		var source_taxo_id	= TASApp.gbl.extraction_main_taxo_id+"_1_1_N";
		TASApp.gbl.filter_flag	= 0;
                Log("filter_flag == "+filter_flag);
		if(filter_flag == 'filter'){
			TASApp.gbl.filter_flag	= 1;
			load_adv_filter();

			//var url		= TASApp.config.IP + "TR_Legal_2013_12_23_web/source/plugin_lmdb/filterData/popUpProfile_prmy.html?project_id="+TASApp.gbl.project_id+"&stage_id="+TASApp.gbl.active_stage_id+"&user_id="+TASApp.gbl.user_id+"&mgmt_id="+TASApp.gbl.mgmt_id+"&group_id="+TASApp.gbl.group_id+"&doc_server_path="+TASApp.config.CGI_IP+"&agent_id="+TASApp.gbl.agent_id+"&taxo_id="+TASApp.gbl.extraction_main_taxo_id+'&filter_flag='+filter_flag;
			//Panel.show_panel_window(url);
		}else{
			var url		= TASApp.config.IP + "TR_Legal_2013_12_23_web/source/plugin_lmdb/advance_filter/blockData.html?project_id="+TASApp.gbl.project_id+"&stage_id="+TASApp.gbl.active_stage_id+"&user_id="+TASApp.gbl.user_id+"&mgmt_id="+TASApp.gbl.mgmt_id+"&group_id="+TASApp.gbl.group_id+"&doc_server_path="+TASApp.config.CGI_IP+"&agent_id="+TASApp.gbl.agent_id+"&source_taxo_id="+source_taxo_id+"&taxo_id="+TASApp.gbl.extraction_main_taxo_id+"&level_id="+TASApp.gbl.extraction_level_id+"&filter_level_id="+TASApp.gbl.filter_stage_id;
			Panel.show_panel_window(url);
		}
		var input_json	= {"user_id":TASApp.gbl.user_id,"agent_id":TASApp.gbl.agent_id,"mgmt_id":TASApp.gbl.mgmt_id, "taxo_id":TASApp.gbl.extraction_main_taxo_id, "level_id":TASApp.gbl.extraction_level_id}; 
		this.Id("pattern_filter_groupData").style.display = "block";
        	var vservice_path = TASApp.config.CGI_IP+TASApp.config.CGI_DIR +'pattern_generation_v13/cgi_applictor_stats_block.py?input_str=';
		var cgi		= vservice_path+JSON.stringify(input_json);
                Log("applictor_stats_block ===> "+cgi);
		//this.send_ajax_request(cgi, null, 1,"draw_applicator_stat_table(json)", "GET", true);
	}
	this.store_advanced_filter_taxo	= function(json){
		TASApp.gbl.adv_filter_taxos	= json;
		TASApp.gbl.active_taxo_count	= {};
		json.forEach(function(value){
			if(TASApp.gbl.extraction_main_taxo_id == value.taxo_id)
				TASApp.gbl.active_taxo_count	= value;
		});
		Log(JSON.stringify(TASApp.gbl.active_taxo_count))
		disp_none(this.Id('crop_tool_header'));
		disp_none(this.Id('profile_div'));
		this.Id("website_tree").style.height		= ((this.total_h *0.7)+30) +"px"; 
		disp_block(this.Id("website_tree"));
		var parent_div	= this.Id("my_tree");
		disp_block(parent_div);
		parent_div.innerHTML	= '';
		var main_div		= this.createDOM("div", {id:"pattern_filter_groupData", style:"float:left;width:100%; height:100%; display:none;overflow:auto; background:#fff;"}, parent_div);
		var applicator_res 	= this.createDOM("div",{ id:"pattern_filter_applicator_results", style:"float:left;width:100%; height:50%; overflow:auto"}, main_div);
		//var applicator_res_header = this.createDOM("div",{ id:"pattern_filter_applicator_results_header", style:"float:left; width:100%; height:20px; background:#959595;"}, applicator_res);
		var applicator_res_header1 = this.createDOM("div",{ id:"pattern_filter_applicator_results_header", class:"sb_headerDiv",style:"float:left; width:100%; height:20px; cursor:pointer; font-weight:bold;", onclick:"panelFilter.switchHTMLTabs(event);"}, applicator_res);
		this.createDOM("div", {id:"applicator_results", class:"sb_headerDiv", style:"float:left; width:34%; height:100%;color:#fff; cursor:pointer", txt:"Applicator Resultss"}, applicator_res_header1);
		//this.createDOM("div", {id:"HTML_results", style:"float:left; width:33%; height:100%; text-align:center; color:#fff;cursor:pointer", txt:"HTML"}, applicator_res_header1);
		//this.createDOM("div", {id:"HTML_G_results", style:"float:left; width:33%; height:100%; text-align:center; color:#fff;cursor:pointer", txt:"HTML G"}, applicator_res_header1);
		this.createDOM("div",{id:"pattern_filter_applicator_results_body", style:"float:left; width:100%; height:80%; overflow:auto;"}, applicator_res);
		var user_results	= this.createDOM("div", {id:"pattern_filter_user_results", style:"float:left;width:100%; height:50%; overlow:auto;"}, main_div);
		var user_results_header	= this.createDOM("div", {id:"pattern_filter_user_results_header", style:"float:left; width:100%; height:20px; background:#959595;"}, user_results)
		this.createDOM("div", {style:"cursor:pointer; color:#fff; font-weight:bold", class:"sb_headerDiv", onclick:"panelFilter.getUserSubmittedGroups();", txt:"Final Submitted Groups"}, user_results_header);
		this.createDOM("div",{id:"pattern_filter_user_results_body", style:"float:left; width:100%; height:85%; overflow:auto;"}, user_results);
		var source_taxo_id	= TASApp.gbl.extraction_main_taxo_id+"_1_1_N";
		var url		= TASApp.config.IP + "TR_Legal_2013_12_23_web/source/plugin_lmdb/filterData/popUpProfile_prmy.html?project_id="+TASApp.gbl.project_id+"&stage_id="+TASApp.gbl.active_stage_id+"&user_id="+TASApp.gbl.user_id+"&mgmt_id="+TASApp.gbl.mgmt_id+"&group_id="+TASApp.gbl.group_id+"&doc_server_path="+TASApp.config.CGI_IP+"&agent_id="+TASApp.gbl.agent_id+"&source_taxo_id="+source_taxo_id+"&taxo_id="+TASApp.gbl.extraction_main_taxo_id+'&filter_flag='+TASApp.gbl.filter_flag;
		Panel.show_panel_window(url);
	}
	this.save_callback	= function(text){
	      try{show_content_prog_bar(true);}catch(e){this.Logger.push("Error show_content_prog_bar hide "+e)}
		if(/^DONE$/.test(text.trim())){
			alert("Done");
		}else
			alert("Error : Not Done!!!")
	}
	this.taxonomy_lists	= function(json){
//	return;
        TASApp.gbl.filter_level_taxo_ids    = {};
//		Panel.hide_panel_window();
                this.Id("my_tree").innerHTML	= '';
                this.Id("profile_div").innerHTML	= '';
                var profile_div	= this.Id("url_content_1_home");
		profile_div.innerHTML	= '';
		var profile_div_header	= this.createDOM("div",{style:"width:100%;height:30px;"},profile_div);
		var profile_div_body	= this.createDOM("div",{style:"width:100%;height:"+(this.url_h - 33)+"px;overflow:auto;"},profile_div);
		var table = this.createDOM("table",{id:"", class:"prof_table taxo-classification"},profile_div_body);
		var table_header = this.createDOM("table",{id:"table_prof", class:"prof_table taxo-classification"},profile_div_header);
		this.create_row_and_cols(table, "th", {class:"prof_td_head"},["No.","Taxonomy", "Populate", "Applicator", "Process"]);
		var sl_no	= 1;
        	var img_path    = TASApp.config.IP+TASApp.config.JS_DIR+'/images/';
		for(var taxo_id in json){
            	TASApp.gbl.filter_level_taxo_ids[taxo_id]    = TASApp.gbl.taxo_mapping[taxo_id];
            	var levels	= json[taxo_id];
            	var filter_flag = 'N';
			for(var level_id in levels)
				if(levels[level_id] == 'filter')
                    filter_flag = 'Y';
		var row	= this.create_row_and_cols(table, "td", {class:"prof_td", style:"color: #6B9EBD;text-decoration : none;font-weight:bold;"},[sl_no++,TASApp.gbl.taxo_mapping[taxo_id], "<img id='"+taxo_id+"' src='"+img_path+"right.png' onclick='populate_data(this.id)'>", "<img id='"+taxo_id+"' src='"+img_path+"right.png' onclick='accept_data(this.id)'>", "<img id='"+filter_flag+"^"+taxo_id+"' src='"+img_path+"right.png' onclick='TASApp.gbl.search_tab.load_second_level_filter(this)'>"]);
            row.cells[2].style.textAlign    = 'center';
            row.cells[3].style.textAlign    = 'center';
		}
		var row		= this.create_row_and_cols(table_header, "th",{class:"prof_td_head"},["No. ","Taxonomy","Populate","Applicator","Process"]);
		this.set_index_header_width(table, table_header);
		//remove_node(table.firstChild);
	}
    this.load_second_level_filter   = function(elem){
        var taxo_level   = elem.id;
		TASApp.gbl.extraction_main_taxo_id  = taxo_level.split("^")[1];
		TASApp.gbl.extraction_level_id      = 0;
		TASApp.gbl.filter_stage_id		= 1;
		TASApp.gbl.filter_flag	= 0;
		if (taxo_level.split("^")[0] == "Y")
			TASApp.gbl.filter_flag	= 1;
        TASApp.gbl.active_filter_mode == 'Y';
	    load_adv_filter();
    }
	/**
	 * Description
	 * @method set_index_header_width
	 * @param {} t1
	 * @param {} t2
	 * @return 
	 */
	this.set_index_header_width	= function(t1, t2){
		var doc		= t1.ownerDocument;
		var table	= t1;
		var table_header= t2;
		var row		= table_header.firstChild;
		if(table.rows.length){
			var cells	= table.rows[0].cells;
			for(var ind = 0, len = cells.length; ind < len;ind++){
				var rect = cells[ind].getBoundingClientRect();
				row.cells[ind].style.width = (rect.right - rect.left - 5)+"px";
				table.style.marginTop	="-"+(rect.bottom - rect.top)+"px";
			}
		}
	}
	this.draw_cropping_tools	= function(){	
		var parentElem	= this.Id('crop_tool_header');
        	parentElem.innerHTML		= '';
        	//this.createDOM("span", {class:"review-span",id:'delete_filter_profile', txt:"Delete",onclick:"MyApp.EDIT.create_delete_cells()"}, parentElem);
        	//this.createDOM("span", {class:"review-span",id:'add-taxo', txt:"Add",onclick:"Getdwg_select_rect()"}, parentElem);
        	//this.createDOM("span", {class:"review-span",style:'margin-left:10px',id:'load-taxo', txt:"Get Untrained Data",onclick:"TASApp.gbl.search_tab.load_train_data(true)"}, parentElem);
                //this.createDOM("img", {id:"rec_status_11", style:"padding-top:4px;float:right;", src:"icons/record_green.png", height:"10", width:"10", title:"Record Status", class:"tooltip"}, parentElem);
                //this.createDOM("span", {class:"review-span", style:"float:right", txt:"Update", id:'filter-get-taxos', onclick:'TASApp.gbl.search_tab.get_taxo_profiles_data()'}, parentElem);
        var subparent = this.Id('profile_div');
		var tab_div1 = this.createDOM("div",{id:"kve_prof_tab_menu_header1", class:"sb_kveRemainderMainDiv", style:"height: 25px;"}, subparent);
        tab_div1.innerHTML = '';

		var index_div1   = this.createDOM("div",{style:"background:#3C9BB4;width:100%;"}, tab_div1);
/*
                var ul  = this.createDOM("ul",{id:"kve_index_prof_tab1", style:"margin:0;", kve_train_id:"0"}, index_div1);
                this.createDOM("li", {txt:"Training Samples", id:"fTbs_1", onclick:"TASApp.gbl.search_tab.cgi_fill_kve_trained_index_table_tab1(1);"}, ul);
                this.createDOM("li", {txt:" | "}, ul);
                this.createDOM("li", {txt:"Trained Profiles", id:"fTbs_2", onclick:"TASApp.gbl.search_tab.cgi_fill_kve_trained_index_table_tab1(2);"}, ul);
                this.createDOM("li", {txt:" | "}, ul);
                this.createDOM("li", {txt:"Results", id:"fTbs_3", onclick:"TASApp.gbl.search_tab.cgi_fill_kve_trained_index_table_tab1(3);"}, ul);
                this.Id('fTbs_1').style.background = '#92BFCB';
*/
                this.createDOM("div",{id:"profile_div_1", class:"sb_kveRemainderMainDiv2", style:"height: 100%; width:100%;"},subparent );
                this.createDOM("div",{id:"profile_div_2", class:"sb_kveRemainderMainDiv2", style:"height: 100%; width:100%; display:none;"},subparent );
                this.createDOM("div",{id:"profile_div_3", class:"sb_kveRemainderMainDiv2", style:"height: 100%; width:100%; display:none;"},subparent );
	}
	this.cgi_fill_kve_trained_index_table_tab1 =function(Obj){
               for(var i=1; i<=3; i++){
                        var Tbs = 'fTbs_'+i;
                        if(i == Obj){
                                this.Id('profile_div_'+i.toString()).style.display = 'block';
                                this.Id(Tbs).style.background = '#92BFCB';
                        }else{
                                this.Id('profile_div_'+i.toString()).style.display = 'none';
                                this.Id(Tbs).style.background = '#3C9BB4';
                        }
                }
        }


	this.get_taxo_profiles_data	= function(flag){
                if(flag != 'N')
			TASApp.gbl.search_tab.doc_id	= TASApp.gbl.active_filter_doc_id;
                Log("TASApp.gbl.search_tab.doc_id == "+TASApp.gbl.search_tab.doc_id);
		this.Id("profile_div").innerHTML	= '';
		this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"display:block;margin:0px auto;"}, this.Id("profile_div"));
		if(!TASApp.gbl.search_tab.doc_id)
			return;
		TASApp.gbl.search_tab.get_profiles_data(flag);
	}
	this.add_crop_tool_elems	= function(){
		var crop_tool	= this.Id('crop_tool_header');
        	crop_tool.innerHTML		= '';
		this.draw_cropping_tools(crop_tool);
	}
	this.load_level_content	= function(taxo_level, elem){
		if(this.Id("pattern_filter_groupData")){
			this.Id("profile_top_header_1_home").style.height	= this.total_h * (this.profile/100) +"px";
			this.Id("url_content_1_home").style.height		= this.total_h * (this.url/100) +"px";
			this.Id("website_tree").style.height			= this.tree_h +"px"; 
			disp_block(this.Id('crop_tool_header'));
			disp_block(this.Id('profile_div'));
		}
		try{document.getElementsByClassName("taxo-active")[0].className = '';}catch(e){}
		elem.className	= "taxo-active";
		try{document.getElementsByClassName("taxo-active-row")[0].className = '';}catch(e){}
		elem.parentNode.parentNode.className	= "taxo-active-row";
		this.Id("my_tree").innerHTML	= '';
		this.Id("profile_div").innerHTML	= '';
		this.createDOM("img", {src:TASApp.config.IP+TASApp.config.JS_DIR+"/images/small-loader.gif",style:"display:block;margin:0px auto;"}, this.Id("my_tree"));	
		TASApp.gbl.extraction_main_taxo_id	= taxo_level.split("^")[1];
		TASApp.gbl.extraction_level_id		= taxo_level.split("^")[0];
		filterOP.filterSatgeId 			= TASApp.gbl.extraction_level_id;
		TASApp.gbl.filter_stage_id		= 1;
		var json = {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id, "taxo_level_id":TASApp.gbl.filter_stage_id, "taxo_id":TASApp.gbl.extraction_main_taxo_id, "level_id":TASApp.gbl.extraction_level_id};
		var vservice_path 	= TASApp.config.IP+TASApp.config.CGI_DIR + 'excell_filter/cgi_get_filter_levelwise_document_id.py?input_str=';
		var cgi			= vservice_path+JSON.stringify(json);
		Log("CGI Taxonomy classification doc mapping === > "+cgi);
        	this.send_ajax_request(cgi, null, 1,"TASApp.gbl.search_tab.draw_taxo_pagination(json)", "GET", true);
	}
	this.draw_taxo_pagination	= function(json){
		TASApp.gbl.taxo_status		= json[1];
		var json_data		= json[0];
		var color_dict	= {N:'green', Y:'red', undefined:'#6B9EBD'};
		var img_path	= TASApp.config.IP+TASApp.config.JS_DIR+'images/';
		var status_dict	= {N:img_path+'stat_green', Y:img_path+'stat_red', undefined:img_path+'stat_red'};
		Log(JSON.stringify(json, null,'\t'));
		var parent_div		= this.Id("my_tree");
		parent_div.innerHTML	= '';
		parent_div.style.overflow	= "hidden";
		var profile_div_header	= this.createDOM("div",{style:"width:100%;height:30px;"},parent_div);
		var profile_div_body	= this.createDOM("div",{style:"width:100%;height:"+(this.tree_h - 33)+"px;overflow:auto;"},parent_div);
		var table = this.createDOM("table",{id:"", class:"prof_table taxo-classification"},profile_div_body);
		var table_header = this.createDOM("table",{id:"", class:"prof_table taxo-classification"},profile_div_header);
		this.create_row_and_cols(table, "th", {class:"prof_td_head"},["Page Id","Toatal", "Completed", "Remaining", "Status"]);
		TASApp.gbl.missing_doc_mapp	= false;
		var doc_ids	= [];
		var page_index_status	= {total:0, comp:0};
		for(var index in json_data){
			var value	= json_data[index];
			if(!value['doc_id'])
				TASApp.gbl.missing_doc_mapp	= true;
			else
				doc_ids.push(value['doc_id']);
			page_index_status['total']++;
			if(value['flag'] == 'N')
				page_index_status['comp']++;
			var status_img	=  '<img src="'+status_dict[value['flag']]+'.png" class="mark-prof"  width="17" height="17" />';
			var row	= this.create_row_and_cols(table, "td", {class:"prof_td"},[index, value['total_pcnt'], value['total_pcnt_complete'],value['total_pcnt_remaining'],status_img]);
			setAttr(row, {custom_data:JSON.stringify(value), onclick:'TASApp.gbl.search_tab.show_paginate_data(this)', pagination_doc_id:value['doc_id']});
		}
		var row	= this.create_row_and_cols(table_header, "th", {class:"prof_td_head"},["Id","Toatal", "Completed", "Remaining", "Status"]);
		setAttr(row,{doc_ids:doc_ids.join(","), id:"pagination_doc_ids"});
		this.set_index_header_width(table, table_header);
		this.Id("tree_header_1_home").innerHTML              = "<div class='filter-status'><table><tr><th>Total : </th><td id='total-cnt'>"+json[1]['total_pcnt']+"</td><th>Completed : </th><td id='comp-cnt'>"+json[1]['total_pcnt_complete']+" - "+page_index_status['comp']+" ( "+page_index_status['total']+" )</td><th>Remaining : </th><td id='rem-cnt'>"+json[1]['total_pcnt_remaining']+"</td></tr></table></div>";
		//if(TASApp.gbl.active_filter_mode == 'N'){
			TASApp.gbl.search_tab.load_train_data();
		//	return;
		//}
		//try{this.Id("my_tree").firstChild.click();}catch(e){}
	}
	this.show_paginate_data	= function(elem){
		var color_dict	= {N:'green', Y:'red', undefined:'#6B9EBD'};
		try{var old_elem = document.getElementsByClassName("pagination-active-row")[0];old_elem.className = '';}catch(e){}
		elem.className	= "pagination-active-row";
		var json	= JSON.parse(elem.getAttribute("custom_data"));
		TASApp.gbl.search_tab.doc_id	= json['doc_id'];
		TASApp.gbl.active_filter_mode	= 'Y';
		Log("Document_id	== "+TASApp.gbl.search_tab.doc_id);
		TASApp.gbl.search_tab.get_taxo_profiles_data('N');
	}
	this.show_prof_details	= function(row, event, span_flag){
		row.parentNode.parentNode.scrollTop	= row.offsetTop;
		var elems	= document.getElementsByClassName("tr-active");
		for(var ind = 0, len =elems.length; ind < len; ind++){
			elems[0].classList.remove("tr-active");
		}
		row.classList.add("tr-active");	
		var json_data	= JSON.parse(row.getAttribute("custom_data"));
		var flag	= (TASApp.gbl.active_filter_doc_id != json_data.doc_id)?true:false;
		TASApp.gbl.active_filter_doc_id	= json_data.doc_id;
		Log(json_data.doc_id+" ==== "+json_data.mark_prof_id+" === "+row.className);
		var pagination_row	= document.querySelector('[pagination_doc_id="'+json_data.doc_id+'"]');
		try{
			pagination_row.scrollIntoView();
			try{var old_elem = document.getElementsByClassName("pagination-active-row")[0];old_elem.className = '';}catch(e){}
			pagination_row.className	= "pagination-active-row";
		}catch(e){}
		//if( true == flag )
		loadNewProfile(json_data.doc_id, json_data.mark_prof_id,'plugin');
	}
	this.load_train_data	= function(flag){
                if(true == flag && TASApp.gbl.taxo_status['total_pcnt_remaining'] == 0){
			alert("No data to process");
			return;
		}else if(TASApp.gbl.taxo_status['total_pcnt_remaining'] == 0)
			return;
		TASApp.gbl.active_filter_mode	= 'N';
    		Panel.hide_panel_window();
		show_content_prog_bar();
		var doc_ids	= this.Id("pagination_doc_ids").getAttribute("doc_ids").split(",")
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + 'excell_filter/cgi_get_untrain_filter_info.py?input_str=';
		var jsonObj 		= { doc_ids:doc_ids,project_id:TASApp.gbl.project_id, taxo_id:TASApp.gbl.extraction_main_taxo_id};
		var cgi_path 		= vservice_path + JSON.stringify(jsonObj);
		this.Logger.push("Load train data === "+cgi_path+JSON.stringify(jsonObj));
                //alert(cgi_path);
		this.send_ajax_request_args(cgi_path, null,[false, true], this.draw_profile_table,"GET", true, this);
	}
	this.get_profiles_data	= function(flag){
		try{this.Id("delete_filter_profile").setAttribute("onclick", "MyApp.EDIT.create_delete_cells()");}catch(e){}
		if(!(/^\d+$/.test(this.doc_id))) {
			alert("Invalid doc_id");
			return;
		}
		//var auto_flag	= (TASApp.gbl.trees['mark_flag_'+this.doc_id] != 'Y')?'Y':'N';
		var auto_flag	= (Object.keys(crop_json_data).length)?'Y':'N';
		TASApp.gbl.trees['mark_flag_'+this.doc_id]	= 'Y';
		this.redraw_crop_tools();
		show_content_prog_bar();
		var vservice_path 	= TASApp.config.CGI_IP+TASApp.config.CGI_DIR + 'create_sh_file/cgi_get_table_html.py?input_str=';
		var jsonObj 		= { 'doc_id':this.doc_id, 'user_id':TASApp.gbl.user_id, 'group_id':TASApp.gbl.group_id, 'agent_id':TASApp.gbl.agent_id, 'mgmt_id':TASApp.gbl.mgmt_id, "auto_flag": auto_flag, 'crop_data':(flag == true)?{}:crop_json_data, stage_id:TASApp.gbl.active_stage_id, project_id:TASApp.gbl.project_id, 'level_id': TASApp.gbl.extraction_level_id, 'taxo_id': TASApp.gbl.extraction_main_taxo_id, 'taxo_level_id': TASApp.gbl.filter_stage_id};
		var cgi_path 		= vservice_path;// + JSON.stringify(jsonObj);
		this.Logger.push("restore_prof_table === "+cgi_path+JSON.stringify(jsonObj));
                //alert(cgi_path);
		this.send_ajax_request_args(cgi_path, 'input_str='+JSON.stringify(jsonObj),[flag, 'GET'], this.draw_profile_table,"POST", true, this);
	}
	this.clean_table	= function(){
		disp_none(this.Id("profile_header_1_home"));
		show_content_prog_bar(true);
		Clear_data_prof();
		var profile_div		= this.Id('profile_div')
		profile_div.style.height="100%";
		profile_div.innerHTML	= '';	
		var profile_div_header	= this.createDOM("div",{style:"width:100%;height:30px;"},profile_div);
		var profile_div_body	= this.createDOM("div",{style:"width:100%;height:"+(this.profile_h - 33)+"px;overflow:auto;"},profile_div);
		var table = this.createDOM("table",{id:"table_prof", class:"prof_table filter-level"},profile_div_body);
		var table_header = this.createDOM("table",{id:"table_prof", class:"prof_table filter-level"},profile_div_header);
		document.body.setAttribute("onkeyup", "higlight_row_by_key(event)");
		//this.create_row_and_cols(table, "th", {class:"prof_td_head"},["No.","Key", "Value","Status", "Edit"]);
		this.create_row_and_cols(table, "th", {class:"prof_td_head"},["No.","Key<span style='visibility:hidden'>TaxonomyNAME</span>", "Value","Status"]);
		return [table, table_header];
	}
	this.draw_profile_table	= function(text,json, args, $_this){
		if(true != args[0])
			crop_json_data	= {};
		if(TASApp.gbl.active_filter_mode == 'N' && args[1] == 'GET'){
			var elem	= document.getElementsByClassName("taxo-active")[0];
			TASApp.gbl.search_tab.load_level_content(elem.id.split('-').pop(), elem);
			return;
		}
			
		Log("JSON Length === "+json.length);
		var canvas_data		= []; 	
		TASApp.gbl.canvas_data	= [];
		TASApp.gbl.canvas_counter	= 1;
		var tables	= $_this.clean_table();
		var table	= tables[0];
		var table_header= tables[1];
		var img_path	= TASApp.config.IP+TASApp.config.JS_DIR+'images/';
		var edit	= {N:img_path+'edit',Y:img_path+'tick', undefined:img_path+'tick'};
		var render_image = '<img src="'+img_path+'edit_icon.png" class="render-prof"  width="17" height="17" />';
		var counter	= 1;
		json.forEach(function(value, index){
			var parent_child_dict	= {};
			counter	= $_this.draw_row_content(value,$_this, index,edit,render_image, table,img_path,parent_child_dict, canvas_data, counter);
			//TASApp.gbl.canvas_counter++;
		});
		this.create_row_and_cols(table_header, "th", {class:"prof_td_head"},["No.","Key<span style='visibility:hidden'>TaxonomyNAME</span>", "Value","Status"]);
		$_this.set_index_header_width(table, table_header);
		TASApp.gbl.canvas_data	= canvas_data;
                TASApp.gbl.doc_id = $_this.doc_id;
		var json_data	= JSON.parse(table.rows[1].getAttribute("custom_data"));
		TASApp.gbl.active_filter_doc_id	= json_data.doc_id;
		Log("Panel doc_id === "+TASApp.gbl.active_filter_doc_id);
		$_this.load_panel_html([[{doc_id:json_data.doc_id}]]);
		return table;
	}
	this.insert_into_canvas_data	= function(value, canvas_data, profile_id){
		var json	= {doc_id:value.doc_id, cords:(value.cords.length > 1)?value.cords.split(":^^:"):value.cords,taxo_id_lst:value.taxo_ids,  prof_id:value.prof_id,org_prof_id:value.org_prof_id, agent_id:value.agent_id, mgmt_id:value.mgmt_id,group_id:value.group_id,pw:value.pw,ph:value.ph,d_cord:"", idx:value.idx, parent_idx:value.parent_idx, idx_key:value.idx_key, level_id:value.level_id, mode:TASApp.gbl.active_filter_mode};
		canvas_data.push(json)
	}
	this.get_taxo_name_from_ids	= function(ids){
		Log("ids :::: "+ids)
		var taxo_ids	= ids.split(":^:");
		var len		= taxo_ids.length;
		if(len == 1)
			return TASApp.gbl.taxo_mapping[ids];
		else{
			var taxo_name	= '';
			taxo_ids.forEach(function(value){
				taxo_name	+= TASApp.gbl.taxo_mapping[value]+"<br>";
			});
			taxo_name	= taxo_name.slice(0,-4);
			return taxo_name;	
		}
		
	}
	this.draw_row_content	= function(value,$_this, index,edit,render_image, table,img_path, parent_child_dict, canvas_data, counter){
		var len		= value.length;
		var nav_flag	= false;
		if( len > 0){
			var main_doc_id	= value[0].doc_id;
			var td_txt 	= value[0].txts;
			td_txt		= (td_txt.length)?td_txt:[""];
			var taxo_ids	= value[0].taxo_ids.toString();
			this.insert_into_canvas_data( value[0], canvas_data, TASApp.gbl.canvas_counter);
			value[0].current_index	= 0;
                        counter = value[0].prof_id;
			//value[0].get_click_json = $_this.chk_click_record(value[0], parent_child_dict);
			value[0].org_prof_id	= value[0].org_prof_id || counter;
			value[0].mark_prof_id	= TASApp.gbl.canvas_counter++;
			parent_child_dict[value[0].doc_id] = value[0].url;
			var status_dict	= {YELLOW:img_path+'stat_yellow', ORANGE:img_path+'stat_orange',LIGHT_PURPLE:img_path+'stat_purple',DEEP_PURPLE:img_path+'stat_purple',GREEN:img_path+'stat_green', RED:img_path+'stat_red', undefined:img_path+'stat_red'};
			var mark_img	=  '<img src="'+status_dict[value[0].color[0]]+'.png" class="mark-prof"  width="17" height="17" />';
		
	 		var row	= this.create_row_and_cols(table, "td", {class:"prof_td"},[value[0].org_prof_id, this.get_taxo_name_from_ids(taxo_ids),td_txt[0] ,mark_img]);
			setAttr(row, {id:value[0].prof_id+'_1_'+index,class:'normal-row extd_profiles', onclick:"TASApp.gbl.search_tab.show_prof_details(this,event)", custom_data:JSON.stringify(value[0]),doc_prof:value[0].doc_id+"_"+counter});
			//counter++;
			if(len > 1){
				row.firstChild.setAttribute("rowspan", len);
				for(var ind = 1; ind < len; ind++){
					var td_txt 		= value[ind].txts;
					var taxo_ids		= value[ind].taxo_ids.toString();
                        		counter 		= value[ind].prof_id;
					this.insert_into_canvas_data( value[ind], canvas_data, TASApp.gbl.canvas_counter);
					//value[ind].org_prof_id	= value[ind].prof_id;
					//value[ind].prof_id	= counter;
					value[ind].mark_prof_id	= TASApp.gbl.canvas_counter++;
					value[ind].current_index= 0;
					td_txt		= (td_txt.length)?td_txt:[""];
					//value[ind].get_click_json = $_this.chk_click_record(value[ind], parent_child_dict);
					var mark_img	=  '<img src="'+status_dict[value[ind].color[0]]+'.png" class="mark-prof"  width="17" height="17" />';
					value[ind].parent_id	= value[ind].parent_doc_id;
	 				var row1	= this.create_row_and_cols(table, "td", {class:"prof_td"},[this.get_taxo_name_from_ids(taxo_ids),td_txt[0], mark_img]);
					setAttr(row1, {doc_prof:value[ind].doc_id+"_"+counter, id:value[ind].prof_id+"_"+index+"_"+ind,  class:"span_row prof_"+(index + 1)+" extd_profiles", onclick:"TASApp.gbl.search_tab.show_prof_details(this,event, 'span')", custom_data:JSON.stringify(value[ind])});
					parent_child_dict[value[ind].doc_id] = value[ind].url;
					//counter++;
				}
			}
		}
		return counter;
	}

}).apply(Filter.prototype)
/**************************************************************************************/
var filterOP = {}
filterOP.taxoLevelMapping 	= null;
filterOP.filterSatgeId		= null;
filterOP.currentTaxoId		= null;
/*******************************************************************************************/
filterOP.getAllLevelData = function(){
	this.Id("parent_filter_outer").style.display = "block";
	this.Id("class_of_taxo_node_list_body").innerHTML = "";
	this.Id("filter_stage_body").innerHTML = "";
	//this.Id("filter_type_body").innerHTML = "";
	var load_image = createDom("img", this.Id("class_of_taxo_node_list_body"), {src:"http://172.16.20.163/TR_Legal_2013_12_23_web/source/plugin_lmdb/js/images/small-loader.gif",style:"margin-left:40%"})	
	var load_image = createDom("img", this.Id("filter_stage_body"), {src:"http://172.16.20.163/TR_Legal_2013_12_23_web/source/plugin_lmdb/js/images/small-loader.gif", style:"margin-left:40%"})	
	//var load_image = createDom("img", this.Id("filter_type_body"), {src:"http://172.16.20.163/TR_Legal_2013_12_23_web/source/plugin_lmdb/js/images/small-loader.gif", style:"margin-left:40%"})	
	inp_JSON = {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id};	
        var vservice_path = 'http://172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/excell_filter/cgi_get_taxonomy_and_level.py?input_str=';
	var vtt = inp_JSON; 
        var strURL = vservice_path+JSON.stringify(vtt);
	Log("All Taxo Level :::: "+strURL)
	var returnJson = {}
        var xmlHttpReq = false;
        var self = this;
        if(window.XMLHttpRequest){self.xmlHttpReq = new XMLHttpRequest();}else if (window.ActiveXObject){self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");}
        self.xmlHttpReq.onreadystatechange = function () {
            	if(self.xmlHttpReq.readyState == 4){
			if(self.xmlHttpReq.status == 200){
                    		vret = self.xmlHttpReq.responseText;
				vret = JSON.parse(vret);
				filterOP.drawClassificationTaxonomy(vret);
				//filterOP.drawFilterTabs();
				filterOP.drawFilterStage();
				//filterOP.drawFilterType();
				filterOP.getAllLevelTaxoMapping();
				filterOP.extractionButtons();
                	}else{alert("There was a problem in getReferenceTableVal():\n" + self.xmlHttpReq.statusText);}
           	}
        }
        self.xmlHttpReq.open('GET', strURL, false);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var params = null;
        self.xmlHttpReq.send(params);
}
/*******************************************************************************************/
filterOP.drawFilterTabs = function(){
	var tabs = ["Master Data","Filter","Extraced Data","Problematic Data"]	
	this.Id("filter_tab_div").innerHTML = "";
	for(var i=0; i<tabs.length; i++)
	{
		var div = createDom("div", this.Id("filter_tab_div"),{style:"float:left; text-align:center;cursor:pointer;width:"+parseInt(100/tabs.length)+"%;"});
		div.textContent = tabs[i];
	}
}
/*******************************************************************************************/
filterOP.drawClassificationTaxonomy = function(dataJson){
	//this.Id("parent_filter_outer").style.display = "block";
	taxoNameIDJson = TASApp.gbl.taxo_mapping;
	this.Id("class_of_taxo_node_list_body").innerHTML = "";

        var table = createDom("table", this.Id("class_of_taxo_node_list_body"),{style: "float:left; width:100%;height:100%;", id:"taxonomy_classification_table"}); 

        var rowH = createDom("tr", table,{style:"border:1px #454545 solid; color:#454545; font-weight:bold;ckground:#dedede;"});
        var th1 = createDom("th", rowH,{style:"border:1px #454545 solid;"});
	th1.textContent = "No."
        var th2 = createDom("th", rowH,{style:"border:1px #454545 solid;"});
	th2.textContent = "Attributes"
        var th3 = createDom("th", rowH,{style:"border:1px #454545 solid;"});
	th3.textContent = "Level"
        var rowCount = 1;
	for(var taxo_id in dataJson){
                if(Object.keys(dataJson[taxo_id]).length == 0)
			continue;
		var row = createDom("tr", table,{style:"border:1px #454545 solid; color:#454545;"});
 		var td1 = createDom("td", row,{style:"cursor:pointer; border:1px solid; width:25px;"});
		td1.textContent = rowCount;
 		var td2 = createDom("td", row,{style:"cursor:pointer; border:1px solid; width:65%;"});
                td2.textContent = taxoNameIDJson[taxo_id]; 
 		var td2 = createDom("td", row,{style:"border:1px solid;"});
		for(var jsonInd in dataJson[taxo_id]){
 			var div = createDom("div", td2,{style:"float:left; cursor:pointer; margin:2px; color:#6E9CBE; text-decoration:underline;", "taxo_id":taxo_id, "level_id":jsonInd, 'doc_id': dataJson[taxo_id][jsonInd], filter_stage_id:1 });
                        div.textContent = jsonInd; 
			div.onclick = function(){
 				filterOP.current_taxo_div = this;
				TASApp.gbl.filter_taxo_id = this.getAttribute("taxo_id");
				var temp_level = this.getAttribute("level_id");
				var temp_doc_id = this.getAttribute("doc_id");
				TASApp.gbl.extraction_level_id = this.getAttribute("level_id");
				TASApp.gbl.extraction_main_taxo_id = this.getAttribute("taxo_id");
				var temp_Taxo = this.getAttribute("taxo_id");
				filterOP.currentTaxoId		= temp_Taxo;
				var temp_doc_id = filterOP.get_rendered_doc_id();
				filterOP.drawPaginationLinks(this,temp_doc_id);	
                                /*if (!temp_doc_id && this.getAttribute("filter_stage_id")!= TASApp.gbl.filter_stage_id){
					this.setAttribute("filter_stage_id", TASApp.gbl.filter_stage_id);
					//this.setAttribute("doc_id", null);
				   	load_taxo_html(temp_Taxo, temp_level);
                                }else{
		                    TASApp.gbl.search_tab.doc_id = temp_doc_id;	
				    //TASApp.gbl.trees['mark_flag_'+TASApp.gbl.search_tab.doc_id]	= 'Y';
		                    TASApp.gbl.search_tab.get_profiles_data();	
                                }*/
    				Panel.hide_panel_window();
			}
		}
    		rowCount++;
	}
	if(table.querySelector('td'))
		table.querySelector('td').click();
}
/*******************************************************************************************/
filterOP.drawPaginationLinks = function(cur_parent, doc_id_page_no){
	var paginationDiv	= this.Id("pagination_body");
	paginationDiv.innerHTML = "";	

	pageLinkStyle 		= "float:left; color:blue; width:15px; height:15px; margin:3px; cursor:pointer;";

	for(var key in doc_id_page_no){
		var linkDiv = createDom("div", paginationDiv,{style:pageLinkStyle, doc_id:doc_id_page_no[key]});
		linkDiv.textContent = key;
		linkDiv.onclick = function(){
 			var page_no 	= this.textContent; 
                        var doc_id  	= this.getAttribute("doc_id"); 
			var temp_Taxo 	= cur_parent.getAttribute("taxo_id");
			var temp_level 	= cur_parent.getAttribute("level_id");
	        	//if (!temp_doc_id && cur_parent.getAttribute("filter_stage_id")!= TASApp.gbl.filter_stage_id){
	        	if (doc_id  == ""){
				cur_parent.setAttribute("filter_stage_id", TASApp.gbl.filter_stage_id);
				//this.setAttribute("doc_id", null);
			   	load_taxo_html(temp_Taxo, temp_level, doc_id_page_no);
                	}else{
			        TASApp.gbl.search_tab.doc_id = doc_id;	
			       	//TASApp.gbl.trees['mark_flag_'+TASApp.gbl.search_tab.doc_id]	= 'Y';
			        TASApp.gbl.search_tab.get_profiles_data();	
        	        }
		}
	}
}
/*******************************************************************************************/
filterOP.get_rendered_doc_id = function(selected_taxo_id){
	var vtemp_doc_id = '';
	inp_JSON = {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id, "taxo_level_id":TASApp.gbl.filter_stage_id, "taxo_id":TASApp.gbl.extraction_main_taxo_id, "level_id":TASApp.gbl.extraction_level_id};
        var vservice_path = 'http://172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/excell_filter/cgi_get_filter_levelwise_document_id.py?input_str=';
	var vtt = inp_JSON; 
        var strURL = vservice_path+JSON.stringify(vtt);
	Log("get_rendered_doc_id :::: "+strURL)
	//alert(strURL)
	var temp_doc_id = null;
        var xmlHttpReq = false;
        var self = this;
        if(window.XMLHttpRequest){self.xmlHttpReq = new XMLHttpRequest();}else if (window.ActiveXObject){self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");}
        self.xmlHttpReq.onreadystatechange = function () {
            	if(self.xmlHttpReq.readyState == 4){
			if(self.xmlHttpReq.status == 200){
                    		vret = self.xmlHttpReq.responseText;
				if(vret)
				{
					temp_doc_id = JSON.parse(vret);
				}
                	}else{alert("There was a problem in getReferenceTableVal():\n" + self.xmlHttpReq.statusText);}
           	}
        }
        self.xmlHttpReq.open('GET', strURL, false);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var params = null;
        self.xmlHttpReq.send(params);
	return temp_doc_id;
}
/*******************************************************************************************/
filterOP.drawFilterStage = function(){
        var img_path	= TASApp.config.IP+TASApp.config.JS_DIR+'images/';
	var LevelDocId = {1:null,2:null,3:null, 4:null};
	this.Id("filter_stage_body").innerHTML = "";
        var outDiv = createDom("div", this.Id("filter_stage_body"),{style: "float:left; margin:5px; width:100%;", id:"stage_container"});
	//styleS = "float:left; margin: 3px 5px 5px 5px; cursor:pointer; width:20px; height:20px; text-align:center;";
	styleS = "float:left; cursor:pointer; width:20px; height:20px; text-align:center;";
	styleX = "float:left; margin: 3px 5px 5px 5px; border: 1px solid #dedede; cursor:pointer; width:20px; height:20px; text-align:center;";
	for(var key in LevelDocId){
 		var innDiv = createDom("div", outDiv,{style:styleX, level_id:key, toggle:1});
		innDiv.onclick = function(){
			filterOP.filterSatgeId = this.getAttribute("level_id");
			TASApp.gbl.filter_stage_id	= filterOP.filterSatgeId;
			filterOP.toggleStage(this);
			var wnd         = get_content_window();
			content         = wnd;
		        var doc         = wnd.document;	
   			create_taxo_tree_filter_extd(doc, filterOP.currentTaxoId);
			filterOP.current_taxo_div.click();
                        //var current_Taxo_level_div = this.Id("taxonomy_classification_table").querySelector('div[filter_taxo_id = "'+TASApp.gbl.filter_taxo_id+'"]')
			//if(current_Taxo_level_div)
				//current_Taxo_level_div.setAttribute("filter_taxo_id") = TASApp.gbl.filter_stage_id; 
		}
 			//var innDivinn = createDom("div", innDiv,{style:styleS, level_id:key});
	        innDiv.textContent = key;
 	        var innDivinn = createDom("div", outDiv,{style:styleS, taxo_level_id:key});
                var imageDiv = createDom("img", innDivinn, {style: "float:left; margin-left:-3px; width:20px; height:20px;", src: img_path+"tick_blank.png", id: "level_stage_img_" + key});
	}
	if(this.Id("stage_container").querySelector('div'))
		this.Id("stage_container").querySelector('div').click();
}
/*******************************************************************************************/
filterOP.drawFilterType = function(){
	var filter_type_list = {1: "Single Composite Horizontal Filter",
             			2: "Single Composite Horizontal Classification Unit",
				3: "Multiple Composite Horizontal Classification Unit"
				}
	this.Id("filter_type_body").innerHTML = "";
	var table = createDom("table", this.Id("filter_type_body"),{style: "float:left; width:100%;height:91%;"}); 
	for(var key in filter_type_list){
		var row = createDom("tr", table,{style:"border:1px #454545 solid; color:#454545;"});

 		var td1 = createDom("td", row,{style:"width:90%;"});
                td1.textContent = filter_type_list[key]; 

 		var td2 = createDom("td", row,{style:""});
		var radio = createDom("input", td2,{type:"radio",id: key, name:"filter_types", style:"border:1px solid;"});
	}
	this.Id("filter_type_body").querySelector('input[type=radio]').checked = true;
}
/*******************************************************************************************/
filterOP.getAllLevelTaxoMapping = function(){
	inp_JSON = {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id};	
        var vservice_path = 'http://172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/validate_taxonomy/cgi_validate_taxonomy_mapping.py?input_str=';
	var vtt = inp_JSON; 
        var strURL = vservice_path+JSON.stringify(vtt);
	Log("Extraction Level :::: "+ strURL)
	var returnJson = {}
        var xmlHttpReq = false;
        var self = this;
        if(window.XMLHttpRequest){self.xmlHttpReq = new XMLHttpRequest();}else if (window.ActiveXObject){self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");}
        self.xmlHttpReq.onreadystatechange = function () {
            	if(self.xmlHttpReq.readyState == 4){
			if(self.xmlHttpReq.status == 200){
                    		var vret = self.xmlHttpReq.responseText;
				filterOP.taxoLevelMapping = JSON.parse(vret);
                	}else{alert("There was a problem in getReferenceTableVal():\n" + self.xmlHttpReq.statusText);}
           	}
        }
        self.xmlHttpReq.open('GET', strURL, false);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var params = null;
        self.xmlHttpReq.send(params);
}
/*******************************************************************************************/
filterOP.toggleStage = function(cur_satge_div){
	Log("toggleStage Div :::: "+cur_satge_div.textContent);
	//var stage_divs = this.Id("filter_stage_body").querySelectorAll('div')	
	var stage_divs = this.Id("stage_container").querySelectorAll('div[toggle = "1"]')	
	for(var div = 0; div<stage_divs.length; div++){
		stage_divs[div].style.background = "#ffffff";	
	}
	cur_satge_div.style.background = "#6E9CBE"
}
function createDom(tagname,parentNode,attribute){
   return this.createDOM(tagname,attribute,parentNode);
}
/*******************************************************************************************/
filterOP.extractionButtons = function(){
	var button_div 		= this.Id("extraction_table_header");
	button_div.innerHTML 	= ""
	var btn_delete_div 		= createDom("div", button_div, {style:"float:left; color:#454545; cursor:pointer; font-weight:bold; margin:3px;", id:"delete_filter_profile", onclick:"MyApp.EDIT.create_delete_cells()"});
	btn_delete_div.textContent 	= "Delete"
	var btn_add_div 		= createDom("div", button_div, {style:"float:left; color:#454545; cursor:pointer; font-weight:bold; margin:3px;", id:"add_filter_profile", onclick:"Getdwg_select_rect()"});
	btn_add_div.textContent 	= "Add";
	var btn_div 		= createDom("div", button_div, {style:"float:right; color:#454545; cursor:pointer; font-weight:bold; margin:3px;", id:"filter-get-taxos"});
	btn_div.textContent 	= "Get Taxos"
	btn_div.onclick 	= function(){
		TASApp.gbl.search_tab.get_profiles_data();	
		this.Id("extraction_table_body").innerHTML = "";
		var load_image = createDom("img", this.Id("extraction_table_body"), {src:"http://172.16.20.163/TR_Legal_2013_12_23_web/source/plugin_lmdb/js/images/small-loader.gif", style:"margin-left:40%"})	
	}
	var btn_save_div 		= createDom("div", button_div, {style:"float:right; color:#454545; cursor:pointer; font-weight:bold; margin:3px;"});
	btn_save_div.textContent 	= "Save | "
        btn_save_div.onclick 	= function(){
	      var r=confirm("Do you want Save");
	      if (r==true){
                  filterOP.save_filter_profile();
 	      }else{
		  return;
              }
	}
	var btn_clear_div 		= createDom("div", button_div, {style:"float:right; color:#454545; cursor:pointer; font-weight:bold; margin:3px;"});
	btn_clear_div.textContent 	= "Clear | "
        btn_clear_div.onclick 	= function(){
              var r=confirm("Do you want Clear");
	      if (r==true){
                  alert('i am in Clear');
 	      }else{
		  return;
              }
	}
}
/*******************************************************************************************/
filterOP.save_filter_profile = function(){
	var img	= document.querySelector("#level_stage_img_" + TASApp.gbl.filter_stage_id);
	var img_path	= TASApp.config.IP+TASApp.config.JS_DIR+'images/';
	img.src	= img_path+"tick.png";
        var vservice_path = TASApp.config.CGI_IP+TASApp.config.CGI_DIR +'excell_filter/cgi_save_filter_level_data.py?input_str=';
	var vtt = {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id, 'doc_id':TASApp.gbl.doc_id, 'taxo_id': TASApp.gbl.extraction_main_taxo_id, 'taxo_level_id': TASApp.gbl.filter_stage_id, "level_id":TASApp.gbl.extraction_level_id};
        var strURL = vservice_path+JSON.stringify(vtt);
        //alert("GGGG "+strURL);
        //show_processing();
	Log("save :::: "+strURL)
        var returnJson = {}
        var xmlHttpReq = false;
        var self = this;
        if(window.XMLHttpRequest){self.xmlHttpReq = new XMLHttpRequest();}else if (window.ActiveXObject){self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");}
        self.xmlHttpReq.onreadystatechange = function () {
                if(self.xmlHttpReq.readyState == 4){
                        if(self.xmlHttpReq.status == 200){
                                vret = self.xmlHttpReq.responseText;
				if (vret.trim() == 'DONE')
					filterOP.change_level();
				else
					alert('Some Problem in saving: ' + vret);
                        }else{alert("There was a problem in getReferenceTableVal():\n" + self.xmlHttpReq.statusText);}
                        //hide_processing();
                }
        }
        self.xmlHttpReq.open('GET', strURL, false);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var params = null;
        self.xmlHttpReq.send(params);
}
/*******************************************************************************************/
filterOP.change_level = function(){
	var stageId = parseInt(TASApp.gbl.filter_stage_id)+parseInt(1);
	var stageDiv	= this.Id("stage_container").querySelector('[level_id="'+stageId+'"]');
	stageDiv.click();
	
}
/*******************************************************************************************/
filterOP.getlevel_doc_id = function(Json){
        vserver_path = getQuerystring('doc_server_path');
        var vservice_path = vserver_path+'cgi-bin/TR_Legal_2013_12_23_web/slt_Code/excell_filter/cgi_get_level_doc_ids.py?input_str=';
        var vtt = Json
        var strURL = vservice_path+JSON.stringify(vtt);
        show_processing();
	Log("Level Docs :::: "+strURL)
        var returnJson = {}
        var xmlHttpReq = false;
        var self = this;
        if(window.XMLHttpRequest){self.xmlHttpReq = new XMLHttpRequest();}else if (window.ActiveXObject){self.xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");}
        self.xmlHttpReq.onreadystatechange = function () {
                if(self.xmlHttpReq.readyState == 4){
                        if(self.xmlHttpReq.status == 200){
                                vret = self.xmlHttpReq.responseText;
				returnJson =  JSON.parse(vret);
                        }else{alert("There was a problem in getReferenceTableVal():\n" + self.xmlHttpReq.statusText);}
                        hide_processing();
                }
        }
        self.xmlHttpReq.open('GET', strURL, false);
        self.xmlHttpReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        var params = null;
        self.xmlHttpReq.send(params);
        return returnJson
}

/*******************************************************************************************/
function restore_taxo_id_filter(dom, e) {
        var taxo_id     = dom.getAttribute("taxo_id");
        var doc         = dom.ownerDocument;
        gbl_prof_id     = '';
	TASApp.gbl.custom_taxo_id 	= Number(dom.getAttribute("custom_taxo_id"));
	TASApp.gbl.sibling_sign 	= (dom.lastChild.checked == true)?'Y':'N';
	this.Logger.push("INput ==== "+e.target.tagName.toLowerCase());
	if(e.target.tagName.toLowerCase() == 'input'){
		var elems	= doc.querySelectorAll("input.taxo_child_chk:checked");
		for(var ind = 0, leng = elems.length;ind < leng;ind++)
			if(!(e.target === elems[ind]))
				elems[ind].checked	= false;
	}
        gbl_prof_id = '1_'+Number(taxo_id);
        this.Id('profile_disp_div', doc).parentNode.style.width= '300px';
        this.Id('profile_disp_div', doc).style.width	= '150px';
        this.Id('profile_disp_div', doc).innerHTML = dom.textContent;
        Log("gbl_prof_id === "+gbl_prof_id+" === "+TASApp.gbl.custom_taxo_id);
	return;
        var target      = e.target;
        this.Id('profile_disp_div', doc).innerHTML = "";
                var elem        = doc.querySelectorAll("input.taxo_child_chk:checked");
                for(var ind = 0, len = elem.length; ind < len;ind++){
			if(this.Id('profile_disp_div', doc).innerHTML == "")
        			this.Id('profile_disp_div', doc).textContent = Number(elem[ind].getAttribute("taxo_id"));
			else
        			this.Id('profile_disp_div', doc).textContent += ":^:"+Number(elem[ind].getAttribute("taxo_id"));
			//elem[ind].parentNode.style.background = "#6B9EBD"
		}
                var elem        = doc.querySelectorAll("input.deep-link-filter:checked");
		if(elem.length>1){
                	for(var ind = 0, len = elem.length; ind < len;ind++){
				elem[ind].checked = false;	
			}
			target.checked = true;
		}
		taxo_id = this.Id('profile_disp_div', doc).textContent; 
        gbl_prof_id = '1_'+taxo_id;
        Log("gbl_prof_id === "+gbl_prof_id);
        //this.Id('profile_disp_div', doc).innerHTML = dom.textContent;
}
function load_adv_filter(){
        	var vservice_path = TASApp.config.CGI_IP+TASApp.config.CGI_DIR +'pattern_generation_v13/cgi_get_count_rows.py?input_str=';
		var vtt = {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id, stage_id:TASApp.gbl.active_stage_id, filter_flag:TASApp.gbl.filter_flag+''};
		var cgi			= vservice_path+JSON.stringify(vtt);
		Log("CGI load_advanced_filter classification === > "+cgi+" == "+store_advanced_filter_taxo);
        	this.send_ajax_request(cgi, null, 1,"TASApp.gbl.search_tab.store_advanced_filter_taxo(json)", "GET", true);
}
store_advanced_filter_taxo	= function(json){
		Log("Calling Normal "+arguments.callee.caller);
		TASApp.gbl.adv_filter_taxos	= json;
		TASApp.gbl.active_taxo_count	= {};
		json.forEach(function(value){
			if(TASApp.gbl.extraction_main_taxo_id == value.taxo_id)
				TASApp.gbl.active_taxo_count	= value;
		});
		Log(JSON.stringify(TASApp.gbl.active_taxo_count))
		disp_none(this.Id('crop_tool_header'));
		disp_none(this.Id('profile_div'));
		this.Id("website_tree").style.height		= ((this.total_h *0.7)+30) +"px"; 
		var parent_div	= this.Id("my_tree");
		parent_div.innerHTML	= '';
		var main_div		= this.createDOM("div", {id:"pattern_filter_groupData", style:"float:left;width:100%; height:100%; display:none;overflow:auto; background:#fff;"}, parent_div);
		var applicator_res 	= this.createDOM("div",{ id:"pattern_filter_applicator_results", style:"float:left;width:100%; height:50%; overflow:auto"}, main_div);
		//var applicator_res_header = this.createDOM("div",{ id:"pattern_filter_applicator_results_header", style:"float:left; width:100%; height:20px; background:#959595;"}, applicator_res);
		var applicator_res_header1 = this.createDOM("div",{ id:"pattern_filter_applicator_results_header", class:"sb_headerDiv",style:"float:left; width:100%; height:20px; cursor:pointer; font-weight:bold;", onclick:"panelFilter.switchHTMLTabs(event);"}, applicator_res);
		this.createDOM("div", {id:"applicator_results", class:"sb_headerDiv", style:"float:left; width:34%; height:100%;color:#fff; cursor:pointer", txt:"Applicator Resultss"}, applicator_res_header1);
		//this.createDOM("div", {id:"HTML_results", style:"float:left; width:33%; height:100%; text-align:center; color:#fff;cursor:pointer", txt:"HTML"}, applicator_res_header1);
		//this.createDOM("div", {id:"HTML_G_results", style:"float:left; width:33%; height:100%; text-align:center; color:#fff;cursor:pointer", txt:"HTML G"}, applicator_res_header1);
		this.createDOM("div",{id:"pattern_filter_applicator_results_body", style:"float:left; width:100%; height:80%; overflow:auto;"}, applicator_res);
		var user_results	= this.createDOM("div", {id:"pattern_filter_user_results", style:"float:left;width:100%; height:50%; overlow:auto;"}, main_div);
		var user_results_header	= this.createDOM("div", {id:"pattern_filter_user_results_header", style:"float:left; width:100%; height:20px; background:#959595;"}, user_results)
		this.createDOM("div", {style:"cursor:pointer; color:#fff; font-weight:bold", class:"sb_headerDiv", onclick:"panelFilter.getUserSubmittedGroups();", txt:"Final Submitted Groups"}, user_results_header);
		this.createDOM("div",{id:"pattern_filter_user_results_body", style:"float:left; width:100%; height:85%; overflow:auto;"}, user_results);
		Log(" TASApp.gbl.filter_flag "+TASApp.gbl.filter_flag)
		var source_taxo_id	= TASApp.gbl.extraction_main_taxo_id+"_1_1_N";
		var url		= TASApp.config.IP + "TR_Legal_2013_12_23_web/source/plugin_lmdb/filterData/popUpProfile_prmy.html?project_id="+TASApp.gbl.project_id+"&stage_id="+TASApp.gbl.active_stage_id+"&user_id="+TASApp.gbl.user_id+"&mgmt_id="+TASApp.gbl.mgmt_id+"&group_id="+TASApp.gbl.group_id+"&doc_server_path="+TASApp.config.CGI_IP+"&agent_id="+TASApp.gbl.agent_id+"&source_taxo_id="+source_taxo_id+"&taxo_id="+TASApp.gbl.extraction_main_taxo_id+'&filter_flag='+TASApp.gbl.filter_flag;
		Panel.show_panel_window(url);
	}

/*******************************************************************************************/
populate_data   = function(taxo_id){
    var r=confirm("Populate>>>\nAll Unclassified Information will be deleted for this taxo id. \n        Do you want to proceed????? ");
    if (r!=true){
          return;
    }
    var vservice_path = TASApp.config.CGI_IP+TASApp.config.CGI_DIR +'pattern_generation_v13/cgi_populate_first_level_data.py?input_str=';
    var vtt = {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id, stage_id:TASApp.gbl.active_stage_id, taxo_id:taxo_id, source_taxo_id:taxo_id+'_1_1_N', level_id:'All'};
    var cgi			= vservice_path+JSON.stringify(vtt);
    Log("CGI load_advanced_filter classification === > "+cgi+" == ");
    Panel.hide_panel_window()
	try{show_content_prog_bar();}catch(e){this.Logger.push("Error show_content_prog_bar hide "+e)}
    this.send_ajax_request(cgi, null, 1,"show_content_prog_bar(true);", "GET", false);
}
/*********==********************************************************************************/
accept_data   = function(taxo_id){
    var r=confirm("Applicator>>>\nAll Unclassified Information will be deleted for this taxo id. \n        Do you want to proceed????? ");
    if (r!=true){
          return;
    }
    //var vservice_path = TASApp.config.CGI_IP+TASApp.config.CGI_DIR +'pattern_generation_v13/cgi_save_first_level_data.py?input_str=';
    var vservice_path = TASApp.config.CGI_IP+TASApp.config.CGI_DIR +'pattern_generation_v13/cgi_auto_run_applictor.py?input_str=';
    var vtt = {"user_id": TASApp.gbl.user_id, "agent_id":TASApp.gbl.agent_id, "project_id": TASApp.gbl.project_id, "mgmt_id":  TASApp.gbl.mgmt_id, stage_id:TASApp.gbl.active_stage_id, taxo_id:taxo_id, source_taxo_id:taxo_id+'_1_1_N', level_id:'All'};
    var cgi			= vservice_path+JSON.stringify(vtt);
    Panel.hide_panel_window()
    Log("CGI load_advanced_filter classification === > "+cgi+" == ");
	try{show_content_prog_bar();}catch(e){this.Logger.push("Error show_content_prog_bar hide "+e)}
    this.send_ajax_request(cgi, null, 1,"show_content_prog_bar(true);", "GET", false);
}

function show_process_barF() {
    this.Id('progress').style.display = 'block';
}
function hide_process_barF() {
    this.Id('progress').style.display = 'none';
}
/*******************************************************************************************/
/*******************************************************************************************
 *******************************************************************************************/ 

