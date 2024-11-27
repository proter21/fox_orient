import MyNavbar from "@/components/MyNavbar";
import MyFooter from "@/components/MyFooter";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main>
      <MyNavbar />
      {/* Register Section */}
      <section className="register py-12 w-1/3 my-24 mx-auto shadow-sm shadow-black rounded-lg px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Регистрация</h2>
          <form id="registrationForm">
            <div className="form-group mb-4">
              <label htmlFor="firstName" className="block text-lg">
                Име
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                placeholder="Вашето име"
                className="w-full p-3 border rounded"
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="lastName" className="block text-lg">
                Фамилия
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                placeholder="Вашата фамилия"
                className="w-full p-3 border rounded"
              />
            </div>
            <div className="form-group mb-4">
              <label htmlFor="birthDate" className="block text-lg">
                Дата на раждане
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                required
                className="w-full p-3 border rounded"
              />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="password" className="block text-lg">
                Парола
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Парола"
                className="w-full p-3 border rounded"
              />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="terms" className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  required
                  className="mr-2"
                />
                Съгласявам се с&nbsp;
                <Link href="#" className="text-orange-500">
                  условията на сайта
                </Link>
              </label>
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded text-lg"
            >
              Регистрирай се
            </button>
          </form>
        </div>
      </section>
      <MyFooter />
    </main>
  );
}
