'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/src/components/ui/breadcrumb';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';

/**
 * Componente de breadcrumbs automático que lê as rotas da URL
 *
 * IMPORTANTE: O slug da organização NUNCA aparece no breadcrumb.
 * Remove o slug da organização e mostra apenas a hierarquia de páginas.
 *
 * Exemplos:
 * - /org-slug → Dashboard
 * - /org-slug/projects → Dashboard > Projects
 * - /org-slug/settings/team → Dashboard > Settings > Team
 */
export function AutoBreadcrumbs() {
  const pathname = usePathname();

  // Remove o primeiro segmento (slug da organização) e filtra vazios
  // index > 0 garante que o slug nunca seja incluído nos segments
  const segments = pathname
    .split('/')
    .filter((segment, index) => segment && index > 0);

  // Se não houver segmentos, mostra apenas "Dashboard"
  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Função para formatar nome do segmento
  const formatSegmentName = (segment: string) => {
    return segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Constrói o caminho acumulativo para os links
  const buildPath = (upToIndex: number) => {
    const orgSlug = pathname.split('/')[1];
    const path = segments.slice(0, upToIndex + 1).join('/');
    return `/${orgSlug}/${path}`;
  };

  const slug = pathname.split('/')[1];

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Link para o Dashboard (home) - só é clicável se não estivermos nele */}
        <BreadcrumbItem>
          {segments.length === 0 ? (
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link href={`/${pathname.split('/')[1]}`}>Dashboard</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {/* Renderiza os demais segmentos */}
        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1;
          const segmentName = formatSegmentName(segment);

          return (
            <Fragment key={segment + index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast || slug === segment ? (
                  <BreadcrumbPage>{segmentName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={buildPath(index)}>{segmentName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
