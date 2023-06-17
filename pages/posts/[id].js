import { getAllPostIds, getPostData } from '@/lib/posts'
import utilStyles from '../../styles/utils.module.css'
import Date from '@/components/Date'
import { useRouter } from 'next/router'
import { MDXRemote } from 'next-mdx-remote'
import CodeBlock from '@/components/CodeBlock'
import Button from '@/components/Button'
import Head from 'next/head'
import { siteTitle } from 'pages/_document'
import { useState } from 'react'
// import dynamic from 'next/dynamic'

// const Button = dynamic(() => import('../../components/Button'), {
//   loading: () => <div>loading...</div>,
// })

export async function getStaticPaths() {
  const paths = getAllPostIds()

  // const paths = [
  //   {
  //     params: {
  //       id: 'ssg-ssr',
  //     },
  //   },
  // ]
  return {
    paths,
    fallback: 'blocking',

    //false => 없는 링크 : 404,
    //true => throw error
  }
}

export async function getStaticProps({ params, preview }) {
  console.log(`preview>> ${preview}`)
  const postData = await getPostData(params.id)
  return {
    props: {
      postData,
    },
  }
}

const components = { Button, CodeBlock }

const ErrorComponent = () => {
  const [error, setError] = useState(false)
  if (error) {
    throw new Error('Error Occured!')
  }
  return (
    <button
      className="rounded px-2 bg-green-500"
      onClick={() => setError(true)}
    >
      Error Fire
    </button>
  )
}

export default function Post({ postData, pathname }) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      <Head>
        <title>{`${postData.title} - ${siteTitle}`}</title>
      </Head>
      <ErrorComponent />
      <article>
        <h1>pathname: {pathname}</h1>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>
        {postData.contentHtml && (
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        )}
        {postData.mdxSource && (
          <MDXRemote {...postData.mdxSource} components={components} />
        )}
      </article>
    </>
  )
}
