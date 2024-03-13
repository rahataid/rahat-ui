import React from 'react';

export default function NestedObjectRenderer({ object }: any) {
  const keys = Object.keys(object);
  return (
    <ul>
      {keys.map((key, i) => (
        <li key={i}>
          <strong>{key}:</strong> {object[key]}
        </li>
      ))}
    </ul>
  );
}
