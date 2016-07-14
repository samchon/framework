/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var sf = require("samchon-framework");
var example;
(function (example) {
    var chat;
    (function (chat) {
        chat.library = sf.library;
        chat.collection = sf.collection;
        chat.protocol = sf.protocol;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
/* =================================================================
    SERVER, USER AND CLIENT
================================================================= */
var example;
(function (example) {
    var chat;
    (function (chat) {
        var ChatServer = (function (_super) {
            __extends(ChatServer, _super);
            function ChatServer() {
                _super.call(this);
                this.rooms = new chat.ChatRoomList();
            }
            ChatServer.prototype.createUser = function () {
                return new ChatUser(this);
            };
            ChatServer.prototype.getRooms = function () {
                return this.rooms;
            };
            return ChatServer;
        }(chat.protocol.service.Server));
        chat.ChatServer = ChatServer;
        var ChatUser = (function (_super) {
            __extends(ChatUser, _super);
            function ChatUser() {
                _super.apply(this, arguments);
                this.name = "";
            }
            ChatUser.prototype.createClient = function () {
                return new ChatClient(this);
            };
            ChatUser.prototype.getName = function () {
                return this.name;
            };
            return ChatUser;
        }(chat.protocol.service.User));
        chat.ChatUser = ChatUser;
        var ChatClient = (function (_super) {
            __extends(ChatClient, _super);
            function ChatClient() {
                _super.apply(this, arguments);
            }
            ChatClient.prototype.createService = function (path) {
                if (path == "list")
                    return new chat.ListService(this, path);
                else if (path.indexOf("chat/") != -1)
                    return new chat.ChatService(this, path);
                else
                    return null;
            };
            ChatClient.prototype.sendAccountInfo = function () {
                var id = this.getUser().getAccount();
                var name = this.getUser().getName();
                this.sendData(new chat.protocol.Invoke("handleAccountInfo", id, name));
            };
            ChatClient.prototype.login = function (id, name) {
                if (this.getUser().getAccount() != "guest")
                    this.sendData(new chat.protocol.Invoke("handleLogin", false, "You're already being logged-in."));
                else if (this.getUser().getServer().has(id) == true)
                    this.sendData(new chat.protocol.Invoke("handleLogin", false, "Another one is using the account."));
                else {
                    this.getUser()["account"] = id;
                    this.getUser()["name"] = name;
                    this.sendData(new chat.protocol.Invoke("handleLogin", true));
                }
            };
            return ChatClient;
        }(chat.protocol.service.Client));
        chat.ChatClient = ChatClient;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
/* =================================================================
    SERVICES - LIST & CHAT
================================================================= */
var example;
(function (example) {
    var chat;
    (function (chat) {
        var ListService = (function (_super) {
            __extends(ListService, _super);
            function ListService(client, path) {
                _super.call(this, client, path);
                // FIRST, SEND ACCOUNT INFO
                this.getClient().sendAccountInfo();
                // SECOND, SEND THE LIST OF CHATTING ROOMS TO THE NEWLY CONNECTED CLIENT (SERVICE).
                this.send_rooms();
                // ALSO, SEND THE LIST WHENEVENR PARTICIPANTS JOIN OR GO OUT
                var rooms = this.getClient().getUser().getServer().getRooms();
                rooms.addEventListener("insert", ListService.prototype.handle_change, this);
                rooms.addEventListener("erase", ListService.prototype.handle_change, this);
            }
            ListService.prototype.destructor = function () {
                var rooms = this.getClient().getUser().getServer().getRooms();
                rooms.removeEventListener("insert", ListService.prototype.handle_change, this);
                rooms.removeEventListener("erase", ListService.prototype.handle_change, this);
            };
            ListService.prototype.handle_change = function (event) {
                // SEND LIST OF CHATTING ROOMS WHENEVER PARTICIPANTS JOIN OR GO OUT
                this.send_rooms();
            };
            ListService.prototype.send_rooms = function () {
                var rooms = this.getClient().getUser().getServer().getRooms();
                var invoke = new chat.protocol.Invoke("setRoomList", rooms.toXML());
                this.sendData(invoke);
            };
            ListService.prototype.createRoom = function (name) {
                var rooms = this.getClient().getUser().getServer().getRooms();
                rooms.createRoom(name);
            };
            return ListService;
        }(chat.protocol.service.Service));
        chat.ListService = ListService;
        var ChatService = (function (_super) {
            __extends(ChatService, _super);
            function ChatService(client, path) {
                _super.call(this, client, path);
                // FIRST, SEND ACCOUNT INFO
                this.getClient().sendAccountInfo();
                // SECOND, FIND MATCHED ROOM
                try {
                    // IDENTIFIER
                    var rooms = this.getClient().getUser().getServer().getRooms();
                    var uid = Number(path.split("chat/")[1]);
                    var account_id = this.getClient().getUser().getAccount();
                    var room = rooms.get(uid);
                    if (room.has(account_id) == true) {
                        // WHETHER DUPLICATED JOIN
                        this.room = null;
                        this.sendData(new chat.protocol.Invoke("alert", "You've already joined in this room.", "Error"));
                    }
                    else {
                        this.room = room;
                        // INFORMATION ABOUT THE ROOM WILL BE SENT AUTOMATICALLY
                        // BY ChatRoom.handle_change
                        this.room.insert([account_id, this]);
                    }
                }
                catch (exception) {
                    this.room = null;
                }
            }
            ChatService.prototype.destructor = function () {
                if (this.room == null)
                    return;
                this.room.erase(this.getClient().getUser().getAccount());
            };
            ChatService.prototype.replyData = function (invoke) {
                // DON'T ACCEPT ANY MESSAGE WHEN FAILED TO JOIN A ROOM
                if (this.room == null)
                    return;
                _super.prototype.replyData.call(this, invoke);
            };
            ChatService.prototype.talk = function (message) {
                var my_account_id = this.getClient().getUser().getAccount();
                var invoke = new chat.protocol.Invoke("printTalk", my_account_id, message);
                this.room.sendData(invoke);
            };
            ChatService.prototype.whisper = function (to, message) {
                var my_account_id = this.getClient().getUser().getAccount();
                var invoke = new chat.protocol.Invoke("printWhisper", my_account_id, to, message);
                this.room.sendData(invoke);
            };
            return ChatService;
        }(chat.protocol.service.Service));
        chat.ChatService = ChatService;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
/* =================================================================
    CHATTING ROOMS
================================================================= */
var example;
(function (example) {
    var chat;
    (function (chat) {
        var ChatRoomList = (function (_super) {
            __extends(ChatRoomList, _super);
            function ChatRoomList() {
                _super.apply(this, arguments);
                this.sequence = 0; // AUTO_INCREMENT FOR ChatRoom.uid
            }
            // using super::super
            ChatRoomList.prototype.createRoom = function (name) {
                var uid = ++this.sequence;
                this.insert(std.make_pair(uid, new ChatRoom(this, uid, name)));
            };
            ChatRoomList.prototype.toXML = function () {
                // <roomList>
                //     <room ... />
                //     <room ... />
                // </roomList>
                var xml = new chat.library.XML();
                xml.setTag("roomList");
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    xml.push(it.second.toXML());
                return xml;
            };
            return ChatRoomList;
        }(chat.collection.HashMapCollection));
        chat.ChatRoomList = ChatRoomList;
        var ChatRoom = (function (_super) {
            __extends(ChatRoom, _super);
            function ChatRoom(rooms, uid, name) {
                _super.call(this);
                this.rooms = rooms;
                this.uid = uid;
                this.name = name;
                this.addEventListener("insert", ChatRoom.prototype.handle_change, this);
                this.addEventListener("erase", ChatRoom.prototype.handle_change, this);
            }
            ChatRoom.prototype.handle_change = function (event) {
                if (event.type == "erase" && this.empty() == true) {
                    // NO PARTICIPANT LEFT, THEN ERASE THIS ROOM
                    this.rooms.erase(this.uid);
                    return;
                }
                var invoke = new chat.protocol.Invoke("setRoom", this.toXML());
                this.sendData(invoke);
            };
            ChatRoom.prototype.sendData = function (invoke) {
                // SEND DATA - TO ALL PARTICIPANTS
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    it.second.sendData(invoke);
            };
            ChatRoom.prototype.toXML = function () {
                // <room uid="1" name="Debate Something">
                //     <participant id="samchon" name="Jeongho Nam" />
                //     <participant account="john" name="John Doe" />
                // </room>
                var xml = new chat.library.XML();
                xml.setTag("room");
                xml.setProperty("uid", this.uid + "");
                xml.setProperty("name", this.name);
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next()) {
                    var participant = new chat.library.XML();
                    participant.setTag("participant");
                    participant.setProperty("id", it.second.getClient().getUser().getAccount());
                    participant.setProperty("name", it.second.getClient().getUser().getName());
                    xml.push(participant);
                }
                return xml;
            };
            return ChatRoom;
        }(chat.collection.HashMapCollection));
        chat.ChatRoom = ChatRoom;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
/* =================================================================
    MAIN
================================================================= */
var example;
(function (example) {
    var chat;
    (function (chat) {
        function main() {
            var server = new chat.ChatServer();
            server.open(37755);
        }
        chat.main = main;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
example.chat.main();
//# sourceMappingURL=ChatServer.js.map