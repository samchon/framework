#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/InvokeHistory.hpp>

namespace samchon
{
	namespace protocol
	{
		/**
		 * @brief A reported history of an Invoke message
		 *
		 * @details
		 * \par [Inherited]
		 *		@copydetails protocol::InvokeHistory
		 */
		class SAMCHON_FRAMEWORK_API PRInvokeHistory
			: public InvokeHistory
		{
		protected:
			typedef InvokeHistory super;

			/**
			 * @brief Start index
			 */
			size_t index;

			/**
			 * @brief The Size
			 */
			size_t size;

		public:
			/* --------------------------------------------------------------------
				CONSTRUCTORS
			-------------------------------------------------------------------- */
			/**
			 * @brief Default Constructor.
			 */
			PRInvokeHistory();

			/**
			 * @brief Construct from an Invoke message.
			 *
			 * @details
			 * <p> InvokeHistory does not archive entire Invoke message, only archives its listener. </p>
			 *
			 * @param invoke A message to archive its history log
			 */
			PRInvokeHistory(std::shared_ptr<Invoke>);

			virtual ~PRInvokeHistory() = default;

			virtual void construct(std::shared_ptr<library::XML>) override;

			/* --------------------------------------------------------------------
				GETTERS
			-------------------------------------------------------------------- */
			/**
			 * @brief Get index.
			 */
			auto getIndex() const -> size_t;

			/**
			 * @brief Get size.
			 */
			auto getSize() const -> size_t;

			auto calcAverageElapsedTime() const -> double;

			/* --------------------------------------------------------------------
				EXPORTER
			-------------------------------------------------------------------- */
			virtual auto toXML() const -> std::shared_ptr<library::XML> override;
		};
	};
};