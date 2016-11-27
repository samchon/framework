/// <reference path="../API.ts" />

namespace interaction.viewer
{
	export class System extends protocol.EntityArray<System>
	{
		private parent: System;

		private uid: number = -1;
		private name: string = "";
		
		private row_: number;
		private col_: number;
		private mod_: number;

		/* =========================================================
			CONSTRUCTORS
				- BASIC CONSTRUCTORS
				- COORNIATES COMPUTATORS
		============================================================
			BASIC CONSTRUCTORS
		--------------------------------------------------------- */
		public constructor();
		public constructor(parent: System);

		public constructor(parent: System = null)
		{
			super();

			this.parent = parent;
		}

		public createChild(xml: library.XML): System
		{
			return new System(this);
		}

		/* ---------------------------------------------------------
			COORDINATES COMPUTATIONS
		--------------------------------------------------------- */
		public _Compute_coordinates(): void
		{
			this.initialize_nodes(0);

            // assign initial X and Mod values for nodes
            this.compute_initial_x();

            // ensure no node is being drawn off screen
            this.check_all_children_on_screen();

            // assign final X values to nodes
            this.compute_final_positions(0);
		}

		private initialize_nodes(depth: number): void
		{
			this.col_ = -1;
			this.row_ = depth;
			this.mod_ = 0;

			for (let i: number = 0; i < this.size(); i++)
				this.at(i).initialize_nodes(depth + 1);
		}

		private compute_final_positions(modSum: number): void
        {
            this.col_ += modSum;
            modSum += this.mod_;

            for (let i: number = 0; i < this.size(); i++)
				this.at(i).compute_final_positions(modSum);
        }

		private compute_initial_x(): void
        {
            for (let i: number = 0; i < this.size(); i++)
				this.at(i).compute_initial_x();

            // if no children
            if (this.empty() == true)
            {
                // if there is a previous sibling in this set, set X to prevous sibling + designated distance
                if (!this.is_left_most())
                    this.col_ = this.get_previous_sibling().col_ + 1;
                else
                    // if this is the first this in a set, set X to 0
                    this.col_ = 0;
            }
            // if there is only one child
            else if (this.size() == 1)
            {
                // if this is the first this in a set, set it's X value equal to it's child's X value
                if (this.is_left_most())
                {
                    this.col_ = this.front().col_;
                }
                else
                {
                    this.col_ = this.get_previous_sibling().col_ + 1;
                    this.mod_ = this.col_ - this.front().col_;
                }
            }
            else
            {
                let mid: number = (this.front().col_ + this.back().col_) / 2;

                if (this.is_left_most())
                {
                    this.col_ = mid;
                }
                else
                {
                    this.col_ = this.get_previous_sibling().col_ + 1;
                    this.mod_ = this.col_ - mid;
                }
            }

            if (this.size() > 0 && !this.is_left_most())
            {
                // Since subtrees can overlap, check for conflicts and shift tree right if needed
                this.check_conflicts();
            }
        }

		private check_conflicts(): void
		{
            let min_distance: number = 1;
            let shift_value: number = 0.0;

            let contour: std.TreeMap<number, number> = new std.TreeMap<number, number>();
            this.get_left_contour(0, contour);

            let sibling: System = this.get_left_most_sibling();
            while (sibling != null && sibling != this)
            {
                let sibling_contour: std.TreeMap<number, number> = new std.TreeMap<number, number>();
                sibling.get_right_contour(0, sibling_contour);

                for (let level: number = this.row_ + 1; level <= Math.min(sibling_contour.rbegin().first, contour.rbegin().first); level++)
                {
                    let distance = contour.get(level) - sibling_contour.get(level);
                    if (distance + shift_value < min_distance)
                    {
                        shift_value = min_distance - distance;
                    }
                }

                if (shift_value > 0)
                {
                    this.col_ += shift_value;
                    this.mod_ += shift_value;

                    this.center_nodes_between(this, sibling);
                    shift_value = 0;
                }

                sibling = sibling.get_next_sibling();
            }
		}

