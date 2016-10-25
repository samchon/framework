#pragma once
#include <samchon/API.hpp>

#include <samchon/templates/distributed/base/IDistributedProcess.hpp>
#include <samchon/protocol/Entity.hpp>
#include <samchon/protocol/Invoke.hpp>

#include <samchon/templates/distributed/DistributedSystem.hpp>
#include <samchon/templates/distributed/DSInvokeHistory.hpp>
#include <samchon/templates/parallel/base/IParallelSystemArray.hpp>

#include <samchon/HashMap.hpp>

namespace samchon
{
namespace templates
{
namespace distributed
{
	class DistributedSystemArray;

	/**
	 * A role of Distributed Processing System.
	 * 
	 * The {@link DistributedProcess} is an abstract class who represents a **process**, *SOMETHING TO DISTRIBUTE* in a Distributed 
	 * Processing System. Overrides the {@link DistributedProcess} and defines the *SOMETHING TO DISTRIBUTE*.
	 * 
	 * Relationship between {@link DistributedSystem} and {@link DistributedProcess} objects are **M: N Associative**.
	 * Unlike {@link ExternalSystemRole}, the {@link DistributedProcess} objects are not belonged to a specific 
	 * {@link DistributedSystem} object. The {@link DistributedProcess} objects are belonged to the 
	 * {@link DistributedSystemArrayMediator} directly.
	 * 
	 * When you need the **distributed process**, then call {@link sendData sendData()}. The {@link sendData} will find
	 * the most idle {@link DistributedSystem slave system} considering not only number of processes on progress, but also
	 * {@link DistributedSystem.getPerformance performance index} of each {@link DistributedSystem} object and 
	 * {@link getResource resource index} of this {@link DistributedProcess} object. The {@link Invoke} message 
	 * requesting the **distributed process** will be sent to the most idle {@link DistributedSystem slave system}. 
	 * 
	 * Those {@link DistributedSystem.getPerformance performance index} and {@link getResource resource index} are 
	 * revaluated whenever the **distributed process** has completed basis on the execution time.
	 * 
	 * ![Class Diagram](http://samchon.github.io/framework/images/design/cpp_class_diagram/templates_distributed_system.png)
	 * 
	 * @handbook [Templates - Distributed System](https://github.com/samchon/framework/wiki/CPP-Templates-Distributed_System)
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class DistributedProcess
		: public virtual protocol::Entity<std::string>,
		public base::IDistributedProcess
	{
		friend class DistributedSystemArray;
		friend class DistributedSystem;

	private:
		typedef protocol::Entity<std::string> super;

		DistributedSystemArray *system_array_;
		HashMap<size_t, std::shared_ptr<DSInvokeHistory>> progress_list_;
		HashMap<size_t, std::shared_ptr<DSInvokeHistory>> history_list_;

		double resource;

		bool enforced_;

	protected:
		/**
		 * A name, represents and identifies this {@link DistributedProcess process}.
		 * 
		 * This {@link name} is an identifier represents this {@link DistributedProcess process}. This {@link name} is
		 * used in {@link DistributedSystemArray.getProcess} and {@link DistributedSystemArray.getProcess}, as a key elements. 
		 * Thus, this {@link name} should be unique in its parent {@link DistributedSystemArray} object.
		 */
		std::string name;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * Constrct from parent {@link DistributedSystemArray} object.
		 * 
		 * @param systemArray The parent {@link DistributedSystemArray} object.
		 */
		DistributedProcess(DistributedSystemArray *systemArray)
			: super()
		{
			this->system_array_ = systemArray;

			resource = 1.0;
			enforced_ = false;
		};
		virtual ~DistributedProcess() = default;

		virtual void construct(std::shared_ptr<library::XML> xml) override
		{
			name = xml->getProperty<std::string>("name");
			resource = xml->getProperty<double>("resource");
		};

		/* ---------------------------------------------------------
			ACCESSORS
		--------------------------------------------------------- */
		/**
		 * Identifier of {@link ParallelProcess} is its {@link name}.
		 */
		virtual auto key() const -> std::string override
		{
			return name;
		};

		/**
		 * Constrct from parent {@link DistributedSystemArray} object.
		 * 
		 * @param systemArray The parent {@link DistributedSystemArray} object.
		 */
		auto getSystemArray() const -> DistributedSystemArray*
		{
			return system_array_;
		};

		/**
		 * Get name, who represents and identifies this process.
		 */
		auto getName() const -> std::string
		{
			return name;
		};

