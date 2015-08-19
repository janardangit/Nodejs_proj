global_cur_tr 	= null;
global_span_ids = [];
selected_taxo_id     = 0;
all_apply_info     = []
global_all_sel_taxonomy_lst = []
global_taxo_is_name_dict = {}
global_taxonomy_details = {}
global_taxo_id_color_dict = {}
global_cur_tab  = null;
global_preview_tr = null;
global_cur_setting_tab = null;
global_apply_taxonomy_lst = []
global_unq_hashkey_lst = []
global_Selected_setting_radio_option_cell = null;
global_setting_selected_taxonomy_headers = []
var global_other_count = 0;
var vcol_taxo_ids = [];
var TASApp  = new Object();
TASApp.SubUnits   = {
    mgmt_id         : "",
    user_id         : "",
    agent_id        : "",
    taxo_id         : "",
    doc_id          : "",
    global_tr_on_mouse_move : "",
//    flagA           : "",
}

/*****************************************************************************************************************************************************/
init_SubUnits = function(){
    TASApp.SubUnits.mgmt_id         = getQuerystring('mgmt_id');
    TASApp.SubUnits.user_id         = getQuerystring('user_id');
    TASApp.SubUnits.agent_id        = getQuerystring('agent_id');
    TASApp.SubUnits.doc_id          = getQuerystring('doc_id');
    TASApp.SubUnits.taxo_id         = getQuerystring('taxo_id');
    TASApp.SubUnits.flagA           = getQuerystring('flagA');
    TASApp.SubUnits.remainder_flag  = getQuerystring('remainder_flag');
    TASApp.SubUnits.remainder_value  = getQuerystring('remainder_value');
    TASApp.SubUnits.CGI_DIR         = "cgi-bin/TR_Legal_2013_12_23_web/slt_Code/";
    TASApp.SubUnits.global_tr_on_mouse_move = "";
    if (TASApp.SubUnits.remainder_value == 'R')
            TASApp.SubUnits.doc_id  = 'R'
	var body_div 		= document.getElementById('main_container');
	body_div.innerHTML 	= '';
/*
    if(TASApp.SubUnits.flagA != 2){
    	var content_div 	= createDom_filter2('div', body_div, {style:'float:left;width:100%;height:50%;overflow:auto;'}); 
	    var bar_div 		= createDom_filter2('div', body_div, {style:'float:left;width:100%;height:1%;background:#D6D6D6;'}); 
    	var filter_div 		= createDom_filter2('div', body_div, {id:'display_filter_data_div', style:'float:left;width:100%;height:49%;overflow:auto;'});
    }else{
        var content_div     = createDom_filter2('div', body_div, {style:'float:left;width:100%;height:100%;overflow:auto;'});
    }
*/
    if(TASApp.SubUnits.doc_id == 'All' || TASApp.SubUnits.flagA == 2){
        var content_div     = createDom_filter2('div', body_div, {id:'upper_container', style:'float:left;width:100%;height:95%;overflow:auto;'});
        document.getElementById('footer_div').innerHTML = '';
        cgi_load_all_topics();
    }else{
        var content_div     = createDom_filter2('div', body_div, {id:'upper_container', style:'float:left;width:100%;height:50%;overflow:auto;'});
        var sub_menu_div    = createDom_filter2('div', body_div, {id:'sub_menu_div', style:'float:left;width:100%;height:3%;background:#3C9BB4'});
        var local_apply_div = createDom_filter2('div', sub_menu_div, {name:'sub_menu', id:'local_apply_div', style:'float:left;width:90px;height:100%;color:#fff;font-weight:bold;text-align:center;cursor:pointer;', txt:'Local Apply'});

        local_apply_div.onclick = function(){
            change_sub_menu(this);
            document.getElementById('setting_btn_div').style.display = 'none';
            getPreviewResults(all_apply_info);
        }
        var local_states_div = createDom_filter2('label', sub_menu_div, {id:'local_states_div', style:'float:left;width:54px;height:100%;color:#fff;font-weight:bold;text-align:center;', txt:'[ 0 ]'});

        var divider_div     = createDom_filter2('div', sub_menu_div, {style:'float:left;width:15px;color:#fff;font-weight:bold;margin-left:7px;', txt:'|'})
        var global_apply_div = createDom_filter2('div', sub_menu_div, {name:'sub_menu',id:'global_apply_div', style:'float:left;width:100px;height:100%;color:#fff;font-weight:bold;text-align:center;cursor:pointer;', txt:'Global Apply All'})

        global_apply_div.onclick    = function(){
            change_sub_menu(this);
            document.getElementById('setting_btn_div').style.display = 'block';
            getGlobalFilterResults();
        }

        var global_states_div   = createDom_filter2('label', sub_menu_div, {id:'global_states_div', style:'float:left;width:54px;height:100%;color:#fff;font-weight:bold;text-align:center;', txt:'[ 0 ]'});
        var divider_div         = createDom_filter2('div', sub_menu_div, {style:'float:left;width:15px;color:#fff;font-weight:bold;margin-left:7px;', txt:'|'})
        var global_apply_unsaved_div    = createDom_filter2('div', sub_menu_div, {name:'sub_menu',id:'global_apply_unsaved_div', style:'float:left;width:140px;height:100%;color:#fff;font-weight:bold;text-align:center;cursor:pointer;', txt:'Global Apply Unsaved'})
        global_apply_unsaved_div.onclick    =  function(){
            change_sub_menu(this);
            document.getElementById('setting_btn_div').style.display = 'block';
            get_global_unsaved_results();
        }
        var global_unsaved_states_div   = createDom_filter2('label', sub_menu_div, {id:'global_unsaved_states_div', style:'float:left;width:54px;height:100%;color:#fff;font-weight:bold;text-align:center;', txt:'[ 0 ]'});

        var divider_div     = createDom_filter2('div', sub_menu_div, {style:'float:left;width:15px;color:#fff;font-weight:bold;margin-left:7px;', txt:'|'})
        var global_apply_saved_div = createDom_filter2('div', sub_menu_div, {name:'sub_menu',id:'global_apply_saved_div', style:'float:left;width:120px;height:100%;color:#fff;font-weight:bold;text-align:center;cursor:pointer;', txt:'Global Apply Saved'})
        global_apply_saved_div.onclick    =  function(){
            change_sub_menu(this);
            document.getElementById('setting_btn_div').style.display = 'block';
            get_global_saved_results();
        }
        var global_saved_states_div   = createDom_filter2('label', sub_menu_div, {id:'global_saved_states_div', style:'float:left;width:54px;height:100%;color:#fff;font-weight:bold;text-align:center;', txt:'[ 0 ]'});

        var setting_btn         = createDom_filter2('div', sub_menu_div, {style:'float:left;width:30px;cursor:pointer;margin-left:5px;margin-top:3px;'});
        setting_img             = createDom_filter2('img', setting_btn, {id:'setting_btn_div', src:'images/setting_black.png', style:'width:15px;height:15px;display:none;', onclick:'filter2Settings()'});      
        var min_btn             = createDom_filter2('div', sub_menu_div, {id:'minimize_div', style:'display:none;float:right;width:30px;font-weight:bold;font-size:18px;cursor:pointer;text-align:center;color:#fff;', txt:'-', onclick:'minimize_results_view()'});   
        var max_btn             = createDom_filter2('div', sub_menu_div, {id:'maximize_div', style:'float:right;width:30px;font-weight:bold;font-size:18px;cursor:pointer;text-align:center;color:#fff;', txt:'+', onclick:'maximize_results_view()'});   
        var manual_check_div    = createDom_filter2('div', sub_menu_div, {style:'float:right;width:130px;color:#fff;'});
        var label               = createDom_filter2('label', manual_check_div, {txt:'Manual Check', style:'float:left;font-size:12px;font-weight:bold;margin-top:2px;'})
        var manual_chk          = createDom_filter2('input', manual_check_div, {id:'manual_chk', type:'checkbox', style:'float:left;margin-top:3px;margin-left:7px'})
        manual_chk.onclick      = function(){
            var setting_div     = document.getElementById('f2_setting_div'); 
            if(setting_div.style.display == 'block')
                    setting_div.style.display    =  'none';
            if(this.checked == true){
                document.getElementById('local_states_div').style.color = '#fff';
                global_apply_div.style.display = 'none';
                divider_div.style.display = 'none';
                global_states_div.style.display  = 'none';
                global_unsaved_states_div.style.color   = '#fff';
                document.getElementById('setting_btn_div').style.display  = 'block';
                this.parentNode.parentNode.style.background = 'red';
                loadDataForManual();
            }
            else{
                divider_div.style.display = 'block';
                global_apply_div.style.display = 'block';
                global_states_div.style.display  = 'block';
                global_unsaved_states_div.style.color   = '#fff';
                document.getElementById('local_states_div').style.color = '#fff';
                this.parentNode.parentNode.style.background = '#3C9BB4'
                data_html_res 	= getDataHtmlForFilterAjax();
                global_other_count = 0;
	            getAllTaxo_ids_Names_Ajax();
    	        createTableForFilter(content_div, data_html_res);

            }
        }
        var filter_div          = createDom_filter2('div', body_div, {id:'display_filter_data_div', style:'float:left;width:100%;height:47%;overflow:auto;'});

    	data_html_res 	= getDataHtmlForFilterAjax();
        global_other_count = 0;
	    getAllTaxo_ids_Names_Ajax();
    	createTableForFilter(content_div, data_html_res);
    }
}

/*****************************************************************************************************************************************************/
maximize_results_view    = function(){
    document.getElementById('maximize_div').style.display = 'none';
    document.getElementById('minimize_div').style.display = 'block';
    if(document.getElementById('f2_setting_div').style.display == 'block'){
        document.getElementById('setting_btn_div').click(); 
    }
    document.getElementById('upper_container').style.display = 'none';
    document.getElementById('display_filter_data_div').style.height = '96%';
}

/*****************************************************************************************************************************************************/
minimize_results_view    = function(){
    document.getElementById('minimize_div').style.display = 'none';
    document.getElementById('maximize_div').style.display = 'block';
    if(document.getElementById('f2_setting_div').style.display == 'block'){
        document.getElementById('setting_btn_div').click(); 
    }
    document.getElementById('upper_container').style.display = 'block';
    document.getElementById('display_filter_data_div').style.height = '46%';
}
/*****************************************************************************************************************************************************/
displayUnsavedResults    = function(ele){
    change_cur_tab(ele);
    var div_json     = [['SaveUnsaved_bar', 'block'],['SaveUnsaved_div', 'block'], ['conflict_save', 'none'],['conflict_bar','none'], ['save_bar', 'none'], ['save_preview_result_div', 'none'], ['all_train_bar','none'], ['all_train_save','none'], ['f2_setting_div', 'none']];
    blockDisplayDiv(div_json);
    var container_div       = document.getElementById('main_container');
    container_div.innerHTML  = ''
    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'doc_id':TASApp.SubUnits.doc_id, 'flag':'16'};
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
    var retJ            = ajaxCall(TASApp.SubUnits.CGI_DIR +"pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    if(typeof retJ != 'object')
        return
    var content_data    = retJ
    var table    = createDom_filter2('table', container_div, {class:'bordered'});
    var trh  =   createDom_filter2('tr', table, {})
    var th  = createDom_filter2('th', trh, {txt:'Sr No.'})
    var th  = createDom_filter2('th', trh, {txt:'FullText'})
    var th  = createDom_filter2('th', trh, {})
    var span    = createDom_filter2('span', th, {txt:'Status'});
    var sel_all_chk = createDom_filter2('input', th, {type:'checkbox'});
    sel_all_chk.onclick  = function(){
        if(this.checked == true){
            var all_unsaved_chk  = document.querySelectorAll('[name=unsaved_chk]');
            for(var c = 0; c<all_unsaved_chk.length; c++){
                    all_unsaved_chk[c].checked = true;
            }
        }
        else{
             var all_unsaved_chk  = document.querySelectorAll('[name=unsaved_chk]');
            for(var c = 0; c<all_unsaved_chk.length; c++){
                    all_unsaved_chk[c].checked = false;
            }

        }
    }
    var th  = createDom_filter2('th', trh, {txt:'Results'})
    content_data.forEach(function(val, ind){
            var full_text   = val['full_text'];
            var unq_key     = val['my_unq'];
            var unsaved_res = val['data_ar'];
            var hash_key    = val['hash_key'];
            var  tr = createDom_filter2('tr', table, {unq_key:unq_key});
            var td  = createDom_filter2('td', tr, {txt:ind+1, style:'width:5%;'});
            var td   = createDom_filter2('td', tr, {txt:full_text, style:'width:35%;'})
            var td   = createDom_filter2('td', tr, {style:'text-align:center'})
            var inp   = createDom_filter2('input', td, {type:'checkbox', name:'unsaved_chk'});
            inp.onchange = function(){
                if(this.checked == true){
                        this.parentNode.parentNode.style.background  = '#D7D7D7';
                }
                else
                        this.parentNode.parentNode.style.background  = '';
            }
            var td   = createDom_filter2('td', tr, {})
            var str  = ''
            unsaved_res.forEach(function(text, index){
                    if(text[1] == '0')
                        str += text[0]+' <sub style="color:blue;font-weight:bold;"> '+'[ None ]' +' </sub> '+ '&nbsp;<span style="color:green;font-weight:bold;font-size:15px;">|</span> &nbsp; '
                    else
                        str += text[0]+' <sub style="color:blue;font-weight:bold;"> ['+global_taxonomy_details[text[1]]+'] </sub> '+ '&nbsp; <span style="color:green;font-weight:bold;font-size:15px;">|</span> &nbsp;'
            });
            td.innerHTML = str;
            td.setAttribute('hashkey', hash_key)
    });   
        
}

/*****************************************************************************************************************************************************/
saveUnsavedResults   = function(ele){
    change_cur_tab(ele);
    var all_unsaved_tds  = document.querySelectorAll('input[name=unsaved_chk]:checked')
    if(all_unsaved_tds.length == 0)
        return;
    var final_arr   = []
    for(var x= 0; x<all_unsaved_tds.length; x++){
        var temp_lst     = []
        var td   = all_unsaved_tds[x].parentNode.nextSibling;
        var hash_key     = td.getAttribute('hashkey');
        var unq_key     = td.parentNode.getAttribute('unq_key');
        temp_lst.push(unq_key);
        temp_lst.push(hash_key);
        final_arr.push(temp_lst);
    
    }
    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'unsaved_data_ar':final_arr, 'flag':'18'};
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
    var retJ            = ajaxCall(TASApp.SubUnits.CGI_DIR +"pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    alert(retJ)
    parent.switch_sidebar_tabs(4);
    //displayUnsavedResults();
}

/*****************************************************************************************************************************************************/
loadDataForManual   = function(){
    var content_div  = document.getElementById('upper_container');
    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'doc_id_str':TASApp.SubUnits.doc_id, 'flag':'19'};
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
    var retJ            = ajaxCall(TASApp.SubUnits.CGI_DIR +"pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    if(typeof retJ != 'object')
        return;
    var data_html_res = retJ;
    createTableForFilter(content_div, data_html_res);
}
/*****************************************************************************************************************************************************/
var cgi_load_all_topics = function(){
    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'doc_id_str':TASApp.SubUnits.doc_id, 'flag':'11', "remainder_flag":TASApp.SubUnits.remainder_flag};
    alert(TASApp.SubUnits.CGI_DIR +"pattern_generation_v13/cgi_train_f2_data.py?"+JSON.stringify(json));
    var retJ            = ajaxCall(TASApp.SubUnits.CGI_DIR +"pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    CallBack_cgi_load_all_topics(retJ);
	if(typeof retJ == 'object')
		return retJ
}

/*****************************************************************************************************************************************************/
var CallBack_cgi_load_all_topics = function(json){
    var tdiv = document.getElementById('main_container').childNodes[0];
    tdiv.style.overflow = 'auto';
    var table = create_table({id:"result_table", width:"100%", class:"prof_table taxo-classification", style:"margin-top:2px;border-top:#ededed 1px solid;"}, tdiv);
    var h_li = ['S NO'];
    for(var i=0;i<json[0].length;i++){
        h_li.push(json[0][i].split('~')[1]);
    }
    var th = create_row_and_cols(table, "th", {class:"prof_td"},h_li);
    th.setAttribute('style','background: none repeat scroll 0% 0% #6B9EDB;color:#fff;');
    var data_li = json[0][1];
    for(var i=0;i<json[1].length;i++){
        var d_li = [];
        var k = i+1;
        d_li.push(k)
        for(var j=0;j<json[0].length;j++){
            d_li.push(json[1][i][json[0][j]]);
        }
        if((i%2) == 0)
            var row = create_row_and_cols(document.getElementById('result_table'), "td", {class:"prof_td_bck"},d_li);
        else
            var row = create_row_and_cols(document.getElementById('result_table'), "td", {class:"prof_td"},d_li);

        row.cells[0].setAttribute('style','width:5%;padding:5px;text-align:center');
        row.cells[1].setAttribute('style','padding:5px;');
    }
/*        row.cells[1].setAttribute('style','width:20%');
        row.cells[2].setAttribute('style','width:10%');
        row.cells[3].setAttribute('style','width:10%');
        row.cells[4].setAttribute('style','width:10%');
        row.cells[5].setAttribute('style','width:10%');
        row.cells[6].setAttribute('style','width:10%');
        row.cells[7].setAttribute('style','width:10%');
*/
}

