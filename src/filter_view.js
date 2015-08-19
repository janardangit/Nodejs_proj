var TASRightView = {}
function FilterView(){
    Utils.call(this);
    this.gbl_cgi_script_file_name = "webintf/cgi_web_extract_lmdb.py";
    this.gbl_cgi_script_file_path = "cgi-bin/TR_Legal_2013_12_23_web/slt_Code/";
    this.gbl_ref_json_info = {};
    this.gbl_data = {};
    this.ImgDivId = null;
    this.gbl_map_taxo_id = null;
    this.gbl_map_taxo_name = "";
    this.gbl_delete_data = [];
    this.gbl_merge_data = [];
    this.gbl_merge_data_across = {};
    this.gbl_page_data = [];
    this.gbl_select_doc_id = null;
    this.gbl_click_page_node_id = null;
    this.gbl_split_data = [];
    this.gbl_save_copy_new = null;
    this.gbl_split_filter = null;
    this.gbl_merge_filter = null;
    this.gbl_delete_filter = null;
    this.gbl_make_duplicate_copy_filter = null;
    this.gbl_map_taxonomy_filter = null;
    this.gbl_delimiter_selected = "";
    this.gbl_level_id = -1;
    this.gbl_pos_selected = '';
    this.gbl_split_char_enable = 0;
    this.gbl_num_pagination = [];
    this.gbl_strip_data = {};
    this.gbl_distinct_color = ["#73B011", "#5d8aa8", "#ffbf00", "#9966cc", "#a4c639", "#cd9575", "#915c83", "#008000", "#8db600", "#00ffff", "#7fffd4", "#4b5320", "#a52a2a", "#007fff", "#6e7f80", "#ffe135", "#3d2b1f", "#004225", "#ff3800", "#004040", "#0038a8"];
}
FilterView.prototype		= new Utils();
FilterView.prototype.constructor	= FilterView;
(function(){
    this.get_num_of_pages = function(doc_id){
        var vservice_path = this.gbl_data.server_cgi_path+'/cgi-bin/TR_Legal_2013_12_23_web/slt_Code/verify_pre_data_html/cgi_get_doc_info.py?input_str='
        var strURL = vservice_path + JSON.stringify	({"doc_id":doc_id})
        this.Log("Pagination "+strURL)
        this.gbl_num_pagination	= [];
        this.send_ajax_request(strURL, null, 1, "TASRightView.gbl.gbl_num_pagination = json" , "GET", false);
        return this.gbl_num_pagination[0];
    }
    this.init = function(data){
        this.gbl_data = data;
        this.addProgressBar();
        this.init_view();
    }
    this.loadImg = function(doc_id, pw, ph){
        var pw = pw;
        var ph = ph;
        var num_of_pagination	= this.get_num_of_pages(doc_id)
        if (!Browser || !Browser.canvas_max_height)
            var Browser = {canvas_max_height:30000};
        this.Log("num_of_pagination "+num_of_pagination)
        this.ImgDivId = this.Id('filter_level_Con_Div');
        this.ImgDivId.innerHTML = "";
        var ipath = this.gbl_data.doc_image_path+"TR_Legal_output_lmdb/data/output/"+this.gbl_data.project_id+"/"+this.gbl_data.url_id+"/"+this.gbl_data.agent_id+"_"+this.gbl_data.mgmt_id+"/"+this.gbl_data.user_id+"/predata0/docs/"+doc_id+"/html/"
        if(num_of_pagination == 0 || !num_of_pagination){
            ImgUrl = "url('"+ipath+doc_id+"-page-1.png')";
            this.ImgDivId.style.background = ImgUrl;
        }else{
            var top_px	= 0;
            var num_of_pagination_t	= num_of_pagination - 1
            this.ImgDivId.style.background = "";
       
            for(var ind = 0; ind < num_of_pagination_t; ind++){
                this.createDom("img", {width:pw, height:Browser.canvas_max_height, src:ipath+doc_id+"-pagination-"+(ind+1)+".png", style:"position:absolute;top:"+top_px+"px;left:0px;"}, this.ImgDivId);	
                top_px	+= Browser.canvas_max_height;
            }
            this.createDom("img", {width:pw, height:ph % Browser.canvas_max_height, src:ipath+doc_id+"-pagination-"+(ind+1)+".png", style:"position:absolute;top:"+top_px+"px;left:0px;"}, this.ImgDivId);
        }
        this.ImgDivId.style.position="relative";
        this.ImgDivId.style.width = pw +'px';
        this.ImgDivId.style.height = ph +'px';
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
    this.getstyle = function(elem, prop) {
        if(document.defaultView)
        {
            return document.defaultView.getComputedStyle(elem, null).getPropertyValue(prop);
        }
        else if(elem.currentStyle)
        {
            var prop = prop.replace(/-(\w)/gi, function($0,$1)
                    {
                    //return $0.charAt($0.length - 1).toUpperCase();
                    return $1.toUpperCase();
                    });
            return elem.currentStyle[prop];
        }
        else return null;
    }
    this.init_view = function()
    {
        this.hide_process_bar();
        this.do_action_on_tab('block')
        this.do_action_on_tab_reclassify('none')
        this.set_tab('block');
        this.gbl_map_taxonomy_filter = this.map_taxonomy_single;
        this.gbl_make_duplicate_copy_filter = this.make_duplicate_copy_single;
        this.gbl_save_copy_new = this.save_copy_single;
        this.gbl_split_filter = this.split_filter_row_single;
        this.gbl_merge_filter = this.merge_filter_row_single;
        this.gbl_delete_filter = this.delete_filter_row_single;
        this.strip_filter_row = this.strip_filter_row_single;
        this.initializeDelimiters();
        this.gbl_delete_data = [];
        this.gbl_merge_data = [];
        this.gbl_strip_data = {};

        var pw                  = this.gbl_data.pw;
        var ph                  = this.gbl_data.ph;
        var main_content_div_height = parseInt(this.getstyle(this.Id("filter_content_main"), "height")); 
        this.Id('filter_content').style.height = (main_content_div_height - 25)+"px"; 

        this.gbl_ref_json_info = {project_id:Number(this.gbl_data.project_id), user_id:Number(this.gbl_data.user_id), agent_id:Number(this.gbl_data.agent_id), mgmt_id:Number(this.gbl_data.mgmt_id), url_id:Number(this.gbl_data.url_id), doc_id:Number(this.gbl_data.doc_id), taxo_id:Number(this.gbl_data.taxo_id), taxo_name:this.gbl_data.taxo_name, sysgrptype:this.gbl_data.sysgrptype};

        this.gbl_select_doc_id = this.gbl_data.doc_id;
        this.show_process_bar();
        this.loadImg(this.gbl_data.doc_id, pw, ph);
        var language_flag = 0;
        if (this.Id('chgLang') && this.Id('chgLang').checked){
           language_flag = 1; 
        }

        var json   = {project_id:Number(this.gbl_data.project_id), user_id:Number(this.gbl_data.user_id), agent_id:Number(this.gbl_data.agent_id), mgmt_id:Number(this.gbl_data.mgmt_id), url_id:Number(this.gbl_data.url_id), cmd_id:Number(this.gbl_data.cmd_id), refer_id:this.gbl_data.ref_id, taxo_id:Number(this.gbl_data.taxo_id), taxo_name:this.gbl_data.taxo_name, sysgrptype:this.gbl_data.sysgrptype, lang_translate:language_flag};

        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        this.Log("Pannel Profile CGI... "+vservice_path+" === ");
        var callback = "TASRightView.gbl.load_blocks_no_highlight_scroll_filter(json)";
        if (this.gbl_data.cmd_id == '107'){
            callback = "TASRightView.gbl.load_blocks_no_highlight_scroll_content(json)"
        }
        this.send_ajax_request(vservice_path, null, 1, callback , "GET", true);
    }
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
    this.load_blocks_highlight_dyn = function(crop_crods, crop_id, color){
        if (this.Id(crop_id)){
            try{document.querySelector("active_kve_classified_div_dyn").className = ""}catch(e){}
            this.Id(crop_id).className = "active_kve_classified_div_dyn";
            return;
        }
        var zindex = 100; 
        var bgcolor = "#E8DBFF"
        var fields = crop_id.split(':^^:')
        var main_div = this.createDom('div', {id:crop_id, gid:3, style:"position:absolute; border:"+color+" 2px solid; left:"+fields[0]+"px; top:"+fields[1]+"px; width:"+fields[2]+"px; height:"+fields[3]+"px; opacity:0.4; filter: alpha(opacity=40); background:"+bgcolor+"; z-index:"+zindex+";", onclick:""}, this.ImgDivId);
        //var dblclick_div = this.createDom('div', {id:crop_id+"_toggle", gid:crop_id, style:"position:absolute;z-index:9998; left:"+(Number(fields[0])+Number(fields[2])-8)+"px; top:"+fields[1]+"px; width:10px; height:10px; opacity:0.9;  background:"+color+";",onclick:"TASRightView.gbl.toggle_color_dyn(this)"}, this.ImgDivId);
        var dblclick_div = this.createDom('div', {id:crop_id+"_toggle", gid:crop_id, style:"position:absolute;z-index:9998; left:"+(Number(fields[0])+Number(fields[2])-8)+"px; top:"+fields[1]+"px; width:10px; height:10px; opacity:0.9;  background:"+color+";"}, this.ImgDivId);
    }

    this.highlight_taxonomy = function(kv_taxo_id){
        //console.log("highlight_taxonomy : "+kv_taxo_id);  
        this.highlight_taxonomy_group(kv_taxo_id);
    }
    this.delete_group = function(elem){
        var r=confirm("Do you want To Delete the selected Group ");
        if (r==true) {
           this.cgi_delete_group(elem);
        }else
            return;
    }

    this.cgi_delete_group = function(elem){
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 6;
        //json['ref_id'] = elem.getAttribute('gid').split('!!').join('!!');
        //json['ref_id'] = elem.getAttribute('gid').replace(/\!!/g,'!!');
        json['ref_id'] = elem.getAttribute('gid');
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        this.Log("Delete CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1,  "TASRightView.gbl.init_view(json)", "GET", true);
    }
    this.load_blocks_no_highlight = function(data){
        var color;
        for(var j=0; j<data.length; j++){
            var zindex = 50;
            for(var i=0; i<data[j][0][1].length; i++){
                color = (data[j][0][3][i]==2)?'#ff0000':(data[j][0][3][i]==3)?'#0000ff':'#C3C3C3';
                var main_div = this.createDom('div', {id:data[j][0][0]+'!!'+data[j][0][1][i]+'!!'+data[j][0][3][i], ref_id:i+'_'+j+'_0', gid:data[j][0][3][i], style:"position:absolute; border:"+color+" 2px solid; left:"+data[j][0][2][i][0]+"px; top:"+data[j][0][2][i][1]+"px; width:"+data[j][0][2][i][2]+"px; height:"+data[j][0][2][i][3]+"px; opacity:0.4; filter: alpha(opacity=40);z-index:"+zindex+";"}, this.ImgDivId);

                zindex -= 10;    
            }
        }
        if (this.gbl_data.select_id != ''){
            var elm = this.Id(this.gbl_data.select_id);       
            elm.className = "active_kve_selected_div";
            elm.scrollIntoView();
        }
    }
    this.load_blocks_no_highlight_scroll_across_content = function(draw_data, doc_id, pw, ph, gr_index){
        setTimeout(function(){TASRightView.gbl.load_blocks_no_highlight_scroll_across_content_time(draw_data, doc_id, pw, ph, gr_index);}, 100);
    }
    this.load_blocks_no_highlight_scroll_across_content_time = function(draw_data, doc_id, pw, ph, gr_index){
        var subData= [];
        if (draw_data.length > 1){
            subData = draw_data[1];
        }
        var color;
        this.Id('tab-right').style.display = 'block';
        var zindex = 51;
        var table = this.createDom("table", {border:"1", width:"100%", id:"kve_content_table_"+doc_id, isModified:0}, this.Id('filter_content'))
        var row;
        if (gr_index == 0){
            row = this.get_table_row(table, {}, 'th', [{style:"padding:4px;", width:'8%'}, {txt:"Status", width:"5%"}, {txt:"Content"},  {txt:"Taxonomy", width:"20%"}])
            this.createDom("input", {name:"select_all", type:"checkbox", style:"margin:0px 1px; vertical-align:middle;", id:"kve_select_all_rows", onclick:"TASRightView.gbl.select_all_rows(this)"}, row.cells[0])
            this.createDom("span", {style:"margin:0px 1px; vertical-align:middle;", txt:"Sl No."}, row.cells[0]);
        }else{
            row = this.get_table_row(table, {}, 'th', [{txt:(gr_index+1), width:'8%', style:'text-align:center;'}, {txt:"", width:"5%"}, {txt:""},  {txt:"", width:"20%"}])
        }
        var cnt=1, color1;
        for(var i=0; i<subData.length; i++){
                //console.log("===="+doc_id+"==========="+subData[i][9]+"===="+subData[i].toSource());
                if (subData[i][9] <= 0) continue;
                color = this.gbl_distinct_color[subData[i][4]]; //'#73B011'; //(data[j][3][i]==2)?'#ff0000':(data[j][3][i]==3)?'#0000ff':'#C3C3C3';
                row = this.get_table_row(table, {source_from:subData[i][8], row_id:subData[i][3], isUserAdded:0}, 'td', [{}, {style:"text-align: center;"}, {rowtype:'GROUP'}, {txt:subData[i][6], change_flag:0, taxo_id:subData[i][5]}])
                if (subData[i][8] == 'user'){
                    row.style.background = "#DCDCDC";
                }
                color1 = (subData[i][7] == 1) ? "#B5E784" : "#ff0000";
                this.createDom("b", {style:"font-size=18px;color:"+color1, txt:"&#11044;"}, row.cells[1]);
                this.createDom("input", {name:"apply_action", type:"checkbox", style:"margin:0px 1px; vertical-align:middle;", doc_id:doc_id, gr_index:gr_index}, row.cells[0]);
                this.createDom("span", {style:"margin:0px 1px; vertical-align:middle;", txt:cnt}, row.cells[0]);
                for (var j=0; j<subData[i][1].length; j++){
                    var matches = subData[i][1][j].match(/\d+/);
                    color1 = color;
                    if (matches && matches.length){
                        color1 = '#ff0000'
                    }
                    this.createDom("div", {txt:subData[i][1][j], gid:"GR_"+doc_id+"_"+cnt, color:color, style:"color:"+color1+";", gr_index:gr_index, doc_id:doc_id, pw:pw, ph:ph, onclick:"TASRightView.gbl.highlight_content_group_across(this);"}, row.cells[2])
                }
                cnt += 1;
        }
    }

    this.select_all_rows_inner = function(elem){
        var flg = false, inputElms;
        if (elem.checked){
            inputElms = this.Id('filter_content').querySelectorAll('input[name="apply_action_inner"]:not(:checked)');
            flg = true;
        }
        else{
            inputElms = this.Id('filter_content').querySelectorAll('input[name="apply_action_inner"]:checked');
        }
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = flg;
        } 
    }
    this.select_all_rows = function(elem){
        var flg = false, inputElms;
        if (elem.checked){
            inputElms = this.Id('filter_content').querySelectorAll('input[name="apply_action"]:not(:checked)');
            flg = true;
        }
        else{
            inputElms = this.Id('filter_content').querySelectorAll('input[name="apply_action"]:checked');
        }
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = flg;
        } 
    }
    this.load_deactivated_blocks_no_highlight_scroll = function(draw_data){
        this.hide_process_bar();
        this.Id('tab-right').style.display = 'block';
        //this.ImgDivId.innerHTML = "";
        this.remove_all_rects(this.ImgDivId);
        this.Id('filter_content').innerHTML = "";
        var data = [], subData= [], done_subData= [];
        if (draw_data.length > 0){
            data = draw_data[0];
        }
        if (draw_data.length > 1){
            subData = draw_data[1];
            //done_subData = draw_data[2];
        }
        var color;
        for(var j=0; j<data.length; j++){
            var zindex = 50;
            for(var i=0; i<data[j][1].length; i++){
                color = (data[j][3][i]==2)?'#ff0000':(data[j][3][i]==3)?'#0000ff':'#C3C3C3';
                var main_div = this.createDom('div', {id:data[j][0]+'!!'+data[j][1][i]+'!!'+data[j][3][i]+'!!'+data[j][3][i], style:"position:absolute; border:"+color+" 2px solid; left:"+data[j][2][i][0]+"px; top:"+data[j][2][i][1]+"px; width:"+data[j][2][i][2]+"px; height:"+data[j][2][i][3]+"px; opacity:0.6;z-index:"+zindex+";"}, this.ImgDivId);
                main_div.scrollIntoView();
                zindex -= 10;    
            }
        }
        if (subData.length == 0){
            return;
        }
        var zindex = 51;
        var table = this.createDom("table", {border:"1", width:"100%", id:"kve_content_table"}, this.Id('filter_content'))
        var row = this.get_table_row(table, {}, 'th', [{width:'8%', style:"padding:4px;"}, {txt:"Status", width:"3%"}, {txt:"Content"},  {txt:"Taxonomy"}])
        this.createDom("input", {name:"select_all", type:"checkbox", style:"margin:0px 1px; vertical-align:middle;", id:"kve_select_all_rows", onclick:"TASRightView.gbl.select_all_rows(this)"}, row.cells[0])
        this.createDom("span", {style:"margin:0px 1px; vertical-align:middle;", txt:"Sl No."}, row.cells[0]);
        var cnt=1, color1;
        for(var i=0; i<subData.length; i++){
                //console.log("===="+subData[i].toSource());
                //if (subData[i][9] == 1) continue;
                color = this.gbl_distinct_color[subData[i][4]]; //'#73B011'; //(data[j][3][i]==2)?'#ff0000':(data[j][3][i]==3)?'#0000ff':'#C3C3C3';
                var main_div = this.createDom('div', {id:"GR_"+cnt, style:"position:absolute; border-bottom:#400000 2px solid; left:"+subData[i][0][0]+"px; top:"+subData[i][0][1]+"px; width:"+subData[i][0][2]+"px; height:"+subData[i][0][3]+"px; opacity:0.2;z-index:"+zindex+";background:"+color+";"}, this.ImgDivId);
                zindex += 10;    
                row = this.get_table_row(table, {source_from:subData[i][8], row_id:subData[i][3], isUserAdded:0}, 'td', [{}, {style:"text-align: center;"}, {rowtype:'GROUP'}, {txt:subData[i][6], change_flag:0, taxo_id:subData[i][5]}])
                if (subData[i][8] == 'user'){
                    row.style.background = "#DCDCDC";
                }
                color1 = (subData[i][7] == 1) ? "#B5E784" : "#ff0000";
                this.createDom("b", {style:"font-size=18px;color:"+color1, txt:"&#11044;"}, row.cells[1]);
                this.createDom("input", {name:"apply_action", type:"checkbox", style:"margin:0px 1px; vertical-align:middle;"}, row.cells[0]);
                this.createDom("span", {style:"margin:0px 1px; vertical-align:middle;", txt:cnt}, row.cells[0]);
                for (var j=0; j<subData[i][1].length; j++){
                    var matches = subData[i][1][j].match(/\d+/);
                    color1 = color;
                    if (matches && matches.length){
                        color1 = '#ff0000'
                    }
                    this.createDom("div", {txt:subData[i][1][j], gid:"GR_"+cnt, color:color, style:"color:"+color1+";", onclick:"TASRightView.gbl.highlight_content_group(this);"}, row.cells[2])
                }
                cnt += 1;
        }
    }


    this.load_blocks_no_highlight_scroll_filter = function(draw_data){
        this.hide_process_bar();
        //this.ImgDivId.innerHTML = "";
        this.remove_all_rects(this.ImgDivId);
        this.Id('tab-right').style.display = 'block';
        this.Id('filter_content').innerHTML = "";
        var data = [], subData= [], done_subData= [];
        if (draw_data.length > 0){
            data = draw_data[0];
        }
        if (draw_data.length > 1){
            subData = draw_data[1];
            //done_subData = draw_data[2];
        }
        var color;
        for(var j=0; j<data.length; j++){
            var zindex = 50;
            for(var i=0; i<data[j][1].length; i++){
                color = (data[j][3][i]==2)?'#ff0000':(data[j][3][i]==3)?'#0000ff':'#C3C3C3';
                var main_div = this.createDom('div', {id:data[j][0]+'!!'+data[j][1][i]+'!!'+data[j][3][i]+'!!'+data[j][3][i], style:"position:absolute; border:"+color+" 2px solid; left:"+data[j][2][i][0]+"px; top:"+data[j][2][i][1]+"px; width:"+data[j][2][i][2]+"px; height:"+data[j][2][i][3]+"px; opacity:0.6;z-index:"+zindex+";"}, this.ImgDivId);
                main_div.scrollIntoView();
                zindex -= 10;    
            }
        }
        
        if (subData.length == 0){
            return;
        }

        var zindex = 51;
        var table = this.createDom("table", {border:"1", width:"100%", id:"kve_content_table"}, this.Id('filter_content'))
        var row = this.get_table_row(table, {}, 'th', [{width:'8%', style:"padding:4px;"}, {txt:"Status", width:"3%"}, {txt:"Content"},  {txt:"Taxonomy"}])
        this.createDom("input", {name:"select_all", type:"checkbox", style:"margin:0px 1px; vertical-align:middle;", id:"kve_select_all_rows", onclick:"TASRightView.gbl.select_all_rows(this)"}, row.cells[0])
        this.createDom("span", {style:"margin:0px 1px; vertical-align:middle;", txt:"Sl No."}, row.cells[0]);
        var cnt=1, color1;
        for(var i=0; i<subData.length; i++){
                //console.log("===="+subData[i].toSource());
                if (subData[i][9] <= 0) continue;
                color = this.gbl_distinct_color[subData[i][4]]; //'#73B011'; //(data[j][3][i]==2)?'#ff0000':(data[j][3][i]==3)?'#0000ff':'#C3C3C3';
                var main_div = this.createDom('div', {id:"GR_"+cnt, style:"position:absolute; border-bottom:#400000 2px solid; left:"+subData[i][0][0]+"px; top:"+subData[i][0][1]+"px; width:"+subData[i][0][2]+"px; height:"+subData[i][0][3]+"px; opacity:0.2;z-index:"+zindex+";background:"+color+";"}, this.ImgDivId);
                zindex += 10;    
                row = this.get_table_row(table, {source_from:subData[i][8], row_id:subData[i][3], isUserAdded:0}, 'td', [{}, {style:"text-align: center;"}, {rowtype:'GROUP'}, {txt:subData[i][6], change_flag:0, taxo_id:subData[i][5]}])
                if (subData[i][8] == 'user'){
                    row.style.background = "#DCDCDC";
                }
                color1 = (subData[i][7] == 1) ? "#B5E784" : "#ff0000";
                this.createDom("b", {style:"font-size=18px;color:"+color1, txt:"&#11044;"}, row.cells[1]);
                this.createDom("input", {name:"apply_action", type:"checkbox", style:"margin:0px 1px; vertical-align:middle;"}, row.cells[0]);
                this.createDom("span", {style:"margin:0px 1px; vertical-align:middle;", txt:cnt}, row.cells[0]);
                for (var j=0; j<subData[i][1].length; j++){
                    var matches = subData[i][1][j].match(/\d+/);
                    color1 = color;
                    if (matches && matches.length){
                        color1 = '#ff0000'
                    }
                    this.createDom("div", {txt:subData[i][1][j], gid:"GR_"+cnt, color:color, style:"color:"+color1+";", onclick:"TASRightView.gbl.highlight_content_group(this);"}, row.cells[2])
                }
                cnt += 1;
        }
    }
    this.remove_all_rects = function(parent_node){
        var elems	= parent_node.querySelectorAll("div")
        for (var ind = 0, len=elems.length; ind < len;ind++){
            parent_node.removeChild(elems[ind]);
        }
    }
    this.load_blocks_no_highlight_scroll_content = function(draw_data){
        this.hide_process_bar(); 
        //this.ImgDivId.innerHTML = "";
        this.remove_all_rects(this.ImgDivId);
        this.Id('filter_content').innerHTML = "";
        var data = [], subData= [], done_subData= [];
        if (draw_data.length > 0){
            data = draw_data[0];
        }
        if (draw_data.length > 1){
            subData = draw_data[1];
            //done_subData = draw_data[2];
        }
        var color;
        for(var j=0; j<data.length; j++){
            var zindex = 50;
            for(var i=0; i<data[j][1].length; i++){
                color = (data[j][3][i]==2)?'#ff0000':(data[j][3][i]==3)?'#0000ff':'#C3C3C3';
                var main_div = this.createDom('div', {id:data[j][0]+'!!'+data[j][1][i]+'!!'+data[j][3][i]+'!!'+data[j][3][i], style:"position:absolute; border:"+color+" 2px solid; left:"+data[j][2][i][0]+"px; top:"+data[j][2][i][1]+"px; width:"+data[j][2][i][2]+"px; height:"+data[j][2][i][3]+"px; opacity:0.6;z-index:"+zindex+";"}, this.ImgDivId);
                main_div.scrollIntoView();
                zindex -= 10;    
            }
        }
        if (subData.length == 0){
            return;
        }
        var zindex = 51;
        var table = this.createDom("table", {border:"1", width:"100%", id:"kve_content_table"}, this.Id('filter_content'))
        var row = this.get_table_row(table, {}, 'th', [{style:"padding:4px;", width:'8%'}, {txt:"Status", width:"3%"}, {txt:"Content"},  {txt:"Taxonomy"}])
        this.createDom("input", {name:"select_all", type:"checkbox", style:"margin:0px 1px; vertical-align:middle;", id:"kve_select_all_rows", onclick:"TASRightView.gbl.select_all_rows(this)"}, row.cells[0])
        this.createDom("span", {style:"margin:0px 1px; vertical-align:middle;", txt:"Sl No."}, row.cells[0]);
        var color1, cnt=1;
        for(var i=0; i<subData.length; i++){
                //console.log("===="+subData[i].toSource());
                if (subData[i][9] <= 0) continue;
                color = this.gbl_distinct_color[subData[i][4]]; //'#73B011'; //(data[j][3][i]==2)?'#ff0000':(data[j][3][i]==3)?'#0000ff':'#C3C3C3';
                var main_div = this.createDom('div', {id:"GR_"+cnt, style:"position:absolute; border-bottom:#400000 2px solid; left:"+subData[i][0][0][0]+"px; top:"+subData[i][0][0][1]+"px; width:"+subData[i][0][0][2]+"px; height:"+subData[i][0][0][3]+"px; opacity:0.2;z-index:"+zindex+";background:"+color+";"}, this.ImgDivId);
                zindex += 10;    
                color1 = color;
                row = this.get_table_row(table, {source_from:subData[i][8], row_id:subData[i][3], isUserAdded:0}, 'td', [{}, {style:"text-align: center;"}, {rowtype:'GROUP'}, {txt:subData[i][6], change_flag:0, taxo_id:subData[i][5]}])
                if (subData[i][8] == 'user'){
                    row.style.background = "#DCDCDC";
                }
                color1 = (subData[i][7] == 1) ? "#B5E784" : "#ff0000";
                this.createDom("b", {style:"font-size=18px;color:"+color1, txt:"&#11044;"}, row.cells[1]);
                //this.createDom("input", {name:"apply_action",  type:"checkbox", style:"margin:0px 1px; vertical-align:middle;"}, row.cells[0]);
                this.createDom("span", {style:"margin:0px 1px; vertical-align:middle;", txt:cnt}, row.cells[0]);
                for (var j=0; j<subData[i][1].length; j++){
                    var matches = subData[i][1][j].match(/\d+/);
                    color1 = color;
                    if (matches && matches.length){
                        color1 = '#ff0000'
                    }
                    this.createDom("div", {txt:subData[i][1][j], gid:"GR_"+cnt, color:color, style:"color:"+color1+";", onclick:"TASRightView.gbl.highlight_content_group(this);"}, row.cells[2])
                }
                cnt += 1;
        }
    }

    this.save_copy_across = function(elem){
        if (Object.keys(this.gbl_strip_data).length > 0){
            this.show_process_bar();
            var json   = JSON.parse(JSON.stringify(this.gbl_strip_data));
            json['save_flag'] = 1;
            var dt = JSON.stringify(json);
            var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?';
            //var post_data     = "input_str=" + encodeURIComponent(dt);
            var post_data		= "input_str=" + dt;
            console.log("Save Right CGI... "+vservice_path+post_data+" === ");
            this.send_ajax_request(vservice_path, post_data, 1,  "TASRightView.gbl.reload_groups_across(json)", "POST", true);
            return;
        }
        var inputElms = this.Id("filter_content").querySelectorAll('table[isModified="1"] input[name="apply_action"]')
        var tr, data, action = false, cmd_id=153, doc_id, gr_index, merge_flag = 0;
        if (Object.keys(this.gbl_merge_data_across).length > 0){
            data = this.gbl_merge_data_across;
            action = true;
            merge_flag = 1;
        }
        else{
            data = this.gbl_delete_data;
            action = (this.gbl_delete_data && this.gbl_delete_data.length) ? true : false;
            for (var i=0; i<inputElms.length; i++){
                inputElms[i].checked = false;
                doc_id = inputElms[i].getAttribute('doc_id')
                gr_index = inputElms[i].getAttribute('gr_index')
                tr = inputElms[i].parentNode.parentNode;
                var info = {}
                if (tr.getAttribute('isUserAdded') == '0'){
                    info['row_source_flag'] = tr.getAttribute('source_from');
                }else{
                    action = true;
                    info['row_source_flag'] = 'user';
                }    
                action = (tr.cells[3].getAttribute('change_flag') == 1) ? true : action;
                info['row_id'] = tr.getAttribute('row_id');
                info['row_delete_flag'] = 0;
                info['row_taxo_id'] = tr.cells[3].getAttribute('taxo_id');
                info['row_taxo_name'] = tr.cells[3].innerHTML;
                info['row_taxo_change_flag'] = tr.cells[3].getAttribute('change_flag');
                info['seq_order'] = tr.cells[0].children[1].innerHTML;
                info['doc_id'] = doc_id;
                info['data_index'] = gr_index;
                data.push(info);
            }
        }
        if (!action){
            alert("Without any action you can't save...")
            return;
        }
        //this.Id('process_png').style.display = 'block';
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = cmd_id;
        json['merge_flag'] = merge_flag;
        json['data'] = data;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?';
        var post_data		= "input_str=" + JSON.stringify(json);
        console.log("Save Right CGI... "+vservice_path+post_data+" === ");
        this.send_ajax_request(vservice_path, post_data, 1,  "TASRightView.gbl.reload_groups_across(json)", "POST", true);
    }
    this.reload_groups_across = function(data){
        this.hide_process_bar();
        //this.Id('process_png').style.display = 'none';
        this.Id(this.gbl_click_page_node_id).click();
    }

    this.save_split_across = function(elem){
        if (this.gbl_split_data.length > 0){
            this.show_process_bar();
            var gid = this.Id(this.gbl_click_page_node_id).getAttribute('gid');
            var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
            json['cmd_id'] = 128;
            json['data'] = this.gbl_split_data;
            json['page_index'] = Number(gid);
            json['delimiter_position_str'] = this.gbl_pos_selected;
            json['include_delimiter_flg'] = this.gbl_split_char_enable;
            //this.Id('process_png').style.display = 'block';
            var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?';
            var post_data		= "input_str=" + JSON.stringify(json);
            console.log("Split save across Right CGI... "+vservice_path+post_data+" === ");
            this.send_ajax_request(vservice_path, post_data, 1,  "TASRightView.gbl.reload_groups_across(json)", "POST", true);
        }
        return;
    }
    this.save_split = function(elem){
        if (this.gbl_split_data.length > 0){
            this.show_process_bar();
            var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
            json['cmd_id'] = 126;
            json['data'] = this.gbl_split_data;
            json['delimiter_position_str'] = this.gbl_pos_selected;
            json['include_delimiter_flg'] = this.gbl_split_char_enable;
            var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?';
            var post_data		= "input_str=" + JSON.stringify(json);
            console.log("Split save Right CGI... "+vservice_path+post_data+" === ");
            this.send_ajax_request(vservice_path, post_data, 1,  "TASRightView.gbl.init_view(json)", "POST", true);
        }
        return;
    }
    this.do_action_on_tab = function(flg){
        this.Id("right_all_action_lst").style.display = flg;
        var children = this.Id('right_all_action_lst').children;
        for (var ind=0; ind<children.length; ind++){
            children[ind].style.display = flg;
        }
        this.Id('kve_reclassification_tab').style.display = "none";
        this.Id('kve_activate_tab').style.display = "none";
        this.Id('kve_activate_src_tab').style.display = "none";
        this.Id('kve_activate_dest_tab').style.display = "none";
        this.Id('kve_level_wise').style.display = "none";
        this.Id('kve_pagination').style.display = "none";
        this.Id('kve_apply_auto_tab').style.display = "none";
        this.Id('kve_history_tab').style.display = "block";
        this.Id('kve_restore_reclassify_tab').style.display = "block"; //change for reclassify
    }
    this.do_action_on_tab_reclassify = function(flg){
        this.Id("right_all_action_lst_reclasify").style.display = flg;
        var children = this.Id('right_all_action_lst_reclasify').children;
        for (var ind=0; ind<children.length; ind++){
            children[ind].style.display = flg;
        }
    }
    this.set_tab = function(flg){
        this.Id('kve_merge_tab').style.display = flg;
        this.Id('kve_dulicate_tab').style.display = flg;
        this.Id('kve_map_tab').style.display = flg;
        this.Id('kve_delete_tab').style.display = flg;
        this.Id('kve_full_view_tab').style.display = flg;
        this.Id('kve_lstrip_tab').style.display = flg;
        this.Id('kve_rstrip_tab').style.display = flg;
    }
    this.save_copy = function(elem){
        this.gbl_save_copy_new(elem);
    }

    this.save_copy_single = function(elem){
        if (Object.keys(this.gbl_strip_data).length > 0){
            this.show_process_bar();
            var json   = JSON.parse(JSON.stringify(this.gbl_strip_data));
            json['save_flag'] = 1;
            var dt = JSON.stringify(json);
            var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?';
            //var post_data     = "input_str=" + encodeURIComponent(dt);
            var post_data		= "input_str=" + dt;
            console.log("Save Right CGI... "+vservice_path+post_data+" === ");
            this.send_ajax_request(vservice_path, post_data, 1,  "TASRightView.gbl.init_view(json)", "POST", true);
            return;
        }
        var inputElms = this.Id("kve_content_table").querySelectorAll('input[name="apply_action"]')
        var tr, data, action = false, cmd_id=116;
        if (this.gbl_merge_data.length > 0){
            data = this.gbl_merge_data;
            action = true;
            cmd_id = 117;
        }
        else{
            data = this.gbl_delete_data;
            action = (this.gbl_delete_data && this.gbl_delete_data.length) ? true : false;
            for (var i=0; i<inputElms.length; i++){
                inputElms[i].checked = false;
                tr = inputElms[i].parentNode.parentNode;
                var info = {}
                if (tr.getAttribute('isUserAdded') == '0'){
                    info['row_source_flag'] = tr.getAttribute('source_from');
                }else{
                    action = true;
                    info['row_source_flag'] = 'user';
                }    
                action = (tr.cells[3].getAttribute('change_flag') == 1) ? true : action;
                info['row_id'] = tr.getAttribute('row_id');
                info['row_delete_flag'] = 0;
                info['row_taxo_id'] = tr.cells[3].getAttribute('taxo_id');
                info['row_taxo_name'] = tr.cells[3].innerHTML;
                info['row_taxo_change_flag'] = tr.cells[3].getAttribute('change_flag');
                info['seq_order'] = tr.cells[0].children[1].innerHTML;
                data.push(info);
            }
        }
        if (!action){
            alert("Without any action you can't save...")
            return;
        }
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = cmd_id;
        json['data'] = data;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?';
        var post_data		= "input_str=" + JSON.stringify(json);
        console.log("Save Right CGI... "+vservice_path+post_data+" === ");
        this.send_ajax_request(vservice_path, post_data, 1,  "TASRightView.gbl.init_view(json)", "POST", true);
    }

    this.loadRect = function(doc_index, doc_id){
        draw_data = this.gbl_page_data[parseInt(doc_index)].data;
        var data = [], subData= [], done_subData= [];
        if (draw_data.length > 0){
            data = draw_data[0];
        }
        if (draw_data.length > 1){
            subData = draw_data[1];
            //done_subData = draw_data[2];
        }
        var color;
        var zindex;
        for(var j=0; j<data.length; j++){
            zindex = 50;
            for(var i=0; i<data[j][1].length; i++){
                color = (data[j][3][i]==2)?'#ff0000':(data[j][3][i]==3)?'#0000ff':'#C3C3C3';
                var main_div = this.createDom('div', {id:data[j][0]+'!!'+data[j][1][i]+'!!'+data[j][3][i]+'!!'+data[j][3][i], style:"position:absolute; border:"+color+" 2px solid; left:"+data[j][2][i][0]+"px; top:"+data[j][2][i][1]+"px; width:"+data[j][2][i][2]+"px; height:"+data[j][2][i][3]+"px; opacity:0.6;z-index:"+zindex+";"}, this.ImgDivId);
                main_div.scrollIntoView();
                zindex -= 10;    
            }
        }
        zindex = 51;
        var cnt=1, color1;
        for(var i=0; i<subData.length; i++){
                //console.log("===="+subData[i].toSource());
                if (subData[i][9] <= 0) continue;
                color = this.gbl_distinct_color[subData[i][4]]; //'#73B011'; //(data[j][3][i]==2)?'#ff0000':(data[j][3][i]==3)?'#0000ff':'#C3C3C3';
                var main_div = this.createDom('div', {id:"GR_"+doc_id+"_"+cnt, style:"position:absolute; border-bottom:#400000 2px solid; left:"+subData[i][0][0]+"px; top:"+subData[i][0][1]+"px; width:"+subData[i][0][2]+"px; height:"+subData[i][0][3]+"px; opacity:0.2;z-index:"+zindex+";background:"+color+";"}, this.ImgDivId);
                zindex += 10;    
                cnt += 1;
        }
    }
    this.highlight_content_group_across = function(elem){
        var doc_id = elem.getAttribute('doc_id');
        //console.log('HIGHLIGHT DOC_ID : '+doc_id+"==="+(elem.doc_id != this.gbl_select_doc_id));
        if (elem.doc_id != this.gbl_select_doc_id){
            this.loadImg(doc_id, elem.getAttribute('pw'), elem.getAttribute('ph'));
            this.loadRect(elem.getAttribute('gr_index'), doc_id);
            this.gbl_select_doc_id = doc_id;
        }
        var helem = this.Id('kve_content_table_'+doc_id).querySelector("div.active_content_group")
        if (!!helem){
            helem.className = '';        
            gid = helem.getAttribute('gid');
            var col = helem.getAttribute('color');
            //this.Id(gid).style.borderColor = col;
            this.Id(gid).style.borderBottom = "#400000 2px solid";
        }else{
            helem = this.Id('filter_content').querySelector("div.active_content_group")
            if (!!helem){
                helem.className = '';        
            }
        }
        var gid = elem.getAttribute('gid');
        this.Id(gid).style.borderColor = "#FF00FF";
        elem.className = "active_content_group";
        this.Id(gid).scrollIntoView();
    }
    this.highlight_content_group = function(elem){
        var helem = this.Id('kve_content_table').querySelector("div.active_content_group")
        if (helem){
            helem.className = '';        
            gid = helem.getAttribute('gid');
            var col = helem.getAttribute('color');
            //this.Id(gid).style.borderColor = col;
            this.Id(gid).style.borderBottom = "#400000 2px solid";
        }
        var gid = elem.getAttribute('gid');
        this.Id(gid).style.borderColor = "#FF00FF";
        elem.className = "active_content_group";
        this.Id(gid).scrollIntoView();
    }
    this.delete_filter_row_across = function(elem){
        var inputElms = this.Id("filter_content").querySelectorAll('input[name="apply_action"]:checked')
        var tr, action=false, doc_id, gr_index;
        var doc_id_json = {};
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            doc_id = inputElms[i].getAttribute('doc_id')
            gr_index = inputElms[i].getAttribute('gr_index')
            doc_id_json[doc_id] = 1
            tr = inputElms[i].parentNode.parentNode;
            if (tr.getAttribute('isUserAdded') == '0'){
                tr.parentNode.setAttribute('isModified', '1');
                var info = {}
                info['row_id'] = tr.getAttribute('row_id');
                info['row_delete_flag'] = 1;
                info['row_taxo_id'] = tr.cells[3].getAttribute('taxo_id');
                info['row_taxo_name'] = tr.cells[3].innerHTML;
                info['row_taxo_change_flag'] = tr.cells[3].getAttribute('change_flag');
                info['row_source_flag'] = tr.getAttribute('source_from');
                info['seq_order'] = tr.cells[0].children[1].innerHTML;
                info['doc_id'] = doc_id;
                info['data_index'] = gr_index;
                this.gbl_delete_data.push(info);
            }
            tr.parentNode.removeChild(tr);
            action = true;
        }
        if (action){
            /*if (gbl_undo_data.length > 5){
                var tda = gbl_undo_data.shift();
            }
            gbl_undo_data.push({'html':old_table_html, 'ddata':this.gbl_delete_data});*/
            for (doc_id in doc_id_json)
                this.reArrangeRow(this.Id("kve_content_table_"+doc_id));
        }
    }
    this.delete_filter_row = function(elem){
        this.gbl_delete_filter(elem);
    }

    this.delete_filter_row_single = function(elem){
        //var old_table_html = this.Id("kve_content_table").innerHTML;
        var inputElms = this.Id("kve_content_table").querySelectorAll('input[name="apply_action"]:checked')
        var tr, action=false;
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            tr = inputElms[i].parentNode.parentNode;
            if (tr.getAttribute('isUserAdded') == '0'){
                var info = {}
                info['row_id'] = tr.getAttribute('row_id');
                info['row_delete_flag'] = 1;
                info['row_taxo_id'] = tr.cells[3].getAttribute('taxo_id');
                info['row_taxo_name'] = tr.cells[3].innerHTML;
                info['row_taxo_change_flag'] = tr.cells[3].getAttribute('change_flag');
                info['row_source_flag'] = tr.getAttribute('source_from');
                info['seq_order'] = tr.cells[0].children[1].innerHTML;
                this.gbl_delete_data.push(info);
            }
            tr.parentNode.removeChild(tr);
            action = true;
        }
        if (action){
            /*if (gbl_undo_data.length > 5){
                var tda = gbl_undo_data.shift();
            }
            gbl_undo_data.push({'html':old_table_html, 'ddata':this.gbl_delete_data});*/
            this.reArrangeRow(this.Id("kve_content_table"));
        }
    }

    this.merge_filter_row_across = function(elem){
        //var old_table_html = this.Id("kve_content_table").innerHTML;
        var inputElms = this.Id("filter_content").querySelectorAll('input[name="apply_action"]:checked')
        var tr, action=false, doc_id, gr_index, chFlag=true;
        var merge_data = {};
        var new_node = null;
        var doc_id_json = {};
        var prev_doc_id = "";
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            doc_id = inputElms[i].getAttribute('doc_id')
            gr_index = inputElms[i].getAttribute('gr_index')
            doc_id_json[doc_id] = 1
            tr = inputElms[i].parentNode.parentNode;
            if (tr.getAttribute('isUserAdded') == '0'){
                chFlag = true;
                if(!(doc_id in merge_data)){
                    merge_data[doc_id] = [];
                    new_node = tr;
                    chFlag = false;
                }
                var info = {}
                tr.parentNode.setAttribute('isModified', '1');
                info['row_id'] = tr.getAttribute('row_id');
                info['row_taxo_id'] = tr.cells[3].getAttribute('taxo_id');
                info['row_taxo_name'] = tr.cells[3].innerHTML;
                info['row_taxo_change_flag'] = tr.cells[3].getAttribute('change_flag');
                info['row_source_flag'] = tr.getAttribute('source_from');
                info['seq_order'] = tr.cells[0].children[1].innerHTML;
                info['doc_id'] = doc_id;
                info['data_index'] = gr_index;
                merge_data[doc_id].push(info);
                if (chFlag){
                    new_node.cells[2].innerHTML += tr.cells[2].innerHTML;
                    tr.parentNode.removeChild(tr);    
                }

                action = true;
            }
        }
        
        if (action){
            for (doc_id in merge_data){
                if (!(doc_id in this.gbl_merge_data_across)){
                     this.gbl_merge_data_across[doc_id] = [];
                }
                this.gbl_merge_data_across[doc_id].push(merge_data[doc_id]);
            }
            for (doc_id in doc_id_json)
                this.reArrangeRow(this.Id("kve_content_table_"+doc_id));
        }
    }

    this.split_filter_row_across = function(elem){
        var split_str = this.Id('strip_char').value;
        if (split_str.trim() != ""){
            this.gbl_delimiter_selected = split_str;
        }
        if (this.gbl_delimiter_selected.trim() == ""){
            alert('please select any Delimiter...');
            return;
        }
        if (this.gbl_delimiter_selected == ';')
            this.gbl_delimiter_selected = 'Semicolon';

        this.gbl_pos_selected = ''
        var split_pos = this.Id('pos_text').value;
        if (split_pos.trim() != ""){
            this.gbl_pos_selected = split_pos;
        }     
        this.gbl_split_char_enable = (this.Id('enable_delimer_text').checked) ? 1 : 0;
        this.gbl_split_data = [];
        this.set_tab('none');
        this.Id('kve_pagination').style.display = 'none'; 
        this.Id('kve_apply_auto_tab').style.display = 'none'; 
        //var old_table_html = this.Id("kve_content_table").innerHTML;
        var inputElms = this.Id("filter_content").querySelectorAll('input[name="apply_action"]:checked')
        var tr, action=false, doc_id, gr_index;
        var split_data = [];
        var new_node = null;
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            doc_id = inputElms[i].getAttribute('doc_id')
            gr_index = inputElms[i].getAttribute('gr_index')
            tr = inputElms[i].parentNode.parentNode;
            if (tr.getAttribute('isUserAdded') == '0'){
                var info = {}
                info['row_id'] = tr.getAttribute('row_id');
                info['row_taxo_id'] = tr.cells[3].getAttribute('taxo_id');
                info['row_taxo_name'] = tr.cells[3].innerHTML;
                info['row_taxo_change_flag'] = tr.cells[3].getAttribute('change_flag');
                info['row_source_flag'] = tr.getAttribute('source_from');
                info['seq_order'] = tr.cells[0].children[1].innerHTML;
                info['doc_id'] = doc_id;
                info['data_index'] = gr_index;
                info['delimiter'] = this.gbl_delimiter_selected.trim();
                split_data.push(info);
                action = true;
            }
        }
        if (action){
            //this.reArrangeRow(this.Id("kve_content_table"));
            this.gbl_save_copy_new = this.save_split_across;
            this.gbl_split_data.push(split_data);
            var gid = this.Id(this.gbl_click_page_node_id).getAttribute('gid');
            this.show_process_bar();
            var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
            json['cmd_id'] = 127;
            json['data'] = this.gbl_split_data;
            json['page_index'] = Number(gid);
            json['delimiter_position_str'] = this.gbl_pos_selected;
            json['include_delimiter_flg'] = this.gbl_split_char_enable;
            //this.Id('process_png').style.display = 'block';
            var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?';
            var post_data		= "input_str=" + JSON.stringify(json);
            console.log("Split across Right CGI... "+vservice_path+post_data+" === ");
            this.send_ajax_request(vservice_path, post_data, 1,  "TASRightView.gbl.show_pagination(json)", "POST", true);
        }
    }

    this.split_filter_row = function(elem){
        this.gbl_split_filter(elem);
    }

    this.split_filter_row_single = function(elem){
        var split_str = this.Id('strip_char').value;
        if (split_str.trim() != ""){
            this.gbl_delimiter_selected = split_str;
        }
        if (this.gbl_delimiter_selected.trim() == ""){
            alert('please select any Delimiter...');
            return;
        }
        if (this.gbl_delimiter_selected == ';')
            this.gbl_delimiter_selected = 'Semicolon';

        this.gbl_pos_selected = ''
        var split_pos = this.Id('pos_text').value;
        if (split_pos.trim() != ""){
            this.gbl_pos_selected = split_pos;
        }     
        this.gbl_split_char_enable = (this.Id('enable_delimer_text').checked) ? 1 : 0;
        this.gbl_split_data = [];
        this.set_tab('none');
        //var old_table_html = this.Id("kve_content_table").innerHTML;
        var inputElms = this.Id("kve_content_table").querySelectorAll('input[name="apply_action"]:checked')
        var tr, action=false;
        var split_data = [];
        var new_node = null;
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            tr = inputElms[i].parentNode.parentNode;
            if (tr.getAttribute('isUserAdded') == '0'){
                var info = {}
                info['row_id'] = tr.getAttribute('row_id');
                info['row_taxo_id'] = tr.cells[3].getAttribute('taxo_id');
                info['row_taxo_name'] = tr.cells[3].innerHTML;
                info['row_taxo_change_flag'] = tr.cells[3].getAttribute('change_flag');
                info['row_source_flag'] = tr.getAttribute('source_from');
                info['seq_order'] = tr.cells[0].children[1].innerHTML;
                info['delimiter'] = this.gbl_delimiter_selected.trim();
                split_data.push(info);
                action = true;
            }
        }
        if (action){
            //this.reArrangeRow(this.Id("kve_content_table"));
            this.gbl_save_copy_new = this.save_split;
            this.gbl_split_data.push(split_data);
            this.show_process_bar();
            var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
            json['cmd_id'] = 125;
            json['data'] = this.gbl_split_data;
            json['delimiter_position_str'] = this.gbl_pos_selected;
            json['include_delimiter_flg'] = this.gbl_split_char_enable;
            var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?';
            var post_data		= "input_str=" + JSON.stringify(json);
            console.log("Split Right CGI... "+vservice_path+post_data+" === ");
            this.send_ajax_request(vservice_path, post_data, 1,  "TASRightView.gbl.load_filter_preview_data(json)", "POST", true);
        }
    }

    this.strip_filter_row_across = function(pos){
        var strip_char = this.Id('strip_char').value;
        if (strip_char.trim() != ""){
            this.gbl_delimiter_selected = strip_char;
        }
        if (this.gbl_delimiter_selected.trim() == ""){
            alert('please select any Delimiter...');
            return;
        }
        var inputElms = this.Id("filter_content").querySelectorAll('input[name="apply_action"]:checked')
        var tr, action=false;
        var strip_data = [], doc_id, gr_index;
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            doc_id = inputElms[i].getAttribute('doc_id')
            gr_index = inputElms[i].getAttribute('gr_index')
            tr = inputElms[i].parentNode.parentNode;
            var info = {}
            info['row_id'] = Number(tr.getAttribute('row_id'));
            info['doc_id'] = Number(doc_id);
            info['gr_index'] = Number(gr_index);
            strip_data.push(info);
            action = true;
        }
        if (action){
            this.show_process_bar();
            var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
            json['cmd_id'] = 119;
            json['data'] = strip_data;
            json['position'] = Number(pos);
            json['strip_char'] = this.gbl_delimiter_selected;
            json['save_flag'] = 0;
        json['page_type'] = 2;
            this.gbl_strip_data = JSON.parse(JSON.stringify(json));
            var dt = JSON.stringify(json);
            var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?';
            //var post_data		= "input_str=" + encodeURIComponent(dt);
            var post_data		= "input_str=" + dt;
            console.log("lstrip Right CGI... "+vservice_path+post_data+" === ");
            this.send_ajax_request(vservice_path, post_data, 1,  "TASRightView.gbl.show_pagination(json)", "POST", true);
        }
    }

    this.strip_filter_row_single = function(pos){
        var strip_char = this.Id('strip_char').value;
        if (strip_char.trim() != ""){
            this.gbl_delimiter_selected = strip_char;
        }
        if (this.gbl_delimiter_selected.trim() == ""){
            alert('please select any Delimiter...');
            return;
        }
        var inputElms = this.Id("kve_content_table").querySelectorAll('input[name="apply_action"]:checked')
        var tr, action=false;
        var strip_data = [];
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            tr = inputElms[i].parentNode.parentNode;
            var info = {}
            info['row_id'] = Number(tr.getAttribute('row_id'));
            info['doc_id'] = this.gbl_ref_json_info.doc_id;
            strip_data.push(info);
            action = true;
        }
        if (action){
            this.show_process_bar();
            var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
            json['cmd_id'] = 119;
            json['data'] = strip_data;
            json['position'] = Number(pos);
            json['strip_char'] = this.gbl_delimiter_selected;
            json['save_flag'] = 0;
            json['page_type'] = 1;
            this.gbl_strip_data = JSON.parse(JSON.stringify(json));
            var dt = JSON.stringify(json);
            var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?';
            //var post_data		= "input_str=" + encodeURIComponent(dt);
            var post_data		= "input_str=" + dt;
            console.log("lstrip Right CGI... "+vservice_path+post_data+" === ");
            this.send_ajax_request(vservice_path, post_data, 1,  "TASRightView.gbl.load_filter_preview_data(json)", "POST", true);
        }
    }

    this.load_filter_preview_data = function(data){
        this.hide_process_bar();
        try{this.Id('delimiter_tab_div_inner').querySelector("span.Delimiter_active").className = 'Delimiter';}catch(e){}
        this.gbl_delimiter_selected = "";
        this.load_blocks_no_highlight_scroll_filter(data)
    }


    this.merge_filter_row = function(elem){
        this.gbl_merge_filter(elem);
    }
    this.merge_filter_row_single = function(elem){
        //var old_table_html = this.Id("kve_content_table").innerHTML;
        var inputElms = this.Id("kve_content_table").querySelectorAll('input[name="apply_action"]:checked')
        var tr, action=false;
        var merge_data = [];
        var new_node = null;
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            tr = inputElms[i].parentNode.parentNode;
            if (tr.getAttribute('isUserAdded') == '0'){
                var info = {}
                info['row_id'] = tr.getAttribute('row_id');
                info['row_taxo_id'] = tr.cells[3].getAttribute('taxo_id');
                info['row_taxo_name'] = tr.cells[3].innerHTML;
                info['row_taxo_change_flag'] = tr.cells[3].getAttribute('change_flag');
                info['row_source_flag'] = tr.getAttribute('source_from');
                info['seq_order'] = tr.cells[0].children[1].innerHTML;
                merge_data.push(info);
                if (!new_node){
                    new_node = tr;
                } 
                else{
                    new_node.cells[2].innerHTML += tr.cells[2].innerHTML;
                    tr.parentNode.removeChild(tr);    
                }
                action = true;
            }
        }
        if (action){
            this.reArrangeRow(this.Id("kve_content_table"));
            this.gbl_merge_data.push(merge_data);
        }
    }




    this.merge_filter_row_bak = function(elem){
        //var old_table_html = this.Id("kve_content_table").innerHTML;
        var inputElms = this.Id("kve_content_table").querySelectorAll('input[name="apply_action"]:checked')
        var tr, action=false;
        var merge_data = [];
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            tr = inputElms[i].parentNode.parentNode;
            if (tr.getAttribute('isUserAdded') == '0'){
                var info = {}
                info['row_id'] = tr.getAttribute('row_id');
                info['row_taxo_id'] = tr.cells[3].getAttribute('taxo_id');
                info['row_taxo_name'] = tr.cells[3].innerHTML;
                info['row_taxo_change_flag'] = tr.cells[3].getAttribute('change_flag');
                info['row_source_flag'] = tr.getAttribute('source_from');
                info['seq_order'] = tr.cells[0].children[1].innerHTML;
                merge_data.push(info);
                action = true;
            }
        }
        if (action){
            var r=confirm("Do you want To Merge the selected Group ");
            if (r==true) {
                this.show_process_bar();
                var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
                json['cmd_id'] = 117;
                json['data'] = merge_data;
                var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
                vservice_path      += JSON.stringify(json);
                console.log("Merge Right CGI... "+vservice_path+" === ");
                this.send_ajax_request(vservice_path, null, 1,  "TASRightView.gbl.init_view(json)", "GET", true);
            }else
                return;
        }
    }

    this.map_taxonomy_across = function(elem){
        if (!this.gbl_map_taxo_id){
            alert("please select taxonomy..."); 
            return;
        }
        var inputElms = this.Id("filter_content").querySelectorAll('input[name="apply_action"]:checked')
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            tr = inputElms[i].parentNode.parentNode;
            tr.cells[3].innerHTML = this.gbl_map_taxo_name;
            tr.cells[3].setAttribute('taxo_id', this.gbl_map_taxo_id);
            tr.cells[3].setAttribute('change_flag', "1");
            tr.cells[3].style.color = "#FFA858";
            tr.parentNode.setAttribute('isModified', '1');
        }
        this.gbl_map_taxo_id = null;
        this.gbl_map_taxo_name = "";
    }


    this.map_taxonomy = function(elem){
        this.gbl_map_taxonomy_filter(elem);
    }
        
    this.map_taxonomy_single = function(elem){
        if (!this.gbl_map_taxo_id){
            alert("please select taxonomy..."); 
            return;
        }
        var inputElms = this.Id("kve_content_table").querySelectorAll('input[name="apply_action"]:checked')
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            tr = inputElms[i].parentNode.parentNode;
            tr.cells[3].innerHTML = this.gbl_map_taxo_name;
            tr.cells[3].setAttribute('taxo_id', this.gbl_map_taxo_id);
            tr.cells[3].setAttribute('change_flag', "1");
            tr.cells[3].style.color = "#FFA858";
        }
        this.gbl_map_taxo_id = null;
        this.gbl_map_taxo_name = "";
    }

    this.make_duplicate_copy_across = function(elem){
        var inputElms = this.Id("filter_content").querySelectorAll('input[name="apply_action"]:checked')
        var tr, action=false, doc_id;
        var doc_id_json = {};
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            doc_id = inputElms[i].getAttribute('doc_id')
            doc_id_json[doc_id] = 1
            tr = inputElms[i].parentNode.parentNode;
            tr.parentNode.setAttribute('isModified', '1');
            var duplicateNode = tr.cloneNode(true);
            duplicateNode.setAttribute('isUserAdded', '1');
            duplicateNode.style.background = "#DCDCDC";
            //copyComputedStyle(element, copy);
            this.insertAfter(duplicateNode, tr);
            action = true;
        }
        if (action){
            for (doc_id in doc_id_json){
                this.reArrangeRow(this.Id("kve_content_table_"+doc_id));
            }
        }
    }
    this.make_duplicate_copy = function(elem){
        this.gbl_make_duplicate_copy_filter(elem);
    }
    this.make_duplicate_copy_single = function(elem){
        var inputElms = this.Id("kve_content_table").querySelectorAll('input[name="apply_action"]:checked')
        var tr, action=false;
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            tr = inputElms[i].parentNode.parentNode;
            var duplicateNode = tr.cloneNode(true);
            duplicateNode.setAttribute('isUserAdded', '1');
            duplicateNode.style.background = "#DCDCDC";
            //copyComputedStyle(element, copy);
            this.insertAfter(duplicateNode, tr);
            action = true;
        }
        if (action){
            this.reArrangeRow(this.Id("kve_content_table"));
        }
    }
    this.reArrangeRow = function(table){
        var children = table.children;
        for (var i=1; i<children.length; i++){
            children[i].getElementsByTagName('span')[0].innerHTML = i;
        }
    }
    this.change_blue_color = function(elem, actelm){
        actelm.style.borderColor = '#0000ff';
        elem.style.background = '#0000ff';
    }
    this.change_red_color = function(elem, actelm){
        actelm.style.borderColor = '#ff0000';
        elem.style.background = '#ff0000';
    }
    this.toggle_color = function(elem){
            var rid = elem.getAttribute('gid');
            var actelm = this.Id(rid);
            var user_rid = actelm.getAttribute('gid');
            var change_state;
            if (user_rid=='2'){
                user_rid = '3'
                change_state = change_blue_color;
            }else if (user_rid=='3'){
                user_rid = '2'
                change_state = change_red_color;
            }
            //ctrl_key_press  = false;
            selected_div_list = [];
            selected_div_list.push(actelm.id+"#"+user_rid);
            var taxo_exist_flag = insert_rows_leftside(selected_div_list, this.gbl_data.ref_id);
            if (taxo_exist_flag){
                change_state(elem, actelm);
                actelm.setAttribute('gid', user_rid);
                console.log("Highlight div : "+rid+" cgid : "+user_rid);
                actelm.className = 'active_kve_selected_div';
            }
            else{
                alert('Please select taxonomy');
            }
        
    }
    this.toggle_color_dyn = function(elem){
            var rid = elem.getAttribute('gid');
            var actelm = this.Id(rid);
            var user_rid = actelm.getAttribute('gid');
            var change_state;
            if (user_rid=='2'){
                user_rid = '3'
                change_state = change_blue_color;
            }else if (user_rid=='3'){
                user_rid = '2'
                change_state = change_red_color;
            }
            kve_dyn_change_box_type(actelm.id, user_rid);
            change_state(elem, actelm);
            actelm.setAttribute('gid', user_rid);
    }
    this.delete_block = function(div_id){
        var del_div = this.Id(div_id);
        del_div.className = '';
    }
    this.assign_taxonomy = function(taxo_id, taxo_name){
        this.gbl_map_taxo_id = taxo_id;
        this.gbl_map_taxo_name = taxo_name;
    }

    this.delete_reclassify_row = function(elem){
        var prof_doc_ids = [], unit_doc_ids = [];
        var inputElms = this.Id('kve_content_table').querySelectorAll('input[name="apply_action"]:checked');
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            prof_doc_ids.push(Number(inputElms[i].getAttribute('doc_id')))
        }  
        inputElms = this.Id('kve_content_table').querySelectorAll('input[name="apply_action_inner"]:checked');
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            unit_doc_ids.push([Number(inputElms[i].getAttribute('doc_id')), Number(inputElms[i].getAttribute('unit_id'))])
        } 
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 136;
        json['profile_delete'] = prof_doc_ids;
        json['unit_delete'] = unit_doc_ids;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        console.log("Pannel Profile CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1, "TASRightView.gbl.show_reclassification(json)" , "GET", true);

    }
    this.show_reclassification = function(elem){
        this.Id('process_png').style.display = 'none';
        this.Id("right_all_action_lst").style.display = "none";
        this.Id("right_all_action_lst_reclasify").style.display = "block";
        this.Id('delimiter_tab').style.display = "none";
        this.Id('spliter_maximize_Y').click();
        var main_content_div_height = parseInt(this.getstyle(this.Id("filter_content_main"), "height")); 
        this.Id('filter_content').style.height = main_content_div_height+"px"; 
        this.Id('filter_content').innerHTML = "";
        this.Id('kve_delete_tab').style.display = 'block';
        cgi_get_reclassification_data();
    }
    this.cgi_get_reclassification_data = function(){
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 135;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        console.log("Pannel Profile CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1, "TASRightView.gbl.load_reclassification_full_view(json)" , "GET", true);
    }
    this.load_reclassification_full_view = function(body_data){
        this.Id('process_png').style.display = 'none';
        if (body_data && body_data.length > 0){
            if (this.Id("kve_content_table")){
                this.Id("kve_content_table").parentNode.removeChild(this.Id("kve_content_table"))
            }
            var row, tds = [], table = this.createDom("table", {border:"1", width:"100%", id:"kve_content_table", height:"auto"}, this.Id('filter_content'))
            tr = this.createDom("tr", {}, table);
            td = this.createDom("th", {style:"padding:4px;width:2%", txt:"Sl No."}, tr);
            td = this.createDom("th", {style:"padding:4px;width:10%", txt:"Profile Id"}, tr);
            td = this.createDom("th", {style:"padding:4px;width:3%", txt:"Level Id"}, tr);
            td = this.createDom("th", {style:"width:2%"}, tr);
            this.createDom("input", {name:"select_all", type:"checkbox", level:(ind+1), style:"margin:0px 1px; vertical-align:middle;", id:"kve_select_all_"+(ind+1), onclick:"TASRightView.gbl.select_all_rows(this)"}, td)
            td = this.createDom("th", {}, tr);
            var ttable = this.createDom("table", {style:"width:100%"}, td);
            tr = this.createDom("tr", {}, ttable);
            td = this.createDom("td", {style:"width:2%;border:0px;border-right:1px solid #c5c5c5;"}, tr);
            td = this.createDom("td", {style:"width:10%;border:0px;border-right:1px solid #c5c5c5;"}, tr);
            this.createDom("input", {name:"select_all_inner", type:"checkbox", style:"margin:0px 1px; vertical-align:middle;",  onclick:"TASRightView.gbl.select_all_rows_inner(this)"}, td)
            td = this.createDom("td", {txt:"Content", style:"width:70%;border:0px;border-right:1px solid #c5c5c5;"}, tr);
            td = this.createDom("td", {txt:"Taxonomy", style:"border:0px;"}, tr);
            var sub_data = [], color, doc_id, level_id, level_index, prof_id, pw, ph;
            this.gbl_page_data = [];
            for(var ind = 0, len = body_data.length; ind < len; ind++){
                tr = this.createDom("tr", {}, table);
                td = this.createDom("td", {style:"padding:4px;width:2%;border-bottom-width: 3px;", txt:(ind+1)}, tr);
                sub_data    = body_data[ind]['data'];
                doc_id      = body_data[ind]['doc_id'];
                level_id    = body_data[ind]['levelid'];
                level_index = body_data[ind]['levelindex'];
                prof_id     = body_data[ind]['prof_id_str'];
                pw          = body_data[ind]['pw'];
                ph          = body_data[ind]['ph'];
                td = this.createDom("td", {style:"padding:4px;width:10%;border-bottom-width: 3px;", txt:prof_id}, tr);
                td = this.createDom("td", {style:"padding:4px;width:3%;border-bottom-width: 3px;", txt:level_id+"."+(parseInt(level_index)+1)}, tr);
                td = this.createDom("td", {style:"width:2%;border-bottom-width: 3px;"}, tr);
                if (Object.keys(body_data[ind]).length == 0){
                    td = this.createDom("td", {style:"border-bottom-width: 3px;", id:'kve_content_td_'+doc_id}, tr);
                    continue
                }
                this.createDom("input", {name:"apply_action", type:"checkbox", doc_id:doc_id,style:"margin:0px 1px; vertical-align:middle;", id:"kve_row_"+ind}, td)
                td = this.createDom("td", {style:"border-bottom-width: 3px;", id:'kve_content_td_'+doc_id}, tr);
                this.gbl_page_data.push(body_data[ind]);
                fill_td_cell(td, sub_data[1], ind, doc_id, pw, ph, body_data[ind]['unit_taxonomy']); 
            }
        }
    }
    this.fill_td_cell = function(cell, subData, gr_index, doc_id, pw, ph, taxo_unit){
        var div, color, cnt = 1;
        var taxo_lst, tr, td, table = this.createDom("table", {style:"width:100%"}, cell);
        for(var i=0; i<subData.length; i++){
            taxo_lst = taxo_unit[i];
            if (subData.length -1 == i){
                tr = this.createDom("tr", {}, table);
                td = this.createDom("td", {style:"width:2%;border:0px;border-right:2px solid #c5c5c5;", txt:(i+1)}, tr);
                td = this.createDom("td", {style:"width:10%;border:0px;border-right:2px solid #c5c5c5;"}, tr);
                this.createDom("input", {name:"apply_action_inner", unit_id:i, doc_id:doc_id, type:"checkbox", style:"margin:0px 1px; vertical-align:middle;", id:"kve_row_"+(i+1)}, td)
                td = this.createDom("td", {style:"width:70%; border:0px;border-right:2px solid #c5c5c5;"}, tr);
                this.createDom("td", {txt:taxo_lst[1], taxo_id:taxo_lst[0], style:"border:0px;"}, tr);
            }
            else{
                tr = this.createDom("tr", {}, table);
                td = this.createDom("td", {style:"width:2%;border:0px;border-bottom:2px solid #c5c5c5;border-right:2px solid #c5c5c5;", txt:(i+1)}, tr);
                td = this.createDom("td", {style:"width:10%;border:0px;border-bottom:2px solid #c5c5c5;border-right:2px solid #c5c5c5;"}, tr);
                this.createDom("input", {name:"apply_action_inner", unit_id:i, doc_id:doc_id, type:"checkbox", style:"margin:0px 1px; vertical-align:middle;", id:"kve_row_"+(i+1)}, td)
                td = this.createDom("td", {style:"width:70%; border:0px;border-bottom:2px solid #c5c5c5;border-right:2px solid #c5c5c5;"}, tr);
                this.createDom("td", {txt:taxo_lst[1], taxo_id:taxo_lst[0], style:"border:0px;border-bottom:2px solid #c5c5c5;"}, tr);
            }
            //color = (subData[i][7] == 1) ? "#B5E784" : "#ff0000";
            color = "#4484F2";
            for (var j=0; j<subData[i][1].length; j++){
                this.createDom("div", {txt:subData[i][1][j], style:"color:"+color+";", gid:"GR_"+doc_id+"_"+cnt, gr_index:gr_index, doc_id:doc_id, pw:pw, ph:ph, onclick:"TASRightView.gbl.highlight_content_group_across_reclassify(this);"}, td);
            }
            cnt += 1;
        }
    }

    this.highlight_content_group_across_reclassify = function(elem){
        var doc_id = elem.getAttribute('doc_id');
        console.log('HIGHLIGHT DOC_ID : '+doc_id);
        if (doc_id != this.gbl_select_doc_id){
            this.loadImg(doc_id, elem.getAttribute('pw'), elem.getAttribute('ph'));
            this.loadRect(elem.getAttribute('gr_index'), doc_id);
            this.gbl_select_doc_id = doc_id;
        }
        var helem = this.Id('kve_content_td_'+doc_id).querySelector("div.active_content_group")
        if (!!helem){
            helem.className = '';        
            gid = helem.getAttribute('gid');
            this.Id(gid).style.borderBottom = "#400000 2px solid";
        }else{
            helem = this.Id('filter_content').querySelector("div.active_content_group")
            if (!!helem){
                helem.className = '';        
            }
        }
        var gid = elem.getAttribute('gid');
        this.Id(gid).style.borderColor = "#FF00FF";
        elem.className = "active_content_group";
        this.Id(gid).scrollIntoView();
    }
    this.show_restore_reclassify = function(elem){
        this.set_tab('none');
        this.Id('kve_topic_save_tab').style.display = 'none';
        this.Id('kve_split_tab').style.display = 'none';
        this.Id('kve_history_tab').style.display = 'none';
        this.Id('kve_restore_reclassify_tab').style.display = 'none';
        this.Id('kve_activate_tab').style.display = 'none';
        this.Id('kve_activate_src_tab').style.display = 'block';
        this.Id('kve_activate_dest_tab').style.display = 'block';
        this.Id('kve_reclassification_tab').style.display = 'none';
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 132;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        console.log("Restore Reclassify RIGHT CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1,  "TASRightView.gbl.load_deactivated_blocks_no_highlight_scroll(json)", "GET", true);
    }

    this.activate_src_group = function(elem){
        this.Id('kve_topic_save_tab').style.display = 'block';
        this.Id('kve_activate_src_tab').style.display = 'none';
        this.Id('kve_activate_dest_tab').style.display = 'none';
        var tr, action=false, row_id, inputElms = [];
        if (this.Id("kve_content_table")){
            inputElms = this.Id("kve_content_table").querySelectorAll('input[name="apply_action"]:checked')
        }
        var row_ids = [] 
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            tr = inputElms[i].parentNode.parentNode;
            row_id = tr.getAttribute('row_id');
            row_ids.push(row_id);
            action = true;
        }
        if (action){
            this.show_process_bar();
            var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
            json['cmd_id'] = 133;
            json['row_ids'] = row_ids;
            var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
            vservice_path      += JSON.stringify(json);
            console.log("activate restore reclassify CGI... "+vservice_path+" === ");
            this.send_ajax_request(vservice_path, null, 1,  "TASRightView.gbl.init_view(json)", "GET", true);
        }     
        else{
            this.init_view();
        }
    }

    this.activate_dest_group = function(elem){
        this.Id('kve_topic_save_tab').style.display = 'block';
        this.Id('kve_activate_src_tab').style.display = 'none';
        this.Id('kve_activate_dest_tab').style.display = 'none';
        var tr, action=false, row_id, inputElms = [];
        if (this.Id("kve_content_table")){
            inputElms = this.Id("kve_content_table").querySelectorAll('input[name="apply_action"]:checked')
        }
        var row_ids = [] 
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            tr = inputElms[i].parentNode.parentNode;
            row_id = tr.getAttribute('row_id');
            row_ids.push(row_id);
            action = true;
        }
        if (action){
            this.show_process_bar();
            var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
            json['cmd_id'] = 134;
            json['row_ids'] = row_ids;
            var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
            vservice_path      += JSON.stringify(json);
            console.log("activate restore reclassify CGI... "+vservice_path+" === ");
            this.send_ajax_request(vservice_path, null, 1,  "TASRightView.gbl.init_view(json)", "GET", true);
        }     
        else{
            this.init_view();
        }
    }
    this.show_reclaim = function(elem){
        this.activate_group = this.activate_reclaim_group;
        this.set_tab('none'); 
        this.Id('kve_topic_save_tab').style.display = 'none';
        this.Id('kve_split_tab').style.display = 'none';
        this.Id('kve_activate_tab').style.display = 'block';
        this.Id('kve_history_tab').style.display = 'none';
        this.Id('kve_restore_reclassify_tab').style.display = 'none';
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 130;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        console.log("History RIGHT CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1,  "TASRightView.gbl.load_deactivated_blocks_no_highlight_scroll(json)", "GET", true);
            
    }
    this.activate_reclaim_group = function(elem){
        this.Id('kve_activate_tab').style.display = 'none';
        var tr, action=false, row_id, inputElms = [];
        if (this.Id("kve_content_table")){
            inputElms = this.Id("kve_content_table").querySelectorAll('input[name="apply_action"]:checked')
        }
        var row_ids = [] 
        for (var i=0; i<inputElms.length; i++){
            inputElms[i].checked = false;
            tr = inputElms[i].parentNode.parentNode;
            row_id = tr.getAttribute('row_id');
            row_ids.push(row_id);
            action = true;
        }
        if (action){
            this.show_process_bar();
            var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
            json['cmd_id'] = 131;
            json['row_ids'] = row_ids;
            var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
            vservice_path      += JSON.stringify(json);
            console.log("activate RIGHT CGI... "+vservice_path+" === ");
            this.send_ajax_request(vservice_path, null, 1,  "TASRightView.gbl.init_view(json)", "GET", true);
        }     
        else{
            this.init_view();
        }
    }

    this.load_full_view = function(elem){
        this.initializeDelimiters();
        this.Id('spliter_maximize_Y').click();
        var main_content_div_height = parseInt(this.getstyle(this.Id("filter_content_main"), "height")); 
        this.Id('filter_content').style.height = (main_content_div_height - 25)+"px"; 
        this.Id('filter_content').innerHTML = "";
        this.Id('kve_apply_auto_tab').style.display = "block";
        this.Id('kve_pagination').style.display = "block";
        this.Id('kve_level_wise').style.display = "block";
        this.Id('kve_history_tab').style.display = "none";
        this.Id('kve_restore_reclassify_tab').style.display = "none";
        this.show_process_bar();
        this.gbl_make_duplicate_copy_filter = this.make_duplicate_copy_across; 
        this.gbl_map_taxonomy_filter = this.map_taxonomy_across;
        this.gbl_delete_filter = this.delete_filter_row_across;
        this.gbl_merge_filter = this.merge_filter_row_across;
        this.gbl_save_copy_new = this.save_copy_across;
        this.gbl_split_filter = this.split_filter_row_across;
        this.strip_filter_row = this.strip_filter_row_across;
        this.gbl_strip_data = {};
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 123;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        console.log("LEVEL RIGHT CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1,  "TASRightView.gbl.show_level_info(json)", "GET", true);
    }
    this.show_level_info = function(data){
        //this.hide_process_bar(); 
        var select_node = this.Id('kve_drop_down_level_wise_select');
        select_node.innerHTML = "";
        this.createDom('option', {level_id:"-1", txt:"All Level", onclick:"TASRightView.gbl.get_pagination(this);"}, select_node);
        for(var i = 0; i < data.length; i++){
            this.createDom('option', {level_id:data[i], txt:"LEVEL "+data[i],  onclick:"TASRightView.gbl.get_pagination(this);"}, select_node);
        }
        select_node.firstChild.click();
        this.hide_process_bar(); 
    }
    this.get_pagination = function(elem){
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 151;
        this.gbl_level_id = Number(elem.getAttribute('level_id'));
        json['level_id'] = this.gbl_level_id;
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        this.Log("Pagination CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1,  "TASRightView.gbl.create_pagination(json)", "GET", true);
    }
    this.create_pagination = function(data){
        var select_node = this.Id('kve_drop_down_pagination_select');
        select_node.innerHTML = "";
        this.Id('filter_content').innerHTML = "";
        for(var i = 0; i < data.length; i++){
            this.createDom('option', {txt:data[i][0]+" - "+data[i][1], id:"page_"+data[i][0]+"_"+data[i][1], gid:(i+1),  onclick:"TASRightView.gbl.load_pagination(this);"}, select_node);
        }
        if (data.length){
            select_node.firstChild.click();
        }
        this.hide_process_bar(); 
    }

    this.load_pagination = function(elem){ 
        this.set_tab('block');
        this.Id('kve_pagination').style.display = 'block'; 
        this.Id('kve_apply_auto_tab').style.display = 'block'; 
        this.Id('kve_apply_auto_select').checked = false;
    //	alert('elem.id'+elem.id)
        this.gbl_click_page_node_id = elem.id;
        this.gbl_delete_data = [];
        this.gbl_merge_data_across = {};
        var gid = elem.getAttribute('gid');
    //    this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 152;
        json['page_index'] = Number(gid);
        json['level_id'] = this.gbl_level_id;
        this.Id('process_png').style.display = 'block';
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        this.Log("Pagination Data CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1,  "TASRightView.gbl.show_pagination(json)", "GET", true);
    }

    this.show_pagination = function(data){
        this.gbl_delimiter_selected = "";
        try{this.Id('delimiter_tab_div_inner').querySelector("span.Delimiter_active").className = 'Delimiter';}catch(e){}
        this.gbl_page_data = [];
        this.Id('filter_content').innerHTML = "";
        for (var i=0; i<data.length; i++){
            this.gbl_page_data.push(data[i])
            this.load_blocks_no_highlight_scroll_across_content(data[i].data, data[i].doc_id, data[i].pw, data[i].ph, i); 
        }
        //this.Id('process_png').style.display = 'none';
        this.hide_process_bar(); 
    }

    this.apply_across_document = function(elem){
        if (!elem.checked)
            return;

        var inputElms = this.Id("filter_content").querySelectorAll('input[name="apply_action"]:checked')
        var tr, action=false, row_indexes = {};
        for (var i=0; i<inputElms.length; i++){
            tr = inputElms[i].parentNode.parentNode;
            //console.log("rowIndex  : "+tr.rowIndex);
            row_indexes[tr.rowIndex] = 1
        } 
        this.apply_across(row_indexes);
    }

    this.apply_across = function(row_indexes){
        var tables = document.querySelectorAll('#filter_content > table');
        for (var i=0; i<tables.length; i++){
            for (row_index in row_indexes){
                //console.log("=====rowIndex  : "+row_index);
                if (tables[i].rows.length > row_index)
                   tables[i].rows[row_index].cells[0].firstChild.checked = true;
            }
        }
    }
    this.delete_block_dyn = function(div_id){
        var del_div = this.Id(div_id);
        if (del_div){
            del_div.parentNode.removeChild(del_div);
        }
        var del_div = this.Id(div_id+"_toggle");
        if (del_div){
            del_div.parentNode.removeChild(del_div);
        }
    }
    this.select_block = function(elem){
        //console.log('ctrl_key_press : '+ctrl_key_press);
        this.Log(elem.className);
        if (elem.className == 'active_kve_selected_div'){
            elem.className = '';
            this.delete_rows_leftside(elem.id);
            return;
        }
        selected_div_list = [];
        selected_div_list.push(elem.id+"#"+elem.getAttribute('gid'));
        var taxo_exist_flag = this.insert_rows_leftside(selected_div_list, this.gbl_data.ref_id);
        if (taxo_exist_flag){
            //alert('elem : '+elem.id);
            console.log("Highlight div : "+elem.id+" cgid : "+elem.getAttribute('gid'));
            //try{document.querySelector("#Con_Div > div.active_kve_selected_div").className = ''}catch(e){}
            elem.className = 'active_kve_selected_div';
        }
        else{
            alert('select taxonomy..');
        }
    }
    this.initializeDelimiters = function(){
        try{this.Id('delimiter_tab_div_inner').querySelector("span.Delimiter_active").className = 'Delimiter';}catch(e){}
        this.gbl_delimiter_selected = ""; 
        this.Id("strip_char").value = "";
        this.Id("pos_text").value = "";
        this.Id("enable_delimer_text").checked = false;
        var delimiter_div 		= this.Id("delimiter_tab_div_inner");
        var delimiter_spans 	= delimiter_div.getElementsByTagName("span");
        for(var x=0, len=delimiter_spans.length; x<len; x++){
            delimiter_spans[x].setAttribute("onclick","TASRightView.gbl.delimiterClicked(this);");
        }
    }

    this.setFocusPos = function(elem){
        this.Id("pos_text").click(function(event){
            event.stopPropagation();
        });
        elem.value=''; 
        elem.style.color='#000';
    }
    if (this.Id("#kve_drop_down_level_wise_select")){
        this.Id("#kve_drop_down_level_wise_select").click(function(event){
            event.stopPropagation();
        });
    }
    if (this.Id("#kve_drop_down_pagination_select")){
        this.Id("#kve_drop_down_pagination_select").click(function(event){
            event.stopPropagation();
        });
    }

    this.setFocus = function(elem){
        this.Id("strip_char").click(function(event){
            event.stopPropagation();
        });
        try{this.Id('delimiter_tab_div_inner').querySelector("span.Delimiter_active").className = 'Delimiter';}catch(e){}
        elem.value=''; 
        elem.style.color='#000';
        this.gbl_delimiter_selected = '';
    }

    this.setBlur = function(elem){
        return;
        try{this.Id('delimiter_tab_div_inner').querySelector("span.Delimiter_active").className = 'Delimiter';}catch(e){}
        elem.value='';
        elem.style.color='#858585';
        this.gbl_delimiter_selected = "";
    }

    this.delimiterClicked = function(currSpan){
        try{this.Id('delimiter_tab_div_inner').querySelector("span.Delimiter_active").className = 'Delimiter';}catch(e){}
        this.Id('strip_char').value = "";
        this.Id('strip_char').style.color='#858585';
        currSpan.className = "Delimiter_active";
        this.gbl_delimiter_selected = currSpan.innerHTML;
        //this.Id('strip_char').value = currSpan.innerHTML;
    }
    this.set_content_height = function(){
        var main_content_div_height = parseInt(this.getstyle(this.Id("filter_content_main"), "height")); 
        if (this.Id("delimiter_tab") && this.Id("delimiter_tab").style.display != 'none'){
            main_content_div_height = (main_content_div_height - 25);    
        }
        this.Id('filter_content').style.height = main_content_div_height+"px"; 
    }
    this.maximize_block = function(elem){
        elem.parentNode.nextSibling.nextSibling.style.height = '94%';
        elem.parentNode.previousSibling.previousSibling.style.height = '0%';
        this.set_content_height();
    }
    this.minimize_block_full = function(elem){
        elem.parentNode.nextSibling.nextSibling.style.height = '0%';
        elem.parentNode.previousSibling.previousSibling.style.height = '94%';
    }

    this.maximize_block_bak = function(elem){
        elem.parentNode.nextSibling.nextSibling.style.height = '92%';
        elem.parentNode.previousSibling.previousSibling.style.height = '4%';
    }
    this.minimize_block = function(elem){
        elem.parentNode.nextSibling.nextSibling.style.height = '4%';
        elem.parentNode.previousSibling.previousSibling.style.height = '92%';
        this.set_content_height();
    }
    this.open_block = function(){
        var elem = this.Id('spliter_Y');
        elem.style.display = 'block';
        elem.nextSibling.nextSibling.style.display = 'block';
        elem.nextSibling.nextSibling.style.height = '37%';
        elem.previousSibling.previousSibling.style.height = '58%';
        var main_content_div_height = parseInt(this.getstyle(this.Id("filter_content_main"), "height")); 
        this.Id('filter_content').style.height = (main_content_div_height - 25)+"px"; 

        
    }
    this.close_block = function(elem){
        elem.parentNode.style.display = 'none';
        elem.parentNode.nextSibling.nextSibling.style.display = 'none';
        elem.parentNode.previousSibling.previousSibling.style.height = '100%';
        //elem.parentNode.previousSibling.previousSibling.style.overflow = '';
    }
    this.reset_block = function(elem){
        elem.nextSibling.nextSibling.style.height = '37%';
        elem.previousSibling.previousSibling.style.height = '58%';
        var main_content_div_height = parseInt(this.getstyle(this.Id("filter_content_main"), "height")); 
        this.Id('filter_content').style.height = (main_content_div_height - 25)+"px"; 
    }
    var realStyle = function(_elem, _style) {
        var computedStyle;
        if ( typeof _elem.currentStyle != 'undefined' ) {
            computedStyle = _elem.currentStyle;
        } else {
            computedStyle = document.defaultView.getComputedStyle(_elem, null);
        }

        return _style ? computedStyle[_style] : computedStyle;
    };
    var copyComputedStyle = function(src, dest) {
        var s = realStyle(src);
        for ( var i in s ) {
            // Do not use `hasOwnProperty`, nothing will get copied
            if ( typeof i == "string" && i != "cssText" && !/\d/.test(i) ) {
                // The try is for setter only properties
                try {
                    dest.style[i] = s[i];
                    // `fontSize` comes before `font` If `font` is empty, `fontSize` gets
                    // overwritten.  So make sure to reset this property. (hackyhackhack)
                    // Other properties may need similar treatment
                    if ( i == "font" ) {
                        dest.style.fontSize = s.fontSize;
                    }
                } catch (e) {}
            }
        }
    };
    this.insertAfter = function(newElement,targetElement) {
        //target is what you want it to go after. Look for this elements parent.
        var parentnode = targetElement.parentNode;

        //if the parents lastchild is the targetElement...
        if(parentnode.lastchild == targetElement) {
            //add the newElement after the target element.
            parentnode.appendChild(newElement);
        } else {
            // else the target has siblings, insert the new element between the target and it's next sibling.
            parentnode.insertBefore(newElement, targetElement.nextSibling);
        }
    }
}).apply(FilterView.prototype);

function active_filter_view(data){
    TASRightView.gbl = new FilterView();
    TASRightView.gbl.init(data);
    return TASRightView.gbl;
}
