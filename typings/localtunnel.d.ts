declare module 'localtunnel' {
    import {EventEmitter} from 'events';
    type Options = {subdomain?:string, local_host?:string};
    
    type Callback = (err:Error, tunnel:localtunnel.Tunnel)=>void;
    function localtunnel(port:number, fn:Callback):void;
    function localtunnel(port:number, opts:Options, fn:Callback):void;
    
    namespace localtunnel {
        class Tunnel extends EventEmitter {
            url:string;
            close():void;
        }
    }
    export = localtunnel;
}