import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface PostData {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  coverImage: string;
  contentHtml?: string;
}

export function getSortedPostsData(): PostData[] {
  // Create dir if not exists
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      try {
        const matterResult = matter(fileContents);

        const categoryRaw = matterResult.data.category || 'Uncategorized';
        const category = categoryRaw
          .toLowerCase()
          .split(/[\s/-]+/)
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        return {
          slug,
          ...(matterResult.data as { title: string; date: string; excerpt: string; coverImage: string }),
          category,
        };
      } catch (err) {
        console.warn(`[posts] Skipping malformed post "${fileName}": ${err}`);
        return null;
      }
    })
    .filter((post): post is PostData => post !== null);

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  let matterResult: ReturnType<typeof matter>;
  try {
    matterResult = matter(fileContents);
  } catch (err) {
    throw new Error(`Malformed frontmatter in post "${slug}": ${err}`);
  }

  const processedContent = await remark()
    .use(html, { sanitize: true })
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const categoryRaw = matterResult.data.category || 'Uncategorized';
  const category = categoryRaw
    .toLowerCase()
    .split(/[\s/-]+/)
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return {
    slug,
    contentHtml,
    ...(matterResult.data as { title: string; date: string; excerpt: string; coverImage: string }),
    category,
  };
}
