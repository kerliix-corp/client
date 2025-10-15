import React from 'react';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-900 via-black to-gray-900">
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
