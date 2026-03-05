import { getUserAction, getAllUsersAction } from "@/lib/actions/user.action";
import UserForm from "./_components/user-form";
import UsersRules from "./_components/users-rules";

export default async function Page() {
  const user = await getUserAction();
  const users = await getAllUsersAction();

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Page Header */}
        <section>
          <h1 className="text-3xl font-semibold tracking-tight">User Management</h1>
          <p className="text-gray-500 mt-2">Manage user information and permissions.</p>
        </section>

        {/* User Form Card */}
        <section className="bg-white rounded-xl shadow-sm border p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium">Profile Settings</h2>
            <p className="text-sm text-gray-500 mt-1">Update your personal information.</p>
          </div>

          <UserForm user={user} />
        </section>

        {/* Users & Roles Section for admin only */}
        {user.rule === "admin" && (
          <section className="bg-white rounded-xl shadow-sm border p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium">Users & Permissions</h2>
              <p className="text-sm text-gray-500 mt-1">Control access and assign roles.</p>
            </div>

            <UsersRules currentUser={user} users={users} />
          </section>
        )}
      </div>
    </main>
  );
}
