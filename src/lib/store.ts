// src/lib/store.ts
import { writable } from "svelte/store";

export interface CommandHistory {
	command: string;
	output: string;
	isError?: boolean;
}

export type Page = "home" | "about" | "projects" | "contact" | "skills";

export const currentPage = writable<Page>("home");
export const history = writable<CommandHistory[]>([]);

export const COMMANDS: Record<string, string> = {
	help: "List all available commands",
	about: "Learn more about me",
	projects: "View my featured projects",
	skills: "See my technical tech stack",
	contact: "Get in touch with me",
	clear: "Clear the terminal output",
	home: "Go back to the initial terminal view",
};
