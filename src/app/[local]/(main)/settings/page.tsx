import { getUserAction } from "@/lib/actions/user.action";
import UserForm from "./_components/user-form";
import { db } from "@/db/db";
import UsersRules from "./_components/users-rules";
/*
  id: 'b4904a87-7056-4891-a1df-545fb0293ac5',
  createdAt: '2026-02-20 05:46:27',
  email: 'admin133766@1elevate.com',
  password: '$2b$10$1Ul5JSi7r67OF7tmvoAwTOFtFda/18Zt/Ie3jAlWx9uRm.yswIYqu',
  rule: 'admin',
  firstName: 'samer',
  lastName: 'goda'
*/
export default async function page() {
  const user = await getUserAction();
  const users = await db.query.users.findMany();

  console.log("usersss", users);

  console.log("user", user);
  return (
    <div className="">
      <div className="">
        <UserForm user={user} />
      </div>
      <UsersRules currentUser={user} users={users} />
    </div>
  );
}
