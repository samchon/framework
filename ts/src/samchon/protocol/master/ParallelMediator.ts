namespace samchon.protocol.master
{
	export interface ISystemArrayMediator 
		extends ExternalSystemArray
	{

	}

	export abstract class ParallelSystemArrayMediator
		extends ParallelSystemArray
	{
		private mediator: IProtocol;
	}

	export interface IMediator extends IProtocol
	{
	}
}