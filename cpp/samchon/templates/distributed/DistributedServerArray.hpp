#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/distributed/DistributedSystemArray.hpp>
#include <samchon/templates/external/ExternalServerArray.hpp>

namespace samchon
{
namespace templates
{
namespace distributed
{
	/**
	 * Master of Distributed Processing System, a client connecting to slave servers.
	 *
	 * The {@link DistributedServerArray} is an abstract class, derived from the {@link DistributedSystemArray} class,
	 * connecting to {@link IDistributedServer distributed servers}.
	 *
	 * Extends this {@link DistributedServerArray} and overrides {@link createChild createChild()} method creating child
	 * {@link IDistributedServer} object. After the extending and overriding, construct children {@link IDistributedServer}
	 * objects and call the {@link connect connect()} method.
	 * 
	 * #### [Inherited] {@link DistributedSystemArray}
	 * @copydetails distributed::DistributedSystemArray
	 */
	class DistributedServerArray
		: public DistributedSystemArray,
		public external::ExternalServerArray
	{
	public:
		/**
		 * Default Constructor.
		 */
		DistributedServerArray()
			: DistributedSystemArray(),
			external::ExternalServerArray()
		{
		};
		virtual ~DistributedServerArray() = default;
	};
};
};
};