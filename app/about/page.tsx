import Image from "next/image";
import Link from "next/link";

const AboutUsPage = () => {
  return (
    <div className="bg-neutral-200 text-black py-16">
      <div className="container mx-auto px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-orange-500 mb-8 text-center">
            За нас
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Кои сме ние</h2>
              <p className="text-lg mb-4">
                Добре дошли в FoxOrient! Ние сме Българската Федерация по
                Радиоориентиране (БФРА), обединяваща ентусиасти и
                професионалисти в областта на спортното радиоориентиране и
                радиозасичането.
              </p>
              <p className="text-lg">
                Нашата мисия е да популяризираме и развиваме тези вълнуващи
                спортове в България, организирайки състезания, тренировки и
                събития за всички възрасти и нива на опит.
              </p>
            </div>
            <div className="relative h-64 md:h-auto rounded-lg overflow-hidden">
              <Image
                src="/images/WorldChamp2022.jpg"
                alt="Нашият екип"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Какво правим</h2>
            <ul className="list-disc pl-6 space-y-2 text-lg">
              <li>
                Организираме състезания по радиоориентиране на всички нива – от
                местни до международни.
              </li>
              <li>
                Предоставяме обучение за начинаещи и напреднали в спортните
                дисциплини.
              </li>
              <li>
                Сътрудничим с международни организации за обмен на опит и
                развитие на спортните стандарти.
              </li>
              <li>
                Разработваме иновативни технологии за подобряване на спортното
                изживяване.
              </li>
            </ul>
          </div>

          <div className="bg-orange-100 p-6 rounded-lg mb-12">
            <h2 className="text-3xl font-bold mb-4">Нашата визия</h2>
            <p className="text-lg">
              Стремим се да създадем динамична и приобщаваща общност, която
              насърчава спортния дух, техническите умения и любовта към
              природата. Нашата цел е да направим радиоориентирането достъпно и
              вълнуващо за всеки, независимо от възрастта или опита.
            </p>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Присъединете се към нас</h2>
            <div className="flex justify-center space-x-4">
              <Link
                href="/ardf"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Научете повече за ARDF
              </Link>
              <Link
                href="/competitions"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
              >
                Запиши се за състезание
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
