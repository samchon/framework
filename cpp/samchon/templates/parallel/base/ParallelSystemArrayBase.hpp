#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/external/base/ExternalSystemArrayBase.hpp>
#include <samchon/templates/parallel/base/ParallelSystemBase.hpp>

#include <thread>

namespace samchon
{
namespace templates
{
namespace parallel
{
namespace base
{
	class ParallelSystemArrayBase
	{
	private:
		size_t history_sequence;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		ParallelSystemArrayBase()
		{
			history_sequence = 0;
		};
		virtual ~ParallelSystemArrayBase() = default;

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		auto _Get_history_sequence() const -> size_t
		{
			return history_sequence;
		};
		auto _Fetch_history_sequence() -> size_t
		{
			++history_sequence;
		};

		void _Set_history_sequence(size_t val)
		{
			history_sequence = val;
		};

	public:
		/* =========================================================
			INVOKE MESSAGE CHAIN
				- SEND DATA
				- PERFORMANCE ESTIMATION
		============================================================
			SEND & REPLY DATA
		--------------------------------------------------------- */
		/**
		 * Send an {@link Invoke} message with segment size.
		 * 
		 * Sends an {@link Invoke} message requesting a **parallel process** with its *segment size*. The {@link Invoke}
		 * message will be delivered to children {@link ParallelSystem} objects with the *piece size*, which is divided
		 * from the *segment size*, basis on their {@link ParallelSystem.getPerformance performance indices}.
		 * 
		 * - If segment size is 100,
		 * - The segment will be allocated such below:
		 * 
		 * Name    | Performance index | Number of pieces to be allocated | Formula
		 * --------|-------------------|----------------------------------|--------------
		 * Snail   |                 1 |                               10 | 100 / 10 * 1
		 * Cheetah |                 4 |                               40 | 100 / 10 * 4
		 * Rabbit  |                 3 |                               30 | 100 / 10 * 3
		 * Turtle  |                 2 |                               20 | 100 / 10 * 2
		 * 
		 * When the **parallel process** has completed, then this {@link ParallelSystemArraY} will estimate 
		 * {@link ParallelSystem.getPerformance performance indices} of {@link ParallelSystem} objects basis on their 
		 * execution time.
		 * 
		 * @param invoke An {@link Invoke} message requesting parallel process.
		 * @param size Number of pieces to segment.
		 * 
		 * @see {@link sendPieceData}, {@link ParallelSystem.getPerformacen}
		 */
		auto sendSegmentData(std::shared_ptr<protocol::Invoke> invoke, size_t size) -> size_t
		{
			return sendPieceData(invoke, 0, size);
		};

		/**
		 * Send an {@link Invoke} message with range of pieces.
		 * 
		 * Sends an {@link Invoke} message requesting a **parallel process** with its *range of pieces [first, last)*. 
		 * The {@link Invoke} will be delivered to children {@link ParallelSystem} objects with the newly computed 
		 * *range of sub-pieces*, which is divided from the *range of pieces (first to last)*, basis on their
		 * {@link ParallelSystem.getPerformance performance indices}.
		 * 
		 * - If indices of pieces are 0 to 50,
		 * - The sub-pieces will be allocated such below:
		 * 
		 * Name    | Performance index | Range of sub-pieces to be allocated | Formula
		 * --------|-------------------|-------------------------------------|------------------------
		 * Snail   |                 1 |                            ( 0,  5] | (50 - 0) / 10 * 1
		 * Cheetah |                 4 |                            ( 5, 25] | (50 - 0) / 10 * 4 + 5
		 * Rabbit  |                 3 |                            (25, 40] | (50 - 0) / 10 * 3 + 25
		 * Turtle  |                 2 |                            (40, 50] | (50 - 0) / 10 * 2 + 40
		 * 
		 * When the **parallel process** has completed, then this {@link ParallelSystemArraY} will estimate
		 * {@link ParallelSystem.getPerformance performance indices} of {@link ParallelSystem} objects basis on their
		 * execution time.
		 * 
		 * @param invoke An {@link Invoke} message requesting parallel process.
		 * @param first Initial piece's index in a section.
		 * @param last Final piece's index in a section. The range used is [*first*, *last*), which contains 
		 *			   all the pieces' indices between *first* and *last*, including the piece pointed by index
		 *			   *first*, but not the piece pointed by the index *last*.
		 * 
		 * @see {@link sendSegmentData}, {@link ParallelSystem.getPerformacen}
		 */
		virtual auto sendPieceData(std::shared_ptr<protocol::Invoke> invoke, size_t first, size_t last) -> size_t
		{
			library::UniqueReadLock uk(((external::base::ExternalSystemArrayBase*)this)->getMutex());

			if (invoke->has("_History_uid") == false)
				invoke->emplace_back(new protocol::InvokeParameter("_History_uid", _Fetch_history_sequence()));
			else
			{
				// INVOKE MESSAGE ALREADY HAS ITS OWN UNIQUE ID
				//	- THIS IS A TYPE OF ParallelSystemArrayMediator. THE MESSAGE HAS COME FROM ITS MASTER
				//	- A ParallelSystem HAS DISCONNECTED. THE SYSTEM SHIFTED ITS CHAIN TO OTHER SLAVES.
				size_t uid = invoke->get("_History_uid")->getValue<size_t>();

				// FOR CASE 1. UPDATE HISTORY_SEQUENCE TO MAXIMUM
				if (uid > _Get_history_sequence())
					_Set_history_sequence(uid);
			}

			// TOTAL NUMBER OF PIECES TO DIVIDE
			auto children = ((external::base::ExternalSystemArrayBase*)this)->_Get_children();
			size_t segment_size = last - first;

			// SYSTEMS TO BE GET DIVIDED PROCESSES AND
			std::vector<base::ParallelSystemBase*> system_array;
			std::vector<std::thread> threads;
			
			system_array.reserve(children.size());
			threads.reserve(children.size());
			
			// POP EXCLUDEDS
			for (size_t i = 0; i < children.size(); i++)
			{
				auto system = (base::ParallelSystemBase*)(children.at(i).get());
				
				if (system->excluded_ == false)
					system_array.push_back(system);
			}

			// ORDERS
			for (size_t i = 0; i < system_array.size(); i++)
			{
				auto &system = system_array[i];
				
				// COMPUTE FIRST AND LAST INDEX TO ALLOCATE
				size_t piece_size = (i == system_array.size() - 1)
					? segment_size - first
					: (size_t)(segment_size / system_array.size() * system->performance_);
				if (piece_size == 0)
					continue;

				std::shared_ptr<protocol::Invoke> my_invoke(new protocol::Invoke(invoke->getListener()));
				{
					// DUPLICATE INVOKE AND ATTACH PIECE INFO
					my_invoke->assign(invoke->begin(), invoke->end());
					my_invoke->emplace_back(new protocol::InvokeParameter("_Piece_first", first));
					my_invoke->emplace_back(new protocol::InvokeParameter("_Piece_last", last));
				};

				// ENROLL THE SEND DATA INTO THREADS
				threads.emplace_back(&base::ParallelSystemBase::sendData, system, my_invoke);
				first += piece_size; // FOR THE NEXT STEP
			}

			// JOIN THREADS
			for (auto it = threads.begin(); it != threads.end(); it++)
				it->join();

			return threads.size();
		};

