#pragma once
#include <samchon/protocol/SharedEntityArray.hpp>
#include <samchon/examples/packer/Wrapper.hpp>

namespace samchon
{
	namespace example
	{
		namespace packer
		{
			/**
			 * @brief An array of wrapper with same category (name).
			 *
			 * @details
			 * <p> WrapperArray reserves Product(s) and generates enough number of Wrapper(s). </p>
			 * <p> WrapperArray will retrieve the best arrange and packaging method for reserved Product(s). </p> 
			 *
			 * <p> @image html cpp/example_packer.png
			 * @image latex cpp/example_packer.png </p>
			 *
			 * @author Jeongho Nam
			 */
			class WrapperArray
				: public protocol::SharedEntityArray<Wrapper>
			{
			private:
				typedef protocol::SharedEntityArray<Wrapper> super;

				/**
				 * @brief A list for reserved Product(s).
				 */
				std::shared_ptr<ProductArray> reserved;

				/**
				 * @brief A sample wrapper used to copy
				 */
				std::shared_ptr<Wrapper> sample;

			public:
				/* ---------------------------------------------------------
					CONSTRUCTORS
				--------------------------------------------------------- */
				/**
				 * @brief Default Constructor
				 */
				WrapperArray();

				/**
				 * @brief Construct from arguments of sample.
				 * 
				 * @param name Category name of a wrapper, can be identified
				 * @param price Price of a wrapper
				 * @param volume Limited volume of a wrapper can put in.
				 * @param weight Limited weight of a wrapper can put in.
				 */
				WrapperArray(const std::string &name, int price, int volume, int weight);

				/**
				* @brief Copy Constructor
				*
				* @details 
				* <p> Copy constructor of WrapperArray does not copy children items. </p> 
				* <p> Only copies sample. </p>
				*/
				WrapperArray(const WrapperArray &);

				virtual ~WrapperArray() = default;

				virtual void construct(std::shared_ptr<library::XML>) override;

			protected:
				virtual auto createChild(std::shared_ptr<library::XML>) -> Wrapper* override;

			public:
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
				auto tryInsert(std::shared_ptr<Product>) -> bool;

				/* ---------------------------------------------------------
					OPERATORS
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
				 * @details Calculates price of all wrapppers'. The price does not contain inserted products'
				 */
				auto calcPrice() const -> int;

				/* ---------------------------------------------------------
					EXPORT
				--------------------------------------------------------- */
				virtual auto TAG() const -> std::string override;
				virtual auto CHILD_TAG() const -> std::string override;

				virtual auto toXML() const -> std::shared_ptr<library::XML> override;

				/**
				 * @brief Return a string represents Wrapper(s) of same type
				 */
				auto toString() const -> std::string;
			};
		};
	};
};