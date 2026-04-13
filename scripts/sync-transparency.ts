import { promises as fs } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(__dirname, '..')
const SRC = path.join(ROOT, 'content', 'transparency', 'canaries')
const DEST = path.join(ROOT, 'public', 'transparency')

async function main() {
  await fs.mkdir(DEST, { recursive: true })

  const entries = await fs.readdir(SRC, { withFileTypes: true })
  const files = entries.filter((e) => e.isFile() && !e.name.startsWith('.'))

  if (files.length === 0) {
    console.warn('sync-transparency: no canary files found in', SRC)
    return
  }

  for (const file of files) {
    const srcPath = path.join(SRC, file.name)
    const destName = /^\d{4}-\d{2}\.txt(\.asc)?$/.test(file.name)
      ? `canary-${file.name}`
      : file.name
    const destPath = path.join(DEST, destName)
    await fs.copyFile(srcPath, destPath)
    console.log(`sync-transparency: ${file.name} -> public/transparency/${destName}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
