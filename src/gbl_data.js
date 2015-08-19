/*******************************************************************************
 * Author   : Angamuthu G
 * Date     : Jan 16, 2014
 * Brief    : Initialize global variables
 *
 ********************************************************************************/ 
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
