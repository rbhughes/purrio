import { Cylinder } from "lucide-react";

interface SUI {
  [key: string]: {
    label: string;
    value: string;
    icon: JSX.Element;
  };
}

export const SuiteUI: SUI = {
  geographix: {
    label: "GeoGraphix",
    value: "geographix",
    icon: (
      <div className="flex items-center h-fit w-fit">
        <span className="text-2xl font-black suite-geographix">&#x26C1;</span>
        <span className="pl-1">GeoGraphix</span>
      </div>

      //   <Cylinder
      //     color="lime"
      //     className="mx-1"
      //     size={20}
      //     strokeWidth={3}
      //     fill="lime"
      //     fillOpacity="0.2"
      //   />
    ),
  },
  petra: {
    label: "Petra",
    value: "petra",
    icon: (
      <div className="flex items-center h-fit w-fit">
        <span className="text-2xl font-black suite-petra">&#x26C1;</span>
        <span className="pl-1">Petra</span>
      </div>

      // <Cylinder
      //   color="teal"
      //   className="mx-1"
      //   size={20}
      //   strokeWidth={3}
      //   fill="teal"
      //   fillOpacity="0.2"
      // />
    ),
  },
  kingdom: {
    label: "Kingdom",
    value: "kingdom",
    icon: (
      <div className="flex items-center h-fit w-fit">
        <span className="text-2xl font-black suite-kingdom">&#x26C1;</span>
        <span className="pl-1">Kingdom</span>
      </div>
      // <Cylinder
      //   color="red"
      //   className="mx-1"
      //   size={20}
      //   strokeWidth={3}
      //   fill="red"
      //   fillOpacity="0.2"
      // />
    ),
  },
  las: {
    label: "LAS",
    value: "las",
    icon: (
      <div className="flex items-center h-fit w-fit">
        <span className="text-2xl font-black suite-las">&#x26C1;</span>
        <span className="pl-1">LAS</span>
      </div>
      // <Cylinder
      //   color="grey"
      //   className="mx-1"
      //   size={20}
      //   strokeWidth={3}
      //   fill="grey"
      //   fillOpacity="0.2"
      // />
    ),
  },
};

// easier than using the weird format used by DataTable everywhere
const formatForDataTableFacetFilter = (obj: SUI) => {
  const result: { label: string; value: string; icon: () => JSX.Element }[] =
    [];

  for (const key in obj) {
    //if (Object.prototype.hasOwnProperty.call(obj, key)) {
    const { label, value, icon } = obj[key];
    result.push({
      label,
      value,
      icon: () => icon,
    });
    //}
  }

  return result;
};

export const facetOptions = formatForDataTableFacetFilter(SuiteUI);