/*****************************************************************************************************************************************************/
blockDisplayDiv    = function(style_info){
    style_info.forEach(function(display_info){
        document.getElementById(display_info[0]).style.display  =   display_info[1];
    });
}

/*****************************************************************************************************************************************************/
getConflictsResults     = function(ele){
    change_cur_tab(ele);
    var div_json = [['conflict_save', 'block'], ['conflict_bar', 'block'], ['save_preview_result_div', 'none'], ['SaveUnsaved_bar', 'none'], ['SaveUnsaved_div', 'none'], ['save_bar', 'none'],['all_train_save','none'], ['all_train_bar', 'none'], ['f2_setting_div', 'none']];
    blockDisplayDiv(div_json);
    var conflict_res_div = document.getElementById('main_container'); 
    conflict_res_div.innerHTML   = '';
    
    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'doc_id_str': TASApp.SubUnits.doc_id, 'flag':'14' };
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    if(typeof retJ != 'object')
        return;
    var content_data    = retJ[0]
    var conflict_res_details     = retJ[1]
    var table    = createDom_filter2('table', conflict_res_div, {class:'bordered'});
    var trh  =   createDom_filter2('tr', table, {})
    var th  = createDom_filter2('th', trh, {txt:'Sr No.'})
    var th  = createDom_filter2('th', trh, {txt:'FullText'})
    var th  = createDom_filter2('th', trh, {txt:'Status'})
    var th  = createDom_filter2('th', trh, {txt:'Conflict Results'})

    content_data.forEach(function(val, ind){
            var full_text   = val[1];
            var unq_key     = val[0];
            var conflict_res    = conflict_res_details[unq_key];
            var  tr = createDom_filter2('tr', table, {unq_key:unq_key});
            var td  = createDom_filter2('td', tr, {txt:ind+1, style:'width:5%;', rowspan:conflict_res.length});
            var td   = createDom_filter2('td', tr, {txt:full_text, style:'width:35%;', rowspan:conflict_res.length})
            var td   = createDom_filter2('td', tr, {style:'text-align:center;width:5%;'})
            var img  = createDom_filter2('img', td, {src:'images/purple_delete.png', style:'cursor:pointer;', apply_all_flag:0});
            if(conflict_res[0][2] == '1'){
                img.setAttribute('src') = 'images/purple_check.png';
                img.setAttribute('apply_all_flag') = 1;
            }

            img.onclick = function(){
                var res =  confirm('Do you want to apply All.. ');
                if(res){
                       var hash_key  = this.parentNode.nextSibling.getAttribute('hashkey');
                       applyAllConflicts(hash_key, this);
                }
                else
                  applyOnlyThis(this); 
            }

            var td   = createDom_filter2('td', tr, {name:'conflict_data_td', unq_key:unq_key, style:'width:55%'})
            var str  = ''
            conflict_res[0][1].forEach(function(text, index){
                    if(text[1] == '0')
                        str += text[0]+' <sub style="color:blue;font-weight:bold;"> '+'[ None ]' +' </sub> '+ '&nbsp;<span style="color:green;font-weight:bold;font-size:15px;">|</span> &nbsp; '
                    else
                        str += text[0]+' <sub style="color:blue;font-weight:bold;"> ['+global_taxonomy_details[text[1]]+'] </sub> '+ '&nbsp; <span style="color:green;font-weight:bold;font-size:15px;">|</span> &nbsp;'
            });

            td.innerHTML = str;
            td.setAttribute('hashkey', conflict_res[0][0]);

            for(var x = 1; x<conflict_res.length; x++){
                var ctr  = createDom_filter2('tr', table, {});
                var td   = createDom_filter2('td', ctr, {style:'text-align:center;width:5%;'})
                var img  = createDom_filter2('img', td, {src:'images/purple_delete.png', style:'cursor:pointer;', apply_all_flag:0}) 
                if(conflict_res[x][2] == '1'){
                    img.setAttribute('apply_all_flag') = 1;
                    img.setAttribute('src') = 'images/purple_check.png';
                }
                img.onclick  = function(){
                    var res =  confirm('You Want to Apply All.. ');
                    if(res){
                       var hash_key  = this.parentNode.nextSibling.getAttribute('hashkey');
                       applyAllConflicts(hash_key, this);
                    }
                    else
                        applyOnlyThis(this);
                }
                var td   = createDom_filter2('td', ctr, {name:'conflict_data_td', unq_key:unq_key, style:'width:55%;'})
                var str  = ''

                conflict_res[x][1].forEach(function(text, index){
                    if(text[1] == '0')
                        str += text[0]+' <sub style="color:blue;font-weight:bold;"> '+' [None]' +' </sub>'+ '&nbsp;<span style="color:green;font-weight:bold;font-size:15px;">|</span> &nbsp; '
                    else
                        str += text[0]+' <sub style="color:blue;font-weight:bold;"> ['+global_taxonomy_details[text[1]]+'] </sub> '+ '&nbsp; <span style="color:green;font-weight:bold;font-size:15px;">| </span>&nbsp;'
                });

                td.innerHTML = str;
                td.setAttribute('hashkey', conflict_res[x][0])
            }
    });   
    //var indiv_arr = [trh]; 
    //trh.scrollIntoView(); 
    //create_indiv(indiv_arr, table); 
    //assign_fn(table, indiv_arr); 
    //scroll_head(table, indiv_arr);     
}

/*****************************************************************************************************************************************************/
applyOnlyThis    = function(ele){
        var src = ele.getAttribute('src');
        if(src  == 'images/purple_check.png'){
                    ele.src = 'images/purple_delete.png'
                    ele.setAttribute('apply_all_flag', 0);
                    ele.parentNode.style.background = '';
                    ele.parentNode.nextSibling.style.background  =  '';
        }
        else{
                    ele.src = 'images/purple_check.png'
                    ele.setAttribute('apply_all_flag', 1);
                    ele.parentNode.style.background = '#D7D7D7';
                    ele.parentNode.nextSibling.style.background  =  '#D7D7D7';
        }
}

/*****************************************************************************************************************************************************/
applyAllConflicts    = function(hash_key, ele){
    var flag     = ele.getAttribute('apply_all_flag');
    var all_conflicts_tds   = document.querySelectorAll('[name=conflict_data_td]');
    for(var x = 0; all_conflicts_tds.length; x++){
          if(all_conflicts_tds[x].getAttribute('hashkey') == hash_key){
                var img  = all_conflicts_tds[x].previousSibling.childNodes[0]
                if(flag == 1){
                    img.src = 'images/purple_delete.png'
                    img.setAttribute('apply_all_flag', 0);
                    img.parentNode.style.background = '';
                    img.parentNode.nextSibling.style.background  =  '';
                }
                else{
                    img.src = 'images/purple_check.png'
                    img.setAttribute('apply_all_flag', 1);
                    img.parentNode.style.background = '#D7D7D7';
                    img.parentNode.nextSibling.style.background  =  '#D7D7D7';
                }
          }
    }
}

/*****************************************************************************************************************************************************/
SaveConflictsResults     = function(ele){
    change_cur_tab(ele);
    var  all_conflicts_tds   = document.querySelectorAll('[name=conflict_data_td]');
    var final_arr    = []
    for(var x = 0; x<all_conflicts_tds.length; x++){
           var temp_arr     = []
           var hash_key     = all_conflicts_tds[x].getAttribute('hashkey');
           var apply_status = all_conflicts_tds[x].previousSibling.childNodes[0].getAttribute('apply_all_flag');
           var unq_key      =  all_conflicts_tds[x].getAttribute('unq_key');
           temp_arr.push(unq_key);
           temp_arr.push(hash_key);
           temp_arr.push(apply_status);
           final_arr.push(temp_arr);
    }
    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'save_conflict_data':final_arr , 'flag':'17' };
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    alert(retJ);
    parent.switch_sidebar_tabs(4);
    //getConflictsResults();
}

/*****************************************************************************************************************************************************/
getAllReviewResults     = function(ele){
    var div_json     = [['conflict_save', 'none'], ['conflict_bar','none'], ['SaveUnsaved_bar','none'], ['SaveUnsaved_div', 'none'], ['save_preview_result_div', 'none'], ['save_bar', 'none'],['all_train_save', 'none'], ['all_train_bar', 'none'], ['f2_setting_div', 'none']];
    blockDisplayDiv(div_json);
    change_cur_tab(ele);
    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'doc_id_str': TASApp.SubUnits.doc_id, 'flag':'13' };
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    if(typeof retJ != 'object')
        return;
    var main_container  = document.getElementById('main_container');
    main_container.innerHTML     = ''
    var header_info  = retJ[1];
    var content_data    = retJ[0];
    var table    = createDom_filter2('table', main_container, {id:'preview_all_done_table',  class:'bordered'});
    var tr  =   createDom_filter2('tr', table, {})
    var th  = createDom_filter2('th', tr, {txt:'Manual'})
    var th  = createDom_filter2('th', tr, {txt:'Full Text'})
    header_info.forEach(function(val, ind){
           var th   =   createDom_filter2('th', tr, {txt: global_taxonomy_details[val]}) 
           //var th   =   createDom_filter2('th', tr, {}) 
           //create_taxonomy_options(val, th);
    });
    content_data.forEach(function(val, ind){
            var full_text   = val['fullText'];
            var unq_key  = val['myunq_key'];
            var  tr = createDom_filter2('tr', table, {unq_key:unq_key});
            var taxo_wise_content   =   val['data_ar'];
            var td  = createDom_filter2('td', tr, {style:'width:8%;'});
            var inp  = createDom_filter2('input', td, {type:'radio', name:'manual_radio'});
            inp.onchange = function(){
			        global_preview_tr = this.parentNode.parentNode; 
                    if(this.checked == true){
                        all_apply_info = []
                        var unq_key_for_manual = this.parentNode.parentNode.getAttribute('unq_key');
                        var manual_json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'myunq_key': unq_key_for_manual, 'flag':'23' };
                        //alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(manual_json));
	                    var manual_retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", manual_json, 'POST', false);
                        alert(manual_retJ)
                        var html_content = manual_retJ;
                        createDivForManual(html_content, unq_key_for_manual);
                          
                    }
            }
            var td  = createDom_filter2('td', tr, {txt:full_text});
            for(var x = 0; x<header_info.length; x++){
                    if(!taxo_wise_content[header_info[x]])
                            var td   = createDom_filter2('td', tr, {txt:'-'});
                    else
                        var td   = createDom_filter2('td', tr, {txt:taxo_wise_content[header_info[x]]})
            }
            var done_flag = val['done_flag'];
            if(val['done_flag'] == 1){
                tr.setAttribute('style','background:#c7e3ff;filter:alpha(opacity=50);-moz-opacity:0.5;');
            }	
            if(val['done_flag'] == 2){
                tr.setAttribute('style','background:#D7D7D7;filter:alpha(opacity=50);-moz-opacity:0.5;');
            }	
    });
}

/*****************************************************************************************************************************************************/
getAllReviewRemainderResults     = function(ele){
    var div_json     = [['conflict_save', 'none'], ['conflict_bar','none'], ['SaveUnsaved_bar','none'], ['SaveUnsaved_div', 'none'], ['save_preview_result_div', 'none'], ['save_bar', 'none'],['all_train_save', 'none'], ['all_train_bar', 'none'], ['f2_setting_div', 'none']];
    blockDisplayDiv(div_json);
    change_cur_tab(ele);
    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id, 'flag':'24' };
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    if(typeof retJ != 'object')
        return;
    var main_container  = document.getElementById('main_container');
    main_container.innerHTML     = ''
    var header_info  = retJ[1];
    var content_data    = retJ[0];
    var table    = createDom_filter2('table', main_container, {id:'preview_all_done_table',  class:'bordered'});
    var tr  =   createDom_filter2('tr', table, {})
    var th  = createDom_filter2('th', tr, {txt:'Manual'})
    var th  = createDom_filter2('th', tr, {txt:'Full Text'})
    header_info.forEach(function(val, ind){
           var th   =   createDom_filter2('th', tr, {txt: global_taxonomy_details[val]}) 
           //var th   =   createDom_filter2('th', tr, {}) 
           //create_taxonomy_options(val, th);
    });
    content_data.forEach(function(val, ind){
            var full_text   = val['full_text'];
            var unq_key  = val['my_unq'];
            var  tr = createDom_filter2('tr', table, {unq_key:unq_key});
            var taxo_wise_content   =   val['data_ar'];
            var td  = createDom_filter2('td', tr, {style:'width:8%;'});
            var inp  = createDom_filter2('input', td, {type:'radio', name:'manual_radio'});
            inp.onchange = function(){
			        global_preview_tr = this.parentNode.parentNode; 
                    if(this.checked == true){
                        all_apply_info = []
                        var unq_key_for_manual = this.parentNode.parentNode.getAttribute('unq_key');
                        var manual_json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'myunq_key': unq_key_for_manual, 'flag':'23' };
                        //alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(manual_json));
	                    var manual_retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", manual_json, 'POST', false);
                        alert(manual_retJ)
                        var html_content = manual_retJ;
                        createDivForManual(html_content, unq_key_for_manual);
                          
                    }
            }
            var td  = createDom_filter2('td', tr, {txt:full_text});
            for(var x = 0; x<header_info.length; x++){
                    if(!taxo_wise_content[header_info[x]])
                            var td   = createDom_filter2('td', tr, {txt:'-'});
                    else
                        var td   = createDom_filter2('td', tr, {txt:taxo_wise_content[header_info[x]]})
            }
            var done_flag = val['done_flag'];
            if(val['done_flag'] == 1){
                tr.setAttribute('style','background:#c7e3ff;filter:alpha(opacity=50);-moz-opacity:0.5;');
            }	
            if(val['done_flag'] == 2){
                tr.setAttribute('style','background:#D7D7D7;filter:alpha(opacity=50);-moz-opacity:0.5;');
            }	
    });

}

/*****************************************************************************************************************************************************/
createDivForManual   = function(html_content, unq_key){
    document.getElementById('manual_absolute_div').style.display = 'block';
    var manual_content_div = document.getElementById('manual_absolute_content_div');
    manual_content_div.innerHTML = '';
	var mouseDownFlg = 0;
    var manual_table    = createDom_filter2('table', manual_content_div, {class:'fixed_manual', id:'doc_content_grid'});
    var tr       = createDom_filter2('tr', manual_table, {uni_key:unq_key}); 
    var td       = createDom_filter2('td',tr, {txt:'1', style:'width:5%;'});
    var td       = createDom_filter2('td',tr, {});
    td.innerHTML     = html_content;
    manual_table.onmousedown = function(event){
        select_div   = document.getElementById('select_taxonomy_div').style.display = 'none';
		var target 	    = event.target;
        global_cur_tr 	= target.parentNode.parentNode;
        TASApp.SubUnits.global_tr_on_mouse_move = target.parentNode.parentNode;
		mouseDownFlg 	= 1;
		span_json 	=  {};
        span_json_str = '';
	}

	manual_table.onmouseup = function(){
        if(span_json_str){
            var span_json_str_ar = span_json_str.split('~');
            var start_ind = parseInt(span_json_str_ar[0].split('_')[1]);
            var end_ind = span_json_str_ar[span_json_str_ar.length-2];
            var end_ind_cnt = parseInt(end_ind.split('_')[1]);
            var cont_id = end_ind.split('_')[0];
            if (end_ind_cnt < start_ind)
            {
                alert('SELECTION ERROR');
                return;
            }
        }
        span_json = {};
        for (cnt=start_ind;cnt<=end_ind_cnt;cnt++)
        {
            span_json[cont_id+'_'+cnt.toString()] = '';
        }
		mouseDownFlg 	= 0;
        span_details  = {};
        //alert(JSON.stringify(span_json));
		if(Object.keys(span_json).length != 0 ){
			var span_ids = Object.keys(span_json)
            span_details['span_ids'] = span_ids;
            var rect = $$(span_ids[span_ids.length-1]).getBoundingClientRect();
            var x = rect.left;
            var y = rect.top;
            var h = rect.bottom - rect.top;
            var select_div =  document.getElementById('select_taxonomy_div');
                select_div.style.display = 'block';
                select_div.style.left   = x-132;
                select_div.style.top   = y+h;
                select_div.innerHTML    = '';
                var table    = createDom_filter2('table', select_div, {class:'bordered'});  
                var trh  = createDom_filter2('tr', table, {});
                var th  = createDom_filter2('th', trh, {txt:'No'});
                var th  = createDom_filter2('th', trh, {txt:'Taxonomy Name'});
                var tr  = createDom_filter2('tr', table, {});
                fillTaxonomySelect_table(table); 
		}
		span_json 	= {};
        span_json_str = '';
	}

	manual_table.onmousemove = function(event){
		if(mouseDownFlg != 1)
			return;
		var target	= event.target;
                if(target.nodeName.toLowerCase() == 'span')
			span_json[target.getAttribute('id')] = target.textContent;
            span_json_str += target.getAttribute('id')+'~';
	}
 
}
/*****************************************************************************************************************************************************/
close_manual_absolute_div    = function(){
   document.getElementById('manual_absolute_div').style.display = 'none';
}

