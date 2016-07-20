/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />
"use strict";
const samchon = require("samchon-framework");
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
        class ChatServer extends chat.protocol.service.Server {
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            constructor() {
                super();
                this.rooms = new chat.ChatRoomList();
            }
            createUser() {
                return new ChatUser(this);
            }
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            getRooms() {
                return this.rooms;
            }
        }
        chat.ChatServer = ChatServer;
        class ChatUser extends chat.protocol.service.User {
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            constructor(server) {
                super(server);
                this.name = "";
            }
            createClient(driver) {
                return new ChatClient(this, driver);
            }
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            getServer() {
                return super.getServer();
            }
            setName(val) {
                this.name = val;
            }
            getName() {
                return this.name;
            }
        }
        chat.ChatUser = ChatUser;
        class ChatClient extends chat.protocol.service.Client {
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            constructor(user, driver) {
                super(user, driver);
                if (user.getAuthority() != 0)
                    this.send_account_info();
            }
            createService(path) {
                if (path == "list")
                    return new chat.ListService(this, path);
                else if (path.indexOf("chat/") != -1)
                    return new chat.ChatService(this, path);
                else
                    return null;
            }
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            getUser() {
                return super.getUser();
            }
            /* ---------------------------------------------------------
                SEND DATA
            --------------------------------------------------------- */
            sendData(invoke) {
                console.log("SENT DATA: ");
                console.log(invoke.toXML().toString() + "\n");
                super.sendData(invoke);
            }
            send_account_info() {
                let id = this.getUser().getAccountID();
                let name = this.getUser().getName();
                this.sendData(new chat.protocol.Invoke("setAccount", id, name));
            }
            /* ---------------------------------------------------------
                REPLY DATA
            --------------------------------------------------------- */
            replyData(invoke) {
                console.log("REPLIED DATA: ");
                console.log(invoke.toXML().toString() + "\n");
                super.replyData(invoke);
            }
            login(id, name) {
                if (this.getUser().getAccountID() != "guest")
                    this.sendData(new chat.protocol.Invoke("handleLoginFailed", "You're already being logged-in."));
                else if (this.getUser().getServer().has(id) == true)
                    this.sendData(new chat.protocol.Invoke("handleLoginFailed", "Another one is using the account."));
                else {
                    this.getUser().setAccount(id, 1);
                    this.getUser().setName(name);
                    this.send_account_info();
                }
            }
        }
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
        class ListService extends chat.protocol.service.Service {
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            constructor(client, path) {
                super(client, path);
                // FIRST, SEND THE LIST OF CHATTING ROOMS TO THE NEWLY CONNECTED CLIENT (SERVICE).
                this.send_rooms();
                // ALSO, SEND THE LIST WHENEVENR PARTICIPANTS JOIN OR GO OUT
                this.rooms.addEventListener("insert", ListService.prototype.handle_room_change, this);
                this.rooms.addEventListener("erase", ListService.prototype.handle_room_change, this);
                this.rooms.addEventListener("refresh", ListService.prototype.handle_participant_change, this);
            }
            get rooms() {
                return this.getClient().getUser().getServer().getRooms();
            }
            destructor() {
                this.rooms.removeEventListener("insert", ListService.prototype.handle_room_change, this);
                this.rooms.removeEventListener("erase", ListService.prototype.handle_room_change, this);
                this.rooms.removeEventListener("refresh", ListService.prototype.handle_participant_change, this);
            }
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            getClient() {
                return super.getClient();
            }
            /* ---------------------------------------------------------
                SEND DATA
            --------------------------------------------------------- */
            handle_room_change(event) {
                // SEND LIST OF CHATTING ROOMS WHENEVER PARTICIPANTS JOIN OR GO OUT
                this.send_rooms();
            }
            handle_participant_change(event) {
                let room = event.first.value.second;
                let invoke = new chat.protocol.Invoke("setRoom", room["uid"], room.toXML());
                this.sendData(invoke);
            }
            send_rooms() {
                let invoke = new chat.protocol.Invoke("setRoomList", this.rooms.toXML());
                this.sendData(invoke);
            }
            /* ---------------------------------------------------------
                REPLY DATA
            --------------------------------------------------------- */
            createRoom(name) {
                let rooms = this.getClient().getUser().getServer().getRooms();
                rooms.createRoom(name);
            }
        }
        chat.ListService = ListService;
        class ChatService extends chat.protocol.service.Service {
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            constructor(client, path) {
                super(client, path);
                // FIRST, FIND MATCHED ROOM
                try {
                    // IDENTIFIER
                    let rooms = this.getClient().getUser().getServer().getRooms();
                    let uid = Number(path.split("chat/")[1]);
                    let account_id = this.getClient().getUser().getAccountID();
                    let room = rooms.get(uid);
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
            destructor() {
                if (this.room == null)
                    return;
                this.room.erase(this.getClient().getUser().getAccountID());
            }
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            getClient() {
                return super.getClient();
            }
            /* ---------------------------------------------------------
                REPLY DATA
            --------------------------------------------------------- */
            replyData(invoke) {
                // DON'T ACCEPT ANY MESSAGE WHEN FAILED TO JOIN A ROOM
                if (this.room == null)
                    return;
                super.replyData(invoke);
            }
            talk(message) {
                let my_account_id = this.getClient().getUser().getAccountID();
                let invoke = new chat.protocol.Invoke("printTalk", my_account_id, message);
                this.room.sendData(invoke);
            }
            whisper(to, message) {
                let from = this.getClient().getUser().getAccountID();
                let invoke = new chat.protocol.Invoke("printWhisper", from, to, message);
                this.room.get(to).sendData(invoke); // TO OTHERSIDE
                if (from != to)
                    this.sendData(invoke); // AND MYSELF
            }
        }
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
        class ChatRoomList extends chat.collection.HashMapCollection {
            constructor(...args) {
                super(...args);
                this.sequence = 0; // AUTO_INCREMENT FOR ChatRoom.uid
            }
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            // using super::super
            createRoom(name) {
                let uid = ++this.sequence;
                this.insert([uid, new ChatRoom(this, uid, name)]);
            }
            /* ---------------------------------------------------------
                EXPORTERS
            --------------------------------------------------------- */
            toXML() {
                // <roomList>
                //     <room ... />
                //     <room ... />
                // </roomList>
                let xml = new chat.library.XML();
                xml.setTag("roomList");
                for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    xml.push(it.second.toXML());
                return xml;
            }
        }
        chat.ChatRoomList = ChatRoomList;
        class ChatRoom extends chat.collection.HashMapCollection {
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            constructor(rooms, uid, title) {
                super();
                this.rooms = rooms;
                this.uid = uid;
                this.title = title;
                this.addEventListener("insert", ChatRoom.prototype.handle_change, this);
                this.addEventListener("erase", ChatRoom.prototype.handle_change, this);
            }
            /* ---------------------------------------------------------
                SEND DATA
            --------------------------------------------------------- */
            handle_change(event) {
                if (event.type == "erase" && this.empty() == true) {
                    // NO PARTICIPANT LEFT, THEN ERASE THIS ROOM
                    this.rooms.erase(this.uid);
                    return;
                }
                // SEND CHANGE TO PARTICIPANTS
                let invoke = new chat.protocol.Invoke("setRoom", this.toXML());
                this.sendData(invoke);
                // NOTIFY CHANGE TO ITS PARENT ROOM_LIST
                let it = this.rooms.find(this.uid);
                this.rooms.refresh(it);
            }
            sendData(invoke) {
                // SEND DATA - TO ALL PARTICIPANTS
                for (let it = this.begin(); !it.equal_to(this.end()); it = it.next())
                    it.second.sendData(invoke);
            }
            /* ---------------------------------------------------------
                EXPORTERS
            --------------------------------------------------------- */
            toXML() {
                // <room uid="1" name="Debate Something">
                //     <participant id="samchon" name="Jeongho Nam" />
                //     <participant account="john" name="John Doe" />
                // </room>
                let xml = new chat.library.XML();
                xml.setTag("room");
                xml.setProperty("uid", this.uid + "");
                xml.setProperty("title", this.title);
                for (let it = this.begin(); !it.equal_to(this.end()); it = it.next()) {
                    let participant = new chat.library.XML();
                    participant.setTag("participant");
                    participant.setProperty("id", it.second.getClient().getUser().getAccountID());
                    participant.setProperty("name", it.second.getClient().getUser().getName());
                    xml.push(participant);
                }
                return xml;
            }
        }
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
            let server = new chat.ChatServer();
            server.open(11723);
        }
        chat.main = main;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
example.chat.main();
//# sourceMappingURL=chat-server.js.map