#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/Entity.hpp>

#include <samchon/library/Datetime.hpp>

namespace samchon
{
	namespace protocol
	{
		class Invoke;

		class SAMCHON_FRAMEWORK_API InvokeHistory
			: public virtual Entity
		{
		protected:
			typedef Entity super;

			virtual auto TAG() const -> std::string override;

			std::string listener;
			library::Datetime datetime;
			library::Datetime elapsedTime;

		public:
			/* -----------------------------------------------------------------
				CONSTRUCTORS
			----------------------------------------------------------------- */
			InvokeHistory();
			InvokeHistory(const std::string &);
			virtual ~InvokeHistory() = default;

			virtual void construct(std::shared_ptr<library::XML>) override;
			void notifyFinish();

			/* -----------------------------------------------------------------
				GETTERS
			----------------------------------------------------------------- */
			auto getListener() const -> std::string;
			auto getStartTime() const -> library::Datetime;
			auto getEndTime() const -> library::Datetime;

			auto getElapsedTime() const -> double;
			
			/* -----------------------------------------------------------------
				EXPORTERS
			----------------------------------------------------------------- */
			virtual auto toXML() const -> std::shared_ptr<library::XML> override;
			auto toInvoke() const -> std::shared_ptr<Invoke>;
		};
	};
};