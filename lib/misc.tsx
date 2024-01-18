import { Cylinder } from "lucide-react";

export const GeoTypeUI = [
  {
    label: "GeoGraphix",
    value: "geographix",
    icon: () => (
      <Cylinder color="lime" className="mx-1" size={20} strokeWidth={3} />
    ),
  },
  {
    label: "Petra",
    value: "petra",
    icon: () => (
      <Cylinder color="turquoise" className="mx-1" size={20} strokeWidth={3} />
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
