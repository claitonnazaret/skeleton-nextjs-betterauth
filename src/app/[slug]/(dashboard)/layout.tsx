export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return {
    title: slug ? `${slug} | Odonto Clinic` : 'Dashboard | Odonto Clinic',
    description: 'Painel de controle da clínica odontológica',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
