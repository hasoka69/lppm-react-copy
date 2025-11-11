import { useForm } from "@inertiajs/react";

export default function Login() {
  const { data, setData, post, processing, errors } = useForm({
    email: "",
    password: "",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // gunakan route('login') jika Ziggy tersedia; jika tidak, post ke '/login'
    const loginRoute = typeof route === "function" ? route("login") : "/login";
    post(loginRoute);
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left */}
      <div className="hidden lg:flex w-1/2 bg-white p-8 flex-col">
        <div className="flex items-center gap-6">
          <img src="/images/logo-uas.png" alt="logo-uas" className="h-16" />
          <div className="flex flex-col">
            <img src="/images/logo-lppm.png" alt="logo-lppm" className="h-12" />
            <span className="text-xs text-gray-500">Lembaga Penelitian dan Pengabdian Masyarakat</span>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <img
            src="/images/login-illustration.png"
            alt="illustration"
            className="max-w-full max-h-[520px] object-contain"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-b from-blue-600 to-blue-500 text-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold">Halo!</h1>
              <p className="mt-1 text-sm opacity-90">Selamat Datang Kembali!</p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData("email", e.target.value)}
                  className={`w-full p-3 rounded-lg border ${errors.email ? "border-red-300" : "border-white/40"
                    } text-black`}
                  placeholder="Masukkan email"
                  required
                />
                {errors.email && (
                  <p className="text-xs text-red-200 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Password</label>
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData("password", e.target.value)}
                  className={`w-full p-3 rounded-lg border ${errors.password ? "border-red-300" : "border-white/40"
                    } text-black`}
                  placeholder="Masukkan password"
                  required
                />
                {errors.password && (
                  <p className="text-xs text-red-200 mt-1">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 mt-2 rounded-full bg-red-700 hover:bg-red-800 font-semibold transition"
              >
                {processing ? "Loading..." : "Login"}
              </button>
            </form>

            {/* Footer small links (register removed) */}
            <div className="flex justify-between text-xs mt-6 opacity-90">
              <span>Privacy Policy</span>
              <span>Cookies Settings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: show logos on top */}
      <div className="lg:hidden absolute top-4 left-4 flex items-center gap-3">
        <img src="/images/logo-uas.png" alt="logo-uas" className="h-10" />
        <img src="/images/logo-lppm.png" alt="logo-lppm" className="h-8" />
      </div>
    </div>
  );
}