		private center_nodes_between(leftNode: System, rightNode: System): void
        {
			let leftIndex: number = std.find(leftNode.parent.begin(), leftNode.parent.end(), rightNode).index;
			let rightIndex: number = std.find(leftNode.parent.begin(), leftNode.parent.end(), leftNode).index;

            let numNodesBetween: number = (rightIndex - leftIndex) - 1;

            if (numNodesBetween > 0)
            {
                let distanceBetweenNodes: number = (leftNode.col_ - rightNode.col_) / (numNodesBetween + 1);

                let count: number = 1;
                for (let i: number = leftIndex + 1; i < rightIndex; i++)
                {
                    let middleNode: System = leftNode.parent.at(i);

                    let desiredX = rightNode.col_ + (distanceBetweenNodes * count);
                    let offset = desiredX - middleNode.col_;
                    middleNode.col_ += offset;
                    middleNode.mod_ += offset;

                    count++;
                }

                leftNode.check_conflicts();
            }
        }

		private check_all_children_on_screen(): void
        {
            let contour: std.TreeMap<number, number> = new std.TreeMap<number, number>();
            this.get_left_contour(0, contour);

            let shiftAmount: number = 0;
			for (let it = contour.begin(); !it.equals(contour.end()); it = it.next())
				if (it.first + shiftAmount < 0)
					shiftAmount = it.first * -1;

            if (shiftAmount > 0)
            {
                this.col_ += shiftAmount;
                this.mod_ += shiftAmount;
            }
        }

		private get_left_contour(modSum: number, values: std.TreeMap<number, number>): void
        {
			let it = values.find(this.row_);
            if (it.equals(values.end()) == true)
                values.insert([this.row_, this.col_ + modSum]);
            else
                it.second = Math.min(it.second, this.col_ + modSum);

            modSum += this.mod_;
			for (let i: number = 0; i < this.size(); i++)
				this.at(i).get_left_contour(modSum, values);
        }

		private get_right_contour(modSum: number, values: std.TreeMap<number, number>): void
        {
			let it = values.find(this.row_);
            if (it.equals(values.end()) == true)
                values.insert([this.row_, this.col_ + modSum]);
            else
                it.second = Math.max(it.second, this.col_ + modSum);

            modSum += this.mod_;
			for (let i: number = 0; i < this.size(); i++)
				this.at(i).get_right_contour(modSum, values);
        }

		/* =========================================================
			ACCESSORS
				- MEMBERS
				- NODES
		============================================================
			MEMBERS
		--------------------------------------------------------- */
		public key(): number
		{
			return this.uid;
		}

		public getUID(): number
		{
			return this.uid;
		}
		public getName(): string
		{
			return this.name;
		}

		public getX(): number
		{
			return this.col_ * 150;
		}
		public getY(): number
		{
			return this.row_ * 175;
		}

		/* ---------------------------------------------------------
			NODES
		--------------------------------------------------------- */
		public is_left_most(): boolean
		{
			return this.parent == null || this.parent.front() == this;
		}
		public is_right_most(): boolean
		{
			return this.parent == null || this.parent.back() == this;
		}

		public get_previous_sibling(): System
		{
			if (this.parent == null || this.is_left_most() == true)
				return null;
			else
				return std.find(this.parent.begin(), this.parent.end(), this as System).prev().value;
		}
		public get_next_sibling(): System
		{
			if (this.parent == null || this.is_right_most() == true)
				return null;
			else
				return std.find(this.parent.begin(), this.parent.end(), this as System).next().value;
		}

		public get_left_most_sibling(): System
		{
			if (this.parent == null)
				return null;
			else
				return this.parent.front();
		}
		public get_right_most_sibling(): System
		{
			if (this.parent == null)
				return null;
			else
				return this.parent.back();
		}

		public get_left_most_child(): System
		{
			if (this.empty() == true)
				return null;
			else
				return this.front();
		}
		public get_right_most_child(): System
		{
			if (this.empty() == true)
				return null;
			else
				return this.back();
		}
		
		/* ---------------------------------------------------------
			EXPORTERS
		--------------------------------------------------------- */
		public TAG(): string
		{
			return "system";
		}
		public CHILD_TAG(): string
		{
			return this.TAG();
		}
	}
}