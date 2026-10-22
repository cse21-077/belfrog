declare global {
	namespace App {
		interface Locals {
			admin: { id: string; email: string; name: string } | null;
		}
	}
}

export {};
