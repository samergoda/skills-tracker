import React, { Suspense } from "react";

export default function Layout({
  children,
  skills,
  stats,
}: {
  children: React.ReactNode;
  skills: React.ReactNode;
  stats: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <Suspense fallback={"loading"}>{skills}</Suspense>
      <Suspense fallback={"loading"}>{stats}</Suspense>
    </div>
  );
}
