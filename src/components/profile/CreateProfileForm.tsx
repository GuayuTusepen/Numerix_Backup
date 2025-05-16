"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProfile } from "@/contexts/ProfileContext";
import { AvatarSelector, AVATARS } from "./AvatarSelector";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }).max(30, {
    message: "Name must not be longer than 30 characters.",
  }),
  age: z.coerce.number().min(3, { // Changed from string to number
    message: "Age must be at least 3.",
  }).max(12, {
    message: "Age must be at most 12.",
  }),
  avatar: z.string().min(1, { message: "Please select an avatar." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface CreateProfileFormProps {
  onProfileCreated?: () => void;
}

export function CreateProfileForm({ onProfileCreated }: CreateProfileFormProps) {
  const { addProfile, profiles } = useProfile();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      age: undefined, // Default to undefined for number input
      avatar: AVATARS[0]?.id || "",
    },
  });

  function onSubmit(data: ProfileFormValues) {
    if (profiles.length >= 3) {
      toast({
        variant: "destructive",
        title: "Profile limit reached",
        description: "You can only create up to 3 profiles.",
      });
      return;
    }
    try {
      const newProfile = addProfile(data);
      toast({
        title: "Profile created!",
        description: `Welcome, ${newProfile.name}!`,
      });
      form.reset();
      if (onProfileCreated) {
        onProfileCreated();
      } else {
        router.push('/dashboard'); // Default redirect if no callback
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: (error as Error).message || "There was a problem creating your profile.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 md:p-6 bg-card shadow-lg rounded-lg">
        <FormField
          control={form.control}
          name="avatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose Your Avatar</FormLabel>
              <FormControl>
                <AvatarSelector
                  selectedAvatar={field.value}
                  onSelectAvatar={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter your age" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : parseInt(e.target.value, 10))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" size="lg">Create Profile</Button>
      </form>
    </Form>
  );
}
