
    var doc_id              = '';
    gbl_ServerCgiPath       = '';
    gbl_ServerImagePath     = '';
    var project_id          = '';
    var user_id             = '';
    var stage_id            = '';
    var mgmt_id             = '';
    var url_id              = '';
    var agent_id            = '';
    var cmd_id              = '';
    var rejson              = '';
    var sub_taxo_id_ar      = '';
    var load_flg            = false;
    var content_tr          = null;
    var vurl_path           = 'http://172.16.20.163/';

function insertOnlyHTMLimg(){
    var load_flg            = getQuerystring('loadFlg');
    document.getElementById('right_div').innerHTML = '';
    if(load_flg == 'false'){
        return;
    }

    doc_id              = getQuerystring('doc_id');
    gbl_ServerCgiPath       = getQuerystring('cgi_server_path');
    gbl_ServerImagePath     = getQuerystring('doc_server_path');
    project_id          = getQuerystring('project_id');
    user_id             = getQuerystring('user_id');
    stage_id            = getQuerystring('stage_id');
    mgmt_id             = getQuerystring('mgmt_id');
    url_id              = getQuerystring('url_id');
    agent_id            = getQuerystring('agent_id');
    cmd_id              = getQuerystring('cmd_id');
    sub_taxo_id_ar      = sessionStorage.sub_taxo_id_ar;
    global_taxo_dict    = sessionStorage.global_taxo_dict;
    rejson              = '';
    rejson              = eval(sessionStorage.rejson);
    draw_extd_valdiation_tableA(rejson,sub_taxo_id_ar);
}

draw_extd_valdiation_tableA  = function(rejson, sub_taxo_id_ar){
    date_subset_count_json = JSON.parse(sessionStorage.getItem('date_subset_count_json'));
    var right_div       = document.getElementById('right_div');
    right_div.innerHTML = '';
    var table       = createDom("table", {id:'valid_edit_table', style:"color:#000000", class:'bordered'},right_div);
    var tr          = createDom("tr",{},table);
    var th          = createDom("th", {txt:'Sr No.'},tr);
    eval(sub_taxo_id_ar).forEach(function(value){
        global_taxo_dict_new = JSON.parse(global_taxo_dict);
        var th      = createDom("th", {txt:global_taxo_dict_new[value]},tr);
        var clean_chk   = createDom("input", {type:'checkbox', name:'clean_up_chk', value:global_taxo_dict_new[value], style:'margin-left:5px', onchange:'select_all_chk(this)'},th);
    });
    var th          = createDom("th", {txt:'Date Error'+' ['+date_subset_count_json['Date Error']+']'},tr);
    var th          = createDom("th", {txt:'Subset Error'+' ['+date_subset_count_json['Subset Error']+']'},tr);
    var th          = createDom("th", {txt:'Show Image', style:'width:5%;'},tr);
        for(var i=0; i<rejson.length; i++){
            var tr      = createDom("tr", {metadata:rejson[i]['metadata']},table);
            var td      = createDom("td", {txt:i+1, style:'width:40px;text-align:center;'},tr);
            eval(sub_taxo_id_ar).forEach(function(value){
                var td      = createDom("td", { taxo_id:value},tr);
                var chk     = createDom('input',{name:'selected_td_chk',type:'checkbox',style:'float:left; margin-right:8px;margin-top:11px;',onchange:'make_editable_span(this)'},td);
                var span    = createDom("p", {txt:rejson[i][value]},td);
        });
    var td  = createDom("td", {},tr);
    if (rejson[i]['Date Error'])
        td.textContent  = rejson[i]['Date Error']
    else
        td.textContent  = '-'
    var td              = createDom("td",  {},tr);
    if (rejson[i]['Subset Error'])
        td.textContent  = rejson[i]['Subset Error']
    else
        td.textContent  = '-'
    var td          = createDom("td", {},tr);
    var inp         = createDom("input", {type:"button",value:'View Source',style:'padding:1px 5px;',class:'btn_zoom_in_out_cl', onclick:'display_image(this)'},td);

    }

}


display_image       = function(elem){
    var tr      = elem.parentNode.parentNode;
    if(content_tr){
        content_tr.style.background = '';
    }
    content_tr                  = tr;
    tr.style.background         = '#D7D7D7';
    tr.style.backgroundImage    = 'linear-gradient(to bottom, #d7d7d7, #999999)';
    var meta_data               = tr.getAttribute('metadata');
    var doc_id                  = meta_data.split(':$@$:')[3];
    var image_path              = vurl_path+'/TR_Legal_2013_12_23_web/data/image/4/'+doc_id+'/'+doc_id+'-page-1.png';
    console.log(image_path);
    var image_div               = document.getElementById('image_right_div');
    image_div.innerHTML         = ''
    var image_div               = createDom('img',{style:'float:left;width:auto;height:auto;margin-left:14%;'},image_div);
    image_div.src               = image_path;
}

select_all_chk       = function(ele){
    var all_chk     = document.getElementById('right_div').querySelectorAll('[name=clean_up_chk]');
    for(var x = 0; x<all_chk.length; x++){
        all_chk[x].setAttribute('disabled',true);
    }
    if(ele.disabled)
        ele.disabled = false;
    var th      = ele.parentNode;
    var table   = th.parentNode.parentNode;
    var cell_index  = th.cellIndex;
    if(ele.checked){
        for(var x = 1; x<table.rows.length; x++){
            table.rows[x].cells[cell_index].querySelector('[name=selected_td_chk]').checked = true;
        }
    }
    else{
        for(var x = 0; x<all_chk.length; x++){
                    all_chk[x].disabled = false;
            }

        for(var x = 1; x<table.rows.length; x++){
            table.rows[x].cells[cell_index].querySelector('[name=selected_td_chk]').checked = false;
        }
    }
}

function createDom(elem, attributeJson, parentN){
        var elemDom = parentN.ownerDocument.createElement(elem);
        if("txt" in attributeJson){
                elemDom.innerHTML  = attributeJson["txt"];
                delete attributeJson["txt"];
        }
        for(var attribute in attributeJson){
                elemDom.setAttribute(attribute, attributeJson[attribute])
        }
    if(parentN){
            parentN.appendChild(elemDom)
    }
        return elemDom
}

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
