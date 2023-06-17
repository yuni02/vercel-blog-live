import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import { serialize } from 'next-mdx-remote/serialize'

// eslint-disable-next-line no-undef
const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$|\.mdx$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    }
  })
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)

  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$|\.mdx$/, ''),
      },
    }
  })
}

export async function getPostData(id) {
  console.log('00000000000')
  const fullMdPath = path.join(postsDirectory, `${id}.md`)
  const mdExist = fs.existsSync(fullMdPath)
  if (mdExist) {
    const fullPath = path.join(postsDirectory, `${id}.md`)

    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)
    console.log(matterResult)
    const processedContent = await remark()
      .use(html)
      .process(matterResult.content)
    console.log('🐰processedContent >>', processedContent)

    const contentHtml = processedContent.toString()
    console.log(
      '🐰contentHTML >>',
      contentHtml,
      'matterResult.data>>',
      matterResult.data
    )

    // Combine the data with the id
    return {
      id,
      contentHtml,
      ...matterResult.data,
    }
  } else {
    const fullPath = path.join(postsDirectory, `${id}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)
    const mdxSource = await serialize(matterResult.content)
    console.log('matterResult>>', matterResult, 'mdxSource>>', mdxSource)
    return {
      id,
      mdxSource,
      ...matterResult.data,
    }
  }
}

export async function createPost({ id, title, date, content }) {
  const fullPath = path.join(postsDirectory, `${id}.md`)
  const data = `---
title: '${title}'
date: '${date}'
---

${content}`
  // save file
  fs.writeFileSync(fullPath, data)
}
