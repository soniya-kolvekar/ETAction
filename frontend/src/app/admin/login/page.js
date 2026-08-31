"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  X,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!adminId || !password) {
      return;
    }

    // Backend authentication will be connected later
    console.log("Admin ID:", adminId);

    // Temporary navigation
    router.push("/admin");
  };

  const handleClose = () => {
    router.push("/");
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
      {/* LOGIN CARD */}
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

        {/* ================================================
            HEADER IMAGE
        ================================================= */}
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

          {/* CLOSE */}
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

        {/* ================================================
            ADMIN LOGIN TAB
        ================================================= */}
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

          {/* ACTIVE LINE */}
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

          <ShieldCheck
            size={21}
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
            ADMIN LOGIN
          </h1>
        </div>

        {/* ================================================
            FORM
        ================================================= */}
        <div className="bg-white">

          <form
            onSubmit={handleLogin}
            className="
              px-[24px]
              pb-[20px]
              pt-[20px]
            "
          >

            {/* ADMIN ID */}
            <div className="mb-[11px]">

              <label
                htmlFor="adminId"
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
                Admin ID
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
                  bg-white
                "
              >

                <input
                  id="adminId"
                  type="text"
                  value={adminId}
                  onChange={(e) =>
                    setAdminId(e.target.value)
                  }
                  placeholder="Enter Admin ID"
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

            {/* PASSWORD */}
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
                  bg-white
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
                    setShowPassword(!showPassword)
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

            {/* SECURITY MESSAGE */}
            <div
              className="
                mb-[15px]
                flex
                items-center
                justify-center
                gap-[6px]
              "
            >
              <ShieldCheck
                size={14}
                className="text-[#4e8bb1]"
              />

              <span
                className="
                  text-[11px]
                  font-medium
                  text-[#718096]
                "
              >
                Authorized personnel only
              </span>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={!adminId || !password}
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
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              <ArrowRight
                size={20}
                strokeWidth={2}
              />

              LOGIN
            </button>

          </form>
        </div>

      </div>
    </main>
  );
}