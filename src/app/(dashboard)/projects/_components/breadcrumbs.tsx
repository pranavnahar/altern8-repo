'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from 'next/link';

interface Path {
  name: string;
  href?: string;
}

const ProjectCrumbs = ({ paths }: { paths: Path[] }) => {
  const isLastPath = (index: number) => index === paths.length - 1;

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-white bg-white/10 p-2 max-w-max rounded-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {paths.map((path, index) => (
          <BreadcrumbItem key={index}>
            <BreadcrumbPage
              className={`text-white ${isLastPath(index) ? 'text-md' : 'text-md'}`}
            >
              {isLastPath(index) ? (
                path.name
              ) : (
                <Link href={path.href || '#'} className="cursor-pointer">
                  {path.name}
                </Link>
              )}
            </BreadcrumbPage>
            {!isLastPath(index) && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
export default ProjectCrumbs
