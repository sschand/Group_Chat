var express = require('express');
var path = require('path');
var session = require('express-session');

var app = express();
// use/set
app.use(express.static(path.join(__dirname, "./static")));
app.set('views', path.join(__dirname, "./views"));
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({secret: 'codingdojorocks'}));


/****** variables *****/
var users = {};
var messages = [];
/****** end vars *****/

/***** Routes ******/
app.get('/', function(req, res){
    // session
    req.session.test = 'Group Chat';
    var sid = req.sessionID;
    var prompt = false;

    // console.log(users);
    // if(!users[sid]){
    //     prompt = false;
    // }else{
    //     prompt = true;
    // }
    res.render('index', {sid : sid, prompt: prompt});
})

// server stuff
var server = app.listen(8000, function(){
    console.log('listening on port 8000');
})

// socket stuff
var io = require('socket.io').listen(server);



io.sockets.on('connection', function(socket){
    // console.log(socket.id);

    // Listening:
    socket.on('got_new_user', function(data){
        users[data.sid] = data.name;
        io.emit('new_user', {name: data.name, uId: data.sid});
        socket.emit('existing_users', {existing_users: users});
        io.emit('new_message_added', {messages: messages});

    });

    socket.on('new_message', function(data){

        messages.push(data);
console.log(messages);
        socket.emit('message_added');
        io.emit('new_message_added', {messages: messages});
        // socket.emit('existing_users', {existing_users: users});
    });

    // socket.on("disconnect", function(data){
    //     // req.session.test = 'Group Chat';
    //     // var sid = req.sessionID;
    //     console.log("user disconnected", users);
    //     io.emit('disconnect_user', {name: data.name, uId: data.sid});
    //
    // })
    // app.io.route('got_new_user', function(req,res){
    //     app.io.broadcast('new_user', {new_user_name: req.data.name})
    //     req.io.emit('existing_user', users);
    // });

})
