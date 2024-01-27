import { Cylinder } from "lucide-react";

export const GeoTypeUI = [
  {
    label: "GeoGraphix",
    value: "geographix",
    icon: () => (
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
  {
    label: "Petra",
    value: "petra",
    icon: () => (
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
  {
    label: "Kingdom",
    value: "kingdom",
    icon: () => (
      <Cylinder color="red" className="mx-1" size={20} strokeWidth={3} />
    ),
  },
  {
    label: "LAS",
    value: "las",
    icon: () => (
      <Cylinder color="grey" className="mx-1" size={20} strokeWidth={3} />
    ),
  },
];
