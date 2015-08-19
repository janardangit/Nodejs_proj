function Utils(){
   this.Logger  = {
        push    :function(msg){
		    try{console.log((new Date())+" ==== "+msg);}catch(e){}
        }
   };  
   this.doc = document;
}
Utils.prototype.constructor	= Utils;
(function(){
    this.init = function(doc){
        this.doc = doc;
    }
    this.create_table = function(attr, parentElem){
        var tDOM        = this.createDOM("table",attr,parentElem);
        return tDOM;
    }
    this.get_table_row = function(table, row_attr, col_name, col_attr){
        var row = this.createDOM("tr", row_attr, table);
        for(var ind = 0, len = col_attr.length; ind < len; ind++){
                this.createDOM(col_name, col_attr[ind], row);
        }
        return row;
    }
    this.create_row_and_cols = function(tDOM, tag_name, attr,data){
        var row         = this.createDOM("tr",{},tDOM);
        for(var ind = 0, len =data.length; ind < len; ind++){
		switch(Object.prototype.toString.call(data[ind])){
                        case "[object Object]":
                                if('class' in data[ind] && 'class' in attr){
                                        attr['class']   =  attr['class']+" "+data[ind]['class'];
                                        delete data[ind]['class'];
                                }
                                for(var key in data[ind])
                                        attr[key]       = data[ind][key];
                                break;
                        default:
                                attr["txt"]     = data[ind];
                }
                this.createDOM(tag_name, attr,row)
        }
        return row;
    }
    this.createDOM = this.createDom = function(elem, attributeJson, parentN){
        var elemDom = parentN.ownerDocument.createElement(elem);
        this.setAttr(elemDom, attributeJson);
	    if(parentN)
        	    parentN.appendChild(elemDom);
        return elemDom;
    }
    this.Id = function(id, doc){
        if(doc) 
            return doc.getElementById(id);
        return this.doc.getElementById(id);
    }
    this.setAttr = function(elem, attr){
        if("txt" in attr){
                //var txtNode = doc.createTextNode(attr["txt"]);
                //elem.appendChild(txtNode);
                elem.innerHTML  = attr["txt"];
                delete attr["txt"];
        }
        for(var key in attr )
                elem.setAttribute(key, attr[key]);
    }
    this.send_ajax_request = function(cgi_file, post_data, succ_flag, callback, request_type, asyn){
        var src_fname = cgi_file.split('?')[0]
        var src_fname_paths =  src_fname.split('/')
        src_fname = src_fname_paths[src_fname_paths.length - 1];
        if(post_data){
            var json_data = post_data.split('input_str=')[1];
        }else{
            var json_data = cgi_file.split('input_str=')[1];
        }
        var socket = io.connect({'forceNew':true });
        socket.callback = callback;
        socket.json_data = JSON.stringify({'src':src_fname, 'data':JSON.parse(json_data)});
        socket.on('connect', function() {
            var sessionid = socket.io.engine.id;
            console.log('Send : '+sessionid+":"+socket.json_data);
            socket.emit(sessionid, JSON.parse(socket.json_data));
            socket.on(sessionid, function(json){
              console.log('Rec : '+sessionid+":"+socket.json_data+" ======="+JSON.stringify(json)+"call back"+socket.callback);
              callback = socket.callback;
              socket.removeListener(sessionid);
              socket.disconnect();
              socket.removeAllListeners('connect');
              try{
		           var callfunc    = eval(callback);
		      }catch(e){
		            alert("Error while eval callback "+e.lineNumber+'===='+e)
		      }
            });
        });
    }
    this.send_ajax_request_old = function(cgi_file, post_data, succ_flag, callback, request_type, asyn){
        var xmlhttp = (window.XMLHttpRequest)?(new XMLHttpRequest()):(new ActiveXObject("Microsoft.XMLHTTP"));
        xmlhttp.onreadystatechange=function(){
                if(xmlhttp.readyState ==4 && xmlhttp.status==200 && succ_flag == 1) {
                        var text        = xmlhttp.responseText;
                        var xml         = xmlhttp.responseXML;
                        try{var json    = JSON && JSON.parse(text) || eval(text);}catch(e){console.log("Error JSON.parse "+e);}
                        try{
				            var callfunc    = eval(callback);
			            }catch(e){
				            alert("Error while eval callback "+e.lineNumber+'===='+e)
			            }
                }
        }
        xmlhttp.open(request_type,cgi_file,asyn);
        xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xmlhttp.send(post_data);
    }
    this.disp_none = function(elem){
	    if(elem)
		    elem.style.display	= 'none';
    }
    this.disp_block = function(elem){
	    if(elem)
		    elem.style.display	= 'block';
    }
    this.Log = function(msg){
        try{console.log(msg)}catch(e){};
    } 
    this.remove_node = function(elem){
	    try{elem.parentNode.removeChild(elem);}catch(e){}
    }
    this.get_page_size = function(doc){
        var maxH 	= Math.max( Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight), Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight), Math.max(doc.body.clientHeight, doc.documentElement.clientHeight));
        var maxW 	= Math.max( Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth), Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth), Math.max(doc.body.clientWidth, doc.documentElement.clientWidth));
	    return {pw : maxW, ph : maxH};
    }
    this.get_absolute_pos = function( obj) {
        var cur_left = 0,cur_top = 0;
        if(obj.offsetLeft) cur_left += parseInt(obj.offsetLeft);
        if(obj.offsetTop) cur_top += parseInt(obj.offsetTop);
        if(obj.scrollTop && obj.scrollTop > 0) cur_top -= parseInt(obj.scrollTop);
        if(obj.offsetParent) {
            var pos     = this.get_absolute_pos(obj.offsetParent);
            cur_left    += pos[0];
            cur_top     += pos[1];
        } else if(obj.ownerDocument) {
            var window_obj  = obj.ownerDocument.defaultView;
            if(!window_obj && obj.ownerDocument.parentWindow) window_obj = obj.ownerDocument.parentWindow;
            if(window_obj)
                if(window_obj.frameElement) {
                    var pos     = this.get_absolute_pos(window_obj.frameElement);
                    cur_left    += pos[0];
                    cur_top     += pos[1];
                }
        }
        return [cur_left,cur_top];
    }
    this.show_process_bar = function()
    {
        if (this.Id('process_png')){
            this.Id('process_png').style.display = 'block';
        }
        if (this.Id('process_div_rnd'))
	        this.Id('process_div_rnd').style.display = 'block';
   	    this.doc.body.scrollTop = 0;
    }
    this.hide_process_bar = function()
    {
        if (this.Id('process_div_rnd')){
            this.Id('process_div_rnd').style.display = 'none';
        }
        if (this.Id('process_png')){
           this.Id('process_png').style.display = 'none';
        }
    }
    this.dump_json_data = function(json){
	    try{this.Logger.push("DUMPING JSON === "+JSON.stringify(json, null, '\t'));}catch(e){this.Logger.push("Error : DUMPING JSON === "+json);}
    }
    this.loadJS = function(src, callback) {
        var s = this.doc.createElement('script');
        s.src = src;
        s.async = true;
        s.onreadystatechange = s.onload = function() {
            var state = s.readyState;
            if (!callback.done && (!state || /loaded|complete/.test(state))) {
                callback.done = true;
                callback();
            }
        };
        this.doc.getElementsByTagName('head')[0].appendChild(s);
    }
}).apply(Utils.prototype);
