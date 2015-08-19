/**
 * Module dependencies.
*/
var http        = require("http");
var express = require('./node_modules/express');
var hash = require('./pass').hash;
var bodyParser = require('./node_modules/body-parser');
var session = require('./node_modules/express-session');
var io = require('./node_modules/socket.io');
var python = require('node-python');
var utils = require('./utils');
var spawn = require("child_process").spawn;



//var app = module.exports = express();
var app = express();
var server = http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port 3000');
});
var io_obj  = io.listen(server);
var socket  = io_obj.sockets;
/*socket.on('connection', function(socket){
        socket.emit("gbl_data",{"project_id":4});     
        
        socket.on(socket.id, function(data){
            var address = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
            var port = socket.request.headers['x-forwarded-port'] || socket.request.connection.remotePort;
            if (data){
                console.log(data)
                //socket.emit(socket.id, data.msg);
                var json_data = {project_id:req.session.project_id, user_id:req.session.user_id, agent_id:req.session.agent_id, mgmt_id:Number(req.session.mgmt_id), url_id:Number(req.session.url_id), cmd_id:0}
                var process = spawn('python',["./python_src/cgi_web_extract_lmdb.py", JSON.stringify(json_data)]);
                process.stdout.on('data', function (json){
                    socket.emit(socket.id, json);
                });
            }
        });
});*/


// config

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use("/styles",express.static(__dirname + "/styles"));
app.use("/src",express.static(__dirname + "/src"));
app.use("/icons",express.static(__dirname + "/icons"));
app.use("/images",express.static(__dirname + "/images"));

// middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'shhhh, very secret'
}));

// Session-persisted message middleware

app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = msg;
  next();
});

// dummy database

var users = {
  tj: { name: 'tj' }
};

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)

hash('foobar', function(err, salt, hash){
  if (err) throw err;
  // store the salt & hash in the "db"
  users.tj.salt = salt;
  users.tj.hash = hash;
});


var md5 = require('MD5');
// Authenticate using our plain-object database of doom!

function authenticate(name, pass, fn) {
    var user_name = name;
    var password = pass;
    //var encpassword = md5(password);
    //var phash = CryptoJS.MD5(password);
    var mysql =  require('mysql');
    var connection =  mysql.createConnection({
        host : "172.16.20.222",
        user : "root",
        password: "tas123",
        database : "tas_web_profile_mgmt"
        });
    connection.connect();
    var strQuery = "select * from user_mgmt where login_id ='"+user_name+"' and user_passwd ='"+password+"'";
    connection.query( strQuery, function(err, rows){
        if(err) {
            throw err;
        }else{
            if(rows.length == 0){
               fn(new Error('cannot find user')); 
            }else if(rows.length == 1){
                return fn(null, rows[0]);
            }
        }

    });
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/', function(req, res){
  res.redirect('/login');
});

