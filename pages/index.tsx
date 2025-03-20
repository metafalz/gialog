import CustomHead from "../components/CustomHead";
import type { NextPage } from "next";
import Link from "next/link";
import { listIssues } from "../lib/issue";
import Time from "../components/Time";

type Props = {
  issues: Array<Issue>;
};

type Issue = any;

const Home: NextPage<Props> = ({ issues }) => {
  return (
    <>
      <CustomHead
        description="@metafalz"
        ogType="website"
        title="note ――書け、抜け、学べ。"
      />
      <section>
        <ol className="flex flex-col gap-12">
          {issues.map((issue) => (
            <li key={issue.number}>
              <Time dateTime={issue.created_at} />
              <Link href={`/notes/${issue.number}`}>{issue.title}</Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  return {
    props: {
      issues: await listIssues(),
    },
  };
}
