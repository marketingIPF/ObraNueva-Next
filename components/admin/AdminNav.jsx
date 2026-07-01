import Link from "next/link";
import Container from "@/components/ui/Container";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminNav() {
  return (
    <div className="border-b border-line bg-white">
      <Container className="py-4 flex items-center justify-between">
        <Link href="/admin" className="font-black text-ink">
          Panel RK Palanca
        </Link>
        <LogoutButton />
      </Container>
    </div>
  );
}
