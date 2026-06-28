import { getAllConcepts } from "@/lib/concepts";
import { ConceptLibraryView } from "@/components/library/ConceptLibraryView";
export default function ConceptsPage() {
  return <ConceptLibraryView concepts={getAllConcepts()} />;
}
