var TASRightView = {}

function MappingView(){
	Utils.call(this);
    this.gbl_cgi_script_file_name = "webintf/cgi_web_extract_lmdb.py";
    this.gbl_cgi_script_file_path = "cgi-bin/TR_Legal_2013_12_23_web/slt_Code/";
    this.gbl_ref_json_info = {};
    this.start_mouse_down = false;
    this.gbl_data = {};
    this.ImgDivId = null;
}
MappingView.prototype		= new Utils();
MappingView.prototype.constructor	= MappingView;
(function(){
    this.addEvent = function(event_type, set_flag){
        if (event_type =='mousedown')
            this.Id('main_div1').addEventListener(event_type, this.set_mouse_down_event, false);
        else
            this.Id('main_div1').addEventListener(event_type, this.set_mouse_up_event, false);
    }
    this.set_mouse_down_event = function(ev){
        TASRightView.gbl.start_mouse_down = true;
        ev.stopPropagation();
        ev.preventDefault();
        return false;
    }
    this.set_mouse_up_event = function(ev){
        TASRightView.gbl.start_mouse_down = false;
        ev.stopPropagation();
        ev.preventDefault();
        return false;
    }
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
        this.Id('main_div1').onmousedown = this.set_mouse_down_event; 
        this.Id('main_div1').onmouseup = this.set_mouse_up_event; 
        this.insertOnlyHTMLimg();
    }
    this.insertOnlyHTMLimg = function()
    {
        var pw                  = this.gbl_data.pw;
        var ph                  = this.gbl_data.ph;
        var num_of_pagination	= this.get_num_of_pages(this.gbl_data.doc_id)
        this.Log("num_of_pagination "+num_of_pagination)
        this.ImgDivId = this.Id('Con_Div');
        if (!Browser || !Browser.canvas_max_height){
                var Browser = {canvas_max_height:30000};
        }
        this.ImgDivId.innerHTML = "";
        var ipath = this.gbl_data.doc_image_path+"TR_Legal_output_lmdb/data/output/"+this.gbl_data.project_id+"/"+this.gbl_data.url_id+"/"+this.gbl_data.agent_id+"_"+this.gbl_data.mgmt_id+"/"+this.gbl_data.user_id+"/predata0/docs/"+this.gbl_data.doc_id+"/html/"
        if(num_of_pagination == 0 || !num_of_pagination){
                ImgUrl = "url('"+ipath+this.gbl_data.doc_id+"-page-1.png')";
                this.ImgDivId.style.background = ImgUrl;
        }else{
            var top_px	= 0;
            var num_of_pagination_t	= num_of_pagination - 1
            this.ImgDivId.style.background = '';
       
            for(var ind = 0; ind < num_of_pagination_t; ind++){
                this.createDom("img", {width:pw, height:Browser.canvas_max_height, src:ipath+this.gbl_data.doc_id+"-pagination-"+(ind+1)+".png", style:"position:absolute;top:"+top_px+"px;left:0px;"}, this.ImgDivId);	
                top_px	+= Browser.canvas_max_height;
            }
            this.createDom("img", {width:pw, height:ph % Browser.canvas_max_height, src:ipath+this.gbl_data.doc_id+"-pagination-"+(ind+1)+".png", style:"position:absolute;top:"+top_px+"px;left:0px;"}, this.ImgDivId);
        }
        this.ImgDivId.style.position="relative";
        this.ImgDivId.style.width = pw +'px';
        this.ImgDivId.style.height = ph +'px';
        this.show_process_bar();
        //this.addEvent("mousedown", true);
        //this.addEvent("mouseup", false);
        this.gbl_ref_json_info = {project_id:Number(this.gbl_data.project_id), user_id:Number(this.gbl_data.user_id), agent_id:Number(this.gbl_data.agent_id), mgmt_id:Number(this.gbl_data.mgmt_id), url_id:Number(this.gbl_data.url_id), doc_id:Number(this.gbl_data.doc_id)};
        var json   = {project_id:Number(this.gbl_data.project_id), user_id:Number(this.gbl_data.user_id), agent_id:Number(this.gbl_data.agent_id), mgmt_id:Number(this.gbl_data.mgmt_id), url_id:Number(this.gbl_data.url_id), cmd_id:Number(this.gbl_data.cmd_id), refer_id:this.gbl_data.ref_id};
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        this.Log("Pannel Profile CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1, (this.gbl_data.cmd_id != '2')?"TASRightView.gbl.load_blocks_no_highlight_scroll(json)":(this.gbl_data.select_id=='')?"TASRightView.gbl.load_blocks_highlight(json)":"TASRightView.gbl.load_blocks_no_highlight(json)" , "GET", true);
    }

    /**
     * Description
     * @method send_ajax_request
     * @param {} cgi_file
     * @param {} post_data
     * @param {} succ_flag
     * @param {} callback
     * @param {} request_type
     * @param {} asyn
     * @return 
     */
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
    this.load_blocks_highlight = function(data){
        this.hide_process_bar();
        this.Id('Con_Div').innerHTML += data;
        return
        var color, enter_method;
        for(var j=0; j<data.length; j++){
            var zindex1, zindex = 50;
            for(var i=0; i<data[j][0][1].length; i++){
                color = (data[j][0][3][i]==2)?'#ff0000':(data[j][0][3][i]==3)?'#0000ff':'#C3C3C3';
                zindex1 = (data[j][0][3][i]==2)?(100+zindex):zindex; 
                enter_method = (data[j][0][3][i] != 4) ? "TASRightView.gbl.select_block_enter(this);":"";
                var main_div = this.createDom('div', {class: "", id:data[j][0][0]+'!!'+data[j][0][1][i]+'!!'+data[j][0][3][i]+'!!'+data[j][0][4][i], ref_id:i+'_'+j+'_0', gid:data[j][0][3][i], style:"position:absolute; border:"+color+" 2px solid; left:"+data[j][0][2][i][0]+"px; top:"+data[j][0][2][i][1]+"px; width:"+data[j][0][2][i][2]+"px; height:"+data[j][0][2][i][3]+"px; opacity:0.4; cursor:pointer; filter: alpha(opacity=40);z-index:"+zindex1+";", onmouseover:enter_method, onclick:"TASRightView.gbl.select_block(this);"}, this.ImgDivId);
                if (data[j][0][3][i] != 4){
                    var dblclick_div = this.createDom('div', {id:i+'_'+j+'_0', gid:data[j][0][0]+'!!'+data[j][0][1][i]+'!!'+data[j][0][3][i]+'!!'+data[j][0][4][i], style:"position:absolute;z-index:"+(9998+zindex)+"; left:"+(data[j][0][2][i][0]+data[j][0][2][i][2]-8)+"px; top:"+(data[j][0][2][i][1])+"px; width:10px; height:10px; opacity:0.9;cursor:pointer;  background:"+color+";",onclick:"TASRightView.gbl.toggle_color(this)"}, this.ImgDivId);
                    dblclick_div = this.createDom('div', {id:data[j][0][0]+'!!'+data[j][0][1][i]+'!!'+data[j][0][3][i]+'!!'+data[j][0][4][i]+"_done", style:"display:none;position:absolute;z-index:"+(9998+zindex)+"; left:"+(data[j][0][2][i][0]+data[j][0][2][i][2]+2)+"px; top:"+(data[j][0][2][i][1])+"px; width:15px; height:16px;"}, this.ImgDivId);
                    Imgtick = "url('images/tick_res_new.png')";
                    dblclick_div.style.background = Imgtick;
                }
                if (data[j][0][4][i] != 0){
                    dblclick_div = this.createDom('div', {gid:data[j][0][0]+'!!'+data[j][0][1][i]+'!!'+data[j][0][3][i]+'!!'+data[j][0][4][i], style:"position:absolute; border:"+color+" 1px solid; z-index:"+(9998+zindex)+"; left:"+(data[j][0][2][i][0]+data[j][0][2][i][2]-10)+"px; top:"+(data[j][0][2][i][1]-12)+"px; width:11px; height:10px; opacity:0.9; padding:0px; line-height:30%; font-size:20px; margin:0px;cursor:pointer;" ,onclick:"TASRightView.gbl.delete_user_group(this)"}, this.ImgDivId);
                    dblclick_div.innerHTML  = '×';

                }
                zindex -= 10;    
            }
            zindex = 51
            var classname = "";
            for(var i=0; data[j][1].length > 0 && i<data[j][1][0].length; i++){
                color = (data[j][1][2][i]==2)?'#ff0000':(data[j][1][2][i]==3)?'#0000ff':'#C3C3C3';
                classname = (data[j][1][3][i]==1)?"active_kve_classified_div":"";
                var main_div = this.createDom('div', {class:classname, id:data[j][0][0]+'!!'+data[j][1][0][i]+'!!'+data[j][1][2][i]+'!!'+data[j][1][3][i]+'!!'+data[j][1][4][i], ref_id:i+'_'+j+'_1', gid:data[j][1][2][i], style:"position:absolute; border:"+color+" 2px solid; left:"+data[j][1][1][i][0]+"px; top:"+data[j][1][1][i][1]+"px; width:"+data[j][1][1][i][2]+"px; height:"+data[j][1][1][i][3]+"px; opacity:0.4;cursor:pointer; filter: alpha(opacity=40);z-index:"+zindex+";", onclick:"TASRightView.gbl.highlight_taxonomy("+data[j][1][4][i]+")"}, this.ImgDivId);

                var dblclick_div = this.createDom('div', {gid:data[j][0][0]+'!!'+data[j][1][0][i]+'!!'+data[j][1][2][i]+'!!'+data[j][1][3][i]+'!!'+data[j][1][4][i], style:"position:absolute; border:"+color+" 1px solid; z-index:"+(9998+zindex)+"; left:"+(data[j][1][1][i][0]+data[j][1][1][i][2]-10)+"px; top:"+(data[j][1][1][i][1]-12)+"px; width:10px; height:10px; opacity:0.9; padding:0px; line-height:30%; cursor:pointer; font-size:20px; margin:0px;" ,onclick:"TASRightView.gbl.delete_group(this)"}, this.ImgDivId);
                    dblclick_div.innerHTML  = '×';
                zindex += 10;    
            }

        }
    }
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
        var dblclick_div = this.createDom('div', {id:crop_id+"_toggle", gid:crop_id, style:"position:absolute;z-index:"+(9998+zindex)+"; left:"+(Number(fields[0])+Number(fields[2])-8)+"px; top:"+fields[1]+"px; width:10px; height:10px; opacity:0.9;  background:"+color+";"}, this.ImgDivId);
    }

    this.highlight_taxonomy = function(kv_taxo_id){
		return TASApp.gbl.search_tab.highlight_kv_taxonomy_content(kv_taxo_id);
    }
    this.delete_user_group = function(elem){
        var r=confirm("Do you want To Delete the selected User Group ");
        if (r==true) {
           this.cgi_delete_user_group(elem);
        }else
            return;
    }
    this.delete_group = function(elem){
        var r=confirm("Do you want To Delete the selected Group ");
        if (r==true) {
           this.cgi_delete_group(elem);
        }else
            return;
    }
    this.cgi_delete_user_group = function(elem){
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 9;
        json['ref_id'] = elem.getAttribute('gid');
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        this.Log("Delete User GR CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1,  "TASRightView.gbl.reload_groups(json)", "GET", true);
    }
    this.cgi_delete_group = function(elem){
        this.show_process_bar();
        var json   = JSON.parse(JSON.stringify(this.gbl_ref_json_info));
        json['cmd_id'] = 6;
        json['ref_id'] = elem.getAttribute('gid');
        var vservice_path  = this.gbl_data.server_cgi_path + this.gbl_cgi_script_file_path + this.gbl_cgi_script_file_name + '?input_str=';
        vservice_path      += JSON.stringify(json);
        this.Log("Delete CGI... "+vservice_path+" === ");
        this.send_ajax_request(vservice_path, null, 1,  "TASRightView.gbl.reload_groups(json)", "GET", true);
    }
    this.reload_groups = function(json){   
        this.insertOnlyHTMLimg();
        this.hide_process_bar();
    }

    this.load_blocks_no_highlight = function(idata){
        data = idata[0];
        this.hide_process_bar();
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
    this.load_blocks_no_highlight_scroll = function(data){
        this.hide_process_bar();
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
    }
    this.change_blue_color = function(elem, actelm){
        actelm.style.borderColor = '';
        actelm.style.borderColor = '#0000ff';
        elem.style.background = '#0000ff';
    }
    this.change_red_color = function(elem, actelm){
        actelm.style.borderColor = '';
        actelm.style.borderColor = '#ff0000';
        elem.style.background = '#ff0000';
    }
    this.insert_rows_leftside = function(div_list, kv_ref_id){
         return TASApp.gbl.search_tab.kve_addMarkRow(div_list, kv_ref_id);
    }

    this.toggle_color = function(elem){
            var rid = elem.getAttribute('gid');
            var actelm = this.Id(rid);
            var user_rid = actelm.getAttribute('gid');
            var change_state;
            if (user_rid=='2'){
                user_rid = '3'
                change_state = this.change_blue_color;
            }else if (user_rid=='3'){
                user_rid = '2'
                change_state = this.change_red_color;
            }
            selected_div_list = [];
            selected_div_list.push(actelm.id+"#"+user_rid);
            var taxo_exist_flag = this.insert_rows_leftside(selected_div_list, this.gbl_data.ref_id);
            if (taxo_exist_flag){
                change_state(elem, actelm);
                actelm.setAttribute('gid', user_rid);
                console.log("Highlight div : "+rid+" cgid : "+user_rid);
                actelm.className = 'active_kve_selected_div';
                actelm.style.background = "";
                this.Id(actelm.id+"_done").style.display = "block";
            }
            else{
                alert('Please select taxonomy..');
            }
        
    }
    this.delete_block = function(div_id){
        var del_div = this.Id(div_id);
        if (del_div)
            del_div.className = '';
        if (this.Id(div_id+"_done"))
            this.Id(div_id+"_done").style.display = "none";
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
    this.get_kv_type = function(){
         return TASApp.gbl.select_key_value_type;
    }
    this.select_block_enter = function(elem, ev){
        if(this.start_mouse_down){
            var kv_type = this.get_kv_type();
            var rid = elem.getAttribute('gid');
            var ref_id = elem.getAttribute('ref_id');
        
            if (kv_type != 0 && rid != kv_type){
                this.Id(ref_id).click();
            }
            else{
                this.select_block(elem)
            }
        }
        return false;
    }
    this.select_block = function(elem){
        console.log(elem.className);
        if (elem.className == 'active_kve_selected_div'){
            elem.className = '';
            elem.style.background = elem.getAttribute('bg_color');
		    TASApp.gbl.search_tab.kve_deleteMarkRow(elem.id);
            this.Id(elem.id+"_done").style.display = "none";
            return;
        }
        selected_div_list = [];
        selected_div_list.push(elem.id+"#"+elem.getAttribute('gid'));
        var taxo_exist_flag = this.insert_rows_leftside(selected_div_list, this.gbl_data.ref_id);
        if (taxo_exist_flag){
            console.log("Highlight div : "+elem.id+" cgid : "+elem.getAttribute('gid'));
            elem.className = 'active_kve_selected_div';
            elem.style.background = "";
            this.Id(elem.id+"_done").style.display = "block";
        }
        else{
            alert('select taxonomy..');
        }
    }
}).apply(MappingView.prototype);

function active_mapping_view(data){
    TASRightView.gbl = new MappingView();
    TASRightView.gbl.init(data);
    return TASRightView.gbl;
}
