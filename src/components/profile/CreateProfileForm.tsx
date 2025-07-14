
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useProfile } from "@/contexts/ProfileContext";
import { AvatarSelector, BOY_AVATARS, GIRL_AVATARS } from "./AvatarSelector";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }).max(30, {
    message: "El nombre no debe tener más de 30 caracteres.",
  }),
  age: z.coerce.number().min(3, {
    message: "La edad debe ser al menos 3 años.",
  }).max(12, {
    message: "La edad debe ser como máximo 12 años.",
  }),
  gender: z.enum(['boy', 'girl'], {
    required_error: "Por favor, selecciona un género.",
  }),
  avatar: z.string().min(1, { message: "Por favor, selecciona un avatar." }),
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
      age: '' as any, // Use empty string for controlled input
      gender: undefined, 
      avatar: "", // Initial avatar is empty
    },
  });

  const watchedGender = form.watch('gender');

  useEffect(() => {
    if (watchedGender) {
      const newAvatarList = watchedGender === 'boy' ? BOY_AVATARS : GIRL_AVATARS;
      if (newAvatarList.length > 0) {
        const currentAvatarValue = form.getValues('avatar');
        const isCurrentAvatarInNewList = newAvatarList.some(avatar => avatar.id === currentAvatarValue);
        
        // Set to first avatar of the new list if current is not in new list, or if avatar is currently empty
        if (!isCurrentAvatarInNewList || !currentAvatarValue) {
           form.setValue('avatar', newAvatarList[0].id, { shouldValidate: true });
        }
      }
    } else {
      // If gender is unselected, clear avatar
      form.setValue('avatar', '', { shouldValidate: true });
    }
  }, [watchedGender, form]);

  function onSubmit(data: ProfileFormValues) {
    if (profiles.length >= 3) {
      toast({
        variant: "destructive",
        title: "Límite de perfiles alcanzado",
        description: "Solo puedes crear hasta 3 perfiles.",
      });
      return;
    }
    try {
      const newProfile = addProfile(data as Omit<ProfileFormValues, 'id'> & { gender: 'boy' | 'girl' });
      toast({
        title: "¡Perfil creado!",
        description: `¡Bienvenido/a, ${newProfile.name}!`,
      });
      form.reset();
      if (onProfileCreated) {
        onProfileCreated();
      } else {
        router.push('/dashboard'); 
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "¡Oh, oh! Algo salió mal.",
        description: (error as Error).message || "Hubo un problema al crear tu perfil.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 md:p-6 bg-card shadow-lg rounded-lg">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Ingresa tu nombre" {...field} />
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
              <FormLabel>Edad</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ingresa tu edad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Género</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="boy" />
                    </FormControl>
                    <Label className="font-normal">Niño</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="girl" />
                    </FormControl>
                    <Label className="font-normal">Niña</Label>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {watchedGender && (
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Elige Tu Avatar</FormLabel>
                <FormControl>
                  <AvatarSelector
                    selectedAvatar={field.value}
                    onSelectAvatar={field.onChange}
                    gender={watchedGender}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full" size="lg">Crear Perfil</Button>
      </form>
    </Form>
  );
}
