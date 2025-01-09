import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { startOfWeek, endOfWeek } from 'date-fns';

const prisma = new PrismaClient();

class GoalCompletionController {

  async pushGoalsCompletion(req: Request, res: Response) {
    try {
      const startOfCurrentWeek = startOfWeek(new Date());
      const endOfCurrentWeek = endOfWeek(new Date());
  
      const completedGoal = await prisma.goalCompletion.findMany({
        where: {
          createdAt: {
            gte: startOfCurrentWeek,
            lte: endOfCurrentWeek,
          },
        },
        include: {
          goal: true,
        },
      });


  
      return res.status(200).json({startOfCurrentWeek, endOfCurrentWeek, completedGoal});
    } catch (error) {
      console.error('Erro ao listar metas da semana:', error);
      return res.status(500).json({ error: 'Erro ao listar metas da semana.' });
    }
  }
  async CompleteGoal(req: Request, res: Response) {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(500).json({ error: 'É necessário referenciar a meta que deseja concluir.' });
      }
  
      const goal = await prisma.goal.findUnique({
        where: { id: id }
      });
  
      if (!goal) {
        return res.status(500).json({ error: 'Meta não encontrada.' });
      }
  
      const goalCompletionsCount = await prisma.goalCompletion.count({
        where: { goalId: id }
      });
  
      if (goalCompletionsCount >= goal.desiredWeeklyFrequency) {
        return res.status(400).json({ error: 'A frequência de metas concluídas já foi atingida.' });
      }
  
      const newPoint = await prisma.goalCompletion.create({
        data: {
          goalId: id,
        },
      });
  
      return res.status(201).json({ newPoint });
    } catch (error) {
      console.error('Erro ao concluir meta:', error);
      return res.status(500).json({ error: 'Erro ao concluir meta.' });
    }
  }
  

  async deleteGoal(req: Request, res: Response) {
    try {
      const { id } = req.params;
  
      if(!id){
        return res.status(500).json({ error: 'É necessário referenciar a meta que deseja Excluir.' });
      }

      const verifyGoalId = await prisma.goalCompletion.findMany({
        where: {
          goalId: id
        },
      });

      if(!verifyGoalId){
        return res.status(500).json({ error: 'Meta não encontrada.' });
      }

      await prisma.goalCompletion.delete({
        where: { id: id },
      });
  
      return res.status(200).json({ message: 'Meta deletada com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      return res.status(500).json({ error: 'Erro ao excluir meta.' });
    }
  }
  
}

export default new GoalCompletionController();