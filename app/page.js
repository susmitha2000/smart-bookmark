'use client'

import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

export default function Home() {
  const [user, setUser] = useState(null)
  const [bookmarks, setBookmarks] = useState([])
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  /* -------- 1️⃣ Load User -------- */
  useEffect(() => {
    getUser()
  }, [])

  /* -------- 2️⃣ Realtime Listener -------- */
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('bookmarks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookmarks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchBookmarks(user.id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const getUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
    if (data.user) fetchBookmarks(data.user.id)
  }

  const fetchBookmarks = async (userId) => {
    const { data } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    setBookmarks(data || [])
  }

  const addBookmark = async () => {
    if (!title || !url) return

    await supabase.from('bookmarks').insert([
      {
        title,
        url,
        user_id: user.id
      }
    ])

    setTitle('')
    setUrl('')

    
    fetchBookmarks(user.id)
  }

  const deleteBookmark = async (id) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'http://localhost:3000' }
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button
          onClick={signInWithGoogle}
          className="bg-black text-white px-6 py-3 rounded-lg"
        >
          Sign in with Google
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <div className="flex justify-between">
        <h1 className="text-xl">Welcome {user.email}</h1>
        <button onClick={signOut} className="text-red-500">
          Logout
        </button>
      </div>

      <div className="space-y-2">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border p-2 w-full"
        />
        <button
          onClick={addBookmark}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Bookmark
        </button>
      </div>

      <div className="space-y-2">
        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="flex justify-between border p-2 rounded"
          >
            <a href={b.url} target="_blank" className="text-blue-600">
              {b.title}
            </a>
            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

