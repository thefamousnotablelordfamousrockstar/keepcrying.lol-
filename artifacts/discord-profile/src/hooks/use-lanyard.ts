import { useQuery } from "@tanstack/react-query";

export interface LanyardActivity {
  id: string;
  name: string;
  type: number;
  state?: string;
  details?: string;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
}

export interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string | null;
    discriminator: string;
    bot: boolean;
    global_name: string | null;
    display_name: string | null;
    avatar_decoration_data: any;
  };
  discord_status: "online" | "idle" | "dnd" | "offline";
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  active_on_discord_web: boolean;
  active_on_discord_desktop: boolean;
  active_on_discord_mobile: boolean;
}

export interface LanyardResponse {
  success: boolean;
  data: LanyardData;
}

export function useLanyard(userId: string) {
  return useQuery({
    queryKey: ["lanyard", userId],
    queryFn: async () => {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch Lanyard data");
      const json = await res.json() as LanyardResponse;
      return json.data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds to keep status live
  });
}
