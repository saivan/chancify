"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Button, Form, FormField, FormItem, FormLabel, FormControl, FormMessage, LoadingButton } from "@repo/components"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import type { UserType } from "@/models/User";
import { useDashboard } from "../controller"

const formSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "editor", "viewer"] as const)
})

type FormValues = z.infer<typeof formSchema>

export function NewUser() {
  const [loading, setLoading] = useState(false)
  const { addOrganizationUser } = useDashboard()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      role: "admin"
    }
  })

  async function onSubmit(values: FormValues) {
    setLoading(true)
    form.reset()
    await addOrganizationUser(values)
    setLoading(false)
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-xl">Add User</CardTitle>
        <CardDescription>
          Add a new user to your organization
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton loading={loading} type="submit">Add User</LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
