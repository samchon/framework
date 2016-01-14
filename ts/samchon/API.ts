namespace samchon
{
    /**
     * <p> Trace arguments on screen. </p>
     * <p> Displays arguments on screen by <i>document.write</i>. </p>
     * 
     * <p> If any argument in a trace statement includes a data type other than a string, the trace function 
     * invokes the associated toString() method for that data type. If the argument which is not a string 
     * doesn't have <i>toString()</i> method, only "[object Object]" words will be traced. </p>
     *
     * <p> Trace prints words in web page direclty. It can harm ordinary layout of the page. </p>
     *
     * @param args One or more (comma separated) expressions to evaluate. 
     *			   For multiple expressions, a space is inserted between each expression in the output.
     *
     * @author Jeongho Nam
     */
    export function trace(...args: any[]): void 
    {
        var str: string = "";

        var replacerArray: Array<std.Pair<string, string>> =
        [
            //new std.Pair<string, string>("'", "&apos;"),
            //new std.Pair<string, string>('"', "&quot;"),
            new std.Pair<string, string>("&", "&amp;"),
            new std.Pair<string, string>("<", "&lt;"),
            new std.Pair<string, string>(">", "&gt;"),
            new std.Pair<string, string>("\n", "<br>"),
            new std.Pair<string, string>("\t", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
            //new std.Pair<string, string>("\t", "____")
        ];

        for (var i: number = 0; i < args.length; i++) 
        {
            var item: string = String(args[i]);
            item = library.StringUtil.replaceAll(item, replacerArray);

            if (i == 0)
                str += item;
            else
                str += ", " + item;
        }

        document.write("<p>" + str + "</p>");
    }
}