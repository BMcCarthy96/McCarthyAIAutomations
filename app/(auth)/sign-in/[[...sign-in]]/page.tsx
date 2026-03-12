import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-premium px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white/5 border border-white/10 shadow-xl rounded-2xl",
          },
          variables: {
            colorPrimary: "#6366f1",
            colorBackground: "rgba(255,255,255,0.05)",
            colorInputBackground: "rgba(255,255,255,0.05)",
            colorInputText: "#fafafa",
            colorText: "#fafafa",
            colorTextSecondary: "#a1a1aa",
            borderRadius: "0.75rem",
          },
        }}
      />
    </div>
  );
}