/*****************************************************************************************************************************************************/
close_f2_setting_div  = function(){
   document.getElementById('f2_setting_div').style.display = 'none';
}


/*****************************************************************************************************************************************************/
create_taxonomy_options = function(default_taxo, parentDom){
    global_taxonomy_details['0'] = 'None'
    //alert(global_apply_taxonomy_lst)
    var select   = createDom_filter2('select', parentDom, {});
    var taxo_name   = global_taxonomy_details[default_taxo];
    //var new_taxo_name   = taxo_name.replace('Publication', 'Pub');
    var option  = createDom_filter2('option', select, {txt:taxo_name, taxo_id:default_taxo});
    for(var taxo_id in global_taxonomy_details){
        if(taxo_id == default_taxo)
            continue
        var taxo_name   = global_taxonomy_details[taxo_id];
        //var new_taxo_name   = taxo_name.replace('Publication', 'Pub');
        var option  = createDom_filter2('option', select, {txt:taxo_name, taxo_id:taxo_id });
    }
}


/*****************************************************************************************************************************************************/
getAllTrainedResults     = function(ele){
    change_cur_tab(ele);
    var div_json     = [['conflict_save', 'none'], ['conflict_bar','none'], ['SaveUnsaved_bar','none'], ['SaveUnsaved_div', 'none'], ['save_preview_result_div', 'none'], ['save_bar', 'none'], ['all_train_save', 'block'], ['all_train_bar', 'block'], ['f2_setting_div', 'none']];
    blockDisplayDiv(div_json);
    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id, 'flag':'20' };
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    if(typeof retJ != 'object')
        return;
    var main_container  = document.getElementById('main_container');
    main_container.innerHTML     = ''
    var trained_div     = createDom_filter2('div', main_container, {style:'float:left;width:100%;height:50%;overflow:auto;'});
    var bar_div         = createDom_filter2('div', main_container, {style:'float:left;width:100%;height:1%;background:#3C9BB4'}); 
    var detail_div      = createDom_filter2('div', main_container, {id:'display_filter_data_div', style:'float:left;width:100%;height:49%;overflow:auto;'});
    trained_res = retJ;
    var table    = createDom_filter2('table', trained_div, {class:'bordered'});
    var tr  =   createDom_filter2('tr', table, {})
    var th  = createDom_filter2('th', tr, {txt:'Sr No.'})
    var th  = createDom_filter2('th', tr, {txt:'Full Text'})
    var th  = createDom_filter2('th', tr, {txt:'Trained Results'});
    var th  = createDom_filter2('th', tr, {txt:'Delete'});
    trained_res.forEach(function(val, ind){
            var tr   = createDom_filter2('tr', table, {unq_key:val['res_unq_key'], hash_key:val['hash_key']});
            var td   = createDom_filter2('td', tr, {txt:ind+1, style:'width:5%;'});
            var td  = createDom_filter2('td', tr, {txt:val['fullText'], style:'width:30%;'}) 
            var td   = createDom_filter2('td', tr, {style:'width:60%'});
            var taxo_wise_res = val['res_col_data_ar'];
            var str  = ''
            taxo_wise_res.forEach(function(text, index){
                    var content = text.split(':|:')[0]
                    var taxo_id = text.split(':|:')[1]
                    if(taxo_id == '0')
                        str += content+' <sub style="color:blue;font-weight:bold;"> '+'[ None ]' +' </sub> '+ '&nbsp;<span style="color:green;font-weight:bold;font-size:15px;">|</span> &nbsp; '
                    else
                        str += content+ ' <sub style="color:blue;font-weight:bold;"> ['+global_taxonomy_details[taxo_id]+'] </sub> '+ '&nbsp; <span style="color:green;font-weight:bold;font-size:15px;">|</span> &nbsp;'
            });
            td.innerHTML = str;
            var td   = createDom_filter2('td', tr, {style:'width:5%;text-align:center;'});
            var del_img  = createDom_filter2('img', td, {src:'images/purple_delete.png', style:'cursor:pointer;'})
            tr.onclick = function(event){
                var target   = event.target;
                if (target.nodeName.toLowerCase() == 'td'){
                        var hash_key     = target.parentNode.getAttribute('hash_key');
                        var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'hash_key':hash_key, 'flag':'21' };
                        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	                    var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
                        if(typeof retJ != 'object'){
                                return;
                        }
                        displayPreviewResults(retJ[0], retJ[1], 1);
                }
            
                else if (target.nodeName.toLowerCase() == 'img'){
                    var hash_key     = target.parentNode.parentNode.getAttribute('hash_key');
                    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'hash_key':hash_key, 'flag':'22' };
                    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	                var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
                    if(retJ == 'DONE')
                        document.getElementById('all_trained_btn').click();
                }
            }
    });
}

/*****************************************************************************************************************************************************/
getDataHtmlForFilterAjax	 = function(){
    if(TASApp.SubUnits.remainder_value == 'R'){
        new_doc_id  = TASApp.SubUnits.remainder_value;
    }else{
        new_doc_id  = TASApp.SubUnits.doc_id;
    }
    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'doc_id_str': new_doc_id, 'flag':'3' };
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
	if(typeof retJ == 'object')
		return retJ
}

/*****************************************************************************************************************************************************/
get_global_saved_results     = function(){
    var div_json     = [['duplicate_setting', 'none'], ['merge_setting','none'], ['split_setting','none'], ['restore_column_setting', 'none'], ['search_extract_column_setting', 'none']];
    blockDisplayDiv(div_json);
    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'doc_id_str':TASApp.SubUnits.doc_id, 'flag':'14' };
    alert("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
    if(typeof retJ != 'object')
        return;
    displayPreviewResults(retJ[0], retJ[1], 1, retJ[2]); 
}
/*****************************************************************************************************************************************************/
get_global_unsaved_results   = function(){
    var div_json     = [['duplicate_setting', 'block'], ['merge_setting','block'], ['split_setting','block'], ['restore_column_setting', 'block'], ['search_extract_column_setting', 'block']];
    blockDisplayDiv(div_json);
    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'doc_id_str':TASApp.SubUnits.doc_id, 'flag':'12' };
    alert("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
    if(typeof retJ != 'object')
            return
    //document.getElementById('global_unsaved_states_div').innerHTML   = ''
    //document.getElementById('global_unsaved_states_div').textContent   = '[ '+ retJ[2]+ ' ]';
    displayPreviewResults(retJ[0], retJ[1], 1, retJ[2]); 
}


/*****************************************************************************************************************************************************/
getGlobalFilterResults   = function(){
    var div_json     = [['duplicate_setting', 'block'], ['merge_setting','block'], ['split_setting','block'], ['restore_column_setting', 'block'], ['search_extract_column_setting', 'block']];
    blockDisplayDiv(div_json);
    var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'doc_id_str':TASApp.SubUnits.doc_id, 'flag':'12' };
    alert("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    if(typeof retJ != 'object')
            return
    document.getElementById('global_states_div').innerHTML   = '';
    document.getElementById('global_states_div').textContent   = '[ '+ retJ[2] +' ]';
    displayPreviewResults(retJ[0], retJ[1], 1, retJ[2]); 
}

/*****************************************************************************************************************************************************/
CreateFilterResultsDiv	= function(parentDomEle){
 	getAllTaxo_ids_Names_Ajax(); 	
	parentDomEle.innerHTML	 = '';
	var table	= createDom_filter2('table', parentDomEle, {class:'bordered'});
	var trh		= createDom_filter2('tr', table, {});
	for(var x = 0; x<10; x++){
		var th 	= createDom_filter2('th', trh, {txt:'C '+ (x+1)});
	}
	var  tr		= createDom_filter2('tr', table, {});
	for(var x = 0; x<10; x++){
		var td 	= createDom_filter2('td', tr, {});
		var taxo_Select  = createDom_filter2('select', td, {});
		fillTaxonomySelect(taxo_Select);
	}
	var  tr		= createDom_filter2('tr', table, {});
	for(var x = 0; x<10; x++){
		var td 	= createDom_filter2('td', tr, {id:'C_'+(x+1) , style:'width:10%;height:40px;', name:'filtered_td'})
	}

	//var footer_div 	= $$('footer_div');
 	//var clear_div	= createDom_filter2('div', footer_div, {txt:'Clear',style:'float:right;width:80px;margin-top:10px;font-size:12px;color:#fff;font-weight:bold;cursor:pointer;'})
 	//var bar_div	    = createDom_filter2('div', footer_div, {txt:'|', style:'float:right;width:25px;margin-top:7px;color:#fff;font-weight:bold;'})
	//clear_div.onclick = function(){
      //  init(); 
		/*var all_filtered_tds = document.querySelectorAll('[name=filtered_td]');
		for(var y = 0; y<all_filtered_tds.length; y++){
			all_filtered_tds[y].textContent = '';
		}*/
	//}

 	//var submit_div	= createDom_filter2('div', footer_div, {txt:'Preview', style:'float:right;width:80px;margin-top:10px;font-size:12px;color:#fff;font-weight:bold;cursor:pointer;'})
	/*submit_div.onclick = function(){
		 var all_spans_arr = getAllSpanIdsColumnWise();
		 var uni_key	= global_cur_tr.getAttribute('uni_key');
		 var colored_span_res = submitSpanIdsForFilteredDataAjax(all_spans_arr, uni_key); 
		 highlightSpansOnColors(colored_span_res);
	}*/
}

/*****************************************************************************************************************************************************/
getAppliedColorResults   = function(all_apply_info){
		 var uni_key	= global_cur_tr.getAttribute('uni_key');
		 var colored_span_res = submitSpanIdsForFilteredDataAjax(all_apply_info, uni_key); 
		 highlightSpansOnColors(colored_span_res);
}

/*****************************************************************************************************************************************************/
getPreviewResults_new    = function(all_spans_arr){

    if(global_cur_tab.id == 'preview_all_done'){
        if(!global_cur_tr){
            var uni_key = ':TASHASH::TASHASH:'+ TASApp.SubUnits.doc_id + ':TASHASH:'   
            all_spans_arr = []
        }
        else
	        var uni_key	= global_cur_tr.getAttribute('uni_key');
        var manual_flag = 1;
        var doc_id = uni_key.split(':TASHASH:')[2];
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id": TASApp.SubUnits.mgmt_id, "taxo_id":TASApp.SubUnits.taxo_id, 'doc_id_str':doc_id, 'col_data_ar':all_spans_arr, 'myunq_key':uni_key, 'apply_preview_flag':1, 'manual_flag':manual_flag, 'flag':4 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	    var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
        if(typeof retJ != 'object'){
            return;
        }   
        modifyPreviewAllTable(retJ[0], retJ[1], 0);
    }

    else{
        if(!global_cur_tr){
            uni_key = ':TASHASH::TASHASH:'+ TASApp.SubUnits.doc_id + ':TASHASH:'   
            all_spans_arr = []
        }
        else
	        var uni_key	= global_cur_tr.getAttribute('uni_key');
        var manual_flag  = 0
        var doc_id  = TASApp.SubUnits.doc_id; 
        if(document.getElementById('manual_chk')){
            var manual_status = document.getElementById('manual_chk').checked;
            if(manual_status)
                manual_flag = 1;
        }
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id": TASApp.SubUnits.mgmt_id, "taxo_id":TASApp.SubUnits.taxo_id, 'doc_id_str':doc_id, 'col_data_ar':all_spans_arr, 'myunq_key':uni_key, 'apply_preview_flag':1, 'manual_flag':manual_flag, 'flag':4 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	    var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
        if(typeof retJ != 'object'){
            return;
        }
        displayPreviewResults(retJ[0], retJ[1], 0);
    }
}


/*****************************************************************************************************************************************************/
getPreviewResults    = function(all_spans_arr){
    if(!global_cur_tr){
        uni_key = ':TASHASH::TASHASH:'+ TASApp.SubUnits.doc_id + ':TASHASH:'   
        all_spans_arr = []
    }
    else
	    var uni_key	= global_cur_tr.getAttribute('uni_key');
    var manual_flag  = 0
    var doc_id  = TASApp.SubUnits.doc_id;
    var onlymyunq_flag = 0 
    if(document.getElementById('manual_chk')){
        var manual_status = document.getElementById('manual_chk').checked;
        if(manual_status)
            manual_flag = 1;
    }
    if(global_cur_tab){
        if((global_cur_tab.id == 'preview_all_done')||(global_cur_tab.id == 'preview_all_remainder')){
            manual_flag = 1;
            doc_id = uni_key.split(':TASHASH:')[2];
            onlymyunq_flag = 1
        }
    }
    var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id": TASApp.SubUnits.mgmt_id, "taxo_id":TASApp.SubUnits.taxo_id, 'doc_id_str':doc_id, 'col_data_ar':all_spans_arr, 'myunq_key':uni_key, 'apply_preview_flag':1, 'manual_flag':manual_flag,'onlymyunq_flag':onlymyunq_flag, 'flag':4 };
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    if(typeof retJ != 'object'){
        return;
    }
    if(global_cur_tab){
        if((global_cur_tab.id == 'preview_all_done')||(global_cur_tab.id == 'preview_all_remainder'))
            modifyPreviewAllTable(retJ[0], retJ[1], retJ[2]);
    }
    else
        displayPreviewResults(retJ[0], retJ[1], 0, retJ[2]);
}

/*****************************************************************************************************************************************************/
modifyPreviewAllTable    = function(content, header, complete_flag){
    if(complete_flag){
        document.getElementById('close_manual_absolute_btn').click();
        var preview_table     = document.getElementById('preview_all_done_table');
        var unq_key = global_preview_tr.getAttribute('unq_key');
        var json = {"user_id":TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'myunq_key':unq_key , 'flag':'13' };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	    var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
        if(typeof retJ != 'object')
            return
        var preview_content = retJ[0];
        var header_ar    = retJ[1];
        header_ar.forEach(function(val, ind){
            var content = preview_content[0]['data_ar'][val];
            global_preview_tr.cells[ind+2].textContent = '';
            if(content)
                global_preview_tr.cells[ind+2].textContent = content;
            else
                global_preview_tr.cells[ind+2].textContent = '-';
        });
        var done_flag = preview_content[0]['done_flag'];
        if(val['done_flag'] == 1){
            global_preview_tr.setAttribute('style','background:#c7e3ff;filter:alpha(opacity=50);-moz-opacity:0.5;');
        }	
        if(val['done_flag'] == 2){
            global_preview_tr.setAttribute('style','background:#D7D7D7;filter:alpha(opacity=50);-moz-opacity:0.5;');
        }	
    }
}

