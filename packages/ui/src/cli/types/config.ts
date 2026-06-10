import { z } from 'zod';

export const configSchema = z.object({
  typescript: z.boolean().default(true),
  aliases: z.object({
    components: z.string().default('@/components/dfl'),
    hooks: z.string().default('@/hooks'),
    providers: z.string().default('@/providers'),
    pages: z.string().default('@/pages'),
  }),
  registry: z.string().default('https://raw.githubusercontent.com/taigfs/dfl-components-cli/main/registry'),
});

export type Config = z.infer<typeof configSchema>;
