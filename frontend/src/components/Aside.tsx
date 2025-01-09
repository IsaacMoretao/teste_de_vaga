import { useState } from "react";
import { UseMenu } from "../context/AsideContext";
import { api } from "../lib/axios";

export function Aside() {
  const { hidden, toggleHidden } = UseMenu();

  // Estados para os campos do formulário
  const [title, setTitle] = useState("");
  const [desiredWeeklyFrequency, setDesiredWeeklyFrequency] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  
    // Configurar os dados para envio
    const formData = new FormData();
    formData.append("title", title);
    if (desiredWeeklyFrequency !== null) {
      formData.append("desiredWeeklyFrequency", desiredWeeklyFrequency.toString());
    }
    if (imageFile) {
      formData.append("image", imageFile);
    }
  
    try {
      // Enviar os dados para a API
      const response = await api.post("/createGoals", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      console.log("Meta criada com sucesso:", response.data);
  
      // Atualizar o estado para refletir a nova meta sem recarregar a página
      window.location.reload()
  
      // Resetar os campos do formulário
      setTitle("");
      setDesiredWeeklyFrequency(null);
      setImageFile(null);
  
      toggleHidden(); // Fechar o menu
    } catch (error) {
      console.error("Erro ao criar meta:", error);
    }
  }

  return (
    <div
      className={`${hidden} justify-end absolute w-full h-[100vh] backdrop-blur-[10px] z-30 text-sm`}
    >
      <aside className="flex flex-col w-[400px] p-8 bg-zinc-900 border-l-[1px] border-zinc-600">
        <header className="flex justify-between text-zinc-100">
          <h1 className="font-bold">Cadastrar meta</h1>
          <button onClick={toggleHidden}>X</button>
        </header>

        <p className="text-zinc-300">
          Adicione atividades que te fazem bem e que você quer continuar
          praticando toda semana.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col mt-6 text-zinc-100">
            <strong>Qual a atividade?</strong>
            <input
              type="text"
              className="rounded border-[1px] border-zinc-300 px-4 py-2 bg-black"
              placeholder="Praticar exercícios, meditar, etc..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="text-zinc-400">Imagem:</label>
            <input
              type="file"
              className="mt-2 rounded border-[1px] border-zinc-300 px-4 py-2 bg-black"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-zinc-300">Escolha uma frequência semanal:</label>
            {[1, 2, 3, 4, 5, 6, 7].map((value) => (
              <div
                key={value}
                className="flex justify-between items-center rounded border-[1px] border-zinc-300 px-4 py-2 bg-black"
              >
                <input
                  type="radio"
                  id={`frequency-${value}`}
                  name="frequency"
                  value={value}
                  className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  onChange={() => setDesiredWeeklyFrequency(value)}
                />
                <label
                  htmlFor={`frequency-${value}`}
                  className="ml-2 text-sm text-gray-700"
                >
                  {value} {value === 1 ? "vez por semana" : "vezes por semana"}
                </label>
                <figure>{["😴", "🙂", "😎", "😜", "🤨", "🤯", "🔥"][value - 1]}</figure>
              </div>
            ))}
          </div>

          <footer className="flex gap-3 justify-between">
            <button
              type="button"
              onClick={toggleHidden}
              className="bg-zinc-300 rounded-lg px-3 py-2 w-full"
            >
              Fechar
            </button>
            <button
              type="submit"
              className="bg-violet-500 rounded-lg px-3 py-2 w-full"
            >
              Salvar
            </button>
          </footer>
        </form>
      </aside>
    </div>
  );
}
