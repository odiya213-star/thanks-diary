import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { signIn, signUp } from "@/app/auth/actions";
import { createClient } from "@/lib/supabase/server";

import styles from "./login.module.css";

export const metadata: Metadata = {
  title: "로그인",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (data?.claims?.sub) {
    redirect("/diary");
  }

  const params = await searchParams;

  return (
    <main className={styles.page}>
      <section className={styles.intro}>
        <Link className={styles.brand} href="/" aria-label="감사일기 홈">
          <span aria-hidden="true">✦</span>
          하루감사
        </Link>
        <div>
          <p className={styles.eyebrow}>A SMALL DAILY RITUAL</p>
          <h1>평범한 하루에서<br />고마움을 발견해요.</h1>
          <p className={styles.description}>
            하루에 한 번, 마음에 남은 고마운 순간을 기록하세요.
            작은 기록이 쌓여 나만의 따뜻한 계절이 됩니다.
          </p>
        </div>
        <blockquote>“행복해서 감사하는 것이 아니라,<br />감사해서 행복해집니다.”</blockquote>
      </section>

      <section className={styles.panel}>
        <div className={styles.formWrap}>
          <div className={styles.heading}>
            <span className={styles.mobileMark} aria-hidden="true">✦</span>
            <h2>다시 만나 반가워요</h2>
            <p>이메일로 로그인하거나 새 계정을 만들어 보세요.</p>
          </div>

          {params.error && (
            <p className={`${styles.notice} ${styles.error}`} role="alert">
              {params.error}
            </p>
          )}
          {params.message && (
            <p className={`${styles.notice} ${styles.success}`} role="status">
              {params.message}
            </p>
          )}

          <form className={styles.form}>
            <label>
              이메일
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="hello@example.com"
                required
              />
            </label>
            <label>
              비밀번호
              <input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="6자 이상 입력하세요"
                minLength={6}
                required
              />
            </label>
            <button className={styles.primaryButton} formAction={signIn}>
              로그인
            </button>
            <button className={styles.secondaryButton} formAction={signUp}>
              처음이라면 회원가입
            </button>
          </form>

          <p className={styles.help}>가입 시 이메일로 전송된 확인 링크를 눌러 주세요.</p>
        </div>
      </section>
    </main>
  );
}
