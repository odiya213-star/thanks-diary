"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { generateGongamiReply } from "@/lib/generate-reflection";
import { createClient } from "@/lib/supabase/server";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

function homeRedirect(kind: "error" | "message", message: string): never {
  redirect(`/diary?${kind}=${encodeURIComponent(message)}`);
}

function readEntry(formData: FormData) {
  const content = String(formData.get("content") ?? "").trim();
  const entryDate = String(formData.get("entryDate") ?? "");

  if (!/^\d{4}-\d{2}-\d{2}$/.test(entryDate)) {
    homeRedirect("error", "날짜를 확인해 주세요.");
  }

  if (!content) {
    homeRedirect("error", "감사한 일을 한 글자 이상 적어 주세요.");
  }

  if (content.length > 2000) {
    homeRedirect("error", "감사일기는 2,000자 이내로 적어 주세요.");
  }

  return { content, entryDate };
}

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || !userId) {
    redirect("/login?error=" + encodeURIComponent("로그인이 필요합니다."));
  }

  return { supabase, userId };
}

function databaseErrorMessage(code?: string) {
  if (code === "23505") {
    return "선택한 날짜에는 이미 감사일기가 있습니다.";
  }

  return "일기를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.";
}

async function generateAndSaveReply(
  supabase: SupabaseClient,
  userId: string,
  id: string,
  content: string,
) {
  const reflection = await generateGongamiReply(content);

  if (!reflection) {
    return false;
  }

  const { error } = await supabase
    .from("gratitude_entries")
    .update({ ai_reflection: reflection })
    .eq("id", id)
    .eq("user_id", userId)
    .eq("content", content);

  return !error;
}

export async function createEntry(formData: FormData) {
  const { content, entryDate } = readEntry(formData);
  const { supabase, userId } = await getAuthenticatedClient();
  const { data: createdEntry, error } = await supabase
    .from("gratitude_entries")
    .insert({
      content,
      entry_date: entryDate,
      user_id: userId,
    })
    .select("id")
    .single();

  if (error || !createdEntry) {
    homeRedirect("error", databaseErrorMessage(error?.code));
  }

  const replySaved = await generateAndSaveReply(
    supabase,
    userId,
    createdEntry.id,
    content,
  );

  revalidatePath("/diary");

  if (!replySaved) {
    homeRedirect(
      "message",
      "감사일기는 저장했지만 공가미가 지금 답장하지 못했어요. 일기를 수정하면 다시 답장할게요.",
    );
  }

  homeRedirect("message", "오늘의 감사와 공가미의 답장을 기록했습니다.");
}

export async function updateEntry(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const { content, entryDate } = readEntry(formData);

  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    homeRedirect("error", "수정할 일기를 찾지 못했습니다.");
  }

  const { supabase, userId } = await getAuthenticatedClient();
  const { data: updatedEntry, error } = await supabase
    .from("gratitude_entries")
    .update({
      content,
      entry_date: entryDate,
      ai_reflection: null,
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select("id")
    .single();

  if (error || !updatedEntry) {
    homeRedirect("error", databaseErrorMessage(error?.code));
  }

  const replySaved = await generateAndSaveReply(
    supabase,
    userId,
    updatedEntry.id,
    content,
  );

  revalidatePath("/diary");

  if (!replySaved) {
    homeRedirect(
      "message",
      "감사일기는 수정했지만 공가미가 지금 답장하지 못했어요. 나중에 다시 수정해 주세요.",
    );
  }

  homeRedirect("message", "감사일기와 공가미의 답장을 새롭게 저장했습니다.");
}

export async function deleteEntry(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    homeRedirect("error", "삭제할 일기를 찾지 못했습니다.");
  }

  const { supabase, userId } = await getAuthenticatedClient();
  const { error } = await supabase
    .from("gratitude_entries")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    homeRedirect("error", "일기를 삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }

  revalidatePath("/diary");
  homeRedirect("message", "감사일기를 삭제했습니다.");
}
