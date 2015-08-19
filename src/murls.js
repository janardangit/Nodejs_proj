TASApp = window || {};
function URL(){
}
URL.prototype.constructor   = URL;
(function(){
    this.url_row_select = function(row, ent){
        try{
            var active_elm = document.getElementsByClassName("active_row")[0]
            active_elm.className = ""
            var sub_lists = active_elm.getElementsByClassName("sub-lists show");
            if(sub_lists.length){
                sub_lists[0].className  = 'sub-lists hide';
            }
        }catch(e){}

        row.className   = "active_row";
        var class_name  = ent.target.className;
        var list_element    = (ent.target.nodeType == 3)?ent.target.parentNode:ent.target;
        switch(true){
            case /home-url/.test(class_name) || /home-url/.test(list_element.parentNode.className):
                var list_element    = (/home-url/.test(list_element.parentNode.className))?list_element.parentNode:list_element;
                var sub_lists = list_element.getElementsByClassName("sub-lists");
                if(sub_lists.length){
                    sub_lists[0].className  = (/hide/.test(sub_lists[0].className))?'sub-lists show':'sub-lists hide';
                }
            break;
        }
    }
}).apply(URL.prototype);
TASApp.URL = new URL();
