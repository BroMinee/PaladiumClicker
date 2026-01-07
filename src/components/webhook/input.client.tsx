"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

/**
 * Confirmation modal for deleting an webhook alert.
 * @param isOpen Whether the modal is open.
 * @param onClose Function to call when closing the modal.
 * @param onConfirm Function to call when confirming the deletion.
 * @param title Title of the modal.
 * @param desc Description text in the modal.
 */
export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, desc }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#1a1d24] border-gray-800 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <AlertTriangle size={20} />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 ">
          {desc}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="border-secondary hover:bg-card ">
            Annuler
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Confirmer la suppression
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}