app.get('/restricted', restrict, function(req, res){
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.get('/login', function(req, res){
  res.render('login');
});
var taxo_name_mapping = {};
var json_data = {project_id:4};
var process = spawn('python',["./python_src/cgi_getdata_service_interface.py", JSON.stringify(json_data)]); 
//console.log('==='+"./python_src/cgi_getdata_service_interface.py "+JSON.stringify(json_data));
process.stdout.on('data', function (json){
    taxo_name_mapping = utils.store_default_taxos_new(JSON.parse(json)); 
})
app.get('/host', function(req, res){
  if (req.session && req.session.user) {
    authenticate(req.session.user.login_id, req.session.user.user_passwd, function(err, user){
        if (user) {
            var ips = ['172.16.20.45','172.16.20.133','172.16.20.136','172.16.20.137','172.16.20.138','172.16.20.139','172.16.20.251','172.16.20.163', '172.16.20.222'];
            var table_content = '';
            table_content = '<tr class="table-header-row"><th class="table_header" width="5%">No.</th><th class="table_header" width="80%">host</th><th class="table_header" width="10%">Machine ID</th><th class="table_header" width="5%">Process</th></tr>';
            for(var i = 0; i< ips.length; i++){
                var custom_data = "{'IP':"+ips[i]+",'CGI_IP':"+ips[i]+",'IMG_IP':"+ips[i]+"}";
                table_content = table_content + '<tr class="" custom_data='+custom_data+'><td class="table_cells">'+(parseInt(i)+1)+'</td><td class="table_cells">'+ips[i]+'</td><td class="table_cells">'+(parseInt(i)+1)+'</td><td class="table_cells"><a href="/url?host_ip='+ips[i]+'"><img src="images/process.png" class="load_url" height="20" width="20"></a></td></tr>'
            }
            res.render('host', {message:table_content});
        }else{
            res.redirect('/login');
        }
    });
  }else{
    res.redirect('/login');
  }
});

app.get('/url_list', function(req, res){
  if (req.session && req.session.user) {
    authenticate(req.session.user.login_id, req.session.user.user_passwd, function(err, user){
        if (user) {
            if (req.session.host){
                var process = spawn('python',["./python_src/get_user_urls.py", 4, 21]);
                //console.log(process);
                process.stdout.on('data', function (json){
                    var data = JSON.parse(json);
                    var keys    = Object.keys(data);
                    keys.sort();
                    var batch_content = "";
                    for (var index in keys){
                        var value = keys[index];
                        data[value]['batch_id'] = value;
                        batch_content += '<option value="'+value+'" custom_data="'+JSON.stringify(data[value])+'">'+data[value]['batch_name']+'</option>'
                    }
                    var url_lists   = data[keys[0]].url_info;
                    var table_rows = ""
                    for (var index in url_lists){
                        var arr = url_lists[index]; 
                        var json_data   = {batch_id:data['batch_id'], url_info:arr};
                        table_rows += '<tr custom_data="'+JSON.stringify(json_data)+'" onclick="TASApp.URL.url_row_select(this, event);">'
                        table_rows += '<td class="table_cells">'+(parseInt(index) + 1)+'</td>'
                        table_rows += '<td class="table_cells">'+arr['adate']+'</td>'
                        table_rows += '<td class="table_cells">'+arr['agent_id']+'</td>'
                        table_rows += '<td class="table_cells">'+arr['url_id']+'</td>'
                        table_rows += '<td class="table_cells">'+utils.get_mgnt_pages(arr['url_name'], arr['mgmt_pages'], arr['agent_id'], arr['url_id'])+'</td>'
                        table_rows += '<td class="table_cells">'+utils.get_mgnt_pages(arr['home_page'], arr['mgmt_pages'], arr['agent_id'], arr['url_id'], true,arr['url_status'])+'</td>'
                        table_rows += '<td class="table_cells"><img src="images/process.png" width="20" height="20" class="load_url" /></td>'
                        table_rows += '<td class="table_cells"><img class="remove-url" src="images/delete_x.png" width="20" height="20" /></td>'
                        table_rows += '</tr>'
                    }
                    res.render('url_list', {'select_batch': batch_content, 'table_rows':table_rows});
                });
            }
        }else{
            res.redirect('/login');
        }
    });
  }else{
        res.redirect('/login');
  }
});

app.get('/mgmt', function(req, res){
  if (req.session && req.session.user) {
    authenticate(req.session.user.login_id, req.session.user.user_passwd, function(err, user){
        if (user) {
            req.session.url_id    = req.query.url_id;
            req.session.agent_id  = req.query.agent_id;
            req.session.doc_id    = req.query.doc_id;
            req.session.mgmt_id   = req.query.mgmt_id;
            req.session.user_id   = 21;
            req.session.project_id = 4;
            req.session.success = "Selected host IP"+req.session.host+"====U"+req.session.url_id+"===A"+req.session.agent_id+"===D"+req.session.doc_id+"===M"+req.session.mgmt_id+"====U"+req.session.user.user_id;
            res.redirect('/tabs');
        }else{
            res.redirect('/login');
        }
    });
  }else{
        res.redirect('/login');
  }
});


app.get('/tabs', function(req, res){
  if (req.session && req.session.user) {
    authenticate(req.session.user.login_id, req.session.user.user_passwd, function(err, user){
        if (user) {
            if (req.session.host){
                if (req.session.url_id && req.session.agent_id && req.session.doc_id && req.session.mgmt_id){
                    
                    socket.on('connection', function(socket){
                        var json_data = {project_id:req.session.project_id, user_id:req.session.user_id, agent_id:req.session.agent_id, mgmt_id:Number(req.session.mgmt_id), url_id:Number(req.session.url_id), doc_id:req.session.doc_id,taxo_mapping:taxo_name_mapping}
                        socket.emit("gbl_data",json_data);
        
                        socket.on(socket.id, function(json){
                            var address = socket.request.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
                            var port = socket.request.headers['x-forwarded-port'] || socket.request.connection.remotePort;
                            if (json){
                                console.log("rec : "+address+':'+socket.id+":"+JSON.stringify(json))
                                //socket.emit(socket.id, data.msg);
                                var process = spawn('python',["./python_src/cgi_web_extract_lmdb.py", JSON.stringify(json)]);
                                process.stdout.on('data', function (data){
                                    var newjason = {'data':JSON.parse(JSON.stringify(data)), 'id':socket.id};
                                    console.log("send : "+address+':'+socket.id+":"+JSON.stringify(json)+':'+JSON.stringify(newjason.data))
                                    socket.emit(socket.id, newjason);
                                });
                            }
                        });
                        socket.on('disconnect', function(){
                            console.log('Request for socket disconnect'+socket.id);
                            //socket.disconnect();
                        });
                    });
                    var json_data = {project_id:req.session.project_id, user_id:req.session.user_id, agent_id:req.session.agent_id, mgmt_id:Number(req.session.mgmt_id), url_id:Number(req.session.url_id), cmd_id:0}
                    var process = spawn('python',["./python_src/cgi_web_extract_lmdb.py", JSON.stringify(json_data)]);
                    process.stdout.on('data', function (json){
                        var table1_content = utils.tabs1(json);
                        var table2_content = utils.tabs1_table2();
                        //var json_data2 = {project_id:req.session.project_id};
                        //var process2 = spawn('python',["./python_src/cgi_getdata_service_interface.py", JSON.stringify(json_data2)]); 
                       // process2.stdout.on('data', function (json2){
                           //var data = JSON.parse(json2);
                           //console.log('==========>'+data[0]['taxo_name']); 
                        //})
                        var table3_content = utils.tabs1_table3();
                        
                        //var json_data3 = {project_id:req.session.project_id, user_id:req.session.user_id, agent_id:req.session.agent_id, mgmt_id:Number(req.session.mgmt_id), url_id:Number(req.session.url_id), cmd_id:1,ref_index:0}
                        //var process3 = spawn('python',["./python_src/cgi_getdata_service_interface.py", JSON.stringify(json_data3)]); 
                        //process3.stdout.on('data', function (json3){
                           //var data = JSON.parse(json3);
                           //console.log('==========>'+json3); 
                        //})
 
                        var table4_content = utils.tabs1_table4().split('<===>'); 
                        res.render('tabs',{'address':req.session.host,'table1_content':table1_content,'table2_content':table2_content,'table3_content':table3_content,'table4_content':table4_content[0],'table4_inner_content':table4_content[1]});
                    });
                }else{
                    res.redirect('/url_list');
                }
            }else{
                    res.redirect('/host');
            }
        }else{
            res.redirect('/login');
        }
    });
  }else{
        res.redirect('/login');
  }
});



app.get('/url', function(req, res){
  if (req.session && req.session.user) {
    authenticate(req.session.user.login_id, req.session.user.user_passwd, function(err, user){
        if (user) {
            var host_ip = req.query.host_ip;
            req.session.regenerate(function(){
                req.session.host = host_ip;
                req.session.user = user;
                req.session.success = "Selected host IP"+host_ip;
                res.redirect('/url_list');
            });
        }else{
            res.redirect('/login');
        }
    });
  }else{
        res.redirect('/login');
  }
});


app.post('/login', function(req, res){
  authenticate(req.body.username, md5(req.body.password), function(err, user){
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        //req.session.success = table_content;
        res.redirect('/host');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
        + ' (use "tj" and "foobar")';
      res.redirect('/login');
    }
  });
});

/* istanbul ignore next */
/*if (!module.parent) {
  app.listen(3000);
  console.log('Express started on port 3000');
}*/


