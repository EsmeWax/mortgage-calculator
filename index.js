let express = require('express');

let app = express();

app.use(express.json());
app.use(express.static(__dirname ));

app.use('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});


// Create server to listen on port 3002
let server = app.listen(3002, function() {
    console.log('Node server is running on http://localhost:3002..');
})