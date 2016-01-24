/// <reference path="IContainer.ts" />

namespace std
{
    /**
     * An interface of set container.
     *
     * @author Jeongho Nam
     */
    export interface ISet<T>
        extends IContainer<T>
    {
        /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
        /**
	     * <p> Whether have the item or not. </p>
	     * <p> Indicates whether a set has an item having the specified identifier. </p>
	     *
	     * @param key Key value of the element whose mapped value is accessed.
         *
	     * @return Whether the set has an item having the specified identifier.
	     */
        has(key: T): boolean;
        
        /**
         * <p> Count elements with a specific key. </p>
         * <p> Searches the container for elements with a value of k and returns the number of elements found. </p>
         *
         * @param key Value of the elements to be counted.
         *
         * @return The number of elements in the container with a <code>key</code>.
         */
        count(key: T): number;

        /**
         * <p> Get iterator to element. </p>
         * 
         * <p> Searches the container for an element with <code>key</code> as value and returns an iterator to it 
         * if found, otherwise it returns an iterator to <code>end()</code> (the element past the end of the 
         * container). </p>
         *
         * <p> Another member function, <code>count()</code>, can be used to just check whether a particular 
         * element exists. </p>
         *
         * @param key Key to be searched for.
         *
         * @return An iterator to the element, if the specified value is found, 
         *         or <code>end()</code> if it is not found in the container.
         */
        find(key: T): Iterator<T>;

        /* ---------------------------------------------------------
		    ELEMENTS I/O
	    --------------------------------------------------------- */
        /**
         * <p> Insert element with hint. </p>
         *
         * <p> Extends the container by inserting new elements, effectively increasing the container size by the 
         * number of elements inserted. </p>
         *
         * @param hint Hint for the position where the element can be inserted.
         * @param key Value to be inserted as an elements.
         *
         * @return An iterator pointing to either the newly inserted element or 
         *         to the element that already had its same value in the set.
         */
        insert(hint: Iterator<T>, key: T): Iterator<T>;

        /**
         * <p> Insert elements with a range of a container. </p>
         *
         * <p> Extends the container by inserting new elements, effectively increasing the container size by the 
         * number of elements inserted. </p>
         *
         * @param begin An iterator specifying range of the begining element.
         * @param end An iterator specifying range of the ending element.
         */
        insert<U extends T>(begin: Iterator<U>, end: Iterator<U>): void;

        /**
         * <p> Erase an element. </p>
         * <p> Removes from the set container the elements whose value is <code>key</code>. </p>
         *
         * <p> This effectively reduces the container size by the number of elements removed. </p>
         *
         * @param key Value of the elements to be erased.
         *
         * @return Number of elements erased.
         */
        erase(key: T): number;
        
        /**
         * @inheritdoc
         */
        erase(position: Iterator<T>): Iterator<T>;

        /**
         * <p> Erase elements. </p>
         * <p> Removes from the set container a range of elements.. </p>
         *
         * <p> This effectively reduces the container size by the number of elements removed. </p>
         *
         * @param begin An iterator specifying a range of beginning to erase.
         * @param end An iterator specifying a range of end to erase.
         */
        erase(begin: Iterator<T>, end: Iterator<T>): void;
    }
}