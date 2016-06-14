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

// app.use(session({secret: 'codingdojorocks'}));


/****** variables *****/
var users = {};
var user_count = 0;
var messages = [];
/****** end vars *****/

/***** Routes ******/
app.get('/', function(req, res){
    res.render('index');
})

// server stuff
var server = app.listen(8000, function(){
    console.log('listening on port 8000');
})

// socket stuff
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
    console.log(socket.id);

    // Listening:
    socket.on('got_new_user', function(data){
        user_count++;
        users[socket.id] = {user_count: user_count, name: data.name};

        // users[socket.id] = data.name;
        // users[user_count] = {name: data.name, id: socket.id}

        io.emit('new_user', {name: data.name, uId: socket.id, user_count: user_count});
        socket.emit('existing_users', {existing_users: users, uID: socket.id});
        io.emit('new_message_added', {messages: messages});
    });

    socket.on('new_message', function(data){
        messages.push(data);

        socket.emit('message_added');
        io.emit('new_message_added', {messages: messages});
    });

    socket.on("disconnect", function(data){
        // console.log(socket.id);
        var sid = socket.id;

        io.emit('disconnect_user', {disconnect_id: socket.id});

    })
    // app.io.route('got_new_user', function(req,res){
    //     app.io.broadcast('new_user', {new_user_name: req.data.name})
    //     req.io.emit('existing_user', users);
    // });

})
