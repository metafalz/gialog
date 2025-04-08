import RSS from "rss";
import { listFullIssues, type IssueComment } from "./issue";
import settings from "../settings";

export async function generateFeed(): Promise<string> {
  const rss = new RSS({
    description: "@metafalz",
    feed_url: `${settings.siteBaseUrl}/feed.xml`,
    generator: "metafalz/gialog",
    site_url: `${settings.siteBaseUrl}/`,
    title: "note ――書け、抜け、学べ。",
  });
  let fullIssues = await listFullIssues({ limit: 20 });
  fullIssues.forEach(async (fullIssue: any) => {
    const url = `${settings.siteBaseUrl}/notes/${fullIssue.number}`;
    const _cdata = [fullIssue.bodyHTML]
      .concat(
        fullIssue.issueComments.map((issueComment: IssueComment) => {
          return issueComment.bodyHTML;
        })
      )
      .join("<hr>");
    rss.item({
      custom_elements: [
        {
          "content:encoded": {
            _cdata,
          },
        },
      ],
      date: new Date(fullIssue.created_at),
      description: fullIssue.description || "",
      title: fullIssue.title,
      url,
    });
  });

  return rss.xml();
}