/*****************************************************************************************************************************************************/
displayPreviewResults    = function(filtered_res, header_arr, global_chk_flag, states_count){
    if(states_count){
        if(curent_tab.id == 'local_apply_div'){
            document.getElementById('local_states_div').innerHTML = ''
            document.getElementById('local_states_div').textContent = '[ '+states_count+ ' ]' 
        }
        else if(curent_tab.id == 'global_apply_div'){
            document.getElementById('global_states_div').innerHTML = ''
            document.getElementById('global_states_div').textContent = '[ '+states_count+ ' ]' 
        }
        else if(curent_tab.id == 'global_apply_unsaved_div'){
            document.getElementById('global_unsaved_states_div').innerHTML = ''
            document.getElementById('global_unsaved_states_div').textContent = '[ '+states_count+ ' ]' 
        }
        else if(curent_tab.id == 'global_apply_saved_div'){
            document.getElementById('global_saved_states_div').innerHTML = ''
            document.getElementById('global_saved_states_div').textContent = '[ '+states_count+ ' ]' 
        }
    }
    global_apply_taxonomy_lst = header_arr;
    /*global_apply_taxonomy_lst.forEach(function(val, ind){
        var taxo_id         = val.split('~')[0];
        var conf_taxo_id    = val.split('~')[1];
        global_taxo_id_conf_id_json[taxo_id] = conf_taxo_id;
    });*/
    global_unq_hashkey_lst  =   []
    var none_cnt    = 1;
	var body_div 		= document.getElementById('display_filter_data_div');
	body_div.innerHTML 	= '';
    if(filtered_res.length == 0)
        return
    var header_div   = createDom_filter2('div', body_div, {style:'float:left;height:15%;width:100%;overflow:auto;'});
    var table_div    = createDom_filter2('div', body_div, {style:'float:left;height:85%;width:100%;overflow:auto;'});
    var table        = createDom_filter2('table', header_div, {class:'bordered', id:'doc_result_grid', style:'height:100%;'});
    var trh     = createDom_filter2('tr', table, {});
    var th  = createDom_filter2('th', trh, {txt:'Sr No.', style:'min-width:5%;text-align:center;'});
    if(global_chk_flag){
        var sel_all  = createDom_filter2('input', th, {type:'checkbox'});
        sel_all.onclick = function(){
            if(this.checked == true){
                var all_global_chk   = document.querySelectorAll('[name=global_chk]');
                for(var c = 0; c<all_global_chk.length; c++){
                    all_global_chk[c].checked = true;
                }
            }
            else{
                var all_global_chk   = document.querySelectorAll('[name=global_chk]');
                for(var c = 0; c<all_global_chk.length; c++){
                    all_global_chk[c].checked = false;
                }
            }
        }

    }
    var th  = createDom_filter2('th', trh, {txt:'Full Text', style:'width:18%;min-width:18%;'})
    var each_th_width   = 77/(header_arr.length);
    for(var x = 0; x<header_arr.length; x++ ){
        var taxo_id = header_arr[x].split('~')[0];
        if(taxo_id == '0')
            var th   = createDom_filter2('th', trh, {txt:'Other '+ (none_cnt++), style:'width:'+each_th_width+'%;'+'min-width:'+each_th_width+'%;'});
        else{
            var taxonomy_name = global_taxonomy_details[taxo_id];
            taxonomy_name   = taxonomy_name.replace('Publication', 'Pub');
            var th   = createDom_filter2('th', trh, {txt:taxonomy_name, style:'width:'+each_th_width+'%;'+'min-width:'+each_th_width+'%;'});
        }
    }

    var table   = createDom_filter2('table', table_div, {class:'bordered', id:'doc_result_grid',style:"100%"});
    var trh     = createDom_filter2('tr', table, {});
    //var th  = createDom_filter2('th', trh, {txt:'Sr No.'});
    /*if(global_chk_flag){
        var sel_all  = createDom_filter2('input', th, {type:'checkbox'});
        sel_all.onclick = function(){
            if(this.checked == true){
                var all_global_chk   = document.querySelectorAll('[name=global_chk]');
                for(var c = 0; c<all_global_chk.length; c++){
                    all_global_chk[c].checked = true;
                }
            }
            else{
                var all_global_chk   = document.querySelectorAll('[name=global_chk]');
                for(var c = 0; c<all_global_chk.length; c++){
                    all_global_chk[c].checked = false;
                }
            }
        }
    }*/
    /*var th  = createDom_filter2('th', trh, {txt:'Full Text'})
    for(var x = 0; x<header_arr.length; x++ ){
        if(header_arr[x] == '0')
            var th   = createDom_filter2('th', trh, {txt:'Other '+ (none_cnt++)});
        else
            var th   = createDom_filter2('th', trh, {txt:global_taxonomy_details[header_arr[x]]});
    }
*/
    filtered_res.forEach(function(val, ind){
        var unq_key = val['unq_key'];
        var full_text   = val['full_text'];
        //alert(val['rulehash']);
        if(val['rulehash']){
               global_unq_hashkey_lst.push(unq_key+':@@:'+val['rulehash']);
        }
        var taxo_wise_res = val['col_ar'];
        var col_ar_st_end = val['col_ar_st_end'];
        var tr  = createDom_filter2('tr', table, {unq_key:unq_key, col_ar_st_end:col_ar_st_end});
        var td   = createDom_filter2('td', tr, {txt:ind+1, style:'min-width:5%;text-align:center;'});
        if(global_chk_flag){
            tr.setAttribute('hash_key', val['rulehash']);
            var inp  = createDom_filter2('input', td, {type:'checkbox',name:'global_chk'});
            if(val['select_flag'] == 1){
                inp.checked = true;
            }
        }
        if(val['done_flag'] == 1){
                tr.setAttribute('style','background:#c7e3ff;filter:alpha(opacity=50);-moz-opacity:0.5;');
        }else if(val['done_flag'] == 2){
                tr.setAttribute('style','background:#c7e3ff;filter:alpha(opacity=50);-moz-opacity:0.5;');
        }	
        
        var td   = createDom_filter2('td', tr, {txt:full_text, style:'width:18%;min-width:18%;'});
        var each_td_width   = 77/(header_arr.length);
        for(var x = 0;x<header_arr.length; x++){
            if(!taxo_wise_res[x])
                var td  = createDom_filter2('td', tr, {txt:'-', style:'width:'+each_td_width+'%;'+'min-width:'+each_td_width+'%;'});
            else{
                var taxo_id_name_arr = taxo_wise_res[x].split(':|:');
                var td  = createDom_filter2('td', tr, {txt:taxo_id_name_arr[0], taxo_id:taxo_id_name_arr[1], style:'width:'+each_td_width+'%;'+'min-width:'+each_td_width+'%;'+'word-break:break-all;'});
            }
        }
         
    }); 
    body_div.scrollTop =  0;

}

/*****************************************************************************************************************************************************/
displayPreviewResults_old   = function( filtered_res, header_arr, global_chk_flag){
    global_apply_taxonomy_lst = header_arr;
    global_unq_hashkey_lst  =   []
    var none_cnt    = 1;
	var body_div 		= document.getElementById('display_filter_data_div');
	body_div.innerHTML 	= '';
    if(filtered_res.length == 0)
        return
    var table   = createDom_filter2('table', body_div, {class:'bordered', id:'doc_result_grid',style:"100%"});
    var trh     = createDom_filter2('tr', table, {});
    var th  = createDom_filter2('th', trh, {txt:'Sr No.'});
    if(global_chk_flag){
        var sel_all  = createDom_filter2('input', th, {type:'checkbox'});
        sel_all.onclick = function(){
            if(this.checked == true){
                var all_global_chk   = document.querySelectorAll('[name=global_chk]');
                for(var c = 0; c<all_global_chk.length; c++){
                    all_global_chk[c].checked = true;
                }
            }
            else{
                var all_global_chk   = document.querySelectorAll('[name=global_chk]');
                for(var c = 0; c<all_global_chk.length; c++){
                    all_global_chk[c].checked = false;
                }
            }
        }
    }
    var th  = createDom_filter2('th', trh, {txt:'Full Text'})
    for(var x = 0; x<header_arr.length; x++ ){
        var taxo_id  = header_arr[x].split('~')[0];
        if(taxo_id == '0')
            var th   = createDom_filter2('th', trh, {txt:'Other '+ (none_cnt++)});
        else
            var th   = createDom_filter2('th', trh, {txt:global_taxonomy_details[taxo_id]});
    }

    filtered_res.forEach(function(val, ind){
        var unq_key = val['unq_key'];
        var full_text   = val['full_text'];
        //alert(val['rulehash']);
        if(val['rulehash']){
               global_unq_hashkey_lst.push(unq_key+':@@:'+val['rulehash']);
        }
        var taxo_wise_res = val['col_ar'];
        var col_ar_st_end = val['col_ar_st_end'];
        var tr  = createDom_filter2('tr', table, {unq_key:unq_key, col_ar_st_end:col_ar_st_end});
        var td   = createDom_filter2('td', tr, {txt:ind+1, style:'width:8%;text-align:center;'});
        if(global_chk_flag){
            tr.setAttribute('hash_key', val['rulehash']);
            var inp  = createDom_filter2('input', td, {type:'checkbox',name:'global_chk'});
            if(val['select_flag'] == 1){
                inp.checked = true;
            }
        }
        if(val['done_flag'] == 1){
                tr.setAttribute('style','background:#c7e3ff;filter:alpha(opacity=50);-moz-opacity:0.5;');
        }else if(val['done_flag'] == 2){
                tr.setAttribute('style','background:#c7e3ff;filter:alpha(opacity=50);-moz-opacity:0.5;');
        }	
        
        var td   = createDom_filter2('td', tr, {txt:full_text, style:'width:21%;'});
        var each_td_width   = 71/(header_arr.length);
        for(var x = 0;x<header_arr.length; x++){
            if(!taxo_wise_res[x])
                var td  = createDom_filter2('td', tr, {txt:'-'});
            else{
                var taxo_id_name_arr = taxo_wise_res[x].split(':|:');
                var td  = createDom_filter2('td', tr, {txt:taxo_id_name_arr[0], taxo_id:taxo_id_name_arr[1], style:'width:'+each_td_width+'%'});
            }
        }
         
    }); 
    body_div.scrollTop =  0;
/*    var indiv_arr = [trh]; 
    trh.scrollIntoView(); 
    create_indiv(indiv_arr, table); 
    assign_fn(table, indiv_arr); 
    scroll_head(table, indiv_arr);     
*/

}


/*****************************************************************************************************************************************************/
getAllTaxo_ids_Names_Ajax	 = function(){
	var json = {'taxo_id':57, 'flag':9};
	alert(vurl_path+"/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	console.log(vurl_path+"/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	Logger(vurl_path+"/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
	taxonomy_id_val = retJ;
    taxonomy_id_val.forEach(function(val, ind){
        global_taxo_id_color_dict[val['taxo_id_key']]  =  val['color']      
        global_taxonomy_details[val['taxo_id_key']]  = val['taxo_id_name']
    });
}

/*****************************************************************************************************************************************************/
fillTaxonomySelect	 = function(select_div){
	var option = createDom_filter2('option', select_div,  {txt:'select', taxo_id:-1});
	var option	= createDom_filter2('option', select_div, {txt:'none', taxo_id:0, style:'font-size:13px;'});
	taxonomy_id_val.forEach(function(val, ind){
		var option = createDom_filter2('option', select_div, {txt:val['taxo_id_name'], taxo_id:val['taxo_id_key'], style:'font-size:13px;'});
	});
}


/*****************************************************************************************************************************************************/
submitSpanIdsForFilteredDataAjax	 = function(all_spans_arr, uni_key){
    document.getElementById('select_taxonomy_div').style.display = 'none';
    var manual_flag  = 0
    var doc_id  = TASApp.SubUnits.doc_id; 
    if(document.getElementById('manual_chk')){
        var manual_status = document.getElementById('manual_chk').checked;
        if(manual_status)
            manual_flag = 1;
    }
    if(global_cur_tab){
        if((global_cur_tab.id == 'preview_all_done')|| (global_cur_tab.id == 'preview_all_remainder')){
            manual_flag = 1;
            doc_id = uni_key.split(':TASHASH:')[2];
        }
    }
    var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'doc_id_str':doc_id, 'col_data_ar':all_spans_arr,'myunq_key':uni_key,'apply_preview_flag':0, 'manual_flag':manual_flag,  'flag':4 };
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);

    if(typeof retJ == 'object'){
	        return retJ
    }else{
//        alert(retJ)
    }        
}
/*****************************************************************************************************************************************************/
function applyGlobalAjax()
{
    var uni_key	= global_cur_tr.getAttribute('uni_key');
    document.getElementById('select_taxonomy_div').style.display = 'none';
    var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'col_data_ar':all_apply_info,'myunq_key':uni_key,'apply_preview_flag':2, 'flag':4 };
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    if(typeof retJ != 'object'){
//	    alert(retJ)
        return;
    }
    var filtered_res = retJ;
	var body_div 		= document.getElementById('display_filter_data_div');
	body_div.innerHTML 	= '';
    var table   = createDom_filter2('table', body_div, {class:'bordered', id:'doc_result_grid'});
    var header_len   = global_all_sel_taxonomy_lst.length
    var trh     = createDom_filter2('tr', table, {});
    var th  = createDom_filter2('th', trh, {txt:'Sl No.'});
    var th  = createDom_filter2('th', trh, {txt:'Full Text'})
    for(var x = 0; x<header_len; x++ ){
        var th   = createDom_filter2('th', trh, {txt:global_all_sel_taxonomy_lst[x]});
    }

    filtered_res.forEach(function(val, ind){
        var unq_key = val['unq_key'];
        var full_text   = val['full_text'];
        var taxo_wise_res = val['col_ar'];
        var col_ar_st_end = val['col_ar_st_end'];
        var tr  = createDom_filter2('tr', table, {unq_key:unq_key, col_ar_st_end:col_ar_st_end});
        var td   = createDom_filter2('td', tr, {txt:ind+1, style:'width:4%;text-align:center;'});
        var td   = createDom_filter2('td', tr, {txt:full_text, style:'width:22%;'});
        var each_td_width   = 74/header_len;
        taxo_wise_res.forEach(function(col_val, col_ind){
             var taxo_id_name_arr = col_val.split(':|:');
             var td  = createDom_filter2('td', tr, {txt:taxo_id_name_arr[0], taxo_id:taxo_id_name_arr[1], style:'width:'+each_td_width+'%'});
            
        });
         
    }); 
    var indiv_arr = [trh]; 
/*  trh.scrollIntoView(); 
    create_indiv(indiv_arr, table); 
    assign_fn(table, indiv_arr); 
    scroll_head(table, indiv_arr);     
*/
}
/*****************************************************************************************************************************************************/
highlightSpansOnColors	 = function(final_colored_span_res_arr){
    if(!final_colored_span_res_arr){
        return
    }
    var colored_span_res_arr = final_colored_span_res_arr[0]
    if(colored_span_res_arr.length != 0){
        for(var x = 0; x<colored_span_res_arr.length; x++){
	        var span_info = colored_span_res_arr[x]
	        for (var uni_que in span_info){
                var taxo_id = span_info[uni_que][1];
		        var colored_spans_arr = span_info[uni_que][0].split('~');
                if(colored_spans_arr.length != 0){
		            colored_spans_arr.forEach(function(val, ind){
			            var span = $$(val)
                        if(span){
                            if(taxo_id != '0'){
			                    span.style.background = global_taxo_id_color_dict[taxo_id];
                                span.style.color = '#fff';
                            }
                            else{
			                    span.style.background = '#9A481C';
                                span.style.color = '#fff';
                            }
                        }
                    });
                }
		    }
	    }
    }
}

