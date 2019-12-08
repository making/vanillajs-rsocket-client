import {RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";

export default class App {
    constructor() {
        this.client = new RSocketClient({
            transport: new RSocketWebSocketClient({url: 'ws://localhost:7000/rsocket'}),
            setup: {
                dataMimeType: 'application/json',
                metadataMimeType: 'application/json',
                keepAlive: 10000,
                lifetime: 20000,
            }
        });
        this.client.connect()
            .subscribe({
                onComplete: rsocket => this.rsocket = rsocket,
                onError: error => alert(JSON.stringify(error)),
                onSubscribe: cancel => this.cancel = cancel
            });
    }

    greet() {
        if (!this.rsocket) {
            alert('RSocket is not connected!');
        }
        return this.rsocket.requestResponse({
            data: 'Hello World!',
            metadata: JSON.stringify({})
        });
    }

    stream() {
        if (!this.rsocket) {
            alert('RSocket is not connected!');
        }
        return this.rsocket.requestStream({
            data: 'Trump',
            metadata: JSON.stringify({})
        });
    }
}