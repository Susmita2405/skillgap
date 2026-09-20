import {
  useState
} from "react";

import {
  Link,
  Navigate,
  useLocation,
  useNavigate
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  AlertCircle
} from "lucide-react";

import {
  useAuth
} from "../../context/AuthContext.jsx";

function Login() {
  const {
    login,
    isAuthenticated
  } = useAuth();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    form,
    setForm
  ] = useState({
    email: "",
    password: ""
  });

  const [
    showPassword,
    setShowPassword
  ] = useState(false);

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  const handleChange = (
    event
  ) => {
    const {
      name,
      value
    } = event.target;

    setForm(
      (previous) => ({
        ...previous,
        [name]: value
      })
    );
  };

  const handleSubmit =
    async (event) => {
      event.preventDefault();

      setError("");

      if (
        !form.email.trim() ||
        !form.password
      ) {
        setError(
          "Please enter your email and password."
        );

        return;
      }

      setLoading(true);

      try {
        await login({
          email:
            form.email.trim(),
          password:
            form.password
        });

        const destination =
          location.state?.from?.pathname ||
          "/dashboard";

        navigate(
          destination,
          {
            replace: true
          }
        );
      } catch (error) {
        setError(
          error.friendlyMessage ||
          "Unable to login. Please check your credentials."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center">
        <div className="w-full">
          <Link
            to="/"
            className="mb-8 block text-center text-xl font-bold tracking-tight"
          >
            Student
            <span className="text-blue-500">
              Career
            </span>
          </Link>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl sm:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">
                Welcome back
              </h1>

              <p className="mt-2 text-slate-400">
                Continue building your career.
              </p>
            </div>

            {error && (
              <div className="mb-6 flex gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                <AlertCircle
                  className="h-5 w-5 shrink-0"
                />

                <span>
                  {error}
                </span>
              </div>
            )}

            <form
              onSubmit={
                handleSubmit
              }
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={
                      form.password
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) =>
                          !value
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign in"}

                {!loading && (
                  <ArrowRight className="h-5 w-5" />
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;