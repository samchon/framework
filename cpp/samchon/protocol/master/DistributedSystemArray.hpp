#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/external/ExternalSystemArray.hpp>
#	include <samchon/protocol/master/DistributedSystem.hpp>

namespace samchon
{
namespace protocol
{
namespace master
{
	class DistributedSystemRole;

	class SAMCHON_FRAMEWORK_API DistributedSysmteArray
		: public external::ExternalSystemArray
	{
	private:
		typedef external::ExternalSystemArray super;

		HashMap<std::string, std::shared_ptr<DistributedSystemRole>> roles;

	public:
		DistributedSysmteArray();
		virtual ~DistributedSysmteArray();

	protected:
		virtual auto createRole(std::shared_ptr<library::XML>) -> DistributedSystemRole*;

	public:
		SHARED_ENTITY_DEQUE_ELEMENT_ACCESSOR_INLINE(DistributedSystem)

		auto hasRole(const std::string &key) const -> bool
		{
			return roles.has(key);
		};
		auto getRole(const std::string &key) const -> std::shared_ptr<DistributedSystemRole>
		{
			return roles.get(key);
		};
	};
};
};
};