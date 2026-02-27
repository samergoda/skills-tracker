"use client";
import { Button } from "../ui/button";
import { signout } from "@/lib/actions/signout";

export default function LogoutButton() {
  return <Button onClick={signout}>Logout</Button>;
}
