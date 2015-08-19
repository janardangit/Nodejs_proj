exports.get_mgnt_pages = function(url, mgnt, agent_id, url_id, tas_url, url_status){
        var mgnt_urls       = ( mgnt.length)?"disc-list":''
        url_status      = (url_status == 'Y')?'<img style="float:right" src="images/tick1.png" width="20" height="20" />':'';
        var float_list      = 'float:left;';
        if(tas_url == true && url){
                var home_url    = '<ul style="float:left;width:100%"><li class="home-url '+mgnt_urls+'" style="width:100%">'+'<div style="float:left;;width: 70%;overflow: hidden;height: 25px;text-overflow: ellipsis;white-space: nowrap;">'+url.slice(0,20)+'</div>'+url_status;
            float_list  = 'float:left;';
        }else
                var home_url    = '<ul style="float:left;width:100%;"><li class="home-url '+mgnt_urls+'" style="width:100%"><div style="float:left;;width: 90%;overflow: hidden;height: 16px;text-overflow: ellipsis;white-space: nowrap;">'+url.slice(0,20)+'</div>';
            var final_str   = '';
            mgnt.forEach(function(value, index){
            var mgnt_id = (value['mgmt_id'])?value['mgmt_id']:(index +1);
            var review_img  = '<a href="/mgmt?url_id='+url_id+'&agent_id='+agent_id+'&doc_id='+value['doc_id']+'&mgmt_id='+mgnt_id+'"><img src="images/review.png" style="float:right;margin-right:3px;" width="20" height="20" doc_id="'+value['doc_id']+'" mgnt_id="'+mgnt_id+'" class="review-mgnt" /></a>'
            var flag_green  = '<img src="images/icon_green.png" style="float:right;margin-right:3px;" width="20" height="20" />';
            var flag_red    = '<img src="images/icon_red.png" style="float:right;margin-right:3px;" width="20" height="20" />';
            var edit        = '<img src="images/edit_icon.png" style="float:right;margin-right:3px;" width="20" height="20" class="edit-mgnt" doc_id="'+value['doc_id']+'" mgnt_id="'+mgnt_id+'" />';
            edit        = '';
            var review  =review_img+flag_red;// (value['mgmt_status'] == 'Y' && value['feedback_status'] == "Done")?(review_img+flag_green):(value['mgmt_status'] == 'Y' && value['feedback_status'] == "Not Done")?(review_img+flag_red):(edit+flag_red);
            var mgnt_id_sl_no     = (value['mgmt_id'])?value['mgmt_id']:'';
                final_str   += '<li style="height:26px"><div style="float:left;width: 70%;overflow: hidden;">'+mgnt_id_sl_no+" . "+value['url']+'</div><img style="float:right" class="remove-mgnt" doc_id="'+value['doc_id']+'" src="images/delete_x.png" width="20" height="20" />'+review+'</li>';
            });
            if(final_str != '')
                     final_str      = '<ul class="sub-lists hide" style="'+float_list+'">'+final_str+'</ul>';
            home_url        += final_str+'</li></ul>';
            return home_url;
}

exports.tabs1 = function(json){
             var table1_content = '';
             var data = JSON.parse(json);
             table1_content += "<div style='height: 63.483331298828126px; width:100%; float: left;' id='kve_tab_trained_content'>";
             table1_content += "<table style='border-collapse: collapse;' id='kve_tained_table_prof' width='100%'>";
             table1_content += "<tr><th class='kve_header' width='19%'>Profiles</th><th class='kve_header' width='19%'>Trained</th><th class='kve_header' width='18%'>Cleared</th><th class='kve_header' width='18%'>Not cleared</th><th class='kve_header'>Partial</th></tr>";
                        
             table1_content += "<tr kve_train_index='432' id='kve_trained_prof_1'>";
             table1_content += "<td style='text-align: center; color:#4b606f;' class='prof_td' width='19%'>"+data[0]['total_profiles']+"</td>";
             table1_content += "<td style='text-align: center; color:#4b606f;' class='prof_td' width='19%'>"+data[0]['total_trained']+"</td>";
             table1_content += "<td style='text-align: center; color:#4b606f;' class='prof_td' width='19%'>"+data[0]['total_clear']+"</td>";
             table1_content += "<td style='text-align: center; color:#4b606f;' class='prof_td' width='20%'>"+data[0]['total_pending']+"</td>";
             table1_content += "<td style='text-align: center; color:#4b606f;' class='prof_td' width='20%'>"+data[0]['total_partial']+"</td>";
             table1_content += "</tr></table></div>";
             return table1_content;

}
exports.tabs1_table2 = function(){
            var table_content = '<div style="height: 88.87666381835939px; width:100%; float: left;" id="kve_tab_mark_content"><table id="kve_mark_tab_content_table" width="100%"><thead><tr class="kve_mark_tab_content_table_header"><th width="24%">Mark Index</th><th width="25%">Index Type</th><th width="25%">Topic Name</th><th width="25%"></th></tr></thead><tbody><tr><td colspan="4"><div style="height:63.87666381835939px;overflow: auto;float:left;width:100%"><table style="border-collapse: collapse; border-bottom:#d3e8f7 1px solid;" id="kve_mark_tab_content_table_inner" width="100%"></table></div></td></tr></tbody></table></div>';
            return table_content;
}

