declare interface ConnectEvent extends Event
{
    ports: MessagePort[];
}

declare interface SharedWorker extends AbstractWorker
{
    port: MessagePort;
}

declare var SharedWorker: 
{
    prototype: SharedWorker;
    new (scriptURL: any, name: any): SharedWorker;
    new (scriptURL: any): SharedWorker;
}