/*****************************************************************************************************************************************************/
createTableForFilter = function(parentDomEle, final_data_html_res){
	parentDomEle.innerHTML = '';
	var mouseDownFlg = 0;
	var span_json 	 = {};
    var span_json_str = '';
	var table	 = createDom_filter2('table', parentDomEle, {class:'bordered', id:'doc_content_grid'});
	var trh		 = createDom_filter2('tr', table, {});
	var table_header_lst 	= ['Sr No.', 'Content'];
	table_header_lst.forEach(function(val, ind){
		var th		= createDom_filter2('th', trh, {txt:val});
	});
    //var states_res   = final_data_html_res[3];
    //document.getElementById('local_states_div').innerHTML    = '';
    //document.getElementById('local_states_div').textContent = '[ '+states_res+' ]';
    data_html_res   = final_data_html_res[0]
	data_html_res.forEach(function(val, ind){
		var tr 		= createDom_filter2('tr', table, {uni_key:val['myunq_key']});
		var td 		= createDom_filter2('td', tr, {txt:ind+1, style:'text-align:center;width:6%;height:50%;'});
		var radio	= createDom_filter2('input', td, {type:'radio', name:'selected_tr_radio', style:'cursor:pointer;'});
		var td		= createDom_filter2('td', tr, {});
		td.innerHTML 	= val['html_text']
        var span_color_info = val['span_ar_dict'];
        if(span_color_info){
            for (var taxo_id in span_color_info){
                var color_code = global_taxo_id_color_dict[taxo_id];
                var all_spans = span_color_info[taxo_id];
                all_spans.forEach(function(each_span){
                    if(taxo_id == 0){
                        document.getElementById(each_span).style.background = '#9A481C';
                        document.getElementById(each_span).style.color = '#fff';
                    }
                    else{
                        document.getElementById(each_span).style.background = color_code;
                        document.getElementById(each_span).style.color = '#fff';
                    }
                    
                });
            }
        }
        if(val['done_flag'] == 0){
            tr.setAttribute('done_flag', val['done_flag']);
        }
        if(val['done_flag'] == 1){
            tr.setAttribute('style','background:#c7e3ff;filter:alpha(opacity=50);-moz-opacity:0.5;');
            tr.setAttribute('done_flag', val['done_flag']);
            //radio.disabled = true;
        }	
        if(val['done_flag'] == 2){
            tr.setAttribute('style','background:#D7D7D7;filter:alpha(opacity=50);-moz-opacity:0.5;');
            tr.setAttribute('done_flag', val['done_flag']);
            //radio.disabled = true;
        }	
	});

	table.onmousedown = function(event){
        select_div   = document.getElementById('select_taxonomy_div').style.display = 'none';
		var target 	= event.target;

		if(target.nodeName == 'INPUT'){
			target.checked = true;
            all_apply_info = []
            global_all_sel_taxonomy_lst = []
            if(global_cur_tr){
                global_cur_tr.style.fontSize 	= '12px';   
                global_cur_tr.childNodes[1].style.height = '';
                var done_res = global_cur_tr.getAttribute('done_flag');
                if(done_res == 0)
                    global_cur_tr.style.background 	=  '';
                else if(done_res == 1)
                    global_cur_tr.style.background 	=  '#c7e3ff';
                else if(done_res == 2)
                    global_cur_tr.style.background 	=  '#D7D7D7';
            }
			var curr_tr 		= target.parentNode.parentNode;
            global_cur_tr 		= curr_tr;
            curr_tr.style.background = '#3399CC';
            curr_tr.style.fontSize 	= '22px';
            curr_tr.childNodes[1].style.height = '80px';
            if(curr_tr.getAttribute('done_flag')!= 0){
                span_ar = curr_tr.cells[1].querySelectorAll('span'); 
                for(var s = 0; s<span_ar.length; s++ ){
                    span_ar[s].style.background = '';
                    span_ar[s].style.color = '#000';
                }
            }   	
			mouseDownFlg 		= 0;
			return
		}

        TASApp.SubUnits.global_tr_on_mouse_move = target.parentNode.parentNode;
		mouseDownFlg 	= 1;
		span_json 	=  {};
        span_json_str = '';
	}

	table.onmouseup = function(){
        if(span_json_str){
            var span_json_str_ar = span_json_str.split('~');
            var start_ind = parseInt(span_json_str_ar[0].split('_')[1]);
            var end_ind = span_json_str_ar[span_json_str_ar.length-2];
            var end_ind_cnt = parseInt(end_ind.split('_')[1]);
            var cont_id = end_ind.split('_')[0];
            if (end_ind_cnt < start_ind)
            {
                alert('SELECTION ERROR');
                return;
            }
        }
        span_json = {};
        for (cnt=start_ind;cnt<=end_ind_cnt;cnt++)
        {
            span_json[cont_id+'_'+cnt.toString()] = '';
        }
		mouseDownFlg 	= 0;
        span_details  = {};
        //alert(JSON.stringify(span_json));
		if(Object.keys(span_json).length != 0 ){
			var span_ids = Object.keys(span_json)
            span_details['span_ids'] = span_ids;
            var rect = $$(span_ids[span_ids.length-1]).getBoundingClientRect();
            var x   = rect.left;
            var y   = rect.top;
            var h = rect.bottom - rect.top;
            var select_div =  document.getElementById('select_taxonomy_div');
            var radio_status = TASApp.SubUnits.global_tr_on_mouse_move.cells[0].childNodes[1];
            if(radio_status.checked == true){
                select_div.style.display = 'block';
                select_div.style.left   = x-130;
                select_div.style.top   = y+h;
                select_div.innerHTML    = '';
                var table    = createDom_filter2('table', select_div, {class:'bordered'});  
                var trh  = createDom_filter2('tr', table, {});
                var th  = createDom_filter2('th', trh, {txt:'No'});
                var th  = createDom_filter2('th', trh, {txt:'Taxonomy Name'});
                var tr  = createDom_filter2('tr', table, {});
                fillTaxonomySelect_table(table); 
            }
		}
		span_json 	= {};
        span_json_str = '';
	}

	table.onmousemove = function(event){
		if(mouseDownFlg != 1)
			return;
		var target	= event.target;
                if(target.nodeName.toLowerCase() == 'span')
			span_json[target.getAttribute('id')] = target.textContent;
            span_json_str += target.getAttribute('id')+'~';
	}
    change_sub_menu(document.getElementById('local_apply_div'));
    displayPreviewResults(final_data_html_res[1], final_data_html_res[2], 0, final_data_html_res[3])
}

/*****************************************************************************************************************************************************/
fillTaxonomySelect_table     = function(table){
    var tr  = createDom_filter2('tr', table, {id:'taxo_1', onclick:'taxo_click('+1+')'})
    var td  = createDom_filter2('td', tr, {txt:1});
    var td  = createDom_filter2('td', tr, {txt:'None ', color:'black'});
    global_taxo_is_name_dict[1] = ('None') + ":@:0:@:black";
	taxonomy_id_val.forEach(function(val, ind){
        global_taxo_is_name_dict[ind+2] = val['taxo_id_name'] + ":@:"+ val['taxo_id_key'] + ":@:"+ val['color'];
        var tr  = createDom_filter2('tr', table, {id:'taxo_'+(ind+2).toString(), onclick:'taxo_click('+(ind+2)+')'})
		var td  = createDom_filter2('td', tr, {txt:ind+2});
		var td  = createDom_filter2('td', tr, {txt:val['taxo_id_name'], taxo_id:val['taxo_id_key'], color:val['color']});
	});
    var cancel_char = 'X';
    var tr  = createDom_filter2('tr', table, {id:'taxo_0', onclick:'taxo_click("'+cancel_char+'")'})
    var td  = createDom_filter2('td', tr, {txt:cancel_char});
    var td  = createDom_filter2('td', tr, {txt:'Cancel'});
    global_taxo_is_name_dict[cancel_char] = ('Cancel') + ":@:0:@:#CCCCCC";
}
/*****************************************************************************************************************************************************/
function taxo_click(pressed_char)
{
    if (pressed_char == 'x' || pressed_char == 'X')
    {
	    var taxo_div 		= $$('select_taxonomy_div');
	    taxo_div.innerHTML 	= '';
        return;
    }

    /*var ktaxo_row_id_ar = Object.keys(global_taxo_is_name_dict);
    for (var i=0;i<ktaxo_row_id_ar.length;i++)
    {
        var krow_id = ktaxo_row_id_ar[i];
        document.getElementById('taxo_'+krow_id.toString()).style.backgroundColor = '#ffffff';
    }
    document.getElementById('taxo_'+pressed_char.toString()).style.backgroundColor = '#BBBFFC';*/
    var taxo_id = global_taxo_is_name_dict[pressed_char].split(':@:')[1];
    global_selected_taxo_id = taxo_id
    vcol_taxo_ids.push(taxo_id);
    var taxo_name = '';
    if (global_taxo_is_name_dict[pressed_char].split(':@:')[0] == 'None')
    {
        global_other_count = global_other_count + 1;
        taxo_name = 'Other ' + global_other_count.toString();
    }
    else
    {
        taxo_name = global_taxo_is_name_dict[pressed_char].split(':@:')[0];
    }
    global_all_sel_taxonomy_lst.push(taxo_name);
    span_details['taxo_id'] = taxo_id;
    all_apply_info.push(span_details);
    // Clear all the previos color
    cleared_old_selection_grid_color();
    getAppliedColorResults(all_apply_info);
    //getPreviewResults(all_apply_info);
    if(global_cur_tab){
        if((global_cur_tab.id == 'preview_all_done')||(global_cur_tab.id == 'preview_all_remainder'))
            getPreviewResults(all_apply_info);
    } 
    else
        document.getElementById('local_apply_div').click();
}
/*****************************************************************************************************************************************************/
window.addEventListener("keydown", checkKeyPressed, false);

function checkKeyPressed(e) {
    var pressed_char = (String.fromCharCode(e.keyCode));
    if (pressed_char == 'x' || pressed_char == 'X')
    {
	    var taxo_div 		= document.getElementById('select_taxonomy_div');
	    taxo_div.innerHTML 	= '';
        return;
    }

    var ktaxo_row_id_ar = Object.keys(global_taxo_is_name_dict);
    /*for (var i=0;i<ktaxo_row_id_ar.length;i++)
    {
        var krow_id = ktaxo_row_id_ar[i];
        document.getElementById('taxo_'+krow_id.toString()).style.backgroundColor = '#ffffff';
    }
    document.getElementById('taxo_'+pressed_char.toString()).style.backgroundColor = '#BBBFFC';*/
    //alert('pressed_char:'+pressed_char+ ':'+ JSON.stringify(global_taxo_is_name_dict))
    var taxo_id = global_taxo_is_name_dict[pressed_char].split(':@:')[1]
    global_selected_taxo_id = taxo_id
    vcol_taxo_ids.push(taxo_id);
    var taxo_name = '';
    if (global_taxo_is_name_dict[pressed_char].split(':@:')[0] == 'None')
    {
        global_other_count = global_other_count + 1;
        taxo_name = 'Other ' + global_other_count.toString();
    }
    else
    {
        taxo_name = global_taxo_is_name_dict[pressed_char].split(':@:')[0];
    }
    global_all_sel_taxonomy_lst.push(taxo_name);
    span_details['taxo_id'] = taxo_id;
    all_apply_info.push(span_details);
    // Clear all the previos color
    cleared_old_selection_grid_color();
    getAppliedColorResults(all_apply_info);
    //getPreviewResults(all_apply_info);
    if(global_cur_tab){
        if((global_cur_tab.id == 'preview_all_done') ||(global_cur_tab.id == 'preview_all_remainder'))
            getPreviewResults(all_apply_info); 
    }
    else
        document.getElementById('local_apply_div').click();
}
/*****************************************************************************************************************************************************/
function cleared_old_selection_grid_color()
{
    //doc_content_grid
    var table_obj = document.getElementById('doc_content_grid');
    for (var i=1;i<table_obj.rows.length;i++)
    {
        var row_obj = table_obj.rows[i];
        for (var j=1;j<row_obj.cells.length;j++)
        {
            var all_span_obj = row_obj.cells[j].getElementsByTagName('span');
            for (var k=0;k<all_span_obj.length;k++)
            {
                var span = $$(all_span_obj[k].id);
                if (span.parentNode.parentNode.style.backgroundColor == 'rgb(51, 153, 204)')
                {
                    span.style.backgroundColor = 'rgb(51, 153, 204)';
                }
                else
                {
                    span.style.backgroundColor = '#ffffff';
                }
                span.style.color = '#000000';
            }
        }
    }
}
/*****************************************************************************************************************************************************/
getAllSpanIdsColumnWise	= function(){
	var span_ids_arr = []
	var all_filtered_tds	= document.querySelectorAll('[name=filtered_td]');
	var table	= all_filtered_tds[0].parentNode.parentNode;
	for(var x = 0; x<all_filtered_tds.length; x++){
		 var span_ids_str = ''
		 if(all_filtered_tds[x].textContent.length != 0){
		 	var all_spans = all_filtered_tds[x].querySelectorAll('span');
		 	for(var y = 0; y<all_spans.length; y++){
				span_ids_str += all_spans[y].getAttribute('id') + '~'
			}
		}
		else
			continue;

		var cell_index = all_filtered_tds[x].cellIndex;
		var select_taxo = table.rows[1].cells[cell_index].childNodes[0];
		var taxo_id = select_taxo.options[select_taxo.selectedIndex].getAttribute('taxo_id');

		span_ids_str += taxo_id;
		span_ids_arr.push(span_ids_str);
	}
	return span_ids_arr
}

/*****************************************************************************************************************************************************/
function SaveFilterResults(ele)
{
    change_cur_tab(ele);
    var all_deleted_res = []
    var all_accepted_res = []
    //var kdata_ar = [];
    //var table_obj = document.getElementById('doc_result_grid');
    /*for (var i=1;i<table_obj.rows.length;i++)
    {
        var row_obj = table_obj.rows[i];
        kdata_ar.push({'unq_key':row_obj.getAttribute('unq_key'), 'col_ar_st_end':row_obj.getAttribute('col_ar_st_end'), 'taxo_id_str':vcol_taxo_ids.join('~')});
    }*/
	//var json = {'agent_id':5, 'mgmt_id':1, 'user_id':21, 'taxo_id':57,'data_dict_ar':kdata_ar,'flag':5};
	var all_res_tds = document.querySelectorAll('[name=global_chk]');
    for(var x = 0; x<all_res_tds.length; x++){
        var hash_key = all_res_tds[x].parentNode.parentNode.getAttribute('hash_key');
        var unq_key = all_res_tds[x].parentNode.parentNode.getAttribute('unq_key');
        if(all_res_tds[x].checked == true){
            all_accepted_res.push({'hash_key':hash_key, 'unq_key':unq_key});
        }
        else{
            all_deleted_res.push({'hash_key':hash_key, 'unq_key':unq_key});
        }
    
    }
    //alert(all_accepted_res.length +' : ' + all_deleted_res.length);
    //return
    var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'doc_id_str':TASApp.SubUnits.doc_id,'all_accepted_res':all_accepted_res, 'all_deleted_res':all_deleted_res,  'flag':5 };
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    if(retJ != 'DONE'){
	    alert (retJ);
    }else{
        alert(retJ)
        parent.switch_sidebar_tabs(4);
    }
}

/*****************************************************************************************************************************************************/
saveAllTrained   = function(ele){
    change_cur_tab(ele);
    var all_deleted_res = []
    var all_accepted_res = []
    var all_res_tds = document.querySelectorAll('[name=global_chk]');
    for(var x = 0; x<all_res_tds.length; x++){
        var hash_key = all_res_tds[x].parentNode.parentNode.getAttribute('hash_key');
        var unq_key = all_res_tds[x].parentNode.parentNode.getAttribute('unq_key');
        if(all_res_tds[x].checked == true){
            all_accepted_res.push({'hash_key':hash_key, 'unq_key':unq_key});
        }
        else{
            all_deleted_res.push({'hash_key':hash_key, 'unq_key':unq_key});
        }
    
    }
    var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'doc_id_str':TASApp.SubUnits.doc_id,'all_accepted_res':all_accepted_res, 'all_deleted_res':all_deleted_res,  'flag':5 };
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?input_str="+JSON.stringify(json));
	var retJ            = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_train_f2_data.py?", json, 'POST', false);
    if(retJ != 'DONE'){
	    alert (retJ);
    }else{
        alert(retJ)
        parent.switch_sidebar_tabs(4);
    }
}
/*****************************************************************************************************************************************************/
function getQuerystring(key, default_)
{
        if (default_==null) default_="";
        key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
        var qs = regex.exec(window.location.href);
        if(qs == null)
                return default_;
        else
                return qs[1];
}

/*****************************************************************************************************************************************************/
change_cur_tab  = function(ele){
    if(global_cur_tab){
            global_cur_tab.style.color = '#fff';
    }
    global_cur_tab = ele;
    ele.style.color = 'blue';
}

/*****************************************************************************************************************************************************/

filter2Settings = function(){
    var setting_div  =  document.getElementById('f2_setting_div');
    if(setting_div.style.display == 'none'){
        setting_div.style.display = 'block';
        document.getElementById('change_taxonomy_setting_div').click(); 
    } 
    else
        setting_div.style.display = 'none'; 

}

/*****************************************************************************************************************************************************/
change_taxonomy_setting =   function(ele){
    change_Setting_menu(ele);
    var setting_content_div  = document.getElementById('f2_setting_content_div');
    setting_content_div.innerHTML    = '';
    if(Object.keys(global_taxonomy_details).length  == 0)
            return;
    global_setting_selected_taxonomy_headers = []
    highlightSettingHeaders(global_setting_selected_taxonomy_headers);
    var table    = createDom_filter2('table', setting_content_div, {class:'bordered', id:'setting_content_table'});
    global_apply_taxonomy_lst.forEach(function(val, ind){
        var tr      =  createDom_filter2('tr', table, {});
        var td      =  createDom_filter2('td', tr, {txt:ind+1, style:'width:9%;text-align:center;', conf_taxo_id:val.split('~')[1]});
        var td      =  createDom_filter2('td', tr, {style:'width:9%;text-align:center;'});
        var chk     = createDom_filter2('input',td, {type:'checkbox'});
        chk.onclick = function(){
                 var taxo_index  = this.parentNode.parentNode.cells[0].textContent;
                if(this.checked  == true)
                    global_setting_selected_taxonomy_headers.push(taxo_index);

                else{
                    var index = global_setting_selected_taxonomy_headers.indexOf(taxo_index);
                    if(index!=-1)
                        global_setting_selected_taxonomy_headers.splice(index, 1);
                    
                }
                highlightSettingHeaders(global_setting_selected_taxonomy_headers);

        }
        var td      = createDom_filter2('td', tr, {});
        create_taxonomy_options(val.split('~')[0], td);
    });  
}

