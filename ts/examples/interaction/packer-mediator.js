/// <reference path="../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var samchon = require("samchon-framework");
var scanf = require("scanf");
var master = require("./base/master");
var pack = require("./base/packer");
var packer_mediator;
(function (packer_mediator) {
    packer_mediator.library = samchon.library;
    packer_mediator.protocol = samchon.protocol;
    var PackerMediator = (function (_super) {
        __extends(PackerMediator, _super);
        function PackerMediator(masterIP) {
            _super.call(this);
            this.master_ip = masterIP;
        }
        PackerMediator.prototype.createServerBase = function () {
            return new packer_mediator.protocol.WebServerBase(this);
        };
        PackerMediator.prototype.createMediator = function () {
            return new packer_mediator.protocol.master.MediatorWebClient(this, this.master_ip, 37300);
        };
        PackerMediator.prototype.createExternalClient = function (driver) {
            console.log("A new slave has connected.");
            return new master.SlaveDriver(this);
        };
        PackerMediator.prototype.sendData = function (invoke) {
            if (invoke.getListener() == "optimize") {
                this.best_packer = null;
                this.requested_size = this.size();
                this.completed_count = 0;
            }
            _super.prototype.sendData.call(this, invoke);
        };
        PackerMediator.prototype.replyOptimization = function (xml) {
            var my_travel = new pack.Packer();
            my_travel.construct(xml);
            console.log("A slave has finished his optimization: $" + my_travel.calcPrice());
            // IF CURRENT TRAVEL IS SHORTER, MAKE IT THE BEST
            if (this.best_packer == null || my_travel.calcPrice() < this.best_packer.calcPrice()) {
                console.log("The slave renewed the best solution");
                this.best_packer = my_travel;
            }
            // IF ALL TASKS ARE DONE, REPLY (REPORT) TO ITS MASTER
            if (++this.completed_count == this.requested_size) {
                console.log("An optimization has fully finished");
                this.mediator.sendData(new packer_mediator.protocol.Invoke("replyOptimization", this.best_packer.toXML()));
            }
        };
        PackerMediator.main = function () {
            console.log("Master's IP address: ");
            var ip = scanf("%s");
            var mediator = new PackerMediator(ip);
            mediator.open(37350);
        };
        return PackerMediator;
    }(packer_mediator.protocol.master.ParallelClientArrayMediator));
    packer_mediator.PackerMediator = PackerMediator;
})(packer_mediator || (packer_mediator = {}));
packer_mediator.PackerMediator.main();
//# sourceMappingURL=packer-mediator.js.map