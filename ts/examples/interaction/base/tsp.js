/// <reference path="../../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../../typings/samchon-framework/samchon-framework.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var samchon = require("samchon-framework");
var tsp;
(function (tsp) {
    tsp.library = samchon.library;
    tsp.protocol = samchon.protocol;
    var Scheduler = (function () {
        function Scheduler(travel) {
            this.travel = travel;
        }
        Scheduler.prototype.optimize = function (index, size) {
            if (index === void 0) { index = -1; }
            if (size === void 0) { size = -1; }
            var factorial = new tsp.library.FactorialGenerator(this.travel.size());
            if (index == -1) {
                index = 0;
                size = factorial.size();
            }
            var best_travel = this.travel;
            for (var i = index; i < index + size; i++) {
                var my_travel = new Travel(this.travel.size(), null);
                var row = factorial.at(i);
                for (var j = 0; j < this.travel.size(); j++)
                    my_travel.set(j, this.travel.at(row[j]));
                if (my_travel.computeDistance() < best_travel.computeDistance())
                    best_travel = my_travel;
            }
            return best_travel;
        };
        Scheduler.main = function () {
            var travel = new Travel();
            for (var i = 0; i < 6; i++)
                travel.push(new Branch((i + 1) + " th branch", Math.random() * 90, Math.random() * 90));
            var scheduler = new Scheduler(travel);
            travel = scheduler.optimize();
            for (var i = 0; i < 6; i++)
                console.log(travel.at(i));
            console.log(travel.computeDistance());
        };
        return Scheduler;
    }());
    tsp.Scheduler = Scheduler;
    var Travel = (function (_super) {
        __extends(Travel, _super);
        function Travel() {
            _super.apply(this, arguments);
        }
        Travel.prototype.createChild = function (xml) {
            return new Branch();
        };
        Travel.prototype.computeDistance = function () {
            var distance = 0;
            for (var i = 1; i < this.size(); i++)
                distance += this.at(i).computeDistance(this.at(i - 1));
            return distance;
        };
        Travel.prototype.TAG = function () {
            return "travel";
        };
        Travel.prototype.CHILD_TAG = function () {
            return "branch";
        };
        return Travel;
    }(tsp.protocol.EntityArray));
    tsp.Travel = Travel;
    var Branch = (function (_super) {
        __extends(Branch, _super);
        function Branch(name, longitude, latitude) {
            if (name === void 0) { name = ""; }
            if (longitude === void 0) { longitude = 0; }
            if (latitude === void 0) { latitude = 0; }
            _super.call(this);
            this.name = name;
            this.longitude = longitude;
            this.latitude = latitude;
        }
        Branch.prototype.computeDistance = function (obj) {
            if (this.longitude == obj.longitude && this.latitude == obj.latitude)
                return 0;
            var latitude_radian1 = this.degree_to_radian(this.latitude);
            var latitude_radian2 = this.degree_to_radian(obj.latitude);
            var theta = this.longitude - obj.longitude;
            var val = Math.sin(latitude_radian1) * Math.sin(latitude_radian2);
            val += Math.cos(latitude_radian1) * Math.cos(latitude_radian2) * Math.cos(this.degree_to_radian(theta));
            val = Math.acos(val);
            val = this.radian_to_degree(val);
            val = val * 60 * 1.1515;
            val = val * 1.609344;
            return val;
        };
        Branch.prototype.degree_to_radian = function (val) {
            return val * Math.PI / 180.0;
        };
        Branch.prototype.radian_to_degree = function (val) {
            return val * 180.0 / Math.PI;
        };
        Branch.prototype.TAG = function () {
            return "branch";
        };
        return Branch;
    }(tsp.protocol.Entity));
    tsp.Branch = Branch;
})(tsp || (tsp = {}));
module.exports = tsp;
//# sourceMappingURL=tsp.js.map