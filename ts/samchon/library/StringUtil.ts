namespace samchon.library
{
    /**
     * <p> A utility class supporting static methods of string. </p>
     *
     * @author Jeongho Nam
     */
    export class StringUtil
    {
	    /**
	     * <p> Get a tabbed string by specified size. </p>
	     */
	    public static tab(size: number): string
	    {
		    var str: string = "";
		    for (var i: number = 0; i < size; i++)
			    str += "\t";

		    return str;
	    }
    
        /**
	     * <p> Get a tabbed HTLM string by specified size. </p>
	     */
        public static htmlTab(size: number): string
        {
            var str: string = "";
            for (var i: number = 0; i < size; i++)
                str += "&nbsp;&nbsp;&nbsp;&nbsp;";

            return str;
        }

        /*public static substitute(format: string, ...args: any[]): string
        {
            return "";
        }*/

	    /**
	     * <p> Replace all patterns of a string. </p>
	     */
	    public static replaceAll(str: string, pairs: Array<std.Pair<string, string>>): string
	    {
		    if (pairs.length == 0)
			    return str;

            for (var i: number = 0; i < pairs.length; i++)
                str = str.split(pairs[i].first).join(pairs[i].second);

            return str;
	    }
    }
}