require("dotenv").config()
const HF_TOKEN = process.env.TOKEN_HUGGING_FACE;
const HF_API_URL = process.env.API_URL;

async function classifyTheme(content) {
    const response = await fetch(HF_API_URL, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HF_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            inputs: content,
            parameters: {
                candidate_labels: ["sustentabilidade", "política", "esporte", "entretenimento"]
            }
        })
    });

    const result = await response.json();
    const moreProbalityTheme = result.labels[0];
    const score = result.scores[0];

    return {
        theme: moreProbalityTheme,
        trust: score
    };
}

module.exports = classifyTheme;