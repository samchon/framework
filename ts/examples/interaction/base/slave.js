/// <reference path="../../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../../typings/samchon-framework/samchon-framework.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var samchon = require("samchon-framework");
var slave;
(function (slave) {
    slave.library = samchon.library;
    slave.protocol = samchon.protocol;
    var Slave = (function (_super) {
        __extends(Slave, _super);
        function Slave() {
            _super.apply(this, arguments);
        }
        Slave.prototype.createServerConnector = function () {
            return new slave.protocol.WebServerConnector(this);
        };
        Slave.prototype.createChild = function (xml) {
            return null;
        };
        return Slave;
    }(slave.protocol.slave.SlaveClient));
    slave.Slave = Slave;
})(slave || (slave = {}));
module.exports = slave;
//# sourceMappingURL=slave.js.map