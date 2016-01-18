/// <reference path="library/StringUtil.ts" />

/// <reference path="../std/Pair.ts" />

namespace samchon
{
    export class Global
    {

    }
}

var uid_: number = 0;

Object.prototype["__getUID"] = function () 
{
    if (this.hasOwnProperty("uid__") == true)
        return this["uid__"];
    else 
    {
        this["uid__"] = ++uid_;
        return this["uid__"];
    }
}