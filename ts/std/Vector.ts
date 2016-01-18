/// <reference path="Container.ts" />
/// <reference path="Iterator.ts" />

namespace std
{
    /**
     * <p> Vectors are sequence containers representing arrays that can change in size. </p>
     *
     * <p> Just like arrays, vectors use contiguous storage locations for their elements, which means that 
     * their elements can also be accessed using offsets on regular pointers to its elements, and just as 
     * efficiently as in arrays. But unlike arrays, their size can change dynamically, with their storage 
     * being handled automatically by the container. </p>
     *
     * <p> Internally, Vectors use a dynamically allocated array to store their elements. This array may 
     * need to be reallocated in order to grow in size when new elements are inserted, which implies 
     * allocating a new array and moving all elements to it. This is a relatively expensive task in terms 
     * of processing time, and thus, vectors do not reallocate each time an element is added to the 
     * container. </p>
     *
     * <p> Instead, vector containers may allocate some extra storage to accommodate for possible growth, 
     * and thus the container may have an actual capacity greater than the storage strictly needed to 
     * contain its elements (i.e., its size). Libraries can implement different strategies for growth to 
     * balance between memory usage and reallocations, but in any case, reallocations should only happen at 
     * logarithmically growing intervals of size so that the insertion of individual elements at the end of 
     * the vector can be provided with amortized constant time complexity. </p>
     *
     * <p> Therefore, compared to arrays, vectors consume more memory in exchange for the ability to manage 
     * storage and grow dynamically in an efficient way. </p>
     *
     * <p> Compared to the other dynamic sequence containers (deques, lists and forward_lists), vectors are 
     * very efficient accessing its elements (just like arrays) and relatively efficient adding or removing 
     * elements from its end. For operations that involve inserting or removing elements at positions other 
     * than the end, they perform worse than the others, and have less consistent iterators and references 
     * than Lists. </p>
     *
     * <ul>
     *  <li> Designed by C++ Reference - http://www.cplusplus.com/reference/vector/vector/
     * </ul>
     *
     * @author Migrated by Jeongho Nam
     */
    export class Vector<T>
        extends Array<T>
        implements IContainer<T>
    {
        /* ---------------------------------------------------------
		    CONSTRUCTORS
	    --------------------------------------------------------- */
        /**
         * Default Constructor
         */
        public constructor();

        /**
         * Construct from arguments. 
         *
         * @param args An array to be contained.
         */
        public constructor(items: Array<T>);

        /**
         * Consturct from capacity size.
         *
         * @param n Capacity number of the Vector to reserve.
         */
        public constructor(n: number);

        public constructor(size: number, val: T);

        /**
         * <p> Copy Constructor. </p>
         *
         * <p> Constructs a container with a copy of each of the elements in <code>container</code>, 
         * in the same order. </p>
         *
         * @param container Another Container object of the same type (with the same class template 
         *                  arguments T), whose contents are either copied or acquired.
         */
        public constructor(container: IContainer<T>);

        /**
         * Construct from begin and end iterators. 
         *
         * @param begin
         * @param end
         */
        public constructor(begin: Iterator<T>, end: Iterator<T>);
        
        public constructor(...args: any[])
        {
            super();

            if (args.length == 0)
            {
                // DEFAULT CONSTRUCTOR
            }
            if (args.length == 1 && args[0] instanceof Array)
            {
                // CONSTRUCT FROM AN ARRAY OF ITEMS
                var array: Array<T> = args[0];
                
                this.push(...array);
            }
            else if (args.length == 1 && typeof args[0] == "number")
            {
                // CONSTRUCT FROM SIZE
                var size: number = args[0];
                
                this.length = size;
            }
            else if (args.length == 2 && typeof args[0] == "number")
            {
                // CONSTRUCT FROM SIZE AND REPEATING VALUE
                var size: number = args[0];
                var val: T = args[1];
                
                this.assign(size, val);
            }
            else if (args.length == 1 && (args[0] instanceof Vector || args[0] instanceof Container))
            {
                // COPY CONSTRUCTOR
                var container: Container<T> = <Container<T>>args[0];
                
                this.assign(container.begin(), container.end());
            }
            else if (args.length == 2 && args[0] instanceof Iterator && args[1] instanceof Iterator)
            {
                // CONSTRUCT FROM INPUT ITERATORS
                var begin: Iterator<T> = args[0];
                var end: Iterator<T> = args[1];

                this.assign(begin, end);
            }
        }

        /**
         * @inheritdoc
         */
        public assign<U extends T>(begin: Iterator<U>, end: Iterator<U>): void;

        /**
         * <p> Assign Container content. </p>
         *
         * <p> Assigns new contents to the Container, replacing its current contents, 
         * and modifying its size accordingly. </p>
         *
         * @param size New size of the container.
         * @param val Value to fill the container with. Each of the <u>size</u> elements in 
         *            the container will be initialized to a copy of this value.
         */
        public assign(size: number, val: T): void;

        public assign<U extends T>(first: Iterator<U> | number, second: Iterator<U> | T): void
        {
            this.clear();

            if (first instanceof Iterator && second instanceof Iterator)
            {
                var begin: Iterator<U> = first;
                var end: Iterator<U> = second;

                for (var it = begin; it.equals(end) == false; it = it.next())
                    this.push(it.value);
            }
            else if (typeof first == "number")
            {
                var size: number = <number>first;
                var val: T = <T>second;

                this.length = size;

                for (var i: number = 0; i < size; i++)
                    this[i] = val;
            }
        }

        /**
         * @inheritdoc
         */
        public clear(): void
        {
            this.splice(0, this.length);
        }

        /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
        /**
         * @inheritdoc
         */
        public begin(): Iterator<T>
        {
            if (this.size() == 0)
                return this.end();
            else
                return new VectorIterator<T>(this, 0);
        }

        /**
         * @inheritdoc
         */
        public end(): Iterator<T>
        {
            return new VectorIterator<T>(this, -1);
        }

        /**
         * @inheritdoc
         */
        public size(): number
        {
            return this.length;
        }

        /**
         * @inheritdoc
         */
        public empty(): boolean
        {
            return this.length != 0;
        }

        /**
         * <p> Access element. </p>
         * <p> Returns a value to the element at position <code>index</code> in the Vector.</p>
         *
         * <p> The function automatically checks whether n is within the bounds of valid elements in the 
         * Vector, throwing an OutOfRange exception if it is not (i.e., if <code>index</code> is greater or 
         * equal than its size). This is in contrast with member operator[], that does not check against 
         * bounds. </p>
         *
         * @param index Position of an element in the container.
         *              If this is greater than or equal to the vector size, an exception of type OutOfRange 
         *              is thrown. Notice that the first element has a position of 0 (not 1).
         *
         * @return The element at the specified position in the container.
         */
        public at(index: number): T
        {
            if (index < this.size())
                return this[index];
            else
                throw new std.OutOfRange("Target index is greater than Vector's size.");
        }

        /**
         * <p> Access first element. </p>
         * <p> Returns a value in the first element of the Vector. </p>
         *
         * <p> Unlike member <code>Vector.begin()</code>, which returns an iterator just past this element, 
         * this function returns a direct value. </p>
         *
         * <p> Calling this function on an empty container causes undefined behavior. </p>
         *
         * @return A value in the first element of the Vector.
         */
        public front(): T
        {
            return this[0];
        }

        /**
         * <p> Access last element. </p>
         * <p> Returns a value in the last element of the Vector. </p>
         *
         * <p> Unlike member <code>Vector.end()</code>, which returns an iterator just past this element, 
         * this function returns a direct value. </p>
         *
         * <p> Calling this function on an empty container causes undefined behavior. </p>
         *
         * @return A value in the last element of the Vector.
         */
        public back(): T
        {
            return this[this.length - 1];
        }

        /* ---------------------------------------------------------
		    ELEMENTS I/O
	    --------------------------------------------------------- */
        public push<U extends T>(...items: U[]): number
        {
            return this.push(...items);
        }

        public pushBack(element: T): void
        {
            this.push(element);
        }

        /**
         * Replaces the element at the specified position in this list with the specified element. 
         * 
         * @param index A specified position of the value to replace.
         * @param val A value to be stored at the specified position.
         *
         * @return The previous element had stored at the specified position.
         */
        public set(index: number, val: T): T
        {
            if (index > this.length)
                throw new std.OutOfRange("Target index is greater than Vector's size.");

            var prev: T = this[index];
            this[index] = val;

            return prev;
        }

        /**
         * <p> Delete last element. </p>
         * 
         * <p> Removes the last element in the Vector container, effectively reducing the container 
         * <code>size</code> by one. </p>
         */
        public popBack(): void
        {
            this.splice(this.length - 1, 1);
        }

        public insert(position: Iterator<T>, val: T): Iterator<T>;
        public insert(position: Iterator<T>, size: number, val: T): Iterator<T>;
        public insert<U extends T>(position: Iterator<T>, begin: Iterator<U>, end: Iterator<U>): Iterator<T>;

        public insert<U extends T>(...args: any[]): any
        {
            var position: VectorIterator<T> = args[0];

            if (args.length == 2 && args[1] instanceof Iterator == false)
            {
                var val: T = args[1];

                return this.insert(position, 1, val);
            }
            else if (args.length == 3 && typeof args[1] == "number")
            {
                var size: number = <number>args[1];
                var val: T = args[2];

                var spliced: Array<T> = this.splice(position.getIndex());
                var inserts: Array<T> = [];

                for (var i: number = 0; i < size; i++)
                    inserts.push(val);

                this.push(...spliced);
                this.push(...inserts);

                return new VectorIterator(this, position.getIndex() + inserts.length);
            }
            else if (args.length == 3 && args[1] instanceof Iterator && args[2] instanceof Iterator)
            {
                var myEnd: VectorIterator<T> = args[0];
                var begin: Iterator<U> = args[1];
                var end: Iterator<U> = args[2];

                var spliced: Array<T> = this.splice(position.getIndex());
                var inserts: Array<T> = [];

                for (var it = begin; it.equals(end) == false; it = it.next())
                    inserts.push(it.value);

                this.push(...spliced);
                this.push(...inserts);

                return new VectorIterator(this, myEnd.getIndex() + inserts.length);
            }
            else
                throw new std.InvalidArgument("invalid parameters.");
        }
        
        public erase(it: Iterator<T>): Iterator<T>;
        public erase<U extends T>(begin: Iterator<U>, end: Iterator<U>): Iterator<T>;

        public erase(begin: Iterator<T>, end: Iterator<T> = null): Iterator<T>
        {
            var startIndex: number = (<VectorIterator<T>>begin).getIndex();

            if (end == null)
                this.splice(startIndex, 1);
            else
                this.splice(startIndex, (<VectorIterator<T>>end).getIndex() - startIndex);

            return new VectorIterator<T>(this, startIndex);
        }
    };

