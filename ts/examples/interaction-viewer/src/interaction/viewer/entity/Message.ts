/// <reference path="../API.ts" />

namespace interaction.viewer
{
	export class Message
	{
		private static s_iNo: number = 0;

		private system_map_: SystemTree;
		private no_: number;

		private from_: number;
		private to_: number;
		private listener_: string;
		private date_: Date;

		/* ---------------------------------------------------------
			CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor(systemMap: SystemTree, from: number, to: number, listener: string)
		{
			this.system_map_ = systemMap;
			this.no_ = ++Message.s_iNo;

			this.from_ = from;
			this.to_ = to;
			this.listener_ = listener;
			this.date_ = new Date();
		}

		/* =========================================================
			ACCESSORS
				- MEMBERS
				- GRID PROPERTIES
		============================================================
			MEMBERS
		--------------------------------------------------------- */
		public getNo(): number
		{
			return this.no_;
		}
		
		public getFrom(): number
		{
			return this.from_;
		}
		public getTo(): number
		{
			return this.to_;
		}
		public getListener(): string
		{
			return this.listener_
		}
		
		public getDate(): Date
		{
			return this.date_;
		}

		/* ---------------------------------------------------------
			GRID PROPERTIES
		--------------------------------------------------------- */
		public get $no(): string
		{
			return library.StringUtil.numberFormat(this.no_, 0);
		}

		public get $from(): string
		{
			return library.StringUtil.substitute("{1}) {2}",
				library.StringUtil.numberFormat(this.from_, 0),
				(this.system_map_.has(this.from_) == true)
					? this.system_map_.get(this.from_).getName()
					: "Disconnected"
			);
		}
		public get $to(): string
		{
			return library.StringUtil.substitute("{1}) {2}",
				library.StringUtil.numberFormat(this.to_),
				(this.system_map_.has(this.to_) == true)
					? this.system_map_.get(this.to_).getName()
					: "Disconnected"
			);
		}
		public get $listener(): string
		{
			return this.listener_;
		}
		public get $date(): string
		{
			return library.StringUtil.substitute
				(
					"{1}:{2}:{3}",
					this.date_.getHours(),
					this.date_.getMinutes(),
					this.date_.getSeconds() + ((this.date_.getTime() % 1000) / 1000)
				);
		}
	}
}