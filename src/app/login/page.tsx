"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, ShieldCheck, User } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<"email" | "otp" | "name">("email");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [isNewUser, setIsNewUser] = useState(false);
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Failed to send OTP");
            } else {
                setStep("otp");
                setCountdown(60);
                // Focus first OTP input
                setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all digits entered
        if (value && index === 5) {
            const fullOtp = [...newOtp.slice(0, 5), value].join("");
            if (fullOtp.length === 6) {
                handleVerifyOTP(fullOtp);
            }
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOTP = async (otpCode?: string) => {
        const code = otpCode || otp.join("");
        if (code.length !== 6) {
            setError("Please enter the complete 6-digit OTP");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Verify OTP with API
            const verifyResponse = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: code }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok) {
                setError(verifyData.error || "Invalid OTP");
                setIsLoading(false);
                return;
            }

            // Check if this is a new user (no name set yet)
            if (verifyData.isNewUser) {
                setIsNewUser(true);
                setStep("name");
                setIsLoading(false);
                return;
            }

            // Sign in with NextAuth
            await completeLogin();
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const handleSetName = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            setError("Please enter your name");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Update user's name
            await fetch("/api/auth/update-name", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name: name.trim() }),
            });

            await completeLogin();
        } catch (err) {
            setError("Something went wrong. Please try again.");
            setIsLoading(false);
        }
    };

    const completeLogin = async () => {
        const result = await signIn("email-otp", {
            email,
            verified: "true",
            redirect: false,
        });

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    const handleResendOTP = async () => {
        if (countdown > 0) return;
        setOtp(["", "", "", "", "", ""]);
        await handleSendOTP({ preventDefault: () => { } } as React.FormEvent);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--cream)] px-4 py-12 pt-28">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 mb-4">
                        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                            <Image
                                src="/images/logo.jpg"
                                alt="BP Street Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-[var(--text-dark)]">
                        {step === "email" && "Welcome!"}
                        {step === "otp" && "Check Your Email"}
                        {step === "name" && "Almost Done!"}
                    </h1>
                    <p className="text-[var(--text-muted)] mt-1">
                        {step === "email" && "Sign in with your email"}
                        {step === "otp" && `We sent a code to ${email}`}
                        {step === "name" && "Tell us your name"}
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-[var(--border)]">
                    {error && (
                        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {step === "email" && (
                        <form onSubmit={handleSendOTP} className="space-y-5">
                            {/* Email Input */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-dark)] mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--saffron)] focus:border-transparent transition-all"
                                        placeholder="you@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || !email}
                                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin" size={20} />
                                        Sending OTP...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Get OTP <ArrowRight size={20} />
                                    </span>
                                )}
                            </button>
                        </form>
                    )}

                    {step === "otp" && (
                        <div className="space-y-5">
                            {/* OTP Input */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-dark)] mb-3 text-center">
                                    Enter 6-digit OTP
                                </label>
                                <div className="flex gap-2 justify-center">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => { otpInputRefs.current[index] = el; }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--saffron)] focus:border-transparent transition-all"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Resend */}
                            <div className="text-center">
                                {countdown > 0 ? (
                                    <p className="text-sm text-[var(--text-muted)]">
                                        Resend OTP in <span className="font-semibold text-[var(--saffron)]">{countdown}s</span>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={isLoading}
                                        className="text-sm text-[var(--saffron)] font-semibold hover:underline disabled:opacity-50"
                                    >
                                        Didn&apos;t receive? Resend OTP
                                    </button>
                                )}
                            </div>

                            {/* Verify Button */}
                            <button
                                onClick={() => handleVerifyOTP()}
                                disabled={isLoading || otp.join("").length !== 6}
                                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin" size={20} />
                                        Verifying...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <ShieldCheck size={20} /> Verify & Login
                                    </span>
                                )}
                            </button>

                            {/* Change Email */}
                            <button
                                type="button"
                                onClick={() => { setStep("email"); setOtp(["", "", "", "", "", ""]); setError(""); }}
                                className="w-full text-center text-sm text-[var(--text-muted)] hover:text-[var(--text-dark)]"
                            >
                                ← Change email address
                            </button>
                        </div>
                    )}

                    {step === "name" && (
                        <form onSubmit={handleSetName} className="space-y-5">
                            {/* Name Input */}
                            <div>
                                <label className="block text-sm font-medium text-[var(--text-dark)] mb-2">
                                    Your Name
                                </label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--saffron)] focus:border-transparent transition-all"
                                        placeholder="Enter your name"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading || !name.trim()}
                                className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="animate-spin" size={20} />
                                        Setting up...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        Continue <ArrowRight size={20} />
                                    </span>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Trust badge */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-1">
                        <ShieldCheck size={14} className="text-[var(--chutney)]" />
                        Secure login with email verification
                    </p>
                </div>
            </div>
        </div>
    );
}
