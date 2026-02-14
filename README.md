# Smart Bookmark App

A real-time bookmark manager built with Next.js (App Router), Supabase, and Tailwind CSS.

---

## 🚀 Live Demo

Vercel URL:  
https://your-vercel-url.vercel.app

---

## 📂 GitHub Repository

https://github.com/your-username/your-repo-name

---

## 🛠 Tech Stack

- Next.js (App Router)
- Supabase (Auth, PostgreSQL, Realtime)
- Tailwind CSS
- Vercel (Deployment)

---

## ✅ Features

- Google OAuth authentication (Google login only)
- Add bookmark (title + URL)
- Delete bookmark
- Private bookmarks per user (Row Level Security)
- Real-time updates across multiple tabs
- Fully deployed on Vercel

---

## 🔐 Authentication

Google OAuth is implemented using Supabase Auth.

Only authenticated users can access bookmarks.  
Email/password login is not used.

---

## 🗄 Database & Security

Created a `bookmarks` table with:

- id
- title
- url
- user_id
- created_at

Enabled Row Level Security (RLS) to ensure users only access their own data.

### Policies:

SELECT:
```sql
auth.uid() = user_id
