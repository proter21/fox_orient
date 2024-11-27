import Link from 'next/link';

export default function LoginPage() {
  return (
    <main>
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-gray-800 text-white py-4 z-50 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="text-orange-500 text-2xl font-bold">
            <Link href="/">
              <a>FoxOrient</a>
            </Link>
          </div>
          <nav className="flex space-x-4">
            <Link href="#features">
              <a className="text-white hover:text-orange-400">Функции</a>
            </Link>
            <Link href="#events">
              <a className="text-white hover:text-orange-400">Събития</a>
            </Link>
            <Link href="/gallery">
              <a className="text-white hover:text-orange-400">Галерия</a>
            </Link>
            <Link href="#about">
              <a className="text-white hover:text-orange-400">За нас</a>
            </Link>
            <Link href="/register">
              <a className="text-white hover:text-orange-400">Регистрация</a>
            </Link>
          </nav>
        </div>
      </header>

      {/* Login Section */}
      <section className="login py-12">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Вход</h2>
          <form id="loginForm">
            <div className="form-group mb-4">
              <label htmlFor="username" className="block text-lg">Потребителско име</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="Вашето потребителско име"
                className="w-full p-3 border rounded"
              />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="password" className="block text-lg">Парола</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Парола"
                className="w-full p-3 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded text-lg"
            >
              Влезте
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p className="mb-4">&copy; 2024 FoxOrient. Всички права запазени.</p>
        <div className="space-x-4">
          <a href="#" className="text-orange-500 hover:text-orange-400">Facebook</a>
          <a href="#" className="text-orange-500 hover:text-orange-400">Instagram</a>
          <a href="#" className="text-orange-500 hover:text-orange-400">Twitter</a>
        </div>
      </footer>
    </main>
  );
}
