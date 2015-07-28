#pragma once
#include <samchon\API.hpp>
//다른 클래스에서 상속받아 쓰면 된다
//인터페이스 격

#include <memory>

#include <samchon/library/CriticalSet.hpp>
#include <samchon/library/CriticalMap.hpp>

namespace samchon
{
	namespace library
	{
		class Event;
		class ErrorEvent;
		class ProgressEvent;

		/*SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API std::shared_ptr<Event>;
		SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API std::shared_ptr<ErrorEvent>;
		SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API std::shared_ptr<ProgressEvent>;
		SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API CriticalSet<void(*)(std::shared_ptr<Event>)>;
		SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API CriticalSet<void(*)(std::shared_ptr<ErrorEvent>)>;
		SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API CriticalSet<void(*)(std::shared_ptr<ProgressEvent>)>;
		SAMCHON_FRAMEWORK_EXTERN template class SAMCHON_FRAMEWORK_API CriticalMap<long, std::shared_ptr<CriticalSet<void(*)(std::shared_ptr<Event>)>>>;*/
		
		class SAMCHON_FRAMEWORK_API EventDispatcher
		{
		private:
			//EVENT-LISTENER CONTAINERS
			CriticalMap<long, std::shared_ptr<CriticalSet<void(*)(std::shared_ptr<Event>)>>> eventSetMap; //EVENT
			CriticalSet<void(*)(std::shared_ptr<ErrorEvent>)> errorSet; //ERROR
			CriticalSet<void(*)(std::shared_ptr<ProgressEvent>)> progressSet; //PROGRESS

			void *addiction;

		public:
			//CONSTRUCTORS
			EventDispatcher();
			virtual ~EventDispatcher() = default;

			void setAddiction(void*);
			auto getAddiction() const -> void*;

			//EVENT LISTENER CONTAINER MANAGER
			virtual void addEventListener(long, void(*listener)(std::shared_ptr<Event>));
			virtual void addEventListener(long, void(*listener)(std::shared_ptr<ProgressEvent>));
			virtual void addEventListener(long, void(*listener)(std::shared_ptr<ErrorEvent>));

			virtual void removeEventListener(long, void(*listener)(std::shared_ptr<Event>));
			virtual void removeEventListener(long, void(*listener)(std::shared_ptr<ProgressEvent>));
			virtual void removeEventListener(long, void(*listener)(std::shared_ptr<ErrorEvent>));

		protected:
			//SEND EVENT
			void eventActivated();
			void eventCompleted();
			virtual void sendRemoved();

			void sendEvent(long);
			void sendError(long id);
			void sendProgress(unsigned long long x, unsigned long long size);
		};
	};
};