import React from "react";
import AddRecipeForm from "./AddRecipeForm";
import { AddRecipePayload, Recipe } from "../api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (p: AddRecipePayload) => Promise<void>;
  editRecipe?: Recipe | null;
};

export default function AddRecipeModal({
  open,
  onClose,
  onAdd,
  editRecipe,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editRecipe ? "Edit Recipe" : "Add Recipe"}</DialogTitle>
        </DialogHeader>
        <AddRecipeForm onAdd={onAdd} editRecipe={editRecipe} />
      </DialogContent>
    </Dialog>
  );
}
