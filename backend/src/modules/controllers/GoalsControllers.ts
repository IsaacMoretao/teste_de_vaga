import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class GoalsControllers {

  async pushGoals(req: Request, res: Response) {
    try {
      const children = await prisma.goal.findMany({
        include: {
          goalCompletions: true,
        },
      });

      return res.status(200).json(children);
    } catch (error) {
      console.error('Erro ao listar metas:', error);
      return res.status(500).json({ error: 'Erro ao listar metas.' });
    }
  }

  async addGoal(req: Request, res: Response) {
    try {
      const { title, desiredWeeklyFrequency } = req.body;
      const imageFile = req.file; // A imagem estará em req.file

      if (!title && !desiredWeeklyFrequency) {
        return res.status(500).json({ error: 'É necessário passar os dados da atualização.' });
      }

      if (!imageFile){
        return res.status(500).json({ error: 'É necessário ter uma imagem.' });
      }

      const imageUrl = `/uploads/${imageFile.filename}`;

      const newGoal = await prisma.goal.create({
        data: {
          title,
          desiredWeeklyFrequency: Number(desiredWeeklyFrequency),
          imageUrl,
          createdAt: new Date(),
        },
      });

      return res.status(201).json(newGoal);
    } catch (error) {
      console.error("Erro ao adicionar meta:", error);
      return res.status(500).json({ error: "Erro ao adicionar meta." });
    }
  }

  async updateGoals(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, desiredWeeklyFrequency } = req.body;
      const imageFile = req.file;

      if (!id) {
        return res.status(500).json({ error: 'É necessário referenciar a meta que deseja atualizar.' });
      }

      if (!title && !desiredWeeklyFrequency) {
        return res.status(500).json({ error: 'É necessário passar os dados da atualização.' });
      }

      if (!imageFile){
        return res.status(500).json({ error: 'É necessário ter uma imagem.' });
      }

      const imageUrl = `/uploads/${imageFile.filename}`;

      const updatedChild = await prisma.goal.update({
        where: { id: id },
        data: {
          title,
          imageUrl,
          desiredWeeklyFrequency: Number(desiredWeeklyFrequency),
        },
      });

      return res.status(200).json(updatedChild);
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      return res.status(500).json({ error: 'Erro ao atualizar meta.' });
    }
  }

  async deleteGoal(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(500).json({ error: 'É necessário referenciar a meta que deseja Excluir.' });
      }

      await prisma.goal.delete({
        where: { id: id },
      });

      return res.status(200).json({ message: 'Meta deletada com sucesso.' });
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
      return res.status(500).json({ error: 'Erro ao excluir meta.' });
    }
  }

}

export default new GoalsControllers();