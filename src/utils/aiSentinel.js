const { tryQuery } = require("../helper/error");

require("dotenv").config()
const HF_TOKEN = process.env.TOKEN_HUGGING_FACE;
const HF_API_URL_THEME = process.env.API_URL_THEME;
const HF_API_URL_TOXIC = process.env.API_URL_TOXIC

async function classifyTheme(content) {

    const responseProbalityTheme = await tryQuery("Erro ao executar o fetch", () => fetch(HF_API_URL_THEME, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            inputs: content,
            parameters: {
                candidate_labels: ["sustentabilidade", "esporte", "entretenimento", "política"]
            }
        })
    }));

    const responseProbalityToxic = await tryQuery("Erro ao executar o fetch", () => fetch(HF_API_URL_TOXIC, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({inputs: content})
    }));

    const resultToxic = await responseProbalityToxic.json();
    
    const innerArray = resultToxic[0];

    const maxItem = innerArray.reduce((max, current) => {
        return current.score > max.score ? current : max;
    });

    const resultTheme = await responseProbalityTheme.json();
    const moreProbalityTheme = resultTheme.labels[0];
    const score = resultTheme.scores[0];

    return {
        toxic: maxItem.label,
        probalityToxic: maxItem.score,
        theme: moreProbalityTheme,
        trust: score
    };
}

module.exports = classifyTheme;