function UserLoginAction(){
	Utils.call(this);
    this.user_id = "";
    this.user_name = "";
    this.cgi_script_file_name = "Login_UserMaster/cgi_login_check_service_new.py";
}
UserLoginAction.prototype		= new Utils();
UserLoginAction.prototype.constructor	= UserLoginAction;
(function(){
    this.activateLogin = function() {
	    this.Logger.push("caller === "+arguments.callee.caller);
	    var cgi             = TASApp.config.CGI_IP+TASApp.config.CGI_DIR + this.cgi_script_file_name+'?input_str=';
	    var vlogin_id       = this.Id("txtuser_id").value.trim();
	    var vuser_passwd    = this.Id("txtuser_passwd").value.trim();
        if( '' == vlogin_id || '' == vuser_passwd){
	        alert("User and Password should not be empty");
            return;
        }
        sessionStorage['password'] = vuser_passwd;
	    var jsonObj                 = { 'login_id': vlogin_id, 'upasswd': vuser_passwd};
        this.Id("txtuser_id").value      = '';
	    this.Id("txtuser_passwd").value  = '';
	    cgi                         = cgi + JSON.stringify(jsonObj);
        //	alert(cgi)
        this.Logger.push("login cgi=====>>"+cgi); 
        this.send_ajax_request(cgi, null, 1, "TASApp.UserLoginAction.validate_login(text, json)", "GET", true);
    }
    this.validate_login = function(txt, json){
        txt = txt.trim();
        if( !json || 0 == json.length ){
	        alert("Incorrect Login Details..");
			this.Id("txtuser_id").focus();
            return;
        }
        json			= json[0];
        TASApp.gbl.login_id 	= json['login_id'];
        TASApp.gbl.name 	    = json['user_name'];
        TASApp.gbl.role	        = json['user_role'];
    	TASApp.gbl.user_id 	    = json['user_id'];
        TASApp.gbl.projects	    = json['data'];
        TASApp.gbl.batch_id 	= json['data'][0]['batch_id'];
        TASApp.gbl.project_id	= json['data'][0]['project_id'];
        TASApp.gbl.project_name	= json['data'][0]['project_name'];
        TASApp.gbl.login_json   = json;
        sessionStorage['login_id']      = json['login_id'];
        sessionStorage['name']           = json['user_name'];
        sessionStorage['role']          = json['user_role'];
        sessionStorage['user_id']       = json['user_id'];
        sessionStorage['projects']      = json['data'];
        sessionStorage['batch_id']      = json['data'][0]['batch_id'];
        sessionStorage['project_id']    = json['data'][0]['project_id'];
        sessionStorage['project_name']  = json['data'][0]['project_name'];
        sessionStorage['login_json']    = json;

        sessionStorage['login_flg'] = true;
        sessionStorage['doc_flg'] = true;
        sessionStorage['index_flg'] = false;
        
        this.Go_To_Host();
    } 
    this.process_assigned_ip = function(){
        var json                = TASApp.gbl.login_json;
        //try{this.get_default_taxos_new()}catch(e){this.Log("get_default_taxos() Error "+e);}
        try{this.add_tree_css()}catch(e){this.Log("add_css_tree() Error "+e);}
        delete TASApp['gbl']['login_json'];
    }
    this.get_default_taxos_new = function(){
        var json	= {project_id:TASApp.gbl.project_id};
        var cgi   = TASApp.config.CGI_IP+TASApp.config.CGI_DIR + 'GetData_master_taxonomy/cgi_getdata_service_interface.py?input_str='+JSON.stringify(json);
        this.Logger.push("get_default_taxos === "+cgi);
        this.send_ajax_request(cgi, null, 1,"TASApp.UserLoginAction.store_default_taxos_new(json)", "GET", true);
    }
    this.add_tree_css = function(){
        var head	= this.doc.getElementsByTagName("head")[0];
        var img_path	= TASApp.config.IP+TASApp.config.JS_DIR+'images/';
        var texts	= '#collapsetree li a{background:url('+img_path+'bullet.gif) center left no-repeat;}\n#collapsetree li.click a{background:url('+img_path+'bullet.gif) center left no-repeat}\n#collapsetree ul li.click a{background:url('+img_path+'bullet.gif) center left no-repeat}\n#collapsetree li a.subMenu,#collapsetree ul li a.subMenu{background:url('+img_path+'plus.gif) center left no-repeat}\n#collapsetree li a.click{background:url('+img_path+'minus.gif) center left no-repeat}\n#collapsetree ul li a.click{background:url('+img_path+'minus.gif) center left no-repeat}\n';
        this.createDOM("style",{type:"text/css", txt:texts}, head);
    }
    this.store_default_taxos_new = function(json){
        this.Log("Calling ");
        TASApp.gbl.stage_taxo_ids	= {};
        TASApp.gbl.taxo_ids_filter	= {};
        TASApp.gbl.taxo_mapping	= {};
        TASApp.gbl.taxo_name_mapping	= {};
        TASApp.gbl.taxonomy = {};
        json.forEach(function(value){
            TASApp.gbl.taxonomy[value.taxo_id]   = value;
            for(var stage_ids in value.stage_ids){
                //var stage_ids	= Object.keys(value.stage_ids).join("_");
                if(!(stage_ids in TASApp.gbl.stage_taxo_ids)){
                    TASApp.gbl.stage_taxo_ids[stage_ids]	= [];
                    TASApp.gbl.taxo_ids_filter[stage_ids]	= {};
                }
                TASApp.gbl.taxo_ids_filter[stage_ids][value.taxo_id]	= value.taxo_name;
                TASApp.gbl.stage_taxo_ids[stage_ids].push({id:value.taxo_id, name:value.taxo_name, ref_taxo_id:value.ref_taxo_id, taxo_flg:value.taxo_flg, isLink:value.isLink, stage:value.stage_ids, isDisplay:value.isDisplay});
            }
            TASApp.gbl.taxo_mapping[value.taxo_id] = value.taxo_name;
            TASApp.gbl.taxo_name_mapping[value.taxo_name.toLowerCase()]	= {id:value.taxo_id, name:value.taxo_name};
            if( /^\d+$/.test(value.ref_taxo_id))
                TASApp.gbl.taxo_mapping[value.ref_taxo_id] = value.taxo_name+" Link";
        });
        //TASApp.gbl.taxo_name_mapping['Empty']	= {id:'', name:'Empty'};
        TASApp.gbl.taxo_mapping[undefined]	= '';
        this.dump_json_data(TASApp.gbl.stage_taxo_ids);
        sessionStorage['stage_taxo_ids'] = JSON.stringify(TASApp.gbl.stage_taxo_ids);
        sessionStorage['taxo_ids_filter'] = JSON.stringify(TASApp.gbl.taxo_ids_filter);
        sessionStorage['taxo_mapping'] = JSON.stringify(TASApp.gbl.taxo_mapping);
        sessionStorage['taxo_name_mapping'] = JSON.stringify(TASApp.gbl.taxo_name_mapping);
        sessionStorage['taxonomy'] = JSON.stringify(TASApp.gbl.taxonomy);
    }
    this.LoadUserData = function(){
	    this.user_id = sessionStorage.user_id;
    	var login_flg = sessionStorage.login_flg; 
    	if(login_flg == 'true'){
        	if(sessionStorage.doc_flg == 'true'){
            	if(sessionStorage.page_no == 1){
		                var cgi             = TASApp.config.CGI_IP+TASApp.config.CGI_DIR + 'Login_UserMaster/cgi_login_check_service_new.py?input_str=';
        		        var jsonObj                 = { 'login_id': sessionStorage.login_id, 'upasswd': sessionStorage.password};
                		cgi                         = cgi + JSON.stringify(jsonObj);
                        this.Logger.push('Login : '+cgi)
	                	this.send_ajax_request(cgi, null, 1, "TASApp.UserLoginAction.validate_login(text, json)", "GET", true);

        		}else if(sessionStorage.page_no == 2){
                		TASApp.gbl.project_id   = sessionStorage.project_id;
                        TASApp.config.IP = sessionStorage['IP'];
                        TASApp.config.IMG_IP = sessionStorage['IMG_IP'];
                        TASApp.config.CGI_IP = sessionStorage['CGI_IP'];
                		this.Go_To_Mgmt();
        		}else if(sessionStorage.page_no == 3){
		                TASApp.gbl.login_id     = sessionStorage.login_id;
                		TASApp.gbl.name         = sessionStorage.user_name;
			            TASApp.gbl.role         = sessionStorage.user_role;
        			    TASApp.gbl.user_id      = sessionStorage.user_id;
	                	TASApp.gbl.projects     = sessionStorage.projects;
        		        TASApp.gbl.batch_id     = sessionStorage.batch_id;
                		TASApp.gbl.project_id   = sessionStorage.project_id;
		                TASApp.gbl.project_name = sessionStorage.project_name;
        		        TASApp.gbl.login_json   = sessionStorage.login_json;
            
                		TASApp.gbl.mdoc_id      = sessionStorage.mdoc_id;
		                TASApp.gbl.agent_id     = sessionStorage.agent_id;
                		TASApp.gbl.url_id       = sessionStorage.url_id;
		                TASApp.gbl.mgmt_id      = sessionStorage.mgmt_id; 
                		TASApp.gbl.extract_flag = true;
		                TASApp.gbl.trees['mark_flag_'+TASApp.gbl.mdoc_id] = 'Y';
                        
                        TASApp.config.IP = sessionStorage['IP'];
                        TASApp.config.IMG_IP = sessionStorage['IMG_IP'];
                        TASApp.config.CGI_IP = sessionStorage['CGI_IP'];
                		this.process_assigned_ip();
                		this.Go_To_Mgmt();
			    }
	        }else if(sessionStorage.index_flg == 'true'){
                alert('111');
	        	this.Go_To_Url_menu_page(sessionStorage.prev_row);
		    }
	    }else if(login_flg == 'false' || login_flg == undefined){ 
            this.Go_To_Login();
    	}
    }
    this.Go_To_Host = function(){
        sessionStorage.page_no = 1;
	    this.Id("main_container1").style.display = "none";
	    this.Id("main_container2").style.display = "block";
        this.Id("logout_img").style.display = "block";
        this.Id("back_Ip").style.display = "none";
        TASApp.URL.load_Ip_lists();
    }
    this.Go_To_Mgmt = function(){
	    this.Id("main_container1").style.display = "none";
	    this.Id("main_container2").style.display = "block";
        this.Id("back_Ip").style.display = "block";
        this.Id("logout_img").style.display = "block";
        sessionStorage['doc_flg'] = true;
        sessionStorage['page_no'] = 2;
        sessionStorage['index_flg'] = false;
        sessionStorage['tab_no'] = 0; 
		this.Id('ip_address').innerHTML = TASApp.config.CGI_IP.split('//').slice(-1)[0].split('/')[0];
        try{this.get_default_taxos_new()}catch(e){this.Log("get_default_taxos() Error "+e);}
        TASApp.URL.get_url_lists();
    }   
    this.Go_To_Logout = function()
    {
        this.Go_To_Login();
    	window.location.href = 'index.html';
    }
    this.Go_To_Login = function()
    {
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
    }
    this.Go_To_Url_menu_page = function(row_cnt_t)
    {
        sessionStorage['doc_flg'] = false;
        sessionStorage['index_flg'] = true;
        sessionStorage['prev_row'] = row_cnt_t;
    	//window.location.href = 'index.html';
    }
    
}).apply(UserLoginAction.prototype);
TASApp.UserLoginAction = new UserLoginAction();