/*****************************************************************************************************************************************************/
getDublicate =   function(ele){
    change_Setting_menu(ele);
    var setting_content_div  = document.getElementById('f2_setting_content_div');
    setting_content_div.innerHTML    = '';
    if(Object.keys(global_taxonomy_details).length  == 0)
            return;
    global_setting_selected_taxonomy_headers = []
    highlightSettingHeaders(global_setting_selected_taxonomy_headers);
    global_taxonomy_details['0'] = 'None';
    var table    = createDom_filter2('table', setting_content_div, {class:'bordered', id:'setting_duplicate_table'});
    global_apply_taxonomy_lst.forEach(function(val, ind){
        var taxo_id = val.split('~')[0];
        var conf_taxo_id     = val.split('~')[1];
        var tr      =  createDom_filter2('tr', table, {});
        var td      =  createDom_filter2('td', tr, {txt:ind+1, style:'width:9%;text-align:center;', conf_taxo_id:conf_taxo_id});
        var td      = createDom_filter2('td', tr, {txt:global_taxonomy_details[taxo_id], style:'width:31%;'});
        var td      = createDom_filter2('td', tr, {});
        var inp     = createDom_filter2('input', td, {type:'checkbox', style:'width:3%;', name:'chk_duplicate_taxo'});
        inp.onclick  = function(){
                var taxo_index  = this.parentNode.parentNode.cells[0].textContent;
                if(this.checked  == true)
                    global_setting_selected_taxonomy_headers.push(taxo_index);

                else{
                    var index = global_setting_selected_taxonomy_headers.indexOf(taxo_index);
                    if(index!=-1)
                        global_setting_selected_taxonomy_headers.splice(index, 1);
                    
                }
                highlightSettingHeaders(global_setting_selected_taxonomy_headers);
        }
    }); 
}

/*****************************************************************************************************************************************************/
highlightSettingHeaders  =  function(header_arr){
    var table_div    = document.getElementById('doc_result_grid');
    for(var x = 0; x<table_div.rows[0].cells.length; x++){
            table_div.rows[0].cells[x].style.background = '';
    }
    header_arr.forEach(function(val, ind){
        var index    = parseInt(val)+1
        table_div.rows[0].cells[index].style.background = 'gray';
        
    });
}
/*****************************************************************************************************************************************************/
applyMergeOnSelectedTaxonomy  =   function(ele){
    change_Setting_menu(ele);
    var setting_content_div  = document.getElementById('f2_setting_content_div');
    setting_content_div.innerHTML    = '';
    if(Object.keys(global_taxonomy_details).length  == 0)
            return;
    global_setting_selected_taxonomy_headers = []
    highlightSettingHeaders(global_setting_selected_taxonomy_headers);
    global_taxonomy_details['0'] = 'None';
    var table_div    = createDom_filter2('div', setting_content_div, {style:'float:left;width:50%;height:100%;overflow:auto;'})
    var merge_delim_div    = createDom_filter2('div', setting_content_div, {style:'float:left;width:50%;height:100%;margin-top:10px;'})
    var table    = createDom_filter2('table', table_div, {class:'bordered', id:'setting_duplicate_table'});
    global_apply_taxonomy_lst.forEach(function(val, ind){
        var taxo_id = val.split('~')[0];
        var conf_taxo_id     = val.split('~')[1];
        var tr      =  createDom_filter2('tr', table, {});
        var td      =  createDom_filter2('td', tr, {txt:ind+1, style:'width:3.2%;text-align:center;', conf_taxo_id:conf_taxo_id});
        var td      = createDom_filter2('td', tr, {txt:global_taxonomy_details[taxo_id], style:'width:12%;'});
        var td      = createDom_filter2('td', tr, {style:'width:3%'});
        var inp     = createDom_filter2('input', td, {type:'checkbox', style:'width:3%;', name:'chk_merge_taxo'});
        inp.onclick  = function(){
                var taxo_index  = this.parentNode.parentNode.cells[0].textContent;
                if(this.checked  == true)
                    global_setting_selected_taxonomy_headers.push(taxo_index);

                else{
                    var index = global_setting_selected_taxonomy_headers.indexOf(taxo_index);
                    if(index!=-1)
                        global_setting_selected_taxonomy_headers.splice(index, 1);
                    
                }
                highlightSettingHeaders(global_setting_selected_taxonomy_headers);
        }

    });
    var merge_label =  createDom_filter2('label', merge_delim_div, {txt:'Merge Delimeter: ', style:'margin-left:10px;font-weight:bold;'}); 
    var merge_delim =  createDom_filter2('input', merge_delim_div, {type:'textbox', style:'width:30%;', id:'merge_delimeter_input'}); 

}

/*****************************************************************************************************************************************************/
applySplitOnSelectedTaxonomy =   function(ele){
    change_Setting_menu(ele);
    var setting_content_div  = document.getElementById('f2_setting_content_div');
    setting_content_div.innerHTML    = '';
    if(Object.keys(global_taxonomy_details).length  == 0)
            return;
    global_setting_selected_taxonomy_headers = []
    highlightSettingHeaders(global_setting_selected_taxonomy_headers);
    global_taxonomy_details['0'] = 'None';
    var table_div    = createDom_filter2('div', setting_content_div, {style:'float:left;width:50%;height:100%;overflow:auto;'})
    var split_delim_div    = createDom_filter2('div', setting_content_div, {style:'float:left;width:50%;margin-top:10px;height:100%;'})
    var table    = createDom_filter2('table', table_div, {class:'bordered', id:'setting_duplicate_table'});
    global_apply_taxonomy_lst.forEach(function(val, ind){
        var taxo_id = val.split('~')[0];
        var conf_taxo_id     = val.split('~')[1];
        var tr      =  createDom_filter2('tr', table, {});
        var td      =  createDom_filter2('td', tr, {txt:ind+1, style:'width:3.2%;text-align:center;', conf_taxo_id:conf_taxo_id});
        var td      = createDom_filter2('td', tr, {txt:global_taxonomy_details[taxo_id], style:'width:12%;'});
        var td      = createDom_filter2('td', tr, {style:'width:3%'});
        var inp     = createDom_filter2('input', td, {type:'checkbox', style:'width:3%;', name:'chk_split_taxo'});
        inp.onclick  = function(){
                var taxo_index  = this.parentNode.parentNode.cells[0].textContent;
                if(this.checked  == true)
                    global_setting_selected_taxonomy_headers.push(taxo_index);

                else{
                    var index = global_setting_selected_taxonomy_headers.indexOf(taxo_index);
                    if(index!=-1)
                        global_setting_selected_taxonomy_headers.splice(index, 1);
                    
                }
                highlightSettingHeaders(global_setting_selected_taxonomy_headers);
        }

    });
    var split_label =  createDom_filter2('label', split_delim_div, {txt:'Split Delimeter: ', style:'margin-left:10px;font-weight:bold;'}); 
    var split_delim =  createDom_filter2('input', split_delim_div, {type:'textbox', style:'width:30%;', id:'split_delimeter_input'}); 

}

/*****************************************************************************************************************************************************/
applyFilterOnSelectedTaxonomy    = function(ele){
    change_Setting_menu(ele);
    var setting_content_div  = document.getElementById('f2_setting_content_div');
    setting_content_div.innerHTML    = '';
    if(Object.keys(global_taxonomy_details).length  == 0)
            return;
    global_setting_selected_taxonomy_headers = []
    highlightSettingHeaders(global_setting_selected_taxonomy_headers);
    var json = {"taxo_id":TASApp.SubUnits.taxo_id, 'flag':13 };
    //alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
    var entity_headers_info  = retJ;
    global_taxonomy_details['0'] = 'None';
    var table_div    = createDom_filter2('div', setting_content_div, {style:'float:left;width:73%;height:100%;overflow:auto;'})
    var table    = createDom_filter2('table', table_div, {class:'bordered', id:'setting_filter_table'});
    global_apply_taxonomy_lst.forEach(function(val, ind){
        var taxo_id = val.split('~')[0];
        var conf_taxo_id     = val.split('~')[1];
        var tr      =  createDom_filter2('tr', table, {});
        var td      =  createDom_filter2('td', tr, {txt:ind+1, style:'width:20%;text-align:center;', conf_taxo_id:conf_taxo_id});
        var td      = createDom_filter2('td', tr, {txt:global_taxonomy_details[taxo_id], style:'width:58%;'});
        var td      = createDom_filter2('td', tr, {style:'width:12%;text-align:center;'});
        var inp     = createDom_filter2('input', td, {type:'checkbox', name:'check_filter_taxo'});
        inp.onclick  = function(){
                var taxo_index  = this.parentNode.parentNode.cells[0].textContent;
                if(this.checked  == true)
                    global_setting_selected_taxonomy_headers.push(taxo_index);

                else{
                    var index = global_setting_selected_taxonomy_headers.indexOf(taxo_index);
                    if(index!=-1)
                        global_setting_selected_taxonomy_headers.splice(index, 1);
                    
                }
                highlightSettingHeaders(global_setting_selected_taxonomy_headers);
        }

        var td       = createDom_filter2('td', tr, {});
        var select   = createDom_filter2('select', td, {});
        var options_json   = {'None':'none', '4 Digit No':'4DIGIT','1 Word':'1WORD', 'Null':'TASNULL', 'Not Null':'TASNOTNULL', 'Ends With Number':'TASENDNO', 'Starts With Number':'TASSTARTNO'};
        for(var option_ele in options_json){
            var option   = createDom_filter2('option', select, {txt:option_ele, opt_value:options_json[option_ele]});
        }

        var td       = createDom_filter2('td', tr, {});
        var select   = createDom_filter2('select', td, {});
        //var options_json   = {'4 Digit No':'4DIGIT','1 Word':'1WORD', 'Null':'TASNULL', 'Not Null':'TASNOTNULL', 'Ends With Number':'TASENDNO', 'Starts With Number':'TASSTARTNO'};
        var entity_headers = entity_headers_info[0];
        var seq_header  = entity_headers_info[1];
        var option   = createDom_filter2('option', select, {txt:'None', opt_value:'none'});
        for(var x = 0; x<seq_header.length; x++){
            var option   = createDom_filter2('option', select, {txt:entity_headers[seq_header[x]], opt_value:seq_header[x]});
        }
        var td       = createDom_filter2('td', tr, {style:'width:12%;text-align:center;'});
        var chk       = createDom_filter2('input', td, {type:'checkbox'});
        chk.onclick =  function(){
            if(this.checked == true){
                this.parentNode.previousSibling.childNodes[0].style.background ='#FF9999';
                this.parentNode.previousSibling.childNodes[0].style.color ='#fff';
            }
            else{
                this.parentNode.previousSibling.childNodes[0].style.background ='';
                this.parentNode.previousSibling.childNodes[0].style.color ='#000';
            }
        }
    });
}
/*****************************************************************************************************************************************************/
applyFilterOnSelectedTaxonomy_old =   function(ele){
    change_Setting_menu(ele);
    var setting_content_div  = document.getElementById('f2_setting_content_div');
    setting_content_div.innerHTML    = '';
    if(Object.keys(global_taxonomy_details).length  == 0)
            return;
    global_setting_selected_taxonomy_headers = []
    highlightSettingHeaders(global_setting_selected_taxonomy_headers);
    global_taxonomy_details['0'] = 'None';
    var table_div    = createDom_filter2('div', setting_content_div, {style:'float:left;width:50%;height:100%;overflow:auto;'})
    var filter_delim_div    = createDom_filter2('div', setting_content_div, {style:'float:left;width:50%;margin-top:10px;height:100%;'})
    var table    = createDom_filter2('table', table_div, {class:'bordered', id:'setting_filter_table'});
    global_apply_taxonomy_lst.forEach(function(val, ind){
        var tr      =  createDom_filter2('tr', table, {});
        var td      =  createDom_filter2('td', tr, {txt:ind+1, style:'width:20%;text-align:center;'});
        var td      = createDom_filter2('td', tr, {txt:global_taxonomy_details[val], style:'width:58%;'});
        var td      = createDom_filter2('td', tr, {});
        var inp     = createDom_filter2('input', td, {type:'radio', style:'width:3%;', name:'radio_filter_taxo'});
        inp.onchange = function(){
            changeSelectedSettingRadioOption(this);
        }
    });
    var search_label    =  createDom_filter2('label', filter_delim_div, {txt:'Search By: ', style:'margin-left:10px;font-weight:bold;'}); 
    var select          = createDom_filter2('select', filter_delim_div, {id:'filter_select_div', style:'margin-left:10px;margin-top:10px;'});
    var options_json   = {'select':'select',  '4 Digit No':'4DIGIT','1 Word':'1WORD', 'Null':'TASNULL', 'Not Null':'TASNOTNULL', 'Ends With Number':'TASENDNO', 'Starts With Number':'TASSTARTNO'};
    for(var option_ele in options_json){
        var option   = createDom_filter2('option', select, {txt:option_ele, opt_value:options_json[option_ele]});
    }

}

/*****************************************************************************************************************************************************/
deleteColumnOnSelectedTaxonomy   = function(ele){
    change_Setting_menu(ele);
    var setting_content_div  = document.getElementById('f2_setting_content_div');
    setting_content_div.innerHTML    = '';
    if(Object.keys(global_taxonomy_details).length  == 0)
            return;
    global_setting_selected_taxonomy_headers = []
    highlightSettingHeaders(global_setting_selected_taxonomy_headers);
    global_taxonomy_details['0'] = 'None';
    var table    = createDom_filter2('table', setting_content_div, {class:'bordered', id:'setting_deleted_table'});
    global_apply_taxonomy_lst.forEach(function(val, ind){
        var taxo_id = val.split('~')[0];
        var conf_taxo_id     = val.split('~')[1];
        var tr      =  createDom_filter2('tr', table, {});
        var td      =  createDom_filter2('td', tr, {txt:ind+1, style:'width:9%;text-align:center;', conf_taxo_id:conf_taxo_id});
        var td      = createDom_filter2('td', tr, {txt:global_taxonomy_details[taxo_id], style:'width:32%;'});
        var td      = createDom_filter2('td', tr, {});
        var inp     = createDom_filter2('input', td, {type:'checkbox', style:'width:3%;', name:'chk_deleted_taxo'});
        inp.onclick  = function(){
                var taxo_index  = this.parentNode.parentNode.cells[0].textContent;
                if(this.checked  == true)
                    global_setting_selected_taxonomy_headers.push(taxo_index);

                else{
                    var index = global_setting_selected_taxonomy_headers.indexOf(taxo_index);
                    if(index!=-1)
                        global_setting_selected_taxonomy_headers.splice(index, 1);
                    
                }
                highlightSettingHeaders(global_setting_selected_taxonomy_headers);
        }

    }); 
}

/*****************************************************************************************************************************************************/
restoreColumnOnSelectedTaxonomy  = function(ele){
    change_Setting_menu(ele);
    var setting_content_div  = document.getElementById('f2_setting_content_div');
    setting_content_div.innerHTML    = '';
    if(Object.keys(global_taxonomy_details).length  == 0)
            return;
    global_setting_selected_taxonomy_headers = []
    highlightSettingHeaders(global_setting_selected_taxonomy_headers);
    global_taxonomy_details['0'] = 'None';
     var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id, 'flag':11 };
    //alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
    if(typeof retJ != 'object')
        return
    column_header   = retJ;
    var table    = createDom_filter2('table', setting_content_div, {class:'bordered', id:'setting_restore_table'});
    column_header.forEach(function(val, ind){
        var taxo_id = val.split('~')[0];
        var conf_taxo_id     = val.split('~')[1];
        var tr      =  createDom_filter2('tr', table, {});
        var td      =  createDom_filter2('td', tr, {txt:ind+1, style:'width:9%;text-align:center;', conf_taxo_id:conf_taxo_id});
        var td      = createDom_filter2('td', tr, {txt:global_taxonomy_details[taxo_id], style:'width:31%;'});
        var td      = createDom_filter2('td', tr, {});
        var inp     = createDom_filter2('input', td, {type:'checkbox', style:'width:3%;', name:'chk_restored_taxo'});
        inp.onclick  = function(){
                var taxo_index  = this.parentNode.parentNode.cells[0].textContent;
                if(this.checked  == true)
                    global_setting_selected_taxonomy_headers.push(taxo_index);

                else{
                    var index = global_setting_selected_taxonomy_headers.indexOf(taxo_index);
                    if(index!=-1)
                        global_setting_selected_taxonomy_headers.splice(index, 1);
                    
                }
                highlightSettingHeaders(global_setting_selected_taxonomy_headers);
        }

    }); 

}

