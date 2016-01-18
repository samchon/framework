namespace std
{
    /**
     * <p> A pair of values. </p>
     * <ul>
     *  <li> _Ty1: Type of member fisrt. </li>
     *  <li> _Ty2 Type of member second. </li>
     * </ul>
     *
     * <p> This class couples together a pair of values, which may be of different types 
     * (_Ty1 and _Ty2). The individual values can be accessed through its public members 
     * first and second. </p>
     *
     * <p> Same with std::pair (http://www.cplusplus.com/reference/utility/pair/) </p>
     *
     * @author Jeongho Nam
     */
    export class Pair<_Ty1, _Ty2>
    {
	    /**
	     * <p> A first value in the Pair. </p>
	     */
	    public first: _Ty1;

	    /**
	     * <p> A second value in the Pair. </p>
	     */
	    public second: _Ty2;

	    /**
	     * <p> Construct from pair values. </p>
	     *
	     * @param first The first value of the Pair
	     * @param second The second value of the Pair
	     */
	    public constructor(first: _Ty1, second: _Ty2)
	    {
		    this.first = first;
		    this.second = second;
	    }
	
	    /**
	     * <p> Whether a Pair is equal with the Pair. <p>
	     * <p> Compare each first and second value of two Pair(s) and returns whether they are equal or not. </p>
	     * 
	     * <p> If stored key and value in a Pair are not number or string but an object like a class or struct, 
	     * the comparison will be executed by a member method (SomeObject)::equals(). If the object does not have 
	     * the member method equals(), only address of pointer will be compared. </p>
	     *
	     * @param obj A Map to compare
	     * @return Indicates whether equal or not.
	     */
	    public equals(obj: Pair<_Ty1, _Ty2>): boolean
	    {
		    var first: boolean;
		    var second: boolean;

		    if (this.first.hasOwnProperty("equals") && this.first["equals"] instanceof Function)
			    first = this.first["equals"](obj.first);
		    else
			    first = this.first == obj.first;

		    if (this.second.hasOwnProperty("equals") && this.second["equals"] instanceof Function)
			    second = this.second["equals"](obj.second);
		    else
			    second = this.second == obj.second;

		    return first == true && second == true;
	    }

	    /**
	     * <p> Returns a string representation of the Map. </p>
	     *
	     * <p> The returned string will follow the form of JSonObject </p>
         * <ul>
	     *	<li> {"first": "???", "second": ???} </li>
         * </ul>
	     */
	    public toString(): string
	    {
		    return "{first: " + this.first + ", second: " + this.second + "}";
	    }
    }  
}