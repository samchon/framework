#pragma once
#include <string>

namespace samchon
{
	namespace example
	{
		namespace packer
		{
			/**
			 * @brief A physical instance
			 *
			 * @details 
			 * <p> A physical instance having its own name, price, volume and weight. </p>
			 *
			 * <p> @image html cpp/example_packer.png
			 * @image latex cpp/example_packer.png </p>
			 *
			 * @author Jeongho Nam
			 */
			class Instance
			{
			protected:
				/**
				 * @brief Name represent the Instance
				 */
				std::string name;

				/**
				 * @brief Price of an instance -> 1,000 won
				*/
				int price;

				/**
				 * @brief Volume of an instance -> 130 cm^3
				 */
				int volume;

				/**
				 * @brief Weight of an instance -> 1,200 g
				 */
				int weight;

			public:
				/* ---------------------------------------------------------
					CONSTRUCTORS
				--------------------------------------------------------- */
				/**
				 * @brief Construct from instance
				 *
				 * @param name Name of the instance
				 * @param price Price of the instance
				 * @param volume Volume of the instance
				 * @param weight Weight of the instance
				 */
				Instance(const std::string &name, int price, int volume, int weight);
				virtual ~Instance() = default;

				/* ---------------------------------------------------------
					GETTERS
				--------------------------------------------------------- */
				/**
				 * @brief Get name
				 */
				auto getName() const -> std::string;

				/**
				 * @brief Get price
				 */
				auto getPrice() const -> int;

				/**
				 * @brief Get volume
				 */
				auto getVolume() const -> int;

				/**
				 * @brief Get weight
				 */
				auto getWeight() const -> int;

				/* ---------------------------------------------------------
					EXPORT
				--------------------------------------------------------- */
				/**
				 * @brief Return a string represents the Instance
				 */
				virtual auto toString() const -> std::string;
			};
		};
	};
};