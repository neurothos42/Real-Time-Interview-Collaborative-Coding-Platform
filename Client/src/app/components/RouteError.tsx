import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router";
import { AlertCircle, ArrowLeft, RefreshCw, Home } from "lucide-react";

export default function RouteError() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title: string = "Something went wrong";
  let message: string = "We couldn't complete your request. Please try again.";

  if (isRouteErrorResponse(error)) {
    switch (error.status) {
      case 404:
        title = "Page Not Found";
        message = "The page you are looking for doesn't exist.";
        break;

      case 500:
        title = "Server Error";
        message = "Something went wrong on our server.";
        break;

      default:
        title = "Request Failed";
        message = "Unable to complete your request.";
    }
  } else if (error instanceof Error) {
    title = "Application Error";
    message =
      typeof error.message === "string"
        ? error.message
        : "Something unexpected happened. Please try again.";
  }

  return (
    <main className="relative min-h-screen overflow-hidden flex items-center justify-center px-6 bg-[#050816]">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-purple-500/20 blur-[120px] animate-pulse" />
        <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
      </div>

      {/* Card */}
      <section
        className="
        relative
        w-full max-w-lg
        rounded-[2rem]
        border border-white/10
        bg-white/[0.08]
        backdrop-blur-2xl
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        p-10
        text-center
        animate-[fadeIn_.5s_ease-out]
      "
      >
        {/* Error Icon */}
        <div
          className="
          relative mx-auto mb-8
          flex h-28 w-28
          items-center justify-center
          rounded-full
          bg-gradient-to-br
          from-red-500/20
          to-orange-500/20
          border border-red-400/20
        "
        >
          <div
            className="
            absolute inset-3 rounded-full
            bg-gradient-to-br
            from-red-500
            to-orange-500
            opacity-20
            blur-xl
          "
          />

          <AlertCircle
            className="
              relative
              h-14 w-14
              text-red-400
              animate-bounce
            "
          />
        </div>

        {/* Title */}
        <h1>{title}</h1>

        {/* Description */}
        <p
          className="
          mt-5
          text-base
          leading-7
          text-slate-300
        "
        >
          {message}
        </p>

        {/* Error Code */}
        {Boolean(error) && (
          <div
            className="
            mx-auto mt-6
            inline-flex
            rounded-full
            border border-white/10
            bg-white/5
            px-4 py-2
            text-sm
            text-slate-300
          "
          >
            Error Code:{" "}
            {isRouteErrorResponse(error) ? error.status : "CLIENT_ERROR"}
          </div>
        )}

        {/* Actions */}
        <div
          className="
          mt-10
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:justify-center
        "
        >
          <button
            onClick={() => navigate("/")}
            className="
              group
              flex items-center justify-center gap-2
              rounded-2xl
              bg-white/10
              border border-white/10
              px-6 py-3
              text-white
              transition-all
              duration-300
              hover:bg-white/20
              hover:-translate-y-1
            "
          >
            <Home className="h-4 w-4" />
            Home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="
              group
              flex items-center justify-center gap-2
              rounded-2xl
              bg-white
              px-6 py-3
              text-slate-900
              font-medium
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
          >
            <ArrowLeft
              className="
                h-4 w-4
                transition-transform
                group-hover:-translate-x-1
              "
            />
            Go Back
          </button>

          <button
            onClick={() => window.location.reload()}
            className="
              group
              flex items-center justify-center gap-2
              rounded-2xl
              bg-gradient-to-r
              from-blue-500
              to-indigo-600
              px-6 py-3
              text-white
              font-medium
              shadow-lg
              shadow-blue-500/30
              transition-all
              duration-300
              hover:-translate-y-1
              hover:shadow-blue-500/50
            "
          >
            <RefreshCw
              className="
                h-4 w-4
                transition-transform
                duration-500
                group-hover:rotate-180
              "
            />
            Retry
          </button>
        </div>

        <p
          className="
          mt-10
          text-xs
          text-slate-400
        "
        >
          Something unexpected happened. We're ready when you are.
        </p>
      </section>
    </main>
  );
}
