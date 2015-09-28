#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/SharedEntityArray.hpp>

namespace samchon
{
	namespace protocol
	{
		class ExternalSystem;
		class ExternalSystemRole;
		
		class SAMCHON_FRAMEWORK_API ExternalSystemArray
			: public virtual SharedEntityArray
		{
		protected:
			typedef SharedEntityArray super;

		public:
			/* ------------------------------------------------------------------
				CONSTRUCTORS
			------------------------------------------------------------------ */
			/**
			* @Default Constructor
			*/
			ExternalSystemArray();
			virtual ~ExternalSystemArray() = default;
			
			virtual void start() = 0;

			/* ------------------------------------------------------------------
				GETTERS
			------------------------------------------------------------------ */
			SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(ExternalSystem)
			auto hasRole(const std::string&) const -> bool;
			auto getRole(const std::string&) const -> std::shared_ptr<ExternalSystemRole>;

			/* ------------------------------------------------------------------
				XML TAG
			------------------------------------------------------------------ */
			virtual auto TAG() const -> std::string override;
			virtual auto CHILD_TAG() const -> std::string override;
		};
	};
};