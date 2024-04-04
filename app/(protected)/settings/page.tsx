import Thing from "./test";
export default async function Settings() {
  return (
    <>
      howdy from page
      <Thing />
      <div className="m-10"></div>
      {/* // */}
      <div className="flex items-center h-fit w-fit bg-blue-100">
        <span className="text-2xl text-orange-500  font-black">&#x26C1;</span>
        <span className="pl-1">GeoGraphix</span>
      </div>
    </>
  );
}
