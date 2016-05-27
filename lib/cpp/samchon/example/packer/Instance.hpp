#pragma once
#include <samchon/protocol/Entity.hpp>

#include <samchon/library/StringUtil.hpp>
#include <samchon/library/XML.hpp>

namespace samchon
{
namespace example
{
namespace packer
{
	using namespace std;

	using namespace library;
	using namespace protocol;

	/**
	 * @brief A physical instance
	 *
	 * @details 
	 * <p> A physical instance having its own name, price, volume and weight. </p>
	 *
	 * <p> @image html cpp/example_packer.png
	 * @image latex cpp/example_packer.png </p>
	 *
	 * @author Jeongho Nam <http://samchon.org>
	 */
	class Instance
		: public virtual Entity
	{
	private:
		typedef Entity super;

	protected:
		/**
		 * @brief Name represent the Instance
		 */
		string name;

		/**
		 * @brief Price of an instance -> 1,000 won
		 */
		int price;

		/**
		 * @brief Volume of an instance -> 130 cm^3
		 */
		int volume;

		/**
		 * @brief Weight of an instance -> 1,200 g
		 */
		int weight;

	public:
		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		/**
		 * @brief Default Constructor.
		 */
		Instance()
			: super()
		{
		};

		/**
		 * @brief Construct from instance
		 *
		 * @param name Name of the instance
		 * @param price Price of the instance
		 * @param volume Volume of the instance
		 * @param weight Weight of the instance
		 */
		Instance(const string &name, int price, int volume, int weight)
			: super()
		{
			this->name = name;
			this->price = price;
			this->volume = volume;
			this->weight = weight;
		};

		virtual ~Instance() = default;

		virtual void construct(shared_ptr<XML> xml) override
		{
			this->name = xml->get_property("name");
			this->price = xml->get_property<int>("price");
			this->volume = xml->get_property<int>("volume");
			this->weight = xml->get_property<int>("weight");
		};

		/* ---------------------------------------------------------
			GETTERS
		--------------------------------------------------------- */
		/**
		 * @brief Get name
		 */
		auto get_name() const -> string
		{
			return name;
		};

		/**
		 * @brief Get price
		 */
		auto getPrice() const -> int
		{
			return price;
		};

		/**
		 * @brief Get volume
		 */
		auto getVolume() const -> int
		{
			return volume;
		};

		/**
		 * @brief Get weight
		 */
		auto getWeight() const -> int
		{
			return weight;
		};

		/* ---------------------------------------------------------
			EXPORT
		--------------------------------------------------------- */
		virtual auto to_XML() const -> shared_ptr<XML> override
		{
			shared_ptr<XML> &xml = super::to_XML();
			xml->set_property("name", name);
			xml->set_property("price", price);
			xml->set_property("volume", volume);
			xml->set_property("weight", weight);

			return xml;
		};

		/**
		 * @brief Return a string represents the Instance
		 */
		virtual auto to_string() const -> string
		{
			return StringUtil::substitute
				(
					"{1}: ${2}, {3}cm^3, {4}g",
					name, price, volume, weight
					);
		};
	};			
};
};
};