		/* ---------------------------------------------------------
			PERFORMANCE ESTIMATION - INTERNAL METHODS
		--------------------------------------------------------- */
		virtual auto _Complete_history(std::shared_ptr<InvokeHistory> history) -> bool
		{
			// WRONG TYPE
			if (std::dynamic_pointer_cast<PRInvokeHistory>(history) == nullptr)
				return false;

			auto children = ((external::base::ExternalSystemArrayBase*)this)->_Get_children();
			size_t uid = history->getUID();

			// ALL THE SUB-TASKS ARE DONE?
			for (size_t i = 0; i < children.size(); i++)
				if (((base::ParallelSystemBase*)(children.at(i).get()))->progress_list_.has(uid) == true)
					return false; // IT'S ON A PROCESS IN SOME SYSTEM.

			//--------
			// RE-CALCULATE PERFORMANCE INDEX
			//--------
			// CONSTRUCT BASIC DATA
			std::vector<std::pair<base::ParallelSystemBase*, double>> system_pairs;
			double performance_index_average = 0.0;

			system_pairs.reserve(children.size());

			for (size_t i = 0; i < children.size(); i++)
			{
				auto system = (base::ParallelSystemBase*)(children.at(i).get());
				if (system->history_list_.has(uid) == false)
					continue; // NO HISTORY (HAVE NOT PARTICIPATED IN THE PARALLEL PROCESS)

							  // COMPUTE PERFORMANCE INDEX BASIS ON EXECUTION TIME OF THIS PARALLEL PROCESS
				std::shared_ptr<PRInvokeHistory> my_history = std::dynamic_pointer_cast<PRInvokeHistory>(system->history_list_.get(uid));
				double performance_index = my_history->computeSize() / (double)my_history->computeElapsedTime();

				// PUSH TO SYSTEM PAIRS AND ADD TO AVERAGE
				system_pairs.emplace_back(system, performance_index);
				performance_index_average += performance_index;
			}
			performance_index_average /= system_pairs.size();

			// RE-CALCULATE PERFORMANCE INDEX
			for (size_t i = 0; i < system_pairs.size(); i++)
			{
				// SYSTEM AND NEW PERFORMANCE INDEX BASIS ON THE EXECUTION TIME
				auto system = system_pairs[i].first;
				if (system->enforced_ == true)
					continue; // PERFORMANCE INDEX IS ENFORCED. DOES NOT PERMIT REVALUATION

				double new_performance = system_pairs[i].second / performance_index_average;

				// DEDUCT RATIO TO REFLECT THE NEW PERFORMANCE INDEX
				double ordinary_ratio;
				if (system->history_list_.size() < 2)
					ordinary_ratio = .3;
				else
					ordinary_ratio = std::min(0.7, 1.0 / (system->history_list_.size() - 1.0));

				system->performance_ = ((system->performance_ * ordinary_ratio) + (new_performance * (1 - ordinary_ratio)));
			}

			// AT LAST, NORMALIZE PERFORMANCE INDEXES OF ALL SLAVE SYSTEMS
			_Normalize_performance();
			return true;
		};

	protected:
		virtual void _Normalize_performance()
		{
			auto children = ((external::base::ExternalSystemArrayBase*)this)->_Get_children();
			
			// COMPUTE AVERAGE
			double average = 0.0;
			size_t denominator = 0;

			for (size_t i = 0; i < children.size(); i++)
			{
				auto system = (base::ParallelSystemBase*)(children.at(i).get());
				if (system->enforced_ == true)
					continue; // PERFORMANCE INDEX IS ENFORCED. DOES NOT PERMIT REVALUATION

				average += system->performance_;
				denominator++;
			}
			average /= (double)denominator;

			// DIVIDE FROM THE AVERAGE
			for (size_t i = 0; i < children.size(); i++)
			{
				auto system = (base::ParallelSystemBase*)(children.at(i).get());
				if (system->enforced_ == true)
					continue; // PERFORMANCE INDEX IS ENFORCED. DOES NOT PERMIT REVALUATION

				system->performance_ = (system->performance_ / average);
			}
		};
	};
};
};
};
};