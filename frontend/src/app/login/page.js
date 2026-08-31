"use client";

import { useState } from "react";
import {
  User,
  Eye,
  EyeOff,
  ArrowRight,
  X,
} from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      return;
    }

    // Backend authentication will be connected later
    console.log("Username:", username);
    console.log("Password:", password);
  };

  const handleClose = () => {
    console.log("Close login");
  };

  return (
    <main
      className="
        fixed
        inset-0
        z-50
        flex
        items-start
        justify-center
        overflow-y-auto
        bg-black/30
        p-4
      "
    >
      {/* =====================================================
          LOGIN MODAL
      ====================================================== */}
      <div
        className="
          relative
          mt-[40px]
          mb-4
          w-[590px]
          max-w-full
          overflow-hidden
          rounded-[24px]
          bg-white
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
        "
      >
        {/* ===================================================
            HEADER IMAGE
        ==================================================== */}
        <div
          className="
            relative
            h-[145px]
            w-full
            overflow-hidden
          "
        >
          <img
            src="/train.png"
            alt="Indian Railways"
            className="
              block
              h-full
              w-full
              object-fill
            "
          />

          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close login"
            className="
              absolute
              right-[12px]
              top-[12px]
              z-20
              flex
              h-[34px]
              w-[34px]
              items-center
              justify-center
              rounded-full
              bg-white/70
              text-[#17233f]
              shadow-[0_2px_6px_rgba(0,0,0,0.10)]
              transition
              duration-200
              hover:bg-white
            "
          >
            <X
              size={18}
              strokeWidth={2.5}
            />
          </button>
        </div>

        {/* ===================================================
            USER LOGIN TAB
        ==================================================== */}
        <div
          className="
            relative
            flex
            h-[44px]
            items-center
            justify-center
            gap-[10px]
            border-b
            border-[#e1e1e1]
            bg-white
          "
        >
          {/* Active indicator */}
          <div
            className="
              absolute
              bottom-0
              left-0
              h-[2px]
              w-full
              bg-[#264673]
            "
          />

          <User
            size={22}
            strokeWidth={2}
            className="text-[#264673]"
          />

          <h1
            className="
              text-[16px]
              font-bold
              tracking-wide
              text-[#264673]
            "
          >
            USER LOGIN
          </h1>
        </div>

        {/* ===================================================
            FORM AREA
        ==================================================== */}
        <div className="bg-white">
          <form
            onSubmit={handleLogin}
            className="
              px-[24px]
              pb-[20px]
              pt-[20px]
            "
          >
            {/* =================================================
                USERNAME
            ================================================== */}
            <div className="mb-[11px]">
              <label
                htmlFor="username"
                className="
                  relative
                  z-10
                  mb-[-2px]
                  ml-[10px]
                  block
                  text-[12px]
                  text-[#394260]
                "
              >
                Username
              </label>

              <div
                className="
                  relative
                  flex
                  h-[54px]
                  items-center
                  rounded-[11px]
                  border
                  border-[#e1e7f0]
                  bg-[#f8faff]
                "
              >
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="Enter Username"
                  autoComplete="username"
                  className="
                    h-full
                    w-full
                    bg-transparent
                    px-[14px]
                    pr-[48px]
                    pt-[8px]
                    text-[14px]
                    text-[#264673]
                    outline-none
                    placeholder:text-[#6c7b91]
                  "
                />

                <User
                  size={18}
                  className="
                    absolute
                    right-[16px]
                    text-[#264673]
                  "
                />
              </div>
            </div>

            {/* =================================================
                PASSWORD
            ================================================== */}
            <div className="mb-[13px]">
              <label
                htmlFor="password"
                className="
                  relative
                  z-10
                  mb-[-2px]
                  ml-[10px]
                  block
                  text-[12px]
                  text-[#394260]
                "
              >
                Password
              </label>

              <div
                className="
                  relative
                  flex
                  h-[54px]
                  items-center
                  rounded-[11px]
                  border
                  border-[#e1e7f0]
                  bg-[#f8faff]
                "
              >
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="
                    h-full
                    w-full
                    bg-transparent
                    px-[14px]
                    pr-[48px]
                    pt-[8px]
                    text-[14px]
                    text-[#264673]
                    outline-none
                    placeholder:text-[#6c7b91]
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="
                    absolute
                    right-[15px]
                    text-[#264673]
                    transition
                    hover:opacity-70
                  "
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* =================================================
                FORGOT ACCOUNT
            ================================================== */}
            <div className="mb-[15px] flex justify-center">
              <button
                type="button"
                className="
                  text-[13px]
                  font-semibold
                  text-[#264673]
                  underline
                  underline-offset-[2px]
                  transition
                  hover:text-[#192f4d]
                "
              >
                Forgot account details?
              </button>
            </div>

            {/* =================================================
                LOGIN BUTTON
            ================================================== */}
            <button
              type="submit"
              disabled={!username || !password}
              className="
                flex
                h-[50px]
                w-full
                items-center
                justify-center
                gap-[7px]
                rounded-full
                bg-[#d0daec]
                text-[15px]
                font-bold
                text-[#264673]
                transition
                duration-200
                hover:bg-[#c0d1e4]
               
              "
            >
              <ArrowRight
                size={20}
                strokeWidth={2}
              />

              LOGIN
            </button>

            {/* =================================================
                OR DIVIDER
            ================================================== */}
            <div
              className="
                my-[15px]
                flex
                items-center
                gap-[11px]
              "
            >
              <div
                className="
                  h-px
                  flex-1
                  bg-[#d2d4d8]
                "
              />

              <span
                className="
                  text-[12px]
                  font-medium
                  text-[#777b84]
                "
              >
                OR
              </span>

              <div
                className="
                  h-px
                  flex-1
                  bg-[#d2d4d8]
                "
              />
            </div>

            {/* =================================================
                SIGN UP
            ================================================== */}
            <button
              type="button"
              className="
                h-[50px]
                w-full
                rounded-full
                border
                border-[#e1e4e9]
                bg-white
                text-[14px]
                font-semibold
                text-[#17203e]
                transition
                duration-200
                hover:bg-[#f8f9fb]
              "
            >
              Don't have an account?

              <span
                className="
                  ml-[4px]
                  text-[#264673]
                "
              >
                Sign Up
              </span>
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}