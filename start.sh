sh -c "bun run bot/index.ts" &
sh -c "cd web; bunx vite dev --port 8085 --host 0.0.0.0" &
