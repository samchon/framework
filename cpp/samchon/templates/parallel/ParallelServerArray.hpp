#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/parallel/ParallelSystemArray.hpp>
#include <samchon/templates/external/ExternalServerArray.hpp>

namespace samchon
{
namespace templates
{
namespace parallel
{
	/**
	 * Master of Parallel Processing System, a client connecting to slave servers.
	 * 
	 * The {@link ParallelServerArray} is an abstract class, derived from the {@link ParallelSystemArray} class, 
	 * connecting to {@link IParallelServer parallel servers}.
	 * 
	 * Extends this {@link ParallelServerArray} and overrides {@link createChild createChild()} method creating child 
	 * {@link IParallelServer} object. After the extending and overriding, construct children {@link IParallelServer}
	 * objects and call the {@link connect connect()} method.
	 * 
	 * #### [Inherited] {@link ParallelSystemArray}
	 * @copydetails parallel::ParallelSystemArray
	 */
	class ParallelServerArray
		: public ParallelSystemArray,
		public external::ExternalServerArray
	{
	public:
		/**
		 * Default Constructor.
		 */
		ParallelServerArray()
			: ParallelSystemArray(),
			external::ExternalServerArray()
		{
		};
		virtual ~ParallelServerArray() = default;
	};
};
};
};