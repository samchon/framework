#pragma once
#include <samchon/API.hpp>

#include <samchon/protocol/master/ParallelSystemArray.hpp>

namespace samchon
{
	namespace protocol
	{
		namespace master
		{
			class ParallelSlaveSystemMediator;

			/**
			 * @brief A mediator of parallel system between master and slaves.
			 *
			 * @details
			 * <p> ParallelSystemArrayMediator class is used to realizing a mediator system of 
			 * tree-structured parallel processing system. ParallelSystemArrayMediator intermediates 
			 * between origin-master(ParallelSystemArray) and its slaves(slave::ParallelSystem). </p>
			 *
			 * <p> ParallelSystemArrayMediator is a master(ParallelSystemArray) within the framework 
			 * of slaves systems (slave::ParallelSystem objects) and also can be a slave system 
			 * (slave::ParallelSystem) within framework of its master(ParallelSystemArray) by having
			 * ParallelSlaveSystemMediator. </p>
			 *
			 * <p> @image html  conception/distributed_system_array_mediator.png
			 * 	   @image latex conception/distributed_system_array_mediator.png </p>
			 *
			 * \par [Inherited]
			 *		@copydetails master::ParallelSystemArray
			 */
			class SAMCHON_FRAMEWORK_API ParallelSystemArrayMediator
				: public virtual ParallelSystemArray
			{
			protected:
				typedef ParallelSystemArray super;

				/**
				* @brief A slave system for mediation.
				*/
				ParallelSlaveSystemMediator *slave;

			public:
				/* ------------------------------------------------------------------
				CONSTRUCTORS
				------------------------------------------------------------------ */
				/**
				 * @brief Default Constructor.
				 */
				ParallelSystemArrayMediator();
				virtual ~ParallelSystemArrayMediator();

				virtual void construct(std::shared_ptr<library::XML>) override;

			protected:
				/**
				 * @brief Factory method of slave system for mediation.
				 *
				 * @throw invalid_parameter If ParallelServerArrayMediator, slave must be a type of 
				 *							ParallelSlaveServerMediator
				 */
				virtual auto createSlave() const -> ParallelSlaveSystemMediator* = 0;

				/* ------------------------------------------------------------------
				PROCESS
				------------------------------------------------------------------ */
			public:
				virtual void start() override;

				virtual auto toXML() const -> std::shared_ptr<library::XML> override;
			};
		};
	};
};