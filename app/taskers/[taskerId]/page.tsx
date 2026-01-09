import TaskerServicesPublic from "@/components/profile/TaskerServicesPublic";

interface TaskerProfilePageProps {
  params: { taskerId: string };
}

export default function TaskerProfilePage({ params }: TaskerProfilePageProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Tasker Services</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Browse the services offered by this tasker.
      </p>
      <div className="mt-8">
        <TaskerServicesPublic taskerId={params.taskerId} />
      </div>
    </div>
  );
}
