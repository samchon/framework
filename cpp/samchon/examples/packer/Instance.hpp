#pragma once
#include <string>

#include <samchon/protocol/Entity.hpp>

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
				: public virtual protocol::Entity
			{
			private:
				typedef protocol::Entity super;

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
				 * @brief Default Constructor.
				 */
				Instance();

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

				virtual void construct(std::shared_ptr<library::XML>) override;

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
				virtual auto toXML() const -> std::shared_ptr<library::XML> override;

				/**
				 * @brief Return a string represents the Instance
				 */
				virtual auto toString() const -> std::string;
			};
		};
	};
};