/// <reference path="../../API.ts" />

namespace samchon.library
{
	/**
	 * @hidden
	 */
	export class _CGForOfAdaptor implements IterableIterator<Array<number>>
	{
		private generator_: ICaseGenerator;
		private index_: number;

		public constructor(generator: ICaseGenerator)
		{
			this.generator_ = generator;
			this.index_ = 0;
		}

		public next(): IteratorResult<Array<number>>
		{
			if (this.index_ == this.generator_.size())
				return {
					done: true,
					value: undefined
				};
			else
				return {
					done: false,
					value: this.generator_.at(this.index_++)
				};
		}

		public [Symbol.iterator](): IterableIterator<Array<number>>
		{
			return this;
		}
	}
}