    /**
     * <p> A bi-directional iterator of a Set. </p>
     *
     * <ul>
     *  <li> _Ty: Type of the elements. </li>
     * </ul>
     * 
     * @author Jeongho Nam
     */
    export class VectorIterator<T>
        extends Iterator<T>
    {
        /**
	     * <p> Sequence number of iterator in the source Vector. </p>
	     */
        private index: number;

        /* ---------------------------------------------------------
		    CONSTRUCTORS
	    --------------------------------------------------------- */
        /**
         * <p> Construct from source and index number. </p>
         *
         * <h4> Note </h4>
         * <p> Do not create iterator directly. </p>
         * <p> Use begin(), find() or end() in Vector instead. </p> 
         *
         * @param vector The source vector to reference.
         * @param index Sequence number of the element in the surce vector.
         */
        public constructor(source: Vector<T>, index: number)
        {
            super(source);

            this.index = index;
        }

        /* ---------------------------------------------------------
		    ACCESSORS
	    --------------------------------------------------------- */
        public get vector(): Vector<T>
        {
            return <Vector<T>>this.source;
        }

        /**
         * <p> Get value of the iterator is pointing. </p>
         * 
         * @return A value of the iterator.
         */
        public get value(): T
        {
            return this.vector.at(this.index);
        }

        /**
         * <p> Set value of the iterator is pointing. </p>
         *
         * @param val A new value of the iterator.
         */
        public set value(val: T)
        {
            this.vector.set(this.index, val);
        }
        
	    /**
	     * <p> Whether an iterator is equal with the iterator. </p>
	     * <p> Compare two iterators and returns whether they are equal or not. </p>
	     * 
	     * <h4> Note </h4> 
         * <p> Iterator's equals() only compare souce map and index number. </p>
         * <p> Although elements in a pair, key and value are equals, if the source map or
         * index number is different, then the equals() will return false. If you want to
         * compare the elements of a pair, compare them directly by yourself. </p>
	     *
	     * @param obj An iterator to compare
	     * @return Indicates whether equal or not.
	     */
        public equals<U extends T>(obj: Iterator<U>): boolean
	    {
            return super.equals(obj) && this.index == (<VectorIterator<U>>obj).index;
	    }

        public getIndex(): number
        {
            return this.index;
        }

        /* ---------------------------------------------------------
		    MOVERS
	    --------------------------------------------------------- */
        /**
	     * <p> Get iterator to previous element. </p>
         * <p> If current iterator is the first item(equal with <i>begin()</i>), returns end(). </p>
         *
         * @return An iterator of the previous item. 
	     */
        public prev(): Iterator<T>
        {
            if (this.index <= 0)
                return this.source.end();
            else
                return new VectorIterator<T>(<Vector<T>>this.source, this.index - 1);
        }

        /**
	     * <p> Get iterator to next element. </p>
         * <p> If current iterator is the last item, returns end(). </p>
         *
         * @return An iterator of the next item.
	     */
        public next(): Iterator<T>
        {
            if (this.index >= this.source.size() - 1)
                return this.source.end();
            else
                return new VectorIterator<T>(<Vector<T>>this.source, this.index + 1);
        }
    }
    
