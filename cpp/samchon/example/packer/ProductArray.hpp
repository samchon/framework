#pragma once
#include <samchon/example/packer/Product.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>

namespace samchon
{
	namespace example
	{
		namespace packer
		{
			/**
			* @brief An array of Product objects.
			*
			* @author Jeongho Nam
			*/
			class ProductArray
				: public protocol::SharedEntityArray<Product>
			{
			private:
				typedef protocol::SharedEntityArray<Product> super;

			public:
				/* ---------------------------------------------------------
					CONSTRUCTORS
				--------------------------------------------------------- */
				using super::super;
				virtual ~ProductArray() = default;

			protected:
				virtual auto createChild(std::shared_ptr<library::XML>) -> Product* override
				{
					return new Product();
				};

			public:
				/* ---------------------------------------------------------
					EXPORTERS
				--------------------------------------------------------- */
				virtual auto TAG() const -> std::string override
				{
					return "productArray";
				};
				virtual auto CHILD_TAG() const -> std::string override
				{
					return "product";
				};
			};
		};
	};
};