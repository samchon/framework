#pragma once
#include "Instance.hpp"

namespace samchon
{
	namespace examples
	{
		namespace packer
		{
			/**
			 * @brief A product, merchandise
			 * @details A merchandise with its price, volume and weight
			 *
			 * @author Jeongho Nam
			 */
			class Product
				: public Instance
			{
			private:
				typedef Instance super;

			public:
				/* ---------------------------------------------------------
					CONSTRUCTOR
				--------------------------------------------------------- */
				/**
				 * @brief Construct from arguments
				 *
				 * @param name Name of a product can be an identifier
				 * @param price Price of the product
				 * @param volume Volume of the product
				 * @param weight Weight of the product
				 */
				Product(const std::string &name, int price, int volume, int weight);
				virtual ~Product() = default;

				/* ---------------------------------------------------------
					EXPORT
				--------------------------------------------------------- */
				/**
				* @brief Return a string represents the Instance
				*/
				virtual auto toString() const -> std::string override;
			};
		};
	};
};