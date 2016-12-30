/**
 * Collections, elements I/O detectable STL containers.
 * 
 * STL Containers       | Collections
 * ---------------------|-------------------
 * {@link Vector}       | {@link ArrayCollection}
 * {@link List}         | {@link ListCollection}
 * {@link Deque}        | {@link DequeCollection}
 *                      | 
 * {@link TreeSet}      | {@link TreeSetCollection}
 * {@link HashSet}      | {@link HashSetCollection}
 * {@link TreeMultiSet} | {@link TreeMultiSetCollection}
 * {@link HashMultiSet} | {@link HashMultiSetCollection}
 *                      |
 * {@link TreeMap}      | {@link TreeMapCollection}
 * {@link HashMap}      | {@link HashMapCollection}
 * {@link TreeMultiMap} | {@link TreeMultiMapCollection}
 * {@link HashMultiMap} | {@link HashMultiMapCollection}
 * 
 * @author Jeongho Nam <http://samchon.org>
 */
namespace samchon.collections
{
	/**
	 * An interface for {@link IContainer containers} who can detect element I/O events.
	 * 
	 * Below are list of methods who are dispatching {@link CollectionEvent}:
	 * - *insert* typed events:
	 *	 - {@link assign}
	 *   - {@link insert}
	 *	 - {@link push}
	 * - *erase* typed events:
	 *   - {@link assign}
	 *   - {@link clear}
	 *   - {@link erase}
	 * - *refresh* typed events:
	 *   - {@link refresh}
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface ICollection<T>
		extends std.base.Container<T>, library.IEventDispatcher
	{
		/* ---------------------------------------------------------
			REFRESH
		--------------------------------------------------------- */
		/**
		 * Dispatch a {@link CollectionEvent} with *refresh* typed.
		 * 
		 * {@link ICollection} dispatches {@link CollectionEvent} typed *insert* or *erase* whenever elements I/O has 
		 * occured. However, unlike those elements I/O events, content change in element level can't be detected. 
		 * There's no way to detect those events automatically by {@link IContainer}.
		 * 
		 * If you want to dispatch those typed events (notifying change on contents in element level), you've to 
		 * dispatch *refresh* typed event manually, by yourself. Call {@link refresh refresh()} with specified 
		 * iterators who're pointing the elements whose content have changed. Then a {@link CollectionEvent} with 
		 * *refresh* typed will be dispatched.
		 * 
		 * If you don't specify any iterator, then the range of the *refresh* event will be all elements in this
		 * {@link ICollection collection}; {@link begin begin()} to {@link end end()}.
		 */
		refresh(): void;

		/**
		 * Dispatch a {@link CollectionEvent} with *refresh* typed.
		 *
		 * {@link ICollection} dispatches {@link CollectionEvent} typed *insert* or *erase* whenever elements I/O has 
		 * occured. However, unlike those elements I/O events, content change in element level can't be detected. 
		 * There's no way to detect those events automatically by {@link IContainer}.
		 *
		 * If you want to dispatch those typed events (notifying change on contents in element level), you've to
		 * dispatch *refresh* typed event manually, by yourself. Call {@link refresh refresh()} with specified
		 * iterators who're pointing the elements whose content have changed. Then a {@link CollectionEvent} with
		 * *refresh* typed will be dispatched.
		 * 
		 * @param it An iterator targeting the content changed element.
		 */
		refresh(it: std.Iterator<T>): void;

		/**
		 * Dispatch a {@link CollectionEvent} with *refresh* typed.
		 *
		 * {@link ICollection} dispatches {@link CollectionEvent} typed *insert* or *erase* whenever elements I/O has 
		 * occured. However, unlike those elements I/O events, content change in element level can't be detected. 
		 * There's no way to detect those events automatically by {@link IContainer}.
		 *
		 * If you want to dispatch those typed events (notifying change on contents in element level), you've to
		 * dispatch *refresh* typed event manually, by yourself. Call {@link refresh refresh()} with specified
		 * iterators who're pointing the elements whose content have changed. Then a {@link CollectionEvent} with
		 * *refresh* typed will be dispatched.
		 * 
		 * @param first An Iterator to the initial position in a sequence of the content changed elmeents.
		 * @param last An {@link Iterator} to the final position in a sequence of the content changed elements. The range 
		 *			   used is [*first*, *last*), which contains all the elements between *first* and 
		 *			   *last*, including the element pointed by *first* but not the element pointed by 
		 *			   *last*.
		 */
		refresh(first: std.Iterator<T>, last: std.Iterator<T>): void;

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		addEventListener(type: string, listener: library.BasicEventListener): void;
		addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
		addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
		addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		addEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
		addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
		addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
		addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;

		/* ---------------------------------------------------------
			REMOVE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		removeEventListener(type: string, listener: library.BasicEventListener): void;
		removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
		removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
		removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		removeEventListener(type: string, listener: library.BasicEventListener, thisArg: Object): void;
		removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
		removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
		removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
	}

	/**
	 * @hidden
	 */
	export namespace ICollection
	{
		/**
		 * @hidden
		 */
		export function _Dispatch_CollectionEvent<T>
			(
				collection: ICollection<T>, type: string, 
				first: std.Iterator<T>, last: std.Iterator<T>
			): void
		{
			if (collection.hasEventListener(type) == false)
				return;

			let event: CollectionEvent<T> = new CollectionEvent<T>(type, first, last);
			setTimeout(function ()
			{
				collection.dispatchEvent(event);
			});
		}

		/**
		 * @hidden
		 */
		export function _Dispatch_MapCollectionEvent<Key, T>
			(
				collection: ICollection<std.Pair<Key, T>>, type: string,
				first: std.MapIterator<Key, T>, last: std.MapIterator<Key, T>
			): void
		{
			if (collection.hasEventListener(type) == false)
				return;

			let event: MapCollectionEvent<Key, T> = new MapCollectionEvent<Key, T>(type, first, last);
			setTimeout(function ()
			{
				collection.dispatchEvent(event);
			});
		}
	}
}