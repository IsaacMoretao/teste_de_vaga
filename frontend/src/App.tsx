import { Aside } from "./components/Aside";
import { Home } from "./components/Home";
import { api } from "./lib/axios";
import { NoGoal } from "./components/NoGoal";
import { useEffect, useState } from "react";

interface Product {
  id: string;
}

const App = () => {
  const [products, setProducts] = useState<Product[] | null>(null);

  const fetchProducts = async () => {
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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="flex items-start justify-center bg-zinc-950 min-h-[100vh] w-full">
      {products && products.length > 0 ? (
        <Home />
      ) : (
        <NoGoal/>
      )}
      <Aside />
    </div>
  );
};

export default App;
