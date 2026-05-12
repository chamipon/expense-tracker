import 'dotenv/config';
import express from "express";
import passport from 'passport';
import mongoose from "mongoose"

const app = express()
const port = 3000

app.get('/health', (req, res) => {
  res.send({status: 'healthy'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})