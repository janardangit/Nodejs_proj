var TASApp  = new Object();
TASApp.sessionid = null;
TASApp.socket = io.connect();
TASApp.socket.on('connect', function() {
   console.log('check 2', TASApp.socket.connected);
   TASApp.sessionid = TASApp.socket.io.engine.id;
});

TASApp.config   = { 
        IP      	        : "http://172.16.20.163/",
        IMG_IP  	        : "http://172.16.20.163/",
        CGI_IP  	        : "http://172.16.20.163/",
        CGI_DIR 	        : "cgi-bin/TR_Legal_2013_12_23_web/slt_Code/",
        JS_DIR  	        : "TAS_Webprofiler_v1/",
        DATA_DIR 	        : "TR_Legal_2013_12_23_web/data/output/",
        IMG_PATH	        : "TAS_Webprofiler_v1/image/",
	    PROJECT_PATH	    : "TR_Legal_2013_12_23_web/source/plugin/",
}

sessionStorage['page_no'] = sessionStorage.page_no || 2;
sessionStorage['tab_no'] = sessionStorage.tab_no || 2;
sessionStorage['login_flg'] = 'true';

TASApp.gbl = {
        user_id             : 0,
        agent_id            : 0,
        mgmt_id             : 1,
        doc_id              : 0,
        role                : '',
        name                : '',
        batch_id            : 0,
        login_id            : 0,
	    group_id	    : 1,
        email               : '',
        home_page           : '',
        home_url            : '',
        home_url            : '',
        old_url             : '',
        page_type           : '',
        baseurl             : '',
	    doc_ids		    : {},
	    parent_id	    :"NULL",
	    logo		    : '30px',
	    tab		    : '30px',
	    tab_menu	    : '25px',
	    tree_header   	    : '25px',
	    crop_tool	    : '30px',
	    footer		    : '25px',	
	    extd_indexs	    : [2, 234, 236, 238],
	    page_conti	    : 238,
	    stage_ids	    : [],
	    navigation_taxo	    : [233, 234],
	    pagination_taxo	    : [235, 236, 237, 238],
	    trees	            : {},
	    navigation_index    : [],
	    navigation_dict	    : ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y","Z"],
        sign_on_off_flag    : "Y", 
        APP_ID:'22122014163',
}
TASApp.dom_tree = {record:{}};
TASApp.dom_json_tree = {};
TASApp.gbl.reset_keys	= {
        agent_id            : 0,
        mgmt_id             : 1,
        doc_id              : 0,
        batch_id            : 0,
        home_page           : '',
        home_url            : '',
        home_url            : '',
        old_url             : '',
        page_type           : '',
        baseurl             : '',
	    doc_ids		    : {},
	    parent_id	    :"NULL",
}

TASApp.loadjscssfile = function(filename, filetype, callback){
        if (filetype=="js"){
            var fileref=document.createElement('script');
            fileref.setAttribute("type","text/javascript");
            fileref.setAttribute("src", filename);
            fileref.async = false;
            fileref.onload = callback;
        }
        else if (filetype=="css"){
            var fileref=document.createElement("link");
            fileref.setAttribute("rel", "stylesheet");
            fileref.setAttribute("type", "text/css");
            fileref.setAttribute("href", filename);
        }
        if (typeof fileref!="undefined")
            document.getElementsByTagName("head")[0].appendChild(fileref);
}

TASApp.socket.on("gbl_data", function(json){
    //console.log("=====>"+JSON.stringify(json.taxo_mapping.stage_taxo_ids));
    TASApp.gbl.user_id    = json.user_id;
    TASApp.gbl.agent_id   = json.agent_id;
    TASApp.gbl.mgmt_id    = json.mgmt_id;
    TASApp.gbl.doc_id     = json.doc_id;
    TASApp.gbl.url_id     = json.url_id;
    TASApp.gbl.project_id = json.project_id;
    //TASApp.gbl.taxo_name_mapping = json.taxo_mapping.taxo_name_mapping;
    //document.getElementById('tabli_2').click();
    //console.log('====host : '+json.host_id);
    sessionStorage['user_id'] = json.user_id;
    sessionStorage['batch_id'] = json.batch_id; 
    sessionStorage['project_id'] = json.project_id;
    sessionStorage['agent_id'] = json.agent_id;
    sessionStorage['url_id'] = json.url_id;
    sessionStorage['mgmt_id'] = json.mgmt_id;
    sessionStorage['login_id'] = json.login_id; 
    sessionStorage['user_name'] = json.user_name;
    sessionStorage['user_role'] = json.user_role;
    sessionStorage['IP'] = "http://172.16.20.136/"; 
    sessionStorage['CGI_IP'] = "http://"+json.host_id+"/";
    sessionStorage['IMG_IP'] = "http://"+json.host_id+"/";
    sessionStorage['stage_taxo_ids'] = JSON.stringify(json.taxo_mapping.stage_taxo_ids);
    sessionStorage['taxo_ids_filter'] = JSON.stringify({}); 
    sessionStorage['taxo_mapping'] = JSON.stringify({}); 
    sessionStorage['taxo_name_mapping'] = JSON.stringify(json.taxo_mapping.taxo_name_mapping); 
    sessionStorage['taxonomy'] = JSON.stringify({});
    sessionStorage['DOC_MAP_PW_PH'] = JSON.stringify({}); 
    TASApp.socket.disconnect();
    TASApp.socket.removeAllListeners('connect');
});
