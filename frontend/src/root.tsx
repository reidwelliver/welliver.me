import React from "react";

export default function AppRoot() {
  //const rootClasses = `main theme-${Date.now()%3}`
  const rootClasses = `main theme-1`;

  return (
    <div className={rootClasses}>
      <div className="background" />
      <div className="background-title" />
    </div>
  );
}
