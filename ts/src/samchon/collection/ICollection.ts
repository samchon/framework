/// <reference path="../API.ts" />

namespace samchon.collection
{
	/**
	 * An interface for {@link IContainer containers} who can detect element I/O events.
	 * 
	 * @author Jeongho Nam <http://samchon.org>
	 */
	export interface ICollection<T>
		extends std.base.IContainer<T>, library.IEventDispatcher
	{
		refresh(): void;
	}
}