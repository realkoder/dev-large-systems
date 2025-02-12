import express from "express";
import cors from 'cors';

const app = express();
const PORT = 9090;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ data: "hello there from USER_SERVICE" });
});

app.listen(PORT, () => console.log(`Express server instantiated PORT ${PORT}`));
