
const { getLanguageById, submitBatch, submitToken } = require("../utils/ProblemUtility");
const Problem = require("../models/problem");
const axios = require("axios");
const User = require("../models/user");
const Submission = require("../models/submission");

const createProblem = async (req, res) => {

  const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator } = req.body;

  try {

    for (const { language, completeCode } of referenceSolution) {

      // source_code:
      //langauge_id:
      //stdin:
      //expecctedOutput:
      const languageId = getLanguageById(language);

      // I am creating Batch Submission

      const submissions = visibleTestCases.map((testCases) => ({

        source_code: completeCode,
        language_id: languageId,
        stdin: testCases.input,
        expected_output: testCases.output
      }))

      const submitResult = await submitBatch(submissions);
      // console.log(submitResult);

      const resultToken = submitResult.map((value) => value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"]

      const testResult = await submitToken(resultToken);
      console.log(testResult);

  

      for (const test of testResult) {

        if (test.status_id != 3) {

          return res.status(400).send("Error Occured")
        }
      }

    }

    // Now We can strore it in our database

    const userProblem = await Problem.create({
      ...req.body,
      problemCreator: req.result._id
    })

    res.status(201).send("Problem Saved Successfully");


  }

 catch (err) {
  res.status(500).send("Error:" + err.message);
}


}

const updateProblem = async (req, res) => {

  const { id } = req.params;
  const { title, description, difficulty, tags, visibleTestCases, hiddenTestCases, startCode, referenceSolution, problemCreator } = req.body;


  try {

    if (!id) {
      return res.status(400).send("Missing ID field");
    }

    const DSA_Problem = await Problem.findById(id);
    if (!DSA_Problem) {

      return res.status(404).send("Id is not present in the server")
    }



    for (const { language, completeCode } of referenceSolution) {

      // source_code:
      //langauge_id:
      //stdin:
      //expecctedOutput:
      const languageId = getLanguageById(language);

      // I am creating Batch Submission

      const submissions = visibleTestCases.map((testCases) => ({

        source_code: completeCode,
        language_id: languageId,
        stdin: testCases.input,
        expected_output: testCases.output
      }))

      const submitResult = await submitBatch(submissions);
      // console.log(submitResult);

      const resultToken = submitResult.map((value) => value.token);

      // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","db54881d-bcf5-4c7b-a2e3-d33fe7e25de7"]

      const testResult = await submitToken(resultToken);
      // console.log(testResult);

      for (const test of testResult) {

        if (test.status_id != 3) {

          return res.status(400).send("Error Occured")
        }
      }

    }


    const newDSA_Problem = await Problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });

    res.status(201).send(newDSA_Problem);

  }

  catch (err) {

    res.status(500).send("Error:" + err);

  }
}

const deleteProblem = async (req, res) => {

  const { id } = req.params;

  try {

    if (!id) {

      return res.status(404).send("Id is missing");
    }

    const deletedProblem = await Problem.findByIdAndDelete(id);

    if (!deleteProblem) {

      return res.status(400).send("Problem is missing");

    }

    res.status(201).send("Problem deleted Successfully");

  }
  catch (err) {

    res.status(500).send("Error:" + err);

  }


}

const getProblemById = async (req, res) => {

  const { id } = req.params;

  try {

    if (!id) {
      return res.status(404).send("Id is Missing");
    }
  
    const DSA_Problem = await Problem.findById(id).select('_id title description startCode visibleTestCases difficulty tags referenceSolution');

        // -hiddenTestCases  to deselect

    if (!DSA_Problem) {
      return res.status(404).send("Problem is Missing");
    }

    res.status(201).send(DSA_Problem);

  }
  catch (err) {

    res.status(500).send("Error:" + err);

  }





}

const getAllProblems = async (req,res)=>{


  try {


    const DSA_Problems = await Problem.find({}).select('_id title difficulty tags ');

    if (DSA_Problems.length===0) {
      return res.status(404).send("Problems are Missing");
    }

    res.status(201).send(DSA_Problems);

  }
  catch (err) {

    res.status(500).send("Error:" + err);

  }


}

const solvedProblems = async (req,res)=>{
  
  try{

  //    const count = req.result.problemSolved.length;
  // res.status(201).send(length);

  const userId = req.result._id;
  const user = await User.findById(userId).populate({
    path:"problemSolved",
    select:"_id title difficulty tags"
  }); 
  // to fetch the data of the field , from refernced one

   res.status(200).send(user.problemSolved);


  }
  catch(err){
    res.status(500).send("Error "+err);
  }
}

const submittedProblem = async(req,res)=>{

  try{

    const userId = req.result._id;
    const problemId = req.params.pid;

    const ans = await Submission.find({userId,problemId});

    if(ans.length===0){
      res.status(200).send("No Submission is Present");
    }

    res.status(200).send(ans);

 
  }
  catch(err){

      res.status(500).send("Internal Server Error "+ err);

  }
}


module.exports = { createProblem, updateProblem, deleteProblem, getProblemById,getAllProblems,solvedProblems,submittedProblem };