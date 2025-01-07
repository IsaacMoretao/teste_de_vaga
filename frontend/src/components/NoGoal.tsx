import ImageMain from "../assets/lets-start.png";
import Logo from "../assets/Logo.png";
import { UseMenu } from '../context/AsideContext';

export function NoGoal() {
  const { toggleHidden } = UseMenu();
  return (
    <>
      <div className="flex flex-col my-auto items-center justify-center text-violet-50">
        <header>
          <img src={Logo} alt="logo in orbit" />
        </header>
        <main>
          <img src={ImageMain} alt="illustrative image of a woman launching a rocket" />
          <p className="w-[340px] text-center">
            Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora
            mesmo?
          </p>
        </main>
        <button
          className="bg-violet-500 rounded-lg px-3 py-2 m-5"
          onClick={toggleHidden}
        >
          + Cadastrar meta
        </button>
      </div>
    </>
  );
}
