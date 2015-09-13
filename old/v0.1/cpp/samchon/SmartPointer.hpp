#pragma once
#include <map>
#include <mutex>

namespace samchon
{
	using namespace std;

	template<typename T> class SmartPointer
	{
	private:
		static map<T*, long long> referedSizeMap;
		static mutex mtx;

		T* ptr;

	public:
		/* --------------------------------------------------------------
			CONSTRUCTORS
		-------------------------------------------------------------- */
		SmartPointer()
		{
			ptr = nullptr;
		};
		explicit SmartPointer(T* ptr)
			: SmartPointer()
		{
			reset(ptr);
		};
		SmartPointer(const SmartPointer &smartPointer)
			: SmartPointer(smartPointer.ptr) {};
		SmartPointer(SmartPointer &&smartPointer)
		{
			ptr = smartPointer.ptr;
			smartPointer.ptr = nullptr;
		}
		~SmartPointer()
		{
			mtx.lock();
			destruct(ptr);
			mtx.unlock();
		};

	public:
		/* --------------------------------------------------------------
			SETTERS
		-------------------------------------------------------------- */
		void reset(T* ptr)
		{
			if (this->ptr == ptr)
				return;

			mtx.lock();
			construct(ptr);
			destruct(this->ptr);
			mtx.unlock();

			this->ptr = ptr;
		};

		/* --------------------------------------------------------------
			GETTERS
		-------------------------------------------------------------- */
		inline auto get() const -> T*
		{
			return ptr;
		};
		inline auto operator ->() const -> T*
		{
			return get();
		};
		inline auto operator*() -> T&
		{
			return *get();
		};
		inline auto operator*() const -> const T&
		{
			return *get();
		};

		/* --------------------------------------------------------------
			STATICS
		-------------------------------------------------------------- */
	private:
		static void construct(T *ptr)
		{
			if (ptr == nullptr)
				return;

			if (referedSizeMap.find(ptr) != referedSizeMap.end())
				referedSizeMap[ptr]++;
			else
				referedSizeMap[ptr] = 1;
		}
		static void destruct(T *ptr)
		{
			if (ptr == nullptr)
				return;

			if (referedSizeMap.find(ptr) != referedSizeMap.end())
				if (--referedSizeMap[ptr] == 0)
				{
					referedSizeMap.erase(ptr);
					delete ptr;
				}
		};
	};
	template<typename T> map<T*, long long> SmartPointer<T>::referedSizeMap;
	template<typename T> mutex SmartPointer<T>::mtx;
};