/*****************************************************************************************************************************************************/
searchColumnOnSelectedTaxonomy   =  function(ele){
    change_Setting_menu(ele);
    var setting_content_div  = document.getElementById('f2_setting_content_div');
    setting_content_div.innerHTML    = '';
    if(Object.keys(global_taxonomy_details).length  == 0)
            return;
    global_setting_selected_taxonomy_headers = []
    highlightSettingHeaders(global_setting_selected_taxonomy_headers);
    global_taxonomy_details['0'] = 'None';
    var table_div    = createDom_filter2('div', setting_content_div, {style:'float:left;width:50%;height:100%;overflow:auto;'})
    var search_delim_div    = createDom_filter2('div', setting_content_div, {style:'float:left;width:50%;height:100%;'})
    var table    = createDom_filter2('table', table_div, {class:'bordered', id:'setting_search_table'});
    global_apply_taxonomy_lst.forEach(function(val, ind){
        var taxo_id = val.split('~')[0];
        var conf_taxo_id     = val.split('~')[1];
        var tr      =  createDom_filter2('tr', table, {});
        var td      =  createDom_filter2('td', tr, {txt:ind+1, style:'width:20%;text-align:center;', conf_taxo_id:conf_taxo_id});
        var td      = createDom_filter2('td', tr, {txt:global_taxonomy_details[taxo_id], style:'width:58%;'});
        var td      = createDom_filter2('td', tr, {});
        var inp     = createDom_filter2('input', td, {type:'radio', style:'width:3%;', name:'radio_search_taxo'});
        inp.onchange = function(){
            changeSelectedSettingRadioOption(this);
        }
    });
    var upper_div       = createDom_filter2('div', search_delim_div, {style:'float:left;width:100%;height:20%;margin-top:10px;'}) 
    var search_label    =  createDom_filter2('label', upper_div, {txt:'Search Text: ', style:'margin-left:10px;font-weight:bold;'}); 
    var split_delim     =  createDom_filter2('input', upper_div, {type:'textbox', style:'width:30%;', id:'search_text_inp'}); 
    var lower_div       = createDom_filter2('div', search_delim_div, {style:'float:left;width:100%;height:20%;'}) 
    var search_type    =  createDom_filter2('label', lower_div, {txt:'Search Type: ', style:'margin-left:10px;font-weight:bold;'});
    var select_type     =  createDom_filter2('select',lower_div, {id:'select_search_type'} );
    var search_options   = {'Select':'select', 'Anywhere':'TASANYWHERE', 'Begin':'TASBEGIN','End':'TASEND', 'Not In':'TASNOTIN'};
    for(var opt in search_options){
        var option  = createDom_filter2('option', select_type, {txt:opt, opt_val:search_options[opt]});
    } 
}

/*****************************************************************************************************************************************************/
searchExtractColumnOnSelectedTaxonomy    = function(ele){
    change_Setting_menu(ele);
    var setting_content_div  = document.getElementById('f2_setting_content_div');
    setting_content_div.innerHTML    = '';
    if(Object.keys(global_taxonomy_details).length  == 0)
            return;
    global_setting_selected_taxonomy_headers = []
    highlightSettingHeaders(global_setting_selected_taxonomy_headers);
    global_taxonomy_details['0'] = 'None';
    var table_div    = createDom_filter2('div', setting_content_div, {style:'float:left;width:50%;height:100%;overflow:auto;'})
    var filter_delim_div    = createDom_filter2('div', setting_content_div, {style:'float:left;width:50%;height:100%;'})
    var table    = createDom_filter2('table', table_div, {class:'bordered', id:'setting_search_extract_table'});
    global_apply_taxonomy_lst.forEach(function(val, ind){
        var taxo_id = val.split('~')[0];
        var conf_taxo_id     = val.split('~')[1];
        var tr      =  createDom_filter2('tr', table, {});
        var td      =  createDom_filter2('td', tr, {txt:ind+1, style:'width:20%;text-align:center;', conf_taxo_id:conf_taxo_id});
        var td      = createDom_filter2('td', tr, {txt:global_taxonomy_details[taxo_id], style:'width:58%;'});
        var td      = createDom_filter2('td', tr, {});
        var inp     = createDom_filter2('input', td, {type:'radio', style:'width:3%;', name:'radio_search_extract_taxo'});
        inp.onchange = function(){
            changeSelectedSettingRadioOption(this);
           // global_Selected_setting_radio_option = this;
            //var index    = this.parentNode.parentNode.cells[0].textContent;
            //var table_div    = document.getElementById('doc_result_grid');
            //table_div.rows[0].cells[index].
        }
    });
    var search_label    =  createDom_filter2('label', filter_delim_div, {txt:'Search & Extract By: ', style:'margin-left:10px;margin-top:10px;font-weight:bold;'}); 
    var select          = createDom_filter2('select', filter_delim_div, {id:'search_extract_select_div', style:'margin-left:10px;margin-top:10px;'});
    var options_json   = {'select':'select',  '4 Digit No':'4DIGIT','2 Digit No':'2DIGIT', '4 Digit Range':'4DIGITRANGE', '2 Digit Range':'2DIGITRANGE', 'Month Range':'MONTHRANGE'};
    for(var option_ele in options_json){
        var option   = createDom_filter2('option', select, {txt:option_ele, opt_value:options_json[option_ele]});
    }

}

/*****************************************************************************************************************************************************/
CleanUpColumnOnSelectedTaxonomy     = function(ele){
    change_Setting_menu(ele);
    var setting_content_div  = document.getElementById('f2_setting_content_div');
    setting_content_div.innerHTML    = '';
    if(Object.keys(global_taxonomy_details).length  == 0)
            return;
    global_setting_selected_taxonomy_headers = []
    highlightSettingHeaders(global_setting_selected_taxonomy_headers);
    global_taxonomy_details['0'] = 'None';
    var table_div    = createDom_filter2('div', setting_content_div, {style:'float:left;width:50%;height:100%;overflow:auto;'})
    var clean_up_div    = createDom_filter2('div', setting_content_div, {style:'float:left;width:50%;height:99%;margin-top:10px;'})
    var table    = createDom_filter2('table', table_div, {class:'bordered', id:'setting_clean_up_table'});
    global_apply_taxonomy_lst.forEach(function(val, ind){
        var taxo_id = val.split('~')[0];
        var conf_taxo_id     = val.split('~')[1];
        var tr      =  createDom_filter2('tr', table, {});
        var td      =  createDom_filter2('td', tr, {txt:ind+1, style:'width:10%;text-align:center;', conf_taxo_id:conf_taxo_id});
        var td      = createDom_filter2('td', tr, {txt:global_taxonomy_details[taxo_id], style:'width:25%;'});
        var td      = createDom_filter2('td', tr, {style:'width:9%;text-align:center;'});
        var inp     = createDom_filter2('input', td, {type:'checkbox', name:'check_clean_up_taxo'});
        inp.onclick  = function(){
                var taxo_index  = this.parentNode.parentNode.cells[0].textContent;
                if(this.checked  == true)
                    global_setting_selected_taxonomy_headers.push(taxo_index);

                else{
                    var index = global_setting_selected_taxonomy_headers.indexOf(taxo_index);
                    if(index!=-1)
                        global_setting_selected_taxonomy_headers.splice(index, 1);
                    
                }
                highlightSettingHeaders(global_setting_selected_taxonomy_headers);
        }

        //var td       = createDom_filter2('td', tr, {style:'width:20%;'});
        //var select   = createDom_filter2('select', td, {});
        
        //var options_json       = {'Comma [,]':'TASCOMMA', 'Colon [:]':'TASCOLON', 'Semicolon [;]':'TASSEMICOLON', 'Exclamatory [!]':'TASEXCLAMATORY', 'Rate [@]':'TASRATE', 'Hash [#]':'TASHASH', 'Dot [.]':'TASDOT', 'Underscore [_]':'TASUNDERSCORE', 'Dollor [$]':'TASDOLLOR', 'Amp [&]':'TASAMP', 'Mod [%]':'TASMOD', 'Cap [^]':'TASCAP', 'Star [*]':'TASSTAR', 'Left parenthesis [(]':'TASLEFPARENTHESIS', 'Right parenthesis [)]':'TASRIGHTPARENTHESIS', 'Minus [-]':'TASMINUS', 'Plus [+]':'TASPLUS', 'Pipe [|]':'TASPIPE'}
        //var options_json       = {'Remove Comma From Start ':'REMCOMMASTART', 'Remove Comma From End':'REMCOMMAEND','Remove Left parenthesis From Start':'REMLEFTPARENTHESISSTART','Remove Left parenthesis From Start':'REMLEFTPARENTHESISEND', 'Remove Right parenthesis From Start':'REMRIGHTPARENTHESISSTART', 'Remove Right parenthesis From End':'REMRIGHTPARENTHESISEND',  'Add Left parenthesis To Start':'ADDLEFTPARENTHESISSTART', 'Add Right parenthesis To End':'ADDRIGHTPARENTHESISEND'}
        //for(var option_ele in options_json){
        //    var option   = createDom_filter2('option', select, {txt:option_ele, opt_value:options_json[option_ele]});
        //}
        
        /*var td       = createDom_filter2('td', tr, {style:'width:18%;'});
        var label     = createDom_filter2('label', td, {txt:'Add'})
        var inp     = createDom_filter2('input', td, {type:'radio',name:'add_remove_radio', value:'add'})
        var label     = createDom_filter2('label', td, {txt:'Remove',style:'margin-left:8px;'})
        var inp     = createDom_filter2('input', td, {type:'radio', name:'add_remove_radio', value:'remove'})
        
        var td       = createDom_filter2('td', tr, {style:'width:18%;'});
        var label     = createDom_filter2('label', td, {txt:'Before'})
        var inp     = createDom_filter2('input', td, {type:'checkbox', value:'before'})
        var label     = createDom_filter2('label', td, {txt:'After',style:'margin-left:8px;'})
        var inp     = createDom_filter2('input', td, {type:'checkbox', value:'after'})
        */
    });
    var label       = createDom_filter2('label', clean_up_div, {txt:'Clean Up Type: ', style:'margin-left:5px;'})
    var select   = createDom_filter2('select', clean_up_div, {id:'clean_up_type_select'});
    var options_json       = {'Remove Comma From Start ':'REMCOMMASTART', 'Remove Comma From End':'REMCOMMAEND','Remove Left parenthesis From Start':'REMLEFTPARENTHESISSTART','Remove Left parenthesis From Start':'REMLEFTPARENTHESISEND', 'Remove Right parenthesis From Start':'REMRIGHTPARENTHESISSTART', 'Remove Right parenthesis From End':'REMRIGHTPARENTHESISEND',  'Add Left parenthesis To Start':'ADDLEFTPARENTHESISSTART', 'Add Right parenthesis To End':'ADDRIGHTPARENTHESISEND'}
    for(var option_ele in options_json){
        var option   = createDom_filter2('option', select, {txt:option_ele, opt_value:options_json[option_ele]});
    }
}

/*****************************************************************************************************************************************************/
changeSelectedSettingRadioOption     =  function(ele){
    if(global_Selected_setting_radio_option_cell)
            global_Selected_setting_radio_option_cell.style.background = '';
    var index    = ele.parentNode.parentNode.cells[0].textContent;
    index    = parseInt(index)+1
    var table_div    = document.getElementById('doc_result_grid');
    global_Selected_setting_radio_option_cell = table_div.rows[0].cells[index];
    table_div.rows[0].cells[index].style.background = 'gray';
    
}
/*****************************************************************************************************************************************************/
resetGlobalApplyResults  = function(){
    var reset_confirm    = confirm('All the edited data will be lost\n Do you still want to continue');
    if(!reset_confirm) 
        return;  
    var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id, 'flag':1 };
    alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
    //alert(retJ)
    if(typeof retJ != 'object' )
        return
    global_unq_hashkey_lst = []
    displayPreviewResults(retJ[0], retJ[1], 1);
    global_cur_setting_tab.click();  

}

/*****************************************************************************************************************************************************/
clearSettingResults  =  function(){
    global_cur_setting_tab.click();
}

/*****************************************************************************************************************************************************/
refreshSettingResults    = function(){
    global_cur_setting_tab.click();
}

/*****************************************************************************************************************************************************/
get_all_setting_selected_taxonomy_lst        = function(){
    var taxo_id_lst = []
    var setting_table    = document.getElementById('setting_content_table');
    var row_len    =  setting_table.rows.length;
    for(var x = 0; x<row_len; x++){ 
        var conf_taxo_id     = setting_table.rows[x].cells[0].getAttribute('conf_taxo_id');
        var sel_ele  =  setting_table.rows[x].cells[2].childNodes[0];
        var taxo_id     = sel_ele.options[sel_ele.selectedIndex].getAttribute('taxo_id');
        taxo_id_lst.push(taxo_id);
    }
    //alert(taxo_id_lst);
    return taxo_id_lst
}

/*****************************************************************************************************************************************************/
getAllTaxoIdForDuplicates    = function(){
    var taxo_index_arr    = []
    var all_tds  = document.querySelectorAll('input[name=chk_duplicate_taxo]:checked');
    for(var x =0; x<all_tds.length; x++){
            var taxo_ind_index  = all_tds[x].parentNode.parentNode.cells[0].getAttribute('conf_taxo_id');
            alert(taxo_ind_index)
            taxo_index_arr.push(taxo_ind_index);
    }
    return taxo_index_arr
}

/*****************************************************************************************************************************************************/
getAllTaxoIdForMerge     = function(){
     var taxo_index_arr    = []
    var all_tds  = document.querySelectorAll('input[name=chk_merge_taxo]:checked');
    for(var x =0; x<all_tds.length; x++){
            var taxo_ind_index  = all_tds[x].parentNode.parentNode.cells[0].getAttribute('conf_taxo_id');
            taxo_index_arr.push(taxo_ind_index);
    }
    return taxo_index_arr

}

/*****************************************************************************************************************************************************/
getAllTaxoIdForSplit     = function(){
     var taxo_index_arr    = []
    var all_tds  = document.querySelectorAll('input[name=chk_split_taxo]:checked');
    for(var x =0; x<all_tds.length; x++){
            var taxo_ind_index  = all_tds[x].parentNode.parentNode.cells[0].getAttribute('conf_taxo_id');
            taxo_index_arr.push(taxo_ind_index);
    }
    return taxo_index_arr

}

/*****************************************************************************************************************************************************/
getAllSettingFilterSelectedRows     = function(){
        var index_type_json = {}
        var sel_check_taxnonomy = document.querySelectorAll('input[name=check_filter_taxo]:checked');
        for(var x = 0; x<sel_check_taxnonomy.length; x++){
            var index   = parseInt(sel_check_taxnonomy[x].parentNode.parentNode.cells[0].getAttribute('conf_taxo_id'));
            var select    = sel_check_taxnonomy[x].parentNode.nextSibling.childNodes[0];
            var type      = select.options[select.selectedIndex].getAttribute('opt_value');
            var entity_select    = sel_check_taxnonomy[x].parentNode.nextSibling.nextSibling.childNodes[0];
            var entity_type      = entity_select.options[entity_select.selectedIndex].getAttribute('opt_value');
            var l_1_status_chk       = sel_check_taxnonomy[x].parentNode.parentNode.cells[5].childNodes[0];   
            if((type == 'none')&&(entity_type == 'none')){
                alert('please give taxonomy first..')
                return {}
            }
            l_1_status_flg = 0
            if(l_1_status_chk.checked == true)
                    l_1_status_flg = 1
            index_type_json[index] = [type, entity_type, l_1_status_flg] 
        }
        return index_type_json; 
}
/*****************************************************************************************************************************************************/
getAllTaxoIdForDeleted   = function(){
    var taxo_index_arr    = []
    var all_tds  = document.querySelectorAll('input[name=chk_deleted_taxo]:checked');
    for(var x =0; x<all_tds.length; x++){
            var taxo_ind_index  = all_tds[x].parentNode.parentNode.cells[0].getAttribute('conf_taxo_id');
            taxo_index_arr.push(taxo_ind_index);
    }
    return taxo_index_arr

}

/*****************************************************************************************************************************************************/
getAllTaxoIdForRestored  = function(){
    var taxo_index_arr    = []
    var all_tds  = document.querySelectorAll('input[name=chk_restored_taxo]:checked');
    for(var x =0; x<all_tds.length; x++){
            var taxo_ind_index  = all_tds[x].parentNode.parentNode.cells[0].getAttribute('conf_taxo_id');
            taxo_index_arr.push(taxo_ind_index);
    }
    return taxo_index_arr
}

