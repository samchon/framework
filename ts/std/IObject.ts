namespace std
{
    export interface IObject
        extends Object
    {
        equals(obj: IObject): boolean;

        less(obj: IObject): boolean;

        hashCode(): number;
    }

    export function equals(val1: any, val2: any): boolean
    {
        if (val1 instanceof Object)
            return val1.equals(val2);
        else
            return val1 == val2;
    }

    export function less(val1: any, val2: any): boolean
    {
        if (val1 instanceof Object)
            return val1.less(val2);
        else
            return val1 < val2;
    }
}

var __s_uid: number = 0;

Object.prototype["__uid"] = ++__s_uid;

Object.prototype["equals"] =
    function (obj): boolean 
    {
        return this == obj;
    }
Object.prototype["less"] =
    function (obj): boolean
    {
        return this["__uid"] < obj["__uid"];
    }

Object.prototype["hasCode"] =
    function (): number
    {
        return this["__uid"];
        //var str: string = JSON.stringify(this);
        //var val: number = 0;

        //for (var i: number = 0; i < str.length; i++)
        //    val += str.charCodeAt(i) * Math.pow(31, str.length - 1 - i);

        //return val;
    }