// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

/// <reference path="../API.ts" />

namespace interaction.viewer
{
	export interface ISystemMovieProps
	{
		system: System;
	}

	export class SystemMovie extends React.Component<ISystemMovieProps, {}>
	{
		public render(): JSX.Element
		{
			// SYSTEM TO BE REPRESENTED
			let system: System = this.props.system;

			// IMAGE TO REPRESENT THE SYSTEM
			let image: string = "system";
			if (system.getName().indexOf("Chief") != -1)
				image = "chief";
			else if (system.getName().indexOf("Master") != -1)
				image = "master";
			else if (system.getName().indexOf("Mediator") != -1)
				image = "mediator";
			else if (system.getName().indexOf("Slave") != -1)
				image = "slave";
			
			return <g transform={"translate(" + system.getX() + ", " + system.getY() + ")"}>
				<image xlinkHref={"images/" + image + ".png"} 
					width={100} height={100} />
				<text textAnchor="middle" 
					x={50} y={120}>
					{system.getUID()}. {system.getName()}
				</text>
			</g>;

			//return <div style={{position: "absolute", backgroundColor: "skyblue",
			//					left: system.getX() - 50, top: system.getY() - 50}}>
			//	<table style={{textAlign: "center"}}>
			//		<tr><td><img src={"images/" + image + ".png"} /></td></tr>
			//		<tr><td>{system.getUID()}. {system.getName()}</td></tr>
			//	</table>
			//</div>;
		}
	}
}