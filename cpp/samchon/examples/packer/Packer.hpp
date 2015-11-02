#pragma once
#include <samchon/protocol/SharedEntityArray.hpp>
#include <samchon/examples/packer/WrapperArray.hpp>

namespace samchon
{
	namespace example
	{
		namespace packer
		{
			/**
			 * @brief A packer planning the best packaging.
			 *
			 * <p> @image html cpp/example_packer.png
			 * @image latex cpp/example_packer.png </p>
			 *
			 * @details
			 * <p> Retrieves the solution of packaging by combination permuation and factorial case. </p>
			 *
			 * @warning 
			 * <p> Be careful about number of products and wrappers. </p> 
			 * <p> The time complexity of Packer overs O(m^n). Elapsed time of calculation increases enourmously. 
			 * Do not use Packer if the digits of number of products or wrappers overs 2. </p>
			 *
			 * @author Jeongho Nam
			 */
			class Packer
				: public protocol::SharedEntityArray<WrapperArray>
			{
			private:
				typedef protocol::SharedEntityArray<WrapperArray> super;

				/**
				 * @brief Prodcut(s) to package in some Wrapper(s)
				 */
				std::shared_ptr<ProductArray> productArray;

			public:
				/* ---------------------------------------------------------
					CONSTRUCTORS
				--------------------------------------------------------- */
				/**
				 * @brief Default Constructor
				 */
				Packer();

				/**
				 * @brief Construct from products and wrapper
				 *
				 * @param productArray Product(s) to input some Wrapper
				 * @param wrapperArray Type of Wrapper(s) to be used
				 */
				Packer(std::shared_ptr<ProductArray>);
				
				/**
				 * @brief Copy Constructor
				 *
				 * @details 
				 * <p> Copy constructor of Packer does not copy children items. </p> 
				 * <p> Only copies member variables(productArray, wrapperArray) of Packer's. </p>
				 */
				Packer(const Packer &);

				virtual void construct(std::shared_ptr<library::XML>) override;

			protected:
				virtual auto createChild(std::shared_ptr<library::XML>) -> WrapperArray* override;

				/* ---------------------------------------------------------
					OPERATORS
				--------------------------------------------------------- */
			public:
				/**
				 * @brief Find the best packaging method.
				 */
				void optimize(size_t = 0, size_t = -1);

				/**
				 * @brief Calculate price of the wrappers.
				 */
				auto calcPrice() const -> int;

				/* ---------------------------------------------------------
					EXPORT
				--------------------------------------------------------- */
				virtual auto TAG() const -> std::string override;
				virtual auto CHILD_TAG() const -> std::string override;

				virtual auto toXML() const -> std::shared_ptr<library::XML> override;

				/**
				 * @brief Return a string represents an packaging method.
				 */
				auto toString() const -> std::string;
			};
		};
	};
};