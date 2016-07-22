/// <reference path="../../typings/typescript-stl/typescript-stl.d.ts" />
/// <reference path="../../typings/samchon-framework/samchon-framework.d.ts" />
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var std = require("typescript-stl");
var samchon = require("samchon-framework");
var pack;
(function (pack) {
    pack.library = samchon.library;
    pack.protocol = samchon.protocol;
    var Product = (function (_super) {
        __extends(Product, _super);
        function Product(name, price, volume, weight) {
            if (name === void 0) { name = ""; }
            if (price === void 0) { price = 0; }
            if (volume === void 0) { volume = 0; }
            if (weight === void 0) { weight = 0; }
            _super.call(this);
            this.name = name;
            this.price = price;
            this.volume = volume;
            this.weight = weight;
        }
        /* --------------------------------------------------------------------
            GETTERS
        -------------------------------------------------------------------- */
        Product.prototype.getName = function () {
            return this.name;
        };
        Product.prototype.getPrice = function () {
            return this.price;
        };
        Product.prototype.getVolume = function () {
            return this.volume;
        };
        Product.prototype.getWeight = function () {
            return this.weight;
        };
        /* --------------------------------------------------------------------
            EXPORTERS
        -------------------------------------------------------------------- */
        Product.prototype.TAG = function () {
            return "product";
        };
        return Product;
    }(pack.protocol.Entity));
    pack.Product = Product;
    var ProductArray = (function (_super) {
        __extends(ProductArray, _super);
        function ProductArray() {
            _super.call(this);
        }
        ProductArray.prototype.createChild = function (xml) {
            return new Product();
        };
        ProductArray.prototype.TAG = function () {
            return "productArray";
        };
        ProductArray.prototype.CHILD_TAG = function () {
            return "product";
        };
        return ProductArray;
    }(pack.protocol.EntityArray));
    pack.ProductArray = ProductArray;
    var Wrapper = (function (_super) {
        __extends(Wrapper, _super);
        /* --------------------------------------------------------------------
            CONSTRUCTORS
        -------------------------------------------------------------------- */
        /**
         * <p> Construct from arguments. </p>
         */
        function Wrapper() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            _super.call(this);
            if (args.length == 1 && args[0] instanceof Wrapper) {
                var wrapper = args[0];
                this.name = wrapper.name;
                this.price = wrapper.price;
                this.volume = wrapper.volume;
                this.weight = wrapper.weight;
            }
            else if (args.length == 4) {
                this.name = args[0];
                this.price = args[1];
                this.volume = args[2];
                this.weight = args[3];
            }
            else {
                this.name = "";
                this.price = 0;
                this.volume = 0;
                this.weight = 0;
            }
        }
        Wrapper.prototype.createChild = function (xml) {
            return new Product();
        };
        /* --------------------------------------------------------------------
            OPERATORS
        -------------------------------------------------------------------- */
        Wrapper.prototype.tryInsert = function (product) {
            var volume = 0;
            var weight = 0;
            for (var i = 0; i < this.length; i++) {
                volume += this[i].getVolume();
                weight += this[i].getWeight();
            }
            if (product.getVolume() + volume > this.volume ||
                product.getWeight() + weight > this.weight) {
                return false;
            }
            this.push(product);
            return true;
        };
        /* --------------------------------------------------------------------
            GETTERS
        -------------------------------------------------------------------- */
        Wrapper.prototype.getName = function () {
            return this.name;
        };
        Wrapper.prototype.getPrice = function () {
            return this.price;
        };
        Wrapper.prototype.getVolume = function () {
            return this.volume;
        };
        Wrapper.prototype.getWeight = function () {
            return this.weight;
        };
        /* --------------------------------------------------------------------
            EXPORTERS
        -------------------------------------------------------------------- */
        Wrapper.prototype.TAG = function () {
            return "wrapper";
        };
        return Wrapper;
    }(ProductArray));
    pack.Wrapper = Wrapper;
    var WrapperArray = (function (_super) {
        __extends(WrapperArray, _super);
        /* --------------------------------------------------------------------
            CONSTRUCTORS
        -------------------------------------------------------------------- */
        /**
         * <p> Construct from a sample wrapper. </p>
         *
         * @param sample A sample wrapper used to copy wrappers.
         */
        function WrapperArray(sample) {
            if (sample === void 0) { sample = null; }
            _super.call(this);
            this.sample = sample;
            this.reserved = new std.Vector();
        }
        WrapperArray.prototype.construct = function (xml) {
            this.sample = new Wrapper();
            this.sample.construct(xml);
            _super.prototype.construct.call(this, xml);
        };
        WrapperArray.prototype.createChild = function (xml) {
            return new Wrapper();
        };
        /* --------------------------------------------------------------------
            OPERATORS
        -------------------------------------------------------------------- */
        /**
         * <p> Try to insert a product into reserved list. </p>
         *
         * <p> If the Product's volume and weight is equal or less than the Wrapper categorized so that enable to
         * insert in a Wrapper, reserve the Product and returns <i>true</i>. If not, does not reserve and just
         * return <i>false</i>. </p>
         *
         * @return Whether the Product's volume and weight is equal or less than the Wrapper.
         */
        WrapperArray.prototype.tryInsert = function (product) {
            if (product.getVolume() > this.sample.getVolume() ||
                product.getWeight() > this.sample.getWeight()) {
                return false;
            }
            this.reserved.push(product);
            return true;
        };
        /**
         * <p> Optimize to retrieve the best solution. </p>
         *
         * <p> Retrieves the best solution of packaging in level of WrapperArray. </p>
         * <p> Shuffles sequence of reserved Product(s) by samchon::library::FactorialGenerator and insert the reserved
         * Products(s) following the sequence creating Wrapper(s) as needed. Between the sequences from FactorialGenerator,
         * retrieve and determine the best solution. </p>
         *
         * <h4> Note. </h4>
         * <p> Sequence of inserting Product can affeact to numbers of Wrapper(s) to be used. </p>
         * <p> It's the reason why even WrapperArray has the optimize() method. </p>
         */
        WrapperArray.prototype.optimize = function () {
            if (this.reserved.length == 0)
                return;
            var factorial = new pack.library.FactorialGenerator(this.reserved.length);
            var minWrapperArray;
            for (var i = 0; i < factorial.size(); i++) {
                var wrapperArray = new WrapperArray(this.sample);
                var row = factorial.at(i);
                for (var j = 0; j < row.length; j++) {
                    var product = this.reserved[row[j]];
                    if (wrapperArray.length == 0 ||
                        wrapperArray[wrapperArray.length - 1].tryInsert(product) == false) {
                        var wrapper = new Wrapper(this.sample);
                        wrapper.tryInsert(product);
                        wrapperArray.push(wrapper);
                    }
                }
                if (minWrapperArray == null ||
                    wrapperArray.calcPrice() < minWrapperArray.calcPrice()) {
                    minWrapperArray = wrapperArray;
                }
            }
            //REPLACE TO MIN_WRAPPER_ARRAY
            this.splice(0, this.length);
            for (var i = 0; i < minWrapperArray.length; i++)
                this.push(minWrapperArray[i]);
        };
        /* --------------------------------------------------------------------
            GETTERS
        -------------------------------------------------------------------- */
        /**
         * <p> Calculate price of the Wrapper(s). </p>
         *
         * <p> Calculates price of all wrappers'. The price does not contain inserted products'. </p>
         */
        WrapperArray.prototype.calcPrice = function () {
            return this.sample.getPrice() * this.length;
        };
        /**
         * <p> Get sample. </p>
         */
        WrapperArray.prototype.getSample = function () {
            return this.sample;
        };
        /* --------------------------------------------------------------------
            EXPORTERS
        -------------------------------------------------------------------- */
        WrapperArray.prototype.TAG = function () {
            return "wrapperArray";
        };
        WrapperArray.prototype.CHILD_TAG = function () {
            return "wrapper";
        };
        WrapperArray.prototype.toXML = function () {
            var xml = _super.prototype.toXML.call(this);
            xml.addAllProperties(this.sample.toXML());
            return xml;
        };
        return WrapperArray;
    }(pack.protocol.EntityArray));
    pack.WrapperArray = WrapperArray;
    /**
     * <p> A packer planning the best packaging. </p>
     * <p> Retrieves the solution of packaging by combination permuation and factorial case. </p>
     *
     * <h4> Warning. </h4>
     * <p> Be careful about number of products and wrappers. </p>
     * <p> The time complexity of Packer overs O(m^n). Elapsed time of calculation increases enourmously.
     * Do not use Packer if the digits of number of products or wrappers overs 2. </p>
     *
     * @author Jeongho Nam
     */
    var Packer = (function (_super) {
        __extends(Packer, _super);
        function Packer(obj) {
            if (obj === void 0) { obj = null; }
            _super.call(this);
            if (obj == null) {
                this.productArray = new ProductArray();
                return;
            }
            if (obj instanceof ProductArray) {
                this.productArray = obj;
            }
            else if (obj instanceof Packer) {
                var packer = obj;
                this.productArray = packer.productArray;
                for (var i = 0; i < packer.length; i++)
                    this.push(new WrapperArray(packer[i].getSample()));
            }
            else
                throw "invalid argument";
        }
        Packer.prototype.construct = function (xml) {
            _super.prototype.construct.call(this, xml);
            this.productArray.construct(xml.get(this.productArray.TAG()).front());
        };
        Packer.prototype.createChild = function (xml) {
            return new WrapperArray();
        };
        Packer.prototype.optimize = function (start, size) {
            if (start === void 0) { start = 0; }
            if (size === void 0) { size = -1; }
            if (this.length == 0 || this.productArray.length == 0)
                return;
            var caseGenerator = new pack.library.CombinedPermutationGenerator(this.length, this.productArray.length);
            var minPacker = null;
            //ADJUST END INDEX
            if (size == -1)
                size = caseGenerator.size() - start;
            //FIND THE BEST SOLUTION
            for (var i = start; i < start + size; i++) {
                var packer = new Packer(this);
                var row = caseGenerator.at(i);
                var validity = true;
                for (var j = 0; j < row.length; j++) {
                    var product = this.productArray[j];
                    var wrapperArray = packer[row[j]];
                    if (wrapperArray.tryInsert(product) == false) {
                        validity = false;
                        break;
                    }
                }
                if (validity == false)
                    continue;
                //OPTIMIZE ALL WRAPPERS IN A PACKER
                for (var j = 0; j < packer.length; j++)
                    packer[j].optimize();
                if (minPacker == null || packer.calcPrice() < minPacker.calcPrice())
                    minPacker = packer;
            }
            //REPLACE TO MIN_PACKER
            this.splice(0, this.length);
            for (var i = 0; i < minPacker.length; i++)
                this.push(minPacker[i]);
        };
        /**
         * <p> Calculate price of the wrappers. </p>
         */
        Packer.prototype.calcPrice = function () {
            var price = 0;
            for (var i = 0; i < this.length; i++)
                price += this[i].calcPrice();
            return price;
        };
        /* --------------------------------------------------------------------
            EXPORTERS
        -------------------------------------------------------------------- */
        Packer.prototype.TAG = function () {
            return "packer";
        };
        Packer.prototype.CHILD_TAG = function () {
            return "wrapperArray";
        };
        Packer.prototype.toXML = function () {
            var xml = _super.prototype.toXML.call(this);
            xml.setProperty("price", this.calcPrice() + "");
            xml.push(this.productArray.toXML());
            return xml;
        };
        Packer.main = function () {
            var productArray = new ProductArray();
            productArray.push(new Product("Eraser", 500, 10, 70), new Product("Pencil", 400, 30, 35), new Product("Book", 8000, 150, 300), new Product("Drink", 1000, 75, 250), new Product("Umbrella", 4000, 200, 1000), new Product("Notebook-PC", 800000, 150, 850), new Product("Tablet-PC", 600000, 120, 450));
            var packer = new Packer(productArray);
            packer.push(new WrapperArray(new Wrapper("Large", 100, 200, 1000)), new WrapperArray(new Wrapper("Medium", 70, 150, 500)), new WrapperArray(new Wrapper("Small", 50, 100, 250)));
            packer.optimize();
            console.log("$" + packer.calcPrice());
            console.log(packer.toXML().toString());
        };
        return Packer;
    }(pack.protocol.EntityArray));
    pack.Packer = Packer;
})(pack || (pack = {}));
module.exports = pack;
//# sourceMappingURL=packer.js.map