// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

/// <reference path="../API.ts" />

namespace interaction.viewer
{
	export interface IMessageMovieProps
	{
		systemTree: SystemTree;
		message: Message;
	}

	export class MessageMovie extends React.Component<IMessageMovieProps, {}>
	{
		public render(): JSX.Element
		{
			let message: Message = this.props.message;
			let from: System = this.props.systemTree.get(message.getFrom());
			let to: System = this.props.systemTree.get(message.getTo());
			
			return <svg width={WIDTH} height={HEIGHT}>
				<g>
					<animateTransform attributeName="transform" 
						type="translate"
						from={library.StringUtil.substitute("{1} {2}",
								from.getX() + 50, from.getY() + 65)}
						to={library.StringUtil.substitute("{1} {2}",
								to.getX() + 50, to.getY() + 65) }
						begin="0s"
						dur={INTERVAL + "s"}
						repeatCount="1" />
					<circle r={4} fill={(from.getY() < to.getY()) ? "blue" : "green"} />
					<text x={10}>{message.getNo()}) {message.getListener()}</text>
				</g>
			</svg>;
		}
	}
}