const API = "https://discord.com/api/v10";

export const DISCORD = {
  botToken: process.env.DISCORD_BOT_TOKEN || "",
  guildId: process.env.DISCORD_GUILD_ID || "",
  orderChannelId: process.env.DISCORD_ORDER_CHANNEL_ID || "1551324617896099980",
};

type GuildMember = {
  user?: { id: string; username: string; global_name: string | null };
};

export type MembershipResult =
  | { status: "member"; id: string; username: string }
  | { status: "not_found" }
  | { status: "unknown" };

async function discordFetch(path: string, init?: RequestInit) {
  return fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bot ${DISCORD.botToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

function normalize(name: string) {
  return name.trim().replace(/^@/, "").replace(/#\d{4}$/, "").toLowerCase();
}

export async function findGuildMember(rawUsername: string): Promise<MembershipResult> {
  if (!DISCORD.botToken || !DISCORD.guildId) return { status: "unknown" };
  const query = normalize(rawUsername);
  if (!query) return { status: "not_found" };

  const res = await discordFetch(
    `/guilds/${DISCORD.guildId}/members/search?query=${encodeURIComponent(query)}&limit=10`,
  );
  if (!res.ok) {
    console.error("[discord] member search failed", res.status, await res.text());
    return { status: "unknown" };
  }

  const members = (await res.json()) as GuildMember[];
  const match =
    members.find((m) => m.user && m.user.username.toLowerCase() === query) ??
    members.find((m) => m.user && (m.user.global_name ?? "").toLowerCase() === query);
  if (!match?.user) return { status: "not_found" };
  return { status: "member", id: match.user.id, username: match.user.username };
}

export type Embed = {
  title: string;
  color: number;
  fields: { name: string; value: string; inline?: boolean }[];
  timestamp: string;
  footer: { text: string };
};

export async function sendChannelEmbed(embed: Embed) {
  if (!DISCORD.botToken) {
    console.warn("[discord] DISCORD_BOT_TOKEN not set; skipping order embed");
    return;
  }
  const res = await discordFetch(`/channels/${DISCORD.orderChannelId}/messages`, {
    method: "POST",
    body: JSON.stringify({ embeds: [embed] }),
  });
  if (!res.ok) {
    console.error("[discord] send message failed", res.status, await res.text());
  }
}
