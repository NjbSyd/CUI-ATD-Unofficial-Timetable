import { createClient } from "@supabase/supabase-js";
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
console.log("🚀 ~ url:", url);
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
console.log("🚀 ~ key:", key);
const supabase = createClient(url, key);

// Create a function to handle inserts
const handleInserts = (payload) => {
  console.log("Change received!", payload);
};

export const subscribeToChanges = async () => {
  console.log("Subscribing to changes...");
  const subscribe = supabase
    .channel("custom-all-channel")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "todos" },
      handleInserts
    )
    .subscribe();
  return () => subscribe.unsubscribe();
};
