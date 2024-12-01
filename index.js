const app = require('./src/app');

const main = () => {
    app.listen(app.get('port'),'0.0.0.0');
    console.log(`Servidor en puerto ${app.get('port')}`);
};

main();
