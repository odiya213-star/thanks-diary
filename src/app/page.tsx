import Link from "next/link";
import { redirect } from "next/navigation";

import { signOut } from "@/app/auth/actions";
import { SubmitButton } from "@/app/components/submit-button";
import { createEntry, deleteEntry, updateEntry } from "@/app/diary-actions";
import { createClient } from "@/lib/supabase/server";

import aiStyles from "./ai.module.css";
import styles from "./page.module.css";

type HomePageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

function todayInKorea() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}

export default async function Home({ searchParams }: HomePageProps) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getClaims();
  const userId = authData?.claims?.sub;

  if (!userId) {
    redirect("/login");
  }

  const email = typeof authData.claims.email === "string"
    ? authData.claims.email
    : "감사 기록자";
  const { data: entries, error: entriesError } = await supabase
    .from("gratitude_entries")
    .select("id, entry_date, content, ai_reflection, created_at")
    .eq("user_id", userId)
    .order("entry_date", { ascending: false });
  const params = await searchParams;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link className={styles.brand} href="/">
          <span aria-hidden="true">✦</span>
          하루감사
        </Link>
        <div className={styles.account}>
          <span>{email}</span>
          <form action={signOut}>
            <button type="submit">로그아웃</button>
          </form>
        </div>
      </header>

      <div className={styles.shell}>
        <section className={styles.hero}>
          <p className={styles.eyebrow}>TODAY&apos;S GRATITUDE</p>
          <h1>오늘, 어떤 순간이<br />마음을 따뜻하게 했나요?</h1>
          <p>크고 특별한 일이 아니어도 괜찮아요.<br />지금 떠오르는 한 가지를 천천히 적어보세요.</p>
        </section>

        {(params.error || entriesError) && (
          <p className={`${styles.notice} ${styles.error}`} role="alert">
            {params.error ?? "일기를 불러오지 못했습니다. 잠시 후 새로고침해 주세요."}
          </p>
        )}
        {params.message && (
          <p className={`${styles.notice} ${styles.success}`} role="status">
            {params.message}
          </p>
        )}

        <section className={styles.composer} aria-labelledby="new-entry-title">
          <div className={styles.composerHeading}>
            <div>
              <span className={styles.number}>01</span>
              <h2 id="new-entry-title">오늘의 감사 기록</h2>
            </div>
            <span className={styles.prompt}>한 문장부터 시작해도 좋아요</span>
          </div>
          <form action={createEntry} className={styles.entryForm}>
            <label className={styles.dateField}>
              날짜
              <input type="date" name="entryDate" defaultValue={todayInKorea()} required />
            </label>
            <label className={styles.contentField}>
              <span className={styles.srOnly}>감사일기 내용</span>
              <textarea
                name="content"
                maxLength={2000}
                placeholder="오늘 고마웠던 순간을 적어보세요…"
                required
              />
            </label>
            <div className={styles.formFooter}>
              <span>최대 2,000자</span>
              <SubmitButton
                idleLabel="기록 남기기"
                pendingLabel="공가미가 답장을 쓰고 있어요…"
                showArrow
              />
            </div>
          </form>
          <p className={aiStyles.consent}>
            기록하면 공가미의 답장을 만들기 위해 이 일기 내용만 Groq로 전송됩니다.
          </p>
        </section>

        <section className={styles.archive} aria-labelledby="archive-title">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.number}>02</span>
              <h2 id="archive-title">차곡차곡 쌓인 감사</h2>
            </div>
            <span>{entries?.length ?? 0}개의 기록</span>
          </div>

          {!entries?.length ? (
            <div className={styles.empty}>
              <span aria-hidden="true">✦</span>
              <h3>아직 기록이 없어요</h3>
              <p>위에서 오늘의 첫 감사를 남겨보세요.</p>
            </div>
          ) : (
            <div className={styles.entryList}>
              {entries.map((entry) => (
                <article className={styles.entryCard} key={entry.id}>
                  <div className={styles.entryTopline}>
                    <time dateTime={entry.entry_date}>{formatDate(entry.entry_date)}</time>
                    <span aria-hidden="true">✦</span>
                  </div>
                  <p className={styles.entryContent}>{entry.content}</p>
                  {entry.ai_reflection && (
                    <aside className={aiStyles.reflection}>
                      <div className={aiStyles.reflectionHeader}>
                        <span aria-hidden="true">✦</span>
                        공가미의 답장
                      </div>
                      <p>{entry.ai_reflection}</p>
                    </aside>
                  )}
                  <div className={styles.cardActions}>
                    <details className={styles.editDetails}>
                      <summary>수정</summary>
                      <form action={updateEntry} className={styles.editForm}>
                        <input type="hidden" name="id" value={entry.id} />
                        <input type="date" name="entryDate" defaultValue={entry.entry_date} required />
                        <textarea name="content" defaultValue={entry.content} maxLength={2000} required />
                        <p className={aiStyles.editNote}>
                          수정하면 공가미도 새 내용에 맞춰 다시 답장해요.
                        </p>
                        <SubmitButton
                          idleLabel="수정 저장"
                          pendingLabel="공가미가 새 답장을 쓰고 있어요…"
                        />
                      </form>
                    </details>
                    <details className={styles.deleteDetails}>
                      <summary>삭제</summary>
                      <form action={deleteEntry}>
                        <input type="hidden" name="id" value={entry.id} />
                        <span>정말 삭제할까요?</span>
                        <button type="submit">삭제 확인</button>
                      </form>
                    </details>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className={styles.footer}>작은 감사가 모여 좋은 하루가 됩니다.</footer>
    </main>
  );
}
