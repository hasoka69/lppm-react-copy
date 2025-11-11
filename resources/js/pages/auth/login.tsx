import { useForm } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(route("login"));
    }

    return (
        <div className="min-h-screen flex">

            {/* LEFT SIDE */}
            <div className="hidden lg:flex w-1/2 bg-white p-8 flex-col justify-center">
                <div className="w-full flex justify-start">
                    <img
                        src="/image/logo-lppm.png"
                        alt="logo-lppm"
                        className="h-14 w-auto mb-10 object-contain"
                    />
                </div>

                <div className="flex-1 flex items-center justify-center">
                    <img
                        src="/image/login-illustration.png"
                        alt="illustration"
                        className="max-w-full max-h-[500px] object-contain"
                    />
                </div>
            </div>

            {/* RIGHT SIDE LOGIN */}
            <div
                className="flex-1 flex items-center justify-center p-6 sm:p-12 relative"
                style={{
                    backgroundImage: "url('/image/bg-login.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-blue-900/55 backdrop-blur-[1px]" />

                <div className="w-full max-w-md relative z-10 text-white">
                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-extrabold drop-shadow-lg">Halo!</h1>
                        <p className="text-2xl opacity-90 mt-1 font-medium">
                            Selamat Datang Kembali 👋
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                className="w-full p-3 text-black bg-white rounded-2xl
                                           outline-none
                                           shadow-[4px_6px_0_0_#8B0000]
                                           focus:shadow-[5px_7px_0_0_#B30000]
                                           transition-shadow placeholder-gray-500"
                                placeholder="email@example.com"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-300 mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                required
                                value={data.password}
                                onChange={(e) => setData("password", e.target.value)}
                                className="w-full p-3 text-black bg-white rounded-2xl
                                           outline-none
                                           shadow-[4px_6px_0_0_#8B0000]
                                           focus:shadow-[5px_7px_0_0_#B30000]
                                           transition-shadow placeholder-gray-500"
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="text-xs text-red-300 mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 mt-2 rounded-full bg-red-700 hover:bg-red-800
                                       font-semibold text-white tracking-wide
                                       shadow-lg hover:shadow-xl hover:scale-[1.02]
                                       disabled:opacity-60 transition"
                        >
                            {processing ? "Loading..." : "Login"}
                        </button>
                    </form>

                    <div className="text-center text-xs text-gray-200 opacity-80 mt-6 space-x-4">
                        <span className="hover:underline cursor-pointer">Privacy Policy</span>
                        <span className="hover:underline cursor-pointer">Cookies Settings</span>
                    </div>
                </div>

                {/* Mobile Logo */}
                <div className="lg:hidden absolute top-4 left-4 z-20">
                    <img src="/image/logo-lppm.png" className="h-9 w-auto" />
                </div>
            </div>
        </div>
    );
}
