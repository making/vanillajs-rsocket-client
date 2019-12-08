import App from "./App";

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    const greet = document.getElementById('greet');
    const stream = document.getElementById('stream');

    const response = document.getElementById('response');
    greet.addEventListener('click', async () => {
        try {
            const res = await app.greet();
            response.innerText = res.data;
        } catch (error) {
            alert(JSON.stringify(error));
        }
    });
    let cancel = null;
    stream.addEventListener('click', () => {
        if (!cancel) {
            let subscription = null;
            let n = 8;
            app.stream()
                .subscribe({
                    onSubscribe: sub => {
                        stream.innerText = 'Cancel';
                        subscription = sub;
                        subscription.request(n);
                        cancel = () => sub.cancel();
                    },
                    onNext: value => {
                        setTimeout(() => {
                            response.innerText = value.data + '\n' + response.innerText;
                            if (--n === 0) {
                                n = 8;
                                subscription.request(n);
                            }
                        }, 500);
                    },
                    onError: error => alert(JSON.stringify(error)),
                });
        } else {
            cancel();
            cancel = null;
            stream.innerText = 'Stream';
        }
    });
});