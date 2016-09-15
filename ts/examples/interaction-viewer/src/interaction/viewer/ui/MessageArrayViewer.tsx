// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

/// <reference path="../API.ts" />

namespace interaction.viewer
{
	export interface IMessageArrayViewerProps
	{
		application: Application;
		messageArray: std.Deque<Message>;
		style?: React.CSSProperties;
	}

	export class MessageArrayViewer extends React.Component<IMessageArrayViewerProps, {}>
	{
		private get_row(index: number): Message
		{
			return this.props.messageArray.at(index);
		}

		private handle_change(event: { rowIdx: number }): void
		{
			try
			{
				let message: Message = this.props.messageArray.at(event.rowIdx);
				this.props.application.systemTreeViewer.printMessage(message);
			}
			catch (exception) {}
		}

		public render(): JSX.Element
		{
			let columns: AdazzleReactDataGrid.Column[] = 
			[
				{ key: "$no", name: "No", width: 50 },
				{ key: "$from", name: "From", width: 100 },
				{ key: "$to", name: "To", width: 100 },
				{ key: "$listener", name: "Listener", width: 100 },
				{ key: "$date", name: "Datetime", width: 70 }
			];

			return <div style={this.props.style}>
				<ReactDataGrid rowGetter={this.get_row.bind(this)}
					rowsCount={this.props.messageArray.size()}
					columns={columns}
					
					enableCellSelect={true}
					onCellSelected={this.handle_change.bind(this)} />
			</div>;
		}
	}
}