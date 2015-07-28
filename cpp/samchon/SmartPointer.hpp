#pragma once
#include <map>
#include <mutex>

namespace samchon
{
	template<typename T> 
	class SmartPointer
	{
	private:
		static std::map<T*, long long> referedSizeMap;
		static std::mutex mtx;

		T* ptr;

	public:
		/* --------------------------------------------------------------
		CONSTRUCTORS
		-------------------------------------------------------------- */
		SmartPointer()
		{
			ptr = nullptr;
		};
		explicit SmartPointer(const T* ptr)
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
			std::lock_guard<std::mutex> lockGuard(mtx);
			destruct(ptr);
		};

	public:
		/* --------------------------------------------------------------
		SETTERS
		-------------------------------------------------------------- */
		void reset(const T* ptr)
		{
			std::lock_guard<std::mutex> lockGuard(mtx);
			if (this->ptr == ptr)
				return;

			construct((T*)ptr);
			destruct(this->ptr);

			this->ptr = (T*)ptr;
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

	template<typename T> std::map<T*, long long> SmartPointer<T>::referedSizeMap;
	template<typename T> std::mutex SmartPointer<T>::mtx;
};