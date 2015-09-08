/* =================================================================================
    LIBRARIES
====================================================================================
    * CONTAINERS
        - VECTOR
        - DICTIONARY
        - PAIR
    
    * UTILITIES
        - STRING_UTIL
        - XML
================================================================================= */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Vector = (function () {
    function Vector() {
        Array.apply(this, arguments);
    }
    Vector.prototype.concat = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i - 0] = arguments[_i];
        }
        return null;
    };
    Vector.prototype.every = function (callbackfn, thisArg) {
        return false;
    };
    Vector.prototype.pop = function () {
        return null;
    };
    Vector.prototype.push = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i - 0] = arguments[_i];
        }
        return 0;
    };
    Vector.prototype.splice = function (start, size) {
        return [];
    };
    ;
    Vector.prototype.unshift = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i - 0] = arguments[_i];
        }
        return 0;
    };
    Vector.prototype.toLocaleString = function () {
        return null;
    };
    Vector.prototype.toString = function () {
        return null;
    };
    return Vector;
})();
Vector.prototype = new Array();
var arr = new Array();
arr.
;
var Dictionary = (function () {
    function Dictionary() {
    }
    Dictionary.prototype.get = function (key) {
        return this[key];
    };
    ;
    Dictionary.prototype.set = function (key, value) {
        this[key] = value;
    };
    ;
    return Dictionary;
})();
var Pair = (function () {
    function Pair(first, second) {
        this.first = first;
        this.second = second;
    }
    return Pair;
})();
var StringUtil = (function () {
    function StringUtil() {
    }
    StringUtil.tab = function (size) {
        var str = "";
        for (var i = 0; i < size; i++)
            str += "\t";
        return str;
    };
    StringUtil.replaceAll = function (str, pairs) {
        if (pairs.length == 0)
            return str;
        var foundPairList = new Array();
        for (var i = 0; i < pairs.length; i++) {
            var index = 0;
            while (true) {
                index = str.indexOf(pairs[i].first, index);
                if (index == -1)
                    break;
                foundPairList.push(new Pair(index++, i));
            }
        }
        if (foundPairList.length == 0)
            return str;
        foundPairList.sort();
        var res = "";
        var index = 0;
        while (foundPairList.length > 0) {
            var foundPair = foundPairList[0];
            var before = pairs[foundPair.first].first;
            var after = pairs[foundPair.second].second;
            res += str.substring(index, foundPair.first);
            res += after;
            index = foundPair.first + before.length;
            foundPairList.splice(0, 1);
        }
        if (index <= str.length - 1)
            res += str.substr(index);
        return res;
    };
    return StringUtil;
})();
var XML = (function () {
    function XML(str) {
        if (str === void 0) { str = ""; }
        if (str.indexOf("<") == -1)
            return;
        var start;
        var end;
        if ((start = str.indexOf("<?xml")) == -1) {
            end = str.indexOf("?>", start);
            if (end == -1)
                return;
            str = str.substr(end + 2);
        }
        while ((start = str.indexOf("<!--")) != -1) {
            end = str.indexOf("-->", start);
            if (end == -1)
                return;
            str = str.substr(0, start) + str.substr(end + 3);
        }
        this.construct(str);
    }
    XML.prototype.construct = function (str) {
        this.constructKey(str);
    };
    XML.prototype.constructKey = function (str) {
        var start = str.indexOf("<") + 1;
        var end = this.calcMinIndex([
            str.indexOf(" "),
            str.indexOf("\r\n"),
            str.indexOf("\n"),
            str.indexOf("\t"),
            str.indexOf(">"),
            str.indexOf("/")
        ]);
        if (start == 0 || end == -1)
            return;
        this.tag = str.substring(start, end);
        this.constructProperty(str);
    };
    XML.prototype.constructProperty = function (str) {
        var start = str.indexOf("<" + this.tag) + this.tag.length + 1;
        var end = this.calcMinIndex([str.lastIndexOf("/"), str.indexOf(">", start)]);
        if (start == -1 || end == -1 || start >= end)
            return;
        var line = str.substring(start, end);
        if (line.indexOf("=") == -1)
            return;
        var label;
        var value;
        var helpers = new Array();
        var inQuote = false;
        var quoteType;
        var equal;
        for (var i = 0; i < line.length; i++) {
            if (inQuote == false && (line.charAt(i) == "\t" || line.charAt(i) == "\"")) {
                inQuote = true;
                start = i;
                if (line.charAt(i) == "'")
                    quoteType = 1;
                else if (line.charAt(i) == "\"")
                    quoteType = 2;
            }
            else if (inQuote == true &&
                ((quoteType == 1 && line.charAt(i) == "'") ||
                    (quoteType == 2 && line.charAt(i) == "\""))) {
                helpers.push({ "type": quoteType, "start": start, "end": i });
                inQuote = false;
            }
        }
        for (var i = 0; i < helpers.length; i++) {
            var quote = helpers[i];
            if (i == 0) {
                equal = line.indexOf("=");
                label = line.substring(0, equal).trim();
            }
            else {
                equal = line.indexOf("=", helpers[i - 1]["end"] + 1);
                label = line.substring(helpers[i - 1]["end"] + 1, equal).trim();
            }
            value = line.substring(helpers[i]["start"] + 1, helpers[i]["end"]);
            this["@" + label] = this.decodeProperty(value);
        }
        this.constructValue(str);
    };
    XML.prototype.constructValue = function (str) {
        var end_slash = str.lastIndexOf("/");
        var end_block = str.indexOf(">");
        if (end_slash < end_block || end_slash + 1 == str.lastIndexOf("<")) {
            this.value = "";
            this.constructChildren(str);
            return;
        }
        var start = end_block + 1;
        var end = str.lastIndexOf("<");
        str = str.substring(start, end);
        if (str.indexOf("<") == -1)
            this.value = this.decodeValue(str.trim());
        else
            this.value = "";
    };
    XML.prototype.constructChildren = function (str) {
        if (str.indexOf("<") == -1)
            return;
        var start = str.indexOf("<");
        var end = str.lastIndexOf(">") + 1;
        str = str.substring(start, end);
        var blockStart = 0;
        var blockEnd = 0;
        start = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charAt(i) == "<" && str.substr(i, 2) != "</")
                blockStart++;
            else if (str.substr(i, 2) == "/>" || str.substr(i, 2) == "</")
                blockEnd++;
            if (blockStart >= 1 && blockStart == blockEnd) {
                end = str.indexOf(">", 1);
                var xml = new XML();
                var xmlList;
                xml.construct(str.substring(start, end + 1));
                if (this.hasOwnProperty(xml.tag) == true)
                    xmlList = this[xml.tag];
                else {
                    xmlList = new XMLList();
                    this[xml.tag] = xmlList;
                }
                xmlList.push(xml);
                if (this.value.length > 0)
                    this.value = "";
            }
        }
    };
    XML.prototype.getTag = function () {
        return this.tag;
    };
    XML.prototype.getValue = function () {
        return this.value;
    };
    XML.prototype.setTag = function (str) {
        this.tag = str;
    };
    XML.prototype.setValue = function (str) {
        this.value = str;
    };
    XML.prototype.calcMinIndex = function (args) {
        return 0;
    };
    XML.prototype.decodeValue = function (str) {
        var pairs = [
            new Pair("&amp;", "&"),
            new Pair("&lt;", "<"),
            new Pair("&gt;", ">")
        ];
        return StringUtil.replaceAll(str, pairs);
    };
    XML.prototype.encodeValue = function (str) {
        var pairs = [
            new Pair("&", "&amp;"),
            new Pair("<", "&lt;"),
            new Pair(">", "&gt;")
        ];
        return StringUtil.replaceAll(str, pairs);
    };
    XML.prototype.decodeProperty = function (str) {
        var pairs = [
            new Pair("&amp;", "&"),
            new Pair("&lt;", "<"),
            new Pair("&gt;", ">"),
            new Pair("&quot;", "\""),
            new Pair("&apos;", "'"),
            new Pair("&#x9;", "\t"),
            new Pair("&#xA;", "\n"),
            new Pair("&#xD;", "\r"),
        ];
        return StringUtil.replaceAll(str, pairs);
    };
    XML.prototype.encodeProperty = function (str) {
        var pairs = [
            new Pair("&", "&amp;"),
            new Pair("<", "&lt;"),
            new Pair(">", "&gt;"),
            new Pair("\"", "&quot;"),
            new Pair("'", "&apos;"),
            new Pair("\t", "&#x9;"),
            new Pair("\n", "&#xA;"),
            new Pair("\r", "&#xD;"),
        ];
        return StringUtil.replaceAll(str, pairs);
    };
    XML.prototype.toString = function (level) {
        if (level === void 0) { level = 0; }
        var str = StringUtil.tab(level) + "<" + this.tag;
        var childrenString = "";
        for (var key in this) {
            if (key.charAt(0) == "@") {
                var propertyKey = key.substr(1);
                var propertyValue = this[key];
                str += " " + propertyKey + "=\"" + this.encodeProperty(propertyValue) + "\"";
            }
            else if (this[key] instanceof XMLList) {
                var xmlList = this[key];
                childrenString += xmlList.toString(level + 1);
            }
        }
        if (childrenString == "" && this.value == "")
            str += " />";
        else if (this.value != "")
            str += ">" + this.encodeValue(this.value) + "</" + this.tag + ">";
        else {
            str += "\n" + childrenString;
            str += "</" + this.tag + ">";
        }
        return str;
    };
    return XML;
})();
var XMLList = (function (_super) {
    __extends(XMLList, _super);
    function XMLList() {
        _super.call(this);
    }
    XMLList.prototype.toString = function (level) {
        if (level === void 0) { level = 0; }
        var str = StringUtil.tab(level);
        for (var i = 0; i < length; i++)
            str += this[i].toString(level);
        return str;
    };
    return XMLList;
})(Vector);
var ServerConnector = (function () {
    function ServerConnector(parent) {
        this.parent = parent;
        this.str = "";
    }
    ServerConnector.prototype.connect = function (ip, port) {
        this.socket = new WebSocket(ip + ":" + port);
        this.socket.onopen = this.handleConnect;
        this.socket.onmessage = this.handleReply;
    };
    ServerConnector.prototype.sendData = function (invoke) {
        var xml = invoke.toXML();
        var str = xml.toString();
        this.socket.send(str);
    };
    ServerConnector.prototype.replyData = function (invoke) {
        this.parent.replyData(invoke);
    };
    ServerConnector.prototype.handleConnect = function (event) {
        this.onopen.apply([event]);
    };
    ServerConnector.prototype.handleReply = function (event) {
        this.str += event.data;
        var invokeArray;
        var indexPair = null;
        var sizePair = new Pair(0, 0);
        var startIndex = 0;
        var endIndex = 0;
        while (true) {
            var iPair = new Pair(this.str.indexOf("<invoke", startIndex), this.str.indexOf("</invoke>", startIndex));
            if (iPair.first != -1)
                sizePair.first++;
            if (iPair.second != -1)
                sizePair.second++;
            if (indexPair == null && sizePair.first == 1)
                indexPair = new Pair(iPair.first, -1);
            if (iPair.first == -1 || iPair.second == -1)
                break;
            if (indexPair != null && sizePair.first == sizePair.second) {
                var start = indexPair.first;
                var end = indexPair.second + ("</invoke>").length;
                var xml = new XML(this.str.substring(start, end));
                var invoke = new Invoke(xml);
                invokeArray.push(invoke);
                endIndex = end;
                indexPair = null;
            }
            startIndex = Math.max(Math.max(iPair.first, iPair.second), 1);
        }
        if (endIndex != 0)
            this.str = this.str.substr(endIndex);
        for (var i = 0; i < invokeArray.length; i++)
            this.replyData(invokeArray[i]);
    };
    return ServerConnector;
})();
var Invoke = (function (_super) {
    __extends(Invoke, _super);
    function Invoke() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        _super.call(this);
        if (args.length == 1) {
            var val = args[0];
            if (val instanceof String)
                this.listener = val;
            else if (val instanceof XML) {
                var xml = val;
                this.listener = xml["@listener"];
                if (xml.hasOwnProperty("parameter") == false)
                    return;
                var xmlList = xml["parameter"];
                for (var i = 0; i < xmlList.length; i++)
                    this.push(new InvokeParameter(xmlList[i]));
            }
        }
        else {
            this.listener = args[0];
            for (var i = 1; i < args.length; i++) {
                var name = "par" + i;
                var value = args[i];
                var parameter = new InvokeParameter(name, value);
                this.push(parameter);
            }
        }
    }
    Invoke.prototype.getListener = function () {
        return this.listener;
    };
    Invoke.prototype.getArguments = function () {
        var args = new Array();
        for (var i = 0; i < this.length; i++)
            args[i] = this[i].getValue();
        return args;
    };
    Invoke.prototype.apply = function (obj) {
        if (!(obj.hasOwnProperty(this.listener) == true &&
            obj[this.listener] instanceof Function))
            return false;
        var func = obj[this.listener];
        func.apply(this.getArguments());
        return true;
    };
    Invoke.prototype.toXML = function () {
        var xml = new XML();
        xml.setTag("invoke");
        xml["@listener"] = this.listener;
        var xmlList = new XMLList();
        for (var i = 0; i < this.length; i++)
            xmlList.push(this[i].toXML());
        xml["parameter"] = xmlList;
        return xml;
    };
    return Invoke;
})(Vector);
var InvokeParameter = (function () {
    function InvokeParameter() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        if (args.length == 1 && args[0] instanceof XML) {
            var xml = args[0];
            this.name = xml["@name"];
            this.type = xml["@type"];
            this.value = xml["@value"];
        }
        else if (args.length == 3) {
            this.name = args[0];
            this.type = args[1];
            this.value = args[2];
        }
        else if (args.length == 2) {
            this.name = args[0];
            this.value = args[1];
            if (args[1] instanceof Number)
                this.type = "number";
            else if (args[1] instanceof String)
                this.type = "string";
            else
                this.type = "unknown";
        }
    }
    InvokeParameter.prototype.getName = function () {
        return this.name;
    };
    InvokeParameter.prototype.getType = function () {
        return this.type;
    };
    InvokeParameter.prototype.getValue = function () {
        return this.value;
    };
    InvokeParameter.prototype.toXML = function () {
        var xml = new XML();
        xml.setTag("parameter");
        xml["@name"] = this.name;
        xml["@type"] = this.type;
        xml["@value"] = this.value;
        return xml;
    };
    return InvokeParameter;
})();
var Application = (function () {
    function Application(ip, port) {
        this.socket = new ServerConnector(this);
        this.socket.onopen = this.handleConnect;
        this.socket.connect(ip, port);
    }
    Application.prototype.handleConnect = function (event) {
    };
    Application.prototype.replyData = function (invoke) {
        if (invoke.apply(this) == false)
            this.movie.sendData(invoke);
    };
    Application.prototype.sendData = function (invoke) {
        this.socket.sendData(invoke);
    };
    return Application;
})();
var Movie = (function () {
    function Movie() {
    }
    Movie.prototype.replyData = function (invoke) {
        invoke.apply(this) == false;
    };
    Movie.prototype.sendData = function (invoke) {
        this.application.sendData(invoke);
    };
    return Movie;
})();
var SubMovie = (function () {
    function SubMovie() {
    }
    SubMovie.prototype.replyData = function (invoke) {
        invoke.apply(this);
    };
    SubMovie.prototype.sendData = function (invoke) {
        this.parent.sendData(invoke);
    };
    return SubMovie;
})();
var Entity = (function () {
    function Entity() {
    }
    Entity.prototype.construct = function (xml) { };
    Entity.prototype.TAG = function () { return ""; };
    Entity.prototype.key = function () { return ""; };
    Entity.prototype.toXML = function () {
        var xml = new XML();
        xml.setTag(this.TAG());
        return xml;
    };
    return Entity;
})();
var EntityArray = (function (_super) {
    __extends(EntityArray, _super);
    function EntityArray() {
        _super.call(this);
    }
    EntityArray.prototype.construct = function (xml) {
        this.splice(0, this.length);
        if (xml.hasOwnProperty(this.CHILD_TAG()) == false)
            return;
        var xmlList = xml[this.CHILD_TAG()];
        for (var i = 0; i < xmlList.length; i++) {
            var child = this.createChild(xmlList[i]);
            if (child != null)
                this.push(child);
        }
    };
    EntityArray.prototype.createChild = function (xml) {
        return null;
    };
    EntityArray.prototype.TAG = function () { return ""; };
    EntityArray.prototype.CHILD_TAG = function () { return ""; };
    EntityArray.prototype.key = function () { return ""; };
    EntityArray.prototype.toXML = function () {
        var xml = new XML();
        xml.setTag(this.TAG());
        if (this.length == 0)
            return xml;
        var xmlList = new XMLList();
        for (var i = 0; i < this.length; i++)
            xmlList.push(this[i].toXML());
        return xml;
    };
    return EntityArray;
})(Vector);