		/**
		 * Get resource index.
		 * 
		 * Get *resource index* that indicates how much this {@link DistributedProcess role} is heavy.
		 * 
		 * If this {@link DistributedProcess role} does not have any	{@link Invoke} message had handled, then the
		 * *resource index* will be ```1.0```, which means default and average value between all 
		 * {@link DistributedProcess} instances (that are belonged to a same {@link DistributedSystemArray} object).
		 * 
		 * You can specify the *resource index* by yourself, but notice that, if the *resource index* is higher than 
		 * other {@link DistributedProcess} objects, then this {@link DistributedProcess role} will be ordered to
		 * handle less processes than other {@link DistributedProcess} objects. Otherwise, the *resource index* is 
		 * lower than others, of course, much processes will be requested.
		 * 
		 * - {@link setResource setResource()}
		 * - {@link enforceResource enforceResource()}
		 * 
		 * Unless {@link enforceResource enforceResource()} is called, This *resource index* is **revaluated** whenever
		 * {@link sendData sendData()} is called.
		 * 
		 * @return Resource index.
		 */
		auto getResource() const -> double
		{
			return resource;
		};

		/**
		 * Set resource index.
		 * 
		 * Set *resource index* that indicates how much this {@link DistributedProcess role} is heavy. This 
		 * *resource index* can be **revaulated**.
		 * 
		 * Note that, initial and average *resource index* of {@link DistributedProcess} objects are ```1.0```. If the 
		 * *resource index* is higher than other {@link DistributedProcess} objects, then this 
		 * {@link DistributedProcess} will be ordered to handle more processes than other {@link DistributedProcess} 
		 * objects. Otherwise, the *resource index* is lower than others, of course, less processes will be requested.
		 * 
		 * Unlike {@link enforceResource}, configuring *resource index* by this {@link setResource} allows the 
		 * **revaluation**. This **revaluation** prevents wrong valuation from user. For example, you *mis-valuated* the 
		 * *resource index*. The {@link DistributedProcess role} is much heavier than any other, but you estimated it 
		 * to the lightest one. It looks like a terrible case that causes 
		 * {@link DistributedSystemArray entire distributed processing system} to be slower, however, don't mind. The 
		 * {@link DistributedProcess role} will the direct to the *propriate resource index* eventually with the 
		 * **revaluation**.
		 * 
		 * - The **revaluation** is caused by the {@link sendData sendData()} method.
		 * 
		 * @param val New resource index, but can be revaluated.
		 */
		void setResource(double val)
		{
			resource = val;
			enforced_ = false;
		};

		/**
		 * Enforce resource index.
		 * 
		 * Enforce *resource index* that indicates how much heavy the {@link DistributedProcess role is}. The 
		 * *resource index* will be fixed, never be **revaluated**.
		 *
		 * Note that, initial and average *resource index* of {@link DistributedProcess} objects are ```1.0```. If the
		 * *resource index* is higher than other {@link DistributedProcess} objects, then this
		 * {@link DistributedProcess} will be ordered to handle more processes than other {@link DistributedProcess}
		 * objects. Otherwise, the *resource index* is lower than others, of course, less processes will be requested.
		 * 
		 * The difference between {@link setResource} and this {@link enforceResource} is allowing **revaluation** or not. 
		 * This {@link enforceResource} does not allow the **revaluation**. The *resource index* is clearly fixed and 
		 * never be changed by the **revaluation**. But you've to keep in mind that, you can't avoid the **mis-valuation** 
		 * with this {@link enforceResource}.
		 * 
		 * For example, there's a {@link DistributedProcess role} much heavier than any other, but you 
		 * **mis-estimated** it to the lightest. In that case, there's no way. The 
		 * {@link DistributedSystemArray entire distributed processing system} will be slower by the **mis-valuation**. 
		 * By the reason, using {@link enforceResource}, it's recommended only when you can clearly certain the 
		 * *resource index*. If you can't certain the *resource index* but want to recommend, then use {@link setResource} 
		 * instead.
		 * 
		 * @param val New resource index to be fixed.
		 */
		void enforceResource(double val)
		{
			resource = val;
			enforced_ = true;
		};

	private:
		auto compute_average_elapsed_time() const -> double;

	public:
		/* ---------------------------------------------------------
			INVOKE MESSAGE CHAIN
		--------------------------------------------------------- */
		/**
		 * Send an {@link Invoke} message.
		 * 
		 * Sends an {@link Invoke} message requesting a **distributed process**. The {@link Invoke} message will be sent
		 * to the most idle {@link DistributedSystem} object, which represents a slave system, and the most idle 
		 * {@link DistributedSystem} object will be returned.
		 * 
		 * When the **distributed process** has completed, then the {@link DistributedSystemArray} object will revaluate
		 * {@link getResource resource index} and {@link DistributedSystem.getPerformance performance index} of this
		 * {@link DistributedSystem} and the most idle {@link DistributedSystem} objects basis on the execution time. 
		 * 
		 * @param invoke An {@link Invoke} message requesting distributed process.
		 * @return The most idle {@link DistributedSystem} object who may send the {@link Invoke} message.
		 */
		auto sendData(std::shared_ptr<protocol::Invoke> invoke) -> std::shared_ptr<DistributedSystem>
		{
			return sendData(invoke, 1.0);
		};

