const app = require('./src/app');

const main = () => {
    const port = app.get('port');
    app.listen(port, '0.0.0.0', () => {
        console.log(`Servidor en puerto ${port}`);
    });
};

main();
