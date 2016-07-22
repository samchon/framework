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
var tsp = require("./base/tsp");
var tsp_slave;
(function (tsp_slave) {
    tsp_slave.library = samchon.library;
    tsp_slave.protocol = samchon.protocol;
    var TSPSlave = (function (_super) {
        __extends(TSPSlave, _super);
        function TSPSlave() {
            _super.apply(this, arguments);
        }
        TSPSlave.prototype.optimize = function (xml, index, size) {
            console.log("A TSP optimization command has received");
            // CONSTRUCT TRAVEL
            var travel = new tsp.Travel();
            travel.construct(xml);
            // OPTIMIZE
            var scheduler = new tsp.Scheduler(travel);
            travel = scheduler.optimize(index, size);
            // REPORT TO ITS MASTER
            console.log("Report TSP optimization result: " + travel.computeDistance() + " km");
            this.sendData(new tsp_slave.protocol.Invoke("replyOptimization", travel.toXML()));
        };
        TSPSlave.main = function () {
            console.log("Master's IP address: ");
            var ip = scanf("%s");
            var slave = new TSPSlave();
            slave.connect(ip, 37100);
        };
        return TSPSlave;
    }(slave.Slave));
    tsp_slave.TSPSlave = TSPSlave;
})(tsp_slave || (tsp_slave = {}));
tsp_slave.TSPSlave.main();
//# sourceMappingURL=tsp-slave.js.map