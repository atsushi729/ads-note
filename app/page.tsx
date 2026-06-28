import { getAllProblems } from "@/lib/problems";
import { LibraryView } from "@/components/library/LibraryView";
export default function Home() {
  return <LibraryView problems={getAllProblems()} />;
}
