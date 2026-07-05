const axios = require("axios");

async function run() {
  try {
    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions/batch",
      {
        source_code: "print('Hello World')",
        language_id: 71
      },
      {
        params: {
          wait: "true",
          base64_encoded: "false"
        },
        headers: {
          'x-rapidapi-key': 'ab99c6ec42mshfd636ec7c6687efp1b9043jsna684835b0591',
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json"
        }
      }
    );

    console.log(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

run();