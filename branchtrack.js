const axios = require('axios');
var fs = require('fs');

axios.get('https://www.branchtrack.com/projects/nwre0x2g.json')
    .then((response) => {
        if (response && response.data && response.data.project) {
            saveToFile(response.data);
        }
    })
    .catch((error) => {
        console.log(error);
    });

function saveToFile(json) {
    fs.writeFile('./www/assets/stories/astroneer-ep1.json', JSON.stringify(json), 'utf8', () => {
        console.log('Story saved!');
    });
}