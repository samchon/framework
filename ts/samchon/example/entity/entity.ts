/// <reference path="../../API.ts" />

/// <reference path="../../protocol/EntityArray.ts" />
/// <reference path="../../protocol/Entity.ts" />

namespace samchon.example.entity
{
    export function main()
    {
        var str: string =
            "<memberList>\n" +
            "   <member id='abcd' name='ABCD' />\n" +
            "   <member id='efgh' name='EFGH' />\n" +
            "</memberList>";

        var xml: library.XML = new library.XML(str);

        trace(xml.toString());
        trace(new library.XML(xml.toString()).toString());
    }
}