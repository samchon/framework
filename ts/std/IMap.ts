namespace std
{
    /**
     * <p> An interface of a map. </p
     * <ul>
     *  <li> _Kty: Type of the keys. Each element in a map is uniquely identified by its key value. </li>
     *  <li> _Ty: Type of the mapped value. Each element in a map stores some data as its mapped value. </li>
     * </ul>
     *
     * @author Jeongho Nam
     */
    export interface IMap<_Kty, _Ty>
    {
	    /**
	     * <p> Whether have the item or not. </p>
	     *
	     * @param key Key value of the element whose mapped value is accessed.
	     * @return Whether the map has an item having the specified identifier
	     */
	    has(key: _Kty): boolean;

	    /**
	     * <p> Get element by key. </p>
	     * 
	     * @param key Key value of the element whose mapped value is accessed.
	     * @return A reference object of the mapped value (_Ty)
	     */
	    get(key: _Kty): _Ty;

	    /**
	     * <p> Set element. </p>
	     *
	     * @param key Key value of the element whose mapped value is accessed.
	     * @param val Value, the item.
	     */
	    //set(key: _Kty, value: _Ty): void;

        /**
	     * <p> Erase an element. </p>
	     * <p> Removes an element by its key(identifier) from the Map container. </p>
	     *
	     * @param key Key of the element to be removed from the Map.
	     * @throw exception out of range.
	     */
        //erase(key: _Kty): void;
    }
}