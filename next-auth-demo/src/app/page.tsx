"use client";
import { signIn, signOut, useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;

  if (!session) {
    return (
      <main className="min-h-screen grid place-items-center p-8">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Not signed in</h1>
          <div className="flex items-center gap-3 justify-center">
            <button className="px-4 py-2 bg-black text-white rounded" onClick={() => signIn('github')}>Sign in with GitHub</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => signIn('google')}>Sign in with Google</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="space-y-4 text-center">
        <p className="text-xl">Signed in as {session.user?.email ?? 'User'}</p>
        <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => signOut()}>Sign out</button>
      </div>
    </main>
  );
}




