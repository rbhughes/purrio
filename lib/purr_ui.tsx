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
      <Cylinder
        color="lime"
        className="mx-1"
        size={20}
        strokeWidth={3}
        fill="lime"
        fillOpacity="0.2"
      />
    ),
  },
  petra: {
    label: "Petra",
    value: "petra",
    icon: (
      <Cylinder
        color="teal"
        className="mx-1"
        size={20}
        strokeWidth={3}
        fill="teal"
        fillOpacity="0.2"
      />
    ),
  },
  kingdom: {
    label: "Kingdom",
    value: "kingdom",
    icon: (
      <Cylinder
        color="red"
        className="mx-1"
        size={20}
        strokeWidth={3}
        fill="red"
        fillOpacity="0.2"
      />
    ),
  },
  las: {
    label: "LAS",
    value: "las",
    icon: (
      <Cylinder
        color="grey"
        className="mx-1"
        size={20}
        strokeWidth={3}
        fill="grey"
        fillOpacity="0.2"
      />
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
