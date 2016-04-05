/// <reference path="../../protocol/EntityArray.ts" />

namespace samchon.example.packer
{
	export class ProductArray
		extends protocol.EntityArray<Product>
	{
		/* ------------------------------------------------------------------
			CONSTRUCTORS
		------------------------------------------------------------------ */
		/**
		 * Default Constructor.
		 */
		public constructor()
		{
			super();
		}

		protected createChild(xml: library.XML): Product
		{
			return new Product();
		}

		/* ------------------------------------------------------------------
			EXPORTERS
		------------------------------------------------------------------ */
		public TAG(): string
		{
			return "productArray";
		}
		public CHILD_TAG(): string
		{
			return "product";
		}
	}
}