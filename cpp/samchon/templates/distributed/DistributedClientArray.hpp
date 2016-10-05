#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/distributed/DistributedSystemArray.hpp>
#include <samchon/templates/external/ExternalClientArray.hpp>

namespace samchon
{
namespace templates
{
namespace distributed
{
	/**
	 * Master of Distributed Processing System, a server accepting slave clients.
	 *
	 * The {@link DistributedClientArray} is an abstract class, derived from the {@link DistributedSystemArray} class, 
	 * opening a server accepting {@link DistributedSystem distributed clients}.
	 *
	 * Extends this {@link DistributedClientArray}, overrides {@link createExternalClient createExternalClient()} creating 
	 * child {@link DistributedSystem} object. After the extending and overridings, open this server using the 
	 * {@link open open()} method. If you want this server to follow web-socket protocol, then overrides {@link WebServer} 
	 * virtually.
	 *
	 * #### [Inherited] {@link DistributedSystemArray}
	 * @copydetails distributed::DistributedSystemArray
	 */
	class DistributedClientArray
		: public DistributedSystemArray,
		public external::ExternalClientArray
	{
	public:
		/**
		 * Default Constructor.
		 */
		DistributedClientArray()
			: DistributedSystemArray(),
			external::ExternalClientArray()
		{
		};
		virtual ~DistributedClientArray() = default;
	};
};
};
};