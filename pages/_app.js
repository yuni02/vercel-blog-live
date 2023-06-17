import Layout from '@/components/Layout'
import '../styles/global.css'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import ErrorBoundary from '@/components/ErrorBoundary'

export function reportWebVitals(metric) {
  console.log(metric)
}

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [visitedTime] = useState(new Date())

  return (
    <Layout home={router.pathname === '/'}>
      <div>
        visited:
        {formatDistanceToNow(new Date(visitedTime), {
          addSuffix: true,
          includedSeconds: true,
        })}
      </div>
      <ErrorBoundary fallBackComponent={<div>하하하 민망</div>}>
        <Component {...pageProps} pathname={router.pathname} />
      </ErrorBoundary>
    </Layout>
  )
}
