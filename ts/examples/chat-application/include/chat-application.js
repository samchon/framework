/// <reference types="samchon-framework" />
/// <reference types="react" />
/// <reference types="react-dom" />
var example;
(function (example) {
    var chat;
    (function (chat) {
        chat.library = samchon.library;
        chat.protocol = samchon.protocol;
        chat.SERVER_HOST = "115.71.237.198";
        chat.SERVER_PORT = 11723;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
        var CboutUsApplication = (function (_super) {
            __extends(CboutUsApplication, _super);
            function CboutUsApplication() {
                _super.apply(this, arguments);
            }
            // try ContactApplication 
            /* ---------------------------------------------------------
                VISUALIZER
            --------------------------------------------------------- */
            CboutUsApplication.prototype.render = function () {
                return React.createElement("div", null, 
                    React.createElement("div", {id: "wrapper"}, 
                        React.createElement("div", {id: "sidebar-wrapper"}, 
                            React.createElement("ul", {className: "sidebar-nav"}, 
                                React.createElement("li", {className: "sidebar-brand"}, 
                                    React.createElement("div", {className: "talk-title"}, 
                                        React.createElement("h2", null, " SamchonTalk ")
                                    )
                                ), 
                                React.createElement("br", null), 
                                React.createElement("br", null), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "list.html"}, "Dashboard")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "video.html"}, "Video")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "overview.html"}, "Overview")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "aboutus.html"}, "About")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "services.html"}, "Services")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "contact.html"}, "Contact")
                                )), 
                            React.createElement("div", {className: "user-info"}, 
                                React.createElement("h3", null, " INFORMATION "), 
                                React.createElement("h5", null, 
                                    "Account ID: ", 
                                    this.id), 
                                React.createElement("h5", null, 
                                    "Name: ", 
                                    this.name))), 
                        React.createElement("div", null, 
                            React.createElement("div", null, 
                                React.createElement("div", {className: "container bg-light-gray"}, 
                                    React.createElement("div", {className: "row"}, 
                                        React.createElement("div", {className: "col-lg-12 text-center"}, 
                                            React.createElement("h2", {className: "section-heading"}, "About Us"), 
                                            React.createElement("h3", {className: "section-subheading text-muted"}, "SamchonFramework Team"))
                                    ), 
                                    React.createElement("div", {className: "row"}, 
                                        React.createElement("div", {className: "col-sm-12"}, 
                                            React.createElement("div", {className: "team-member"}, 
                                                React.createElement("img", {src: "https://avatars2.githubusercontent.com/u/13158709?v=3&s=280", className: "img-responsive img-circle", alt: ""}), 
                                                React.createElement("h4", null, "남정호"), 
                                                React.createElement("p", {className: "text-muted"}, "Team Reader"), 
                                                React.createElement("ul", {className: "list-inline social-buttons"}, 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-github"})
                                                        )
                                                    ), 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-facebook"})
                                                        )
                                                    ), 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-linkedin"})
                                                        )
                                                    )))
                                        )
                                    ), 
                                    React.createElement("div", {className: "row"}, 
                                        React.createElement("div", {className: "col-sm-6"}, 
                                            React.createElement("div", {className: "team-member"}, 
                                                React.createElement("img", {src: "https://avatars2.githubusercontent.com/u/13158709?v=3&s=200", className: "img-responsive img-circle", alt: ""}), 
                                                React.createElement("h4", null, "이아름"), 
                                                React.createElement("p", {className: "text-muted"}, "Lead Designer"), 
                                                React.createElement("ul", {className: "list-inline social-buttons"}, 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-github"})
                                                        )
                                                    ), 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-facebook"})
                                                        )
                                                    ), 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-linkedin"})
                                                        )
                                                    )))
                                        ), 
                                        React.createElement("div", {className: "col-sm-6"}, 
                                            React.createElement("div", {className: "team-member"}, 
                                                React.createElement("img", {src: "https://avatars2.githubusercontent.com/u/13158709?v=3&s=200", className: "img-responsive img-circle", alt: ""}), 
                                                React.createElement("h4", null, "이정훈"), 
                                                React.createElement("p", {className: "text-muted"}, "Lead Marketer"), 
                                                React.createElement("ul", {className: "list-inline social-buttons"}, 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-github"})
                                                        )
                                                    ), 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-facebook"})
                                                        )
                                                    ), 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-linkedin"})
                                                        )
                                                    )))
                                        )), 
                                    React.createElement("div", {className: "row"}, 
                                        React.createElement("div", {className: "col-sm-6"}, 
                                            React.createElement("div", {className: "team-member"}, 
                                                React.createElement("img", {src: "https://avatars2.githubusercontent.com/u/13158709?v=3&s=200", className: "img-responsive img-circle", alt: ""}), 
                                                React.createElement("h4", null, "이다빈"), 
                                                React.createElement("p", {className: "text-muted"}, "Lead Developer"), 
                                                React.createElement("ul", {className: "list-inline social-buttons"}, 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-github"})
                                                        )
                                                    ), 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-facebook"})
                                                        )
                                                    ), 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-linkedin"})
                                                        )
                                                    )))
                                        ), 
                                        React.createElement("div", {className: "col-sm-6"}, 
                                            React.createElement("div", {className: "team-member"}, 
                                                React.createElement("img", {src: "https://avatars2.githubusercontent.com/u/13158709?v=3&s=200", className: "img-responsive img-circle", alt: ""}), 
                                                React.createElement("h4", null, "이두두"), 
                                                React.createElement("p", {className: "text-muted"}, "Lead Developer"), 
                                                React.createElement("ul", {className: "list-inline social-buttons"}, 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-github"})
                                                        )
                                                    ), 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-facebook"})
                                                        )
                                                    ), 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {href: "#"}, 
                                                            React.createElement("i", {className: "fa fa-linkedin"})
                                                        )
                                                    )))
                                        )), 
                                    React.createElement("div", {className: "row"}, 
                                        React.createElement("div", {className: "col-lg-8 col-lg-offset-2 text-center"}, 
                                            React.createElement("p", {className: "large text-muted"}, "Lorem ipsum dolor sit amet, consectetur adipisicing elit.Aut eaque, laboriosam veritatis, quos non quis ad perspiciatis, totam corporis ea, alias ut unde.")
                                        )
                                    ))
                            )
                        ))
                );
            };
            CboutUsApplication.main = function () {
                ReactDOM.render(React.createElement(CboutUsApplication, null), document.body);
            };
            return CboutUsApplication;
        }(chat.Application));
        chat.CboutUsApplication = CboutUsApplication;
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
            function ChatApplication(uid) {
                _super.call(this);
                this.messages = "";
                this.room = new chat.ChatRoom();
                this.communicator = new chat.protocol.WebServerConnector(this);
                this.communicator.connect(chat.SERVER_HOST, chat.SERVER_PORT, "chat/" + uid);
            }
            /* =========================================================
                INVOKE MESSAGE CHAIN
                    - SEND DATA
                    - REPLY DATA
            ============================================================
                SEND DATA
            --------------------------------------------------------- */
            ChatApplication.prototype.send_message = function (event) {
                var to = document.getElementById("whisper").innerText;
                console.log(to);
                // let to: string = (document.getElementById("whisper_target_combo") as HTMLSelectElement).value;
                var message = document.getElementById("message_input").value;
                if (!message) {
                    console.log("not messages");
                    // alert("메시지를 입력해주세요.");
                    return;
                }
                if (to == "To All ")
                    this.sendData(new chat.protocol.Invoke("talk", message));
                else
                    this.sendData(new chat.protocol.Invoke("whisper", to, message));
                document.getElementById("message_input").value = '';
            };
            ChatApplication.prototype.send_message2 = function (event) {
                if (event.charCode == 13) {
                    var to = document.getElementById("whisper").innerText;
                    console.log(to);
                    // let to: string = (document.getElementById("whisper_target_combo") as HTMLSelectElement).value;
                    var message = document.getElementById("message_input").value;
                    if (!message) {
                        console.log("not messages");
                        return;
                    }
                    if (to == "To All ")
                        this.sendData(new chat.protocol.Invoke("talk", message));
                    else
                        this.sendData(new chat.protocol.Invoke("whisper", to, message));
                    document.getElementById("message_input").value = '';
                }
            };
            ChatApplication.prototype.whisper_target_select = function (id, whisper_target_list) {
                console.log(id);
                // console.log(whisper_target_list);
                console.log(whisper_target_list[id].props.children.props.children);
                var whisper_taget = whisper_target_list[id].props.children.props.children;
                // let to: string = (document.getElementById(whisper_taget) as HTMLLIElement).textContent;
                document.getElementById("whisper").textContent = whisper_taget + ' ';
                var span = document.createElement('span');
                span.setAttribute('class', 'caret');
                document.getElementById("whisper").appendChild(span);
            };
            ChatApplication.prototype.whisper_target_all = function (id) {
                document.getElementById("whisper").textContent = 'To All ';
                var span = document.createElement('span');
                span.setAttribute('class', 'caret');
                document.getElementById("whisper").appendChild(span);
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
                this.messages += chat.library.StringUtil.substitute((senderID == this.id) ? "<ol><li class='me'><b>{1}<b>: {2} </li></ol><br>" : "<ol><li class='you'> <b>{1}</b>: {2} </li></ol><br>", sender.getName(), message);
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
                var whisper_target_list = [];
                for (var i = 0; i < this.room.size(); i++) {
                    var participant = this.room.at(i);
                    // COMBOBOX TO WHISPER
                    whisper_target_options.push(React.createElement("option", {value: participant.getID()}, 
                        " ", 
                        participant.getName(), 
                        " "));
                    // LIST OF PARTICIPANTS
                    participant_elements.push(React.createElement("li", null, 
                        " ", 
                        participant.getName(), 
                        " (", 
                        participant.getID(), 
                        ") "));
                    whisper_target_list.push(React.createElement("li", {key: i}, 
                        React.createElement("a", {onClick: this.whisper_target_select.bind(this, i, whisper_target_list), href: "#", id: participant.getID()}, participant.getName())
                    ));
                }
                return React.createElement("div", null, 
                    React.createElement("div", {id: "wrapper"}, 
                        React.createElement("div", {id: "sidebar-wrapper"}, 
                            React.createElement("ul", {className: "sidebar-nav"}, 
                                React.createElement("li", {className: "sidebar-brand"}, 
                                    React.createElement("div", {className: "talk-title"}, 
                                        React.createElement("h2", null, " SamchonTalk ")
                                    )
                                ), 
                                React.createElement("br", null), 
                                React.createElement("br", null), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "list.html"}, "Dashboard")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "video.html"}, "Video")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "overview.html"}, "Overview")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "aboutus.html"}, "About")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "services.html"}, "Services")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "contact.html"}, "Contact")
                                )), 
                            React.createElement("div", {className: "user-info"}, 
                                React.createElement("h3", null, " INFORMATION "), 
                                React.createElement("h5", null, 
                                    "Account ID: ", 
                                    this.id), 
                                React.createElement("h5", null, 
                                    "Name: ", 
                                    this.name))), 
                        React.createElement("div", {id: "page-content-wrapper"}, 
                            React.createElement("div", {className: "container-fluid"}, 
                                React.createElement("div", {className: "participant"}, 
                                    React.createElement("h2", null, " Participant List "), 
                                    React.createElement("ul", null, participant_elements)), 
                                React.createElement("div", {className: "conversation"}, 
                                    React.createElement("h2", null, " Conversation "), 
                                    React.createElement("div", {className: "chat-canvas"}, 
                                        React.createElement("div", {id: "messages_div"})
                                    )), 
                                React.createElement("br", null), 
                                React.createElement("div", {className: "row input-message"}, 
                                    React.createElement("div", {className: "col-lg-6"}, 
                                        React.createElement("div", {className: "input-group"}, 
                                            React.createElement("div", {className: "input-group-btn"}, 
                                                React.createElement("button", {id: "whisper", type: "button", className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", "aria-expanded": "false"}, 
                                                    "To All ", 
                                                    React.createElement("span", {className: "caret"})), 
                                                React.createElement("ul", {className: "dropdown-menu", id: "demolist", role: "menu"}, 
                                                    React.createElement("li", null, 
                                                        React.createElement("a", {onClick: this.whisper_target_all.bind(this), href: "#", id: "To All"}, "To All")
                                                    ), 
                                                    whisper_target_list)), 
                                            React.createElement("input", {type: "text", className: "form-control", id: "message_input", onKeyPress: this.send_message2.bind(this), placeholder: "Type your message."}), 
                                            React.createElement("div", {className: "input-group-btn"}, 
                                                React.createElement("button", {type: "button", className: "btn btn-default", onClick: this.send_message.bind(this)}, "Send")
                                            ))
                                    )
                                ))
                        ))
                );
                // 			return <div>
                // 				<div className="participant">
                // 					<h2> Participant List </h2>
                // 					<ul>
                // 						{participant_elements}
                // 					</ul>
                // 				</div>
                // 				<div className="conversation">
                // 					<h2> Conversation </h2>
                // 					<div className="chat-canvas">
                // 						<div id="messages_div">
                // 						</div>
                // 					</div>
                // 				</div>
                // 				<div className="chat-input2">
                // 					<select id="whisper_target_combo">
                // 						<option value={""}> To All </option>
                // 						{whisper_target_options}
                // 					</select>
                // 					<input id="message_input" type="text" width="400" onKeyPress={this.send_message2.bind(this) }/>
                // 					<button onClick={this.send_message.bind(this) } >Send</button>
                // 				</div>
                // <br/>
                // 				<div className="row">
                // 					<div className="col-lg-6">
                // 						<div className="input-group">
                // 							<div className="input-group-btn">
                // 								<button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">To All <span className="caret"></span></button>
                // 								<ul className="dropdown-menu" id="whisper_target_combo2" role="menu">
                // 									<li><a href="#">Action</a></li>
                // 									<li><a href="#">Another action</a></li>
                // 									<li><a href="#">Something else here</a></li>
                // 									<li><a href="#">Separated link</a></li>
                // 								</ul>
                // 							</div>
                // 							<input type="text" className="form-control" id="message_input" onKeyPress={this.send_message2.bind(this) } placeholder="Type your message."/>
                // 							<div className="input-group-btn">
                // 								<button type="button" className="btn btn-default" onClick={this.send_message.bind(this) }>Send</button>							
                // 							</div>
                // 						</div>
                // 					</div>
                // 				</div>
                // 			</div>;
            };
            ChatApplication.prototype.refresh = function () {
                _super.prototype.refresh.call(this);
                document.getElementById("messages_div").innerHTML = this.messages;
            };
            ChatApplication.main = function () {
                var url_variables = new chat.library.URLVariables(location.href);
                var uid = Number(url_variables.get("uid"));
                var application = new ChatApplication(uid);
                ReactDOM.render(application.render(), document.body);
            };
            return ChatApplication;
        }(chat.Application));
        chat.ChatApplication = ChatApplication;
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
/// <reference path="API.ts" />
var example;
(function (example) {
    var chat;
    (function (chat) {
        var ContactApplication = (function (_super) {
            __extends(ContactApplication, _super);
            function ContactApplication() {
                _super.apply(this, arguments);
            }
            // try ContactApplication 
            /* ---------------------------------------------------------
                VISUALIZER
            --------------------------------------------------------- */
            ContactApplication.prototype.render = function () {
                return React.createElement("div", null, 
                    React.createElement("div", {id: "wrapper"}, 
                        React.createElement("div", {id: "sidebar-wrapper"}, 
                            React.createElement("ul", {className: "sidebar-nav"}, 
                                React.createElement("li", {className: "sidebar-brand"}, 
                                    React.createElement("div", {className: "talk-title"}, 
                                        React.createElement("h2", null, " SamchonTalk ")
                                    )
                                ), 
                                React.createElement("br", null), 
                                React.createElement("br", null), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "list.html"}, "Dashboard")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "video.html"}, "Video")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "overview.html"}, "Overview")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "aboutus.html"}, "About")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "services.html"}, "Services")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "contact.html"}, "Contact")
                                )), 
                            React.createElement("div", {className: "user-info"}, 
                                React.createElement("h3", null, " INFORMATION "), 
                                React.createElement("h5", null, 
                                    "Account ID: ", 
                                    this.id), 
                                React.createElement("h5", null, 
                                    "Name: ", 
                                    this.name))), 
                        React.createElement("div", {id: "page-content-wrapper"}, 
                            React.createElement("div", {className: "container-fluid"}, 
                                React.createElement("div", {className: "row"}, 
                                    React.createElement("div", {className: "feature-content"}, 
                                        React.createElement("div", {className: "col-lg-8 col-lg-offset-2"}, 
                                            React.createElement("div", {className: "form-top"}, 
                                                React.createElement("div", {className: "form-top-left"}, 
                                                    React.createElement("h2", null, "Contact us"), 
                                                    React.createElement("p", null, "Fill in the form below to send us a message: ")), 
                                                React.createElement("div", {className: "form-top-right"}, 
                                                    React.createElement("i", {className: "fa fa-envelope"})
                                                )), 
                                            React.createElement("div", {className: "form-bottom contact-form"}, 
                                                React.createElement("form", {role: "form", action: "assets/contact.php", method: "post"}, 
                                                    React.createElement("div", {className: "form-group"}, 
                                                        React.createElement("label", {className: "sr-only", htmlFor: "contact-email"}, "Email"), 
                                                        React.createElement("input", {type: "text", name: "email", placeholder: "Email...", className: "contact-email form-control", id: "contact-email"})), 
                                                    React.createElement("div", {className: "form-group"}, 
                                                        React.createElement("label", {className: "sr-only", htmlFor: "contact-subject"}, "Subject"), 
                                                        React.createElement("input", {type: "text", name: "subject", placeholder: "Subject...", className: "contact-subject form-control", id: "contact-subject"})), 
                                                    React.createElement("div", {className: "form-group"}, 
                                                        React.createElement("label", {className: "sr-only", htmlFor: "contact-message"}, "Message"), 
                                                        React.createElement("textarea", {name: "message", placeholder: "Message...", className: "contact-message form-control", id: "contact-message", defaultValue: ""})), 
                                                    React.createElement("button", {type: "submit", className: "btn btn-success"}, "Send message"))
                                            ))
                                    )
                                )
                            )
                        ))
                );
            };
            ContactApplication.main = function () {
                ReactDOM.render(React.createElement(ContactApplication, null), document.body);
            };
            return ContactApplication;
        }(chat.Application));
        chat.ContactApplication = ContactApplication;
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
            function ListApplication() {
                _super.call(this);
                this.room_name_tabs = []; /* 채팅방 탭 제목 배열 */
                this.room_tabs = []; /* 채팅방 탭 내용 배열 */
                this.room_list = new chat.ChatRoomList();
                this.communicator = new chat.protocol.WebServerConnector(this);
                this.communicator.connect(chat.SERVER_HOST, chat.SERVER_PORT, "list");
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
                if (this.room_list.has(uid) == false) {
                    room = new chat.ChatRoom();
                    this.room_list.push_back(room);
                }
                else
                    room = this.room_list.get(uid);
                room.construct(xml);
                this.refresh();
            };
            /*----------------------------------------------------
                채팅방 탭 추가
            ----------------------------------------------------*/
            ListApplication.prototype.enter_chat_room = function (uid, title) {
                var chatRoomUrl = "chat.html?&uid=" + uid;
                var room_name_link = "#" + uid;
                this.room_name_tabs.push(React.createElement("li", null, 
                    React.createElement("a", {"data-toggle": "tab", href: room_name_link}, title)
                ));
                this.room_tabs.push(React.createElement("div", {id: String(uid), className: "tab-pane fade"}, 
                    React.createElement("iframe", {src: chatRoomUrl, height: "100%", width: "100%"})
                ));
                this.refresh();
            };
            /* ---------------------------------------------------------
                    VISUALIZER
                --------------------------------------------------------- */
            ListApplication.prototype.render = function () {
                var room_elements = [];
                var imageList = [
                    'https://thumbs.dreamstime.com/x/european-city-illustration-37366790.jpg',
                    'http://www.icanbecreative.com/res/2014/12/night-city-illustrations.jpg',
                    'https://thumbs.dreamstime.com/t/shopping-city-retro-colors-vector-illustration-center-33767869.jpg',
                    'https://s-media-cache-ak0.pinimg.com/originals/5b/35/32/5b35323ed68751c62a328f6e80389159.jpg'
                ];
                for (var i = 0; i < this.room_list.size(); i++) {
                    var room = this.room_list.at(i);
                    var link_address = "chat.html?&uid=" + room.getUID();
                    var participant_elements = [];
                    var imageRandom = Math.floor(Math.random() * (3 - 0 + 1));
                    for (var j = 0; j < room.size(); j++) {
                        var participant = room.at(j);
                        participant_elements.push(React.createElement("li", null, 
                            " ", 
                            participant.getID(), 
                            ": ", 
                            participant.getName(), 
                            " "));
                    }
                    room_elements.push(
                    // <div className="panel panel-default chat-room-item col-sm-4 col-md-3">
                    // 	<div className="panel-heading">
                    // 		<h3 className="panel-title">No.{room.getUID() }</h3>
                    // 		<h3>{room.getTitle() }</h3>
                    // 	</div>
                    // 	<div className="pane-body">
                    // 		<p>{participant_elements}</p>
                    // 		<a href={link_address} target="_blank" className="btn btn-primary">참여</a>
                    // 	</div>
                    // </div>
                    React.createElement("div", {className: "col-sm-6 col-md-4"}, 
                        React.createElement("div", {className: "card-room-container"}, 
                            React.createElement("div", {className: "thumbnail card-room"}, 
                                React.createElement("img", {src: imageList[(room.getUID() - 1) % 4], alt: "..."}), 
                                React.createElement("div", {className: "caption"}, 
                                    React.createElement("h3", null, room.getTitle()), 
                                    React.createElement("p", null, participant_elements), 
                                    React.createElement("p", null, 
                                        React.createElement("a", {href: link_address, target: "_blank", className: "btn btn-default"}, "참여")
                                    )))
                        )
                    ));
                }
                return React.createElement("div", null, 
                    React.createElement("div", {id: "wrapper"}, 
                        React.createElement("div", {id: "sidebar-wrapper"}, 
                            React.createElement("ul", {className: "sidebar-nav"}, 
                                React.createElement("li", {className: "sidebar-brand"}, 
                                    React.createElement("div", {className: "talk-title"}, 
                                        React.createElement("h2", null, " SamchonTalk ")
                                    )
                                ), 
                                React.createElement("br", null), 
                                React.createElement("br", null), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "#"}, "Dashboard")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "video.html"}, "Video")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "overview.html"}, "Overview")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "aboutus.html"}, "About")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "services.html"}, "Services")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "contact.html"}, "Contact")
                                )), 
                            React.createElement("div", {className: "user-info"}, 
                                React.createElement("h3", null, " INFORMATION "), 
                                React.createElement("h5", null, 
                                    "Account ID: ", 
                                    this.id), 
                                React.createElement("h5", null, 
                                    "Name: ", 
                                    this.name))), 
                        React.createElement("div", {id: "page-content-wrapper"}, 
                            React.createElement("div", {className: "container-fluid"}, 
                                React.createElement("div", null, 
                                    React.createElement("div", {className: "create-room input-group"}, 
                                        React.createElement("h2", null, " Create Room "), 
                                        React.createElement("div", {className: "input-group"}, 
                                            React.createElement("input", {id: "create_room_input", type: "text", className: "form-control"}), 
                                            React.createElement("span", {className: "input-group-btn"}, 
                                                React.createElement("button", {className: "btn btn-default", type: "button", onClick: this.create_room.bind(this)}, "Create")
                                            )))
                                ), 
                                React.createElement("br", null), 
                                React.createElement("br", null), 
                                React.createElement("hr", null), 
                                React.createElement("br", null), 
                                React.createElement("div", null, 
                                    React.createElement("h2", null, " Room List"), 
                                    React.createElement("br", null), 
                                    room_elements))
                        ))
                );
                // return <div>
                // 	<div class="row">
                // 		<div className="col-sm-3 col-md-2 sidebar">
                // 			<div className="talk-title">
                // 				<h1>✿ 삼촌톡 ✿</h1>
                // 			</div>
                // 			<div className="create-room">
                // 				<h2> Create Room </h2>
                // 				<input id="create_room_input" type="text" />
                // 				<button onClick={this.create_room.bind(this) }>Create</button>
                // 			</div>
                // 			<div className="chat-room-list">
                // 				<h2> List of Chatting Room </h2>
                // 				{room_elements}
                // 			</div>
                // 			<div className="user-info">
                // 				<h2> User Information </h2>
                // 				<ul>
                // 					<li> Account ID: {this.id} </li>
                // 					<li> Name: {this.name} </li>
                // 				</ul>
                // 			</div>
                // 		</div>
                // 		<div className="main">
                // 			<div>
                // 				<ul className="nav nav-tabs">
                // 					<li className="active"><a data-toggle="tab" href="#home">Home</a></li>
                // 					{this.room_name_tabs}
                // 				</ul>
                // 				<div className="tab-content chat-area">
                // 					<div id="home" className="tab-pane fade in active">
                // 						<span className="glyphicon glyphicon-envelope test">
                // 						<h2>WELCOME TO SAMPLE CHAT</h2>
                // 						<p><h3>왼쪽 메뉴에서 채팅방을 만든 후 '참여' 버튼을 눌러 채팅을 즐기세요!</h3></p>
                // 						</span>
                // 					</div>
                // 					{this.room_tabs}
                // 				</div>
                // 			</div>
                // 		</div>
                // 	</div>
                // </div>
                // 	;
            };
            ListApplication.main = function () {
                ReactDOM.render(React.createElement(ListApplication, null), document.body);
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
                this.id = document.getElementById("id").value;
                this.name = document.getElementById("name").value;
                if (!this.id || !this.name) {
                    alert("ID 또는 NAME을 정확히 입력해주세요.");
                    return;
                }
                // CONNECT
                this.communicator = new chat.protocol.WebServerConnector(this);
                this.communicator.onConnect = this.handle_connect.bind(this);
                this.communicator.connect(chat.SERVER_HOST, chat.SERVER_PORT);
            };
            LoginApplication.prototype.handle_login_click2 = function (event) {
                if (event.charCode == 13) {
                    // REMEMBER TEMPORARILY
                    this.id = document.getElementById("id").value;
                    this.name = document.getElementById("name").value;
                    if (!this.id || !this.name) {
                        alert("ID 또는 NAME을 정확히 입력해주세요.");
                        return;
                    }
                    // CONNECT
                    this.communicator = new chat.protocol.WebServerConnector(this);
                    this.communicator.onConnect = this.handle_connect.bind(this);
                    this.communicator.connect(chat.SERVER_HOST, chat.SERVER_PORT);
                }
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
                location.href = "list.html";
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
                return React.createElement("div", {className: "login-box"}, 
                    React.createElement("div", {className: "lb-header"}, 
                        React.createElement("a", {href: "#", className: "active", id: "login-box-link"}, "Samchon Talk")
                    ), 
                    React.createElement("div", {className: "email-login"}, 
                        React.createElement("div", {className: "u-form-group"}, 
                            React.createElement("input", {type: "text", id: "id", name: "id", placeholder: "ID", onKeyPress: this.handle_login_click2.bind(this)})
                        ), 
                        React.createElement("div", {className: "u-form-group"}, 
                            React.createElement("input", {type: "text", id: "name", name: "name", placeholder: "NAME", onKeyPress: this.handle_login_click2.bind(this)})
                        ), 
                        React.createElement("div", {className: "u-form-group"}, 
                            React.createElement("button", {id: "quickstart-sign-in", onClick: this.handle_login_click.bind(this)}, "Log In")
                        ), 
                        React.createElement("div", {className: "u-form-group"}, 
                            React.createElement("a", {href: "#", className: "forgot-password"}, "Forgot password?")
                        )), 
                    React.createElement("div", {className: "social-login"}, 
                        React.createElement("a", {href: "#"}, 
                            React.createElement("i", {className: "fa fa-facebook fa-lg"}), 
                            "login with facebook"), 
                        React.createElement("a", {href: "#"}, 
                            React.createElement("i", {className: "fa fa-google-plus fa-lg"}), 
                            "login with Google")));
                // return <table>
                // 	<tbody>
                // 		<tr>
                // 			<td> ID </td>
                // 			<td> <input id="id_input" type="input" defaultValue="samchon" /> </td>
                // 			<td rowSpan="2">
                // 				<button onClick={this.handle_login_click.bind(this) }
                // 					style={{ height: 50 }}>Log-in</button>
                // 			</td>
                // 		</tr>
                // 		<tr>
                // 			<td> Name </td>
                // 			<td> <input id="name_input" type="input" defaultValue="Samchon" /> </td>
                // 		</tr>
                // 	</tbody>
                // </table>;
            };
            LoginApplication.main = function () {
                ReactDOM.render(React.createElement(LoginApplication, null), document.body);
            };
            return LoginApplication;
        }(chat.Application));
        chat.LoginApplication = LoginApplication;
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
        var OverviewApplication = (function (_super) {
            __extends(OverviewApplication, _super);
            function OverviewApplication() {
                _super.apply(this, arguments);
            }
            // try OverviewApplication 
            /* ---------------------------------------------------------
                VISUALIZER
            --------------------------------------------------------- */
            OverviewApplication.prototype.render = function () {
                return React.createElement("div", null, 
                    React.createElement("div", {id: "wrapper"}, 
                        React.createElement("div", {id: "sidebar-wrapper"}, 
                            React.createElement("ul", {className: "sidebar-nav"}, 
                                React.createElement("li", {className: "sidebar-brand"}, 
                                    React.createElement("div", {className: "talk-title"}, 
                                        React.createElement("h2", null, " SamchonTalk ")
                                    )
                                ), 
                                React.createElement("br", null), 
                                React.createElement("br", null), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "list.html"}, "Dashboard")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "video.html"}, "Video")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "overview.html"}, "Overview")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "aboutus.html"}, "About")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "services.html"}, "Services")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "contact.html"}, "Contact")
                                )), 
                            React.createElement("div", {className: "user-info"}, 
                                React.createElement("h3", null, " INFORMATION "), 
                                React.createElement("h5", null, 
                                    "Account ID: ", 
                                    this.id), 
                                React.createElement("h5", null, 
                                    "Name: ", 
                                    this.name))), 
                        React.createElement("div", {id: "page-content-wrapper"}, 
                            React.createElement("div", {className: "container-fluid"}, 
                                React.createElement("p", null, 
                                    React.createElement("h2", null, "Samchon Framework is"), 
                                    "Samchon framework is an ", 
                                    React.createElement("strong", null, "OON1"), 
                                    " framework; who can build network system within framework of ", 
                                    React.createElement("strong", null, "OOD2"), 
                                    ", like cloud system and distributed & parallel processing systems, even how the system is enormously complicate." + ' ' + "Samchon Framework supports two languages; C++and TypeScript/NodeJs.Not only connecting to an external server, but also opening a server is also possible both in ", 
                                    React.createElement("strong", null, "C++"), 
                                    "and ", 
                                    React.createElement("strong", null, "TypeScript/NodeJS."), 
                                    "In my case, I prefer to build a cloud server with TypeScript & NodeJS quickly.When the cloud server grows up and lots of traffic occurs, I let the cloud server to deliver heavy processes to Distributed systems built via C++."), 
                                React.createElement("img", {src: "https://camo.githubusercontent.com/4cec4c0dde09984806b7a4353cba82e69dcd9bde/687474703a2f2f73616d63686f6e2e6769746875622e696f2f6672616d65776f726b2f696d616765732f6163636573736f72792f6c616e67756167655f6469616772616d2e706e67"}), 
                                React.createElement("img", {src: "https://camo.githubusercontent.com/404a0fedbcd61c760016968e9dbd578cd415b7cd/687474703a2f2f73616d63686f6e2e6769746875622e696f2f6672616d65776f726b2f696d616765732f6578616d706c652f696e746572616374696f6e2f64656d6f2e676966"}))
                        ))
                );
            };
            OverviewApplication.main = function () {
                ReactDOM.render(React.createElement(OverviewApplication, null), document.body);
            };
            return OverviewApplication;
        }(chat.Application));
        chat.OverviewApplication = OverviewApplication;
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
        var ServicesApplication = (function (_super) {
            __extends(ServicesApplication, _super);
            function ServicesApplication() {
                _super.apply(this, arguments);
            }
            // try ServicesApplication 
            /* ---------------------------------------------------------
                VISUALIZER
            --------------------------------------------------------- */
            ServicesApplication.prototype.render = function () {
                return React.createElement("div", null, 
                    React.createElement("div", {id: "wrapper"}, 
                        React.createElement("div", {id: "sidebar-wrapper"}, 
                            React.createElement("ul", {className: "sidebar-nav"}, 
                                React.createElement("li", {className: "sidebar-brand"}, 
                                    React.createElement("div", {className: "talk-title"}, 
                                        React.createElement("h2", null, " SamchonTalk ")
                                    )
                                ), 
                                React.createElement("br", null), 
                                React.createElement("br", null), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "list.html"}, "Dashboard")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "video.html"}, "Video")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "overview.html"}, "Overview")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "aboutus.html"}, "About")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "services.html"}, "Services")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "contact.html"}, "Contact")
                                )), 
                            React.createElement("div", {className: "user-info"}, 
                                React.createElement("h3", null, " INFORMATION "), 
                                React.createElement("h5", null, 
                                    "Account ID: ", 
                                    this.id), 
                                React.createElement("h5", null, 
                                    "Name: ", 
                                    this.name))), 
                        React.createElement("div", {className: "container-fluid bg-light-gray"}, 
                            React.createElement("div", {className: "row"}, 
                                React.createElement("div", {className: "col-lg-12 text-center"}, 
                                    React.createElement("h2", {className: "section-heading"}, "Services"), 
                                    React.createElement("h3", {className: "section-subheading text-muted"}, "SamchonFramework Services"))
                            ), 
                            React.createElement("br", null), 
                            React.createElement("br", null), 
                            React.createElement("div", {className: "row"}, 
                                React.createElement("div", {className: "col-md-4 col-sm-6 portfolio-item"}, 
                                    React.createElement("a", {href: "#portfolioModal1", className: "portfolio-link", "data-toggle": "modal"}, 
                                        React.createElement("img", {src: "img/img.png", className: "img-responsive"})
                                    ), 
                                    React.createElement("div", {className: "portfolio-caption text-center"}, 
                                        React.createElement("h4", null, "Round Icons"), 
                                        React.createElement("p", {className: "text-muted"}, "Graphic Design"))), 
                                React.createElement("div", {className: "col-md-4 col-sm-6 portfolio-item"}, 
                                    React.createElement("a", {href: "#portfolioModal1", className: "portfolio-link", "data-toggle": "modal"}, 
                                        React.createElement("img", {src: "img/img.png", className: "img-responsive"})
                                    ), 
                                    React.createElement("div", {className: "portfolio-caption text-center"}, 
                                        React.createElement("h4", null, "Round Icons"), 
                                        React.createElement("p", {className: "text-muted"}, "Graphic Design"))), 
                                React.createElement("div", {className: "col-md-4 col-sm-6 portfolio-item"}, 
                                    React.createElement("a", {href: "#portfolioModal1", className: "portfolio-link", "data-toggle": "modal"}, 
                                        React.createElement("img", {src: "img/img.png", className: "img-responsive"})
                                    ), 
                                    React.createElement("div", {className: "portfolio-caption text-center"}, 
                                        React.createElement("h4", null, "Round Icons"), 
                                        React.createElement("p", {className: "text-muted"}, "Graphic Design"))), 
                                React.createElement("div", {className: "col-md-4 col-sm-6 portfolio-item"}, 
                                    React.createElement("a", {href: "#portfolioModal1", className: "portfolio-link", "data-toggle": "modal"}, 
                                        React.createElement("img", {src: "img/img.png", className: "img-responsive"})
                                    ), 
                                    React.createElement("div", {className: "portfolio-caption text-center"}, 
                                        React.createElement("h4", null, "Round Icons"), 
                                        React.createElement("p", {className: "text-muted"}, "Graphic Design"))), 
                                React.createElement("div", {className: "col-md-4 col-sm-6 portfolio-item"}, 
                                    React.createElement("a", {href: "#portfolioModal1", className: "portfolio-link", "data-toggle": "modal"}, 
                                        React.createElement("img", {src: "img/img.png", className: "img-responsive"})
                                    ), 
                                    React.createElement("div", {className: "portfolio-caption text-center"}, 
                                        React.createElement("h4", null, "Round Icons"), 
                                        React.createElement("p", {className: "text-muted"}, "Graphic Design"))), 
                                React.createElement("div", {className: "col-md-4 col-sm-6 portfolio-item"}, 
                                    React.createElement("a", {href: "#portfolioModal1", className: "portfolio-link", "data-toggle": "modal"}, 
                                        React.createElement("img", {src: "img/img.png", className: "img-responsive"})
                                    ), 
                                    React.createElement("div", {className: "portfolio-caption text-center"}, 
                                        React.createElement("h4", null, "Round Icons"), 
                                        React.createElement("p", {className: "text-muted"}, "Graphic Design"))))))
                );
            };
            ServicesApplication.main = function () {
                ReactDOM.render(React.createElement(ServicesApplication, null), document.body);
            };
            return ServicesApplication;
        }(chat.Application));
        chat.ServicesApplication = ServicesApplication;
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
        var VideoApplication = (function (_super) {
            __extends(VideoApplication, _super);
            function VideoApplication() {
                _super.apply(this, arguments);
            }
            // try ContactApplication 
            /* ---------------------------------------------------------
                VISUALIZER
            --------------------------------------------------------- */
            VideoApplication.prototype.render = function () {
                return React.createElement("div", null, 
                    React.createElement("div", {id: "wrapper"}, 
                        React.createElement("div", {id: "sidebar-wrapper"}, 
                            React.createElement("ul", {className: "sidebar-nav"}, 
                                React.createElement("li", {className: "sidebar-brand"}, 
                                    React.createElement("div", {className: "talk-title"}, 
                                        React.createElement("h2", null, " SamchonTalk ")
                                    )
                                ), 
                                React.createElement("br", null), 
                                React.createElement("br", null), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "list.html"}, "Dashboard")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "video.html"}, "Video")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "overview.html"}, "Overview")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "aboutus.html"}, "About")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "services.html"}, "Services")
                                ), 
                                React.createElement("li", null, 
                                    React.createElement("a", {href: "contact.html"}, "Contact")
                                )), 
                            React.createElement("div", {className: "user-info"}, 
                                React.createElement("h3", null, " INFORMATION "), 
                                React.createElement("h5", null, 
                                    "Account ID: ", 
                                    this.id), 
                                React.createElement("h5", null, 
                                    "Name: ", 
                                    this.name))), 
                        React.createElement("div", {id: "page-content-wrapper"}, 
                            React.createElement("div", {className: "container-fluid"}, 
                                React.createElement("div", {className: "row"}, 
                                    React.createElement("div", {className: "feature-content"}, 
                                        React.createElement("div", {className: "col-sm-12"}, 
                                            React.createElement("iframe", {width: "100%", height: "315px", src: "https://www.youtube.com/embed/kanO9K8IbI0", frameBorder: 0, allowFullScreen: true})
                                        )
                                    )
                                ), 
                                React.createElement("div", {className: "row"}, 
                                    React.createElement("div", {className: "col-sm-11"}, 
                                        React.createElement("p", null, 
                                            React.createElement("h2", null, "Samchon Framework is"), 
                                            "Samchon framework is an ", 
                                            React.createElement("strong", null, "OON1"), 
                                            " framework; who can build network system within framework of ", 
                                            React.createElement("strong", null, "OOD2"), 
                                            ", like cloud system and distributed & parallel processing systems, even how the system is enormously complicate." + ' ' + "Samchon Framework supports two languages; C++and TypeScript/NodeJs.Not only connecting to an external server, but also opening a server is also possible both in ", 
                                            React.createElement("strong", null, "C++"), 
                                            "and ", 
                                            React.createElement("strong", null, "TypeScript/NodeJS."), 
                                            "In my case, I prefer to build a cloud server with TypeScript & NodeJS quickly.When the cloud server grows up and lots of traffic occurs, I let the cloud server to deliver heavy processes to Distributed systems built via C++.")
                                    )
                                ))
                        ))
                );
            };
            VideoApplication.main = function () {
                ReactDOM.render(React.createElement(VideoApplication, null), document.body);
            };
            return VideoApplication;
        }(chat.Application));
        chat.VideoApplication = VideoApplication;
    })(chat = example.chat || (example.chat = {}));
})(example || (example = {}));
//# sourceMappingURL=chat-application.js.map