    //export class basicvector<_ty> 
	   // implements array<_ty>
    //{
	   // [n: number]: _ty;

	   // /**
	   //  * default constructor.
	   //  */
	   // constructor() {}

	   // /* ------------------------------------------------------------------------
		  //  accessors
	   // ------------------------------------------------------------------------ */
	   // /**
    //     * gets or sets the length of the array. this is a number one higher than the highest element defined in an array.
    //     */
	   // length: number;
	
	   // /* ------------------------------------------------------------------------
		  //  modifiers
	   // ------------------------------------------------------------------------ */
	   // /**
    //     * appends new elements to an array, and returns the new length of the array.
    //     *
    //     * @param items new elements of the array.
	   //  * @return new length of the array.
	   //  */
	   // public push(...items: _ty[]): number { return 0; }
	
	   // /**
    //     * removes the last element from an array and returns it.
    //     */
	   // public pop(): _ty { return null; }
	
	   // /**
    //     * combines two or more arrays.
    //     *
    //     * @param items additional items to add to the end of array1.
    //     */
	   // public concat(...items: _ty[]): _ty[] { return []; }

	   // /**
    //     * adds all the elements of an array separated by the specified separator string.
    //     *
    //     * @param separator a string used to separate one element of an array from the next in the resulting string. if omitted, the array elements are separated with a comma.
    //     */
	   // public join(separator?: string): string { return ""; }
	
