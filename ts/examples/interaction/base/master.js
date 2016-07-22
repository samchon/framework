/// <reference path="../../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../../typings/samchon-framework/samchon-framework.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var samchon = require("samchon-framework");
var master;
(function (master_1) {
    master_1.library = samchon.library;
    master_1.protocol = samchon.protocol;
    var Master = (function (_super) {
        __extends(Master, _super);
        function Master(chief_port) {
            _super.call(this);
            this.chiefDriver = new ChiefDriver(this);
            this.chiefDriver.open(chief_port);
        }
        Master.prototype.createServerBase = function () {
            return new master_1.protocol.WebServerBase(this);
        };
        Master.prototype.createExternalClient = function (driver) {
            console.log("A new slave has connected.");
            return new SlaveDriver(this);
        };
        return Master;
    }(master_1.protocol.master.ParallelClientArray));
    master_1.Master = Master;
    var ChiefDriver = (function (_super) {
        __extends(ChiefDriver, _super);
        function ChiefDriver(master) {
            _super.call(this);
            this.master = master;
        }
        ChiefDriver.prototype.open = function (port) {
            _super.prototype.open.call(this, port);
        };
        ChiefDriver.prototype.addClient = function (communicator) {
            console.log("Chief has connected.");
            this.communicator = communicator;
            communicator.listen(this); // LISTENS ITSELF
        };
        ChiefDriver.prototype.sendData = function (invoke) {
            this.communicator.sendData(invoke);
        };
        ChiefDriver.prototype.replyData = function (invoke) {
            this.master.replyData(invoke);
        };
        return ChiefDriver;
    }(master_1.protocol.WebServer));
    master_1.ChiefDriver = ChiefDriver;
    var SlaveDriver = (function (_super) {
        __extends(SlaveDriver, _super);
        function SlaveDriver() {
            _super.apply(this, arguments);
        }
        SlaveDriver.prototype.createChild = function (xml) {
            // DO NOT CREATE CHILDREN, EXTERNAL_SYSTEM_ROLE
            return null;
        };
        SlaveDriver.prototype.replyOptimization = function (xml) {
            this.getSystemArray()["replyOptimization"](xml);
        };
        return SlaveDriver;
    }(master_1.protocol.master.ParallelSystem));
    master_1.SlaveDriver = SlaveDriver;
})(master || (master = {}));
module.exports = master;
//# sourceMappingURL=master.js.map