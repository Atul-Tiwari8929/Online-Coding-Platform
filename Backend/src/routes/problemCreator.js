
const express=require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const problemRouter = express.Router();
const {createProblem,updateProblem,deleteProblem,getAllProblems,getProblemById,solvedProblems,submittedProblem} = require("../controllers/userProblem");
const userMiddleware = require('../middleware/userMiddleware');

problemRouter.post("/create",adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware,updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


problemRouter.get("/problemById/:id",userMiddleware,getProblemById);
problemRouter.get("/getAllProblems",userMiddleware,getAllProblems);
problemRouter.get("/problemsSolvedByUser",userMiddleware,solvedProblems);
problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem)



module.exports = problemRouter;
// Create
// fetch
//Delete
//Update
//