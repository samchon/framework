#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ExternalSystemArray.hpp>

namespace samchon
{
	class ExternalServer;

	namespace protocol
	{
		class SAMCHON_FRAMEWORK_API ExternalServerArray
			: public virtual ExternalSystemArray
		{
		protected:
			typedef ExternalSystemArray super;

		public:
			/* ------------------------------------------------------------------
				CONSTRUCTORS
			------------------------------------------------------------------ */
			ExternalServerArray();
			virtual ~ExternalServerArray() = default;

			virtual void start() override;
		};
	};
};