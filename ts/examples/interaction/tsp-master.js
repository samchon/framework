/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var samchon = require("samchon-framework");
var master = require("./base/master");
var tsp = require("./base/tsp");
var tsp_master;
(function (tsp_master) {
    tsp_master.library = samchon.library;
    tsp_master.protocol = samchon.protocol;
    var TSPMaster = (function (_super) {
        __extends(TSPMaster, _super);
        function TSPMaster() {
            _super.call(this, 37110);
        }
        TSPMaster.prototype.optimize = function (xml) {
            console.log("Start TSP optimization");
            var travel = new tsp.Travel();
            {
                travel.construct(xml);
                this.best_travel = travel;
                this.completed_count = 0;
                this.requested_size = this.size();
            }
            var invoke = new tsp_master.protocol.Invoke("optimize", travel.toXML());
            var case_size = new tsp_master.library.FactorialGenerator(travel.size()).size();
            this.sendSegmentData(invoke, case_size);
        };
        TSPMaster.prototype.replyOptimization = function (xml) {
            console.log("A slave has finished his optimization");
            var my_travel = new tsp.Travel();
            my_travel.construct(xml);
            // IF CURRENT TRAVEL IS SHORTER, MAKE IT THE BEST
            if (my_travel.computeDistance() < this.best_travel.computeDistance()) {
                console.log("The slave renewed the best solution");
                this.best_travel = my_travel;
            }
            // IF ALL TASKS ARE DONE, REPORT TO THE CHIEF
            if (++this.completed_count == this.requested_size) {
                console.log("An optimization has fully finished");
                this.chiefDriver.sendData(new tsp_master.protocol.Invoke("reportTSP", this.best_travel.toXML()));
            }
        };
        TSPMaster.main = function () {
            var master = new TSPMaster();
            master.open(37100);
        };
        return TSPMaster;
    }(master.Master));
    tsp_master.TSPMaster = TSPMaster;
})(tsp_master || (tsp_master = {}));
tsp_master.TSPMaster.main();
//# sourceMappingURL=tsp-master.js.map