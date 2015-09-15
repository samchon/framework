#pragma once
#include <samchon/protocol/Entity.hpp>

namespace samchon
{
	namespace namtree
	{
		/**
		 * @brief Interface for exploration
		 */
		class  INTExplore
			: public virtual protocol::Entity
		{
		private:
			typedef protocol::Entity super;

		protected:
			/**
			 * @brief Minimum value
			 */
			double minimum;

			/**
			 * @brief Maximum value 
			 */
			double maximum;

			/**
			 * @brief Section number of exploration
			 */
			unsigned int section;

			/**
			 * @brief Target precision: 10<sup>precision</sup>
			 */
			int precision;

		public:
			/**
			 * @brief Default Constructor
			 */
			INTExplore();
			virtual ~INTExplore() = default;

			virtual void construct(std::shared_ptr<library::XML>);

			/**
			 * @brief Get minimum
			 */
			auto getMinimum() const -> double;

			/**
			 * @brief Get maximum
			 */
			auto getMaximum() const -> double;

			/**
			 * @brief Get section
			 */
			auto getSection() const -> unsigned int;

			/**
			 * @brief Get precision
			 */
			auto getPrecision() const -> int;

			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};