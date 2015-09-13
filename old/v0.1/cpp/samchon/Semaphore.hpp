#include <samchon/SamchonLibrary.hpp>

namespace std
{
	template<typename _Ty> struct atomic;
	class condition_variable;
	class mutex;
}

namespace samchon
{
	using namespace std;

	class SAMCHON_LIBRARY_API Semaphore
	{
	private:
		atomic<size_t> *locked;
		atomic<size_t> *size;
		mutex *referMutex;
		condition_variable *cv;
		
	public:
		Semaphore();
		Semaphore(size_t);
		~Semaphore();

		auto getSize() const -> size_t;
		void setSize(size_t);

		void lock();
		void unlock();
	};
};