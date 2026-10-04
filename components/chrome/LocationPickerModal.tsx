"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Visual-only stub (per docs/PLAN.md MVP scope: location/language pickers are
 * reproduced visually, not functional). Applying a zip just closes the modal.
 */
export function LocationPickerModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [zip, setZip] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button type="button" onClick={() => setOpen(true)} className="text-left">
        {children}
      </button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose your location</DialogTitle>
        </DialogHeader>
        <p className="rounded border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          We chose a general location to help you shop. For more accurate selection and
          delivery times, update your location.
        </p>
        <div className="space-y-2">
          <label htmlFor="zip" className="text-sm text-muted-foreground">
            or enter a US zip code
          </label>
          <div className="flex gap-2">
            <Input id="zip" value={zip} onChange={(e) => setZip(e.target.value)} placeholder="Zip code" />
            <Button onClick={() => setOpen(false)} variant="outline">
              Apply
            </Button>
          </div>
        </div>
        <Button className="bg-az-cta-yellow text-black hover:bg-az-cta-yellow-hover" onClick={() => setOpen(false)}>
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
}
