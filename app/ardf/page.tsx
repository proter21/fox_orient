import type React from "react";
import Link from "next/link";

const ArdfPage: React.FC = () => {
  return (
    <div className="bg-gray-100 py-12 mt-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-orange-500">
          Какво е ARDF?
        </h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Въведение в радиозасичането
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              Радиозасичането (ARDF) е вълнуващ спорт, който съчетава умения за
              ориентиране, физическа издръжливост и техническо познание.
              Състезателите използват специални приемници, за да локализират
              скрити радиопредаватели в непозната местност, като същевременно се
              състезават с времето и помежду си.
            </p>
            <Link
              href="#learn-more"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors inline-block"
            >
              Научете повече
            </Link>
          </div>
          <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/-47IqZ7p8I0?start=172"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div
          className="bg-white p-6 rounded-lg shadow-lg mb-12"
          id="learn-more"
        >
          <h2 className="text-2xl font-bold mb-4">История на ARDF</h2>
          <p className="text-lg leading-relaxed mb-4">
            Радиозасичането възниква в края на 1950-те години в Източна Европа.
            Бързо набира популярност, като до 1980 г. се провежда първото
            Световно първенство в Полша. Днес ARDF е глобален спорт с участници
            от цяла Европа, Азия, Северна Америка и други континенти.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">1950</div>
              <div className="text-sm">Възникване в Източна Европа</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">1980</div>
              <div className="text-sm">Първо Световно първенство</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">1990</div>
              <div className="text-sm">САЩ се присъединява</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500">2000+</div>
              <div className="text-sm">Глобално разпространение</div>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Как работи ARDF?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">1. Подготовка</h3>
              <p>Състезателите получават карта и специален радиоприемник.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">2. Откриване</h3>
              <p>Използват приемника за локализиране на скрити предаватели.</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-2">3. Финиширане</h3>
              <p>
                Състезателите трябва да открият всички предаватели възможно
                най-бързо.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Възрастови групи</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white shadow-lg rounded-lg">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="p-3 text-left">Група</th>
                  <th className="p-3 text-left">Възраст</th>
                  <th className="p-3 text-left">Брой предаватели</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3">М19</td>
                  <td className="p-3">19 г. и по-млади</td>
                  <td className="p-3">4</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">М21</td>
                  <td className="p-3">Всяка възраст</td>
                  <td className="p-3">5</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">М40</td>
                  <td className="p-3">40 г. и по-възрастни</td>
                  <td className="p-3">4</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">М50</td>
                  <td className="p-3">50 г. и по-възрастни</td>
                  <td className="p-3">4</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">М60</td>
                  <td className="p-3">60 г. и по-възрастни</td>
                  <td className="p-3">3</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">М70</td>
                  <td className="p-3">70 г. и по-възрастни</td>
                  <td className="p-3">3</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Ж19</td>
                  <td className="p-3">19 г. и по-млади</td>
                  <td className="p-3">4</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Ж21</td>
                  <td className="p-3">Всяка възраст</td>
                  <td className="p-3">4</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Ж35</td>
                  <td className="p-3">35 г.</td>
                  <td className="p-3">4</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3">Ж50</td>
                  <td className="p-3">50 г. и по-възрастни</td>
                  <td className="p-3">3</td>
                </tr>
                <tr>
                  <td className="p-3">Ж60</td>
                  <td className="p-3">60 г. и по-възрастни</td>
                  <td className="p-3">3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">
            Готови ли сте за предизвикателството?
          </h2>
          <Link
            href="/competitions"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors inline-block"
          >
            Запишете се за състезание
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArdfPage;
