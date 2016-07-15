var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var example;
(function (example) {
    var chat;
    (function (chat) {
        chat.library = samchon.library;
        chat.protocol = samchon.protocol;
        chat.SERVER_PORT = 11723;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
/// <reference path="API.ts" />
var example;
(function (example) {
    var chat;
    (function (chat) {
        var ChatRoomList = (function (_super) {
            __extends(ChatRoomList, _super);
            function ChatRoomList() {
                _super.call(this);
            }
            ChatRoomList.prototype.createChild = function (xml) {
                return new ChatRoom();
            };
            ChatRoomList.prototype.TAG = function () {
                return "roomList";
            };
            ChatRoomList.prototype.CHILD_TAG = function () {
                return "room";
            };
            return ChatRoomList;
        }(chat.protocol.EntityArray));
        chat.ChatRoomList = ChatRoomList;
        var ChatRoom = (function (_super) {
            __extends(ChatRoom, _super);
            function ChatRoom() {
                _super.call(this);
                this.uid = 0;
                this.title = "";
            }
            ChatRoom.prototype.createChild = function (xml) {
                return new Participant();
            };
            ChatRoom.prototype.key = function () {
                return this.uid;
            };
            ChatRoom.prototype.getUID = function () {
                return this.uid;
            };
            ChatRoom.prototype.getTitle = function () {
                return this.title;
            };
            ChatRoom.prototype.TAG = function () {
                return "room";
            };
            ChatRoom.prototype.CHILD_TAG = function () {
                return "participant";
            };
            return ChatRoom;
        }(chat.protocol.EntityArray));
        chat.ChatRoom = ChatRoom;
        var Participant = (function (_super) {
            __extends(Participant, _super);
            function Participant() {
                _super.call(this);
                this.id = "";
                this.name = "";
            }
            Participant.prototype.key = function () {
                return this.id;
            };
            Participant.prototype.getID = function () {
                return this.id;
            };
            Participant.prototype.getName = function () {
                return this.name;
            };
            Participant.prototype.TAG = function () {
                return "participant";
            };
            return Participant;
        }(chat.protocol.Entity));
        chat.Participant = Participant;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var example;
(function (example) {
    var chat;
    (function (chat) {
        var Application = (function (_super) {
            __extends(Application, _super);
            function Application() {
                _super.call(this);
            }
            /* =========================================================
                INVOKE MESSAGE CHAIN
                    - SEND DATA
                    - REPLY DATA
            ============================================================
                SEND DATA
            --------------------------------------------------------- */
            Application.prototype.sendData = function (invoke) {
                this.communicator.sendData(invoke);
            };
            /* ---------------------------------------------------------
                REPLY DATA
            --------------------------------------------------------- */
            Application.prototype.replyData = function (invoke) {
                invoke.apply(this);
            };
            Application.prototype.setAccount = function (id, name) {
                this.id = id;
                this.name = name;
                this.refresh();
            };
            Application.prototype.alert = function (message) {
                alert(message);
            };
            Application.prototype.refresh = function () {
                ReactDOM.render(this.render(), document.body);
            };
            return Application;
        }(React.Component));
        chat.Application = Application;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// <reference path="API.ts" />
var example;
(function (example) {
    var chat;
    (function (chat) {
        var ChatApplication = (function (_super) {
            __extends(ChatApplication, _super);
            function ChatApplication(host, uid) {
                _super.call(this);
                this.messages = "";
                this.host = host;
                this.room = new chat.ChatRoom();
                this.communicator = new chat.protocol.WebServerConnector(this);
                this.communicator.connect(this.host, chat.SERVER_PORT, "chat/" + uid);
            }
            /* =========================================================
                INVOKE MESSAGE CHAIN
                    - SEND DATA
                    - REPLY DATA
            ============================================================
                SEND DATA
            --------------------------------------------------------- */
            ChatApplication.prototype.send_message = function (event) {
                var to = document.getElementById("whisper_target_combo").value;
                var message = document.getElementById("message_input").value;
                if (to == "")
                    this.sendData(new chat.protocol.Invoke("talk", message));
                else
                    this.sendData(new chat.protocol.Invoke("whisper", to, message));
            };
            /* ---------------------------------------------------------
                REPLY DATA
            --------------------------------------------------------- */
            ChatApplication.prototype.setRoom = function (xml) {
                this.room.construct(xml);
                this.refresh();
            };
            ChatApplication.prototype.printTalk = function (senderID, message) {
                var sender = this.room.get(senderID);
                this.messages += chat.library.StringUtil.substitute("<p> <b>{1}</b>: {2} </p>", sender.getName(), message);
                document.getElementById("messages_div").innerHTML = this.messages;
            };
            ChatApplication.prototype.printWhisper = function (from, to, message) {
                var sender = this.room.get(from);
                var receiver = this.room.get(to);
                this.messages += chat.library.StringUtil.substitute("<p style='color:gray'> (Whisper) <b>{1}</b> to <b>{2}</b> : {3} </p>", sender.getName(), receiver.getName(), message);
                document.getElementById("messages_div").innerHTML = this.messages;
            };
            /* ---------------------------------------------------------
                VISUALIZER
            --------------------------------------------------------- */
            ChatApplication.prototype.render = function () {
                var whisper_target_options = [];
                var participant_elements = [];
                for (var i = 0; i < this.room.size(); i++) {
                    var participant = this.room.at(i);
                    // COMBOBOX TO WHISPER
                    whisper_target_options.push(React.createElement("option", {value: participant.getID()}, " ", participant.getName(), " "));
                    // LIST OF PARTICIPANTS
                    participant_elements.push(React.createElement("li", null, " ", participant.getName(), " (", participant.getID(), ") "));
                }
                return React.createElement("div", null, React.createElement("div", null, React.createElement("h2", null, " User Information "), React.createElement("ul", null, React.createElement("li", null, " ID: ", this.id, " "), React.createElement("li", null, " NAME: ", this.name, " ")), React.createElement("h2", null, " Participants "), React.createElement("ul", null, participant_elements)), React.createElement("div", null, React.createElement("h2", null, " Conversation "), React.createElement("div", {id: "messages_div"}), React.createElement("div", null, React.createElement("select", {id: "whisper_target_combo"}, React.createElement("option", {value: ""}, " To All "), whisper_target_options), React.createElement("input", {id: "message_input", type: "text", width: "400"}), React.createElement("button", {onClick: this.send_message.bind(this)}, "Send"))));
            };
            ChatApplication.prototype.refresh = function () {
                _super.prototype.refresh.call(this);
                document.getElementById("messages_div").innerHTML = this.messages;
            };
            ChatApplication.main = function () {
                var url_variables = new chat.library.URLVariables(location.href);
                if (url_variables.has("host") == false) {
                    alert("You're not logged-in.");
                    location.href = "login.html";
                    return;
                }
                var host = url_variables.get("host");
                var uid = Number(url_variables.get("uid"));
                var application = new ChatApplication(host, uid);
                ReactDOM.render(application.render(), document.body);
            };
            return ChatApplication;
        }(chat.Application));
        chat.ChatApplication = ChatApplication;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// <reference path="API.ts" />
var example;
(function (example) {
    var chat;
    (function (chat) {
        var ListApplication = (function (_super) {
            __extends(ListApplication, _super);
            /* ---------------------------------------------------------
                CONSTRUCTORS
            --------------------------------------------------------- */
            function ListApplication(host) {
                _super.call(this);
                this.host = host;
                this.room_list = new chat.ChatRoomList();
                this.communicator = new chat.protocol.WebServerConnector(this);
                this.communicator.connect(this.host, chat.SERVER_PORT, "list");
            }
            /* =========================================================
                INVOKE MESSAGE CHAIN
                    - SEND DATA
                    - REPLY DATA
            ============================================================
                SEND DATA
            --------------------------------------------------------- */
            ListApplication.prototype.create_room = function (event) {
                var name = document.getElementById("create_room_input").value;
                this.sendData(new chat.protocol.Invoke("createRoom", name));
            };
            /* ---------------------------------------------------------
                REPLY DATA
            --------------------------------------------------------- */
            ListApplication.prototype.setRoomList = function (xml) {
                this.room_list.construct(xml);
                this.refresh();
            };
            ListApplication.prototype.setRoom = function (uid, xml) {
                var room;
                if (this.room_list.has(uid) == false)
                    room = new chat.ChatRoom();
                else
                    room = this.room_list.get(uid);
                room.construct(xml);
                this.refresh();
            };
            /* ---------------------------------------------------------
                VISUALIZER
            --------------------------------------------------------- */
            ListApplication.prototype.render = function () {
                var room_elements = [];
                for (var i = 0; i < this.room_list.size(); i++) {
                    var room = this.room_list.at(i);
                    var link_address = "chat.html?host=" + this.host + "&uid=" + room.getUID();
                    var participant_elements = [];
                    for (var j = 0; j < room.size(); j++) {
                        var participant = room.at(j);
                        participant_elements.push(React.createElement("li", null, " ", participant.getID(), ": ", participant.getName(), " "));
                    }
                    room_elements.push(React.createElement("p", null, React.createElement("a", {href: link_address, target: "_blank"}, React.createElement("table", null, React.createElement("tr", null, React.createElement("td", null, " No "), React.createElement("td", null, " ", room.getUID(), " ")), React.createElement("tr", null, React.createElement("td", null, " Title "), React.createElement("td", null, " ", room.getTitle(), " ")), React.createElement("tr", null, React.createElement("td", null, " Participants "), React.createElement("td", null, React.createElement("ol", null, participant_elements)))))));
                }
                return React.createElement("div", null, React.createElement("h2", null, " User Information "), React.createElement("ul", null, React.createElement("li", null, " Account ID: ", this.id, " "), React.createElement("li", null, " Name: ", this.name, " ")), React.createElement("h2", null, " List of Chatting Room "), room_elements, React.createElement("h2", null, " Create Room "), React.createElement("input", {id: "create_room_input", type: "text"}), React.createElement("button", {onClick: this.create_room.bind(this)}, "Create"));
            };
            ListApplication.main = function () {
                var url_variables = new chat.library.URLVariables(location.href);
                if (url_variables.has("host") == false) {
                    alert("You're not logged-in.");
                    location.href = "login.html";
                    return;
                }
                var host = url_variables.get("host");
                var application = new ListApplication(host);
                ReactDOM.render(application.render(), document.body);
            };
            return ListApplication;
        }(chat.Application));
        chat.ListApplication = ListApplication;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
/// <reference path="API.ts" />
var example;
(function (example) {
    var chat;
    (function (chat) {
        var LoginApplication = (function (_super) {
            __extends(LoginApplication, _super);
            function LoginApplication() {
                _super.apply(this, arguments);
            }
            /* ---------------------------------------------------------
                TRY LOGIN
            --------------------------------------------------------- */
            LoginApplication.prototype.handle_login_click = function (event) {
                // REMEMBER TEMPORARILY
                this.host = document.getElementById("host_input").value;
                this.id = document.getElementById("id_input").value;
                this.name = document.getElementById("name_input").value;
                // CONNECT
                this.communicator = new chat.protocol.WebServerConnector(this);
                this.communicator.onConnect = this.handle_connect.bind(this);
                this.communicator.connect(this.host, chat.SERVER_PORT);
            };
            LoginApplication.prototype.handle_connect = function () {
                // AFTER CONNECTION, DO LOGIN IMMEDIATELY
                this.login();
            };
            /* =========================================================
                INVOKE MESSAGE CHAIN
                    - SEND DATA
                    - REPLY DATA
            ============================================================
                SEND DATA
            --------------------------------------------------------- */
            // DO LOGIN
            LoginApplication.prototype.login = function () {
                this.sendData(new chat.protocol.Invoke("login", this.id, this.name));
            };
            /* ---------------------------------------------------------
                REPLY DATA
            --------------------------------------------------------- */
            LoginApplication.prototype.setAccount = function (id, name) {
                // GOT INFORMATION ABOUT ACCOUT -> LOGIN SUCCESS
                location.href = "list.html?host=" + encodeURIComponent(this.host);
            };
            LoginApplication.prototype.handleLoginFailed = function (message) {
                if (message === void 0) { message = ""; }
                // LOGIN FAILED
                alert(message);
            };
            /* ---------------------------------------------------------
                VISUALIZER
            --------------------------------------------------------- */
            LoginApplication.prototype.render = function () {
                return React.createElement("table", null, React.createElement("tbody", null, React.createElement("tr", null, React.createElement("td", null, " Host "), React.createElement("td", null, " ", React.createElement("input", {id: "host_input", type: "input", defaultValue: "127.0.0.1"}), " "), React.createElement("td", {rowSpan: "3"}, React.createElement("button", {onClick: this.handle_login_click.bind(this), style: { height: 72 }}, "Log-in"))), React.createElement("tr", null, React.createElement("td", null, " ID "), React.createElement("td", null, " ", React.createElement("input", {id: "id_input", type: "input", defaultValue: "samchon"}), " ")), React.createElement("tr", null, React.createElement("td", null, " Name "), React.createElement("td", null, " ", React.createElement("input", {id: "name_input", type: "input", defaultValue: "Jeongho Nam"}), " "))));
            };
            LoginApplication.main = function () {
                ReactDOM.render(React.createElement(LoginApplication, null), document.body);
            };
            return LoginApplication;
        }(chat.Application));
        chat.LoginApplication = LoginApplication;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
