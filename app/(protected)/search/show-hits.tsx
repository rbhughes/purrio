"use client";

import React from "react";

import { Database } from "@/lib/sb_types";
type SearchResult = Database["public"]["Tables"]["search_result"]["Row"];

// interface JsonData {
//   [key: string]: any;
// }

// recursively extract key/value pairs--to maybe highlight text in value?
// const HtmlListFromJson: React.FC<{ json: JsonData }> = ({ json }) => {
//   const createHtmlListFromJson = (data: JsonData): JSX.Element => {
//     return (
//       <ul>
//         {Object.entries(data).map(([key, value]) => (
//           <li key={key}>
//             <b>{key}</b>{" "}
//             {typeof value === "object" && value !== null
//               ? createHtmlListFromJson(value)
//               : value}
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   return createHtmlListFromJson(json);
// };

// if you want to truncate long strings (like hex)
// const replacer = (key: any, value: any) => {
//   if (typeof value === "string" && value.length > 60) {
//     let prependSpace = " ".repeat(key.length + 1);

//     const chunks: string[] = [];
//     for (let i = 0; i < value.length; i += 60) {
//       let chunk = value.slice(i, i + 60);

//       if (i > 0) {
//         chunk = prependSpace + chunk;
//       }
//       chunks.push(prependSpace + chunk);
//     }
//     return chunks.join(" ");
//   }
//   return value;
// };

// const StyleHit = ({ json }: { json: any }) => {
//   try {
//     const a = JSON.stringify(json, null, 2); //necessary!
//     const sr = JSON.parse(a);
//     const doc = sr.doc;

//     let term =
//       sr.search_body && sr.search_body.term ? sr.search_body.term : "";

//     // //const regex = new RegExp(term.split(' ').join('|'), 'gi');
//     // for (const word of term.split(" ")) {
//     //   const regex = /"howard"/gim;
//     //   a = a.replace(regex, `<span className="bg-orange-400>${word}</span>`);
//     // }

//     return <HtmlListFromJson json={doc} />;
//   } catch (error) {
//     console.log(error);
//     return "error!";
//   }

//   // return a;
// };

export function ShowHits({ searchResults }: { searchResults: SearchResult[] }) {
  // parse doc from incoming search result (in spite of supabase Json type)
  const formatSearchResult = (res: any) => {
    const a = JSON.stringify(res, null, 2);
    const sr = JSON.parse(a);
    const doc = sr.doc;
    return doc;
  };

  if (!searchResults) {
    return <h1>no search results</h1>;
  }

  return (
    // <div className=" max-w-none font-mono whitespace-pre-wrap text-xs bg-slate-100">
    <div className="flex flex-wrap">
      {searchResults.map((sr) => {
        const doc = formatSearchResult(sr);
        return (
          <div
            key={sr.id}
            className="m-4 max-w-96 text-tiny overflow-auto bg-slate-100  font-mono"
          >
            <pre>
              {/* <StyleHit json={sr} /> */}
              {/* {styleHit(sr)} */}

              {JSON.stringify(sr, null, 2)}

              {/* {JSON.stringify(sr, replacer, 2)} */}
              {/* {stringify(sr, { replacer: replacer })} */}
              {/* {JSON.stringify(
                sr,
                (key, value) => {
                  if (typeof value === "string" && value.length > 60) {
                    console.log(value);
                    return wrapLongStrings(value);
                  }
                  return value;
                },

                2
              )} */}
            </pre>
          </div>
        );
      })}
    </div>
  );
}
