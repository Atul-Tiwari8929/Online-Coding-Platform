const express = require("express");
const userMiddleware = require("../middleware/userMiddleware");
const submitRouter= express.Router();
const {submitCode,runCode} = require("../controllers/userSubmission");
const submitCodeRateLimiter = require("../middleware/ratelimiter");



submitRouter.post("/submit/:id",userMiddleware,submitCodeRateLimiter,submitCode);
submitRouter.post("/run/:id",userMiddleware,runCode);

module.exports = submitRouter;