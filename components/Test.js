/* eslint-disable no-unused-vars */
'use client'

import { useEffect, useState } from 'react'

export const Test = ({ allPosts }) => {
  const [postsState, setPostsState] = useState([])
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('제목')
  const [content, setContent] = useState('내용')

  console.log('!!!')
  useEffect(() => {
    setPostsState(allPosts)
  }, [allPosts])

  let submitForm = async (e) => {
    setLoading(true)
    e.preventDefault()
    let res = await fetch('http://localhost:3000/api/test', {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    })

    res = await res.json()

    console.log('res>>', res)
    setPostsState([...postsState, res])
    setTitle('')
    setContent('')
    setLoading(false)
  }
  return (
    <>
      <button onClick={submitForm}></button>
    </>
  )
}
