#pragma once
#include <Windows.h>

#define ADD_ADDRESS(x,y) ((LPVOID)((size_t)x+(size_t)y))

typedef struct MEMORY_STRUCT
{
	LPVOID			pNext;
}*LP_MEMORY_STRUCT;

typedef struct HEAP_INFO : public MEMORY_STRUCT
{
	LPVOID			pHeap;
	DWORD			dwSize;
}*LP_HEAP_INFO;

typedef struct PAGE_INFO : public MEMORY_STRUCT
{
	LPVOID			Index;
	DWORD			dwUsing;
}*LP_PAGE_INFO;

enum class HEAP_TYPE : BYTE
{
	HEAP_MANAGED = 0x01
};

void* operator new(size_t size);
void operator delete(void* pheap, size_t size);