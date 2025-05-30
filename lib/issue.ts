import fs from "fs";
import glob from "glob-promise";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkGithub from "remark-github";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { extractDescription } from "./remarkPlugins";

export type Issue = any;

export type IssueComment = any;

type RenderResult = {
  description: string | null;
  bodyHTML: string;
};

const dataDirectoryPath = process.env.DATA_DIRECTORY_PATH || "./data";

export async function getIssue({ issueNumber }: { issueNumber: number }) {
  const filePath = `${dataDirectoryPath}/issues/${issueNumber}/issue.md`;
  const content = fs.readFileSync(filePath, { encoding: "utf-8" });
  const issueMatter = matter(content);
  const body = issueMatter.content;
  const renderResult = await renderMarkdown(body);
  return {
    body,
    ...renderResult,
    ...issueMatter.data,
  };
}

export async function listIssues() {
  const paths = await glob.promise(`${dataDirectoryPath}/issues/*/issue.md`);
  return paths
    .map((filePath) => {
      const content = fs.readFileSync(filePath, { encoding: "utf-8" });
      const issueMatter = matter(content);
      const body = issueMatter.content;
      return {
        body,
        ...issueMatter.data,
      };
    })
    .sort(byCreatedAt)
    .reverse();
}

export async function listFullIssues({ limit }: { limit: number }) {
  let issues = await listIssues();
  issues = issues.slice(0, limit);
  return Promise.all(
    issues.map(async (issue: any) => {
      const renderedIssue = await getIssue({ issueNumber: issue.number });
      const issueComments = await listIssueComments({
        issueNumber: issue.number,
      });
      return {
        ...renderedIssue,
        issueComments,
      };
    })
  );
}

export async function listIssueComments({
  issueNumber,
}: {
  issueNumber: number;
}) {
  const paths = await glob.promise(
    `${dataDirectoryPath}/issues/${issueNumber}/issue_comments/*.md`
  );
  const issueComments = await Promise.all(
    paths.map(async (filePath: string) => {
      const content = fs.readFileSync(filePath, { encoding: "utf-8" });
      const issueMatter = matter(content);
      const body = issueMatter.content;
      const renderResult = await renderMarkdown(body);
      return {
        body,
        ...renderResult,
        ...issueMatter.data,
      };
    })
  );
  return issueComments.sort(byCreatedAt);
}

function byCreatedAt(a: any, b: any) {
  if (a.created_at < b.created_at) {
    return -1;
  } else if (a.created_at > b.created_at) {
    return 1;
  } else {
    return 0;
  }
}

async function renderMarkdown(content: string): Promise<RenderResult> {
  const result = await remark()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkGithub, {
      repository: process.env.GITHUB_REPOSITORY || "github/dummy",
    })
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(extractDescription as any)
    .process(content);
  const data = result.data as any;
  return {
    description: data.description || null,
    bodyHTML: result.toString(),
  };
}