/*****************************************************************************************************************************************************/
getCleanUpSettings   = function(){
    var taxo_wise_cleanup_arr = []
    var all_tds  = document.querySelectorAll('input[name=check_clean_up_taxo]:checked');
    for(var x = 0; x<all_tds.length; x++){
            var tr  = all_tds[x].parentNode.parentNode;
            var taxo_index  = tr.cells[0].getAttribute('conf_taxo_id');
            taxo_wise_cleanup_arr.push(taxo_index)
    }
    return taxo_wise_cleanup_arr; 
} 
/*****************************************************************************************************************************************************/
submit_local_setting_results    = function(){
    var tab_id = '0';

    if(global_cur_setting_tab.id == 'change_taxonomy_setting_div')
        tab_id = '1';
    else if(global_cur_setting_tab.id == 'duplicate_setting')
        tab_id = '2';
    else if(global_cur_setting_tab.id == 'merge_setting')
        tab_id = '3';
    else if(global_cur_setting_tab.id == 'split_setting')
        tab_id = '4';
    else if(global_cur_setting_tab.id == 'delete_column_setting')
        tab_id = '5';
    else if(global_cur_setting_tab.id == 'restore_column_setting')
        tab_id = '6';
    else if(global_cur_setting_tab.id == 'search_column_setting')
        tab_id = '7';
    else if(global_cur_setting_tab.id == 'filter_setting')
        tab_id = '8';
    else if(global_cur_setting_tab.id == 'search_extract_column_setting')
        tab_id = '9';
    else if(global_cur_setting_tab.id == 'clean_up_setting')
        tab_id = '10';

    if(tab_id == '1'){
        var taxo_id_lst = get_all_setting_selected_taxonomy_lst();
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'taxo_id_lst':taxo_id_lst, 'global_unq_hashkey_lst':global_unq_hashkey_lst, 'flag':2 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        displayPreviewResults(retJ[0], retJ[1], 1);
    }
    if(tab_id == '2'){
        var taxo_index_arr = getAllTaxoIdForDuplicates();
        if(taxo_index_arr.length == 0){
            alert('please select taxonomy first..');
            return;
        }
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'taxo_id_lst':taxo_index_arr, 'global_unq_hashkey_lst':global_unq_hashkey_lst, 'flag':3 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        displayPreviewResults(retJ[0], retJ[1], 1);
    }
    if(tab_id == '3'){
        var taxo_index_arr = getAllTaxoIdForMerge();
        if(taxo_index_arr.length == 0){
            alert('please select taxonomy first..');
            return;
        }
        var merge_delim = document.getElementById('merge_delimeter_input').value;
        if(merge_delim.trim() == ''){
            alert('please give merge delimeter..');
            return;
        }
        if(merge_delim.trim().indexOf(',') != -1)
            merge_delim = merge_delim.replace(',', 'TASCOMMA')
        if(merge_delim.trim().indexOf('#') != -1 )
               merge_delim = merge_delim.replace('#', 'TASHASH')
        if(merge_delim.trim().indexOf('&') != -1 )
               merge_delim = merge_delim.replace('&', 'TASHAND')
        if(merge_delim.trim().indexOf("'") != -1 )
               merge_delim = merge_delim.replace("'", 'TASSINGLEQUOTE')
        if(merge_delim.trim().indexOf('"') != -1 )
               merge_delim = merge_delim.replace('"', 'TASDOUBLEQUOTE')
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'taxo_id_lst':taxo_index_arr,'merge_element':merge_delim, 'global_unq_hashkey_lst':global_unq_hashkey_lst, 'flag':4 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);
    }
    if(tab_id == '4'){
        var taxo_index_arr = getAllTaxoIdForSplit();
        if(taxo_index_arr.length == 0){
            alert('please select taxonomy first..');
            return;
        }
        var split_delim = document.getElementById('split_delimeter_input').value;
        if(split_delim.trim() == ''){
            alert('please give split delimeter..');
            return;
        }
        if(split_delim.trim().indexOf(',') != -1)
            split_delim = split_delim.replace(',', 'TASCOMMA')
        if(split_delim.trim().indexOf('#') != -1 )
               split_delim = split_delim.replace('#', 'TASHASH')
        if(split_delim.trim().indexOf('&') != -1 )
               split_delim = split_delim.replace('&', 'TASHAND')
        if(split_delim.trim().indexOf("'") != -1 )
               split_delim = split_delim.replace("'", 'TASSINGLEQUOTE')
        if(split_delim.trim().indexOf('"') != -1 )
               split_delim = split_delim.replace('"', 'TASDOUBLEQUOTE')
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'taxo_id_lst':taxo_index_arr,'split_element':split_delim, 'global_unq_hashkey_lst':global_unq_hashkey_lst, 'flag':5 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);
    }
    if(tab_id  == '5'){
        var taxo_index_arr = getAllTaxoIdForDeleted();
        if(taxo_index_arr.length == 0){
            alert('please select taxonomy first..');
            return;
        }
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'taxo_id_lst':taxo_index_arr, 'global_unq_hashkey_lst':global_unq_hashkey_lst, 'flag':6 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);
    }
    if(tab_id  == '6'){
        var taxo_index_arr = getAllTaxoIdForRestored();
        if(taxo_index_arr.length == 0){
            alert('please select taxonomy first..');
            return;
        }
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'taxo_id_lst':taxo_index_arr, 'global_unq_hashkey_lst':global_unq_hashkey_lst, 'flag':7 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);

    }
    if(tab_id  == '7'){
        var sel_radio_taxnonomy = document.querySelector('input[name=radio_search_taxo]:checked');
        if(!sel_radio_taxnonomy){
            alert('please select taxonomy..')
            return
        }
        var select_search_type_ele  = document.getElementById('select_search_type');
        var type_val = select_search_type_ele.options[select_search_type_ele.selectedIndex].getAttribute('opt_val');
        if(type_val == 'select'){
            alert('select search type first..')
            return
        }
        var col_number  = document.querySelector('input[name=radio_search_taxo]:checked').parentNode.parentNode.cells[0].textContent-1;
        var search_ele = document.getElementById('search_text_inp').value;
        if(search_ele.trim() == ''){
            alert('please give search element..');
            return;
        }
        if(search_ele.trim().indexOf(',') != -1)
            search_ele = search_ele.replace(',', 'TASCOMMA')
        if(search_ele.trim().indexOf('#') != -1 )
               search_ele = search_ele.replace('#', 'TASHASH')
        if(search_ele.trim().indexOf('&') != -1 )
               search_ele = search_ele.replace('&', 'TASHAND')
        if(search_ele.trim().indexOf("'") != -1 )
               search_ele = search_ele.replace("'", 'TASSINGLEQUOTE')
        if(search_ele.trim().indexOf('"') != -1 )
               search_ele = search_ele.replace('"', 'TASDOUBLEQUOTE')
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'col_number':col_number, 'global_unq_hashkey_lst':global_unq_hashkey_lst,'search_text':search_ele, 'search_type':type_val, 'flag':8 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);

    }
    if(tab_id  == '8'){
        var sel_radio_taxnonomy = document.querySelectorAll('input[name=check_filter_taxo]:checked');
        if(sel_radio_taxnonomy.length == 0){
            alert('please select taxonomy..')
            return
        }
        var index_type_json  = getAllSettingFilterSelectedRows();
        if(Object.keys(index_type_json).length == 0)
            return
        //var col_number  = document.querySelector('input[name=radio_filter_taxo]:checked').parentNode.parentNode.cells[0].textContent-1;
        //var selected_filter_ele = document.getElementById('filter_select_div').value;
        //if(selected_filter_ele == 'select'){
        //    alert('please select some search option');
        //    return
        //}
        //var select  = document.getElementById('filter_select_div');
        //var query_type    = select.options[select.selectedIndex].getAttribute('opt_value');
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'query_info':index_type_json, 'global_unq_hashkey_lst':global_unq_hashkey_lst, 'flag':10 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);

    }
    if(tab_id  == '9'){
        var sel_radio_taxnonomy = document.querySelector('input[name=radio_search_extract_taxo]:checked');
        if(!sel_radio_taxnonomy){
            alert('please select taxonomy..')
            return
        }
        var col_number  = document.querySelector('input[name=radio_search_extract_taxo]:checked').parentNode.parentNode.cells[0].textContent-1;
        var selected_filter_ele = document.getElementById('search_extract_select_div').value;
        if(selected_filter_ele == 'select'){
            alert('please select some search option');
            return
        }
        var select  = document.getElementById('search_extract_select_div');
        var query_type    = select.options[select.selectedIndex].getAttribute('opt_value');
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'col_number':col_number,'query_type':query_type, 'global_unq_hashkey_lst':global_unq_hashkey_lst, 'flag':9 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);

    }
    if(tab_id  == '10'){
        var clean_up_col_ind_ar    = getCleanUpSettings();
        var clean_up_Select  = document.getElementById('clean_up_type_select');
        var clean_up_type    = clean_up_Select.options[clean_up_Select.selectedIndex].getAttribute('opt_value');
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'clean_up_col_ind_ar':clean_up_col_ind_ar,'clean_up_type':clean_up_type,'global_unq_hashkey_lst':global_unq_hashkey_lst, 'flag':15 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);

    }
}

/*****************************************************************************************************************************************************/
submit_global_setting_results     = function(){
    var tab_id = '0';

    if(global_cur_setting_tab.id == 'change_taxonomy_setting_div')
        tab_id = '1';
    else if(global_cur_setting_tab.id == 'duplicate_setting')
        tab_id = '2';
    else if(global_cur_setting_tab.id == 'merge_setting')
        tab_id = '3';
    else if(global_cur_setting_tab.id == 'split_setting')
        tab_id = '4';
    else if(global_cur_setting_tab.id == 'delete_column_setting')
        tab_id = '5';
    else if(global_cur_setting_tab.id == 'restore_column_setting')
        tab_id = '6';
    else if(global_cur_setting_tab.id == 'search_column_setting')
        tab_id = '7';
    else if(global_cur_setting_tab.id == 'filter_setting')
        tab_id = '8';
    else if(global_cur_setting_tab.id == 'search_extract_column_setting')
        tab_id = '9';
    else if(global_cur_setting_tab.id == 'clean_up_setting')
        tab_id = '10';

    if(tab_id == '1'){
        var taxo_id_lst = get_all_setting_selected_taxonomy_lst();
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'taxo_id_lst':taxo_id_lst, 'global_unq_hashkey_lst':'*', 'flag':2 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        displayPreviewResults(retJ[0], retJ[1], 1);
    }
    if(tab_id == '2'){
        var taxo_index_arr = getAllTaxoIdForDuplicates();
        if(taxo_index_arr.length == 0){
            alert('please select taxonomy first..');
            return;
        }
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'taxo_id_lst':taxo_index_arr, 'global_unq_hashkey_lst':'*', 'flag':3 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);
    }
    if(tab_id == '3'){
        var taxo_index_arr = getAllTaxoIdForMerge();
        if(taxo_index_arr.length == 0){
            alert('please select taxonomy first..');
            return;
        }
        var merge_delim = document.getElementById('merge_delimeter_input').value;
        if(merge_delim.trim() == ''){
            alert('please give merge delimeter..');
            return;
        }
        if(merge_delim.trim().indexOf(',') != -1)
            merge_delim = merge_delim.replace(',', 'TASCOMMA')
        if(merge_delim.trim().indexOf('#') != -1 )
               merge_delim = merge_delim.replace('#', 'TASHASH')
        if(merge_delim.trim().indexOf('&') != -1 )
               merge_delim = merge_delim.replace('&', 'TASHAND')
        if(merge_delim.trim().indexOf("'") != -1 )
               merge_delim = merge_delim.replace("'", 'TASSINGLEQUOTE')
        if(merge_delim.trim().indexOf('"') != -1 )
               merge_delim = merge_delim.replace('"', 'TASDOUBLEQUOTE')
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'taxo_id_lst':taxo_index_arr,'merge_element':merge_delim, 'global_unq_hashkey_lst':'*', 'flag':4 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);
    }
    if(tab_id == '4'){
        var taxo_index_arr = getAllTaxoIdForSplit();
        if(taxo_index_arr.length == 0){
            alert('please select taxonomy first..');
            return;
        }
        var split_delim = document.getElementById('split_delimeter_input').value;
        if(split_delim.trim() == ''){
            alert('please give split delimeter..');
            return;
        }
        if(split_delim.trim().indexOf(',') != -1)
            split_delim = split_delim.replace(',', 'TASCOMMA')
        if(split_delim.trim().indexOf('#') != -1 )
               split_delim = split_delim.replace('#', 'TASHASH')
        if(split_delim.trim().indexOf('&') != -1 )
               split_delim = split_delim.replace('&', 'TASHAND')
        if(split_delim.trim().indexOf("'") != -1 )
               split_delim = split_delim.replace("'", 'TASSINGLEQUOTE')
        if(split_delim.trim().indexOf('"') != -1 )
               split_delim = split_delim.replace('"', 'TASDOUBLEQUOTE')
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'taxo_id_lst':taxo_index_arr,'split_element':split_delim, 'global_unq_hashkey_lst':'*', 'flag':5 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);
    }
    if(tab_id  == '5'){
        var taxo_index_arr = getAllTaxoIdForDeleted();
        if(taxo_index_arr.length == 0){
            alert('please select taxonomy first..');
            return;
        }
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'taxo_id_lst':taxo_index_arr, 'global_unq_hashkey_lst':'*', 'flag':6 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);
    }
    if(tab_id  == '6'){
        var taxo_index_arr = getAllTaxoIdForRestored();
        if(taxo_index_arr.length == 0){
            alert('please select taxonomy first..');
            return;
        }
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'taxo_id_lst':taxo_index_arr, 'global_unq_hashkey_lst':'*', 'flag':7 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);

    }
    if(tab_id  == '7'){
        var sel_radio_taxnonomy = document.querySelector('input[name=radio_search_taxo]:checked');
        if(!sel_radio_taxnonomy){
            alert('please select taxonomy..')
            return
        }
        var select_search_type_ele  = document.getElementById('select_search_type');
        var type_val = select_search_type_ele.options[select_search_type_ele.selectedIndex].getAttribute('opt_val');
        if(type_val == 'select'){
            alert('select search type first..')
            return
        }
        var col_number  = document.querySelector('input[name=radio_search_taxo]:checked').parentNode.parentNode.cells[0].textContent-1;
        var search_ele = document.getElementById('search_text_inp').value;
        if(search_ele.trim() == ''){
            alert('please give search element..');
            return;
        }
        if(search_ele.trim().indexOf(',') != -1)
            search_ele = search_ele.replace(',', 'TASCOMMA')
        if(search_ele.trim().indexOf('#') != -1 )
               search_ele = search_ele.replace('#', 'TASHASH')
        if(search_ele.trim().indexOf('&') != -1 )
               search_ele = search_ele.replace('&', 'TASHAND')
        if(search_ele.trim().indexOf("'") != -1 )
               search_ele = search_ele.replace("'", 'TASSINGLEQUOTE')
        if(search_ele.trim().indexOf('"') != -1 )
               search_ele = search_ele.replace('"', 'TASDOUBLEQUOTE')
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'col_number':col_number, 'global_unq_hashkey_lst':'*','search_text':search_ele, 'search_type':type_val, 'flag':8 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);

    }
    if(tab_id  == '8'){
        var sel_radio_taxnonomy = document.querySelectorAll('input[name=check_filter_taxo]:checked');
        if(sel_radio_taxnonomy.length == 0){
            alert('please select taxonomy..')
            return
        }
        var index_type_json  = getAllSettingFilterSelectedRows();
        if(Object.keys(index_type_json).length == 0)
            return
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'query_info':index_type_json, 'global_unq_hashkey_lst':'*', 'flag':10 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);

    }
    if(tab_id  == '9'){
        var sel_radio_taxnonomy = document.querySelector('input[name=radio_search_extract_taxo]:checked');
        if(!sel_radio_taxnonomy){
            alert('please select taxonomy..')
            return
        }
        var col_number  = document.querySelector('input[name=radio_search_extract_taxo]:checked').parentNode.parentNode.cells[0].textContent-1;
        var selected_filter_ele = document.getElementById('search_extract_select_div').value;
        if(selected_filter_ele == 'select'){
            alert('please select some option');
            return
        }
        var select  = document.getElementById('search_extract_select_div');
        var query_type    = select.options[select.selectedIndex].getAttribute('opt_value');
        //var taxo_index_arr = getAllTaxoIdForRestored();
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'col_number':col_number,'query_type':query_type, 'global_unq_hashkey_lst':'*', 'flag':9 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);

    }
    if(tab_id  == '10'){
        var clean_up_col_ind_ar    = getCleanUpSettings();
        var clean_up_Select  = document.getElementById('clean_up_type_select');
        var clean_up_type    = clean_up_Select.options[clean_up_Select.selectedIndex].getAttribute('opt_value');
        var json = {"user_id": TASApp.SubUnits.user_id, "agent_id":TASApp.SubUnits.agent_id,  "mgmt_id":  TASApp.SubUnits.mgmt_id,"taxo_id":TASApp.SubUnits.taxo_id,'clean_up_col_ind_ar':clean_up_col_ind_ar,'clean_up_type':clean_up_type, 'global_unq_hashkey_lst':'*', 'flag':15 };
        alert("172.16.20.163/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?input_str="+JSON.stringify(json));
	    var retJ  = ajaxCall("cgi-bin/TR_Legal_2013_12_23_web/slt_Code/pattern_generation_v13/cgi_filter2.py?", json, 'POST', false);
        alert(JSON.stringify(retJ));
        displayPreviewResults(retJ[0], retJ[1], 1);

    }


}
/*****************************************************************************************************************************************************/
change_Setting_menu  = function(ele){
    if(global_cur_setting_tab){
        global_cur_setting_tab.style.background = ''
        global_cur_setting_tab.style.color = ''
    }
    global_cur_setting_tab = ele;
    ele.style.background = '#2DC0B0';     
    ele.style.color = '#fff';     
}
