// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

/// <reference path="../API.ts" />

namespace interaction.viewer
{
	export interface ISystemTreeViewerProps
	{
		application: Application;
		systemTree: SystemTree;
		style?: React.CSSProperties;
	}

	export class SystemTreeViewer extends React.Component<ISystemTreeViewerProps, {}>
	{
		private static s_iSequence: number = 0;

		public printMessage(message: Message): void
		{
			// NO MATCHED SYSTEM (ALREADY DISCONNECTED), THEN TERMINATE
			let system_tree: SystemTree = this.props.systemTree;
			if (!system_tree.has(message.getFrom()) || !system_tree.has(message.getTo()))
				return;

			// CREATE DIV
			let div: HTMLDivElement = document.createElement("div");
			div.style.position = "absolute";
			div.style.left = "500";
			div.style.top = "15";

			// APPEND AND RENDER
			document.getElementById("main_div").appendChild(div);
			ReactDOM.render
			(
				<MessageMovie systemTree={system_tree} message={message} />,
				div
			);

			// REMOVE THIS DIV 2 SECONDS AFTER
			setTimeout(function () {
					document.getElementById("main_div").removeChild(div);
				}, INTERVAL * 1000);
		}

		public render(): JSX.Element
		{
			let system_tree: SystemTree = this.props.systemTree;
			let system_movie_elements: JSX.Element[] = [];

			for (let it = system_tree.begin(); !it.equals(system_tree.end()); it = it.next())
				system_movie_elements.push(<SystemMovie system={it.second} />);

			return <div style={this.props.style}>
				<svg id="systems_svg" width={WIDTH} height={HEIGHT}>
					{this.render_lines(this.props.systemTree.getRoot())}
					{system_movie_elements}
				</svg>
			</div>;
		}

		private render_lines(system: System): JSX.Element[]
		{
			let lines: JSX.Element[] = [];

			for (let i: number = 0; i < system.size(); i++)
			{
				let child_system: System = system.at(i);

				lines.push
				(
					<line stroke="gray" strokeWidth={1} 
						x1={system.getX() + 50} y1={system.getY() + 65} 
						x2={child_system.getX() + 50} y2={child_system.getY() + 65} />
				);
				lines.push(...this.render_lines(child_system));
			}

			return lines;
		}
	}
}