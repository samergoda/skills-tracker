"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Plus } from "lucide-react";
import { SkillFormDialog } from "./skill-form-dialog";
import { PaginationIconsOnly } from "@/components/features/pagination";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteGlobalSkill } from "@/lib/api/skills.api";
import { useTranslations, useLocale } from "next-intl";

export function SkillsTable({ initialSkills }: { initialSkills: AddedSkill[] }) {
  const t = useTranslations("Skills");
  const locale = useLocale();
  const [skills, setSkills] = useState(initialSkills);
  const [selected, setSelected] = useState<AddedSkill | null>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const debouncedSearch = useDebounce(search, 500);

  // Sync state when the server re-fetches data on page change
  useEffect(() => {
    setSkills(initialSkills);
  }, [initialSkills]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  }, [debouncedSearch]);

  const handleDelete = async (id: string) => {
    await deleteGlobalSkill(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}>
          <Plus className="w-4 h-4 mr-2" />
          {t("addSkill")}
        </Button>
      </div>
      <Input placeholder={t("search")} value={search} onChange={(e) => setSearch(e.target.value)} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("logo")}</TableHead>
            <TableHead>{t("name")}</TableHead>
            <TableHead>{t("category")}</TableHead>
            <TableHead>{t("created")}</TableHead>
            <TableHead className="text-right">{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {skills.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                {t("noSkills")}
              </TableCell>
            </TableRow>
          )}

          {skills.map((skill) => (
            <TableRow key={skill.id}>
              <TableCell>
                <Image
                  src={skill.logo || "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/2.jpg"}
                  alt={skill.skill}
                  width={40}
                  height={40}
                  className="rounded-md"
                />
              </TableCell>

              <TableCell className="font-medium">{skill.skill}</TableCell>

              <TableCell>{skill.category}</TableCell>

              <TableCell>{new Date(skill.createdAt).toLocaleDateString()}</TableCell>

              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSelected(skill);
                    setOpen(true);
                  }}>
                  <Pencil className="w-4 h-4" />
                </Button>

                <Button variant="destructive" size="icon" onClick={() => handleDelete(skill.id)}>
                  <Trash className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <PaginationIconsOnly />

      <SkillFormDialog open={open} onOpenChange={setOpen} skill={selected} />
    </div>
  );
}
