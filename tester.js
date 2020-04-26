/*
let a = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

let chunks = []
let chunk = 8

const arrayChunks = (a, size) => {
  var chunks = []
  for (var i = 0; i < a.length; i += size) {
    chunks.push(a.slice(i, i + size))
  }
  return chunks
}
//console.log(chunkArrayInGroups(["a", "b", "c", "d"], 2));
//
let c = arrayChunks(a, 3)
console.log(c)
*/

let notes = [{a: 1, b: 2}, {a: 4, b: 4}, {a: 9, b: 3}, {a: 5, b: 4}]

let cn = {a: 8, b: 8}

const f = b => {
  let a = [...notes, b]
  console.log(a)
}

f(cn)

/*

I have a collection of designs, code and processes generally involving the 
management of E&P-centric data. Although no legal entity exists yet, we can
refer to these works as "owned by" purr.io, a domain that I presently own.

To prevent future conflicts of interest, this document defines what elements of
purr.io should be considered independent of SubSurfaceIO. This is not a legally
binding document. The boundaries defined here should be sufficient to avoid 
disputes; we can formalize the agreement legally if required.

For the purposes of this document, I consider there to be three classes of 
intellectual property boundaries to define:

1. property of SubSurfaceIO

While engaged in employment for SubSurfaceIO, either contractual or full time,
any newly generated work shall be the property of SubSurfaceIO. Solutions to
technical and business problems, including: source code repositores, SQL queries, 
configuration of computing services that were created to improve or 
expand the capabilities of SubSurfaceIO shall be and remain the sole property of 
SubSurfaceIO. 

2. property of purr.io

Source code, designs and configurations that were undertaken prior to engagement
with SubSurfaceIO shall remain property of purr.io. These are generally
encapsulated within a single AWS-centric repository.


3. property of third parties (including vendors, open source, public domain, etc.)

Both SubSurfaceIO and purr.io interact with 3rd party applcations and 
various data formats. Many of the these tools and formats are open source or 
otherwise provided to the general public for unspecified use (e.g. SAP publishes 
free SQLAnywhere adapters for common programming languages). These data formats 
and schemas are the property of their respective owners.













from SubSurfaceIO

*/