	   // /**
    //     * reverses the elements in an array. 
    //     */
	   // public reverse(): _ty[] { return []; }

	   // /**
	   //  * removes the first element from an array and returns it.
	   //  */
	   // public shift(): _ty { return null; }

	   // /** 
	   //  * returns a section of an array.
	   //  *
	   //  * @param start the beginning of the specified portion of the array.
	   //  * @param end the end of the specified portion of the array.
	   //  */
	   // public slice(start?: number, end?: number): _ty[] { return []; }

    //    /** 
    //     * returns a section of an array.
    //     * @param start the beginning of the specified portion of the array.
    //     * @param end the end of the specified portion of the array.
    //     */
	   // public sort(comparefn?: (a: _ty, b: _ty) => number): _ty[] { return []; }
	
	   // /**
    //     * removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
    //     *
    //     * @param start the zero-based location in the array from which to start removing elements.
    //     * @param deletecount the number of elements to remove.
    //     * @param items elements to insert into the array in place of the deleted elements.
    //     */
	   // public splice(start: number, deletecount: number = 1, ...items: _ty[]): _ty[] { return []; }

	   // /**
	   //  * inserts new elements at the start of an array.
	   //  *
	   //  * @param items elements to insert at the start of the array.
	   //  */
	   // public unshift(...items: _ty[]): number { return 0; }

	   // /**
	   //  * returns the index of the first occurrence of a value in an array.
	   //  *
	   //  * @param searchelement the value to locate in the array.
	   //  * @param fromindex the array index at which to begin the search. if fromindex is omitted, the search starts at index 0.
	   //  */
	   // public indexof(searchelement: _ty, fromindex?: number): number { return 0; }

