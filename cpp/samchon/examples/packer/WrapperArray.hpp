#pragma once
#include <vector>
#include <memory>

namespace samchon
{
	namespace example
	{
		namespace packer
		{
			class Wrapper;
			class Product;

			/**
			 * @brief An array of wrapper with same category (name).
			 *
			 * @details
			 * <p> WrapperArray reserves Product(s) and generates enough number of Wrapper(s). </p>
			 * <p> WrapperArray will retrieve the best arrange and packaging method for reserved Product(s). </p> 
			 *
			 * @author Jeongho Nam
			 */
			class WrapperArray
				: private std::vector<std::shared_ptr<Wrapper>>
			{
			private:
				typedef std::vector<std::shared_ptr<Wrapper>> super;

				/**
				 * @brief A list for reserved Product(s).
				 */
				std::vector<Product*> reserved;

				/**
				 * @brief A sample wrapper used to copy
				 */
				Wrapper *sample;

			public:
				/* ---------------------------------------------------------
					CONSTRUCTORS
				--------------------------------------------------------- */
				/**
				 * @brief Construct from a sample wrapper.
				 *
				 * @param sample A sample wrapper used to copy wrappers.
				 */
				WrapperArray(Wrapper *);

				/**
				 * @brief Try to insert a product into reserved list.
				 *
				 * @details 
				 * If the Product's volume and weight is equal or less than the Wrapper categorized so that enable to
				 * insert in a Wrapper, reserve the Product and returns <i>true</i>. If not, does not reserve and just
				 * return <i>false</i>.
				 *
				 * @return Whether the Product's volume and weight is equal or less than the Wrapper.
				 */
				auto tryInsert(Product*) -> bool;

				/* ---------------------------------------------------------
					CALCULATE AND OPTIMIZE
				--------------------------------------------------------- */
				/**
				 * @brief Optimize to retrieve the best solution.
				 *
				 * @details
				 * <p> Retrieve the best solution of packaging in level of WrapperArray. </p>
				 * <p> Shuffles sequence of reserved Product(s) by samchon::library::FactorialGenerator and insert the reserved
				 * Products(s) following the sequence creating Wrapper(s) as needed. Between the sequences from FactorialGenerator,
				 * retrieve and determine the best solution. </p>
				 *
				 * @note 
				 * <p> Sequence of inserting Product can affeact to numbers of Wrapper(s) to be used. </p>
				 * <p> It's the reason why even WrapperArray has the optimize() method. </p>
				 *
				 * @see samchon::library::FactorialGenerator
				 */
				void optimize();

				/**
				 * @brief Calculate price of the Wrapper(s)
				 * @details Calculate price of all wrapppers'. The price does not contain inserted products'
				 */
				auto calcPrice() const -> int;

				/* ---------------------------------------------------------
					EXPORT
				--------------------------------------------------------- */
				/**
				 * @brief Return a string represents Wrapper(s) of same type
				 */
				auto toString() const -> std::string;
			};
		};
	};
};