#pragma once
#include "Instance.hpp"

namespace samchon
{
	namespace example
	{
		namespace packer
		{
			/**
			 * @brief A product, merchandise
			 *
			 * @details 
			 * <p> A merchandise with its price, volume and weight. </p>
			 *
			 * <p> @image html cpp/example_packer.png
			 * @image latex cpp/example_packer.png </p>
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
				 * @brief Defualt Constructor
				 */
				Product();

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
				virtual auto TAG() const -> std::string override;

				/**
				* @brief Return a string represents the Instance
				*/
				virtual auto toString() const -> std::string override;
			};
		};
	};
};