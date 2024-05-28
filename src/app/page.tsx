import { SearchBar } from "@/components/SeachBar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-16 max-w-6xl w-full">
      <SearchBar />
    </main>
  );
}
