/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import styles from "../../styles/Register.module.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginModal = ({ open, onClose, onOpenRegister }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`,
        {
          email: data.email,
          password: data.password,
        }
      );

      // ✅ Store data in localStorage
      localStorage.setItem("user", JSON.stringify(res.data?.data));

      toast.success("Login successful 🚀");

      reset();
      onClose();

      // ✅ Redirect to Studio page
      router.push("/studio");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

useEffect(() => {
  if (open) {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
  } else {
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
  };
}, [open]);

  if (!open) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.logoWrapper}>
          <img
            src="/images/sarjan.png"
            alt="Sarjan AI"
            className={styles.logo}
          />
        </div>
        <h2 className={styles.title}>Welcome Back</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className={styles.field}>
            <input
              placeholder="Email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && <p>{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className={styles.field} style={{ position: "relative" }}>
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            <span
              className={styles.eyeIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            {errors.password && <p>{errors.password.message}</p>}
          </div>

          <button disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className={styles.switchAuth}>
          <span>Don’t have an account?</span>
          <button
            type="button"
            onClick={() => {
              onClose(); // Close Login
              onOpenRegister(); // Open Register
            }}
          >
            Register
          </button>
        </div>

        <button className={styles.closeBtn} onClick={handleClose}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
