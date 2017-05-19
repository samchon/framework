/// <reference path="../../lib/samchon.d.ts" />
eval('var std = require("tstl")');
eval('var samchon = require("../../lib/samchon")');
var example;
(function (example) {
    example.library = samchon.library;
    function main() {
        console.log("TEST ALL");
        for (var key in example)
            if (key != "main" && example[key] instanceof Function) {
                console.log("===================================================");
                console.log("	" + key);
                console.log("===================================================");
                example[key]();
                console.log("\n");
            }
    }
    example.main = main;
})(example || (example = {}));
module.exports = example;
/// <reference path="API.ts" />
var example;
(function (example) {
    function genetic_algorithm() {
        var numbers = new std.Vector();
        for (var i = 0; i < 10; i++)
            numbers.push_back(i);
        std.random_shuffle(numbers.begin(), numbers.end());
        console.log(numbers.data());
        var ga = new example.library.GeneticAlgorithm();
        var ret = ga.evolveGeneArray(numbers, 50, 50, compare, cloner);
        console.log(ret.data());
    }
    example.genetic_algorithm = genetic_algorithm;
    function compare(x, y) {
        return compute_score(x) > compute_score(y);
    }
    function cloner(x) {
        return new std.Vector(x);
    }
    function compute_score(v) {
        var score = 0;
        for (var i = 0; i < v.size(); i++)
            if (i == v.at(i))
                ++score;
        return score;
    }
})(example || (example = {}));
//# sourceMappingURL=test.js.map