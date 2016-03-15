#include <API.hpp>

class Memory
{
private:
	LP_PAGE_INFO	RegistedPages;
	DWORD			dwAllocatedPage;
	DWORD			dwPageSize;

	LP_PAGE_INFO	PageHeapInfo;

	void SetDefaultPageSize()
	{
		SYSTEM_INFO info_sys;

		GetSystemInfo(&info_sys);
		this->dwPageSize = info_sys.dwPageSize;
	}

	BOOL PageAlloc()
	{
		LP_PAGE_INFO PageInfo =
			(LP_PAGE_INFO)VirtualAlloc(
				nullptr,
				this->dwPageSize,
				MEM_RESERVE | MEM_COMMIT,
				PAGE_READWRITE);

		ZeroMemory(PageInfo, this->dwPageSize);

		PageInfo->pNext = nullptr;
		PageInfo->dwUsing = sizeof(PAGE_INFO);
		PageInfo->Index = ADD_ADDRESS(
			PageInfo, 
			sizeof(PAGE_INFO));

		RegistedPages = PageInfo;

		return !!(PageInfo);
	}

	BOOL PageFree(LP_PAGE_INFO PageInfo)
	{
		return TRUE;
	}

	BOOL FindCollectedHeap(LP_HEAP_INFO *pHeapInfo, SIZE_T HeapSize)
	{
		return TRUE;
	}

	LPVOID AllocateHeapFromPage(HEAP_TYPE HeapType, LP_PAGE_INFO PageInfo, SIZE_T HeapSize)
	{
		if (HeapSize <= sizeof(HEAP_INFO)) return nullptr;
	}
public:
	void Initalize()
	{
		SetDefaultPageSize();
		if(!PageAlloc()) throw GetLastError();


	}

	void Release()
	{
		
	}

	BOOL AllocManagedHeap(LP_HEAP_INFO *pHeapInfo, SIZE_T HeapSize)
	{
		LP_HEAP_INFO HeapInfo = nullptr;

		if (FindCollectedHeap(pHeapInfo, HeapSize)) return TRUE;
		else 
		{
			HeapInfo = (LP_HEAP_INFO)AllocateHeapFromPage(
				HEAP_TYPE::HEAP_MANAGED,
				this->RegistedPages,
				HeapSize);
		}


	}

	BOOL FreeManagedHeap(LP_HEAP_INFO HeapInfo)
	{

	}
};

#undef ADD_ADDRESS