/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var samchon = require("samchon-framework");
var example;
(function (example) {
    var chat;
    (function (chat) {
        // SHORTCUTS
        chat.library = samchon.library;
        chat.collection = samchon.collection;
        chat.protocol = samchon.protocol;
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
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            function ChatServer() {
                _super.call(this);
                this.rooms = new chat.ChatRoomList();
            }
            ChatServer.prototype.createUser = function () {
                return new ChatUser(this);
            };
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            ChatServer.prototype.getRooms = function () {
                return this.rooms;
            };
            return ChatServer;
        }(chat.protocol.service.Server));
        chat.ChatServer = ChatServer;
        var ChatUser = (function (_super) {
            __extends(ChatUser, _super);
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            function ChatUser(server) {
                _super.call(this, server);
                this.name = "";
            }
            ChatUser.prototype.createClient = function (driver) {
                return new ChatClient(this, driver);
            };
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            ChatUser.prototype.getServer = function () {
                return _super.prototype.getServer.call(this);
            };
            ChatUser.prototype.setName = function (val) {
                this.name = val;
            };
            ChatUser.prototype.getName = function () {
                return this.name;
            };
            return ChatUser;
        }(chat.protocol.service.User));
        chat.ChatUser = ChatUser;
        var ChatClient = (function (_super) {
            __extends(ChatClient, _super);
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            function ChatClient(user, driver) {
                _super.call(this, user, driver);
                if (user.getAuthority() != 0)
                    this.send_account_info();
            }
            ChatClient.prototype.createService = function (path) {
                if (path == "list")
                    return new chat.ListService(this, path);
                else if (path.indexOf("chat/") != -1)
                    return new chat.ChatService(this, path);
                else
                    return null;
            };
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            ChatClient.prototype.getUser = function () {
                return _super.prototype.getUser.call(this);
            };
            /* ---------------------------------------------------------
                SEND DATA
            --------------------------------------------------------- */
            ChatClient.prototype.sendData = function (invoke) {
                console.log("SENT DATA: ");
                console.log(invoke.toXML().toString() + "\n");
                _super.prototype.sendData.call(this, invoke);
            };
            ChatClient.prototype.send_account_info = function () {
                var id = this.getUser().getAccountID();
                var name = this.getUser().getName();
                this.sendData(new chat.protocol.Invoke("setAccount", id, name));
            };
            /* ---------------------------------------------------------
                REPLY DATA
            --------------------------------------------------------- */
            ChatClient.prototype.replyData = function (invoke) {
                console.log("REPLIED DATA: ");
                console.log(invoke.toXML().toString() + "\n");
                _super.prototype.replyData.call(this, invoke);
            };
            ChatClient.prototype.login = function (id, name) {
                if (this.getUser().getAccountID() != "guest")
                    this.sendData(new chat.protocol.Invoke("handleLoginFailed", "You're already being logged-in."));
                else if (this.getUser().getServer().has(id) == true)
                    this.sendData(new chat.protocol.Invoke("handleLoginFailed", "Another one is using the account."));
                else {
                    this.getUser().setAccount(id, 1);
                    this.getUser().setName(name);
                    this.send_account_info();
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
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            function ListService(client, path) {
                _super.call(this, client, path);
                // FIRST, SEND THE LIST OF CHATTING ROOMS TO THE NEWLY CONNECTED CLIENT (SERVICE).
                this.send_rooms();
                // ALSO, SEND THE LIST WHENEVENR PARTICIPANTS JOIN OR GO OUT
                this.rooms.addEventListener("insert", ListService.prototype.handle_room_change, this);
                this.rooms.addEventListener("erase", ListService.prototype.handle_room_change, this);
                this.rooms.addEventListener("refresh", ListService.prototype.handle_participant_change, this);
            }
            Object.defineProperty(ListService.prototype, "rooms", {
                get: function () {
                    return this.getClient().getUser().getServer().getRooms();
                },
                enumerable: true,
                configurable: true
            });
            ListService.prototype.destructor = function () {
                this.rooms.removeEventListener("insert", ListService.prototype.handle_room_change, this);
                this.rooms.removeEventListener("erase", ListService.prototype.handle_room_change, this);
                this.rooms.removeEventListener("refresh", ListService.prototype.handle_participant_change, this);
            };
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            ListService.prototype.getClient = function () {
                return _super.prototype.getClient.call(this);
            };
            /* ---------------------------------------------------------
                SEND DATA
            --------------------------------------------------------- */
            ListService.prototype.handle_room_change = function (event) {
                // SEND LIST OF CHATTING ROOMS WHENEVER PARTICIPANTS JOIN OR GO OUT
                this.send_rooms();
            };
            ListService.prototype.handle_participant_change = function (event) {
                var room = event.first.value.second;
                var invoke = new chat.protocol.Invoke("setRoom", room["uid"], room.toXML());
                this.sendData(invoke);
            };
            ListService.prototype.send_rooms = function () {
                var invoke = new chat.protocol.Invoke("setRoomList", this.rooms.toXML());
                this.sendData(invoke);
            };
            /* ---------------------------------------------------------
                REPLY DATA
            --------------------------------------------------------- */
            ListService.prototype.createRoom = function (name) {
                var rooms = this.getClient().getUser().getServer().getRooms();
                rooms.createRoom(name);
            };
            return ListService;
        }(chat.protocol.service.Service));
        chat.ListService = ListService;
        var ChatService = (function (_super) {
            __extends(ChatService, _super);
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            function ChatService(client, path) {
                _super.call(this, client, path);
                // FIRST, FIND MATCHED ROOM
                try {
                    // IDENTIFIER
                    var rooms = this.getClient().getUser().getServer().getRooms();
                    var uid = Number(path.split("chat/")[1]);
                    var account_id = this.getClient().getUser().getAccountID();
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
                this.room.erase(this.getClient().getUser().getAccountID());
            };
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            ChatService.prototype.getClient = function () {
                return _super.prototype.getClient.call(this);
            };
            /* ---------------------------------------------------------
                REPLY DATA
            --------------------------------------------------------- */
            ChatService.prototype.replyData = function (invoke) {
                // DON'T ACCEPT ANY MESSAGE WHEN FAILED TO JOIN A ROOM
                if (this.room == null)
                    return;
                _super.prototype.replyData.call(this, invoke);
            };
            ChatService.prototype.talk = function (message) {
                var my_account_id = this.getClient().getUser().getAccountID();
                var invoke = new chat.protocol.Invoke("printTalk", my_account_id, message);
                this.room.sendData(invoke);
            };
            ChatService.prototype.whisper = function (to, message) {
                var from = this.getClient().getUser().getAccountID();
                var invoke = new chat.protocol.Invoke("printWhisper", from, to, message);
                this.room.get(to).sendData(invoke); // TO OTHERSIDE
                if (from != to)
                    this.sendData(invoke); // AND MYSELF
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
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::super
            ChatRoomList.prototype.createRoom = function (name) {
                var uid = ++this.sequence;
                this.insert([uid, new ChatRoom(this, uid, name)]);
            };
            /* ---------------------------------------------------------
                EXPORTERS
            --------------------------------------------------------- */
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
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            function ChatRoom(rooms, uid, title) {
                _super.call(this);
                this.rooms = rooms;
                this.uid = uid;
                this.title = title;
                this.addEventListener("insert", ChatRoom.prototype.handle_change, this);
                this.addEventListener("erase", ChatRoom.prototype.handle_change, this);
            }
            /* ---------------------------------------------------------
                SEND DATA
            --------------------------------------------------------- */
            ChatRoom.prototype.handle_change = function (event) {
                if (event.type == "erase" && this.empty() == true) {
                    // NO PARTICIPANT LEFT, THEN ERASE THIS ROOM
                    this.rooms.erase(this.uid);
                    return;
                }
                // SEND CHANGE TO PARTICIPANTS
                var invoke = new chat.protocol.Invoke("setRoom", this.toXML());
                this.sendData(invoke);
                // NOTIFY CHANGE TO ITS PARENT ROOM_LIST
                var it = this.rooms.find(this.uid);
                var refresh_event = new chat.collection.CollectionEvent("refresh", it, it.next());
                this.rooms.dispatchEvent(refresh_event);
            };
            ChatRoom.prototype.sendData = function (invoke) {
                // SEND DATA - TO ALL PARTICIPANTS
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    it.second.sendData(invoke);
            };
            /* ---------------------------------------------------------
                EXPORTERS
            --------------------------------------------------------- */
            ChatRoom.prototype.toXML = function () {
                // <room uid="1" name="Debate Something">
                //     <participant id="samchon" name="Jeongho Nam" />
                //     <participant account="john" name="John Doe" />
                // </room>
                var xml = new chat.library.XML();
                xml.setTag("room");
                xml.setProperty("uid", this.uid + "");
                xml.setProperty("title", this.title);
                for (var it = this.begin(); !it.equal_to(this.end()); it = it.next()) {
                    var participant = new chat.library.XML();
                    participant.setTag("participant");
                    participant.setProperty("id", it.second.getClient().getUser().getAccountID());
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
            server.open(11723);
        }
        chat.main = main;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
example.chat.main();