	   // /**
	   //  * returns the index of the last occurrence of a specified value in an array.
	   //  *
	   //  * @param searchelement the value to locate in the array.
	   //  * @param fromindex the array index at which to begin the search. if fromindex is omitted, the search starts at the last index in the array.
	   //  */
	   // public lastindexof(searchelement: _ty, fromindex?: number): number { return 0; }

	   // /**
	   //  * determines whether all the members of an array satisfy the specified test.
	   //  *
	   //  * @param callbackfn a function that accepts up to three arguments. the every method calls the callbackfn function for each element in array1 until the callbackfn returns false, or until the end of the array.
	   //  * @param thisarg an object to which the this keyword can refer in the callbackfn function. if thisarg is omitted, undefined is used as the this value.
	   //  */
	   // public every(callbackfn: (value: _ty, index: number, array: _ty[]) => boolean, thisarg?: any): boolean { return false; }

	   // /**
	   //  * determines whether the specified callback function returns true for any element of an array.
	   //  *
	   //  * @param callbackfn a function that accepts up to three arguments. the some method calls the callbackfn function for each element in array1 until the callbackfn returns true, or until the end of the array.
	   //  * @param thisarg an object to which the this keyword can refer in the callbackfn function. if thisarg is omitted, undefined is used as the this value.
	   //  */
	   // public some(callbackfn: (value: _ty, index: number, array: _ty[]) => boolean, thisarg?: any): boolean { return false; }

	   // /**
	   //  * performs the specified action for each element in an array.
	   //  *
	   //  * @param callbackfn a function that accepts up to three arguments. foreach calls the callbackfn function one time for each element in the array. 
	   //  * @param thisarg an object to which the this keyword can refer in the callbackfn function. if thisarg is omitted, undefined is used as the this value.
	   //  */
	   // public foreach(callbackfn: (value: _ty, index: number, array: _ty[]) => void, thisarg?: any): void { }

	   // /**
	   //  * calls a defined callback function on each element of an array, and returns an array that contains the results.
	   //  *
	   //  * @param callbackfn a function that accepts up to three arguments. the map method calls the callbackfn function one time for each element in the array. 
	   //  * @param thisarg an object to which the this keyword can refer in the callbackfn function. if thisarg is omitted, undefined is used as the this value.
	   //  */
	   // public map<u>(callbackfn: (value: _ty, index: number, array: _ty[]) => u, thisarg?: any): u[] { return []; }

	   // /**
	   //  * returns the elements of an array that meet the condition specified in a callback function.
	   //  * 
	   //  * @param callbackfn a function that accepts up to three arguments. the filter method calls the callbackfn function one time for each element in the array. 
	   //  * @param thisarg an object to which the this keyword can refer in the callbackfn function. if thisarg is omitted, undefined is used as the this value.
	   //  */
	   // public filter(callbackfn: (value: _ty, index: number, array: _ty[]) => boolean, thisarg?: any): _ty[] { return []; }

	   // /**
	   //  * calls the specified callback function for all the elements in an array. the return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
    //     *
	   //  * @param callbackfn a function that accepts up to four arguments. the reduce method calls the callbackfn function one time for each element in the array.
	   //  * @param initialvalue if initialvalue is specified, it is used as the initial value to start the accumulation. the first call to the callbackfn function provides this value as an argument instead of an array value.
	   //  */
	   // public reduce(callbackfn: (previousvalue: _ty, currentvalue: _ty, currentindex: number, array: _ty[]) => _ty, initialvalue?: _ty): _ty { return null; }

	   // /** 
	   //  * calls the specified callback function for all the elements in an array, in descending order. the return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
	   //  *
    //     * @param callbackfn a function that accepts up to four arguments. the reduceright method calls the callbackfn function one time for each element in the array. 
	   //  * @param initialvalue if initialvalue is specified, it is used as the initial value to start the accumulation. the first call to the callbackfn function provides this value as an argument instead of an array value.
	   //  */
	   // public reduceright(callbackfn: (previousvalue: _ty, currentvalue: _ty, currentindex: number, array: _ty[]) => _ty, initialvalue?: _ty): _ty { return null; }

	   // /* ------------------------------------------------------------------------
		  //  exporters
	   // ------------------------------------------------------------------------ */
	   // /**
	   //  * returns a string representation of an array.
	   //  */
	   // public tostring(): string { return ""; }
	   // public tolocalestring(): string { return ""; }
    //}
    //basicvector.prototype = new array();
}