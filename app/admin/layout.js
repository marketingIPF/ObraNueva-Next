import AuthGuard from "@/components/admin/AuthGuard";

export const metadata = {
  title: "Panel · RK Palanca Fontestad",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <AuthGuard>{children}</AuthGuard>;
}
