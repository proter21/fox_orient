import Image from "next/image";
import Link from "next/link";
import MyNavbar from "@/components/MyNavbar";
import MyFooter from "@/components/MyFooter";

export default function Home() {
  return (
    <main>
      <MyNavbar />

      <section className="relative bg-zinc-800 text-white h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 flex">
          <Image
            src="/images/WorldChamp2022.jpg"
            alt="Снимка 1"
            className="w-1/3 object-cover"
            width={600}
            height={400}
          />
          <Image
            src="/images/WorldChampCeremony2022.jpg"
            alt="Снимка 2"
            className="w-1/3 object-cover"
            width={600}
            height={400}
          />
          <Image
            src="/images/WorldChampChec2024.jpg"
            alt="Снимка 3"
            className="w-1/3 object-cover"
            width={600}
            height={400}
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-4">
          <h2 className="text-4xl font-bold mb-4">Добре дошли в FoxOrient</h2>
          <p className="text-lg mb-6">
            Интернет приложение за улеснена организация на състезания по спортно
            радиоориентиране.
          </p>
          <Link href="/register">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded text-lg">
              Започнете сега
            </button>
          </Link>
        </div>
      </section>

      <section
        id="features"
        className="bg-gray-100 py-12 text-center text-gray-800"
      >
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-6">
            Основни функции на приложението
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 shadow rounded">
              <h4 className="text-xl font-semibold mb-2">
                Лесно управление на състезанията
              </h4>
              <p>
                Организирайте събития и управлявайте записванията бързо и лесно.
              </p>
            </div>
            <div className="bg-white p-6 shadow rounded">
              <h4 className="text-xl font-semibold mb-2">
                Следете класациите на живо
              </h4>
              <p>Реално време резултати и класации за всички състезатели.</p>
            </div>
            <div className="bg-white p-6 shadow rounded">
              <h4 className="text-xl font-semibold mb-2">
                Карти и ориентиране
              </h4>
              <p>
                Достъп до интерактивни карти за по-лесно проследяване и
                навигация.
              </p>
            </div>
            <div className="bg-white p-6 shadow rounded">
              <h4 className="text-xl font-semibold mb-2">
                Сигурност и подкрепа
              </h4>
              <p>Проследяване и SOS функция за безопасност на участниците.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="events" className="bg-white py-12 text-center text-gray-800">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold mb-6">Предстоящи събития</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-100 p-6 shadow rounded">
              <h4 className="text-xl font-semibold mb-2">
                Състезание в Парк „Витоша“
              </h4>
              <p className="mb-4">Дата: 10.11.2024 | Място: Парк „Витоша“</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
                Регистрация
              </button>
            </div>
            <div className="bg-gray-100 p-6 shadow rounded">
              <h4 className="text-xl font-semibold mb-2">
                Национален турнир в Стара Загора
              </h4>
              <p className="mb-4">Дата: 20.12.2024 | Място: Стара Загора</p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
                Регистрация
              </button>
            </div>
          </div>
        </div>
      </section>

      <MyFooter />
    </main>
  );
}
