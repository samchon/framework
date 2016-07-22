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
var pack = require("./base/packer");
var tsp_master;
(function (tsp_master) {
    tsp_master.library = samchon.library;
    tsp_master.protocol = samchon.protocol;
    var PackerMaster = (function (_super) {
        __extends(PackerMaster, _super);
        function PackerMaster() {
            _super.call(this, 37310);
        }
        PackerMaster.prototype.optimize = function (xml) {
            console.log("Start Packer optimization");
            var packer = new pack.Packer();
            {
                packer.construct(xml);
                this.best_packer = packer;
                this.completed_count = 0;
                this.requested_size = this.size();
            }
            var invoke = new tsp_master.protocol.Invoke("optimize", packer.toXML());
            var case_size = new tsp_master.library.FactorialGenerator(packer.size()).size();
            this.sendSegmentData(invoke, case_size);
        };
        PackerMaster.prototype.replyOptimization = function (xml) {
            var my_travel = new pack.Packer();
            my_travel.construct(xml);
            console.log("A slave has finished his optimization: $" + my_travel.calcPrice());
            // IF CURRENT TRAVEL IS SHORTER, MAKE IT THE BEST
            if (this.best_packer.calcPrice() == 0 || my_travel.calcPrice() < this.best_packer.calcPrice()) {
                console.log("The slave renewed the best solution");
                this.best_packer = my_travel;
            }
            // IF ALL TASKS ARE DONE, REPORT TO THE CHIEF
            if (++this.completed_count == this.requested_size) {
                console.log("An optimization has fully finished");
                this.chiefDriver.sendData(new tsp_master.protocol.Invoke("reportPacker", this.best_packer.toXML()));
            }
        };
        PackerMaster.main = function () {
            var master = new PackerMaster();
            master.open(37300);
        };
        return PackerMaster;
    }(master.Master));
    tsp_master.PackerMaster = PackerMaster;
})(tsp_master || (tsp_master = {}));
tsp_master.PackerMaster.main();
//# sourceMappingURL=packer-master.js.map