"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function getCredentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

function loginRedirect(kind: "error" | "message", message: string) {
  redirect(`/login?${kind}=${encodeURIComponent(message)}`);
}

function friendlyAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "이메일 또는 비밀번호를 확인해 주세요.";
  }

  if (normalized.includes("already registered")) {
    return "이미 가입된 이메일입니다. 로그인해 주세요.";
  }

  if (normalized.includes("password") && normalized.includes("least")) {
    return "비밀번호는 6자 이상 입력해 주세요.";
  }

  return "요청을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

export async function signIn(formData: FormData) {
  const { email, password } = getCredentials(formData);

  if (!email || !password) {
    loginRedirect("error", "이메일과 비밀번호를 모두 입력해 주세요.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    loginRedirect("error", friendlyAuthError(error.message));
  }

  redirect("/diary");
}

export async function signUp(formData: FormData) {
  const { email, password } = getCredentials(formData);

  if (!email || !password) {
    loginRedirect("error", "이메일과 비밀번호를 모두 입력해 주세요.");
  }

  if (password.length < 6) {
    loginRedirect("error", "비밀번호는 6자 이상 입력해 주세요.");
  }

  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    loginRedirect("error", friendlyAuthError(error.message));
  }

  if (data.session) {
    redirect("/diary");
  }

  loginRedirect("message", "가입 확인 메일을 보냈습니다. 메일의 링크를 눌러 주세요.");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
