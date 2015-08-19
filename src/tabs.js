Mapping = null; 
Filter_Level_One = null;
SubUnits = null;
Filter = null;
function TABAction(){
	Utils.call(this);
}
TABAction.prototype		= new Utils();
TABAction.prototype.constructor	= TABAction;
(function(){
    this.switch_tabs = function(tab_number){ 
        var children = this.Id('right_section').children;
        for (var ind=0; ind<children.length; ind++){
            children[ind].style.display = "none";
        }
        var tab_number = Number(tab_number);
        sessionStorage['tab_no'] = tab_number;
    	var content_div	= this.Id("contentDiv");
	    try{content_div.removeChild(this.Id("hide_main_content_div"))}catch(e){}
        if (tab_number >=0){
	        this.higlight_selected_tab(tab_number);
         }

    	TASApp.gbl.active_tab_id	= tab_number;
	    TASApp.gbl.active_stage_id	= 1;
    	switch(tab_number){
            case 2:
                TASApp.gbl.stage_ids	= ['3'];
                TASApp.gbl.active_stage_id	= 3;
                this.active_mapping();
            break;
            case 3:
                TASApp.gbl.stage_ids	= ['7'];
                TASApp.gbl.active_stage_id	= 7;
                this.active_first_level_filter();
            break;
            case 4:
                TASApp.gbl.active_stage_id  = 7;
                this.active_SubUnits_level_filter_data();
                TASApp.gbl.filter_extraction_flag   = false;
                TASApp.gbl.filter_mark_flag     = false;
            break;
            case 5:
                TASApp.gbl.active_stage_id  = 7;
                this.active_validation_tab();
                TASApp.gbl.filter_extraction_flag   = false;
                TASApp.gbl.filter_mark_flag     = false;
            break;
            case -1:
                this.unset_sidebar_tab_click();
        }
    }
    this.switch_filter_sub_tabs = function(sub_tab_number){
        var children = this.Id('right_section').children;
        for (var ind=0; ind<children.length; ind++){
            children[ind].style.display = "none";
        }
        var sub_tab_number = Number(sub_tab_number);
        sessionStorage['sub_tab_no'] = sub_tab_number;
        this.higlight_selected_sub_tab(sub_tab_number);
        switch(sub_tab_number){
            case 1:
	            TASApp.gbl.search_tab	= new Filter_Level_One();
	            TASApp.gbl.stage_ids	= ['3'];
	            TASApp.gbl.active_stage_id	= 22;
                TASApp.gbl.search_tab.init();
            break
            case 2:
                this.active_filter_validation_tab();
            break
            case 3:
                this.active_filter_reclassification_tab();
            break
            case 4:
                this.active_filter_duplication_tab();
            break
            case 5:
                this.active_clone_tophic_units_tab();
            break
        }

    }
    this.higlight_selected_sub_tab = function(tab_number){
        var tabs	= {1:"filter-sub-tab-1", 2:"filter-sub-tab-2", 3:"filter-sub-tab-3", 4:"filter-sub-tab-4", 5:"filter-sub-tab-5"};
        for(var key in tabs){
            this.Id(tabs[key]).setAttribute("class","tab_menu_inactive");
        }
        this.Id(tabs[tab_number]).setAttribute("class","tab_menu_active");
    }
    this.LoadTab = function(){
    	var login_flg = sessionStorage.login_flg; 
        //alert("==="+login_flg + "==="+sessionStorage.page_no+"======="+sessionStorage.tab_no);
    	if(login_flg == 'true'){
            if(sessionStorage.page_no == 2){
                TASApp.gbl.login_id     = sessionStorage.login_id;
                TASApp.gbl.name         = sessionStorage.user_name;
                TASApp.gbl.role         = sessionStorage.user_role;
                TASApp.gbl.user_id      = sessionStorage.user_id;
                TASApp.gbl.batch_id     = sessionStorage.batch_id;
                TASApp.gbl.project_id   = sessionStorage.project_id;
                TASApp.gbl.project_name = sessionStorage.project_name;
                TASApp.gbl.agent_id     = sessionStorage.agent_id;
                TASApp.gbl.url_id       = sessionStorage.url_id;
                TASApp.gbl.mgmt_id      = sessionStorage.mgmt_id; 
                TASApp.config.IP           = sessionStorage.IP;
                TASApp.config.CGI_IP       = sessionStorage.CGI_IP;
                TASApp.config.IMG_IP       = sessionStorage.IMG_IP;
                TASApp.gbl.stage_taxo_ids = JSON.parse(sessionStorage.stage_taxo_ids);
                TASApp.gbl.taxo_ids_filter = JSON.parse(sessionStorage.taxo_ids_filter);
                TASApp.gbl.taxo_mapping = JSON.parse(sessionStorage.taxo_mapping);
                TASApp.gbl.taxo_name_mapping = JSON.parse(sessionStorage.taxo_name_mapping);
                TASApp.gbl.taxonomy = JSON.parse(sessionStorage.taxonomy);
                TASApp.gbl.DOC_MAP_PW_PH = JSON.parse(sessionStorage.DOC_MAP_PW_PH);
                //this.Id('ip_address').innerHTML = TASApp.config.CGI_IP.split('.').slice(-1)[0].split('/')[0]+", "+TASApp.gbl.agent_id+", "+TASApp.gbl.mgmt_id+", "+TASApp.gbl.url_id;
				this.Id('ip_address').innerHTML = TASApp.config.CGI_IP.split('.').slice(-1)[0].split('/')[0]+": "+TASApp.gbl.agent_id+"- "+TASApp.gbl.mgmt_id+"- "+TASApp.gbl.url_id;
                this.switch_tabs(sessionStorage.tab_no);
            }
            else{
    	        this.Go_To_Login();
            }
	    }else if(login_flg == 'false' || login_flg == undefined){ 
    	    this.Go_To_Login();
        }
    }
    this.set_sidebar_tab_click = function(){
        Id("tabli_2").onclick = this.switch_tabs(2);
        Id("tabli_3").onclick = this.switch_tabs(3);
        Id("tabli_4").onclick = this.switch_tabs(4);
        Id("tabli_5").onclick = this.switch_tabs(5);
    }

    this.unset_sidebar_tab_click = function(){
        Id("tabli_0").setAttribute("onclick", "");
        Id("tabli_1").setAttribute("onclick", "");
        Id("tabli_2").setAttribute("onclick", "");
        Id("tabli_3").setAttribute("onclick", "");
    }
    this.higlight_selected_tab = function(tab_number){
        var tabs	= {2:"tabli_2", 3:"tabli_3", 4:"tabli_4", 5:"tabli_5" };
        for(var key in tabs){
            this.Id(tabs[key]).setAttribute("class","n_active");
        }
        this.Id(tabs[tab_number]).setAttribute("class","active");
    }
    this.Go_To_Login = function(){
        window.location.href = 'index.html';
    }
    this.Logout = function(){
        sessionStorage.doc_id = '';
       	sessionStorage.user_id = '';
       	sessionStorage.user_name = '';
       	sessionStorage.page_no = '';
       	sessionStorage.cb_batch_cnt = '';
       	sessionStorage.login_flg = false;
        sessionStorage['doc_flg'] = false;
        sessionStorage['index_flg'] = false;
        sessionStorage['prev_row'] = 0;
        sessionStorage['tab_no'] = 0;
        window.location.href = 'index.html';
    }
    this.Go_To_Mgmt = function(){
        window.location.href = 'index.html';
    }
    this.active_mapping = function(){
        if (!!Mapping){
            this.load_mapping();
        }
        else{
            this.loadJS('src/mapping.js', this.load_mapping)
            TASApp.loadjscssfile('src/mapping_view.js', "js", '');
        }

    }
    this.load_mapping = function(){
        TASApp.gbl.search_tab	= new Mapping();
	    TASApp.gbl.stage_ids	= ['3'];
    	TASApp.gbl.active_stage_id	= 22;
   	    TASApp.gbl.search_tab.active_profile_index();
    }
    this.active_validation_tab = function(){
        if (!!Filter){
            this.load_validation_tab();
        }
        else{
            this.loadJS('src/panelFilterOperation.js', this.load_validation_tab)
        }
    }
    this.active_first_level_filter = function(){
        if (!!Filter_Level_One){
            this.load_first_level_filter();
        }
        else{
            TASApp.loadjscssfile('src/spliter.js', "js", '');
            this.loadJS('src/filter.js', this.load_first_level_filter)
            TASApp.loadjscssfile('src/filter_view.js', "js", '');
        }
    }
    this.active_SubUnits_level_filter_data = function(){
        if (!!SubUnits){
            this.load_active_SubUnits_level_filter_data();
        }
        else{
            this.loadJS('src/popUpProfile_SubUnits.js', this.load_active_SubUnits_level_filter_data)
        }

    } 
    this.load_validation_tab = function(){
        TASApp.gbl.search_tab   = new Filter();
        TASApp.gbl.search_tab.init();
    }
    this.load_active_SubUnits_level_filter_data = function(){
        TASApp.gbl.search_tab   = new SubUnits();
	    TASApp.gbl.stage_ids	= ['3'];
	    TASApp.gbl.active_stage_id	= 22;
	    TASApp.gbl.search_tab.init();
    }
    this.load_first_level_filter = function(){
	    TASApp.gbl.search_tab	= new Filter_Level_One();
	    TASApp.gbl.stage_ids	= ['3'];
	    TASApp.gbl.active_stage_id	= 22;
        TASApp.gbl.search_tab.active_filter()
    }
    this.active_filter_validation_tab = function(){
        if (!!Filter_validation_one){
            this.load_Filter_validation_one();
        }
        else{
            this.loadJS('src/filter_validation1.js', this.load_Filter_validation_one)
        }
    }
    this.active_filter_duplication_tab = function(){
        if (!!Filter_duplication){
            this.load_Filter_duplication();
        }
        else{
            this.loadJS('src/filter_duplication.js', this.load_Filter_duplication)
            TASApp.loadjscssfile('src/filter_duplicate_view.js', "js", '');
        }
    }
    this.active_filter_reclassification_tab = function(){
        if (!!Filter_reclassification){
            this.load_Filter_reclassification();
        }
        else{
            this.loadJS('src/filter_reclassification.js', this.load_Filter_reclassification)
            TASApp.loadjscssfile('src/filter_reclassification_view.js', "js", '');
        }
    }
    this.active_clone_tophic_units_tab = function(){
        if (!!Units_duplication){
            this.load_Units_duplication();
        }
        else{
            this.loadJS('src/filter_units_duplication.js', this.load_Units_duplication)
        }
    }
    this.load_Units_duplication = function(){
        TASApp.gbl.search_tab	=new Units_duplication();
        TASApp.gbl.search_tab.init(); 
    }
    this.load_Filter_reclassification = function(){
        TASApp.gbl.search_tab	=new Filter_reclassification();
        TASApp.gbl.search_tab.init(); 
    }
    this.load_Filter_duplication = function(){
        TASApp.gbl.search_tab	= new Filter_duplication();
        TASApp.gbl.search_tab.init(); 
    }
    this.load_Filter_validation_one = function(){
        TASApp.gbl.search_tab	= new Filter_validation_one();
        TASApp.gbl.search_tab.init(); 
    }

 
}).apply(TABAction.prototype);
TASApp.TAB = new TABAction();
