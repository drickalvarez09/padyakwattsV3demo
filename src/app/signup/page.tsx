"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

function calculatePasswordStrength(password: string) {
  if (!password) return { percentage: 0, message: "", color: "#9CA3AF" };
  let strength = 0;
  if (password.length >= 6) strength += 20;
  if (password.length >= 8) strength += 20;
  if (password.length >= 12) strength += 10;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[a-z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^A-Za-z0-9]/.test(password)) strength += 15;

  const percentage = Math.min(strength, 100);
  let message = "Weak";
  let color = "#EF4444";
  if (percentage >= 85) {
    message = "Very Strong";
    color = "#059669";
  } else if (percentage >= 70) {
    message = "Strong";
    color = "#10B981";
  } else if (percentage >= 40) {
    message = "Medium";
    color = "#F59E0B";
  }
  return { percentage, message, color };
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.length <= 3) return `+${digits}`;
  if (digits.length <= 6) return `+${digits.slice(0, 3)} ${digits.slice(3)}`;
  if (digits.length <= 9) return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9, 13)}`;
}

export default function SignupPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [terms, setTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = calculatePasswordStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!terms) {
      setError("You must agree to the terms and conditions!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          phone,
          address,
          terms,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed. Please try again.");
        return;
      }
      setSuccess("Account created successfully! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1200);
    } catch {
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="text-gray-800 min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #f0f9ff 100%)" }}
    >
      <div className="text-center mb-8 animate-fadeIn">
        <div className="energy-orb-lg mb-6">
          <i className="fas fa-bolt text-white text-4xl" />
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">PADYAKWATTS</h1>
        <p className="text-gray-600">Pedal-Powered Clean Energy</p>
      </div>

      <div className="login-container card w-full max-w-lg p-8 animate-slideIn">
        <h2 className="text-2xl font-bold text-center mb-8">Create Account</h2>

        {error && (
          <div className="message-box error mb-6">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-3" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}
        {success && (
          <div className="message-box success mb-6">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-3" />
              <div className="text-green-700 font-medium">{success}</div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <Link href="/" className="enhanced-link inline-flex items-center font-medium transition-colors duration-200">
            <i className="fas fa-arrow-left mr-2" />
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2" htmlFor="firstname">First Name *</label>
              <input
                className="enhanced-input"
                id="firstname"
                placeholder="John"
                required
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2" htmlFor="lastname">Last Name *</label>
              <input
                className="enhanced-input"
                id="lastname"
                placeholder="Doe"
                required
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block mb-2" htmlFor="email">Email Address *</label>
            <input
              className="enhanced-input"
              id="email"
              placeholder="you@example.com"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2" htmlFor="password">Password *</label>
            <div className="relative">
              <input
                className="enhanced-input pr-12"
                id="password"
                placeholder="Minimum 6 characters with special character"
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              <i className="fas fa-info-circle mr-1" />
              Must be at least 6 characters and include at least one special character.
            </p>
            <div className="mt-2">
              <div className="password-strength bg-gray-200 w-full h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${strength.percentage}%`, backgroundColor: strength.color }}
                />
              </div>
              {password && (
                <p className="text-xs mt-1" style={{ color: strength.color }}>
                  {strength.message} password
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block mb-2" htmlFor="confirm-password">Confirm Password *</label>
            <div className="relative">
              <input
                className={`enhanced-input pr-12 ${
                  passwordsMismatch ? "border-red-500" : passwordsMatch ? "border-green-500" : ""
                }`}
                id="confirm-password"
                placeholder="Re-enter your password"
                required
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label="Toggle password visibility"
              >
                <i className={`fas ${showConfirm ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
            </div>
            {passwordsMismatch && (
              <p className="text-sm text-red-500 mt-1">
                <i className="fas fa-times-circle mr-1" />
                Passwords do not match
              </p>
            )}
            {passwordsMatch && (
              <p className="text-sm text-green-500 mt-1">
                <i className="fas fa-check-circle mr-1" />
                Passwords match
              </p>
            )}
          </div>

          <div>
            <label className="block mb-2" htmlFor="phone">Phone Number *</label>
            <input
              className="enhanced-input"
              id="phone"
              placeholder="+63 912 345 6789"
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
            />
          </div>

          <div>
            <label className="block mb-2" htmlFor="location">Address *</label>
            <input
              className="enhanced-input"
              id="location"
              placeholder="Enter your full address"
              required
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex items-start">
            <label className="enhanced-checkbox items-start">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                required
              />
              <span className="checkmark mt-0.5" />
              <span className="text-gray-700 text-sm ml-2">
                I agree to the <a href="#" className="enhanced-link font-semibold">terms of use</a> and{" "}
                <a href="#" className="enhanced-link font-semibold">privacy policy</a> *
              </span>
            </label>
          </div>

          <button type="submit" className="enhanced-submit" disabled={loading}>
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2" />
                Creating Account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus mr-2" />
                Create Account
              </>
            )}
          </button>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-600 mb-4">Already have an account?</p>
            <Link
              href="/login"
              className="inline-block w-full py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all duration-300 flex items-center justify-center"
            >
              <i className="fas fa-sign-in-alt mr-2" />
              Sign In
            </Link>
          </div>
        </form>
      </div>

      <footer className="mt-12 text-center text-gray-500 text-sm">
        <p> © 2026 PADYAKWATTS. Powering communities with clean energy.</p>
      </footer>
    </main>
  );
}
