import { createContentLoader } from "vitepress";

export interface Post {
  title: string;
  url: string;
  date: {
    time: number;
    string: string;
  };
  excerpt: string | undefined;
}

declare const data: Post[];
export { data };

export default createContentLoader("posts/*.md", {
  excerpt: true,
  transform(raw): Post[] {
    return raw
      .map(({ url, frontmatter, excerpt }) => ({
        title: frontmatter.title,
        url: url,
        excerpt,
        date: formatDate(frontmatter.date),
      }))
      .sort((a, b) => b.date.time - a.date.time);
  },
});

function formatDate(raw: string): Post["date"] {
  // pinned post
  if (raw === "📌") raw = "2027-10-24T00:00:00.000Z";

  const date = new Date(raw);
  date.setUTCHours(12);
  return {
    time: +date,
    string: date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    }),
  };
}
