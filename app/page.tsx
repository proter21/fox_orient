import Link from "next/link";
import { db, auth } from "@/firebase/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import type { Competition } from "@/interfaces";
import AutoplayCarousel from "@/components/AutoCarousel";
const features = [
  {
    title: "Лесно управление на състезанията",
    description:
      "Организирайте събития и управлявайте записванията бързо и лесно.",
  },
  {
    title: "Следете класациите на живо",
    description: "Реално време резултати и класации за всички състезатели.",
  },
  {
    title: "Карти и ориентиране",
    description:
      "Достъп до интерактивни карти за по-лесно проследяване и навигация.",
  },
  {
    title: "Сигурност и подкрепа",
    description: "Проследяване и SOS функция за безопасност на участниците.",
  },
];

async function getUpcomingCompetitions(): Promise<Competition[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const competitionsRef = collection(db, "competitions");
  const q = query(
    competitionsRef,
    where("date", ">=", today.toISOString()),
    orderBy("date", "asc"),
    limit(2)
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as Competition)
  );
}

export default async function Home() {
  const upcomingCompetitions = await getUpcomingCompetitions();
  const currentUser = auth.currentUser;
  let registeredCompetitions = [];

  if (currentUser) {
    const userDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (userDoc.exists()) {
      registeredCompetitions = userDoc.data().registeredCompetitions || [];
    }
  }

  return (
    <>
      <section className="relative bg-zinc-800 text-white h-screen flex items-center justify-center overflow-hidden">
        <AutoplayCarousel></AutoplayCarousel>

        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl font-bold mb-4">Добре дошли в FoxOrient</h1>
            <p className="text-lg mb-6">
              Интернет приложение за улеснена организация на състезания по
              спортно радиоориентиране.
            </p>
            <Link
              href="/register"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded text-lg transition-colors"
            >
              Започнете сега
            </Link>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="bg-gray-100 py-12 text-center text-gray-800"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">
            Основни функции на приложението
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 shadow rounded transition-transform hover:scale-105"
              >
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="events" className="bg-white py-12 text-center text-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Предстоящи събития</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingCompetitions.map((competition) => (
              <div
                key={competition.id}
                className="bg-gray-100 p-6 shadow rounded transition-transform hover:scale-105"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {competition.name}
                </h3>
                <p className="mb-4">
                  Дата: {new Date(competition.date).toLocaleDateString()} |
                  Място: {competition.location}
                </p>
                {registeredCompetitions.includes(competition.id) ? (
                  <p className="text-green-600 font-bold">
                    Вие сте регистрирани за това състезание.
                  </p>
                ) : (
                  <Link
                    href={`/competitions/${competition.id}/register`}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Регистрация
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
