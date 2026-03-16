export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return {
    title: 'Dashboard | Odonto Clinic',
    description: 'Painel de controle da clínica odontológica',
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const { slug } = await params;
  return (
    <>
      <h2>Dashboard - {slug}</h2>
      {children}
    </>
  );
}
