import {RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";

const routingMetadata = (route) => {
    return String.fromCharCode(route.length) + route;
};

export default class App {
    constructor() {
        this.client = new RSocketClient({
            transport: new RSocketWebSocketClient({url: 'ws://localhost:7000/rsocket'}),
            setup: {
                dataMimeType: 'application/json',
                metadataMimeType: 'message/x.rsocket.routing.v0',
                keepAlive: 10000,
                lifetime: 20000,
            }
        });
        (async () => {
            try {
                this.rsocket = await this.client.connect();
            } catch (error) {
                alert(JSON.stringify(error));
            }
        })();
    }

    greet() {
        if (!this.rsocket) {
            alert('RSocket is not connected!');
        }
        return this.rsocket.requestResponse({
            data: 'Hello World!',
            metadata: routingMetadata('greeting.hello')
        });
    }

    stream() {
        if (!this.rsocket) {
            alert('RSocket is not connected!');
        }
        return this.rsocket.requestStream({
            data: 'Trump',
            metadata: routingMetadata('name')
        });
    }
}