"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { County, CaseType } from "@/types";
import { CaseFilterProps } from "@/types/props";

const formSchema = z.object({
  q: z.string().optional(),
  county: z.string().optional(),
  type: z.string().optional(),
  date: z.date().optional(),
});

export function PublicCasesFilter({
  counties = [],
  caseTypes = [],
  selectedCounty = "",
  selectedType = "",
  selectedDate = "",
  query = "",
}: CaseFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize the form with values from URL
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      q: query,
      county: selectedCounty || "placeholder",
      type: selectedType || "placeholder",
      date: selectedDate ? new Date(selectedDate) : undefined,
    },
  });

  // Create a function that will create the URL with the updated params
  const createQueryString = useCallback(
    (values) => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Update or remove each parameter based on form values
      if (values.q) {
        params.set("q", values.q);
      } else {
        params.delete("q");
      }
      
      if (values.county && values.county !== "placeholder") {
        params.set("county", values.county);
      } else {
        params.delete("county");
      }
      
      if (values.type && values.type !== "placeholder") {
        params.set("type", values.type);
      } else {
        params.delete("type");
      }
      
      if (values.date) {
        const formattedDate = format(values.date, "yyyy-MM-dd");
        params.set("date", formattedDate);
      } else {
        params.delete("date");
      }
      
      return params.toString();
    },
    [searchParams]
  );

  // Handle form submission
  function onSubmit(values: z.infer<typeof formSchema>) {
    const queryString = createQueryString(values);
    router.push(`/cases${queryString ? `?${queryString}` : ""}`);
  }

  // Handle form reset
  function onReset() {
    form.reset({
      q: "",
      county: "placeholder",
      type: "placeholder",
      date: undefined,
    });
    router.push("/cases");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="q"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Search</FormLabel>
              <FormControl>
                <Input
                  placeholder="Search cases..."
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="county"
          render={({ field }) => (
            <FormItem>
              <FormLabel>County</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || "placeholder"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>
                    Select county
                  </SelectItem>
                  {counties.map((county: County) => (
                    <SelectItem key={county.id} value={county.name}>
                      {county.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Case Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || "placeholder"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>
                    Select type
                  </SelectItem>
                  {caseTypes.map((type: CaseType) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                      {type.description && (
                        <span className="text-xs text-muted-foreground ml-2">
                          - {type.description}
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            Apply Filters
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onReset}
          >
            Reset
          </Button>
        </div>
      </form>
    </Form>
  );
}