/// <reference path="../typings/samchon-framework/samchon-framework.d.ts" />
"use strict";
const samchon = require("samchon-framework");
var example;
(function (example) {
    var interaction;
    (function (interaction) {
        interaction.library = samchon.library;
        interaction.protocol = samchon.protocol;
        interaction.external = samchon.protocol.external;
        class Chief extends interaction.external.ExternalSystemArray {
            constructor() {
                super();
                this.push(new MasterSystem(this, "tsp"), new MasterSystem(this, "reporter"), new MasterSystem(this, "packer"));
            }
            createServer() {
                return null;
            }
            createExternalServer(xml) {
                return new MasterSystem(this);
            }
            createExternalClient(driver) {
                return null;
            }
            replyData(invoke) {
                this.get("reporter").sendData(invoke);
            }
        }
        interaction.Chief = Chief;
        class MasterSystem extends interaction.external.ExternalServer {
            constructor(chief, name = "") {
                super();
                this.chief = chief;
                this.name = name;
            }
            createServerConnector() {
                return new interaction.protocol.WebServerConnector(this);
            }
            createChild(xml) {
                return null;
            }
            replyData(invoke) {
                this.chief.replyData(invoke);
            }
        }
        interaction.MasterSystem = MasterSystem;
    })(interaction = example.interaction || (example.interaction = {}));
})(example || (example = {}));
//# sourceMappingURL=chief.js.map