import type { Metadata } from "next";
import Link from "next/link";

import styles from "./landing.module.css";

const siteUrl = "https://thanks-diary.vercel.app";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "하루감사",
  alternateName: "감사일기",
  url: `${siteUrl}/`,
  description:
    "하루에 한 가지 고마운 순간을 기록하고 따뜻한 AI 답장을 받는 온라인 감사일기",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main className={styles.page}>
        <header className={styles.header}>
          <Link className={styles.brand} href="/" aria-label="하루감사 홈">
            <span aria-hidden="true">✦</span>
            하루감사
          </Link>
          <nav className={styles.nav} aria-label="주요 메뉴">
            <a href="#how-it-works">사용 방법</a>
            <a href="#benefits">감사 기록의 장점</a>
            <Link className={styles.loginLink} href="/login">로그인</Link>
          </nav>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow}>A SMALL DAILY RITUAL</p>
            <h1>오늘의 고마움을<br />한 문장으로 남겨보세요.</h1>
            <p className={styles.heroDescription}>
              하루에 한 번, 마음에 남은 순간을 기록하세요. 공감하는 AI 친구
              공가미가 당신의 이야기에 따뜻한 답장을 건넵니다.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/login">무료로 시작하기</Link>
              <a className={styles.textLink} href="#how-it-works">어떻게 사용하나요? →</a>
            </div>
          </div>
          <div className={styles.preview} aria-label="하루감사 기록 예시">
            <div className={styles.previewTop}>
              <span>오늘의 감사</span>
              <time dateTime="2026-10-03">10월 3일</time>
            </div>
            <blockquote>
              바쁜 아침에도 따뜻한 커피 한 잔을 건네준 동료에게 감사했다.
            </blockquote>
            <div className={styles.reply}>
              <strong><span aria-hidden="true">✦</span> 공가미의 답장</strong>
              <p>작은 배려를 알아보는 마음이 오늘을 더 따뜻하게 만들었네요.</p>
            </div>
          </div>
        </section>

        <section className={styles.steps} id="how-it-works" aria-labelledby="steps-title">
          <div className={styles.sectionIntro}>
            <p>HOW IT WORKS</p>
            <h2 id="steps-title">감사하는 습관은<br />가볍게 시작할 수 있어요.</h2>
          </div>
          <ol className={styles.stepList}>
            <li>
              <span>01</span>
              <h3>오늘을 떠올려요</h3>
              <p>크고 특별한 일이 아니어도 괜찮아요. 마음에 남은 한 순간이면 충분합니다.</p>
            </li>
            <li>
              <span>02</span>
              <h3>한 문장으로 적어요</h3>
              <p>날짜와 함께 기록하면 하루하루의 고마운 순간이 차곡차곡 쌓입니다.</p>
            </li>
            <li>
              <span>03</span>
              <h3>따뜻한 답장을 받아요</h3>
              <p>공가미가 기록을 읽고 오늘의 마음을 다정하게 되짚어 드립니다.</p>
            </li>
          </ol>
        </section>

        <section className={styles.benefits} id="benefits" aria-labelledby="benefits-title">
          <div>
            <p className={styles.eyebrow}>WHY GRATITUDE</p>
            <h2 id="benefits-title">평범한 하루에서<br />좋았던 순간을 발견해요.</h2>
          </div>
          <div className={styles.benefitList}>
            <article>
              <span aria-hidden="true">✦</span>
              <h3>나만의 비공개 기록</h3>
              <p>작성한 감사일기는 로그인한 본인만 볼 수 있도록 안전하게 보관됩니다.</p>
            </article>
            <article>
              <span aria-hidden="true">✦</span>
              <h3>부담 없는 하루 한 문장</h3>
              <p>잘 쓰려고 애쓰지 않아도 괜찮아요. 짧은 기록부터 천천히 시작하세요.</p>
            </article>
            <article>
              <span aria-hidden="true">✦</span>
              <h3>공감하는 AI 답장</h3>
              <p>공가미의 따뜻한 답장과 함께 내가 느낀 고마움을 한 번 더 바라봅니다.</p>
            </article>
          </div>
        </section>

        <section className={styles.cta}>
          <span aria-hidden="true">✦</span>
          <h2>오늘의 작은 감사를<br />지금 기록해 보세요.</h2>
          <p>가입하고 첫 번째 고마운 순간을 남기는 데 1분이면 충분합니다.</p>
          <Link className={styles.primaryButton} href="/login">하루감사 시작하기</Link>
        </section>

        <footer className={styles.footer}>
          <Link className={styles.brand} href="/"><span aria-hidden="true">✦</span>하루감사</Link>
          <p>작은 감사가 모여 좋은 하루가 됩니다.</p>
          <Link href="/login">로그인</Link>
        </footer>
      </main>
    </>
  );
}
