/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />
/// <reference path="../typings/scanf/scanf.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var samchon = require("samchon-framework");
var master = require("./base/master");
var tsp = require("./base/tsp");
var pack = require("./base/packer");
var reporter;
(function (reporter_1) {
    reporter_1.library = samchon.library;
    reporter_1.protocol = samchon.protocol;
    var Reporter = (function (_super) {
        __extends(Reporter, _super);
        function Reporter() {
            _super.call(this, null);
        }
        Reporter.prototype.replyData = function (invoke) {
            invoke.apply(this);
        };
        Reporter.prototype.reportTSP = function (xml) {
            var travel = new tsp.Travel();
            travel.construct(xml);
            console.log("The best travel: " + travel.computeDistance() + " km");
        };
        Reporter.prototype.reportPacker = function (xml) {
            var packer = new pack.Packer();
            packer.construct(xml);
            console.log(packer.toXML().toString());
            console.log("The best packing solution: $" + packer.calcPrice());
        };
        Reporter.main = function () {
            var reporter = new Reporter();
            reporter.open(37200);
        };
        return Reporter;
    }(master.ChiefDriver));
    reporter_1.Reporter = Reporter;
})(reporter || (reporter = {}));
reporter.Reporter.main();
//# sourceMappingURL=reporter.js.map