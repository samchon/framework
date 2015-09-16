#pragma once
#include <samchon/SamchonLibrary.hpp>

namespace samchon
{
	class SAMCHON_LIBRARY_API FlashPolicyServer
	{
	public:
		FlashPolicyServer();
		~FlashPolicyServer();

		void openServer();

	private:
		void accept(void *);
	};
}