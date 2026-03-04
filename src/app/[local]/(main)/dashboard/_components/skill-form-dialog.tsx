"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createGlobalSkill } from "@/lib/api/skills.api";

type Skill = {
  id: string;
  skill: string;
  logo: string;
  category: string;
};

export function SkillFormDialog({ open, onOpenChange, skill }: { open: boolean; onOpenChange: (v: boolean) => void; skill: Skill | null }) {
  const [form, setForm] = useState({
    skill: "",
    logo: "",
    category: "",
  });

  useEffect(() => {
    if (skill) {
      setForm(skill);
    } else {
      setForm({ skill: "", logo: "", category: "" });
    }
  }, [skill]);

  const handleSubmit = async () => {
    if (skill) {
      // update API
    } else {
      // create API
      createGlobalSkill(form)
    }

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{skill ? "Edit Skill" : "Add Skill"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Label htmlFor="skill">Skill name</Label>
          <Input placeholder="Skill name" value={form.skill} onChange={(e) => setForm({ ...form, skill: e.target.value })} />

          <Label htmlFor="logo">Logo URL</Label>
          <Input placeholder="Logo URL" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} />

          <Label htmlFor="category">Category</Label>
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />

          <Button className="w-full" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
