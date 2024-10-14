import DashboardTableFilter from '../../../components/DashboardTableFilter/DashboardTableFilter';

export type datasList = {
  label: string;
  value: string;
};

export default function Home() {
  return (
    <main className=" overflow-x-hidden text-white">
      <div className="flex justify-center gap-[1%] p-1">
        <DashboardTableFilter />
      </div>
    </main>
  );
}
