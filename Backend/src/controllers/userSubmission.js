
 const Problem= require("../models/problem")
 const Submission = require("../models/submission");
const { getLanguageById, submitBatch, submitToken } = require("../utils/ProblemUtility");

const submitCode = async (req,res)=>{

// to submit the code we need the the information about 
//userid and problem id

try{

    const userId = req.result._id;
    const problemId= req.params.id;

    const {language,code} = req.body;

    if(!userId || !code || !problemId || !language){

        return res.status(404).send("Some field missing");
    }

        // fetch the problem from the db to check the hidden test cases

       const problem = await Problem.findById(problemId);


       // testCases (hidden)

       const submittedResult = await Submission.create({
        userId,
        problemId,
        code,
        language,
        testCasesPassed:0,
        status:'pending',
        testCasesTotal:problem.hiddenTestCases.length

       }) 

   // Judge0 code ko submit karna hai
   const languageId = getLanguageById(language);

   
      const submissions = problem.hiddenTestCases.map((testCases) => ({

        source_code: code,
        language_id: languageId,
        stdin: testCases.input,
        expected_output: testCases.output
      }));

      const submitResult = await submitBatch(submissions);

      const resultToken = submitResult.map((value)=>value.token);

      const testResult = await submitToken(resultToken);


      // submittedResult ko update karna hoga
      
      let testCasesPassed =0;
      let runtime=0;
      let memory =0; 
      let status = 'accepted';
      let errorMessage = '';

      for(const test of testResult ){

        if(test.status_id ==3){
            testCasesPassed++;
            runtime = runtime+parseFloat(test.time);
            memory = Math.max(memory,test.memory);
        }
        else{

            if(test.status_id==4){
                status ='error';
                errorMessage = test.stderr
            }

            else {
                status = 'wrong'
            }

        }
      }

      // Store the reslt in the database
      submittedResult.status = status;
      submittedResult.testCasesPassed =testCasesPassed;
      submittedResult.errorMessage= errorMessage;
      submitResult.runtime=runtime;
      submittedResult.memory = memory;

      // or i can do Update by ID

      await submittedResult.save();

      // ProblemId ko insert Karna hai, if this problem id is not present in the problemSolved field of User schema
        
      console.log(req.result);

     if(!req.result.problemSolved.includes(problemId)){
        req.result.problemSolved.push(problemId);
        await req.result.save();
     }

      res.status(201).send(submittedResult);



    


}
catch(err){

    res.status(500).send("Internal Server Error "+ err);

}

} 

const runCode = async (req,res)=>{

    
try{

    const userId = req.result._id;
    const problemId= req.params.id;
  

    const {code,language} = req.body;

    if(!userId || !code || !problemId || !language){

        return res.status(404).send("Some field missing");

    }



       const problem = await Problem.findById(problemId);


   // Judge0 code ko submit karna hai
   const languageId = getLanguageById(language);

   
      const submissions = problem.visibleTestCases.map((testCases) => ({

        source_code: code,
        language_id: languageId,
        stdin: testCases.input,
        expected_output: testCases.output
      }));

      const submitResult = await submitBatch(submissions);

      const resultToken = submitResult.map((value)=>value.token);

      const testResult = await submitToken(resultToken);


      // submittedResult ko update karna hoga
      
    //   let testCasesPassed =0;
    //   let runtime=0;
    //   let memory =0; 
    //   let status = 'accepted';
    //   let errorMessage = '';

    //   for(const test of testResult ){

    //     if(test.status_id ==3){
    //         testCasesPassed++;
    //         runtime = runtime+parseFloat(test.time);
    //         memory = Math.max(memory,test.memory);
    //     }
    //     else{

    //         if(test.status_id==4){
    //             status ='error';
    //             errorMessage = test.stderr
    //         }

    //         else {
    //             status = 'wrong'
    //         }

    //     }
    //   }
  

      res.status(201).send(testResult);



    


}
catch(err){

    res.status(500).send("Internal Server Error "+ err);

}

    
}

module.exports = {submitCode,runCode};