export default function TermsPage() {
  return (
    <main>
      {/* Terms Section */}
      <section className="terms py-12">
        <div className="container mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
              Условия за ползване
            </h1>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Добре дошли в нашия сайт! Настоящите условия за ползване обясняват
              как обработваме вашите лични данни и какви права предоставяте при
              използването на нашите услуги. Моля, прочетете внимателно тези
              условия преди да използвате сайта ни или да предоставите лична
              информация.
            </p>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              1. Събиране на информация
            </h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Ние събираме лична информация, която доброволно ни предоставяте
              чрез формуляри за регистрация, абонамент или при използване на
              нашите услуги. Тази информация може да включва:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Име и фамилия</li>
              <li>Имейл адрес</li>
              <li>Дата на раждане</li>
              <li>Други данни, предоставени чрез формуляри</li>
            </ul>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              2. Използване на информацията
            </h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Вашите данни се използват за следните цели:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>Осигуряване на достъп до услугите на сайта</li>
              <li>Персонализация на потребителското изживяване</li>
              <li>Комуникация относно промоции, новини и други актуализации</li>
              <li>Подобряване на качеството на нашите услуги</li>
            </ul>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              3. Съхранение и защита на данните
            </h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Ние прилагаме подходящи технически и организационни мерки за
              защита на вашите данни срещу неоторизиран достъп, загуба или
              злоупотреба. Вашите данни се съхраняват само за необходимия период
              от време, за да изпълним целите, за които са събрани.
            </p>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              4. Вашите права
            </h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Вие имате право да:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li>
                Достъпвате и получавате информация за събраните за вас данни
              </li>
              <li>Искате корекция на неточни данни</li>
              <li>Заявявате изтриване на вашите данни</li>
              <li>Подавате жалба до органите за защита на личните данни</li>
            </ul>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              5. Контакти
            </h2>
            <p className="mb-4 text-gray-700 leading-relaxed">
              Ако имате въпроси или искате да упражните правата си, можете да се
              свържете с нас на:
            </p>
            <p className="text-gray-700">
              Им��йл:{" "}
              <a href="mailto:info@foxorient.com" className="text-orange-500">
                info@foxorient.com
              </a>
            </p>
            <p className="text-gray-700">
              Телефон:{" "}
              <a href="tel:+359123456789" className="text-orange-500">
                +359 123 456 789
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