exports.tabs1_table3 = function(){
            var table_content = '<div style="height: 190.44999389648436px; width:100%; float: left;" id="kve_tab_taxonomy_content"><div id="kve_taxonomy_header"><ul><li onclick="TASApp.gbl.search_tab.get_crop_coordinates(this);" id="kve_remark_tab">Remark</li><li onclick="TASApp.gbl.search_tab.get_classified_taxonomy(this);" class="active" id="kve_mark_taxonomy_tab">Topic-Classified</li><li onclick="TASApp.gbl.search_tab.get_unclassified_taxonomy(this)" id="kve_unmark_taxonomy_tab">Topic-Unclassified</li><li onclick="TASApp.gbl.search_tab.get_unclassified_group(this)" id="kve_unmark_group_tab">Unclassified-Groups</li></ul></div></div>';
            return table_content;
}

exports.tabs1_table4 = function(){
        var table_content = '<span onclick="TASApp.gbl.search_tab.delete_profiles(this)" id="del-multi" style="float:left;display:none;" class="review-span">Delete</span><span onclick="TASApp.gbl.search_tab.load_profile_view(this)" id="kve_profile_view_tab" style="float: left; padding-left: 5px; color: rgb(77, 217, 191);" class="review-span">Profile</span><span onclick="TASApp.gbl.search_tab.load_topic_view(this)" id="kve_topic_view_tab" style="float: left; padding-left: 5px;" class="review-span">Topic</span><span onclick="TASApp.gbl.search_tab.save_index_data(this)" id="kve_save_tab" style="float:right;padding-left: 20px;display:none;" class="review-span">Save</span><span onclick="TASApp.gbl.search_tab.apply_index_data(this)" id="kve_local_apply_tab" style="float:right;padding-left: 5px;" class="review-span">L.apply</span><span onclick="TASApp.gbl.search_tab.apply_index_data(this)" id="kve_global_apply_tab" style="float:right;padding-left: 20px;" class="review-span">G.apply</span><span onclick="TASApp.gbl.search_tab.show_applied_data(this)" id="kve_apply_agree_tab" style="float:right;padding-left: 20px;display:none;" class="review-span">Agree</span><span onclick="TASApp.gbl.search_tab.clear_canvas_data(this)" id="kve_clear_tab" style="float:right;padding-left: 20px;display:none;" class="review-span">clear</span>';
        table_content += '<===>'+'<div style="height: 25px;" class="sb_kveRemainderMainDiv" id="kve_prof_tab_menu_header1"><div style="background:#7691a4;width:100%;"><ul kve_train_id="0" style="width:49%; float:left; margin:0;" id="kve_index_prof_tab1"><li onclick="TASApp.gbl.search_tab.cgi_add_kve_profile_index_table_tab(1);" id="Tbs_1">Results</li><li style="background: none repeat scroll 0% 0% rgb(52, 73, 94);" onclick="TASApp.gbl.search_tab.cgi_add_kve_profile_index_table_tab(2);" id="Tbs_2">Training Samples</li><li style="display:none;" id="Tbs_3">Results Preview</li></ul><div id="kve_sort_by_menu" style="float:left;width:auto;"><select style="background: none repeat scroll #7691a4;border:1px solid #dedede; color:#fff;float:left;font-size: 11px;font-family: arial;height:20px;margin: 3px 0px;width:120px;" id="kve_sort_prof_tab_menu_drop_down"><option onclick="TASApp.gbl.search_tab.kve_sort_profile_index_table(this)" id="0">Sort By Key Value</option><option onclick="TASApp.gbl.search_tab.kve_sort_profile_index_table(this)" id="1">Sort By Description</option><option onclick="TASApp.gbl.search_tab.kve_sort_profile_index_table(this)" id="2">Sort By Header</option><option onclick="TASApp.gbl.search_tab.kve_sort_profile_index_table(this)" id="3">Sort By ProfileId</option><option onclick="TASApp.gbl.search_tab.kve_sort_profile_index_table(this)" id="4">Sort By Level</option></select></div><div style="float:right;"><img style="display: block;" onclick="TASApp.gbl.search_tab.configure_signature(this)" id="kve_configure_signature_type_drop_down" alt="Configure" src="http://172.16.20.163/TAS_Webprofiler_v1/images/setting_black.png"></div></div></div>';
        return table_content;
}

exports.store_default_taxos_new = function(json){
        var stage_taxo_ids	= {};
        var taxo_ids_filter	= {};
        var taxo_mapping	= {};
        var taxo_name_mapping	= {};
        var taxonomy = {};
        for (var key in json){
            var value = json[key];
            taxonomy[value.taxo_id]   = value;
            for(var stage_ids in value.stage_ids){
                //var stage_ids	= Object.keys(value.stage_ids).join("_");
                if(!(stage_ids in stage_taxo_ids)){
                    stage_taxo_ids[stage_ids]	= [];
                    taxo_ids_filter[stage_ids]	= {};
                }
                taxo_ids_filter[stage_ids][value.taxo_id]	= value.taxo_name;
                stage_taxo_ids[stage_ids].push({id:value.taxo_id, name:value.taxo_name, ref_taxo_id:value.ref_taxo_id, taxo_flg:value.taxo_flg, isLink:value.isLink, stage:value.stage_ids, isDisplay:value.isDisplay});
            }
            taxo_mapping[value.taxo_id] = value.taxo_name;
            taxo_name_mapping[value.taxo_name.toLowerCase()]	= {id:value.taxo_id, name:value.taxo_name};
            if( /^\d+$/.test(value.ref_taxo_id))
                taxo_mapping[value.ref_taxo_id] = value.taxo_name+" Link";
        }
        //taxo_name_mapping['Empty']	= {id:'', name:'Empty'};
        taxo_mapping[undefined]	= '';
        return {'taxo_name_mapping':taxo_name_mapping, 'stage_taxo_ids':stage_taxo_ids};
    }

