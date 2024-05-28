const fs = require("fs");
const path = require("path");


const recipesFolder = path.join(__dirname, "../../recipes");

async function readFileData() {
    try {
        if (!fs.existsSync(`${recipesFolder}/images`)) {
            fs.mkdirSync(`${recipesFolder}/images`, { recursive: true });
        }
        if (!fs.existsSync(`${recipesFolder}/recipes.json`)) {
            fs.writeFileSync(`${recipesFolder}/recipes.json`, "[]");
        }
        const data = await fs.promises.readFile(
            `${recipesFolder}/recipes.json`,
            "utf8"
        );
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { readFileData, recipesFolder }