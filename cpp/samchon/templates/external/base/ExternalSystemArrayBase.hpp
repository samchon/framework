#pragma once
#include <samchon/API.hpp>

#include <vector>
#include <memory>
#include <shared_mutex>

namespace samchon
{
namespace templates
{
namespace external
{
	class ExternalSystem;

namespace base
{
	class ExternalSystemArrayBase
	{
	private:
		std::shared_mutex mtx;

	public:
		virtual auto _Get_children() const -> std::vector<std::shared_ptr<ExternalSystem>> = 0;

		auto getMutex() -> std::shared_mutex& { return mtx; };
		auto getMutex() const -> const std::shared_mutex& { return mtx; };
	};
};
};
};
};