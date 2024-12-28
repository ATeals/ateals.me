import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';

type LocationNavProps = {
  children?: React.ReactNode;
  path: string;
};

export const LocationNav = (props: LocationNavProps) => {
  const pathMap = props.path.split('/').filter((path) => path !== '');

  return (
    <div className="group fixed bottom-0 w-full overflow-x-auto">
      <Breadcrumb className="inline-flex min-h-6 w-max min-w-full whitespace-nowrap bg-white px-2 font-normal transition-transform duration-300 ease-in-out group-hover:translate-y-0 dark:bg-dark-bg md:translate-y-full">
        <BreadcrumbList className="inline-flex items-center">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">home</BreadcrumbLink>
          </BreadcrumbItem>
          {pathMap.map((path, index) => (
            <Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="hover:cursor-pointer" href={`/${path}`}>
                  {path}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
