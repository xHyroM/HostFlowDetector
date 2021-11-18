const extract = require('extract-zip');
const fs = require('fs');

(async() => {
    if(!fs.existsSync(`${__dirname}/plugins`)) fs.mkdirSync(`${__dirname}/plugins`);
    if(!fs.existsSync(`${__dirname}/plugins-clean`)) fs.mkdirSync(`${__dirname}/plugins-clean`);

    let infected = 0;

    console.log('\x1b[36m[INFO]\x1b[0m I\'m looking at plugins...')
    for(let file of fs.readdirSync(`${__dirname}/plugins`)) {
        let name = file.split('.')[0];
        await extract(`${__dirname}/plugins/${file}`, { dir: `${__dirname}/plugins/${name}` })

        if(existSync(`${__dirname}/plugins/${name}`)) {
            console.log(`\x1b[31m[DANGER]\x1b[0m ${name} is infected by Hostflow`);

            require('child_process').execSync(`java -jar utils/OtherRemover.jar ${__dirname}/plugins/${name}.jar ${__dirname}/plugins-clean`);
            infected++;
        } else {
            console.log(`\x1b[32m[GOOD]\x1b[0m ${name} is not infected by Hostflow`);
        }

        fs.rmSync(`${__dirname}/plugins/${name}`, { recursive: true, force: true })
    }

    console.log(`\x1b[36m[INFO]\x1b[0m You have ${infected} infected plugins.`)
})();

function existSync(path) {
    return fs.existsSync(`${path}/javassist/PingMessage.class`) ||
        fs.existsSync(`${path}/javassist/ResponseContainer.class`) 
}