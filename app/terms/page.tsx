export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="terms py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
            <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              Условия за ползване
            </h1>

            <div className="space-y-8">
              <section className="prose prose-gray max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">
                  Добре дошли в нашия сайт! Настоящите условия за ползване
                  обясняват как обработваме вашите лични данни и какви права
                  предоставяте при използването на нашите услуги. Моля,
                  прочетете внимателно тези условия преди да използвате сайта ни
                  или да предоставите лична информация.
                </p>
              </section>

              {/* Sections with consistent styling */}
              {[
                "1. Събиране на информация",
                "2. Използване на информацията",
                "3. Съхранение и защита на данните",
                "4. Вашите права",
                "5. Снимки и изображения",
                "6. Контакти",
              ].map((title, index) => (
                <section key={index} className="bg-gray-50 p-6 rounded-xl">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-orange-200 pb-2">
                    {title}
                  </h2>
                  {/* Content remains the same, just styled differently */}
                  <div className="prose prose-gray max-w-none">
                    {index === 0 && (
                      <>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                          Ние събираме лична информация, която доброволно ни
                          предоставяте чрез формуляри за регистрация или при
                          използване на нашите услуги. Тази информация може да
                          включва:
                        </p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                          <li>Име и фамилия</li>
                          <li>Имейл адрес</li>
                          <li>Дата на раждане</li>
                          <li>Други данни, предоставени чрез формуляри</li>
                        </ul>
                      </>
                    )}
                    {index === 1 && (
                      <>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                          Вашите данни се използват за следните цели:
                        </p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                          <li>Осигуряване на достъп до услугите на сайта</li>
                          <li>Персонализация на потребителското изживяване</li>
                          <li>
                            Комуникация относно новини и други актуализации
                          </li>
                          <li>Подобряване на качеството на нашите услуги</li>
                        </ul>
                      </>
                    )}
                    {index === 2 && (
                      <p className="mb-4 text-gray-700 leading-relaxed">
                        Ние прилагаме подходящи технически и организационни
                        мерки за защита на вашите данни срещу неоторизиран
                        достъп, загуба или злоупотреба. Вашите данни се
                        съхраняват само за необходимия период от време, за да
                        изпълним целите, за които са събрани.
                      </p>
                    )}
                    {index === 3 && (
                      <>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                          Вие имате право да:
                        </p>
                        <ul className="list-disc pl-6 mb-4 text-gray-700">
                          <li>
                            Достъпвате и получавате информация за събраните за
                            вас данни
                          </li>
                          <li>Искате корекция на неточни данни</li>
                          <li>Заявявате изтриване на вашите данни</li>
                          <li>
                            Подавате жалба до органите за защита на личните
                            данни
                          </li>
                        </ul>
                      </>
                    )}
                    {index === 4 && (
                      <p className="mb-4 text-gray-700 leading-relaxed">
                        С предоставянето на лична информация и използването на
                        нашите услуги, вие се съгласявате да бъдете показвани в
                        снимки и изображения, които могат да бъдат публикувани
                        на нашия сайт или в други медии. Предоставянето и
                        публикуването на снимки и изображения е доброволно.
                      </p>
                    )}
                    {index === 5 && (
                      <p className="mb-4 text-gray-700 leading-relaxed">
                        Ако имате въпроси или искате да упражните правата си,
                        можете да се свържете с нас на:
                      </p>
                    )}
                  </div>
                </section>
              ))}

              {/* Contact section with improved styling */}
              <div className="mt-8 bg-orange-50 p-6 rounded-xl">
                <div className="space-y-2">
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold">Имейл:</span>
                    <a
                      href="mailto:info@foxorient.com"
                      className="text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      info@foxorient.com
                    </a>
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold">Телефон (Петър):</span>
                    <a
                      href="tel:+359877902410"
                      className="text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      +359 877 902 410
                    </a>
                  </p>
                  <p className="text-gray-700 flex items-center gap-2">
                    <span className="font-semibold">Телефон (Стоян):</span>
                    <a
                      href="tel:+359886936357"
                      className="text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      +359 886 936 357
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
