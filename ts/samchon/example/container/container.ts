/// <reference path="../../API.ts" />

/// <reference path="../../../std/List.ts" />

namespace samchon.example.container
{
    export function main()
    {
        var list = new std.UnorderedSet<number>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

        trace("#" + list.size());

        for (var it = list.begin(); it.equals(list.end()) == false; it = it.next())
            trace(it.value);
    }
}