import React from 'react';
import PageTab from '../../../../components/ProjectDetailTabs/PageTab/PageTab';

export type tabsProps = {
  name: string;
  content: JSX.Element;
};

export type progressTableProps = {
  category: string;
  used: string;
  budget: string;
};

export type headerProgressProps = {
  key: keyof progressTableProps | (keyof progressTableProps)[];
  classname?: string;
  title: string;
};

const ProjectDetail: React.FC = () => {
  return (
    <div className="w-full">
      <PageTab />
    </div>
  );
};

export default ProjectDetail;
