import SearchForm from "./search-form";
import { Toaster } from "@/components/ui/sonner";

export default async function Page() {
  return (
    <div>
      <SearchForm placeholder="search..." />
      <Toaster richColors />
    </div>
  );
}
