import server = require("./server");

var chatServer: server.ChatServer = new server.ChatServer();
chatServer.open(11723);