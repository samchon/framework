/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * An interface for {@link IContainer containers} who can detect element I/O events.
	 * 
	 * <p> Below are list of methods who are dispatching {@link CollectionEvent}: </p>
	 * 
	 * <ul>
	 *	<li> <i>insert</i> typed events: <ul>
	 *		<li> {@link assign} </li>
	 *		<li> {@link insert} </li>
	 *		<li> {@link push} </li>
	 *	</ul></li>
	 *	<li> <i>erase</i> typed events: <ul>
	 *		<li> {@link assign} </li>
	 *		<li> {@link clear} </li>
	 *		<li> {@link erase} </li>
	 *	</ul></li>
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface ICollection<T>
		extends std.base.IContainer<T>, library.IEventDispatcher
	{
		/* ---------------------------------------------------------
			REFRESH
		--------------------------------------------------------- */
		/**
		 * <p> Dispatch a {@link CollectionEvent} with <i>refresh</i> typed. </p>
		 * 
		 * <p> {@link ICollection} dispatches {@link CollectionEvent} typed <i>insert</i> or <i>erase</i> whenever 
		 * elements I/O has occured. However, unlike those elements I/O events, content change in element level can't be 
		 * detected. There's no way to detect those events automatically by {@link IContainer}. </p>
		 * 
		 * <p> If you want to dispatch those typed events (notifying change on contents in element level), you've to 
		 * dispatch <i>refresh</i> typed event manually, by yourself. Call {@link refresh refresh()} with specified 
		 * iterators who're pointing the elements whose content have changed. Then a {@link CollectionEvent} with 
		 * <i>refresh</i> typed will be dispatched. </p>
		 * 
		 * <p> If you don't specify any iterator, then the range of the <i>refresh<i> event will be all elements in this
		 * {@link ICollection collection}; {@link begin begin()} to {@link end end()}. </p>
		 */
		refresh(): void;

		/**
		 * <p> Dispatch a {@link CollectionEvent} with <i>refresh</i> typed. </p>
		 *
		 * <p> {@link ICollection} dispatches {@link CollectionEvent} typed <i>insert</i> or <i>erase</i> whenever
		 * elements I/O has occured. However, unlike those elements I/O events, content change in element level can't be
		 * detected. There's no way to detect those events automatically by {@link IContainer}. </p>
		 *
		 * <p> If you want to dispatch those typed events (notifying change on contents in element level), you've to
		 * dispatch <i>refresh</i> typed event manually, by yourself. Call {@link refresh refresh()} with specified
		 * iterators who're pointing the elements whose content have changed. Then a {@link CollectionEvent} with
		 * <i>refresh</i> typed will be dispatched. </p>
		 * 
		 * @param it An iterator targeting the content changed element.
		 */
		refresh(it: std.Iterator<T>): void;

		/**
		 * <p> Dispatch a {@link CollectionEvent} with <i>refresh</i> typed. </p>
		 *
		 * <p> {@link ICollection} dispatches {@link CollectionEvent} typed <i>insert</i> or <i>erase</i> whenever
		 * elements I/O has occured. However, unlike those elements I/O events, content change in element level can't be
		 * detected. There's no way to detect those events automatically by {@link IContainer}. </p>
		 *
		 * <p> If you want to dispatch those typed events (notifying change on contents in element level), you've to
		 * dispatch <i>refresh</i> typed event manually, by yourself. Call {@link refresh refresh()} with specified
		 * iterators who're pointing the elements whose content have changed. Then a {@link CollectionEvent} with
		 * <i>refresh</i> typed will be dispatched. </p>
		 * 
		 * @param first An Iterator to the initial position in a sequence of the content changed elmeents.
		 * @param last An {@link Iterator} to the final position in a sequence of the content changed elements. The range 
		 *			   used is [<i>first</i>, <i>last</i>), which contains all the elements between <i>first</i> and 
		 *			   <i>last</i>, including the element pointed by <i>first</i> but not the element pointed by 
		 *			   <i>last</i>.
		 */
		refresh(first: std.Iterator<T>, last: std.Iterator<T>): void;

		/* ---------------------------------------------------------
			ADD
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		addEventListener(type: string, listener: EventListener): void;
		addEventListener(type: "insert", listener: CollectionEventListener<T>): void;
		addEventListener(type: "erase", listener: CollectionEventListener<T>): void;
		addEventListener(type: "refresh", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		addEventListener(type: string, listener: EventListener, thisArg: Object): void;
		addEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
		addEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
		addEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;

		/* ---------------------------------------------------------
			REMOVE
		--------------------------------------------------------- */
		/**
		 * @inheritdoc
		 */
		removeEventListener(type: string, listener: EventListener): void;
		removeEventListener(type: "insert", listener: CollectionEventListener<T>): void;
		removeEventListener(type: "erase", listener: CollectionEventListener<T>): void;
		removeEventListener(type: "refresh", listener: CollectionEventListener<T>): void;

		/**
		 * @inheritdoc
		 */
		removeEventListener(type: string, listener: EventListener, thisArg: Object): void;
		removeEventListener(type: "insert", listener: CollectionEventListener<T>, thisArg: Object): void;
		removeEventListener(type: "erase", listener: CollectionEventListener<T>, thisArg: Object): void;
		removeEventListener(type: "refresh", listener: CollectionEventListener<T>, thisArg: Object): void;
	}
}