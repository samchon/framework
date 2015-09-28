#pragma once
#include <vector>
#include <memory>
#include <string>

namespace samchon
{
	namespace example
	{
		namespace packer
		{
			class WrapperArray;
			class Wrapper;
			class Product;

			/**
			 * @brief A packer planning the best packaging.
			 *
			 * @details
			 * <p> Retrieves the solution of packaging by combination permuation and factorial case. </p>
			 *
			 * <p> @image html cpp/example_packer.png
			 * @image latex cpp/example_packer.png </p>
			 *
			 * @warning 
			 * <p> Be careful about number of products and wrappers. </p> 
			 * <p> The time complexity of Packer overs O(m^n). Elapsed time of calculation increases enourmously. 
			 * Do not use Packer if the digits of number of products or wrappers overs 2. </p>
			 *
			 * @author Jeongho Nam
			 */
			class Packer
				: public std::vector<std::shared_ptr<WrapperArray>>
			{
			private:
				typedef std::vector<std::shared_ptr<WrapperArray>> super;

				/**
				 * @brief Prodcut(s) to package in some Wrapper(s)
				 */
				std::vector<Product> *productArray;

				/**
				 * @brief Type of Wrapper(s) to be used for packaging.
				 */
				std::vector<Wrapper> *wrapperArray;

			public:
				/* ---------------------------------------------------------
					CONSTRUCTORS
				--------------------------------------------------------- */
				/**
				 * @brief Construct from products and wrapper
				 *
				 * @param productArray Product(s) to input some Wrapper
				 * @param wrapperArray Type of Wrapper(s) to be used
				 */
				Packer(std::vector<Product> *, std::vector<Wrapper> *);
				
				/**
				 * @brief Copy Constructor
				 *
				 * @details 
				 * <p> Copy constructor of Packer does not copy children items. </p> 
				 * <p> Only copies member variables(productArray, wrapperArray) of Packer's. </p>
				 */
				Packer(const Packer &);

				/* ---------------------------------------------------------
					CALCULATE AND OPTIMIZE
				--------------------------------------------------------- */
				/**
				 * @brief Find the best packaging method.
				 */
				void optimize();

				/**
				 * @brief Calculate price of the wrappers.
				 */
				auto calcPrice() const -> int;

				/* ---------------------------------------------------------
					EXPORT
				--------------------------------------------------------- */
				/**
				 * @brief Return a string represents an packaging method.
				 */
				auto toString() const -> std::string;
			};
		};
	};
};