#pragma once
#include <samchon/example/packer/ProductArray.hpp>
#include <samchon/example/packer/Instance.hpp>

namespace samchon
{
	namespace example
	{
		namespace packer
		{
			class Product;

			/**
			 * @brief A wrapper can contain products
			 *
			 * @details 
			 * <p> A wrapper containing products with its limitation of weight and volume. </p>
			 *
			 * <p> @image html cpp/example_packer.png
			 * @image latex cpp/example_packer.png </p>
			 *
			 * @author Jeongho Nam
			 */
			class Wrapper
				: public ProductArray,
				public Instance
			{
			private:
				typedef ProductArray super;

			public:
				/* ---------------------------------------------------------
					CONSTRUCTORS
				--------------------------------------------------------- */
				/**
				 * @brief Default Constructor
				 */
				Wrapper();

				/**
				 * @brief Construct from argument of a wrapper
				 *
				 * @param name Category name of a wrapper, can be identified
				 * @param price Price of a wrapper
				 * @param volume Limited volume of a wrapper can put in.
				 * @param weight Limited weight of a wrapper can put in.
				 */
				Wrapper(const std::string &name, int price, int volume, int weight);

				/**
				 * @brief Copy Constructor
				 * @details Copy constructor of wrapper does not copy children items. Only copies arguments of Instance's.
				 */
				Wrapper(const Wrapper &wrapper);
				virtual ~Wrapper() = default;
				
				virtual void construct(std::shared_ptr<library::XML>) override;

			public:
				/**
				 * @brief Try to insert a product into the wrapper.
				 *
				 * @details
				 * If the Wrapper has enough volume and limit of weight, inserts the Product into the Wrapper and 
				 * returns <i>true</i>. If not enough, does not insert and just return <i>false</i>.
				 * 
				 * @param product A product try to insert in.
				 * @return Whether to success put in
				 */
				auto tryInsert(std::shared_ptr<Product>) -> bool;

				/* ---------------------------------------------------------
					EXPORTERS
				--------------------------------------------------------- */
				virtual auto TAG() const -> std::string override;

				virtual auto toXML() const -> std::shared_ptr<library::XML> override;

				/**
				 * @brief Return a string represent the wrapper.
				 * @details Returns a string of the Wrapper and Product(s) packaged in.
				 *
				 * @return A string represents the Wrapper and contained Product(s).
				 */
				virtual auto toString() const -> std::string override;
			};
		};
	};
};