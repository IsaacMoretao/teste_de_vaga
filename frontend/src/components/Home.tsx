import { useEffect, useState } from "react";
import Icon from "../assets/icon.png";
import { UseMenu } from "../context/AsideContext";
import { api } from "../lib/axios";
import { CheckCircle, Pencil, Trash } from "@phosphor-icons/react";
import { Modal } from "./Modal";

interface Product {
  id: string;
  title: string;
  imageUrl?: string;
  desiredWeeklyFrequency: number;
  createdAt: string;
}

interface TypeListCompleteGoal {
  startOfCurrentWeek: string;
  endOfCurrentWeek: string;
  completedGoal: TypeCompletedGoal[];
}

interface TypeCompletedGoal {
  id: string;
  title: string;
  goalId: string;
  createdAt: string;
  goal: Record<string, null>; // Ajustado para maior flexibilidade
}

export function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toggleHidden } = UseMenu();
  const [products, setProducts] = useState<Product[] | null>(null);
  const [listCompleteGoal, setListCompleteGoal] = useState<TypeListCompleteGoal | null>(null);
  const [groupedGoals, setGroupedGoals] = useState<{ [key: string]: TypeCompletedGoal[] }>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedFrequency, setSelectedFrequency] = useState<number | null>(null);

  // Funções para abrir e fechar o modal
  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product);
    setSelectedFrequency(product.desiredWeeklyFrequency);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Função para deletar uma meta
  const handleDeleteGoal = async (id: string) => {
    try {
      const response = await api.delete(`/deleteGoals/${id}`);
      console.log(response.data.message);

      // Atualizar o estado de metas agrupadas
      setGroupedGoals((prevGroupedGoals) => {
        const updatedGroupedGoals = { ...prevGroupedGoals };
        Object.keys(updatedGroupedGoals).forEach((date) => {
          updatedGroupedGoals[date] = updatedGroupedGoals[date].filter(
            (goal) => goal.id !== id
          );
        });
        return updatedGroupedGoals;
      });

      window.location.reload();
    } catch (error) {
      console.error("Erro ao deletar a meta:", error);
    }
  };

  // Função para deletar uma conclusão de meta
  const handleDeleteGoalCompletion = async (id: string) => {
    try {
      const response = await api.delete(`/deleteCompleteGoal/${id}`);
      console.log(response.data.message);

      // Atualizar o estado de metas agrupadas
      setGroupedGoals((prevGroupedGoals) => {
        const updatedGroupedGoals = { ...prevGroupedGoals };
        Object.keys(updatedGroupedGoals).forEach((date) => {
          updatedGroupedGoals[date] = updatedGroupedGoals[date].filter(
            (goal) => goal.id !== id
          );
        });
        return updatedGroupedGoals;
      });

      // Atualizar o estado de `listCompleteGoal` após remoção
      setListCompleteGoal((prevList) => {
        if (!prevList) return null;
        const updatedCompletedGoals = prevList.completedGoal.filter(
          (goal) => goal.id !== id
        );
        return { ...prevList, completedGoal: updatedCompletedGoals };
      });
    } catch (error) {
      console.error("Erro ao deletar a conclusão da meta:", error);
    }
  };

  // Função para verificar o status de conclusão da meta
  const checkCompletionStatus = (goalId: string, desiredFrequency: number) => {
    if (!listCompleteGoal || !listCompleteGoal.completedGoal) return false;

    const goalCompletionsCount = listCompleteGoal.completedGoal.filter(
      (item: { goalId: string }) => item.goalId === goalId
    ).length;

    return goalCompletionsCount >= desiredFrequency;
  };

  // Função para agrupar as metas por dia
  const groupCompletedGoalsByDay = (goals: TypeCompletedGoal[]): { [key: string]: TypeCompletedGoal[] } => {
    if (!goals) return {};

    const groupedGoals: { [key: string]: TypeCompletedGoal[] } = {};
    goals.forEach((goal) => {
      const date = new Date(goal.createdAt).toLocaleDateString("pt-BR");
      if (!groupedGoals[date]) {
        groupedGoals[date] = [];
      }
      groupedGoals[date].push(goal);
    });
    return groupedGoals;
  };

  // Atualiza `groupedGoals` sempre que `listCompleteGoal` muda
  useEffect(() => {
    if (listCompleteGoal) {
      const grouped = groupCompletedGoalsByDay(listCompleteGoal.completedGoal);
      setGroupedGoals(grouped);
    }
  }, [listCompleteGoal]);

  // Função para formatar o intervalo de datas
  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const options = { day: "numeric", month: "long" } as const;

    const startFormatted = new Intl.DateTimeFormat("pt-BR", options).format(startDate);
    const endFormatted = new Intl.DateTimeFormat("pt-BR", options).format(endDate);

    const [startDay, startMonth] = startFormatted.split(" de ");
    const [endDay, endMonth] = endFormatted.split(" de ");

    return startMonth === endMonth
      ? `${startDay} a ${endDay} de ${startMonth}`
      : `${startFormatted} a ${endFormatted}`;
  };

  // Função para calcular os dados de conclusão
  const calculateCompletionData = () => {
    if (!listCompleteGoal) return { completed: 0, total: 0 };

    const totalGoals = listCompleteGoal.completedGoal.reduce((total, item) => {
      if (item.goal && item.goal.desiredWeeklyFrequency != null) {
        return total + item.goal.desiredWeeklyFrequency;
      }
      return total;
    }, 0);

    const completedGoals = listCompleteGoal.completedGoal.length;
    return { completed: completedGoals, total: totalGoals };
  };

  const { completed, total } = calculateCompletionData();
  const percentage = (completed / total) * 100;
  let formattedPercentage = parseFloat(percentage.toFixed(1));
  if (isNaN(formattedPercentage)) {
    formattedPercentage = 0;
  }

  // Função para buscar dados da meta
  const fetchData = async () => {
    try {
      const response = await api.get<TypeListCompleteGoal>("/listCompleteGoal");
      setListCompleteGoal(response.data);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    }
  };

  // Função para buscar metas
  const fetchGoal = async () => {
    try {
      const response = await api.get("/listGoals");
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("Os dados retornados não são um array:", response.data);
        setProducts([]);
      }
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      setProducts([]);
    }
  };

  const handleCreateCompleteGoal = async (id: string) => {
    try {
      const response = await api.post(`/createCompleteGoal/${id}`);
      window.location.reload(); // Reload the page after creating the goal
      console.log("Meta criada com sucesso:", response.data);
    } catch (error) {
      console.error("Erro ao criar meta:", error);
    }
  };

  // Chama a função de buscar dados quando o componente é montado
  useEffect(() => {
    fetchGoal();
    fetchData();
  }, []);

  return (
    <>
      <div className="flex flex-col w-[480px] items-start justify-center text-violet-50 text-sm">
        <header className="flex gap-5 border-b-[1px] border-zinc-900 flex-col w-full">
          <div className="flex justify-between items-center my-5">
            <div className="flex justify-center items-center">
              <img src={Icon} alt="logo in orbit" className="h-10" />
              <strong>
                {listCompleteGoal ? (
                  <>
                    {formatDateRange(
                      listCompleteGoal.startOfCurrentWeek,
                      listCompleteGoal.endOfCurrentWeek
                    )}
                  </>
                ) : (
                  <></>
                )}
              </strong>
            </div>

            <button
              onClick={toggleHidden}
              className="bg-violet-500 rounded-lg px-3 py-2"
            >
              + Cadastrar meta
            </button>
          </div>
          <figure className="flex w-full h-2 bg-zinc-400 rounded-full overflow-hidden">
            <figure
              className={`h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full`}
              style={{ width: `${formattedPercentage}%` }}
            />
          </figure>
          <div className="flex justify-between mb-7">
            <p className=" text-center">
              Você completou {completed} de {total} metas nesta semana.
            </p>
            <span>{formattedPercentage}%</span>
          </div>
        </header>
        <main className="w-full mt-7 ">
          <header className="flex w-full justify-start gap-2 overflow-x-auto mb-5">
            {products ? (
              products.map((product) => (
                <div>
                  <div className="flex justify-between w-full">
                    <button
                      className="bg-pink-500 p-1 rounded-full z-10"
                      onClick={() => {
                        setSelectedFrequency(product.desiredWeeklyFrequency);
                        handleOpenModal(product);
                      }}
                    >
                      <Pencil size={20} color="#000" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(product.id)}
                      className="bg-pink-500 p-1 righ-0  rounded-full z-10"
                    >
                      <Trash size={20} color="#000" />
                    </button>
                    {isModalOpen && selectedProduct && (
                      <Modal
                        title={selectedProduct.title}
                        onClose={handleCloseModal}
                        desiredWeeklyFrequency={selectedFrequency ||
                          selectedProduct.desiredWeeklyFrequency}
                        setDesiredWeeklyFrequency={setSelectedFrequency}
                        productId={selectedProduct.id}
                        imageURL={selectedProduct.imageUrl}
                      />
                    )}
                  </div>
                  <figure
                    key={product.id}
                    onClick={() => handleCreateCompleteGoal(product.id)}
                    className={`border-[1px] flex flex-col items-center justify-between border-zinc-800 border-dashed p-2 w-42 h-44 rounded-lg hover:bg-zinc-900  ${
                      checkCompletionStatus(
                        product.id,
                        product.desiredWeeklyFrequency
                      )
                        ? "opacity-50 cursor-default"
                        : "opacity-100 cursor-pointer"
                    }`}
                  >
                    <img
                      src={`http://localhost:3333${product.imageUrl}`}
                      className="max-w-40 max-h-32 rounded-lg"
                    />
                    + {product.title}
                  </figure>
                </div>
              ))
            ) : (
              <div className="text-red-500">
                !!! ERROR !!! Nenhum produto encontrado !!! ERROR !!!
              </div>
            )}
          </header>
          <strong className="text-lg my-5">Sua semana</strong>
          {Object.entries(groupedGoals).length > 0 ? (
            Object.entries(groupedGoals).map(([date, goals]) => (
              <div key={date} className="mb-4">
                <h3 className="text-lg font-semibold">{date}</h3>
                {goals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-3 my-2">
                    <CheckCircle size={16} color="#F472B6" />
                    <p>Você completou "{goal.goal.title}" às </p>
                    <p>
                      {new Date(goal.createdAt).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      h
                    </p>
                    <button
                      className="underline"
                      onClick={() => handleDeleteGoalCompletion(goal.id)}
                    >
                      Desfazer
                    </button>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="text-gray-500">
              Nenhum objetivo concluído nesta semana.
            </div>
          )}
        </main>
      </div>
    </>
  );
}
