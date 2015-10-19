#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/ExternalSystemArray.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ParallelSystem;

			/**
			 * @brief An array of parallel system drivers.
			 *
			 * @details
			 * <p> ParallelSystemArray is an ExternalSystemArray and an abstract class containing. 
			 * and managing parallel system drvers within framework of master. The ParallelSystemArray
			 * class allocates segmented processes (Invoke message containing segmentation size) following
			 * by each system's performance index. </p>
			 *
			 * <p> Unlike DistributedSystemArray, ParallelSystemArray does not have such complicate relationships
			 * and logics. All segmentation sent by sendData(Invoke, size_t) requires uniform performance.
			 * ParallelSystemArray just calculates each system's performance index by elapsing time such easily. </p>
			 *
			 * <p> Of course, DistributedSystemArray determines which size of segmentation allocation will be
			 * suitable for each system by the performance index </p>.
			 *
			 * <p> Each segmentation in requested process (Invoke message) is equivalent. Thus, role of
			 * ParallelSystem objects in a ParallelSystemArray are almost same and does not need to specify
			 * ExternalSystemRole on each ParallelSystem. </p>
			 *
			 *	\li Not a matter to specifying ExternalSystemRole objects to each ParallelSystem. In that
			 *		case, Invoke messages having segmentation size will be processed by ParallelSystemArray's 
			 *		own logic and Invoke messages without segmentation size will be handled by ordinary 
			 *		logic of ExternalSystemArray's own.
			 *
			 * <p> @image html  cpp/protocol_master_parallel_system.png
			 *	   @image latex cpp/protocol_master_parallel_system.png </p>
			 * 
			 * \par [Inherited]
			 *		@copydetails protocol::ExternalSystemArray 
			 */
			class SAMCHON_FRAMEWORK_API ParallelSystemArray
				: public virtual ExternalSystemArray
			{
			protected:
				typedef ExternalSystemArray super;

			public:
				/* ------------------------------------------------------------------
					CONSTRUCTORS
				------------------------------------------------------------------ */
				/**
				 * @brief Default Constructor.
				 */
				ParallelSystemArray();
				virtual ~ParallelSystemArray() = default;

				/* ------------------------------------------------------------------
					GETTERS
				------------------------------------------------------------------ */
				SHARED_ENTITY_ARRAY_ELEMENT_ACCESSOR_HEADER(ParallelSystem)

				/* ------------------------------------------------------------------
					CHAIN OF INVOKE MESSAGE
				------------------------------------------------------------------ */
				using super::sendData;

				/**
				 * @brief Send a message with segmentation size.
				 *
				 * @param invoke An invoke message requesting a process.
				 * @param size Size of segmentation.
				 */
				virtual void sendData(std::shared_ptr<Invoke>, size_t);
			};
		};
	};
};