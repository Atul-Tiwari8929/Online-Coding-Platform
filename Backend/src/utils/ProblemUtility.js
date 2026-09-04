
const axios = require("axios");
require('dotenv').config();


const getLanguageById = (lang) => {

  const language = {
    "c++": 54,
    "java": 62,
    "javascript": 102
  }

  return language[lang.toLowerCase()];
}

const submitBatch = async (submissions) => {


  const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      base64_encoded: 'false'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0X_API_KEY,
      'x-rapidapi-host': process.env.Judge0X_API_HOST,
      'Content-Type': 'application/json'
    },
    data: {
      submissions
    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
      return response.data;
    } catch (error) {

    console.error(
      "Judge0 submitBatch error:",
      error.response?.data || error.message
    );

    throw error;
  }
  }

  return await fetchData();


}

const waiting = async(timer)=>{

  setTimeout(()=>{
    return 1;
  },timer);
}

const submitToken = async (resultToken) => {



  const options = {
    method: 'GET',
    url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
    params: {
      tokens: resultToken.join(","),
      base64_encoded: 'false',
      fields: '*'
    },
    headers: {
      'x-rapidapi-key': process.env.JUDGE0X_API_KEY,
      'x-rapidapi-host': process.env.Judge0X_API_HOST,

    }
  };

  async function fetchData() {
    try {
      const response = await axios.request(options);
     return  response.data;
    } catch (error) {
      console.error(error);
    }
  }

  while(true){

  

  const result = await fetchData();

  const IsResultObtained = result.submissions.every((r)=>r.status_id>2);
  
  if(IsResultObtained)
    return result.submissions;

  waiting(1000);

}

    

}

module.exports = { getLanguageById, submitBatch, submitToken };


