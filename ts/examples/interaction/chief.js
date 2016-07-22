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
var tsp = require("./base/tsp");
var pack = require("./base/packer");
var chief;
(function (chief_1) {
    chief_1.library = samchon.library;
    chief_1.protocol = samchon.protocol;
    chief_1.external = samchon.protocol.external;
    var Chief = (function (_super) {
        __extends(Chief, _super);
        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        function Chief() {
            _super.call(this);
        }
        Chief.prototype.createChild = function (xml) {
            return new MasterSystem(this);
        };
        /* ---------------------------------------------------------
            PROCEDURES -> SEND DATA & REPLY DATA
        --------------------------------------------------------- */
        Chief.prototype.solveTSP = function () {
            var travel = new tsp.Travel();
            for (var i = 0; i < 5; i++)
                travel.push(new tsp.Branch((i + 1) + "th branch", Math.random() * 90, Math.random() * 90));
            this.get("tsp").sendData(new chief_1.protocol.Invoke("optimize", travel.toXML()));
        };
        Chief.prototype.solvePack = function () {
            var productArray = new pack.ProductArray();
            productArray.push(new pack.Product("Eraser", 500, 10, 70), new pack.Product("Pencil", 400, 30, 35), new pack.Product("Book", 8000, 150, 300), new pack.Product("Drink", 1000, 75, 250), new pack.Product("Umbrella", 4000, 200, 1000), new pack.Product("Notebook-PC", 800000, 150, 850), new pack.Product("Tablet-PC", 600000, 120, 450));
            var packer = new pack.Packer(productArray);
            packer.push(new pack.WrapperArray(new pack.Wrapper("Large", 100, 200, 1000)), new pack.WrapperArray(new pack.Wrapper("Medium", 70, 150, 500)), new pack.WrapperArray(new pack.Wrapper("Small", 50, 100, 250)));
            this.get("packer").sendData(new chief_1.protocol.Invoke("optimize", packer.toXML()));
        };
        Chief.prototype.replyData = function (invoke) {
            this.get("reporter").sendData(invoke);
        };
        /* ---------------------------------------------------------
            START APPLICATION
        --------------------------------------------------------- */
        Chief.main = function () {
            console.log("Select what to do.");
            console.log("	1. Solve TSP");
            console.log("	2. Solve Packer");
            var what_to_do = scanf("%d");
            ///////
            // CONSTRUCT CHIEF
            ///////
            // CREATE CHIEF
            var chief = new Chief();
            {
                // ADD MASTER SYSTEMS WITH THEIR IP ADDRESSES.
                console.log("Insert IP addresses of external systems.");
                console.log("	TSP system: ");
                chief.push_back(new MasterSystem(chief, "tsp", "127.0.0.1", 37110));
                console.log("	Reporter system: ");
                chief.push_back(new MasterSystem(chief, "reporter", "127.0.0.1", 37200));
                console.log("	Packer system: ");
                chief.push_back(new MasterSystem(chief, "packer", "127.0.0.1", 37310));
            }
            chief.connect();
            setTimeout(function () {
                if (what_to_do == 1)
                    chief.solveTSP();
                else
                    chief.solvePack();
            }, 3000);
        };
        return Chief;
    }(chief_1.external.ExternalServerArray));
    chief_1.Chief = Chief;
    var MasterSystem = (function (_super) {
        __extends(MasterSystem, _super);
        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        function MasterSystem(chief, name, ip, port) {
            if (name === void 0) { name = ""; }
            if (ip === void 0) { ip = ""; }
            if (port === void 0) { port = 0; }
            _super.call(this);
            this.chief = chief;
            this.name = name;
            this.ip = ip;
            this.port = port;
        }
        MasterSystem.prototype.createServerConnector = function () {
            return new chief_1.protocol.WebServerConnector(this);
        };
        MasterSystem.prototype.createChild = function (xml) {
            return null;
        };
        /* ---------------------------------------------------------
            INVOKE MESSAGE CHAIN
        --------------------------------------------------------- */
        MasterSystem.prototype.replyData = function (invoke) {
            this.chief.replyData(invoke);
        };
        return MasterSystem;
    }(chief_1.external.ExternalServer));
    chief_1.MasterSystem = MasterSystem;
})(chief || (chief = {}));
chief.Chief.main();
//# sourceMappingURL=chief.js.map