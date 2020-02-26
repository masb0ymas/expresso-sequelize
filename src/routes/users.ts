import express, { Request, Response, NextFunction } from "express";
var router = express.Router();

/* GET user page. */
router.get("/", function(req: Request, res: Response, next: NextFunction) {
  res.send("respond with a resource");
});

module.exports = router;
