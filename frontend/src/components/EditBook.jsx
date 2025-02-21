"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  publishedDate: z.string().min(1, "Published date is required"),
  genre: z.string().min(1, "Genre is required"),
})

const EditBook = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      publishedDate: "",
      genre: "",
    },
  })

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}/books/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch book");
        }
        const data = await response.json();
  
        // Ensure publishedDate is in a proper format
        const formattedDate = data.publishedDate
          ? new Date(data.publishedDate).toISOString().split("T")[0]
          : "";
  
        form.reset({
          title: data.title,
          author: data.author,
          publishedDate: formattedDate, // Ensure it's in YYYY-MM-DD format
          genre: data.genre,
        });
      } catch (error) {
        console.error("Error fetching book:", error);
        toast({
          title: "Error",
          description: "Failed to fetch book details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchBook();
  }, [id, form, toast]);
  
  const onSubmit = async (values) => {
    try {
      // Compare form values with existing data before sending update
      if (
        values.title === form.getValues("title") &&
        values.author === form.getValues("author") &&
        values.publishedDate === form.getValues("publishedDate") &&
        values.genre === form.getValues("genre")
      ) {
        toast({ title: "No Changes", description: "No modifications were made.", variant: "default" });
        return;
      }
  
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update book");
      }
  
      toast({ title: "Success", description: "Book updated successfully." });
      navigate("/");
    } catch (error) {
      console.error("Error updating book:", error);
      toast({ title: "Error", description: "Failed to update book. Please try again.", variant: "destructive" });
    }
  };
  
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Edit Book</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter book title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <FormControl>
                  <Input placeholder="Enter author name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publishedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Published Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Genre</FormLabel>
                <FormControl>
                  <Input placeholder="Enter book genre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Update Book</Button>
        </form>
      </Form>
    </div>
  )
}

export default EditBook

