#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/parallel/ParallelSystemArray.hpp>
#	include <samchon/protocol/distributed/DistributedSystem.hpp>
#	include <samchon/protocol/distributed/DistributedSystemRole.hpp>

namespace samchon
{
namespace protocol
{
namespace distributed
{
	class SAMCHON_FRAMEWORK_API DistributedSystemArray
		: public virtual parallel::ParallelSystemArray
	{
	private:
		typedef parallel::ParallelSystemArray super;

		HashMap<std::string, std::shared_ptr<DistributedSystemRole>> role_map_;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		DistributedSystemArray();
		virtual ~DistributedSystemArray();

		virtual void construct(std::shared_ptr<library::XML>) override;

	protected:
		virtual auto createRole(std::shared_ptr<library::XML>) -> DistributedSystemRole* = 0;

	public:
		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		SHARED_ENTITY_DEQUE_ELEMENT_ACCESSOR_INLINE(DistributedSystem)

		auto getRoleMap() const -> const HashMap<std::string, std::shared_ptr<DistributedSystemRole>>&
		{
			return role_map_;
		};

		auto hasRole(const std::string &name) const -> bool
		{
			return role_map_.has(name);
		};
		auto getRole(const std::string &name) const -> std::shared_ptr<DistributedSystemRole>
		{
			return role_map_.get(name);
		};

		void insertRole(std::shared_ptr<DistributedSystemRole> role)
		{
			role_map_.emplace(role->getName(), role);
		};
		void eraseRole(const std::string &name)
		{
			role_map_.erase(name);
		};

		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		virtual auto toXML() const -> std::shared_ptr<library::XML> override;
	};
};
};
};