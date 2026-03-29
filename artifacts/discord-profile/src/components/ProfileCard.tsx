import { useLanyard } from "@/hooks/use-lanyard";
import { cn } from "@/lib/utils";

const STATUS_COLORS = {
  online: "bg-[#23a559] shadow-[0_0_6px_rgba(35,165,89,0.9)]",
  idle: "bg-[#f0b232] shadow-[0_0_6px_rgba(240,178,50,0.9)]",
  dnd: "bg-[#f23f43] shadow-[0_0_6px_rgba(242,63,67,0.9)]",
  offline: "bg-[#4e5058]",
};

const STATUS_TEXT = {
  online: "online",
  idle: "idle",
  dnd: "do not disturb",
  offline: "offline",
};

export function ProfileCard({ userId }: { userId: string }) {
  const { data: lanyard, isLoading, error } = useLanyard(userId);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 animate-pulse">
        <div className="w-20 h-20 rounded-full bg-white/5" />
        <div className="h-5 w-36 bg-white/5 rounded" />
        <div className="h-3 w-20 bg-white/5 rounded" />
      </div>
    );
  }

  if (error || !lanyard) return null;

  const { discord_user, discord_status, activities } = lanyard;

  const avatarUrl = discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${userId}/${discord_user.avatar}.png?size=256`
    : `https://cdn.discordapp.com/embed/avatars/${parseInt(discord_user.discriminator || "0") % 5}.png`;

  const currentActivity = activities?.find(a => a.name !== "Custom Status");
  const customStatus = activities?.find(a => a.type === 4);

  return (
    <div className="flex flex-col items-center gap-4 py-10">
      {/* Avatar */}
      <div className="relative">
        <img
          src={avatarUrl}
          alt={discord_user.username}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div
          className={cn(
            "absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-black",
            STATUS_COLORS[discord_status]
          )}
        />
      </div>

      {/* Name */}
      <div className="text-center">
        <h1 className="text-xl font-semibold text-white tracking-tight">
          {discord_user.global_name || discord_user.username}
        </h1>
        <p className="text-zinc-500 text-sm font-mono mt-0.5">
          @{discord_user.username}
        </p>
      </div>

      {/* Status / Activity */}
      <div className="text-center text-sm text-zinc-500">
        {currentActivity ? (
          <span>
            {currentActivity.details
              ? `${currentActivity.name} — ${currentActivity.details}`
              : currentActivity.name}
          </span>
        ) : customStatus?.state ? (
          <span>{customStatus.state}</span>
        ) : (
          <span>{STATUS_TEXT[discord_status]}</span>
        )}
      </div>
    </div>
  );
}