		/**
		 * Send an {@link Invoke} message.
		 * 
		 * Sends an {@link Invoke} message requesting a **distributed process**. The {@link Invoke} message will be sent
		 * to the most idle {@link DistributedSystem} object, which represents a slave system, and the most idle 
		 * {@link DistributedSystem} object will be returned.
		 * 
		 * When the **distributed process** has completed, then the {@link DistributedSystemArray} object will revaluate
		 * {@link getResource resource index} and {@link DistributedSystem.getPerformance performance index} of this
		 * {@link DistributedSystem} and the most idle {@link DistributedSystem} objects basis on the execution time. 
		 * 
		 * @param invoke An {@link Invoke} message requesting distributed process.
		 * @param weight Weight of resource which indicates how heavy this {@link Invoke} message is. Default is 1.
		 * 
		 * @return The most idle {@link DistributedSystem} object who may send the {@link Invoke} message.
		 */
		virtual auto sendData(std::shared_ptr<protocol::Invoke> invoke, double weight) -> std::shared_ptr<DistributedSystem> override
		{
			if (((protocol::SharedEntityDeque<external::ExternalSystem>*)system_array_)->empty() == true)
				return nullptr;

			// ADD UID FOR ARCHIVING HISTORY
			size_t uid;
			if (invoke->has("_History_uid") == false)
			{
				// ISSUE UID AND ATTACH IT TO INVOKE'S LAST PARAMETER
				uid = ((parallel::base::IParallelSystemArray*)system_array_)->_Fetch_history_sequence();
				invoke->emplace_back(new InvokeParameter("_History_uid", uid));
			}
			else
			{
				// INVOKE MESSAGE ALREADY HAS ITS OWN UNIQUE ID
				//	- system_array_ IS A TYPE OF DistributedSystemArrayMediator. THE MESSAGE HAS COME FROM ITS MASTER
				//	- A Distributed HAS DISCONNECTED. THE SYSTEM SHIFTED ITS CHAIN TO ANOTHER SLAVE.
				uid = invoke->get("_History_uid")->getValue<size_t>();

				// FOR CASE 1. UPDATE HISTORY_SEQUENCE TO MAXIMUM
				if (uid > ((parallel::base::IParallelSystemArray*)system_array_)->_Get_history_sequence())
					((parallel::base::IParallelSystemArray*)system_array_)->_Set_history_sequence(uid);

				// FOR CASE 2. ERASE ORDINARY PROGRESSIVE HISTORY FROM THE DISCONNECTED
				progress_list_.erase(uid);
			}

			// ADD ROLE NAME FOR MEDIATOR
			if (invoke->has("_Process_name") == false)
				invoke->emplace_back(new InvokeParameter("_Process_name", name));

			// FIND THE MOST IDLE SYSTEM
			shared_ptr<DistributedSystem> idle_system;

			for (size_t i = 0; i < system_array_->size(); i++)
			{
				shared_ptr<DistributedSystem> system = system_array_->at(i);
				if (system->_Is_excluded() == true)
					continue; // BEING REMOVED SYSTEM

				if (idle_system == nullptr
					|| system->_Get_progress_list()->size() < idle_system->_Get_progress_list()->size()
					|| system->getPerformance() < idle_system->getPerformance())
					idle_system = system;
			}

			// ARCHIVE HISTORY ON PROGRESS_LIST (IN SYSTEM AND ROLE AT THE SAME TIME)
			shared_ptr<DSInvokeHistory> history(new DSInvokeHistory(idle_system.get(), this, invoke, weight));

			progress_list_.emplace(uid, history);
			idle_system->_Get_progress_list()->emplace(uid, make_pair(invoke, history));

			// SEND DATA
			idle_system->sendData(invoke);

			// RETURNS THE IDLE
			return idle_system;
		};

		/**
		 * @inheritDoc
		 */
		virtual void replyData(std::shared_ptr<protocol::Invoke>) = 0;

	private:
		void report_history(std::shared_ptr<DSInvokeHistory> history)
		{
			// ERASE FROM ORDINARY PROGRESS AND MIGRATE TO THE HISTORY
			progress_list_.erase(history->getUID());
			history_list_.emplace(history->getUID(), history);
		};

	public:
		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		virtual auto TAG() const -> std::string override
		{
			return "process";
		};

		virtual auto toXML() const -> std::shared_ptr<library::XML> override
		{
			std::shared_ptr<library::XML> &xml = super::toXML();
			xml->setProperty("name", name);
			xml->setProperty("resource", resource);

			return xml;
		};
	};
};
};
};