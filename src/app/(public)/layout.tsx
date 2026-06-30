import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { WhatsAppFab } from "@/components/ui/WhatsAppFab";
import { prisma } from "@/lib/prisma";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  let showFaculty = false;
  try {
    const count = await prisma.facultyShowcase.count({ where: { isActive: true } });
    showFaculty = count > 0;
  } catch {
    showFaculty = false;
  }

  return (
    <>
      <PublicNavbar showFaculty={showFaculty} />
      <main>{children}</main>
      <PublicFooter />
      <WhatsAppFab />
    </>
  );
}
