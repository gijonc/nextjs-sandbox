"use client";

import React, { useEffect, useState } from "react";

const fetchFlagWord = async () => {
  const link =
    "https://tns4lpgmziiypnxxzel5ss5nyu0nftol.lambda-url.us-east-1.on.aws/challenge";

  const res = await fetch(link);
  const htmlText = await res.text();
  const htmlElement = document.createElement("html");
  htmlElement.innerHTML = htmlText;
  const body = htmlElement.getElementsByTagName("body");
  let urlString = "";
  for (const sectionTags of body[0].getElementsByTagName("section")) {
    for (const articleTag of sectionTags.getElementsByTagName("article")) {
      for (const divTags of articleTag.getElementsByTagName("div")) {
        const validNode = divTags.getElementsByClassName("ramp ref");
        if (validNode.length) {
          urlString += validNode[0].getAttribute("value");
        }
      }
    }
  }
  const res2 = await fetch(urlString);
  const word = await res2.text();
  return word;
};

export default function Home() {
  const [renderIdx, setRenderIdx] = useState<number>(0);
  const [flagWord, setFlagWord] = useState<string>("");
  const [displayedText, setDisplayedText] = useState<string[]>([]);

  // call fetch word API
  useEffect(() => {
    const fetchWord = async () => {
      const word = await fetchFlagWord();
      setFlagWord(word);
    };
    fetchWord();
  }, []);

  // render the words by timeout
  useEffect(() => {
    if (flagWord) {
      const timeoutId = setTimeout(() => {
        if (renderIdx === flagWord.length) {
          setRenderIdx(0);
          setDisplayedText([flagWord[renderIdx]]);
        } else {
          setRenderIdx(renderIdx + 1);
          setDisplayedText([...displayedText, flagWord[renderIdx]]);
        }

      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [renderIdx, flagWord]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main>
        {displayedText.length ? (
          displayedText.map((char, idx) => <span key={char + idx}>{char}</span>)
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
}
