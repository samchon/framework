#pragma once
#include <samchon/SamchonLibrary.hpp>
//다른 클래스에서 상속받아 쓰면 된다
//인터페이스 격

namespace std
{
	template<typename _Ty> class shared_ptr;
};
namespace samchon
{
	using namespace std;

	class Event;
	class ErrorEvent;
	class ProgressEvent;

	template<typename K, typename O = less<K>, typename Alloc = allocator<K>> class CriticalSet;
	template<typename K, typename T, typename O = less<K>, typename Alloc = allocator<pair<const K, T>>> class CriticalMap;

	class SAMCHON_LIBRARY_API EventDispatcher
	{
	private:
		//EVENT-LISTENER CONTAINERS
		CriticalMap<long, shared_ptr<CriticalSet<void(*)(shared_ptr<Event>)>>> *eventSetMap; //EVENT
		CriticalSet<void(*)(shared_ptr<ErrorEvent>)> *errorSet; //ERROR
		CriticalSet<void(*)(shared_ptr<ProgressEvent>)> *progressSet; //PROGRESS

		void *addiction;

	public:
		//CONSTRUCTORS
		EventDispatcher();
		virtual ~EventDispatcher();

		void setAddiction(void*);
		auto getAddiction() const -> void*;

		//EVENT LISTENER CONTAINER MANAGER
		virtual void addEventListener(long, void(*listener)(shared_ptr<Event>));
		virtual void addEventListener(long, void(*listener)(shared_ptr<ProgressEvent>));
		virtual void addEventListener(long, void(*listener)(shared_ptr<ErrorEvent>));

		virtual void removeEventListener(long, void(*listener)(shared_ptr<Event>));
		virtual void removeEventListener(long, void(*listener)(shared_ptr<ProgressEvent>));
		virtual void removeEventListener(long, void(*listener)(shared_ptr<ErrorEvent>));

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