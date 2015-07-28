#pragma once
#include <samchon/namtree/FTFile.hpp>

#include <vector>

namespace samchon
{
	namespace namtree
	{
		class SAMCHON_FRAMEWORK_API FTByteFile
			: public FTFile
		{
		private:
			typedef protocol::Entity FTFile;

		protected:
			std::vector<unsigned char> data;

		public:
			FTByteFile(FTFolder*);
			virtual ~FTByteFile() = default;

			virtual void construct(std::shared_ptr<library::XML> xml);

			auto getData() const -> const std::vector<unsigned char>&;

			virtual auto toXML() const -> std::shared_ptr<library::XML>;
		};
	};
};