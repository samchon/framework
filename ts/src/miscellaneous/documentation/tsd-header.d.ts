// Type definitions for Samchon Framework v1.1.0
// Project: https://github.com/samchon/framework
// Definitions by: Jeongho Nam <http://samchon.org>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// ------------------------------------------------------------------------------------
// In Samchon Framework, merging multiple 'ts' files to a module is not possible yet.
// Instead of using "import" instruction, use such trick: 
//
// <code>
// declare var global: any;
// declare var require: Function;
//
// global["samchon"] = require("samchon-framework");
// let invoke: samchon.protocol.Invoke = new samchon.protocol.Invoke("setValue", 3);
// </code>
//
// Those declaration of global and require can be substituted by using "node.d.ts"
// ------------------------------------------------------------------------------------

