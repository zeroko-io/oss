"use client"

import { Button } from "@zeroko/ui/components/button"

import { deleteService } from "@/lib/actions"

export function DeleteService({ name }: { name: string }) {
  return (
    <form
      action={deleteService}
      onSubmit={(e) => {
        if (
          !confirm(
            `Delete ${name}, its versions and all its data? This can't be undone.`
          )
        ) {
          e.preventDefault()
        }
      }}
    >
      <input type="hidden" name="name" value={name} />
      <Button variant="destructive">Delete</Button>
    </form>
  )
}
