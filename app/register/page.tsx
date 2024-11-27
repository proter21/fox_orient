import MyNavbar from "@/components/MyNavbar";
import MyFooter from "@/components/MyFooter";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <main>
      <MyNavbar />
      <section className="register py-12 my-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Регистрация
          </h2>
          <div className="form bg-white rounded-lg shadow-lg p-8 w-full max-w-md mx-auto">
            <form id="registrationForm">
              <div className="form-group mb-4">
                <label
                  htmlFor="firstName"
                  className="block text-lg font-bold mb-2 text-gray-700"
                >
                  Име
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  placeholder="Вашето име"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              {/* Last Name */}
              <div className="form-group mb-4">
                <label
                  htmlFor="lastName"
                  className="block text-lg font-bold mb-2 text-gray-700"
                >
                  Фамилия
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  placeholder="Вашата фамилия"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              {/* Birth Date */}
              <div className="form-group mb-4">
                <label
                  htmlFor="birthDate"
                  className="block text-lg font-bold mb-2 text-gray-700"
                >
                  Дата на раждане
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              {/* Password */}
              <div className="form-group mb-6">
                <label
                  htmlFor="password"
                  className="block text-lg font-bold mb-2 text-gray-700"
                >
                  Парола
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  placeholder="Парола"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              {/* Terms */}
              <div className="form-group mb-6">
                <label
                  htmlFor="terms"
                  className="flex items-center text-gray-700"
                >
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    required
                    className="mr-2"
                  />
                  Съгласявам се с&nbsp;
                  <Link
                    href="/terms"
                    className="text-orange-500 underline font-bold"
                  >
                    условията на сайта
                  </Link>
                </label>
              </div>
              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary bg-orange-500 text-white w-full py-3 rounded-lg text-lg font-bold hover:bg-orange-600 transition-all"
              >
                Регистрирай се
              </button>
            </form>
          </div>
        </div>
      </section>
      <MyFooter />
    </main>
  );
}
