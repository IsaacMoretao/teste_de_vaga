import { useState } from "react";
import { api } from "../lib/axios";
import { XCircle } from "@phosphor-icons/react";

interface DataEdit {
  title: string;
  onClose: () => void;
  desiredWeeklyFrequency: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  imageURL: any;
  setDesiredWeeklyFrequency: (value: number) => void;
  productId: string;
}

export function Modal({
  title,
  onClose,
  desiredWeeklyFrequency,
  setDesiredWeeklyFrequency,
  productId,
  imageURL
}: DataEdit) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("desiredWeeklyFrequency", `${desiredWeeklyFrequency}`);
      if (imageFile) formData.append("image", imageFile);

      const response = await api.put(`/updateGoals/${productId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.location.reload();

      console.log("Meta atualizada com sucesso:", response.data);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);

    // Atualiza o preview da imagem
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-[10px] flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg shadow-lg p-8 overflow-y-auto h-[90vh] max-w-lg border-[1px] border-zinc-600">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button onClick={onClose}>
            <XCircle size={30} color="#d00dfc" />
          </button>
        </div>

        <img
          src={previewImage || `http://localhost:3333${imageURL}`}
          alt="Preview"
          className="max-w-40 max-h-32 rounded-lg"
        />

        <div className="flex flex-col">
          <label className="text-zinc-400">Imagem (opcional):</label>
          <input
            type="file"
            className="mt-2 rounded border-[1px] border-zinc-300 px-4 py-2 bg-black"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <label className="text-zinc-300">
            Escolha uma frequência semanal:
          </label>
          {[1, 2, 3, 4, 5, 6, 7].map((value) => (
            <div
              key={value}
              className={`flex justify-between items-center rounded border-[1px] ${
                desiredWeeklyFrequency === value
                  ? "border-blue-500 bg-gray-200"
                  : "border-zinc-300 bg-black"
              } px-4 py-2`}
            >
              <input
                type="radio"
                id={`frequency-${value}`}
                name="frequency"
                value={value}
                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                checked={desiredWeeklyFrequency === value}
                onChange={() => setDesiredWeeklyFrequency(value)}
              />
              <label
                htmlFor={`frequency-${value}`}
                className="ml-2 text-sm text-gray-700"
              >
                {value} {value === 1 ? "vez por semana" : "vezes por semana"}
              </label>
              <figure>
                {["😴", "🙂", "😎", "😜", "🤨", "🤯", "🔥"][value - 1]}
              </figure>
            </div>
          ))}
        </div>

        <div className="flex gap-5 mt-6">
          <button
            onClick={handleSave}
            className="w-full bg-violet-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
          >
            Salvar
          </button>
          <button
            onClick={onClose}
            className="w-full bg-zinc-600 text-white py-2 px-4 rounded-lg hover:bg-zinc-600"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
