#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/parallel/ParallelSystemArrayMediator.hpp>
#include <samchon/templates/external/ExternalClientArray.hpp>

namespace samchon
{
namespace templates
{
namespace parallel
{
	/**
	 * Mediator of Parallel Processing System, a server accepting slave clients.
	 * 
	 * The {@link ParallelClientArrayMediator} is an abstract class, derived from the {@link ParallelSystemArrayMediator} 
	 * class, opening a server accepting {@link ParallelSystem parallel clients} as a **master**.
	 *
	 * Extends this {@link ParallelClientArrayMediator} and overrides below methods creating child {@link ParallelSystem}
	 * object. After the overridings, open server with {@link open open()} method and connect to 
	 * {@link IParallelServer parallel servers} through the {@link connect connect()} method. If you want this server to 
	 * follow web-socket protocol, then overrides {@link WebServer} virtually.
	 * 
	 * #### [Inherited] {@link ParallelSystemArrayMediator}
	 * @copydetails parallel::ParallelSystemArrayMediator
	 */
	class ParallelClientArrayMediator
		: public ParallelSystemArrayMediator,
		public external::ExternalClientArray
	{
	public:
		/**
		 * Default Constructor.
		 */
		ParallelClientArrayMediator()
			: ParallelSystemArrayMediator(),
			external::ExternalClientArray()
		{
		};
		virtual ~ParallelClientArrayMediator() = default;
	};
};
};
};