/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />
/// <reference path="../typings/scanf/scanf.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var samchon = require("samchon-framework");
var scanf = require("scanf");
var slave = require("./base/slave");
var pack = require("./base/packer");
var tsp_slave;
(function (tsp_slave) {
    tsp_slave.library = samchon.library;
    tsp_slave.protocol = samchon.protocol;
    var PackerSlave = (function (_super) {
        __extends(PackerSlave, _super);
        function PackerSlave() {
            _super.apply(this, arguments);
        }
        PackerSlave.prototype.optimize = function (xml, index, size) {
            console.log("A packing optimization command has received");
            // CONSTRUCT TRAVEL
            var packer = new pack.Packer();
            packer.construct(xml);
            // OPTIMIZE
            packer.optimize();
            // REPORT TO ITS MASTER
            console.log("Report Packing optimization result: $" + packer.calcPrice());
            this.sendData(new tsp_slave.protocol.Invoke("replyOptimization", packer.toXML()));
        };
        PackerSlave.main = function () {
            console.log("Master's IP address: ");
            var ip = scanf("%s");
            console.log("Master's Port number (master: #37300, mediator: #37350): ");
            var port = scanf("%d");
            var slave = new PackerSlave();
            slave.connect(ip, port);
        };
        return PackerSlave;
    }(slave.Slave));
    tsp_slave.PackerSlave = PackerSlave;
})(tsp_slave || (tsp_slave = {}));
tsp_slave.PackerSlave.main();
//# sourceMappingURL=packer-slave.js.map