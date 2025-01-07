import express, { Router } from "express"
import GoalsControllers from "./modules/controllers/GoalsControllers";
import GoalCompletionController from "./modules/controllers/GoalCompletionController";
import upload from "./config/multerConfig";
import path from 'path';

// Registrar o fastify-static para servir arquivos da pasta 'assets'

const app = express()

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const port = 3333;
const baseURL = '0.0.0.0';

const cors = require("cors")

app.use(cors())

const router = Router();

router.get('/listGoals', GoalsControllers.pushGoals);
router.post('/createGoals', upload.single('image'), GoalsControllers.addGoal);
router.put('/updateGoals/:id', upload.single('image'), GoalsControllers.updateGoals);
router.delete('/deleteGoals/:id', GoalsControllers.deleteGoal);

router.get('/listCompleteGoal', GoalCompletionController.pushGoalsCompletion);
router.post('/createCompleteGoal/:id', GoalCompletionController.CompleteGoal);
router.delete('/deleteCompleteGoal/:id', GoalCompletionController.deleteGoal);

app.get('/', (req, res) => {
  res.send('Server is Running');
});

app.use(express.json());
app.use(router);

app.listen(port, baseURL, () => {
  console.log("http server running")
});