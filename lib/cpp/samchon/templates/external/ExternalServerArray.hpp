#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/external/ExternalSystemArray.hpp>
#	include <samchon/templates/external/ExternalServer.hpp>

namespace samchon
{
namespace templates
{
namespace external
{
	/**
	 * An array and manager of {@link IExternalServer external servers}.
	 *
	 * The {@link ExternalServerArray} is an abstract class, derived from the {@link ExternalSystemArray} class,
	 * connecting to {@link IExternalServer external servers}.
	 *
	 * Extends this {@link ExternalServerArray} and overrides {@link createChild createChild()} method creating child
	 * {@link IExternalServer} object. After the extending and overriding, construct children {@link IExternalServer}
	 * objects and call the {@link connect connect()} method.
	 * 
	 * #### [Inherited] {@link ExternalSystemArray}
	 * @copydetails external::ExternalSystemArray
	 */
	class SAMCHON_FRAMEWORK_API ExternalServerArray
		: public virtual ExternalSystemArray
	{
	public:
		/**
		 * Default Constructor.
		 */
		ExternalServerArray();
		virtual ~ExternalServerArray();

		/**
		 * Connect to {@link ExternalServer external servers}.
		 * 
		 * This method calls children elements' method {@link ExternalServer.connect} gradually.
		 */
		virtual void connect();
	};
};
};
};